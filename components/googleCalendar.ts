import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User, signOut } from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App gracefully
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/calendar.events');

let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to obtain Google OAuth access token');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign-In Error:', error instanceof Error ? error.message : String(error));
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const setAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

export const googleSignOut = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

interface CreateEventParams {
  projectType: string;
  dateTime: string;
  clientName: string;
  clientEmail: string;
  budget?: string;
  stylePreferences?: string;
}

export const bookGoogleCalendarConsultation = async (
  params: CreateEventParams,
  token: string
): Promise<{ success: boolean; eventId?: string; error?: string }> => {
  try {
    const startDate = new Date(params.dateTime);
    if (isNaN(startDate.getTime())) {
      throw new Error('The requested meeting date/time syntax is invalid.');
    }
    
    // Appointment Duration: 1 hour
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

    const descriptionText = `
🏠 The Elegant Company - Consultation Specification

Client Name: ${params.clientName}
Client Email: ${params.clientEmail}
Project Type: ${params.projectType}
Style Preference: ${params.stylePreferences || 'Not specified'}
Investment Budget: ${params.budget || 'Not specified'}

This consultation has been secured in real-time. A dedicated design representative from our studio will contact you.
    `.trim();

    const event = {
      summary: `The Elegant Company Consultation: ${params.projectType}`,
      description: descriptionText,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Africa/Johannesburg'
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Africa/Johannesburg'
      },
      attendees: [
        { email: params.clientEmail, displayName: params.clientName }
      ],
      reminders: {
        useDefault: true
      }
    };

    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?sendUpdates=all', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Calendar Booking API Failed:', errorText);
      return { success: false, error: response.statusText || 'Google Calendar API error' };
    }

    const data = await response.json();
    return { success: true, eventId: data.id };
  } catch (err: any) {
    console.error('Failed booking calendar slot:', err instanceof Error ? err.message : String(err));
    return { success: false, error: err.message || 'An unexpected error occurred during booking.' };
  }
};
