import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Accessibility,
  Activity,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Compass,
  Dumbbell,
  House,
  MapPinned,
  Minus,
  PhoneCall,
  Plus,
  RotateCcw,
  Route,
  Sparkles,
  Soup,
  UtensilsCrossed,
  Waves,
  Wifi,
  X,
} from "lucide-react";
import { KioskLayout } from "../../../components/layouts/KioskLayout";
import { NumericKeypad } from "../../checkin-flow/components/NumericKeypad";
import { KIOSK_CONFIG } from "../../../../core/constants";
import { useHotelBranding } from "../../../../core/hotelBranding";
import { supportRepository } from "../../../../data/repositories/supportRepository";
import type { GuestServiceType } from "../../../../data/repositories/supportRepository";

type ServiceCardTone = "standard" | "soft" | "featured" | "dark";
type ServicesTab = "info" | "map";

type ServiceCard = {
  id: string;
  number: string;
  title: string;
  description: string;
  metaLabel: string;
  metaValue: string;
  icon: ReactNode;
  tone: ServiceCardTone;
};

type ServiceRequest = {
  id: string;
  type: GuestServiceType;
  title: string;
  description: string;
  eta: string;
  icon: ReactNode;
};

type ExperienceMoodId = "unwind" | "taste" | "move" | "discover";

type ExperienceMood = {
  id: ExperienceMoodId;
  label: string;
  title: string;
  description: string;
  meta: string;
  destinationId: string;
  icon: ReactNode;
};

type MapSpot = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  x: number;
  y: number;
  tone: "gold" | "soft" | "accent";
  level: string;
  eta: string;
  hint: string;
  routePath: string;
  floorStops: string[];
  steps: string[];
};

const MAP_VIEWBOX_WIDTH = 1000;
const MAP_VIEWBOX_HEIGHT = 760;

function ServiceIconShell({ children }: { children: ReactNode }) {
  return <span className="services-card__icon">{children}</span>;
}

export function ServicesPage() {
  const { t } = useTranslation("home");
  const navigate = useNavigate();
  const location = useLocation();
  const { hotel } = useHotelBranding();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") === "map" ? "map" : "info";
  const [activeTab, setActiveTab] = useState<ServicesTab>(initialTab);
  const [zoom, setZoom] = useState(1);
  const [selectedSpotId, setSelectedSpotId] = useState("spa");
  const [routeActive, setRouteActive] = useState(false);
  const [selectedMoodId, setSelectedMoodId] = useState<ExperienceMoodId>("unwind");
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [requestedServiceId, setRequestedServiceId] = useState<string | null>(null);
  const [requestState, setRequestState] = useState<"idle" | "sending" | "error">("idle");
  const [roomNumber, setRoomNumber] = useState("");
  const [isRoomNumberModalOpen, setIsRoomNumberModalOpen] = useState(false);
  const [roomNumberDraft, setRoomNumberDraft] = useState("");

  const setTab = (tab: ServicesTab) => {
    setActiveTab(tab);
    setSearchParams(tab === "map" ? { tab: "map" } : {}, { replace: true });
  };

  const services = useMemo<ServiceCard[]>(
    () => [
      {
        id: "breakfast",
        number: "01",
        title: t("servicesBreakfastTitle"),
        description: t("servicesBreakfastDescription"),
        metaLabel: t("servicesTimeLabel"),
        metaValue: t("servicesBreakfastHours"),
        icon: (
          <ServiceIconShell>
            <Soup size={20} strokeWidth={1.8} />
          </ServiceIconShell>
        ),
        tone: "standard",
      },
      {
        id: "wifi",
        number: "02",
        title: t("servicesWifiTitle"),
        description: t("servicesWifiDescription"),
        metaLabel: t("servicesWifiNetworkLabel"),
        metaValue: t("servicesWifiNetwork"),
        icon: (
          <ServiceIconShell>
            <Wifi size={20} strokeWidth={1.8} />
          </ServiceIconShell>
        ),
        tone: "soft",
      },
      {
        id: "pool",
        number: "03",
        title: t("servicesPoolTitle"),
        description: t("servicesPoolDescription"),
        metaLabel: t("servicesTimeLabel"),
        metaValue: t("servicesPoolHours"),
        icon: (
          <ServiceIconShell>
            <Waves size={20} strokeWidth={1.8} />
          </ServiceIconShell>
        ),
        tone: "standard",
      },
      {
        id: "wellness",
        number: "04",
        title: t("servicesWellnessTitle"),
        description: t("servicesWellnessDescription"),
        metaLabel: t("servicesStatusLabel"),
        metaValue: t("servicesWellnessStatus"),
        icon: (
          <ServiceIconShell>
            <Dumbbell size={20} strokeWidth={1.8} />
          </ServiceIconShell>
        ),
        tone: "standard",
      },
    ],
    [t]
  );

  const requests = useMemo<ServiceRequest[]>(
    () => [
      {
        id: "housekeeping",
        type: "HOUSEKEEPING",
        title: t("servicesRequestHousekeepingTitle"),
        description: t("servicesRequestHousekeepingDescription"),
        eta: t("servicesRequestHousekeepingEta"),
        icon: <House size={22} strokeWidth={1.8} />,
      },
      {
        id: "amenities",
        type: "AMENITIES",
        title: t("servicesRequestAmenitiesTitle"),
        description: t("servicesRequestAmenitiesDescription"),
        eta: t("servicesRequestAmenitiesEta"),
        icon: <Plus size={22} strokeWidth={1.8} />,
      },
      {
        id: "dining",
        type: "DINING",
        title: t("servicesRequestDiningTitle"),
        description: t("servicesRequestDiningDescription"),
        eta: t("servicesRequestDiningEta"),
        icon: <Soup size={22} strokeWidth={1.8} />,
      },
      {
        id: "concierge",
        type: "CONCIERGE",
        title: t("servicesRequestConciergeTitle"),
        description: t("servicesRequestConciergeDescription"),
        eta: t("servicesRequestConciergeEta"),
        icon: <PhoneCall size={22} strokeWidth={1.8} />,
      },
    ],
    [t]
  );

  const moods = useMemo<ExperienceMood[]>(
    () => [
      {
        id: "unwind",
        label: t("servicesMoodUnwindLabel"),
        title: t("servicesMoodUnwindTitle"),
        description: t("servicesMoodUnwindDescription"),
        meta: t("servicesMoodUnwindMeta"),
        destinationId: "spa",
        icon: <Sparkles size={20} strokeWidth={1.8} />,
      },
      {
        id: "taste",
        label: t("servicesMoodTasteLabel"),
        title: t("servicesMoodTasteTitle"),
        description: t("servicesMoodTasteDescription"),
        meta: t("servicesMoodTasteMeta"),
        destinationId: "restaurant",
        icon: <UtensilsCrossed size={20} strokeWidth={1.8} />,
      },
      {
        id: "move",
        label: t("servicesMoodMoveLabel"),
        title: t("servicesMoodMoveTitle"),
        description: t("servicesMoodMoveDescription"),
        meta: t("servicesMoodMoveMeta"),
        destinationId: "wellness",
        icon: <Activity size={20} strokeWidth={1.8} />,
      },
      {
        id: "discover",
        label: t("servicesMoodDiscoverLabel"),
        title: t("servicesMoodDiscoverTitle"),
        description: t("servicesMoodDiscoverDescription"),
        meta: t("servicesMoodDiscoverMeta"),
        destinationId: "pool",
        icon: <Compass size={20} strokeWidth={1.8} />,
      },
    ],
    [t]
  );

  const spots = useMemo<MapSpot[]>(
    () => [
      {
        id: "reception",
        title: t("mapReceptionTitle"),
        subtitle: t("mapReceptionSubtitle"),
        description: t("mapReceptionDescription"),
        x: 170,
        y: 155,
        tone: "gold",
        level: t("mapGroundFloor"),
        eta: t("mapNow"),
        hint: t("mapCurrentLocation"),
        routePath: "M170 155",
        floorStops: [t("mapGroundFloor")],
        steps: [t("mapReceptionStepOne"), t("mapReceptionStepTwo")],
      },
      {
        id: "spa",
        title: t("mapSpaTitle"),
        subtitle: t("mapSpaSubtitle"),
        description: t("mapSpaDescription"),
        x: 335,
        y: 155,
        tone: "accent",
        level: t("mapLevelFour"),
        eta: t("mapSevenMin"),
        hint: t("mapFocusHint"),
        routePath: "M170 155 L335 155",
        floorStops: [t("mapGroundFloor"), t("mapLift"), t("mapLevelFour")],
        steps: [t("mapSpaStepOne"), t("mapSpaStepTwo"), t("mapSpaStepThree")],
      },
      {
        id: "restaurant",
        title: t("mapRestaurantTitle"),
        subtitle: t("mapRestaurantSubtitle"),
        description: t("mapRestaurantDescription"),
        x: 170,
        y: 390,
        tone: "soft",
        level: t("mapGroundFloor"),
        eta: t("mapFourMin"),
        hint: t("mapDiningHint"),
        routePath: "M170 155 L170 390",
        floorStops: [t("mapGroundFloor")],
        steps: [t("mapRestaurantStepOne"), t("mapRestaurantStepTwo")],
      },
      {
        id: "wellness",
        title: t("mapWellnessTitle"),
        subtitle: t("mapWellnessSubtitle"),
        description: t("mapWellnessDescription"),
        x: 405,
        y: 390,
        tone: "gold",
        level: t("mapLevelOne"),
        eta: t("mapSixMin"),
        hint: t("mapWorkoutHint"),
        routePath: "M170 155 L170 390 L405 390",
        floorStops: [t("mapGroundFloor"), t("mapLevelOne")],
        steps: [t("mapWellnessStepOne"), t("mapWellnessStepTwo"), t("mapWellnessStepThree")],
      },
      {
        id: "pool",
        title: t("mapPoolTitle"),
        subtitle: t("mapPoolSubtitle"),
        description: t("mapPoolDescription"),
        x: 610,
        y: 190,
        tone: "accent",
        level: t("mapRooftop"),
        eta: t("mapEightMin"),
        hint: t("mapViewHint"),
        routePath: "M170 155 L320 155 L610 190",
        floorStops: [t("mapGroundFloor"), t("mapLift"), t("mapRooftop")],
        steps: [t("mapPoolStepOne"), t("mapPoolStepTwo"), t("mapPoolStepThree")],
      },
      {
        id: "rooms",
        title: t("mapRoomsTitle"),
        subtitle: t("mapRoomsSubtitle"),
        description: t("mapRoomsDescription"),
        x: 710,
        y: 410,
        tone: "soft",
        level: t("mapFloorsTwoToSix"),
        eta: t("mapTenMin"),
        hint: t("mapStayHint"),
        routePath: "M170 155 L320 155 L610 190 L710 410",
        floorStops: [t("mapGroundFloor"), t("mapLift"), t("mapFloorsTwoToSix")],
        steps: [t("mapRoomsStepOne"), t("mapRoomsStepTwo"), t("mapRoomsStepThree")],
      },
    ],
    [t]
  );

  const selectedSpot = spots.find((spot) => spot.id === selectedSpotId) ?? spots[0];
  const selectedMood = moods.find((mood) => mood.id === selectedMoodId) ?? moods[0];

  const zoomOut = () => setZoom((current) => Math.max(0.85, Number((current - 0.15).toFixed(2))));
  const zoomIn = () => setZoom((current) => Math.min(1.5, Number((current + 0.15).toFixed(2))));
  const resetZoom = () => setZoom(1);

  const selectMapSpot = (spotId: string) => {
    setSelectedSpotId(spotId);
    setRouteActive(false);
  };

  const openRoute = (spotId: string) => {
    setSelectedSpotId(spotId);
    setRouteActive(true);
    setTab("map");
  };

  const selectedRequest = requests.find((request) => request.id === selectedRequestId) ?? null;

  const selectRequest = (requestId: string) => {
    setSelectedRequestId(requestId);
    setRequestedServiceId(null);
    setRequestState("idle");
    setRoomNumber("");
    setRoomNumberDraft("");
    setIsRoomNumberModalOpen(true);
  };

  const confirmRequest = async () => {
    if (!selectedRequest || requestState === "sending") {
      return;
    }

    const normalizedRoomNumber = (roomNumberDraft || roomNumber).trim();
    if (!normalizedRoomNumber) {
      setRequestState("error");
      return;
    }

    setRequestState("sending");

    try {
      await supportRepository.requestGuestService({
        hotelId: hotel.id || KIOSK_CONFIG.ACTIVE_HOTEL_ID,
        route: `${location.pathname}${location.search}${location.hash}`,
        serviceType: selectedRequest.type,
        roomNumber: normalizedRoomNumber,
      });
      setRequestedServiceId(selectedRequest.id);
      setRequestState("idle");
      setIsRoomNumberModalOpen(false);
    } catch {
      setRequestState("error");
    }
  };

  const renderInfoContent = () => (
    <>
      <header className="services-header services-header--hub">
        <div className="services-header__copy">
          <p className="services-header__eyebrow">{t("servicesPageEyebrow")}</p>
          <h1 className="services-header__title">{t("servicesPageTitle")}</h1>
          <p className="services-header__subtitle">{t("servicesPageSubtitle", { hotelName: hotel.name })}</p>
        </div>
        <div className="services-header__status">
          <span className="services-header__status-dot" aria-hidden="true" />
          <span>{t("servicesReceptionStatus")}</span>
        </div>
        <span className="services-header__rule" aria-hidden="true" />
      </header>

      <section className="services-request-section" aria-labelledby="services-request-title">
        <div className="services-section-heading">
          <div>
            <p className="services-section-heading__eyebrow">{t("servicesRequestSectionEyebrow")}</p>
            <h2 id="services-request-title">{t("servicesRequestSectionTitle")}</h2>
          </div>
          <p>{t("servicesRequestSectionSubtitle")}</p>
        </div>

        <div className="services-request-grid">
          {requests.map((request) => {
            const isRequested = requestedServiceId === request.id;
            return (
              <button
                key={request.id}
                type="button"
                className={`services-request-card ${selectedRequestId === request.id ? "is-selected" : ""} ${isRequested ? "is-requested" : ""}`.trim()}
                aria-pressed={selectedRequestId === request.id}
                disabled={requestState === "sending"}
                onClick={() => selectRequest(request.id)}
              >
                <span className="services-request-card__top">
                  <span className="services-request-card__icon">{isRequested ? <CheckCircle2 size={22} strokeWidth={1.8} /> : request.icon}</span>
                  <span className="services-request-card__eta">{request.eta}</span>
                </span>
                <span className="services-request-card__body">
                  <strong>{request.title}</strong>
                  <span>{request.description}</span>
                </span>
                <span className="services-request-card__action">
                  {isRequested ? t("servicesRequestSent") : t("servicesRequestAction")}
                  {!isRequested ? <ChevronRight size={18} strokeWidth={1.8} /> : null}
                </span>
              </button>
            );
          })}
        </div>

        {isRoomNumberModalOpen && selectedRequest ? (
          <div className="services-room-modal" role="presentation" onClick={() => setIsRoomNumberModalOpen(false)}>
            <section
              className="services-room-modal__dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="services-room-modal-title"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="services-room-modal__header">
                <div>
                  <p className="services-request-panel__eyebrow">{t("servicesRequestPanelEyebrow")}</p>
                  <h3 id="services-room-modal-title">{selectedRequest.title}</h3>
                  <p className="services-room-modal__description">{selectedRequest.description}</p>
                </div>
                <button type="button" className="services-room-modal__close" onClick={() => setIsRoomNumberModalOpen(false)} aria-label={t("servicesRequestRoomModalClose")}>
                  <X size={22} aria-hidden="true" />
                </button>
              </div>
              <div className="services-room-modal__meta">
                <span>{t("servicesRequestEtaLabel")}</span>
                <strong>{selectedRequest.eta}</strong>
              </div>
              <p className="services-room-modal__instruction">{t("servicesRequestRoomModalTitle")}</p>
              <div className="services-room-modal__display" aria-live="polite">
                {roomNumberDraft || "—"}
              </div>
              <NumericKeypad
                onDigit={(digit) => setRoomNumberDraft((current) => current.length < 20 ? `${current}${digit}` : current)}
                onBackspace={() => setRoomNumberDraft((current) => current.slice(0, -1))}
                onConfirm={() => undefined}
                showConfirm={false}
              />
              <button type="button" className="services-primary-action services-room-modal__submit" onClick={() => void confirmRequest()} disabled={requestState === "sending" || !roomNumberDraft}>
                {requestState === "sending" ? t("servicesRequestSending") : t("servicesRequestPanelConfirm")}
              </button>
              {requestState === "error" ? (
                <p className="services-request-panel__error" role="alert">{t("servicesRequestError")}</p>
              ) : null}
              <button type="button" className="services-secondary-action services-room-modal__cancel" onClick={() => setIsRoomNumberModalOpen(false)}>
                {t("servicesRequestPanelCancel")}
              </button>
            </section>
          </div>
        ) : null}

        {selectedRequest && requestedServiceId === selectedRequest.id ? (
          <div className="services-request-success" role="status">
            <CheckCircle2 size={21} strokeWidth={1.8} />
            <div>
              <strong>{t("servicesRequestSuccess")}</strong>
              <span>{t("servicesRequestSuccessCopy")}</span>
            </div>
          </div>
        ) : null}
      </section>

      <section className="services-planner" aria-labelledby="services-planner-title">
        <div className="services-section-heading services-section-heading--planner">
          <div>
            <p className="services-section-heading__eyebrow">{t("servicesPlannerEyebrow")}</p>
            <h2 id="services-planner-title">{t("servicesPlannerTitle")}</h2>
          </div>
          <p>{t("servicesPlannerSubtitle")}</p>
        </div>

        <div className="services-planner__layout">
          <div className="services-mood-picker" role="group" aria-label={t("servicesPlannerTitle")}>
            {moods.map((mood) => (
              <button
                key={mood.id}
                type="button"
                className={`services-mood ${selectedMood.id === mood.id ? "is-active" : ""}`.trim()}
                aria-pressed={selectedMood.id === mood.id}
                onClick={() => setSelectedMoodId(mood.id)}
              >
                <span>{mood.icon}</span>
                <strong>{mood.label}</strong>
              </button>
            ))}
          </div>

          <article key={selectedMood.id} className={`services-plan services-plan--${selectedMood.id}`}>
            <div className="services-plan__visual" aria-hidden="true">
              <span className="services-plan__orbit services-plan__orbit--one" />
              <span className="services-plan__orbit services-plan__orbit--two" />
              <span className="services-plan__icon">{selectedMood.icon}</span>
            </div>
            <div className="services-plan__copy">
              <span>{selectedMood.meta}</span>
              <h3>{selectedMood.title}</h3>
              <p>{selectedMood.description}</p>
            </div>
            <button type="button" className="services-plan__action" onClick={() => openRoute(selectedMood.destinationId)}>
              <Route size={19} strokeWidth={1.8} />
              <span>{t("servicesPlannerRouteAction")}</span>
              <ArrowRight size={18} strokeWidth={1.8} />
            </button>
          </article>
        </div>
      </section>

      <section className="services-amenities" aria-labelledby="services-amenities-title">
        <div className="services-section-heading">
          <div>
            <p className="services-section-heading__eyebrow">{t("servicesAmenitiesEyebrow")}</p>
            <h2 id="services-amenities-title">{t("servicesAmenitiesTitle")}</h2>
          </div>
          <p>{t("servicesAmenitiesSubtitle")}</p>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <article key={service.id} className={`services-card services-card--${service.tone}`}>
              <div className="services-card__top">
                {service.icon}
                <span className="services-card__number">{service.number}</span>
              </div>

              <div className="services-card__body">
                <h2>{service.title}</h2>
                <p>{service.description}</p>
              </div>

              <div className="services-card__meta">
                <span>{service.metaLabel}</span>
                <strong>{service.metaValue}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="services-spotlight" aria-label={t("servicesSpotlightTitle")}>
        <div className="services-spotlight__backdrop" aria-hidden="true">
          <span className="services-spotlight__stripe services-spotlight__stripe--one" />
          <span className="services-spotlight__stripe services-spotlight__stripe--two" />
          <span className="services-spotlight__lamp" />
        </div>

        <div className="services-spotlight__panel">
          <p className="services-spotlight__eyebrow">{t("servicesSpotlightEyebrow")}</p>
          <h2>{t("servicesSpotlightTitle")}</h2>
          <p>{t("servicesSpotlightCopy", { hotelName: hotel.name })}</p>
          <div className="services-spotlight__actions">
            <button type="button" className="services-primary-action" onClick={() => selectRequest("concierge")}>
              {t("servicesRequestConciergeAction")}
            </button>
            <button type="button" className="services-secondary-action services-secondary-action--light" onClick={() => setTab("map")}>
              {t("servicesOpenMap")}
            </button>
          </div>
        </div>
      </section>
    </>
  );

  const renderMapContent = () => (
    <>
      <header className="services-header services-header--map">
        <p className="services-header__eyebrow">{t("mapPageEyebrow")}</p>
        <h1 className="services-header__title">{t("mapPageTitle")}</h1>
        <p className="services-header__subtitle">{t("mapPageSubtitle", { hotelName: hotel.name })}</p>
        <span className="services-header__rule" aria-hidden="true" />
      </header>

      <div className="map-layout map-layout--inside">
        <article className="map-canvas-card">
          <div className="map-canvas__frame">
            <div className="map-canvas__label">{t("mapYouAreHere")}</div>
            <div className="map-canvas__controls" aria-label={t("mapZoomControlsLabel")}>
              <button type="button" onClick={zoomOut} disabled={zoom <= 0.85} aria-label={t("mapZoomOut")}>
                <Minus size={17} strokeWidth={2} />
              </button>
              <button type="button" onClick={resetZoom} aria-label={t("mapResetZoom")}>
                <RotateCcw size={16} strokeWidth={1.9} />
              </button>
              <button type="button" onClick={zoomIn} disabled={zoom >= 1.5} aria-label={t("mapZoomIn")}>
                <Plus size={17} strokeWidth={2} />
              </button>
            </div>
            <div className="map-canvas__stage" style={{ transform: `scale(${zoom})` } as CSSProperties}>
              <svg viewBox={`0 0 ${MAP_VIEWBOX_WIDTH} ${MAP_VIEWBOX_HEIGHT}`} className="map-canvas__svg" aria-hidden="true">
                <defs>
                  <linearGradient id="mapGold" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="var(--kiosk-primary)" />
                    <stop offset="100%" stopColor="var(--kiosk-accent)" />
                  </linearGradient>
                  <linearGradient id="mapSoft" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="var(--kiosk-surface)" />
                    <stop offset="100%" stopColor="var(--kiosk-surface-strong)" />
                  </linearGradient>
                  <linearGradient id="mapAccent" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="var(--kiosk-primary-dark)" />
                    <stop offset="100%" stopColor="var(--kiosk-primary)" />
                  </linearGradient>
                </defs>

                <rect x="34" y="34" width="932" height="692" rx="28" fill="rgba(255,255,255,0.86)" stroke="rgba(var(--kiosk-shadow-rgb),0.10)" />
                <rect x="72" y="82" width="138" height="264" rx="18" fill="url(#mapGold)" opacity="0.92" />
                <rect x="232" y="82" width="84" height="264" rx="14" fill="url(#mapSoft)" stroke="rgba(var(--kiosk-shadow-rgb),0.08)" />
                <rect x="72" y="368" width="216" height="220" rx="18" fill="url(#mapSoft)" stroke="rgba(var(--kiosk-shadow-rgb),0.08)" />
                <rect x="308" y="368" width="150" height="184" rx="16" fill="url(#mapSoft)" stroke="rgba(var(--kiosk-shadow-rgb),0.08)" />
                <rect x="490" y="120" width="170" height="132" rx="18" fill="url(#mapAccent)" opacity="0.82" />
                <rect x="686" y="120" width="210" height="306" rx="20" fill="rgba(216, 190, 132, 0.24)" stroke="rgba(var(--kiosk-primary-rgb),0.18)" />
                <rect x="490" y="286" width="170" height="302" rx="18" fill="rgba(255,255,255,0.72)" stroke="rgba(var(--kiosk-shadow-rgb),0.08)" />
                <rect x="686" y="452" width="210" height="124" rx="18" fill="rgba(255,255,255,0.62)" stroke="rgba(var(--kiosk-shadow-rgb),0.08)" />

                <path d="M170 155 L320 155 L610 190" fill="none" stroke="rgba(var(--kiosk-primary-rgb),0.55)" strokeWidth="6" strokeDasharray="18 15" strokeLinecap="round" />
                <path d="M170 155 L170 390" fill="none" stroke="rgba(var(--kiosk-primary-rgb),0.34)" strokeWidth="6" strokeDasharray="14 14" strokeLinecap="round" />
                <path d="M170 390 L405 390" fill="none" stroke="rgba(var(--kiosk-primary-rgb),0.26)" strokeWidth="5" strokeDasharray="13 14" strokeLinecap="round" />
                <path d="M405 390 L610 190" fill="none" stroke="rgba(var(--kiosk-accent-rgb),0.32)" strokeWidth="5" strokeDasharray="12 14" strokeLinecap="round" />
                <path d="M610 190 L710 410" fill="none" stroke="rgba(var(--kiosk-primary-rgb),0.28)" strokeWidth="5" strokeDasharray="11 13" strokeLinecap="round" />

                {routeActive && selectedSpot.id !== "reception" ? (
                  <>
                    <path className="map-route__halo" d={selectedSpot.routePath} />
                    <path className="map-route__active" d={selectedSpot.routePath} />
                  </>
                ) : null}

                <circle cx="170" cy="155" r="28" fill="rgba(143,106,25,0.12)" />
                <circle cx="170" cy="155" r="12" fill="var(--kiosk-primary)" />
                <circle className={routeActive ? "map-destination-ring is-routing" : "map-destination-ring"} cx={selectedSpot.x} cy={selectedSpot.y} r="24" />
                <circle cx={selectedSpot.x} cy={selectedSpot.y} r="11" fill="var(--kiosk-accent)" />
                <circle cx={selectedSpot.x} cy={selectedSpot.y} r="5" fill="var(--kiosk-surface)" />
              </svg>

              {spots.map((spot) => (
                <button
                  key={spot.id}
                  type="button"
                  className={`map-spot map-spot--${spot.tone} map-spot--${spot.id} ${selectedSpotId === spot.id ? "is-active" : ""} ${routeActive && selectedSpotId === spot.id ? "is-route-active" : ""}`.trim()}
                  style={{ left: `${(spot.x / MAP_VIEWBOX_WIDTH) * 100}%`, top: `${(spot.y / MAP_VIEWBOX_HEIGHT) * 100}%` }}
                  onClick={() => selectMapSpot(spot.id)}
                  aria-pressed={selectedSpotId === spot.id}
                >
                  <span className="map-spot__dot" />
                  <span className="map-spot__tooltip">
                    <strong>{spot.title}</strong>
                    <small>{spot.hint}</small>
                  </span>
                </button>
              ))}
            </div>
            <div className="map-canvas__compass" aria-hidden="true">
              <span>N</span>
              <i />
            </div>
            <div className="map-legend" aria-label={t("mapLegendLabel")}>
              <span className="map-legend__item"><i className="map-legend__marker map-legend__marker--you" />{t("mapLegendYou")}</span>
              <span className="map-legend__item"><i className="map-legend__marker map-legend__marker--destination" />{t("mapLegendDestination")}</span>
              <span className="map-legend__item"><i className="map-legend__route" />{t("mapLegendRoute")}</span>
            </div>
          </div>
        </article>

        <aside className="map-details" aria-label={t("mapDetailsLabel")}>
          <p className="map-details__eyebrow">{t("mapDestinationFocus")}</p>
          <h2>{selectedSpot.title}</h2>
          <p className="map-details__subtitle">{selectedSpot.subtitle}</p>
          <p className="map-details__copy">{selectedSpot.description}</p>

          <div className="map-details__info">
            <div>
              <span>{t("mapLevelLabel")}</span>
              <strong>{selectedSpot.level}</strong>
            </div>
            <div>
              <span>{t("mapEtaLabel")}</span>
              <strong>{selectedSpot.eta}</strong>
            </div>
          </div>

          <div className="map-details__guide">
            <span>{t("mapSuggestedRoute")}</span>
            <strong>{t("mapFromReception")}</strong>
            <p>{t("mapRouteCopy", { destination: selectedSpot.title })}</p>
          </div>

          <div className="map-details__journey" aria-label={t("mapFloorJourneyLabel")}>
            <span>{t("mapFloorJourneyLabel")}</span>
            <div>
              {selectedSpot.floorStops.map((stop, index) => (
                <span key={`${stop}-${index}`}>
                  {stop}
                  {index < selectedSpot.floorStops.length - 1 ? <ChevronRight size={14} aria-hidden="true" /> : null}
                </span>
              ))}
            </div>
          </div>

          <div className={`map-details__steps ${routeActive ? "is-active" : ""}`.trim()}>
            <div className="map-details__steps-heading">
              <span>{t("mapDirectionsLabel")}</span>
              <small>{selectedSpot.steps.length} {t("mapStepsLabel")}</small>
            </div>
            <ol>
              {selectedSpot.steps.map((step) => <li key={step}>{step}</li>)}
            </ol>
            <p><Accessibility size={17} aria-hidden="true" />{t("mapAccessibleRoute")}</p>
          </div>

          {routeActive ? (
            <div className="map-details__route-status" role="status">
              <span className="map-details__route-pulse" aria-hidden="true" />
              <div>
                <strong>{t("mapRouteActiveTitle")}</strong>
                <span>{t("mapRouteActiveCopy", { destination: selectedSpot.title, eta: selectedSpot.eta })}</span>
              </div>
            </div>
          ) : null}

          <div className="map-details__actions">
            <button
              type="button"
              className={`map-details__button ${routeActive ? "is-active" : ""}`.trim()}
              onClick={() => setRouteActive((current) => !current)}
              disabled={selectedSpot.id === "reception"}
            >
              <Route size={19} strokeWidth={1.8} />
              {routeActive
                ? t("mapRouteActiveAction")
                : t("mapShowRouteAction", { destination: selectedSpot.title })}
            </button>
            <button type="button" className="map-details__button map-details__button--soft" onClick={() => setTab("info")}>
              {t("servicesInfoTab")}
            </button>
          </div>
        </aside>
      </div>
    </>
  );

  const isMapTab = activeTab === "map";

  return (
    <KioskLayout>
      <section className={`services-page ${isMapTab ? "services-page--map" : "services-page--info"}`.trim()} aria-label={t("servicesPageTitle")}>
        <div className="services-toolbar">
          <button type="button" className="services-sidebar__home" onClick={() => navigate("/home")}>
            <House size={18} strokeWidth={1.8} />
            <span>{t("backToHome")}</span>
          </button>

          <nav className="services-sidebar__nav" aria-label={t("servicesSidebarNavLabel")}>
            <button
              type="button"
              className={`services-sidebar__item ${activeTab === "info" ? "is-active" : ""}`.trim()}
              aria-current={activeTab === "info" ? "page" : undefined}
              onClick={() => setTab("info")}
            >
              <span>{t("servicesInfoTab")}</span>
            </button>
            <button
              type="button"
              className={`services-sidebar__item ${activeTab === "map" ? "is-active" : ""}`.trim()}
              aria-current={activeTab === "map" ? "page" : undefined}
              onClick={() => setTab("map")}
            >
              <MapPinned size={16} strokeWidth={1.8} />
              <span>{t("servicesMapTab")}</span>
            </button>
          </nav>
        </div>

        <div className={`services-content ${isMapTab ? "services-content--map" : "services-content--info"}`.trim()}>
          {isMapTab ? renderMapContent() : renderInfoContent()}
        </div>
      </section>
    </KioskLayout>
  );
}
