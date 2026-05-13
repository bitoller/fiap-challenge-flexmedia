import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { ApiError } from "../../../../domain/errors";
import { Reservation, Session, SessionReservation } from "../../../../domain/models";
import { CheckinSearchType } from "../../../../domain/types";
import { checkinFlowRepository } from "../../../../data/repositories/checkinFlowRepository";
import { sessionRepository } from "../../../../data/repositories/sessionRepository";

interface CheckinFlowContextValue {
  session: Session | null;
  reservation: Reservation | null;
  isLoading: boolean;
  error: ApiError | null;
  startIdentification: (
    searchType: CheckinSearchType,
    value: string,
    language: string
  ) => Promise<SessionReservation>;
  clearFlow: () => void;
  resetError: () => void;
}

const CheckinFlowContext = createContext<CheckinFlowContextValue | undefined>(undefined);

export function CheckinFlowProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const clearFlow = useCallback(() => {
    sessionRepository.clearSession();
    setSession(null);
    setReservation(null);
    setIsLoading(false);
    setError(null);
  }, []);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const startIdentification = useCallback(
    async (searchType: CheckinSearchType, value: string, language: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const createdSession = await checkinFlowRepository.createSession(language);
        sessionRepository.setCurrentSession(createdSession);
        setSession(createdSession);

        await checkinFlowRepository.searchReservation(searchType, value);
        const attachedSession = await checkinFlowRepository.attachReservation(
          createdSession.sessionId,
          searchType,
          value
        );

        sessionRepository.setCurrentSession(attachedSession);
        setSession(attachedSession);
        setReservation(attachedSession.reservation);

        return attachedSession;
      } catch (cause) {
        const apiError =
          cause instanceof ApiError
            ? cause
            : new ApiError("UNEXPECTED_ERROR", "Nao foi possivel concluir a operacao agora.");

        setError(apiError);
        throw apiError;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const value = useMemo<CheckinFlowContextValue>(
    () => ({
      session,
      reservation,
      isLoading,
      error,
      startIdentification,
      clearFlow,
      resetError,
    }),
    [clearFlow, error, isLoading, reservation, resetError, session, startIdentification]
  );

  return <CheckinFlowContext.Provider value={value}>{children}</CheckinFlowContext.Provider>;
}

export function useCheckinFlow() {
  const context = useContext(CheckinFlowContext);

  if (!context) {
    throw new Error("useCheckinFlow must be used within a CheckinFlowProvider");
  }

  return context;
}
