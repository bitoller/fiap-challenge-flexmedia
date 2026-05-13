import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from "../i18n/config";
import { HotelBrandingProvider } from "./hotelBranding";

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <I18nextProvider i18n={i18n}>
      <HotelBrandingProvider>
        <Router>{children}</Router>
      </HotelBrandingProvider>
    </I18nextProvider>
  );
};
