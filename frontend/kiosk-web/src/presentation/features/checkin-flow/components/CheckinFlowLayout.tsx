import { ReactNode } from "react";
import { KioskLayout } from "../../../components/layouts/KioskLayout";

interface CheckinFlowLayoutProps {
  children: ReactNode;
  className?: string;
}

export function CheckinFlowLayout({ children, className = "" }: CheckinFlowLayoutProps) {
  return (
    <KioskLayout>
      <section className={`checkin-layout__main ${className}`.trim()}>{children}</section>
    </KioskLayout>
  );
}
