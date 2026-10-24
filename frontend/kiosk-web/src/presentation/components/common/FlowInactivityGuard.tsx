import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCheckinFlow } from "../../features/checkin-flow/context/CheckinFlowContext";
import { useCheckoutFlow } from "../../features/checkout-flow/context/CheckoutFlowContext";

const FLOW_TIMEOUT_MS = 3 * 60 * 1000;
const SUCCESS_TIMEOUT_MS = 30 * 1000;
const HOME_TIMEOUT_MS = 90 * 1000;

export function FlowInactivityGuard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearFlow: clearCheckinFlow } = useCheckinFlow();
  const { clearFlow: clearCheckoutFlow } = useCheckoutFlow();

  useEffect(() => {
    const isCheckin = location.pathname.startsWith("/checkin");
    const isCheckout = location.pathname.startsWith("/checkout");
    const isGuestHub = location.pathname.startsWith("/services");
    const isHome = location.pathname === "/home";
    const isLegal = location.pathname.startsWith("/privacy-policy");

    if (!isCheckin && !isCheckout && !isGuestHub && !isHome && !isLegal) {
      return;
    }

    const timeoutMs = location.pathname.endsWith("/success")
      ? SUCCESS_TIMEOUT_MS
      : isHome
        ? HOME_TIMEOUT_MS
        : FLOW_TIMEOUT_MS;
    let timeoutId = window.setTimeout(returnHome, timeoutMs);

    function returnHome() {
      clearCheckinFlow();
      clearCheckoutFlow();
      navigate("/", { replace: true });
    }

    function resetTimer() {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(returnHome, timeoutMs);
    }

    const activityEvents: Array<keyof WindowEventMap> = ["pointerdown", "keydown", "touchstart"];
    activityEvents.forEach((eventName) => window.addEventListener(eventName, resetTimer, { passive: true }));

    return () => {
      window.clearTimeout(timeoutId);
      activityEvents.forEach((eventName) => window.removeEventListener(eventName, resetTimer));
    };
  }, [clearCheckinFlow, clearCheckoutFlow, location.pathname, navigate]);

  return null;
}
