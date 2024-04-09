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


import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { Camera } from 'expo-camera';

export default function ForgetPasswordScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [photoUri, setPhotoUri] = useState(null);
  const cameraRef = React.useRef(null);

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhotoUri(photo.uri);
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Take Photo</Text>
          </Pressable>
        </View>
      </Camera>
      {photoUri && <Image source={{ uri: photoUri }} style={styles.image} />}
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
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  image: {
    flex: 1,
  },
});
