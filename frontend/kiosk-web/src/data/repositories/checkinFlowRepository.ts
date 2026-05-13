import { ApiError } from "../../domain/errors";
import { Reservation, Session, SessionReservation } from "../../domain/models";
import { CheckinSearchType } from "../../domain/types";
import { checkinRepository } from "./checkinRepository";

export interface CheckinFlowRepository {
  createSession(language: string): Promise<Session>;
  searchReservation(searchType: CheckinSearchType, value: string): Promise<Reservation>;
  attachReservation(
    sessionId: number,
    searchType: CheckinSearchType,
    value: string
  ): Promise<SessionReservation>;
}

function firstReservationOrThrow(reservations: Reservation[], searchType: CheckinSearchType): Reservation {
  const reservation = reservations[0];

  if (!reservation) {
    throw new ApiError(
      "RESERVATION_NOT_FOUND",
      "Nao encontramos uma reserva com esses dados.",
      { searchType }
    );
  }

  return reservation;
}

export const checkinFlowRepository: CheckinFlowRepository = {
  createSession(language: string) {
    return checkinRepository.createSession("CHECKIN", language);
  },

  async searchReservation(searchType: CheckinSearchType, value: string) {
    const reservations = await checkinRepository.searchReservation(searchType, value);
    return firstReservationOrThrow(reservations, searchType);
  },

  attachReservation(sessionId: number, searchType: CheckinSearchType, value: string) {
    return checkinRepository.attachReservation(sessionId, value, searchType);
  },
};
