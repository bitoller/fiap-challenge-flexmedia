import { FormEvent, useEffect, useMemo, useState } from "react";
import { adminApi } from "./api";
import { AdminSession, AuditEvent, DashboardResult, HotelProfile, HotelSummary, ReservationSummary } from "./types";

type ViewKey = "overview" | "reservations" | "branding" | "devices" | "audit" | "identity";
type Language = "en" | "pt-BR" | "es";

const COPY: Record<Language, Record<string, string>> = {
  en: {
    portal: "L'Éclat Administration",
    loginTitle: "Administrator access",
    loginSubtitle: "Sign in to manage hotels, reservations, and operational views.",
    username: "Username",
    password: "Password",
    login: "Sign in",
    hotelContext: "Hotel context",
    overview: "Overview",
    reservations: "Reservations",
    branding: "Branding",
    devices: "Devices",
    audit: "Audit",
    identity: "Identity",
    testArea: "Reservation test area",
    createReservation: "Create reservation",
    deleteReservation: "Delete",
    logout: "Logout",
    emptyState: "No data available for the selected hotel.",
    chooseHotel: "Choose a hotel to begin.",
    role: "Administrator",
    testHelp: "Create and remove real reservations persisted in Oracle.",
  },
  "pt-BR": {
    portal: "L'Éclat Administração",
    loginTitle: "Acesso administrativo",
    loginSubtitle: "Entre para gerenciar hotéis, reservas e visões operacionais.",
    username: "Usuário",
    password: "Senha",
    login: "Entrar",
    hotelContext: "Contexto do hotel",
    overview: "Visão geral",
    reservations: "Reservas",
    branding: "Branding",
    devices: "Dispositivos",
    audit: "Auditoria",
    identity: "Identidade",
    testArea: "Área de testes de reservas",
    createReservation: "Criar reserva",
    deleteReservation: "Excluir",
    logout: "Sair",
    emptyState: "Nenhum dado disponível para o hotel selecionado.",
    chooseHotel: "Escolha um hotel para começar.",
    role: "Administrador",
    testHelp: "Crie e remova reservas reais persistidas no Oracle.",
  },
  es: {
    portal: "L'Éclat Administración",
    loginTitle: "Acceso administrativo",
    loginSubtitle: "Ingrese para gestionar hoteles, reservas y vistas operativas.",
    username: "Usuario",
    password: "Contraseña",
    login: "Ingresar",
    hotelContext: "Contexto del hotel",
    overview: "Resumen",
    reservations: "Reservas",
    branding: "Branding",
    devices: "Dispositivos",
    audit: "Auditoría",
    identity: "Identidad",
    testArea: "Área de pruebas de reservas",
    createReservation: "Crear reserva",
    deleteReservation: "Eliminar",
    logout: "Salir",
    emptyState: "No hay datos disponibles para el hotel seleccionado.",
    chooseHotel: "Elija un hotel para comenzar.",
    role: "Administrador",
    testHelp: "Cree y elimine reservas reales persistidas en Oracle.",
  },
};

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(value);
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
  const [devices, setDevices] = useState<Array<Record<string, unknown>>>([]);
  const [audit, setAudit] = useState<AuditEvent[]>([]);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [reservationForm, setReservationForm] = useState({
    hotelName: "",
    roomNumber: "2201",
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
    if (hotels.length === 0) {
      adminApi.listHotels().then(setHotels).catch(() => setHotels([]));
    }
  }, [hotels.length]);

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
      .then(([dashboardResult, profileResult, reservationsResult, devicesResult, auditResult]) => {
        setDashboard(dashboardResult);
        setHotelProfile(profileResult);
        setReservations(reservationsResult);
        setDevices(devicesResult.devices ?? []);
        setAudit(auditResult);
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
    setDevices([]);
    setAudit([]);
    localStorage.removeItem("admin-session");
    localStorage.removeItem("admin-token");
  };

  const refreshData = async () => {
    if (!selectedHotelId) {
      return;
    }
    setLoading(true);
    try {
      const [dashboardResult, profileResult, reservationsResult, devicesResult, auditResult] = await Promise.all([
        adminApi.getDashboard(selectedHotelId),
        adminApi.getHotel(selectedHotelId),
        adminApi.listReservations(selectedHotelId),
        adminApi.getDevices(selectedHotelId),
        adminApi.getAudit(selectedHotelId),
      ]);
      setDashboard(dashboardResult);
      setHotelProfile(profileResult);
      setReservations(reservationsResult);
      setDevices(devicesResult.devices ?? []);
      setAudit(auditResult);
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
      setMessage(`Reservation ${created.code} created.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to create reservation.");
    }
  };

  const deleteReservation = async (reservationId: number) => {
    if (!selectedHotelId) {
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
            <button className="admin-primary-button" type="submit" disabled={loading}>
              {loading ? "..." : t.login}
            </button>
          </form>
          {message ? <p className="admin-message">{message}</p> : null}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <div>
          <p className="admin-brand">{t.portal}</p>
          <span className="admin-role">{t.role}</span>
        </div>

        <nav className="admin-nav">
          {(["overview", "reservations", "branding", "devices", "audit", "identity"] as ViewKey[]).map((view) => (
            <button key={view} className={selectedView === view ? "is-active" : ""} onClick={() => setSelectedView(view)}>
              {t[view]}
            </button>
          ))}
        </nav>

        <button className="admin-secondary-button" onClick={logout}>
          {t.logout}
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
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
              Refresh
            </button>
          </div>
        </header>

        {message ? <p className="admin-message admin-message--inline">{message}</p> : null}

        {selectedView === "overview" ? (
          <section className="admin-grid">
            <article className="admin-card admin-card--metric">
              <span>Reservations today</span>
              <strong>{dashboard?.reservationsToday ?? 0}</strong>
            </article>
            <article className="admin-card admin-card--metric">
              <span>Active stays</span>
              <strong>{dashboard?.activeStays ?? 0}</strong>
            </article>
            <article className="admin-card admin-card--metric">
              <span>Completed check-ins</span>
              <strong>{dashboard?.completedCheckins ?? 0}</strong>
            </article>
            <article className="admin-card admin-card--metric">
              <span>Completed check-outs</span>
              <strong>{dashboard?.completedCheckouts ?? 0}</strong>
            </article>

            <article className="admin-card admin-card--wide">
              <h2>Recent activity</h2>
              {dashboard?.recentSessions?.length ? (
                <ul className="admin-list">
                  {dashboard.recentSessions.map((item, index) => (
                    <li key={index}>{JSON.stringify(item)}</li>
                  ))}
                </ul>
              ) : (
                <p className="admin-empty">{t.emptyState}</p>
              )}
            </article>
            <article className="admin-card admin-card--wide">
              <h2>Device status</h2>
              <p className="admin-copy">
                {dashboard?.deviceStatus.totalDevices ?? 0} devices, {dashboard?.deviceStatus.onlineDevices ?? 0} online
              </p>
            </article>
          </section>
        ) : null}

        {selectedView === "reservations" ? (
          <section className="admin-panel">
            <div className="admin-card">
              <h2>{t.testArea}</h2>
              <p className="admin-copy">{t.testHelp}</p>
              <div className="admin-form-grid">
                <input value={reservationForm.hotelName} onChange={(event) => setReservationForm((current) => ({ ...current, hotelName: event.target.value }))} placeholder="Hotel name" />
                <input value={reservationForm.roomNumber} onChange={(event) => setReservationForm((current) => ({ ...current, roomNumber: event.target.value }))} placeholder="Room number" />
                <input value={reservationForm.roomType} onChange={(event) => setReservationForm((current) => ({ ...current, roomType: event.target.value }))} placeholder="Room type" />
                <input value={reservationForm.reservationCode} onChange={(event) => setReservationForm((current) => ({ ...current, reservationCode: event.target.value }))} placeholder="Reservation code" />
                <input type="date" value={reservationForm.arrivalDate} onChange={(event) => setReservationForm((current) => ({ ...current, arrivalDate: event.target.value }))} />
                <input type="date" value={reservationForm.departureDate} onChange={(event) => setReservationForm((current) => ({ ...current, departureDate: event.target.value }))} />
                <input value={reservationForm.guestFullName} onChange={(event) => setReservationForm((current) => ({ ...current, guestFullName: event.target.value }))} placeholder="Guest name" />
                <input value={reservationForm.guestDocumentNumber} onChange={(event) => setReservationForm((current) => ({ ...current, guestDocumentNumber: event.target.value }))} placeholder="Guest document" />
                <input value={reservationForm.guestEmail} onChange={(event) => setReservationForm((current) => ({ ...current, guestEmail: event.target.value }))} placeholder="Guest email" />
                <input value={String(reservationForm.totalAmount)} onChange={(event) => setReservationForm((current) => ({ ...current, totalAmount: Number(event.target.value) }))} placeholder="Total amount" />
              </div>
              <button className="admin-primary-button" onClick={createReservation}>
                {t.createReservation}
              </button>
            </div>
            <div className="admin-card">
              <h2>Reservations</h2>
              {reservations.length ? (
                <ul className="admin-reservation-list">
                  {reservations.map((reservation) => (
                    <li key={reservation.id}>
                      <div>
                        <strong>{reservation.code}</strong>
                        <span>{reservation.guest.fullName}</span>
                        <small>
                          Room {reservation.room.number} - {formatCurrency(reservation.totalAmount, reservation.currency)}
                        </small>
                      </div>
                      <button className="admin-secondary-button" onClick={() => deleteReservation(reservation.id)}>
                        {t.deleteReservation}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="admin-empty">{t.emptyState}</p>
              )}
            </div>
          </section>
        ) : null}

        {selectedView === "branding" && hotelProfile ? (
          <section className="admin-panel admin-panel--two">
            <div className="admin-card">
              <h2>Branding</h2>
              <label><span>Welcome headline</span><input value={hotelProfile.branding.welcomeHeadline} onChange={(event) => setHotelProfile({ ...hotelProfile, branding: { ...hotelProfile.branding, welcomeHeadline: event.target.value } })} /></label>
              <label><span>Welcome subheadline</span><input value={hotelProfile.branding.welcomeSubheadline} onChange={(event) => setHotelProfile({ ...hotelProfile, branding: { ...hotelProfile.branding, welcomeSubheadline: event.target.value } })} /></label>
              <label><span>Primary color</span><input value={hotelProfile.branding.primaryColor} onChange={(event) => setHotelProfile({ ...hotelProfile, branding: { ...hotelProfile.branding, primaryColor: event.target.value } })} /></label>
              <label><span>Accent color</span><input value={hotelProfile.branding.accentColor} onChange={(event) => setHotelProfile({ ...hotelProfile, branding: { ...hotelProfile.branding, accentColor: event.target.value } })} /></label>
              <button className="admin-primary-button" onClick={saveBranding}>Save branding</button>
            </div>
            <div className="admin-card">
              <h2>Content</h2>
              <label><span>Support message</span><textarea value={hotelProfile.content.supportMessage} onChange={(event) => setHotelProfile({ ...hotelProfile, content: { ...hotelProfile.content, supportMessage: event.target.value } })} /></label>
              <label><span>Map URL</span><input value={hotelProfile.content.mapUrl} onChange={(event) => setHotelProfile({ ...hotelProfile, content: { ...hotelProfile.content, mapUrl: event.target.value } })} /></label>
              <button className="admin-primary-button" onClick={saveContent}>Save content</button>
            </div>
          </section>
        ) : null}

        {selectedView === "devices" ? (
          <section className="admin-panel">
            <div className="admin-card">
              <h2>Devices</h2>
              {devices.length ? (
                <ul className="admin-list">
                  {devices.map((device, index) => (
                    <li key={index}>{JSON.stringify(device)}</li>
                  ))}
                </ul>
              ) : (
                <p className="admin-empty">{t.emptyState}</p>
              )}
            </div>
          </section>
        ) : null}

        {selectedView === "audit" ? (
          <section className="admin-panel">
            <div className="admin-card">
              <h2>Audit</h2>
              {audit.length ? (
                <ul className="admin-list">
                  {audit.map((event, index) => (
                    <li key={index}>
                      <strong>{event.action}</strong>
                      <span>{event.result}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="admin-empty">{t.emptyState}</p>
              )}
            </div>
          </section>
        ) : null}

        {selectedView === "identity" ? (
          <section className="admin-panel">
            <div className="admin-card">
              <h2>Identity</h2>
              <p className="admin-empty">{t.emptyState}</p>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}

export default App;
