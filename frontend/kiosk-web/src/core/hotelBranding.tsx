import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { HotelProfile } from "../domain/models";
import { hotelRepository } from "../data/repositories/hotelRepository";

type HotelBrandingContextValue = {
  hotel: HotelProfile;
  isLoading: boolean;
  refreshHotel: () => Promise<void>;
};

const HotelBrandingContext = createContext<HotelBrandingContextValue | undefined>(undefined);

const FALLBACK_HOTEL = hotelRepository.getDefaultProfile();

function applyTheme(profile: HotelProfile) {
  const root = document.documentElement;
  root.style.setProperty("--kiosk-primary", profile.branding.primaryColor);
  root.style.setProperty("--kiosk-primary-light", profile.branding.primaryColor);
  root.style.setProperty("--kiosk-primary-dark", profile.branding.accentColor);
  root.style.setProperty("--kiosk-bg-light", profile.branding.secondaryColor);
  root.style.setProperty("--kiosk-text-primary", "#2c2416");
  root.style.setProperty("--kiosk-text-secondary", "#6f6558");
  root.style.setProperty("--kiosk-accent", profile.branding.accentColor);
  root.style.setProperty("--kiosk-accent-light", profile.branding.accentColor);
  root.style.setProperty("--kiosk-shell-brand", profile.name);
}

export function HotelBrandingProvider({ children }: { children: React.ReactNode }) {
  const [hotel, setHotel] = useState<HotelProfile>(FALLBACK_HOTEL);
  const [isLoading, setIsLoading] = useState(true);

  const refreshHotel = useCallback(async () => {
    setIsLoading(true);

    try {
      const profile = await hotelRepository.getActiveHotelProfile();
      setHotel(profile);
      applyTheme(profile);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshHotel();
  }, [refreshHotel]);

  useEffect(() => {
    applyTheme(hotel);
  }, [hotel]);

  const value = useMemo<HotelBrandingContextValue>(
    () => ({
      hotel,
      isLoading,
      refreshHotel,
    }),
    [hotel, isLoading, refreshHotel]
  );

  return <HotelBrandingContext.Provider value={value}>{children}</HotelBrandingContext.Provider>;
}

export function useHotelBranding() {
  const context = useContext(HotelBrandingContext);

  if (!context) {
    return {
      hotel: FALLBACK_HOTEL,
      isLoading: false,
      refreshHotel: async () => undefined,
    } satisfies HotelBrandingContextValue;
  }

  return context;
}
