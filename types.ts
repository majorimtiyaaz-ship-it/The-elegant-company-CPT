export enum View {
  HOME = 'HOME',
  PORTFOLIO = 'PORTFOLIO',
  CONTACT = 'CONTACT'
}

export interface DesignConcept {
  description: string;
  imageUrl?: string;
}

export interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  materials: string;
  description: string;
  woodFinish?: string;
}