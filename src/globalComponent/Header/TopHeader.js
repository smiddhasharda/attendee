import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

function TopHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.headerWrap}>
        <View style={styles.headertextWrap}>
                <View>
                <Text style={{color:"#fff" ,fontSize:"16px" ,fontWeight:"bold" }}>Sanaya</Text>
                <Text  style={{color:"#fff",fontSize:"16px"}}>Btech CS</Text>
                </View>
                <View>
                <Image  style={styles.bgimg1}  source= {require("../../local-assets/login-shape-bg-1.png")} />   
                    <Text>My Profile Info</Text>
                </View>
        </View>  
      </View>
      <View style={styles.graphicalrep}>
         <View>
             <Text>Student Name</Text>
             <Text>5909066</Text>
         </View>
      </View>
      <View style={styles.maincontain}>
        <Text>summery Info</Text>
      </View>
    </View>
  );
}

export default TopHeader;

const styles = StyleSheet.create({
    container:{
       flex:1,
       alignItems:"center"
    },
  headerWrap: {
    backgroundColor: "rgb(17, 65, 102)",
    // padding: 40,
    // width:400,
    width:"100%",
    height:"40%",

  },
  headertextWrap:{
     padding:10,
     justifyContent:"space-between",
     flexDirection:"row",
     alignItems:"center",
  },
  graphicalrep:{
      backgroundColor:"#fff",
      padding:20,
      width:"50%",
      position:"relative",
      bottom:"20px",
      borderRadius:"10px",
      height:"50%"
  },
  maincontain:{
     width:"100%",
  },
});
