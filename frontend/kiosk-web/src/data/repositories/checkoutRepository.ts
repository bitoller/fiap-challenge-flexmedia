import { ApiError, TimeoutError } from "../../domain/errors";
import { CheckoutResponse, CheckoutStayPreview } from "../../domain/models";
import { apiPost } from "../api/client";
import { API_ENDPOINTS, buildUrl } from "../api/endpoints";
import {
  checkoutLookupResponseInterceptor,
  checkoutResponseInterceptor,
} from "../api/interceptors";

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true";

export const checkoutRepository = {
  async lookupStay(
    hotelId: number,
    roomNumber: string,
    documentType: string,
    documentNumber: string
  ): Promise<CheckoutStayPreview> {
    try {
      const response = await apiPost<any>(
        buildUrl(API_ENDPOINTS.CHECKOUT_LOOKUP),
        {
          hotelId,
          ...(roomNumber ? { roomNumber } : {}),
          ...(documentNumber ? { documentType, documentNumber } : {}),
        }
      );

      return checkoutLookupResponseInterceptor(response);
    } catch (error) {
      if (error instanceof TimeoutError || USE_MOCKS) {
        throw new ApiError("CHECKOUT_LOOKUP_FAILED", "Nao foi possivel localizar a estadia agora.");
      }

      throw error;
    }
  },

  async completeCheckout(stayId: number, paymentMethod: string): Promise<CheckoutResponse> {
    const response = await apiPost<any>(buildUrl(API_ENDPOINTS.CHECKOUT(stayId)), {
      paymentMethod,
      confirmCharges: true,
    });

    return checkoutResponseInterceptor(response);
  },
};
