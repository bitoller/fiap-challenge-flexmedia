import type { Language } from "./types";

type DashboardCopy = {
  trendLabels: [string, string, string, string, string];
  metrics: {
    activeRoomsTitle: string;
    activeRoomsDetailSuffix: string;
    checkinsTitle: string;
    checkinsDetailSuffix: string;
    transactionTitle: string;
    transactionDetail: string;
    systemHealthTitle: string;
    systemHealthStable: string;
    systemHealthNoData: string;
    systemHealthDetailOnlineSuffix: string;
    systemHealthDetailOfSuffix: string;
  };
  activity: {
    noRecentActivityTitle: string;
    noRecentActivitySubtitle: string;
    hotelPrefix: string;
    allHotels: string;
    operationCompleted: string;
    operationNeedsAttention: string;
    eventPrefix: string;
  };
  units: {
    monitoringActive: string;
    batteryUnavailable: string;
    batterySuffix: string;
    frontLineSuffix: string;
    operationsSuffix: string;
    reception: string;
    guestFloors: string;
    operations: string;
    roomCirculation: string;
    adminOversight: string;
    online: string;
    review: string;
    stable: string;
    healthy: string;
    attention: string;
    observedDevices: string;
    checkInsCompleted: string;
    failures: string;
    selectedHotel: string;
  };
};

type OverviewCopy = {
  liveActivityLabel: string;
  performanceTitle: string;
  performanceSubtitle: string;
  trafficAndDemandLabel: string;
  trafficAndDemandSubtitle: string;
  manageFleetLabel: string;
  viewAllLogsLabel: string;
  exportDataLabel: string;
  viewLiveLabel: string;
  loadingLabel: string;
  noActivityLabel: string;
  noUnitsLabel: string;
  dashboard: DashboardCopy;
};

type ReservationsCopy = {
  title: string;
  help: string;
  createReservationLabel: string;
  deleteReservationLabel: string;
  hotelName: string;
  roomNumber: string;
  roomType: string;
  reservationCode: string;
  arrivalDate: string;
  departureDate: string;
  guestName: string;
  guestDocument: string;
  guestEmail: string;
  totalAmount: string;
  reservationsTitle: string;
  reservationId: string;
  status: string;
  eligibility: string;
  hotel: string;
  hotelId: string;
  room: string;
  roomStatus: string;
  guestDocumentLabel: string;
  guestBirthDate: string;
  guestPhone: string;
  currency: string;
  eligibilityReasons: string;
  noRestrictions: string;
  reservationCardKickerPrefix: string;
  readyForKiosk: string;
  receptionRequired: string;
  eligibilityNotes: string;
  roomFooterPrefix: string;
  reservationForm: {
    hotelNamePlaceholder: string;
    roomNumberPlaceholder: string;
    roomTypePlaceholder: string;
    reservationCodePlaceholder: string;
    guestNamePlaceholder: string;
    guestDocumentPlaceholder: string;
    guestEmailPlaceholder: string;
    totalAmountPlaceholder: string;
  };
};

type DevicesCopy = {
  heroKicker: string;
  heroTitle: string;
  heroSubtitleWithHotel: string;
  heroSubtitleFallback: string;
  refreshFleet: string;
  totalActiveKiosks: string;
  allSystemsOperational: string;
  averageConnectivity: string;
  noActiveDevices: string;
  alertsPending: string;
  attentionNeeded: string;
  noCriticalTasks: string;
  fleetStatus: string;
  liveStatus: string;
  batteryUnavailable: string;
  online: string;
  offline: string;
  printer: string;
  camera: string;
  battery: string;
  lastSeen: string;
  deviceCode: string;
  status: string;
  batteryLevel: string;
  hideDetails: string;
  details: string;
  updated: string;
  allProperties: string;
  units: string;
  pending: string;
};

type AuditCopy = {
  trailKicker: string;
  title: string;
  subtitle: string;
  refreshLogs: string;
  securityAlerts: string;
  systemErrors: string;
  uxInteractions: string;
  activeEvents: string;
  highPriorityEvents: string;
  hardwareIssues: string;
  guestFacingOperations: string;
  successfulActions: string;
  filterAll: string;
  filterSecurity: string;
  filterSystem: string;
  filterUx: string;
  sortBy: string;
  mostRecent: string;
  oldest: string;
  entry: string;
  referenceId: string;
  category: string;
  details: string;
  status: string;
  showing: string;
  of: string;
  recentEntries: string;
  allEvents: string;
  security: string;
  system: string;
  ux: string;
  noCorrelation: string;
  resource: string;
};

type BrandingCopy = {
  titleKicker: string;
  title: string;
  intro: string;
  saveBranding: string;
  presetsTitle: string;
  presetsIntro: string;
  noPresets: string;
  apply: string;
  remove: string;
  saveCurrentAsPresetLabel: string;
  presetNamePlaceholder: string;
  savePreset: string;
  colorsKicker: string;
  adjustIdentity: string;
  colorsIntro: string;
  onlyPalette: string;
  livePreview: string;
  previewNote: string;
  currentPalette: string;
  active: string;
  appliedPreset: string;
  customTheme: string;
  fieldLabels: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    surfaceColor: string;
    textColor: string;
  };
  fieldHelp: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    surfaceColor: string;
    textColor: string;
  };
  fieldNotes: {
    previewUpdates: string;
  };
  previewSwatches: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    surfaceColor: string;
    textColor: string;
  };
  previewFooter: string;
};

type IdentityCopy = {
  title: string;
  message: string;
};

type AdminCopyShape = {
  portal: string;
  loginTitle: string;
  loginSubtitle: string;
  username: string;
  password: string;
  login: string;
  languageSelectorLabel: string;
  languages: Record<Language, string>;
  hotelContext: string;
  overview: string;
  reservations: string;
  branding: string;
  devices: string;
  audit: string;
  identity: string;
  testArea: string;
  createReservation: string;
  deleteReservation: string;
  logout: string;
  emptyState: string;
  chooseHotel: string;
  role: string;
  refresh: string;
  saveBranding: string;
  saveContent: string;
  messages: {
    loadPortalData: string;
    loginFailed: string;
    refreshOverviewData: string;
    reservationCreated: string;
    createReservationFailed: string;
    confirmDeleteReservation: string;
    reservationDeleted: string;
    deleteReservationFailed: string;
    networkUnavailable: string;
    sessionExpired: string;
    invalidCredentials: string;
    serviceUnavailable: string;
    unexpectedError: string;
    reloadPage: string;
    goToLogin: string;
  };
  overviewPage: OverviewCopy;
  reservationsPage: ReservationsCopy;
  devicesPage: DevicesCopy;
  auditPage: AuditCopy;
  brandingPage: BrandingCopy;
  identityPage: IdentityCopy;
};

const en: AdminCopyShape = {
  portal: "L'Eclat Administration",
  loginTitle: "Administrator access",
  loginSubtitle: "Sign in to manage hotels, reservations, and operational views.",
  username: "Username",
  password: "Password",
  login: "Sign in",
  languageSelectorLabel: "Language selector",
  languages: {
    en: "English",
    "pt-BR": "Portuguese",
    es: "Spanish",
  },
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
  refresh: "Refresh overview",
  saveBranding: "Save branding",
  saveContent: "Save content",
    messages: {
      loadPortalData: "Failed to load portal data.",
      loginFailed: "Login failed.",
      refreshOverviewData: "Failed to refresh overview data.",
      reservationCreated: "Reservation {code} created.",
      createReservationFailed: "Failed to create reservation.",
      confirmDeleteReservation: "Do you really want to delete this reservation?",
      reservationDeleted: "Reservation deleted.",
      deleteReservationFailed: "Failed to delete reservation.",
      networkUnavailable: "The admin service is unavailable right now.",
      sessionExpired: "Your session has expired. Please sign in again.",
      invalidCredentials: "The username or password is incorrect.",
      serviceUnavailable: "The admin service is temporarily unavailable. Please try again.",
      unexpectedError: "Something went wrong while loading this page.",
      reloadPage: "Reload page",
      goToLogin: "Go to login",
    },
  overviewPage: {
    liveActivityLabel: "Live activity",
    performanceTitle: "Performance by unit",
    performanceSubtitle: "Monitoring individual kiosk zones and operational areas.",
    trafficAndDemandLabel: "Traffic and demand",
    trafficAndDemandSubtitle: "A lightweight operational trend built from the selected hotel's live metrics.",
    manageFleetLabel: "Manage fleet",
    viewAllLogsLabel: "View all logs",
    exportDataLabel: "Export data",
    viewLiveLabel: "View live",
    loadingLabel: "Loading overview data...",
    noActivityLabel: "No recent operational activity for this hotel yet.",
    noUnitsLabel: "No unit data available for this hotel yet.",
    dashboard: {
      trendLabels: ["00:00", "06:00", "12:00", "18:00", "Now"],
      metrics: {
        activeRoomsTitle: "Active rooms",
        activeRoomsDetailSuffix: "reservations today",
        checkinsTitle: "Daily check-ins",
        checkinsDetailSuffix: "check-outs",
        transactionTitle: "Average transaction",
        transactionDetail: "Estimated time per interaction",
        systemHealthTitle: "System health",
        systemHealthStable: "Stable",
        systemHealthNoData: "No data",
        systemHealthDetailOnlineSuffix: "online",
        systemHealthDetailOfSuffix: "of",
      },
      activity: {
        noRecentActivityTitle: "No recent activity",
        noRecentActivitySubtitle: "The overview will list operational events here as they arrive.",
        hotelPrefix: "Hotel",
        allHotels: "All hotels",
        operationCompleted: "operation completed",
        operationNeedsAttention: "operation needs attention",
        eventPrefix: "Event",
      },
      units: {
        monitoringActive: "Monitoring active",
        batteryUnavailable: "Battery N/A",
        batterySuffix: "battery",
        frontLineSuffix: "front line",
        operationsSuffix: "operations",
        reception: "Reception",
        guestFloors: "Guest floors",
        operations: "Operations",
        roomCirculation: "Room circulation",
        adminOversight: "Admin oversight",
        online: "Online",
        review: "Review",
        stable: "Stable",
        healthy: "Healthy",
        attention: "Attention",
        observedDevices: "devices observed",
        checkInsCompleted: "check-ins completed",
        failures: "failures",
        selectedHotel: "Selected hotel",
      },
    },
  },
  reservationsPage: {
    title: "Reservation test area",
    help: "Create and remove real reservations persisted in Oracle.",
    createReservationLabel: "Create reservation",
    deleteReservationLabel: "Delete",
    hotelName: "Hotel name",
    roomNumber: "Room number",
    roomType: "Room type",
    reservationCode: "Reservation code",
    arrivalDate: "Arrival date",
    departureDate: "Departure date",
    guestName: "Guest name",
    guestDocument: "Guest document",
    guestEmail: "Guest email",
    totalAmount: "Total amount",
    reservationsTitle: "Reservations",
    reservationId: "Reservation ID",
    status: "Status",
    eligibility: "Eligibility",
    hotel: "Hotel",
    hotelId: "Hotel ID",
    room: "Room",
    roomStatus: "Room status",
    guestDocumentLabel: "Guest document",
    guestBirthDate: "Guest birth date",
    guestPhone: "Guest phone",
    currency: "Currency",
    eligibilityReasons: "Eligibility reasons",
    noRestrictions: "No restrictions",
    reservationCardKickerPrefix: "Reservation",
    readyForKiosk: "Ready for kiosk",
    receptionRequired: "Reception required",
    eligibilityNotes: "Eligibility notes",
    roomFooterPrefix: "Room",
    reservationForm: {
      hotelNamePlaceholder: "Flex Hotel Paulista",
      roomNumberPlaceholder: "1208",
      roomTypePlaceholder: "DELUXE",
      reservationCodePlaceholder: "Optional code",
      guestNamePlaceholder: "Full guest name",
      guestDocumentPlaceholder: "Document number",
      guestEmailPlaceholder: "guest@example.com",
      totalAmountPlaceholder: "980",
    },
  },
  devicesPage: {
    heroKicker: "Network operations center",
    heroTitle: "Device status and monitoring",
    heroSubtitleWithHotel: "Fleet overview for {hotelName}",
    heroSubtitleFallback: "Fleet overview for the selected hotel, with live operational health and kiosk status.",
    refreshFleet: "Refresh devices",
    totalActiveKiosks: "Total active kiosks",
    allSystemsOperational: "All systems operational",
    averageConnectivity: "Average connectivity",
    noActiveDevices: "No active devices",
    alertsPending: "Alerts pending",
    attentionNeeded: "Attention needed",
    noCriticalTasks: "No critical tasks",
    fleetStatus: "Kiosk fleet status",
    liveStatus: "Live monitoring",
    batteryUnavailable: "Battery N/A",
    online: "Online",
    offline: "Offline",
    printer: "Printer",
    camera: "Camera",
    battery: "Battery",
    lastSeen: "Last seen",
    deviceCode: "Device code",
    status: "Status",
    batteryLevel: "Battery level",
    hideDetails: "Hide details",
    details: "Details",
    updated: "Updated",
    allProperties: "All properties",
    units: "units",
    pending: "pending",
  },
  auditPage: {
    trailKicker: "Audit trail",
    title: "Operational events",
    subtitle: "Real-time history of security, system, and guest-flow events for the selected hotel.",
    refreshLogs: "Refresh logs",
    securityAlerts: "Security alerts",
    systemErrors: "System errors",
    uxInteractions: "UX interactions",
    activeEvents: "Active events",
    highPriorityEvents: "High priority events",
    hardwareIssues: "Hardware or platform issues",
    guestFacingOperations: "Guest-facing operations",
    successfulActions: "Successful actions in view",
    filterAll: "All events",
    filterSecurity: "Security",
    filterSystem: "System",
    filterUx: "UX interactions",
    sortBy: "Sort by",
    mostRecent: "Most recent",
    oldest: "Oldest",
    entry: "Entry",
    referenceId: "Reference ID",
    category: "Category",
    details: "Details",
    status: "Status",
    showing: "Showing",
    of: "of",
    recentEntries: "recent entries",
    allEvents: "All",
    security: "Security",
    system: "System",
    ux: "UX",
    noCorrelation: "No correlation",
    resource: "Resource",
  },
  brandingPage: {
    titleKicker: "Branding",
    title: "Brand palette",
    intro: "Pick a preset, tweak the palette, and save when the hotel feels right.",
    saveBranding: "Save branding",
    presetsTitle: "Presets",
    presetsIntro: "Choose a saved palette or store the current one as a new preset.",
    noPresets: "No presets yet. Save one to keep it around.",
    apply: "Apply",
    remove: "Remove",
    saveCurrentAsPresetLabel: "Save current palette as a preset",
    presetNamePlaceholder: "Example: Sunset Terrace",
    savePreset: "Save preset",
    colorsKicker: "Colors",
    adjustIdentity: "Adjust the identity",
    colorsIntro: "Only the palette changes. The pages keep the same layout.",
    onlyPalette: "Only the palette changes.",
    livePreview: "Live preview",
    previewNote: "The layout stays the same. Only the colors change.",
    currentPalette: "Current palette",
    active: "Active",
    appliedPreset: "Applied preset",
    customTheme: "Custom theme",
    fieldLabels: {
      primaryColor: "Primary color",
      secondaryColor: "Secondary color",
      accentColor: "Accent color",
      surfaceColor: "Surface color",
      textColor: "Text color",
    },
    fieldHelp: {
      primaryColor: "Buttons, active states, and main accents.",
      secondaryColor: "Soft backgrounds and supporting areas.",
      accentColor: "Highlights, badges, and details.",
      surfaceColor: "Cards, panels, and content surfaces.",
      textColor: "Headings and body text.",
    },
    fieldNotes: {
      previewUpdates: "Updates the preview immediately.",
    },
    previewSwatches: {
      primaryColor: "Primary color",
      secondaryColor: "Secondary color",
      accentColor: "Accent color",
      surfaceColor: "Surface color",
      textColor: "Text color",
    },
    previewFooter: "Apply a preset, refine the palette, and save a new variation if needed.",
  },
  identityPage: {
    title: "Identity",
    message: "No identity settings are available yet.",
  },
};

const ptBR: AdminCopyShape = {
  portal: "L'Eclat Administration",
  loginTitle: "Acesso administrativo",
  loginSubtitle: "Entre para gerenciar hotéis, reservas e visões operacionais.",
  username: "Usuário",
  password: "Senha",
  login: "Entrar",
  languageSelectorLabel: "Seletor de idioma",
  languages: {
    en: "Inglês",
    "pt-BR": "Português",
    es: "Espanhol",
  },
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
  refresh: "Atualizar overview",
  saveBranding: "Salvar branding",
  saveContent: "Salvar conteúdo",
    messages: {
      loadPortalData: "Não foi possível carregar os dados do portal.",
      loginFailed: "Falha no login.",
      refreshOverviewData: "Não foi possível atualizar os dados do overview.",
      reservationCreated: "Reserva {code} criada.",
      createReservationFailed: "Não foi possível criar a reserva.",
      confirmDeleteReservation: "Você realmente quer excluir esta reserva?",
      reservationDeleted: "Reserva excluída.",
      deleteReservationFailed: "Não foi possível excluir a reserva.",
      networkUnavailable: "O serviço administrativo não está disponível no momento.",
      sessionExpired: "Sua sessão expirou. Entre novamente.",
      invalidCredentials: "Usuário ou senha incorretos.",
      serviceUnavailable: "O serviço administrativo está temporariamente indisponível. Tente novamente.",
      unexpectedError: "Algo deu errado ao carregar esta página.",
      reloadPage: "Recarregar página",
      goToLogin: "Ir para o login",
    },
  overviewPage: {
    liveActivityLabel: "Atividade ao vivo",
    performanceTitle: "Desempenho por unidade",
    performanceSubtitle: "Monitoramento das zonas e áreas operacionais do hotel.",
    trafficAndDemandLabel: "Tráfego e demanda",
    trafficAndDemandSubtitle: "Tendência operacional leve baseada nos indicadores ao vivo do hotel selecionado.",
    manageFleetLabel: "Gerenciar frota",
    viewAllLogsLabel: "Ver todos os logs",
    exportDataLabel: "Exportar dados",
    viewLiveLabel: "Ver ao vivo",
    loadingLabel: "Carregando dados do overview...",
    noActivityLabel: "Nenhuma atividade operacional recente para este hotel.",
    noUnitsLabel: "Nenhum dado de unidade disponível para este hotel.",
    dashboard: {
      trendLabels: ["00:00", "06:00", "12:00", "18:00", "Agora"],
      metrics: {
        activeRoomsTitle: "Quartos ativos",
        activeRoomsDetailSuffix: "reservas hoje",
        checkinsTitle: "Check-ins diários",
        checkinsDetailSuffix: "check-outs",
        transactionTitle: "Transação média",
        transactionDetail: "Tempo estimado por interação",
        systemHealthTitle: "Saúde do sistema",
        systemHealthStable: "Estável",
        systemHealthNoData: "Sem dados",
        systemHealthDetailOnlineSuffix: "online",
        systemHealthDetailOfSuffix: "de",
      },
      activity: {
        noRecentActivityTitle: "Nenhuma atividade recente",
        noRecentActivitySubtitle: "O overview vai listar os eventos operacionais aqui conforme eles chegam.",
        hotelPrefix: "Hotel",
        allHotels: "Todos os hotéis",
        operationCompleted: "operação concluída",
        operationNeedsAttention: "operação precisa de atenção",
        eventPrefix: "Evento",
      },
      units: {
        monitoringActive: "Monitoramento ativo",
        batteryUnavailable: "Bateria N/D",
        batterySuffix: "bateria",
        frontLineSuffix: "linha de frente",
        operationsSuffix: "operações",
        reception: "Recepção",
        guestFloors: "Andares dos hóspedes",
        operations: "Operações",
        roomCirculation: "Circulação de quartos",
        adminOversight: "Supervisão administrativa",
        online: "Online",
        review: "Revisar",
        stable: "Estável",
        healthy: "Saudável",
        attention: "Atenção",
        observedDevices: "dispositivos observados",
        checkInsCompleted: "check-ins concluídos",
        failures: "falhas",
        selectedHotel: "Hotel selecionado",
      },
    },
  },
  reservationsPage: {
    title: "Área de testes de reservas",
    help: "Crie e remova reservas reais persistidas no Oracle.",
    createReservationLabel: "Criar reserva",
    deleteReservationLabel: "Excluir",
    hotelName: "Nome do hotel",
    roomNumber: "Número do quarto",
    roomType: "Tipo de quarto",
    reservationCode: "Código da reserva",
    arrivalDate: "Data de chegada",
    departureDate: "Data de saída",
    guestName: "Nome do hóspede",
    guestDocument: "Documento do hóspede",
    guestEmail: "E-mail do hóspede",
    totalAmount: "Valor total",
    reservationsTitle: "Reservas",
    reservationId: "ID da reserva",
    status: "Status",
    eligibility: "Elegibilidade",
    hotel: "Hotel",
    hotelId: "ID do hotel",
    room: "Quarto",
    roomStatus: "Status do quarto",
    guestDocumentLabel: "Documento do hóspede",
    guestBirthDate: "Data de nascimento",
    guestPhone: "Telefone do hóspede",
    currency: "Moeda",
    eligibilityReasons: "Motivos da elegibilidade",
    noRestrictions: "Sem restrições",
    reservationCardKickerPrefix: "Reserva",
    readyForKiosk: "Pronta para o kiosk",
    receptionRequired: "Recepção necessária",
    eligibilityNotes: "Observações de elegibilidade",
    roomFooterPrefix: "Quarto",
    reservationForm: {
      hotelNamePlaceholder: "Flex Hotel Paulista",
      roomNumberPlaceholder: "1208",
      roomTypePlaceholder: "DELUXE",
      reservationCodePlaceholder: "Código opcional",
      guestNamePlaceholder: "Nome completo do hóspede",
      guestDocumentPlaceholder: "Número do documento",
      guestEmailPlaceholder: "hospede@exemplo.com",
      totalAmountPlaceholder: "980",
    },
  },
  devicesPage: {
    heroKicker: "Central de operações de rede",
    heroTitle: "Status e monitoramento dos dispositivos",
    heroSubtitleWithHotel: "Visão da frota para {hotelName}",
    heroSubtitleFallback: "Visão da frota do hotel selecionado, com saúde operacional e status dos kiosks em tempo real.",
    refreshFleet: "Atualizar dispositivos",
    totalActiveKiosks: "Total de kiosks ativos",
    allSystemsOperational: "Todos os sistemas operacionais",
    averageConnectivity: "Conectividade média",
    noActiveDevices: "Nenhum dispositivo ativo",
    alertsPending: "Alertas pendentes",
    attentionNeeded: "Atenção necessária",
    noCriticalTasks: "Nenhuma tarefa crítica",
    fleetStatus: "Status da frota de kiosks",
    liveStatus: "Monitoramento ao vivo",
    batteryUnavailable: "Bateria N/D",
    online: "Online",
    offline: "Offline",
    printer: "Impressora",
    camera: "Câmera",
    battery: "Bateria",
    lastSeen: "Última visualização",
    deviceCode: "Código do dispositivo",
    status: "Status",
    batteryLevel: "Nível de bateria",
    hideDetails: "Ocultar detalhes",
    details: "Detalhes",
    updated: "Atualizado",
    allProperties: "Todas as propriedades",
    units: "unidades",
    pending: "pendentes",
  },
  auditPage: {
    trailKicker: "Trilha de auditoria",
    title: "Eventos operacionais",
    subtitle: "Histórico em tempo real de eventos de segurança, sistema e fluxo de hóspedes do hotel selecionado.",
    refreshLogs: "Atualizar logs",
    securityAlerts: "Alertas de segurança",
    systemErrors: "Erros de sistema",
    uxInteractions: "Interações de UX",
    activeEvents: "Eventos ativos",
    highPriorityEvents: "Eventos de alta prioridade",
    hardwareIssues: "Problemas de hardware ou plataforma",
    guestFacingOperations: "Operações voltadas ao hóspede",
    successfulActions: "Ações bem-sucedidas em vista",
    filterAll: "Todos os eventos",
    filterSecurity: "Segurança",
    filterSystem: "Sistema",
    filterUx: "Interações de UX",
    sortBy: "Ordenar por",
    mostRecent: "Mais recentes",
    oldest: "Mais antigas",
    entry: "Entrada",
    referenceId: "ID de referência",
    category: "Categoria",
    details: "Detalhes",
    status: "Status",
    showing: "Exibindo",
    of: "de",
    recentEntries: "entradas recentes",
    allEvents: "Todos",
    security: "Segurança",
    system: "Sistema",
    ux: "UX",
    noCorrelation: "Sem correlação",
    resource: "Recurso",
  },
  brandingPage: {
    titleKicker: "Branding",
    title: "Paleta da marca",
    intro: "Escolha um preset, ajuste a paleta e salve quando o hotel ficar com a cara certa.",
    saveBranding: "Salvar branding",
    presetsTitle: "Presets",
    presetsIntro: "Escolha uma paleta salva ou guarde a atual como um novo preset.",
    noPresets: "Ainda não há presets. Salve um para mantê-lo disponível.",
    apply: "Aplicar",
    remove: "Remover",
    saveCurrentAsPresetLabel: "Salvar a paleta atual como preset",
    presetNamePlaceholder: "Exemplo: Terraço do pôr do sol",
    savePreset: "Salvar preset",
    colorsKicker: "Cores",
    adjustIdentity: "Ajustar identidade",
    colorsIntro: "Só a paleta muda. As páginas mantêm o mesmo layout.",
    onlyPalette: "Só a paleta muda.",
    livePreview: "Pré-visualização ao vivo",
    previewNote: "O layout permanece igual. Apenas as cores mudam.",
    currentPalette: "Paleta atual",
    active: "Ativo",
    appliedPreset: "Preset aplicado",
    customTheme: "Tema personalizado",
    fieldLabels: {
      primaryColor: "Cor principal",
      secondaryColor: "Cor secundária",
      accentColor: "Cor de destaque",
      surfaceColor: "Cor da superfície",
      textColor: "Cor do texto",
    },
    fieldHelp: {
      primaryColor: "Botões, estados ativos e destaques principais.",
      secondaryColor: "Fundos suaves e áreas de apoio.",
      accentColor: "Realces, badges e detalhes.",
      surfaceColor: "Cards, painéis e superfícies de conteúdo.",
      textColor: "Títulos e textos de corpo.",
    },
    fieldNotes: {
      previewUpdates: "Atualiza a prévia imediatamente.",
    },
    previewSwatches: {
      primaryColor: "Cor principal",
      secondaryColor: "Cor secundária",
      accentColor: "Cor de destaque",
      surfaceColor: "Cor da superfície",
      textColor: "Cor do texto",
    },
    previewFooter: "Aplique um preset, refine a paleta e salve uma nova variação se precisar.",
  },
  identityPage: {
    title: "Identidade",
    message: "Nenhuma configuração de identidade está disponível ainda.",
  },
};

const es: AdminCopyShape = {
  portal: "L'Eclat Administration",
  loginTitle: "Acceso administrativo",
  loginSubtitle: "Ingrese para gestionar hoteles, reservas y vistas operativas.",
  username: "Usuario",
  password: "Contraseña",
  login: "Ingresar",
  languageSelectorLabel: "Selector de idioma",
  languages: {
    en: "Inglés",
    "pt-BR": "Portugués",
    es: "Español",
  },
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
  refresh: "Actualizar resumen",
  saveBranding: "Guardar branding",
  saveContent: "Guardar contenido",
    messages: {
      loadPortalData: "No se pudieron cargar los datos del portal.",
      loginFailed: "Error al iniciar sesión.",
      refreshOverviewData: "No se pudieron actualizar los datos del resumen.",
      reservationCreated: "Reserva {code} creada.",
      createReservationFailed: "No se pudo crear la reserva.",
      confirmDeleteReservation: "¿Realmente desea eliminar esta reserva?",
      reservationDeleted: "Reserva eliminada.",
      deleteReservationFailed: "No se pudo eliminar la reserva.",
      networkUnavailable: "El servicio administrativo no está disponible ahora.",
      sessionExpired: "Su sesión expiró. Inicie sesión nuevamente.",
      invalidCredentials: "El usuario o la contraseña son incorrectos.",
      serviceUnavailable: "El servicio administrativo no está disponible temporalmente. Inténtelo de nuevo.",
      unexpectedError: "Algo salió mal al cargar esta página.",
      reloadPage: "Recargar página",
      goToLogin: "Ir al inicio de sesión",
    },
  overviewPage: {
    liveActivityLabel: "Actividad en vivo",
    performanceTitle: "Rendimiento por unidad",
    performanceSubtitle: "Monitoreo de zonas y áreas operativas del hotel.",
    trafficAndDemandLabel: "Tráfico y demanda",
    trafficAndDemandSubtitle: "Una tendencia operativa ligera basada en las métricas en vivo del hotel seleccionado.",
    manageFleetLabel: "Gestionar flota",
    viewAllLogsLabel: "Ver todos los registros",
    exportDataLabel: "Exportar datos",
    viewLiveLabel: "Ver en vivo",
    loadingLabel: "Cargando datos del resumen...",
    noActivityLabel: "Todavía no hay actividad operativa reciente para este hotel.",
    noUnitsLabel: "Todavía no hay datos de unidades para este hotel.",
    dashboard: {
      trendLabels: ["00:00", "06:00", "12:00", "18:00", "Ahora"],
      metrics: {
        activeRoomsTitle: "Habitaciones activas",
        activeRoomsDetailSuffix: "reservas hoy",
        checkinsTitle: "Check-ins diarios",
        checkinsDetailSuffix: "check-outs",
        transactionTitle: "Transacción media",
        transactionDetail: "Tiempo estimado por interacción",
        systemHealthTitle: "Salud del sistema",
        systemHealthStable: "Estable",
        systemHealthNoData: "Sin datos",
        systemHealthDetailOnlineSuffix: "en línea",
        systemHealthDetailOfSuffix: "de",
      },
      activity: {
        noRecentActivityTitle: "Sin actividad reciente",
        noRecentActivitySubtitle: "El resumen mostrará aquí los eventos operativos a medida que lleguen.",
        hotelPrefix: "Hotel",
        allHotels: "Todos los hoteles",
        operationCompleted: "operación completada",
        operationNeedsAttention: "operación requiere atención",
        eventPrefix: "Evento",
      },
      units: {
        monitoringActive: "Monitoreo activo",
        batteryUnavailable: "Batería N/D",
        batterySuffix: "batería",
        frontLineSuffix: "primera línea",
        operationsSuffix: "operaciones",
        reception: "Recepción",
        guestFloors: "Pisos de huéspedes",
        operations: "Operaciones",
        roomCirculation: "Circulación de habitaciones",
        adminOversight: "Supervisión administrativa",
        online: "En línea",
        review: "Revisar",
        stable: "Estable",
        healthy: "Saludable",
        attention: "Atención",
        observedDevices: "dispositivos observados",
        checkInsCompleted: "check-ins completados",
        failures: "fallos",
        selectedHotel: "Hotel seleccionado",
      },
    },
  },
  reservationsPage: {
    title: "Área de pruebas de reservas",
    help: "Cree y elimine reservas reales persistidas en Oracle.",
    createReservationLabel: "Crear reserva",
    deleteReservationLabel: "Eliminar",
    hotelName: "Nombre del hotel",
    roomNumber: "Número de habitación",
    roomType: "Tipo de habitación",
    reservationCode: "Código de reserva",
    arrivalDate: "Fecha de llegada",
    departureDate: "Fecha de salida",
    guestName: "Nombre del huésped",
    guestDocument: "Documento del huésped",
    guestEmail: "Correo del huésped",
    totalAmount: "Importe total",
    reservationsTitle: "Reservas",
    reservationId: "ID de reserva",
    status: "Estado",
    eligibility: "Elegibilidad",
    hotel: "Hotel",
    hotelId: "ID del hotel",
    room: "Habitación",
    roomStatus: "Estado de la habitación",
    guestDocumentLabel: "Documento del huésped",
    guestBirthDate: "Fecha de nacimiento",
    guestPhone: "Teléfono del huésped",
    currency: "Moneda",
    eligibilityReasons: "Motivos de elegibilidad",
    noRestrictions: "Sin restricciones",
    reservationCardKickerPrefix: "Reserva",
    readyForKiosk: "Lista para kiosco",
    receptionRequired: "Recepción requerida",
    eligibilityNotes: "Notas de elegibilidad",
    roomFooterPrefix: "Habitación",
    reservationForm: {
      hotelNamePlaceholder: "Flex Hotel Paulista",
      roomNumberPlaceholder: "1208",
      roomTypePlaceholder: "DELUXE",
      reservationCodePlaceholder: "Código opcional",
      guestNamePlaceholder: "Nombre completo del huésped",
      guestDocumentPlaceholder: "Número de documento",
      guestEmailPlaceholder: "huesped@ejemplo.com",
      totalAmountPlaceholder: "980",
    },
  },
  devicesPage: {
    heroKicker: "Centro de operaciones de red",
    heroTitle: "Estado y monitoreo de dispositivos",
    heroSubtitleWithHotel: "Resumen de flota para {hotelName}",
    heroSubtitleFallback: "Resumen de flota del hotel seleccionado, con salud operativa y estado de kioscos en vivo.",
    refreshFleet: "Actualizar dispositivos",
    totalActiveKiosks: "Total de kioscos activos",
    allSystemsOperational: "Todos los sistemas operativos",
    averageConnectivity: "Conectividad media",
    noActiveDevices: "Sin dispositivos activos",
    alertsPending: "Alertas pendientes",
    attentionNeeded: "Se necesita atención",
    noCriticalTasks: "No hay tareas críticas",
    fleetStatus: "Estado de la flota de kioscos",
    liveStatus: "Monitoreo en vivo",
    batteryUnavailable: "Batería N/D",
    online: "En línea",
    offline: "Sin conexión",
    printer: "Impresora",
    camera: "Cámara",
    battery: "Batería",
    lastSeen: "Última vez visto",
    deviceCode: "Código del dispositivo",
    status: "Estado",
    batteryLevel: "Nivel de batería",
    hideDetails: "Ocultar detalles",
    details: "Detalles",
    updated: "Actualizado",
    allProperties: "Todas las propiedades",
    units: "unidades",
    pending: "pendientes",
  },
  auditPage: {
    trailKicker: "Trazabilidad de auditoría",
    title: "Eventos operativos",
    subtitle: "Historial en tiempo real de eventos de seguridad, sistema y flujo de huéspedes del hotel seleccionado.",
    refreshLogs: "Actualizar registros",
    securityAlerts: "Alertas de seguridad",
    systemErrors: "Errores del sistema",
    uxInteractions: "Interacciones de UX",
    activeEvents: "Eventos activos",
    highPriorityEvents: "Eventos de alta prioridad",
    hardwareIssues: "Problemas de hardware o plataforma",
    guestFacingOperations: "Operaciones orientadas al huésped",
    successfulActions: "Acciones exitosas en vista",
    filterAll: "Todos los eventos",
    filterSecurity: "Seguridad",
    filterSystem: "Sistema",
    filterUx: "Interacciones de UX",
    sortBy: "Ordenar por",
    mostRecent: "Más recientes",
    oldest: "Más antiguos",
    entry: "Entrada",
    referenceId: "ID de referencia",
    category: "Categoría",
    details: "Detalles",
    status: "Estado",
    showing: "Mostrando",
    of: "de",
    recentEntries: "entradas recientes",
    allEvents: "Todos",
    security: "Seguridad",
    system: "Sistema",
    ux: "UX",
    noCorrelation: "Sin correlación",
    resource: "Recurso",
  },
  brandingPage: {
    titleKicker: "Branding",
    title: "Paleta de marca",
    intro: "Elija un preset, ajuste la paleta y guarde cuando el hotel se sienta correcto.",
    saveBranding: "Guardar branding",
    presetsTitle: "Presets",
    presetsIntro: "Elija una paleta guardada o guarde la actual como un nuevo preset.",
    noPresets: "Aún no hay presets. Guarde uno para mantenerlo disponible.",
    apply: "Aplicar",
    remove: "Eliminar",
    saveCurrentAsPresetLabel: "Guardar la paleta actual como preset",
    presetNamePlaceholder: "Ejemplo: Terraza al atardecer",
    savePreset: "Guardar preset",
    colorsKicker: "Colores",
    adjustIdentity: "Ajustar identidad",
    colorsIntro: "Solo cambia la paleta. Las páginas mantienen el mismo diseño.",
    onlyPalette: "Solo cambia la paleta.",
    livePreview: "Vista previa en vivo",
    previewNote: "El diseño permanece igual. Solo cambian los colores.",
    currentPalette: "Paleta actual",
    active: "Activo",
    appliedPreset: "Preset aplicado",
    customTheme: "Tema personalizado",
    fieldLabels: {
      primaryColor: "Color principal",
      secondaryColor: "Color secundario",
      accentColor: "Color de acento",
      surfaceColor: "Color de superficie",
      textColor: "Color del texto",
    },
    fieldHelp: {
      primaryColor: "Botones, estados activos y acentos principales.",
      secondaryColor: "Fondos suaves y áreas de apoyo.",
      accentColor: "Resaltes, badges y detalles.",
      surfaceColor: "Tarjetas, paneles y superficies de contenido.",
      textColor: "Títulos y textos de cuerpo.",
    },
    fieldNotes: {
      previewUpdates: "Actualiza la vista previa de inmediato.",
    },
    previewSwatches: {
      primaryColor: "Color principal",
      secondaryColor: "Color secundario",
      accentColor: "Color de acento",
      surfaceColor: "Color de superficie",
      textColor: "Color del texto",
    },
    previewFooter: "Aplique un preset, refine la paleta y guarde una nueva variación si es necesario.",
  },
  identityPage: {
    title: "Identidad",
    message: "Todavía no hay configuraciones de identidad disponibles.",
  },
};

export const COPY: Record<Language, AdminCopyShape> = {
  en,
  "pt-BR": ptBR,
  es,
};

export type AdminCopy = AdminCopyShape;
