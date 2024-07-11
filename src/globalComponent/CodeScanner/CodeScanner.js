// import React, { useState, useEffect } from 'react';
// import { StyleSheet, View, Text, Pressable } from 'react-native';
// import { Camera } from 'expo-camera';

// export default function CodeScanner({ onScannedData, onCancel }) {
//   const [hasPermission, setHasPermission] = useState(null);

//   useEffect(() => {
//     (async () => {
//       const { status } = await Camera.requestCameraPermissionsAsync();
//       setHasPermission(status === 'granted');
//     })();
//   }, []);

//   const handleBarCodeScanned = ({ type, data }) => {
//     onScannedData(data);
//   };

//   const handleCancel = () => {
//     onCancel();
//   };

//   const requestPermission = async () => {
//     const { status } = await Camera.requestCameraPermissionsAsync();
//     setHasPermission(status === 'granted');
//   };

//   if (hasPermission === null) {
//     // Camera permissions are still loading.
//     return <View />;
//   }

//   if (hasPermission === false) {
//     // Camera permissions are not granted yet.
//     return (
//       <View style={styles.container}>
//         <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
//         <Pressable style={styles.button} onPress={requestPermission}>
//           <Text style={styles.text}>Grant Permission</Text>
//         </Pressable>
//         <Pressable style={styles.cancelButton} onPress={handleCancel}>
//           <Text style={styles.cancelButtonText}>Cancel</Text>
//         </Pressable>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Camera style={styles.camera} onBarCodeScanned={handleBarCodeScanned}>
//         <View style={styles.buttonContainer}>
//           <Pressable style={styles.cancelButton} onPress={handleCancel}>
//             <Text style={styles.cancelButtonText}>Cancel</Text>
//           </Pressable>
//         </View>
//       </Camera>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   camera: {
//     flex: 1,
//   },
//   buttonContainer: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     paddingBottom: 20,
//   },
//   button: {
//     backgroundColor: 'white',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//     marginBottom: 10,
//   },
//   text: {
//     fontSize: 18,
//   },
//   cancelButton: {
//     backgroundColor: 'white',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//   },
//   cancelButtonText: {
//     fontSize: 18,
//     color: 'black',
//   },
// });

import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useState } from 'react';
import { StyleSheet, Text, Pressable, View, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const frameSize = width * 0.8;

export default function CodeScanner({ onScannedData, onCancel }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const handleBarCodeScanned = ({ type, data }) => {
    onScannedData(data);
    setScanned(true); // Mark as scanned
  };

  const handleCancel = () => {
    onCancel();
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <View style={styles.grantWrap}>
          <Pressable style={styles.grantbtn} onPress={requestPermission}>
            <Text style={styles.text}>Allow Permission</Text>
          </Pressable>
          <Pressable style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.text}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} autofocus enableTorch onBarcodeScanned={scanned ? undefined : handleBarCodeScanned} barcodeTypes={['code39','qr']}>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.text}>Cancel</Text>
          </Pressable>
        </View>
      </CameraView>
      <View style={styles.frameContainer}>
        <View style={[styles.frame, { width: frameSize, height: frameSize }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  grantbtn: {
    backgroundColor: 'rgb(17, 65, 102)',
    padding: 10,
    borderRadius: 6,
    marginRight: 10,
  },
  grantWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  cancelButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  frameContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  frame: {
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
  },
});
