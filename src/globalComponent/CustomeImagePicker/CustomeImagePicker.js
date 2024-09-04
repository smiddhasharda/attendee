import React from 'react';
import { Pressable, Image, Text, View,Platform ,StyleSheet} from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons,Feather } from '@expo/vector-icons'; 
const CustomeImagePicker = ({...props }) => {
  const takePicture = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
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
          // props.onImageChange(result.assets?.[0]?.uri);
          props.onImageChange(result.assets);

        }
      };
  let cameraRef;

  return (
  //  ( <Pressable onPress={pickImage}>
   <View style={styles.container}>
    
    {props.imageUri ? (
             <Image source={{ uri: props.imageUri }} style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: "#ffffff" }} />
           ) : (
             <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: 'lightgray', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: 'gray' }}>Placeholder</Text>
            </View>
           )}
           {props.CameraAccess &&   
           <Pressable onPress={pickImage} style={styles.cameraiconWrap}>
              <Feather name="camera" style={styles.cameraicon}  />
           </Pressable>}          
           </View>
    // </Pressable>)
  );
};

export default CustomeImagePicker;
const styles = StyleSheet.create({

  cameraicon:{
    color:"#fff",
    fontSize: 18,
    padding: 5
   },
   cameraiconWrap:{
    backgroundColor:"green",
    padding:5,
    position:"absolute",
    borderRadius:20,
    right:-5,
    bottom:3,
   },
   container:{
     position:"relative",
   }
})
