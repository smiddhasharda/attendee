import React from 'react';
import { ScrollView, ImageBackground, StyleSheet, Text, View, Dimensions, TextInput, TouchableOpacity } from 'react-native';
import loginBackground from '../../local-assets/attendlogin.jpg';

const { width, height } = Dimensions.get('window');
const isMobile = width < 768;

function LoginNew() {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <ImageBackground source={loginBackground} style={styles.imageBackground}/>
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.heading}>Login To Attendee</Text>
          <View style={styles.emailInput}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter the Email"
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={() => alert("OTP sent!")}>
            <Text style={styles.buttonText}>Send OTP</Text>
          </TouchableOpacity>
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
    flex: isMobile ? 1 : 0.5,
  },
  formContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
  },
  emailInput:{
    flexDirection: "row",
    alignItems: 'center',
    marginBottom: 20,
  },
  heading:{
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#ef1313',
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
