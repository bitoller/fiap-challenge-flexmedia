import { KIOSK_CONFIG } from "../../core/constants";
import { apiPost } from "../api/client";
import API_ENDPOINTS, { buildUrl } from "../api/endpoints";

type ConciergeHelpRequest = {
  hotelId: number;
  route: string;
};

function createCorrelationId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export const supportRepository = {
  requestConciergeHelp({ hotelId, route }: ConciergeHelpRequest): Promise<void> {
    return apiPost<void>(buildUrl(API_ENDPOINTS.ADMIN_AUDIT_EVENTS), {
      hotelId,
      actorType: "KIOSK",
      actorId: `kiosk-${KIOSK_CONFIG.KIOSK_ID}`,
      action: "CONCIERGE_HELP_REQUESTED",
      resourceType: "KIOSK_SCREEN",
      resourceId: route,
      result: "SUCCESS",
      correlationId: createCorrelationId(),
    });
  },
};
