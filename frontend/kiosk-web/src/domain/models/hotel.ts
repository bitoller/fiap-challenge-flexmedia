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
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  surfaceColor: string;
  textColor: string;
  logoUrl: string;
  activePresetId: string;
  presets: BrandingPreset[];
}

export interface BrandingPreset {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  surfaceColor: string;
  textColor: string;
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
