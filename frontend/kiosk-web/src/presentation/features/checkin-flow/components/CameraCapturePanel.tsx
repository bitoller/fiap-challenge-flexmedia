import { useEffect, useRef, useState } from "react";
import { Camera, RotateCcw } from "lucide-react";

interface CameraCapturePanelProps {
  label: string;
  instruction: string;
  captureLabel: string;
  retakeLabel: string;
  readyLabel: string;
  startingLabel: string;
  processingLabel: string;
  errorLabel: string;
  disabled?: boolean;
  onCapture: (imageBase64: string, mimeType: string) => Promise<void>;
}

export function CameraCapturePanel({
  label,
  instruction,
  captureLabel,
  retakeLabel,
  readyLabel,
  startingLabel,
  processingLabel,
  errorLabel,
  disabled = false,
  onCapture,
}: CameraCapturePanelProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cameraError, setCameraError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function startCamera() {
      if (disabled || preview) {
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setIsCameraReady(true);
        setCameraError(false);
      } catch {
        setCameraError(true);
      }
    }

    startCamera();

    return () => {
      isMounted = false;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setIsCameraReady(false);
    };
  }, [disabled, preview]);

  const capture = async () => {
    if (!videoRef.current || disabled || isSubmitting) {
      return;
    }

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.86);
    const imageBase64 = dataUrl.replace(/^data:image\/jpeg;base64,/, "");
    setPreview(dataUrl);
    setIsSubmitting(true);

    try {
      await onCapture(imageBase64, "image/jpeg");
    } finally {
      setIsSubmitting(false);
    }
  };

  const retake = () => {
    setPreview(null);
  };

  return (
    <article className="checkin-identity__camera-card">
      <div className="checkin-identity__camera-heading">
        <Camera aria-hidden="true" />
        <div>
          <span>{label}</span>
          <p>{instruction}</p>
        </div>
      </div>

      <div className="checkin-identity__camera-frame">
        {preview ? (
          <img src={preview} alt="" />
        ) : (
          <video ref={videoRef} muted playsInline aria-label={label} />
        )}
        {!preview && <div className="checkin-identity__camera-reticle" aria-hidden="true" />}
      </div>

      {cameraError && <p className="checkin-identity__camera-error">{errorLabel}</p>}
      {!cameraError && !preview && <p className="checkin-identity__camera-status">{isCameraReady ? readyLabel : startingLabel}</p>}

      <div className="checkin-identity__camera-actions">
        {preview ? (
          <button type="button" className="checkin-action-button checkin-action-button--ghost" onClick={retake} disabled={isSubmitting}>
            <RotateCcw aria-hidden="true" />
            {retakeLabel}
          </button>
        ) : (
          <button type="button" className="checkin-action-button checkin-action-button--primary" onClick={capture} disabled={disabled || !isCameraReady || isSubmitting}>
            <Camera aria-hidden="true" />
            {isSubmitting ? processingLabel : captureLabel}
          </button>
        )}
      </div>
    </article>
  );
}
