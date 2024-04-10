// import React from 'react'
// import { Text, View } from 'react-native'

// const ForgetPasswordScreen = () => {
//   const { hasPermission, requestPermission } = useCameraPermission()
//   return (
//     <View>
//       <Text>ForgetScreen</Text>
//     </View>
//   )
// }

// export default ForgetPasswordScreen


// import React, { useState } from 'react';
// import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
// import { Camera } from 'expo-camera';

// export default function ForgetPasswordScreen() {
//   const [hasPermission, setHasPermission] = useState(null);
//   const [photoUri, setPhotoUri] = useState(null);
//   const cameraRef = React.useRef(null);

//   React.useEffect(() => {
//     (async () => {
//       const { status } = await Camera.requestCameraPermissionsAsync();
//       setHasPermission(status === 'granted');
//     })();
//   }, []);

//   const takePicture = async () => {
//     if (cameraRef.current) {
//       const photo = await cameraRef.current.takePictureAsync();
//       setPhotoUri(photo.uri);
//     }
//   };

//   if (hasPermission === null) {
//     return <View />;
//   }
//   if (hasPermission === false) {
//     return <Text>No access to camera</Text>;
//   }

//   return (
//     <View style={styles.container}>
//       <Camera style={styles.camera} ref={cameraRef}>
//         <View style={styles.buttonContainer}>
//           <Pressable style={styles.button} onPress={takePicture}>
//             <Text style={styles.text}>Take Photo</Text>
//           </Pressable>
//         </View>
//       </Camera>
//       {photoUri && <Image source={{ uri: photoUri }} style={styles.image} />}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: 'column',
//   },
//   camera: {
//     flex: 1,
//   },
//   buttonContainer: {
//     flex: 1,
//     backgroundColor: 'transparent',
//     flexDirection: 'row',
//     margin: 20,
//   },
//   button: {
//     flex: 0.1,
//     alignSelf: 'flex-end',
//     alignItems: 'center',
//   },
//   text: {
//     fontSize: 18,
//     color: 'white',
//   },
//   image: {
//     flex: 1,
//   },
// });



import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { Camera } from 'expo-camera';

export default function ForgetPasswordScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedData, setScannedData] = useState(null);
  const [showCamera, setShowCamera] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScannedData(data);
    setShowCamera(false);
  };

  const renderCamera = () => {
    return (
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        onBarCodeScanned={handleBarCodeScanned}
      >
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={() => setShowCamera(false)}>
            <Text style={styles.text}>Cancel</Text>
          </Pressable>
        </View>
      </Camera>
    );
  };

  return (
    <View style={styles.container}>
      {hasPermission === false && <Text>No access to camera</Text>}
      {hasPermission && showCamera && renderCamera()}
      {scannedData && !showCamera && (
        <View style={styles.dataContainer}>
          <Text style={styles.text}>Scanned Data:</Text>
          <Text>{scannedData}</Text>
          <Pressable style={styles.button} onPress={() => setShowCamera(true)}>
            <Text style={styles.text}>Scan Again</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  button: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 18,
    color: 'black',
  },
  dataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

