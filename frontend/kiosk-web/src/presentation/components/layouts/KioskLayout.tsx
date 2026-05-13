import React from "react";
import { Header } from "../common/Header";
import { Footer } from "../common/Footer";
import { useLanguage } from "../../hooks/useLanguage";

interface KioskLayoutProps {
  children: React.ReactNode;
}

export const KioskLayout: React.FC<KioskLayoutProps> = ({ children }) => {
  const { currentLanguage, changeLanguage } = useLanguage();

  return (
    <div className="kiosk-layout">
      <Header currentLanguage={currentLanguage} onLanguageChange={changeLanguage} />
      <main className="kiosk-main">{children}</main>
      <Footer />
    </div>
  );
};
