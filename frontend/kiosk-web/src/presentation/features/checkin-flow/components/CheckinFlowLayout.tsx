import { ReactNode } from "react";
import { CheckinBottomNavKey } from "../../../../domain/types";
import { FlowBottomNav } from "./FlowBottomNav";
import { FlowTopBar } from "./FlowTopBar";

interface BottomNavItem {
  key: CheckinBottomNavKey;
  label: string;
  icon: "home" | "assistant" | "emergency";
  active?: boolean;
  onClick?: () => void;
}

interface CheckinFlowLayoutProps {
  children: ReactNode;
  topRightContent: ReactNode;
  bottomItems: BottomNavItem[];
  className?: string;
}

export function CheckinFlowLayout({
  children,
  topRightContent,
  bottomItems,
  className = "",
}: CheckinFlowLayoutProps) {
  return (
    <div className={`checkin-layout ${className}`.trim()}>
      <FlowTopBar rightContent={topRightContent} />
      <main className="checkin-layout__main">{children}</main>
      <FlowBottomNav items={bottomItems} />
    </div>
  );
}
