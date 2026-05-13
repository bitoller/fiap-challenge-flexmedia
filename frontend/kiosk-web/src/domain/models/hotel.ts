export interface HotelSummary {
  id: number;
  name: string;
  ownerName: string;
  active: boolean;
}

export interface HotelPromotion {
  title: string;
  description: string;
  active: boolean;
  order: number;
}

export interface HotelBranding {
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  welcomeHeadline: string;
  welcomeSubheadline: string;
}

export interface HotelContent {
  languageDefault: string;
  supportedLanguages: string[];
  promotions: HotelPromotion[];
  amenities: string[];
  mapUrl: string;
  supportMessage: string;
}

export interface HotelProfile extends HotelSummary {
  timezone: string;
  checkinTime: string;
  checkoutTime: string;
  earlyCheckinMinutes: number;
  lateCheckoutMinutes: number;
  branding: HotelBranding;
  content: HotelContent;
  createdAt: string;
  updatedAt: string;
}
