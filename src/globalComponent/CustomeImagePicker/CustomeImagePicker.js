import { Image, View, TouchableOpacity,Text  } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const CustomeImagePicker = ({ ...props }) => {

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });    

    console.log(result);

    if (!result.canceled) {
      props.onImageChange(result.assets[0].uri);
    }
  };

  return (
    <TouchableOpacity onPress={pickImage}>
    {props.imageUri ? (
        <Image source={props.imageUri} style={{ width: 100, height: 100, borderRadius: 50 }} />
      ) : (
        <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: 'lightgray', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'gray' }}>Placeholder</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default CustomeImagePicker;
