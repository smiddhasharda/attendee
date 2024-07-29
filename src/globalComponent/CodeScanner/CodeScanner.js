import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { StyleSheet, Text, Pressable, View, Dimensions, SafeAreaView, Platform } from 'react-native';
import {Entypo} from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from 'expo-camera';

const { width } = Dimensions.get('window');
const frameSize = width * 0.7;

export default function CodeScanner({ onScannedData, onCancel, BarCodeTypes }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const cameraRef = useRef(null);
  const [scannedCodes, setScannedCodes] = useState([]);
  
  // useEffect(() => {
  //   if (Platform.OS === 'web') {
  //     requestWebCameraPermission();
  //   }
  // }, []);
  
  // const requestWebCameraPermission = useCallback(async () => {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  //     stream.getTracks().forEach(track => track.stop());
  //     // const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  //     // stream.getTracks().forEach(track => track.stop());
  //   } catch (err) {
  //     console.error("Error accessing camera:", err);
  //   }
  // }, []);

  const handleBarCodeScanned = useCallback(({ type, data }) => {
    if (scannedCodes.length < 3) {
      setScannedCodes(prev => [...prev, data]);
    }
    
    if (scannedCodes.length > 2 && scannedCodes.every(code => code === data)) {
      setScanned(true);
      if (BarCodeTypes?.[0] === 'code39') {
        if (isValidBarcode(data)) {
          onScannedData(data);
        } else {
          alert("Invalid Barcode. Please try scanning again.");
        }
      } else if (BarCodeTypes?.[0] === 'qr') {
        onScannedData(data);
      } else {
        alert("Invalid Barcode. Please try scanning again.");
      }
    } else if (scannedCodes.length > 2 && !scannedCodes.every(code => code === data)) {
      setScannedCodes([]);
      setScanned(false);
    }
  }, [scannedCodes, onScannedData, BarCodeTypes]);

  const isValidBarcode = useCallback((data) => {
    return data && data.length > 0 && /^[A-Za-z][A-Za-z0-9]*$/.test(data);
  }, []);

  const toggleTorch = useCallback(() => {
    setIsTorchOn(prev => !prev);
  }, []);

  const handleRetry = useCallback(() => {
    setScanned(false);
    setScannedCodes([]);
  }, []);

  const renderPermissionView = useMemo(() => (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>We need your permission to use the camera</Text>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Allow Permission</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.cancelButton]} onPress={onCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  ), [requestPermission, onCancel]);

  if (Platform.OS !== 'web' && !permission) {
    return <View />;
  }

  if (Platform.OS !== 'web' && !permission.granted) {
    return renderPermissionView;
  }

  return (
    <SafeAreaView style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barCodeTypes: BarCodeTypes,
          interval: 300,
        }}
        preset="medium"
        enableTorch={isTorchOn}
        focusDepth={1}
        zoom={0.1}
      >
        <View style={styles.overlay}>
          <View style={[styles.frame, { width: frameSize, height: frameSize }]} />
        </View>
      </CameraView>
      <View style={styles.guideContainer}>
        <Text style={styles.guideText}>Center the barcode in the frame</Text>
      </View>
      <View style={styles.AgainScanContainer}>
      {scanned && (
          <Pressable style={styles.button} onPress={handleRetry}>
            <Text style={styles.buttonText}>Scan Again</Text>
          </Pressable>
        )}
        </View>
      <View style={styles.controlsContainer}>
        <Pressable style={[styles.button,{backgroundColor:isTorchOn ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",}]} onPress={toggleTorch}>
        <Entypo name='flashlight' size={24} color={isTorchOn ? 'blue' : 'white'} />
       
        </Pressable>
        <Pressable style={[styles.button, styles.cancelButton]} onPress={onCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  frame: {
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
  },
  guideContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  AgainScanContainer: {
    position: 'absolute',
    bottom:120,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.6)',
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  text: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  guideText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});