import { Session } from "../../domain/models";
import { MOCK_SESSION } from "./mocks";

interface SessionState {
  current: Session | null;
  lastCorrelationId: string | null;
}

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

// In-memory session state (would be replaced by Context/Redux in larger apps)
let sessionState: SessionState = {
  current: null,
  lastCorrelationId: null,
};

export const sessionRepository = {
  /**
   * Set current session
   */
  setCurrentSession(session: Session): void {
    sessionState.current = session;
    sessionState.lastCorrelationId = session.correlationId;
  },

  /**
   * Get current session
   */
  getCurrentSession(): Session | null {
    return sessionState.current;
  },

  /**
   * Get last correlation ID for debugging
   */
  getLastCorrelationId(): string | null {
    return sessionState.lastCorrelationId;
  },

  /**
   * Clear session
   */
  clearSession(): void {
    sessionState.current = null;
  },

  /**
   * Check if session is still valid
   */
  isSessionValid(): boolean {
    if (!sessionState.current) return false;
    const expiresAt = new Date(sessionState.current.expiresAt).getTime();
    const now = Date.now();
    return now < expiresAt;
  },
};
