// import { Image, View, TouchableOpacity,Text  } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';

// const CustomeImagePicker = ({ ...props }) => {

//   const pickImage = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.All,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });    

//     console.log(result);

//     if (!result.canceled) {
//       props.onImageChange(result.assets[0].uri);
//     }
//   };

//   return (
//     <TouchableOpacity onPress={pickImage}>
//     {props.imageUri ? (
//         <Image source={props.imageUri} style={{ width: 100, height: 100, borderRadius: 50 }} />
//       ) : (
//         <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: 'lightgray', justifyContent: 'center', alignItems: 'center' }}>
//           <Text style={{ color: 'gray' }}>Placeholder</Text>
//         </View>
//       )}
//     </TouchableOpacity>
//   );
// }

// export default CustomeImagePicker;

//  -----------------------------------------------------------  Second [ Experimemt ] ------------------------------------------  


// import React, { useState, useEffect } from 'react';
// import { View, TouchableOpacity, Text } from 'react-native';
// import { Camera } from 'expo-camera';
// import * as MediaLibrary from 'expo-media-library';

// const CustomImagePicker = ({ imageUri, onImageChange }) => {
//   const [hasPermission, setHasPermission] = useState(null);
//   const [cameraRef, setCameraRef] = useState(null);

//   useEffect(() => {
//     (async () => {
//       const { status } = await Camera.requestPermissionsAsync();
//       setHasPermission(status === 'granted');
//     })();
//   }, []);

//   const takePicture = async () => {
//     if (cameraRef) {
//       const photo = await cameraRef.takePictureAsync();
//       if (photo) {
//         savePhoto(photo);
//       }
//     }
//   };

//   const savePhoto = async (photo) => {
//     const asset = await MediaLibrary.createAssetAsync(photo.uri);
//     onImageChange(asset.uri);
//   };

//   if (hasPermission === null) {
//     return <View />;
//   }
//   if (hasPermission === false) {
//     return <Text>No access to camera</Text>;
//   }

//   return (
//     <View style={{ flex: 1 }}>
//       <Camera style={{ flex: 1 }} type={Camera.Constants.Type.back} ref={(ref) => setCameraRef(ref)}>
//         <View
//           style={{
//             flex: 1,
//             backgroundColor: 'transparent',
//             flexDirection: 'row',
//           }}>
//           <TouchableOpacity
//             style={{
//               flex: 0.1,
//               alignSelf: 'flex-end',
//               alignItems: 'center',
//             }}
//             onPress={takePicture}>
//             <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Take Picture </Text>
//           </TouchableOpacity>
//         </View>
//       </Camera>
//     </View>
//   );
// };

// export default CustomImagePicker;

//  -----------------------------------------------------------  Third [ Experimemt ] ------------------------------------------  


// import React from 'react';
// import { TouchableOpacity, Image, Text,View } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';

// const CustomeImagePicker = ({ ...props }) => {
//   const pickImage = async () => {
//     let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
//     if (permissionResult.granted === false) {
//       alert("Permission to access camera roll is required!");
//       return;
//     }

//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       props.onImageChange(result.assets?.[0]?.uri);
//     }
//   };
//   return (
//     <TouchableOpacity onPress={pickImage}>
//       {props.imageUri ? (
//         <Image source={{ uri: props.imageUri }} style={{ width: 100, height: 100, borderRadius: 50 }} />
//       ) : (
//         <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: 'lightgray', justifyContent: 'center', alignItems: 'center' }}>
//           <Text style={{ color: 'gray' }}>Placeholder</Text>
//         </View>
//       )}
//     </TouchableOpacity>
//   );
// }

// export default CustomeImagePicker;


import React from 'react';
import { TouchableOpacity, Image, Text, View,Platform } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

const CustomeImagePicker = ({...props }) => {
  const takePicture = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access camera was denied');
      return;
    }

    let photo = await cameraRef.takePictureAsync();
    onImageChange(photo.uri);
  };
  const pickImage = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (permissionResult.granted === false) {
          alert("Permission to access camera roll is required!");
          return;
        }
    
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        if (!result.canceled) {
          props.onImageChange(result.assets?.[0]?.uri);
        }
      };
  let cameraRef;

  return (
    Platform.OS === 'web' ?  
   ( <TouchableOpacity onPress={pickImage}>
    {props.imageUri ? (
             <Image source={{ uri: props.imageUri }} style={{ width: 100, height: 100, borderRadius: 50 }} />
           ) : (
             <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: 'lightgray', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: 'gray' }}>Placeholder</Text>
            </View>
           )}
    </TouchableOpacity>)
    : 
  (  <View style={{ flex: 1 }}>
    <Camera 
      style={{ flex: 1 }} 
      type={Camera.Constants.Type.back} 
      ref={(ref) => (cameraRef = ref)}
    >
      <View style={{ flex: 1, backgroundColor: 'transparent', flexDirection: 'row' }}>
        <TouchableOpacity
          style={{ position: 'absolute', bottom: 20, alignSelf: 'center', }}
          onPress={takePicture}
        >
          <Text style={{ fontSize: 20, marginBottom: 10, color: 'white' }}> Take Picture </Text>
        </TouchableOpacity>
      </View>
    </Camera>
  </View>)
  );
};

export default CustomeImagePicker;

