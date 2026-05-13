import { CheckoutResponse, CheckoutStayPreview } from "../../domain/models";
import { checkoutRepository } from "./checkoutRepository";

export interface CheckoutFlowRepository {
  lookupStay(
    hotelId: number,
    roomNumber: string,
    documentType: string,
    documentNumber: string
  ): Promise<CheckoutStayPreview>;
  completeCheckout(stayId: number, paymentMethod: string): Promise<CheckoutResponse>;
}

export const checkoutFlowRepository: CheckoutFlowRepository = {
  lookupStay(hotelId, roomNumber, documentType, documentNumber) {
    return checkoutRepository.lookupStay(hotelId, roomNumber, documentType, documentNumber);
  },

  completeCheckout(stayId, paymentMethod) {
    return checkoutRepository.completeCheckout(stayId, paymentMethod);
  },
};
