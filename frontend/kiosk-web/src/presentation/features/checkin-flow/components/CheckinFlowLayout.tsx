import { ReactNode } from "react";
import { KioskLayout } from "../../../components/layouts/KioskLayout";

interface CheckinFlowLayoutProps {
  children: ReactNode;
  topRightContent?: ReactNode;
  bottomItems?: Array<unknown>;
  className?: string;
}

export function CheckinFlowLayout({ children }: CheckinFlowLayoutProps) {
  return (
    <KioskLayout>
      <section className="checkin-layout__main">{children}</section>
    </KioskLayout>
  );
}
