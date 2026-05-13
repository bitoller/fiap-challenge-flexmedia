import { ApiError, TimeoutError } from "../../domain/errors";
import { HotelProfile, HotelSummary } from "../../domain/models";
import { KIOSK_CONFIG } from "../../core/constants";
import { apiGet } from "../api/client";
import { API_ENDPOINTS, buildUrl } from "../api/endpoints";

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true";

const DEFAULT_HOTEL_PROFILE: HotelProfile = {
  id: KIOSK_CONFIG.ACTIVE_HOTEL_ID,
  name: "LUXE GRAND HOTEL",
  ownerName: "FlexMedia",
  active: true,
  timezone: "America/Sao_Paulo",
  checkinTime: "14:00",
  checkoutTime: "12:00",
  earlyCheckinMinutes: 120,
  lateCheckoutMinutes: 60,
  branding: {
    logoUrl: "",
    primaryColor: "#b8860b",
    secondaryColor: "#faf8f3",
    accentColor: "#8b7355",
    welcomeHeadline: "Welcome Home",
    welcomeSubheadline: "Select an option to begin",
  },
  content: {
    languageDefault: "en",
    supportedLanguages: ["en", "pt-BR", "es"],
    promotions: [],
    amenities: [],
    mapUrl: "",
    supportMessage: "Need help? Please use the concierge area.",
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

function coalesceString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

function toNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function toBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function normalizeHotelSummary(data: any): HotelSummary {
  return {
    id: toNumber(data?.id, DEFAULT_HOTEL_PROFILE.id),
    name: coalesceString(data?.name, DEFAULT_HOTEL_PROFILE.name),
    ownerName: coalesceString(data?.ownerName, DEFAULT_HOTEL_PROFILE.ownerName),
    active: toBoolean(data?.active, DEFAULT_HOTEL_PROFILE.active),
  };
}

function normalizeHotelProfile(data: any): HotelProfile {
  const summary = normalizeHotelSummary(data);

  return {
    ...summary,
    timezone: coalesceString(data?.timezone, DEFAULT_HOTEL_PROFILE.timezone),
    checkinTime: coalesceString(data?.checkinTime, DEFAULT_HOTEL_PROFILE.checkinTime),
    checkoutTime: coalesceString(data?.checkoutTime, DEFAULT_HOTEL_PROFILE.checkoutTime),
    earlyCheckinMinutes: toNumber(data?.earlyCheckinMinutes, DEFAULT_HOTEL_PROFILE.earlyCheckinMinutes),
    lateCheckoutMinutes: toNumber(data?.lateCheckoutMinutes, DEFAULT_HOTEL_PROFILE.lateCheckoutMinutes),
    branding: {
      logoUrl: coalesceString(data?.branding?.logoUrl, DEFAULT_HOTEL_PROFILE.branding.logoUrl),
      primaryColor: coalesceString(data?.branding?.primaryColor, DEFAULT_HOTEL_PROFILE.branding.primaryColor),
      secondaryColor: coalesceString(data?.branding?.secondaryColor, DEFAULT_HOTEL_PROFILE.branding.secondaryColor),
      accentColor: coalesceString(data?.branding?.accentColor, DEFAULT_HOTEL_PROFILE.branding.accentColor),
      welcomeHeadline: coalesceString(data?.branding?.welcomeHeadline, DEFAULT_HOTEL_PROFILE.branding.welcomeHeadline),
      welcomeSubheadline: coalesceString(data?.branding?.welcomeSubheadline, DEFAULT_HOTEL_PROFILE.branding.welcomeSubheadline),
    },
    content: {
      languageDefault: coalesceString(data?.content?.languageDefault, DEFAULT_HOTEL_PROFILE.content.languageDefault),
      supportedLanguages: Array.isArray(data?.content?.supportedLanguages) && data.content.supportedLanguages.length > 0
        ? data.content.supportedLanguages.filter((language: unknown) => typeof language === "string")
        : DEFAULT_HOTEL_PROFILE.content.supportedLanguages,
      promotions: Array.isArray(data?.content?.promotions)
        ? data.content.promotions.map((promotion: any, index: number) => ({
            title: coalesceString(promotion?.title, `Promotion ${index + 1}`),
            description: coalesceString(promotion?.description, ""),
            active: toBoolean(promotion?.active, true),
            order: toNumber(promotion?.order, index + 1),
          }))
        : DEFAULT_HOTEL_PROFILE.content.promotions,
      amenities: Array.isArray(data?.content?.amenities)
        ? data.content.amenities.filter((amenity: unknown) => typeof amenity === "string")
        : DEFAULT_HOTEL_PROFILE.content.amenities,
      mapUrl: coalesceString(data?.content?.mapUrl, DEFAULT_HOTEL_PROFILE.content.mapUrl),
      supportMessage: coalesceString(data?.content?.supportMessage, DEFAULT_HOTEL_PROFILE.content.supportMessage),
    },
    createdAt: coalesceString(data?.createdAt, DEFAULT_HOTEL_PROFILE.createdAt),
    updatedAt: coalesceString(data?.updatedAt, DEFAULT_HOTEL_PROFILE.updatedAt),
  };
}

function getActiveHotelId(): number {
  return Number(import.meta.env.VITE_ACTIVE_HOTEL_ID || KIOSK_CONFIG.ACTIVE_HOTEL_ID || DEFAULT_HOTEL_PROFILE.id);
}

export const hotelRepository = {
  getDefaultProfile(): HotelProfile {
    return DEFAULT_HOTEL_PROFILE;
  },

  async getActiveHotelProfile(): Promise<HotelProfile> {
    const hotelId = getActiveHotelId();

    try {
      const response = await apiGet<any>(buildUrl(API_ENDPOINTS.ADMIN_HOTEL_PROFILE(hotelId)));
      return normalizeHotelProfile(response);
    } catch (error) {
      if (error instanceof TimeoutError || USE_MOCKS) {
        return DEFAULT_HOTEL_PROFILE;
      }

      if (error instanceof ApiError && error.code === "NOT_FOUND") {
        return DEFAULT_HOTEL_PROFILE;
      }

      throw error;
    }
  },

  async listHotels(): Promise<HotelSummary[]> {
    try {
      const response = await apiGet<any>(buildUrl(API_ENDPOINTS.ADMIN_HOTELS));
      const hotels = Array.isArray(response) ? response : [];
      return hotels.map(normalizeHotelSummary);
    } catch (error) {
      if (error instanceof TimeoutError || USE_MOCKS) {
        return [normalizeHotelSummary(DEFAULT_HOTEL_PROFILE)];
      }

      throw error;
    }
  },
};
