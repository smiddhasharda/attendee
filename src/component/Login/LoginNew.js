import React from 'react';
import { ScrollView, ImageBackground, StyleSheet, Text, View, Dimensions, TextInput } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import loginBackground from '../../local-assets/attendlogin.jpg';
const { width, height } = Dimensions.get('window');
const isMobile = width < 768;

function LoginNew() {
  return (
    <ScrollView contentContainerStyle={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <ImageBackground source={loginBackground} style={styles.imageBackground}>
            {/* <View style={styles.brandView}>
              <Text style={styles.brandViewText}>Vision To Go</Text>
            </View> */}
          </ImageBackground>
        </View>
        <View style={styles.formContainer}>
        <View>
             <Text style={styles.heading}>Login To Attendee</Text>
        </View>
        <View style={styles.emailinput}> 
          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter the Email"
          />
          </View>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Send Otp</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

export default LoginNew;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  imageContainer: {
    flex: 1,
    maxHeight: Dimensions.get('window').height * 0.5,
    // maxHeight: isMobile ? height * 0.5 : height * 0.9,
  },
  formContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems:'center'
  },

  imageBackground: {
    height: '100%',
    width: '100%',
  },
  emailinput:{
      flexDirection:"row",
 
  },
  heading:{
   fontSize:25,
   fontWeight:700,
   padding:10,
  },

  brandView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  label: {
    marginRight:10,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop:6,
  
  },
  brandViewText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  input: {
    height: 40,
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
 
  },
  button: {
    padding: 10,
    backgroundColor: '#ef1313',
    borderRadius: 10,
    alignItems: 'center',
 
  
  },
  buttonText: {
    color: '#fff'
  }
});
