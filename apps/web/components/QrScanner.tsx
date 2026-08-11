'use client';

import jsQR from 'jsqr';
import { useEffect, useRef, useState } from 'react';
import { QrCodeOutline } from '@/components/QrCodeOutline';
import { isUuid, parseEggFromLink } from '@/lib/egg';

export function QrScanner({ disabled = false, onDetect }: { disabled?: boolean; onDetect: (value: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastDetectedRef = useRef('');
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [message, setMessage] = useState('Starting camera...');

  useEffect(() => {
    let animationFrame = 0;
    let isMounted = true;

    async function startCamera() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setMessage('Camera is not available in this browser.');
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: { ideal: 'environment' },
          },
        });
        streamRef.current = stream;

        const video = videoRef.current;
        if (!video || !isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        video.srcObject = stream;
        await video.play();
        setMessage('Point your camera at an egg QR code.');

        const scan = () => {
          if (!isMounted) {
            return;
          }

          if (!disabled && video.readyState === video.HAVE_ENOUGH_DATA) {
            const canvas = canvasRef.current;
            const context = canvas?.getContext('2d', { willReadFrequently: true });

            if (canvas && context) {
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              context.drawImage(video, 0, 0, canvas.width, canvas.height);

              const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
              const result = jsQR(imageData.data, imageData.width, imageData.height);
              const detected = result ? parseEggFromLink(result.data) : '';

              if (isUuid(detected) && detected !== lastDetectedRef.current) {
                lastDetectedRef.current = detected;
                onDetect(detected);
              }
            }
          }

          animationFrame = window.requestAnimationFrame(scan);
        };

        scan();
      } catch {
        setMessage('Camera permission is needed to scan egg codes.');
      }
    }

    void startCamera();

    return () => {
      isMounted = false;
      window.cancelAnimationFrame(animationFrame);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, [disabled, onDetect]);

  return (
    <div className="scanner-frame">
      <video className="scanner-video" muted playsInline ref={videoRef} />
      <canvas aria-hidden="true" className="scanner-canvas" ref={canvasRef} />
      <QrCodeOutline className="scanner-outline" />
      <p className="scanner-message">{message}</p>
    </div>
  );
}
