import type { ReactNode, SVGProps } from "react";

type AdminIconName = "overview" | "reservations" | "devices" | "audit" | "branding" | "logout" | "refresh" | "shield" | "spark";

type AdminIconProps = SVGProps<SVGSVGElement> & {
  name: AdminIconName;
};

const paths: Record<AdminIconName, ReactNode> = {
  overview: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  reservations: <><path d="M5 4h14a2 2 0 0 1 2 2v4H3V6a2 2 0 0 1 2-2Z" /><path d="M3 10h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8Z" /><path d="M7 14h5M7 17h3" /></>,
  devices: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 7h6M8 17h8M12 17v.01" /></>,
  audit: <><path d="M5 3h10l4 4v14H5z" /><path d="M15 3v5h5M8 12h8M8 16h6" /></>,
  branding: <><path d="M12 3a9 9 0 1 0 9 9c0-1.1-.9-2-2-2h-1.5a1.5 1.5 0 0 1 0-3H19a2 2 0 0 0-2-2h-1" /><circle cx="7.5" cy="10" r=".6" fill="currentColor" stroke="none" /><circle cx="10" cy="7" r=".6" fill="currentColor" stroke="none" /><circle cx="14" cy="7" r=".6" fill="currentColor" stroke="none" /></>,
  logout: <><path d="M10 17l5-5-5-5" /><path d="M15 12H3" /><path d="M21 19V5a2 2 0 0 0-2-2h-5" /></>,
  refresh: <><path d="M20 11a8 8 0 0 0-14.9-3M4 4v4h4" /><path d="M4 13a8 8 0 0 0 14.9 3M20 20v-4h-4" /></>,
  shield: <><path d="M12 3 5 6v5c0 4.5 3 8.6 7 10 4-1.4 7-5.5 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></>,
  spark: <><path d="m12 3-1.4 5.6L5 10l5.6 1.4L12 17l1.4-5.6L19 10l-5.6-1.4L12 3Z" /><path d="m19 16-.6 2.4L16 19l2.4.6L19 22l.6-2.4L22 19l-2.4-.6L19 16Z" /></>,
};

function AdminIcon({ name, ...props }: AdminIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      {paths[name]}
    </svg>
  );
}

export default AdminIcon;
