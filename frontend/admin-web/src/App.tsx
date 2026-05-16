import { FormEvent, useEffect, useMemo, useState } from "react";
import { adminApi } from "./api";
import type { AdminSession, AuditEvent, DashboardResult, DeviceStatus, HotelProfile, HotelSummary, ReservationSummary } from "./types";
import type { Language, ReservationFormState, ViewKey } from "./admin/types";
import { COPY } from "./admin/copy";
import AdminSidebar from "./components/AdminSidebar";
import OverviewPage from "./pages/overview/OverviewPage";
import ReservationsPage from "./pages/reservations/ReservationsPage";
import BrandingPage from "./pages/branding/BrandingPage";
import DevicesPage from "./pages/devices/DevicesPage";
import AuditPage from "./pages/audit/AuditPage";
import IdentityPage from "./pages/identity/IdentityPage";

function createAvailableRoomNumber() {
  return `9${Date.now().toString().slice(-5)}${Math.floor(Math.random() * 10)}`;
}

function App() {
  const [language, setLanguage] = useState<Language>("en");
  const t = COPY[language];
  const [session, setSession] = useState<AdminSession | null>(() => {
    const raw = localStorage.getItem("admin-session");
    return raw ? (JSON.parse(raw) as AdminSession) : null;
  });
  const [username, setUsername] = useState("admin@flexcheck.local");
  const [password, setPassword] = useState("FlexCheck@2026");
  const [hotels, setHotels] = useState<HotelSummary[]>(session?.hotels ?? []);
  const [selectedHotelId, setSelectedHotelId] = useState<number | null>(session?.hotels?.[0]?.id ?? null);
  const [selectedView, setSelectedView] = useState<ViewKey>("overview");
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

  useEffect(() => {
    if (!session) {
      return;
    }

    localStorage.setItem("admin-session", JSON.stringify(session));
    localStorage.setItem("admin-token", session.token);
  }, [session]);

  useEffect(() => {
    if (session && hotels.length === 0) {
      adminApi.listHotels().then(setHotels).catch(() => setHotels([]));
    }
  }, [hotels.length, session]);

  useEffect(() => {
    if (!selectedHotelId && hotels.length > 0) {
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
    if (!session || !selectedHotelId) {
      return;
    }

    setLoading(true);
    Promise.all([
      adminApi.getDashboard(selectedHotelId),
      adminApi.getHotel(selectedHotelId),
      adminApi.listReservations(selectedHotelId),
      adminApi.getDevices(selectedHotelId),
      adminApi.getAudit(selectedHotelId),
    ])
      .then(([dashboardResult, profileResult, reservationsResult, deviceStatusResult, auditResult]) => {
        setDashboard(dashboardResult);
        setHotelProfile(profileResult);
        setReservations(reservationsResult);
        setDeviceStatus(deviceStatusResult);
        setAudit(auditResult);
        setMessage("");
      })
      .catch((error) => {
        setMessage(error instanceof Error ? error.message : "Failed to load portal data.");
      })
      .finally(() => setLoading(false));
  }, [selectedHotelId, session]);

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
      setSelectedHotelId(result.hotels[0]?.id ?? null);
      setSelectedView("overview");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login failed.");
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
  };

  const refreshData = async () => {
    if (!selectedHotelId) {
      return;
    }

    setLoading(true);
    setMessage("");

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
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to refresh overview data.");
    } finally {
      setLoading(false);
    }
  };

  const saveBranding = async () => {
    if (!selectedHotelId || !hotelProfile) {
      return;
    }
    const updated = await adminApi.updateBranding(selectedHotelId, hotelProfile.branding);
    setHotelProfile(updated);
    await refreshData();
  };

  const saveContent = async () => {
    if (!selectedHotelId || !hotelProfile) {
      return;
    }
    const updated = await adminApi.updateContent(selectedHotelId, hotelProfile.content);
    setHotelProfile(updated);
    await refreshData();
  };

  const createReservation = async () => {
    if (!selectedHotelId || !selectedHotel) {
      return;
    }

    try {
      const created = await adminApi.createReservation(selectedHotelId, {
        ...reservationForm,
        hotelName: reservationForm.hotelName || selectedHotel.name,
        reservationCode: reservationForm.reservationCode || undefined,
      });
      setReservations((current) => [created, ...current]);
      setReservationForm((current) => ({
        ...current,
        roomNumber: createAvailableRoomNumber(),
        reservationCode: "",
      }));
      setMessage(`Reservation ${created.code} created.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to create reservation.");
    }
  };

  const deleteReservation = async (reservationId: number) => {
    if (!selectedHotelId) {
      return;
    }
    const shouldDelete = window.confirm("Do you really want to delete this reservation?");
    if (!shouldDelete) {
      return;
    }
    try {
      await adminApi.deleteReservation(selectedHotelId, reservationId);
      setReservations((current) => current.filter((reservation) => reservation.id !== reservationId));
      setMessage("Reservation deleted.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to delete reservation.");
    }
  };

  if (!session) {
    return (
      <div className="admin-shell admin-shell--login">
        <div className="admin-login-card">
          <p className="admin-eyebrow">{t.portal}</p>
          <h1>{t.loginTitle}</h1>
          <p className="admin-copy">{t.loginSubtitle}</p>
          <form className="admin-login-form" onSubmit={login}>
            <label>
              <span>{t.username}</span>
              <input value={username} onChange={(event) => setUsername(event.target.value)} />
            </label>
            <label>
              <span>{t.password}</span>
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            </label>
            <div className="admin-language-switcher" aria-label="Language selector">
              {(["en", "pt-BR", "es"] as Language[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  className={language === option ? "is-active" : ""}
                  onClick={() => setLanguage(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <button className="admin-primary-button" type="submit" disabled={loading}>
              {loading ? "..." : t.login}
            </button>
          </form>
          {message ? <p className="admin-message">{message}</p> : null}
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
    identity: t.identity,
  } satisfies Record<ViewKey, string>;

  return (
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
            <select value={selectedHotelId ?? ""} onChange={(event) => setSelectedHotelId(Number(event.target.value))}>
              {hotels.map((hotel) => (
                <option key={hotel.id} value={hotel.id}>
                  {hotel.name}
                </option>
              ))}
            </select>
            <button className="admin-secondary-button" onClick={refreshData}>
              {t.refresh}
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
            loadingLabel={t.loading}
            noActivityLabel={t.noActivity}
            noUnitsLabel={t.noUnits}
            liveActivityLabel={t.liveActivity}
            performanceTitle={t.performanceTitle}
            performanceSubtitle={t.performanceSubtitle}
            trafficAndDemandLabel={t.trafficAndDemand}
            trafficAndDemandSubtitle={t.trafficAndDemandSubtitle}
            manageFleetLabel={t.manageFleet}
            viewAllLogsLabel={t.viewAllLogs}
            exportDataLabel={t.exportData}
            viewLiveLabel={t.viewLive}
            onRefresh={refreshData}
            onOpenAudit={() => setSelectedView("audit")}
          />
        ) : null}

        {selectedView === "reservations" ? (
          <ReservationsPage
            emptyState={t.emptyState}
            testAreaLabel={t.testArea}
            testHelpLabel={t.testHelp}
            createReservationLabel={t.createReservation}
            deleteReservationLabel={t.deleteReservation}
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
            emptyState={t.emptyState}
            saveBrandingLabel={t.saveBranding}
            saveContentLabel={t.saveContent}
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
            onRefresh={refreshData}
          />
        ) : null}

        {selectedView === "audit" ? <AuditPage audit={audit} emptyState={t.emptyState} onRefresh={refreshData} /> : null}

        {selectedView === "identity" ? <IdentityPage title={t.identity} message={t.emptyState} /> : null}
      </main>
    </div>
  );
}

export default App;
