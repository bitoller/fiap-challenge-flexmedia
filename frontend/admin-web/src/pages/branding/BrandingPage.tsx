import type { Dispatch, SetStateAction } from "react";
import type { HotelProfile } from "../../types";

type BrandingPageProps = {
  hotelProfile: HotelProfile | null;
  emptyState: string;
  saveBrandingLabel: string;
  saveContentLabel: string;
  setHotelProfile: Dispatch<SetStateAction<HotelProfile | null>>;
  onSaveBranding: () => void;
  onSaveContent: () => void;
};

function BrandingPage({
  hotelProfile,
  emptyState,
  saveBrandingLabel,
  saveContentLabel,
  setHotelProfile,
  onSaveBranding,
  onSaveContent,
}: BrandingPageProps) {
  if (!hotelProfile) {
    return (
      <section className="admin-panel">
        <div className="admin-card">
          <h2>Branding</h2>
          <p className="admin-empty">{emptyState}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-panel admin-panel--two">
      <div className="admin-card">
        <h2>Branding</h2>
        <label><span>Welcome headline</span><input value={hotelProfile.branding.welcomeHeadline} onChange={(event) => setHotelProfile({ ...hotelProfile, branding: { ...hotelProfile.branding, welcomeHeadline: event.target.value } })} /></label>
        <label><span>Welcome subheadline</span><input value={hotelProfile.branding.welcomeSubheadline} onChange={(event) => setHotelProfile({ ...hotelProfile, branding: { ...hotelProfile.branding, welcomeSubheadline: event.target.value } })} /></label>
        <label><span>Primary color</span><input value={hotelProfile.branding.primaryColor} onChange={(event) => setHotelProfile({ ...hotelProfile, branding: { ...hotelProfile.branding, primaryColor: event.target.value } })} /></label>
        <label><span>Accent color</span><input value={hotelProfile.branding.accentColor} onChange={(event) => setHotelProfile({ ...hotelProfile, branding: { ...hotelProfile.branding, accentColor: event.target.value } })} /></label>
        <button className="admin-primary-button" onClick={onSaveBranding}>{saveBrandingLabel}</button>
      </div>
      <div className="admin-card">
        <h2>Content</h2>
        <label><span>Support message</span><textarea value={hotelProfile.content.supportMessage} onChange={(event) => setHotelProfile({ ...hotelProfile, content: { ...hotelProfile.content, supportMessage: event.target.value } })} /></label>
        <label><span>Map URL</span><input value={hotelProfile.content.mapUrl} onChange={(event) => setHotelProfile({ ...hotelProfile, content: { ...hotelProfile.content, mapUrl: event.target.value } })} /></label>
        <button className="admin-primary-button" onClick={onSaveContent}>{saveContentLabel}</button>
      </div>
    </section>
  );
}

export default BrandingPage;
