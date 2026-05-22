import { Dispatch, SetStateAction, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { AdminCopy } from "../../admin/copy";
import type { BrandingPreset, HotelProfile } from "../../types";

type BrandingPageProps = {
  hotelProfile: HotelProfile | null;
  copy: AdminCopy["brandingPage"];
  emptyState: string;
  setHotelProfile: Dispatch<SetStateAction<HotelProfile | null>>;
  onSaveBranding: (branding?: HotelProfile["branding"]) => void;
  onSaveContent: () => void;
};

type BrandingField = "primaryColor" | "secondaryColor" | "accentColor" | "surfaceColor" | "textColor";

const LOCKED_PRESET_IDS = new Set(["original", "flexmedia"]);

const EMPTY_PRESET: BrandingPreset = {
  id: "",
  name: "",
  primaryColor: "#1f2937",
  secondaryColor: "#f8fafc",
  accentColor: "#f59e0b",
  surfaceColor: "#ffffff",
  textColor: "#1f2937",
};

function createPresetId(name: string) {
  return `${name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") || "preset"}-${Date.now().toString(36)}`;
}

function getThemeForPreview(branding: HotelProfile["branding"], copy: AdminCopy["brandingPage"]): BrandingPreset {
  const preset = branding.presets.find((item) => item.id === branding.activePresetId);
  if (preset) return preset;

  return {
    id: branding.activePresetId || "custom",
    name: branding.activePresetId ? copy.appliedPreset : copy.customTheme,
    primaryColor: branding.primaryColor,
    secondaryColor: branding.secondaryColor,
    accentColor: branding.accentColor,
    surfaceColor: branding.surfaceColor,
    textColor: branding.textColor,
  };
}

function updateBranding(
  hotelProfile: HotelProfile,
  setHotelProfile: Dispatch<SetStateAction<HotelProfile | null>>,
  field: BrandingField,
  value: string
) {
  setHotelProfile({
    ...hotelProfile,
    branding: {
      ...hotelProfile.branding,
      [field]: value,
      activePresetId: "",
    },
  });
}

function BrandingPage({
  hotelProfile,
  copy,
  emptyState,
  setHotelProfile,
  onSaveBranding,
}: BrandingPageProps) {
  const [presetName, setPresetName] = useState("");

  const previewTheme = useMemo(() => (hotelProfile ? getThemeForPreview(hotelProfile.branding, copy) : null), [copy, hotelProfile]);

  if (!hotelProfile) {
    return (
      <section className="admin-panel">
        <div className="admin-card">
          <h2>{copy.title}</h2>
          <p className="admin-empty">{emptyState}</p>
        </div>
      </section>
    );
  }

  const theme = previewTheme ?? EMPTY_PRESET;
  const previewStyle = {
    "--preview-primary": theme.primaryColor,
    "--preview-secondary": theme.secondaryColor,
    "--preview-accent": theme.accentColor,
    "--preview-surface": theme.surfaceColor,
    "--preview-text": theme.textColor,
  } as CSSProperties & Record<string, string>;

  const persistBranding = () => {
    onSaveBranding(hotelProfile.branding);
  };

  const saveCurrentAsPreset = () => {
    const name = presetName.trim() || copy.customTheme;
    const nextPreset: BrandingPreset = {
      id: createPresetId(name),
      name,
      primaryColor: hotelProfile.branding.primaryColor,
      secondaryColor: hotelProfile.branding.secondaryColor,
      accentColor: hotelProfile.branding.accentColor,
      surfaceColor: hotelProfile.branding.surfaceColor,
      textColor: hotelProfile.branding.textColor,
    };

    const presets = [nextPreset, ...hotelProfile.branding.presets.filter((preset) => preset.id !== nextPreset.id)];
    const branding = {
      ...hotelProfile.branding,
      presets,
      activePresetId: nextPreset.id,
    };

    setHotelProfile({
      ...hotelProfile,
      branding,
    });
    onSaveBranding(branding);
    setPresetName("");
  };

  const applyPresetAndPersist = (preset: BrandingPreset) => {
    const branding = {
      ...hotelProfile.branding,
      primaryColor: preset.primaryColor,
      secondaryColor: preset.secondaryColor,
      accentColor: preset.accentColor,
      surfaceColor: preset.surfaceColor,
      textColor: preset.textColor,
      activePresetId: preset.id,
    };

    setHotelProfile({
      ...hotelProfile,
      branding,
    });
    onSaveBranding(branding);
  };

  const removePreset = (presetId: string) => {
    const presets = hotelProfile.branding.presets.filter((preset) => preset.id !== presetId);
    const activePresetId = hotelProfile.branding.activePresetId === presetId ? "" : hotelProfile.branding.activePresetId;
    const branding = {
      ...hotelProfile.branding,
      presets,
      activePresetId,
    };

    setHotelProfile({
      ...hotelProfile,
      branding,
    });
    onSaveBranding(branding);
  };

  return (
    <section className="branding-workbench">
      <div className="branding-workbench__editor">
        <div className="admin-card branding-panel">
          <div className="admin-card__head branding-panel__head">
            <div>
              <p className="admin-overview-kicker">{copy.titleKicker}</p>
              <h2>{copy.title}</h2>
              <p className="admin-copy admin-copy--compact">{copy.intro}</p>
            </div>
            <button className="admin-primary-button branding-save-button" type="button" onClick={persistBranding}>
              {copy.saveBranding}
            </button>
          </div>

          <div className="branding-section-label">
            <strong>{copy.presetsTitle}</strong>
            <p>{copy.presetsIntro}</p>
          </div>

          <div className="branding-preset-list branding-preset-list--grid">
            {hotelProfile.branding.presets.length === 0 ? <p className="admin-empty">{copy.noPresets}</p> : null}
            {hotelProfile.branding.presets.map((preset) => {
              const isActive = hotelProfile.branding.activePresetId === preset.id;
              const isLocked = LOCKED_PRESET_IDS.has(preset.id.toLowerCase());

              return (
                <article key={preset.id} className={`branding-preset-card ${isActive ? "is-active" : ""}`}>
                  <div className="branding-preset-card__swatch" aria-hidden="true">
                    <span style={{ backgroundColor: preset.primaryColor }} />
                    <span style={{ backgroundColor: preset.secondaryColor }} />
                    <span style={{ backgroundColor: preset.accentColor }} />
                    <span style={{ backgroundColor: preset.surfaceColor }} />
                  </div>
                  <div className="branding-preset-card__body">
                    <div className="branding-preset-card__meta">
                      <div>
                        <div className="branding-preset-card__title-row">
                          <strong>{preset.name}</strong>
                          {isActive ? <span className="branding-preset-card__badge">{copy.active}</span> : null}
                        </div>
                        <p>
                          {preset.primaryColor} | {preset.secondaryColor} | {preset.accentColor}
                        </p>
                      </div>
                    </div>
                    <div className="branding-preset-card__actions">
                      <button className="admin-secondary-button" type="button" onClick={() => applyPresetAndPersist(preset)}>
                        {copy.apply}
                      </button>
                      {!isLocked ? (
                        <button className="admin-danger-button" type="button" onClick={() => removePreset(preset.id)}>
                          {copy.remove}
                        </button>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="branding-preset-builder branding-preset-builder--stacked">
            <label className="branding-field">
              <span>{copy.saveCurrentAsPresetLabel}</span>
              <input
                value={presetName}
                onChange={(event) => setPresetName(event.target.value)}
                placeholder={copy.presetNamePlaceholder}
              />
            </label>
            <button className="admin-secondary-button" type="button" onClick={saveCurrentAsPreset}>
              {copy.savePreset}
            </button>
          </div>
        </div>

        <div className="admin-card branding-panel">
          <div className="admin-card__head">
            <div>
              <p className="admin-overview-kicker">{copy.colorsKicker}</p>
              <h2>{copy.adjustIdentity}</h2>
              <p className="admin-copy admin-copy--compact">{copy.colorsIntro}</p>
            </div>
          </div>

          <div className="branding-color-grid">
            {(Object.keys(copy.fieldLabels) as BrandingField[]).map((field) => {
              const value = hotelProfile.branding[field];
              const label = copy.fieldLabels[field];
              const help = copy.fieldHelp[field];

              return (
                <label key={field} className="branding-color-control">
                  <div className="branding-color-control__header">
                    <div>
                      <span>{label}</span>
                      <p>{help}</p>
                    </div>
                    <strong>{value}</strong>
                  </div>
                  <div className="branding-color-control__picker-row">
                    <input
                      type="color"
                      value={value}
                      onChange={(event) => updateBranding(hotelProfile, setHotelProfile, field, event.target.value)}
                      aria-label={label}
                    />
                    <div className="branding-color-control__samples">
                      <span className="branding-color-control__sample" style={{ backgroundColor: value }} />
                      <div>
                        <small>{label}</small>
                        <p>{copy.fieldNotes.previewUpdates}</p>
                      </div>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      <aside className="branding-workbench__preview">
        <div className="admin-card branding-preview" style={previewStyle}>
          <div className="branding-preview__hero">
            <div className="branding-preview__brand" />
            <div className="branding-preview__copy">
              <p className="branding-preview__eyebrow">{copy.livePreview}</p>
              <h3>{theme.name || copy.currentPalette}</h3>
              <p>{copy.previewNote}</p>
            </div>
          </div>

          <div className="branding-preview__visual" />

          <div className="branding-preview__swatches">
            {(Object.keys(copy.previewSwatches) as BrandingField[]).map((field) => (
              <article key={field} className="branding-preview__swatch">
                <span>{copy.previewSwatches[field]}</span>
                <strong>{hotelProfile.branding[field]}</strong>
              </article>
            ))}
          </div>

          <div className="branding-preview__footer">
            <p>{copy.previewFooter}</p>
          </div>
        </div>
      </aside>
    </section>
  );
}

export default BrandingPage;
