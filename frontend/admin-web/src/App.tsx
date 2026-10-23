import { FormEvent, useEffect, useMemo, useState } from "react";
import { ApiError, adminApi, isUnauthorizedError } from "./api";
import type { AdminSession, AuditEvent, DashboardResult, DeviceStatus, HotelProfile, HotelSummary, ReservationSummary } from "./types";
import type { Language, ReservationFormState, ViewKey } from "./admin/types";
import { COPY } from "./admin/copy";
import { isValidReservationCode } from "./admin/reservationCode";
import AdminSidebar from "./components/AdminSidebar";
import AdminIcon from "./components/AdminIcon";
import AdminSelect from "./components/AdminSelect";
import OverviewPage from "./pages/overview/OverviewPage";
import ReservationsPage from "./pages/reservations/ReservationsPage";
import BrandingPage from "./pages/branding/BrandingPage";
import DevicesPage from "./pages/devices/DevicesPage";
import AuditPage from "./pages/audit/AuditPage";
import AdminErrorBoundary from "./components/AdminErrorBoundary";

const ADMIN_LANGUAGE_KEY = "admin-language";
const ADMIN_SELECTED_VIEW_KEY = "admin-selected-view";
const ADMIN_SELECTED_HOTEL_KEY = "admin-selected-hotel";

function interpolate(template: string, values: Record<string, string>) {
  return Object.entries(values).reduce((result, [key, value]) => result.replaceAll(`{${key}}`, value), template);
}

function readStoredLanguage(): Language {
  try {
    const stored = localStorage.getItem(ADMIN_LANGUAGE_KEY);
    return stored === "pt-BR" || stored === "es" ? stored : "en";
  } catch {
    return "en";
  }
}

function readStoredSession(): AdminSession | null {
  try {
    const raw = localStorage.getItem("admin-session");
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as AdminSession;
    return parsed?.token ? parsed : null;
  } catch {
    localStorage.removeItem("admin-session");
    localStorage.removeItem("admin-token");
    return null;
  }
}

function readStoredView(): ViewKey {
  try {
    const stored = localStorage.getItem(ADMIN_SELECTED_VIEW_KEY);
    return stored === "overview" ||
      stored === "reservations" ||
      stored === "branding" ||
      stored === "devices" ||
      stored === "audit"
      ? stored
      : "overview";
  } catch {
    return "overview";
  }
}

function readStoredHotelId(): number | null {
  try {
    const stored = localStorage.getItem(ADMIN_SELECTED_HOTEL_KEY);
    if (!stored) {
      return null;
    }
    const parsed = Number(stored);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  } catch {
    return null;
  }
}

function createAvailableRoomNumber() {
  return String(10 + Math.floor(Math.random() * 90));
}

function App() {
  const [language, setLanguage] = useState<Language>(() => readStoredLanguage());
  const t = COPY[language];
  const [session, setSession] = useState<AdminSession | null>(() => readStoredSession());
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hotels, setHotels] = useState<HotelSummary[]>(session?.hotels ?? []);
  const [selectedHotelId, setSelectedHotelId] = useState<number | null>(() => readStoredHotelId() ?? session?.hotels?.[0]?.id ?? null);
  const [selectedView, setSelectedView] = useState<ViewKey>(() => readStoredView());
  const [dashboard, setDashboard] = useState<DashboardResult | null>(null);
  const [hotelProfile, setHotelProfile] = useState<HotelProfile | null>(null);
  const [reservations, setReservations] = useState<ReservationSummary[]>([]);
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus | null>(null);
  const [audit, setAudit] = useState<AuditEvent[]>([]);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [reservationForm, setReservationForm] = useState<ReservationFormState>({
    hotelName: "",
    roomNumber: createAvailableRoomNumber(),
    roomType: "DELUXE",
    arrivalDate: new Date().toISOString().slice(0, 10),
    departureDate: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10),
    adults: 1,
    children: 0,
    totalAmount: 980,
    currency: "BRL",
    guestFullName: "Admin Test Guest",
    guestDocumentType: "CPF",
    guestDocumentNumber: "55544433322",
    guestBirthDate: "1993-07-21",
    guestNationality: "Brasileira",
    guestEmail: "teste.admin@example.com",
    guestPhone: "+5511997776655",
    reservationCode: "",
  });

  const resolvePageErrorMessage = (error: unknown, fallback: string) => {
    if (isUnauthorizedError(error)) {
      logout();
      return null;
    }
    if (error instanceof ApiError) {
      if (error.code === "ACTIVE_STAY") {
        return t.messages.cannotDeleteActiveReservation;
      }
      if (error.code === "SERVICE_UNAVAILABLE" || error.code === "NETWORK_ERROR" || error.status >= 500) {
        return t.messages.serviceUnavailable;
      }
      if (error.code === "UNKNOWN_ERROR" || error.status === 0) {
        return t.messages.networkUnavailable;
      }
      return fallback;
    }
    return error instanceof Error && error.message ? error.message : fallback;
  };

  const resolveLoginErrorMessage = (error: unknown) => {
    if (error instanceof ApiError) {
      if (error.code === "INVALID_CREDENTIALS" || error.status === 401) {
        return t.messages.invalidCredentials;
      }
      if (error.code === "SERVICE_UNAVAILABLE" || error.code === "NETWORK_ERROR" || error.status >= 500) {
        return t.messages.serviceUnavailable;
      }
      if (error.code === "UNKNOWN_ERROR" || error.status === 0) {
        return t.messages.networkUnavailable;
      }
      return t.messages.loginFailed;
    }
    return error instanceof Error && error.message ? error.message : t.messages.loginFailed;
  };

  useEffect(() => {
    if (!session) {
      return;
    }

    localStorage.setItem("admin-session", JSON.stringify(session));
    localStorage.setItem("admin-token", session.token);
  }, [session]);

  useEffect(() => {
    try {
      localStorage.setItem(ADMIN_LANGUAGE_KEY, language);
    } catch {
    }
  }, [language]);

  useEffect(() => {
    try {
      localStorage.setItem(ADMIN_SELECTED_VIEW_KEY, selectedView);
    } catch {
    }
  }, [selectedView]);

  useEffect(() => {
    try {
      if (selectedHotelId === null) {
        localStorage.removeItem(ADMIN_SELECTED_HOTEL_KEY);
        return;
      }
      localStorage.setItem(ADMIN_SELECTED_HOTEL_KEY, String(selectedHotelId));
    } catch {
    }
  }, [selectedHotelId]);

  useEffect(() => {
    if (session && hotels.length === 0) {
      adminApi.listHotels().then(setHotels).catch(() => setHotels([]));
    }
  }, [hotels.length, session]);

  useEffect(() => {
    if (hotels.length === 0) {
      return;
    }

    const hotelExists = selectedHotelId !== null && hotels.some((hotel) => hotel.id === selectedHotelId);
    if (!hotelExists) {
      setSelectedHotelId(hotels[0].id);
      setReservationForm((current) => ({ ...current, hotelName: hotels[0].name }));
    }
  }, [hotels, selectedHotelId]);

  useEffect(() => {
    if (!selectedHotelId) {
      return;
    }

    const hotel = hotels.find((item) => item.id === selectedHotelId);
    setReservationForm((current) => ({
      ...current,
      hotelName: hotel?.name || current.hotelName,
    }));
  }, [hotels, selectedHotelId]);

  useEffect(() => {
    if (!message) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setMessage("");
    }, 5000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [message]);

  useEffect(() => {
    setMessage("");
  }, [selectedView, selectedHotelId]);

  const refreshData = async (options: { silent?: boolean } = {}) => {
    if (!selectedHotelId) {
      return;
    }

    if (!options.silent) {
      setLoading(true);
      setMessage("");
    }

    try {
      const [dashboardResult, profileResult, reservationsResult, deviceStatusResult, auditResult] = await Promise.all([
        adminApi.getDashboard(selectedHotelId),
        adminApi.getHotel(selectedHotelId),
        adminApi.listReservations(selectedHotelId),
        adminApi.getDevices(selectedHotelId),
        adminApi.getAudit(selectedHotelId),
      ]);

      setDashboard(dashboardResult);
      setHotelProfile(profileResult);
      setReservations(reservationsResult);
      setDeviceStatus(deviceStatusResult);
      setAudit(auditResult);
      if (!options.silent) {
        setMessage("");
      }
    } catch (error) {
      const nextMessage = resolvePageErrorMessage(error, t.messages.loadPortalData);
      if (nextMessage === null) {
        return;
      }
      if (!options.silent || !message) {
        setMessage(nextMessage);
      }
    } finally {
      if (!options.silent) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!session || !selectedHotelId) {
      return;
    }

    void refreshData();
  }, [selectedHotelId, session, t.messages.loadPortalData]);

  useEffect(() => {
    if (!session) {
      return;
    }

    let active = true;

    const checkSession = async () => {
      try {
        await adminApi.listHotels();
      } catch (error) {
        if (!active) {
          return;
        }
        if (isUnauthorizedError(error)) {
          logout();
          return;
        }
      }
    };

    checkSession();
    const intervalId = window.setInterval(checkSession, 60000);
    const handleFocus = () => {
      checkSession();
    };
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        checkSession();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      active = false;
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [session]);

  useEffect(() => {
    if (!session || !selectedHotelId) {
      return;
    }

    if (selectedView === "branding") {
      return;
    }

    const intervalId = window.setInterval(() => {
      void refreshData({ silent: true });
    }, 5000);

    const handleFocus = () => {
      void refreshData({ silent: true });
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        void refreshData({ silent: true });
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [session, selectedHotelId, language, selectedView]);

  const selectedHotel = useMemo(
    () => hotels.find((hotel) => hotel.id === selectedHotelId) ?? null,
    [hotels, selectedHotelId]
  );

  const login = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const result = await adminApi.login(username, password);
      setSession(result);
      setHotels(result.hotels);
      const storedView = readStoredView();
      const storedHotelId = readStoredHotelId();
      setSelectedHotelId(
        storedHotelId !== null && result.hotels.some((hotel) => hotel.id === storedHotelId)
          ? storedHotelId
          : result.hotels[0]?.id ?? null
      );
      setSelectedView(storedView);
    } catch (error) {
      setMessage(resolveLoginErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setSession(null);
    setHotels([]);
    setSelectedHotelId(null);
    setDashboard(null);
    setHotelProfile(null);
    setReservations([]);
    setDeviceStatus(null);
    setAudit([]);
    setMessage("");
    localStorage.removeItem("admin-session");
    localStorage.removeItem("admin-token");
    localStorage.removeItem(ADMIN_SELECTED_VIEW_KEY);
    localStorage.removeItem(ADMIN_SELECTED_HOTEL_KEY);
  };

  const saveBranding = async (brandingOverride?: HotelProfile["branding"]) => {
    if (!selectedHotelId || !hotelProfile) {
      return;
    }

    try {
      const updated = await adminApi.updateBranding(selectedHotelId, {
        name: hotelProfile.name,
        branding: brandingOverride ?? hotelProfile.branding,
      });
      setHotelProfile(updated);
      setHotels((current) => current.map((hotel) => (hotel.id === updated.id ? { ...hotel, name: updated.name } : hotel)));
      setSession((current) => current
        ? { ...current, hotels: current.hotels.map((hotel) => (hotel.id === updated.id ? { ...hotel, name: updated.name } : hotel)) }
        : current);
      await refreshData({ silent: true });
    } catch (error) {
      const nextMessage = resolvePageErrorMessage(error, t.messages.refreshOverviewData);
      if (nextMessage === null) {
        return;
      }
      setMessage(nextMessage);
    }
  };

  const saveContent = async () => {
    if (!selectedHotelId || !hotelProfile) {
      return;
    }
    try {
      const updated = await adminApi.updateContent(selectedHotelId, hotelProfile.content);
      setHotelProfile(updated);
      await refreshData({ silent: true });
    } catch (error) {
      const nextMessage = resolvePageErrorMessage(error, t.messages.refreshOverviewData);
      if (nextMessage === null) {
        return;
      }
      setMessage(nextMessage);
    }
  };

  const createReservation = async () => {
    if (!selectedHotelId || !selectedHotel) {
      return;
    }

    if (!isValidReservationCode(reservationForm.reservationCode)) {
      setMessage(t.reservationsPage.reservationForm.reservationCodeInvalid);
      return;
    }

    try {
      const created = await adminApi.createReservation(selectedHotelId, {
        ...reservationForm,
        hotelName: reservationForm.hotelName || selectedHotel.name,
        reservationCode: reservationForm.reservationCode,
      });
      setReservations((current) => [created, ...current]);
      setReservationForm((current) => ({
        ...current,
        roomNumber: createAvailableRoomNumber(),
        reservationCode: "",
      }));
      setMessage(interpolate(t.messages.reservationCreated, { code: created.code }));
    } catch (error) {
      const nextMessage = resolvePageErrorMessage(error, t.messages.createReservationFailed);
      if (nextMessage === null) {
        return;
      }
      setMessage(nextMessage);
    }
  };

  const deleteReservation = async (reservationId: number) => {
    if (!selectedHotelId) {
      return;
    }
    const shouldDelete = window.confirm(t.messages.confirmDeleteReservation);
    if (!shouldDelete) {
      return;
    }
    try {
      await adminApi.deleteReservation(selectedHotelId, reservationId);
      setReservations((current) => current.filter((reservation) => reservation.id !== reservationId));
      setMessage(t.messages.reservationDeleted);
    } catch (error) {
      const nextMessage = resolvePageErrorMessage(error, t.messages.deleteReservationFailed);
      if (nextMessage === null) {
        return;
      }
      setMessage(nextMessage);
    }
  };

  const acknowledgeSupportRequests = async () => {
    if (!selectedHotelId) {
      return;
    }

    try {
      await adminApi.acknowledgeSupportRequests(selectedHotelId);
      await refreshData({ silent: true });
    } catch (error) {
      const nextMessage = resolvePageErrorMessage(error, t.messages.refreshOverviewData);
      if (nextMessage !== null) {
        setMessage(nextMessage);
      }
    }
  };

  if (!session) {
    return (
      <div className="admin-shell admin-shell--login">
        <div className="admin-login-layout">
          <section className="admin-login-intro" aria-hidden="true">
            <div className="admin-login-intro__mark"><AdminIcon name="spark" /></div>
            <p className="admin-eyebrow">{t.portal}</p>
            <h1>{t.loginSupportTitle}</h1>
            <p>{t.loginSupportDescription}</p>
            <div className="admin-login-intro__signals">
              {t.loginSignals.map((signal) => <span key={signal}><i /> {signal}</span>)}
            </div>
          </section>
          <div className="admin-login-card">
            <div className="admin-login-card__head">
              <div className="admin-login-card__icon"><AdminIcon name="shield" /></div>
              <p className="admin-eyebrow">{t.portal}</p>
            </div>
            <h2>{t.loginTitle}</h2>
            <p className="admin-copy">{t.loginSubtitle}</p>
            <div className="admin-login-message-slot" aria-live="polite">
              {message ? <p className="admin-message admin-message--login" role="alert">{message}</p> : null}
            </div>
            <form className="admin-login-form" onSubmit={login}>
              <label>
                <span>{t.username}</span>
                <input autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} />
              </label>
              <label>
                <span>{t.password}</span>
                <input autoComplete="current-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
              </label>
              <button className="admin-primary-button" type="submit" disabled={loading}>
                <span>{loading ? "..." : t.login}</span><AdminIcon name="shield" />
              </button>
            </form>
            <div className="admin-language-switcher" aria-label={t.languageSelectorLabel}>
              {(["en", "pt-BR", "es"] as Language[]).map((option) => (
                <button key={option} type="button" className={language === option ? "is-active" : ""} onClick={() => setLanguage(option)} aria-pressed={language === option}>
                  {t.languages[option]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const loadingOverview = loading && selectedView === "overview";
  const viewLabels = {
    overview: t.overview,
    reservations: t.reservations,
    branding: t.branding,
    devices: t.devices,
    audit: t.audit,
  } satisfies Record<ViewKey, string>;

  return (
    <AdminErrorBoundary
      resetKey={session ? "signed-in" : "signed-out"}
      title={t.messages.unexpectedError}
      message={t.messages.unexpectedError}
      reloadLabel={t.messages.reloadPage}
      loginLabel={t.messages.goToLogin}
      onReload={() => window.location.reload()}
      onLogin={logout}
    >
      <div className="admin-app">
        <AdminSidebar
          portal={t.portal}
          role={t.role}
          labels={viewLabels}
          logoutLabel={t.logout}
          selectedView={selectedView}
          onSelectView={setSelectedView}
          onLogout={logout}
        />

        <main className="admin-main">
          <header className="admin-header">
            <div className="admin-header-copy">
              <p className="admin-eyebrow">{t.hotelContext}</p>
              <h1>{selectedHotel?.name ?? t.chooseHotel}</h1>
            </div>
            <div className="admin-toolbar">
              <div className="admin-language-switcher admin-language-switcher--toolbar" aria-label={t.languageSelectorLabel}>
                {(["en", "pt-BR", "es"] as Language[]).map((option) => (
                  <button key={option} type="button" className={language === option ? "is-active" : ""} onClick={() => setLanguage(option)} aria-pressed={language === option}>
                    {t.languages[option]}
                  </button>
                ))}
              </div>
              <AdminSelect
                ariaLabel={t.chooseHotel}
                className="admin-select--hotel"
                value={String(selectedHotelId ?? "")}
                options={hotels.map((hotel) => ({ value: String(hotel.id), label: hotel.name }))}
                onChange={(value) => setSelectedHotelId(Number(value))}
              />
              <button className="admin-secondary-button" type="button" onClick={() => void refreshData()}>
                <AdminIcon name="refresh" /> <span>{t.refresh}</span>
              </button>
            </div>
          </header>

          {message ? <p className="admin-message admin-message--inline">{message}</p> : null}

          {selectedView === "overview" ? (
            <OverviewPage
              dashboard={dashboard}
              hotelProfile={hotelProfile}
              selectedHotel={selectedHotel}
              loading={loadingOverview}
              emptyState={t.emptyState}
              copy={t.overviewPage}
              locale={language}
              onRefresh={refreshData}
              onAcknowledgeSupportRequests={() => void acknowledgeSupportRequests()}
              onOpenAudit={() => setSelectedView("audit")}
              onOpenDevices={() => setSelectedView("devices")}
            />
          ) : null}

          {selectedView === "reservations" ? (
            <ReservationsPage
              emptyState={t.emptyState}
              copy={t.reservationsPage}
              locale={language}
              reservationForm={reservationForm}
              setReservationForm={setReservationForm}
              reservations={reservations}
              onCreateReservation={createReservation}
              onDeleteReservation={deleteReservation}
            />
          ) : null}

          {selectedView === "branding" ? (
            <BrandingPage
              hotelProfile={hotelProfile}
              copy={t.brandingPage}
              emptyState={t.emptyState}
              setHotelProfile={setHotelProfile}
              onSaveBranding={saveBranding}
              onSaveContent={saveContent}
            />
          ) : null}

          {selectedView === "devices" ? (
            <DevicesPage
              deviceStatus={deviceStatus}
              hotelName={selectedHotel?.name ?? null}
              emptyState={t.emptyState}
              copy={t.devicesPage}
              locale={language}
              onRefresh={refreshData}
            />
          ) : null}

          {selectedView === "audit" ? <AuditPage audit={audit} emptyState={t.emptyState} copy={t.auditPage} locale={language} onRefresh={refreshData} /> : null}
        </main>
      </div>
    </AdminErrorBoundary>
  );
}

export default App;
