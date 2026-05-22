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

function hexToRgb(hex: string) {
  const normalized = hex.trim().replace("#", "");
  const value = normalized.length === 3
    ? normalized
        .split("")
        .map((char) => `${char}${char}`)
        .join("")
    : normalized;

  if (!/^[0-9a-fA-F]{6}$/.test(value)) {
    return { r: 0, g: 0, b: 0 };
  }

  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  };
}

function hexToRgbTriplet(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return `${r}, ${g}, ${b}`;
}

function blendHexColors(baseHex: string, mixHex: string, ratio: number) {
  const base = hexToRgb(baseHex);
  const mix = hexToRgb(mixHex);
  const next = (start: number, end: number) => Math.round(start * (1 - ratio) + end * ratio);
  return `rgb(${next(base.r, mix.r)} ${next(base.g, mix.g)} ${next(base.b, mix.b)})`;
}

function withAlpha(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function resolveBranding(profile: HotelProfile) {
  const preset = profile.branding.presets.find((item) => item.id === profile.branding.activePresetId);
  return preset ?? profile.branding;
}

function applyTheme(profile: HotelProfile) {
  const branding = resolveBranding(profile);
  const root = document.documentElement;
  root.style.setProperty("--kiosk-primary", branding.primaryColor);
  root.style.setProperty("--kiosk-primary-rgb", hexToRgbTriplet(branding.primaryColor));
  root.style.setProperty("--kiosk-primary-light", branding.primaryColor);
  root.style.setProperty("--kiosk-primary-dark", branding.accentColor);
  root.style.setProperty("--kiosk-bg-light", branding.secondaryColor);
  root.style.setProperty("--kiosk-text-primary", branding.textColor);
  root.style.setProperty("--kiosk-text-rgb", hexToRgbTriplet(branding.textColor));
  root.style.setProperty("--kiosk-text-secondary", blendHexColors(branding.textColor, branding.surfaceColor, 0.48));
  root.style.setProperty("--kiosk-accent", branding.accentColor);
  root.style.setProperty("--kiosk-accent-rgb", hexToRgbTriplet(branding.accentColor));
  root.style.setProperty("--kiosk-accent-light", branding.accentColor);
  root.style.setProperty("--kiosk-shell-brand", profile.name);
  root.style.setProperty("--kiosk-surface", branding.surfaceColor);
  root.style.setProperty("--kiosk-surface-soft", blendHexColors(branding.surfaceColor, branding.secondaryColor, 0.12));
  root.style.setProperty("--kiosk-surface-strong", blendHexColors(branding.surfaceColor, branding.primaryColor, 0.08));
  root.style.setProperty("--kiosk-surface-overlay", withAlpha(branding.surfaceColor, 0.9));
  root.style.setProperty("--kiosk-surface-overlay-strong", withAlpha(branding.surfaceColor, 0.98));
  root.style.setProperty("--kiosk-border-soft", withAlpha(branding.primaryColor, 0.18));
  root.style.setProperty("--kiosk-border", withAlpha(branding.primaryColor, 0.28));
  root.style.setProperty("--kiosk-border-strong", withAlpha(branding.primaryColor, 0.44));
  root.style.setProperty("--kiosk-border-contrast", withAlpha(branding.primaryColor, 0.12));
  root.style.setProperty("--kiosk-border-contrast-strong", withAlpha(branding.primaryColor, 0.22));
  root.style.setProperty("--kiosk-muted-line", withAlpha(branding.primaryColor, 0.26));
  root.style.setProperty("--kiosk-muted-line-strong", withAlpha(branding.primaryColor, 0.42));
  root.style.setProperty("--kiosk-shadow-rgb", hexToRgbTriplet(branding.textColor));
  root.style.setProperty("--kiosk-page-glow", withAlpha(branding.primaryColor, 0.08));
  root.style.setProperty("--kiosk-page-glow-strong", withAlpha(branding.primaryColor, 0.14));
  root.style.setProperty("--kiosk-page-halo", withAlpha(branding.surfaceColor, 0.55));
  root.style.setProperty("--kiosk-page-halo-strong", withAlpha(branding.surfaceColor, 0.2));
  root.style.setProperty("--kiosk-inset-highlight", withAlpha(branding.surfaceColor, 0.95));
  root.style.setProperty("--kiosk-inset-highlight-soft", withAlpha(branding.surfaceColor, 0.72));
  root.style.setProperty("--kiosk-button-fill", `linear-gradient(180deg, ${blendHexColors(branding.primaryColor, branding.surfaceColor, 0.18)}, ${blendHexColors(branding.accentColor, branding.surfaceColor, 0.08)})`);
  root.style.setProperty("--kiosk-button-fill-soft", `linear-gradient(180deg, ${blendHexColors(branding.surfaceColor, branding.secondaryColor, 0.05)}, ${blendHexColors(branding.surfaceColor, branding.secondaryColor, 0.16)})`);
  root.style.setProperty("--kiosk-button-text", branding.surfaceColor);
  root.style.setProperty("--kiosk-button-text-strong", branding.textColor);
  root.style.setProperty("--kiosk-button-outline", withAlpha(branding.primaryColor, 0.5));
  root.style.setProperty("--kiosk-highlight", blendHexColors(branding.primaryColor, branding.accentColor, 0.45));
  root.style.setProperty("--kiosk-ink-muted", blendHexColors(branding.textColor, branding.surfaceColor, 0.58));
  root.style.setProperty("--kiosk-ink-soft", blendHexColors(branding.textColor, branding.surfaceColor, 0.42));
  root.style.setProperty("--kiosk-ink-strong", branding.textColor);
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
