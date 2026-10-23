import { KIOSK_CONFIG } from "../../core/constants";
import { apiPost } from "../api/client";
import API_ENDPOINTS, { buildUrl } from "../api/endpoints";

export type GuestServiceType = "HOUSEKEEPING" | "AMENITIES" | "DINING" | "CONCIERGE";

type ConciergeHelpRequest = {
  hotelId: number;
  route: string;
};

type GuestServiceRequest = ConciergeHelpRequest & {
  serviceType: GuestServiceType;
  roomNumber?: string;
};

function requestGuestService({ hotelId, route, serviceType, roomNumber }: GuestServiceRequest): Promise<void> {
  return apiPost<void>(buildUrl(API_ENDPOINTS.GUEST_SERVICE_REQUESTS), {
    hotelId,
    kioskId: `kiosk-${KIOSK_CONFIG.KIOSK_ID}`,
    serviceType,
    route,
    ...(roomNumber ? { roomNumber } : {}),
  });
}

export const supportRepository = {
  requestGuestService,

  requestConciergeHelp({ hotelId, route }: ConciergeHelpRequest): Promise<void> {
    return requestGuestService({
      hotelId,
      route,
      serviceType: "CONCIERGE",
    });
  },
};
