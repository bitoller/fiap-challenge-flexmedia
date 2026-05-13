import { ReactNode } from "react";
import { Footer } from "../../../components/common/Footer";
import { Header } from "../../../components/common/Header";
import { useLanguage } from "../../../hooks/useLanguage";

interface CheckoutFlowLayoutProps {
  children: ReactNode;
  className?: string;
}

export function CheckoutFlowLayout({ children, className = "" }: CheckoutFlowLayoutProps) {
  const { currentLanguage, changeLanguage } = useLanguage();

  return (
    <div className={`checkout-layout ${className}`.trim()}>
      <Header currentLanguage={currentLanguage} onLanguageChange={changeLanguage} />
      <main className="checkout-layout__main">{children}</main>
      <Footer />
    </div>
  );
}
