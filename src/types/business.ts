export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  tiktok?: string;
  telegram?: string;
}

export interface OpeningHours {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

export interface BusinessInfo {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  whatsappNumber: string;
  phone?: string;
  email?: string;
  address: string;
  municipality: string;
  city: string;
  logoUrl?: string;
  coverImageUrl?: string;
  socialLinks: SocialLinks;
  openingHours: OpeningHours[];
}
