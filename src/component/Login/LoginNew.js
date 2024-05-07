import React,{useState} from 'react';
import { ScrollView, ImageBackground, StyleSheet, Text, View, Dimensions, TextInput, Pressable,Button,Image ,Platform,} from 'react-native';
import loginBackground from '../../local-assets/attendlogin.jpg';

function LoginNew() {
  return ( 
   <View style={styles.container}>
      <View style={styles.form}>
      <Image style={styles.image} source= {require("../../local-assets/attendlogin.jpg")} />
      <View style={styles.loginheadWrap}>
      <Text style={styles.loginheading}>Attendee</Text>
      <Text style={styles.loginsubheading}>Login into your Account</Text></View>
      <Text style={styles.label}>Email Id</Text>
      <TextInput  style={styles.input} placeholder='Enter Your Email ID'/>
      <Text style={styles.label}>OTP</Text>
      <TextInput  style={styles.input} placeholder='Enter The Otp'/>
      <Button title='Send Otp' />
      </View>
   </View>    
  );
}

export default LoginNew;

const styles = StyleSheet.create({

  container:{
    flex:1,
    // justifyContent:"center",
    paddingHorizontal:20,
    paddingVertical:20,
    backgroundColor:"#f5f5f5",
  },

  form:{
    backgroundColor:"white",
    padding:20,
    borderRadius:10,
    // shadowColor:"black",
    // shadowOffset:{
    //   width:0,
    //   height:2
    // }
  },
  label:{
    fontSize:16,
    marginBottom:5,
    fontWeight:"bold"
  },

  input:{
   height:40,
   borderColor:"#ddd",
   borderWidth:1,
   marginBottom:15,
   padding:10,
   borderRadius:5,
  },
 
  heading:{
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 5,
  },
  image:{
    width:200,
    height:200,
    alignSelf:"center",
    marginBottom:20,
  },
  
  headingtext:{
  paddingVertical:10,
  },
  loginheading:{
    fontWeight:"bold",
    fontSize:"28px",
    alignItems:"center",
  },
  loginsubheading:{
    fontSize:"16px",
  },
  loginheadWrap:{
    padding:"20px",
    alignItems:"center"
  }
});
