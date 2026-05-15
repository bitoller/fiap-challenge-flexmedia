import { useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { ScanSearch } from "lucide-react";

interface QrScannerPanelProps {
  active: boolean;
  onTokenDetected: (token: string) => void;
  onFallback: () => void;
}

type ScannerStatus = "idle" | "starting" | "ready" | "error";

export function QrScannerPanel({ active, onTokenDetected, onFallback }: QrScannerPanelProps) {
  const { t } = useTranslation("checkin");
  const scannerId = useId().replace(/:/g, "-");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const onTokenDetectedRef = useRef(onTokenDetected);
  const handledRef = useRef(false);
  const [status, setStatus] = useState<ScannerStatus>("idle");
  const [errorMessageKey, setErrorMessageKey] = useState<"qrScannerError" | null>(null);

  useEffect(() => {
    onTokenDetectedRef.current = onTokenDetected;
  }, [onTokenDetected]);

  useEffect(() => {
    handledRef.current = false;
  }, [active]);

  useEffect(() => {
    let cancelled = false;
    let cleanupPromise: Promise<void> = Promise.resolve();

    const stopScanner = async () => {
      const scanner = scannerRef.current;
      scannerRef.current = null;

      if (!scanner) {
        return;
      }

      try {
        await scanner.stop();
      } catch {
        // Ignore stop errors when the scanner was not fully started yet.
      }

      try {
        await scanner.clear();
      } catch {
        // Ignore clear errors during fast navigation or mode switches.
      }
    };

    const startScanner = async () => {
      if (!active) {
        setStatus("idle");
        setErrorMessageKey(null);
        await stopScanner();
        return;
      }

      setStatus("starting");
      setErrorMessageKey(null);

      await stopScanner();
      if (cancelled) {
        return;
      }

      const container = document.getElementById(scannerId);
      if (!container || !("mediaDevices" in navigator)) {
        setStatus("error");
        setErrorMessageKey("qrScannerError");
        return;
      }

      try {
        const scanner = new Html5Qrcode(scannerId, {
          verbose: false,
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        });
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: (viewfinderWidth, viewfinderHeight) => {
              const size = Math.floor(Math.min(viewfinderWidth, viewfinderHeight) * 0.82);
              return {
                width: size,
                height: size,
              };
            },
            aspectRatio: 1,
            disableFlip: false,
          },
          (decodedText) => {
            const token = decodedText.trim();
            if (!token || cancelled || handledRef.current) {
              return;
            }

            handledRef.current = true;
            void stopScanner();
            onTokenDetectedRef.current(token);
          },
          () => {
            // Intentionally ignored. The library invokes this callback on each
            // unsuccessful frame, which is expected while the kiosk keeps scanning.
          }
        );

        if (!cancelled) {
          setStatus("ready");
        }
      } catch {
        if (!cancelled) {
          setStatus("error");
          setErrorMessageKey("qrScannerError");
          await stopScanner();
        }
      }
    };

    cleanupPromise = Promise.resolve(startScanner());

    return () => {
      cancelled = true;
      cleanupPromise.catch(() => undefined);
      void stopScanner();
    };
  }, [active, scannerId]);

  const statusLabel =
    status === "starting"
      ? t("qrScannerStarting")
      : status === "error"
        ? t(errorMessageKey ?? "qrScannerError")
        : t("qrScannerReady");

  return (
    <section className="checkin-qr-scanner" aria-label={t("qrScannerTitle")}>
      <div className="checkin-qr-scanner__viewport" id={scannerId} />

      <div className="checkin-qr-scanner__content">
        <p className="checkin-qr-scanner__eyebrow">
          <ScanSearch aria-hidden="true" />
          <span>{t("qrScannerTitle")}</span>
        </p>
        <h2 className="checkin-qr-scanner__title">{t("qrScannerHeading")}</h2>
        <p className="checkin-qr-scanner__copy">{t("qrScannerBody")}</p>
        <p className="checkin-qr-scanner__status" role="status" aria-live="polite">
          {statusLabel}
        </p>

        <button type="button" className="checkin-qr-scanner__fallback" onClick={onFallback}>
          {t("qrScannerFallback")}
        </button>
      </div>
    </section>
  );
}
