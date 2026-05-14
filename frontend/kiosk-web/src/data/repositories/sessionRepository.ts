import { Session } from "../../domain/models";

interface SessionState {
  current: Session | null;
  lastCorrelationId: string | null;
}

// In-memory session state for the active kiosk session.
let sessionState: SessionState = {
  current: null,
  lastCorrelationId: null,
};

export const sessionRepository = {
  setCurrentSession(session: Session): void {
    sessionState.current = session;
    sessionState.lastCorrelationId = session.correlationId;
  },

  getCurrentSession(): Session | null {
    return sessionState.current;
  },

  getLastCorrelationId(): string | null {
    return sessionState.lastCorrelationId;
  },

  clearSession(): void {
    sessionState.current = null;
  },

  isSessionValid(): boolean {
    if (!sessionState.current) return false;
    const expiresAt = new Date(sessionState.current.expiresAt).getTime();
    const now = Date.now();
    return now < expiresAt;
  },
};
