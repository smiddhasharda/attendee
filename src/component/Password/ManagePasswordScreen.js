import React from 'react'
import { View, Text, Pressable, StyleSheet,TextInput,SafeAreaView,Dimensions } from 'react-native';

const ManagePasswordScreen = () => {
  return (
   <SafeAreaView style={styles.passwordWrap}>
   <View style={styles.managePassword}>
     <Text >Password screen</Text>
       <TextInput
        placeholder='Enter your current Password'
        style={styles.input}
        />
   </View>
  

   </SafeAreaView>
  )
}

export default ManagePasswordScreen;

const styles = StyleSheet.create({
  
    passwordWrap:{
      flex:1,
      backgroundColor:"red",
      flexDirection:"row",
      justifyContent:"center",
      alignItems:"center"
    },
    managePassword:{
      backgroundColor:"#f6f6f6",
      minWidth:200,
      minHeight:200,
    },
    input:{
      borderWidth:1,
      borderColor:"#F6F6F6",
      padding:5
    }

})