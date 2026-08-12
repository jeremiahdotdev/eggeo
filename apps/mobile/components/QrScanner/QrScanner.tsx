import { EggeoButton, EggeoText, QrCodeOutline } from '@eggeo/ui';
import { Camera, CameraView, type BarcodeScanningResult, type PermissionResponse } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { Linking, View } from 'react-native';
import { styles } from './QrScanner.styles';

export function QrScanner({ disabled = false, onDetect }: { disabled?: boolean; onDetect: (value: string) => void }) {
  const [permission, setPermission] = useState<PermissionResponse | null>(null);
  const [permissionError, setPermissionError] = useState('');
  const [cameraUnavailable, setCameraUnavailable] = useState(false);
  const [cameraMessage, setCameraMessage] = useState('Point your camera at an egg QR code.');
  const [cameraKey, setCameraKey] = useState(0);
  const cameraRef = useRef<CameraView | null>(null);
  const lastValueRef = useRef('');
  const lastScannedAtRef = useRef(0);

  useEffect(() => {
    let isMounted = true;

    Camera.requestCameraPermissionsAsync()
      .then((nextPermission) => {
        if (isMounted) {
          setPermission(nextPermission);
        }
      })
      .catch((error) => {
        if (isMounted) {
          setPermissionError(error instanceof Error ? error.message : 'Unable to request camera permission.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleRequestPermission() {
    setPermissionError('');
    setCameraUnavailable(false);
    setCameraMessage('Requesting camera permission...');

    try {
      const nextPermission = await Camera.requestCameraPermissionsAsync();
      setPermission(nextPermission);
      setCameraKey((key) => key + 1);
      setCameraMessage(nextPermission.granted ? 'Restarting camera...' : 'Camera permission required.');
    } catch (error) {
      setPermissionError(error instanceof Error ? error.message : 'Unable to request camera permission.');
    }
  }

  function handleBarcodeScanned(result: BarcodeScanningResult) {
    const now = Date.now();

    if (disabled || !result.data || (result.data === lastValueRef.current && now - lastScannedAtRef.current < 2500)) {
      return;
    }

    lastValueRef.current = result.data;
    lastScannedAtRef.current = now;
    onDetect(result.data);
  }

  const canAskAgain = permission?.canAskAgain !== false;
  const hasPermission = permission?.granted === true;
  const permissionActionLabel = canAskAgain ? (hasPermission ? 'Retry Camera' : 'Allow Camera') : 'Open Settings';
  const permissionMessage =
    permissionError ||
    (permission
      ? canAskAgain
        ? 'Camera access is needed to scan egg codes.'
        : 'Camera access is blocked. Enable it in Settings to scan egg codes.'
      : 'Requesting camera permission...');

  useEffect(() => {
    console.log('[QrScanner] permission button visible', {
      canAskAgain,
      cameraUnavailable,
      hasPermission,
      label: permissionActionLabel,
      permissionGranted: permission?.granted,
      permissionStatus: permission?.status,
    });
  }, [cameraUnavailable, canAskAgain, hasPermission, permission?.granted, permission?.status, permissionActionLabel]);

  return (
    <View style={styles.stack}>
      <View collapsable={false} style={styles.shell}>
        {hasPermission && !cameraUnavailable ? (
          <CameraView
            active={!disabled}
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            collapsable={false}
            facing="back"
            key={cameraKey}
            ref={cameraRef}
            onBarcodeScanned={handleBarcodeScanned}
            onAvailableLensesChanged={(event) => {
              console.log('[QrScanner] available lenses changed', event);
            }}
            onCameraReady={() => {
              console.log('[QrScanner] camera ready', { cameraKey });
              cameraRef.current
                ?.getAvailableLensesAsync()
                .then((lenses) => {
                  console.log('[QrScanner] available lenses after ready', lenses);
                  setCameraUnavailable(lenses.length === 0);
                  setCameraMessage(lenses.length > 0 ? 'Camera ready. Point it at an egg QR code.' : 'No camera available in this environment.');
                })
                .catch((error) => {
                  console.log('[QrScanner] available lenses error', error);
                  setCameraMessage('Camera ready. Point it at an egg QR code.');
                });
            }}
            onMountError={(event) => {
              console.log('[QrScanner] camera mount error', event);
              setCameraMessage(event.message || 'Unable to start the camera.');
            }}
            style={styles.camera}
          />
        ) : (
          <View style={styles.permissionPanel} />
        )}
        {hasPermission && <QrCodeOutline style={styles.outline} />}
      </View>
      <View style={styles.message}>
        <EggeoText style={styles.centerText}>{hasPermission ? cameraMessage : permissionMessage}</EggeoText>
      </View>
      {!hasPermission && (
        <EggeoButton
          onPress={() => {
            console.log('[QrScanner] permission button pressed', {
              canAskAgain,
              cameraUnavailable,
              hasPermission,
              label: permissionActionLabel,
              permissionGranted: permission?.granted,
              permissionStatus: permission?.status,
            });

            if (canAskAgain) {
              void handleRequestPermission();
              return;
            }

            void Linking.openSettings();
          }}
          style={styles.permissionButton}
        >
          {permissionActionLabel}
        </EggeoButton>
      )}
    </View>
  );
}
