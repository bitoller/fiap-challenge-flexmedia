import { Reservation, Session, SessionReservation, CompleteCheckinResponse } from "../../domain/models";
import { TimeoutError, ApiError } from "../../domain/errors";
import { KIOSK_CONFIG } from "../../core/constants";
import { apiPost, apiGet } from "../api/client";
import { API_ENDPOINTS, buildUrl } from "../api/endpoints";
import {
  sessionResponseInterceptor,
  sessionReservationResponseInterceptor,
  completeCheckinResponseInterceptor,
  createSessionRequestInterceptor,
  attachReservationRequestInterceptor,
  guestConfirmationRequestInterceptor,
  registrationConsentRequestInterceptor,
  completeCheckinRequestInterceptor,
} from "../api/interceptors";
import {
  MOCK_SESSION,
  MOCK_RESERVATION_SUCCESS,
  MOCK_RESERVATION_NOT_FOUND,
  MOCK_RESERVATION_INVALID_DOCUMENT,
  MOCK_COMPLETE_CHECKIN_RESPONSE,
  MOCK_PAYMENT_DECLINED,
  MOCK_SCENARIOS,
} from "./mocks";

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';
const MOCK_SCENARIO = import.meta.env.VITE_MOCK_SCENARIO || 'SUCCESS';

const getMockReservation = () => {
  if (MOCK_SCENARIO === MOCK_SCENARIOS.NOT_FOUND) {
    return MOCK_RESERVATION_NOT_FOUND;
  }
  if (MOCK_SCENARIO === MOCK_SCENARIOS.INVALID_DOCUMENT) {
    return MOCK_RESERVATION_INVALID_DOCUMENT;
  }
  return MOCK_RESERVATION_SUCCESS;
};

export const checkinRepository = {
  async createSession(flowType: 'CHECKIN' | 'CHECKOUT', language: string = 'en'): Promise<Session> {
    try {
      const body = createSessionRequestInterceptor(flowType, language);
      const response = await apiPost<any>(buildUrl(API_ENDPOINTS.CHECKIN_SESSIONS), body);
      return sessionResponseInterceptor(response);
    } catch (error) {
      if (error instanceof TimeoutError || USE_MOCKS) {
        console.warn('[checkinRepository] Using mock session due to timeout or configuration');
        return MOCK_SESSION;
      }
      throw error;
    }
  },

  async attachReservation(
    sessionId: number,
    searchValue: string,
    searchType: string = 'RESERVATION_CODE'
  ): Promise<SessionReservation> {
    try {
      const body = attachReservationRequestInterceptor(searchType, searchValue);
      const response = await apiPost<any>(
        buildUrl(API_ENDPOINTS.CHECKIN_SESSION_RESERVATION(sessionId)),
        body
      );
      return sessionReservationResponseInterceptor(response);
    } catch (error) {
      if (error instanceof TimeoutError || USE_MOCKS) {
        const mockRes = getMockReservation();
        if ('error' in mockRes) {
          throw new ApiError(mockRes.code, mockRes.message);
        }
        console.warn('[checkinRepository] Using mock reservation due to timeout or configuration');
        return {
          ...MOCK_SESSION,
          reservation: mockRes as Reservation,
        };
      }
      throw error;
    }
  },

  async confirmGuest(
    sessionId: number,
    guest: {
      id: number;
      fullName: string;
      documentType: string;
      documentNumber: string;
      birthDate: string;
      email: string;
      phone: string;
    }
  ): Promise<{ status: string }> {
    try {
      const body = guestConfirmationRequestInterceptor(
        guest.id,
        guest.fullName,
        guest.documentType,
        guest.documentNumber,
        guest.birthDate,
        guest.email,
        guest.phone
      );
      const response = await apiPost<any>(
        buildUrl(API_ENDPOINTS.CHECKIN_SESSION_GUEST_CONFIRMATION(sessionId)),
        body
      );
      return { status: response.status || 'OK' };
    } catch (error) {
      if (error instanceof TimeoutError || USE_MOCKS) {
        console.warn('[checkinRepository] Using mock confirmation due to timeout or configuration');
        return { status: 'OK' };
      }
      throw error;
    }
  },

  async registerConsents(
    sessionId: number,
    biometricsAccepted: boolean
  ): Promise<{ status: string }> {
    try {
      const body = registrationConsentRequestInterceptor(biometricsAccepted);
      const response = await apiPost<any>(
        buildUrl(API_ENDPOINTS.CHECKIN_SESSION_CONSENTS(sessionId)),
        body
      );
      return { status: response.status || 'OK' };
    } catch (error) {
      if (error instanceof TimeoutError || USE_MOCKS) {
        console.warn('[checkinRepository] Using mock consent registration due to timeout or configuration');
        return { status: 'OK' };
      }
      throw error;
    }
  },

  async completeCheckin(
    sessionId: number,
    paymentMethod: string,
    biometricsAccepted: boolean
  ): Promise<CompleteCheckinResponse> {
    try {
      if (MOCK_SCENARIO === MOCK_SCENARIOS.PAYMENT_DECLINED) {
        throw new ApiError('PAYMENT_DECLINED', 'Payment method was declined');
      }

      const body = completeCheckinRequestInterceptor(paymentMethod, biometricsAccepted);
      const response = await apiPost<any>(
        buildUrl(API_ENDPOINTS.COMPLETE_CHECKIN(sessionId)),
        body
      );
      return completeCheckinResponseInterceptor(response);
    } catch (error) {
      if (error instanceof TimeoutError || USE_MOCKS) {
        if (MOCK_SCENARIO === MOCK_SCENARIOS.PAYMENT_DECLINED) {
          throw new ApiError('PAYMENT_DECLINED', 'Payment method was declined');
        }
        console.warn('[checkinRepository] Using mock completion due to timeout or configuration');
        return MOCK_COMPLETE_CHECKIN_RESPONSE;
      }
      throw error;
    }
  },

  async searchReservation(type: string, value: string): Promise<Reservation[]> {
    try {
      const response = await apiGet<any>(
        buildUrl(`${API_ENDPOINTS.SEARCH_RESERVATIONS}?hotelId=${KIOSK_CONFIG.ACTIVE_HOTEL_ID}&type=${type}&value=${value}`)
      );
      return Array.isArray(response) ? response : [response];
    } catch (error) {
      if (error instanceof TimeoutError || USE_MOCKS) {
        console.warn('[checkinRepository] Using mock search due to timeout or configuration');
        const mockRes = getMockReservation();
        if ('error' in mockRes) {
          throw new ApiError(mockRes.code, mockRes.message);
        }
        return [mockRes as Reservation];
      }
      throw error;
    }
  },
};
