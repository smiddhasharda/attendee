 import React from 'react';
 import { View, Text, StyleSheet, Dimensions } from 'react-native';
 import Bulkpload from '../../globalComponent/Bulkupload/BulkUpload';
const windowWidth = Dimensions.get("window").width;

 const Task = () => {
   return (
    <View style={styles.boxcontainer}>
      <Bulkpload/>
    {/* <View style={styles.box}>
      <Ionicons style={styles.icons} name="book" size={24} color="rgb(8 96 88)" />
      <View style={styles.boxtext}>
        <Text>Maths</Text>
        <Text>Chapter 1</Text>
      </View>
    </View>
    <View style={styles.box}>
      <Ionicons name="book" size={24} color="rgb(8 96 88)" />
      <View style={styles.boxtext}>
        <Text>Statics</Text>
        <Text>Chapter 2</Text>
      </View>
    </View>
    <View style={styles.box}>
      <Ionicons name="book" size={24} color="rgb(8 96 88)" />
      <View style={styles.boxtext}>
        <Text>Statics</Text>
        <Text>Chapter 2</Text>
      </View>
    </View>
    <View style={styles.box}>
      <Ionicons name="book" size={24} color="rgb(8 96 88)" />
      <View style={styles.boxtext}>
        <Text>Statics</Text>
        <Text>Chapter 2</Text>
      </View>
    </View> */}
  </View>
   );
 };
 
 export default Task;

 const styles = StyleSheet.create({
    boxcontainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: 10,
      padding: 10,
      justifyContent: "space-between"
    },
    box: {
      borderWidth: 1,
      borderColor: "#ccc",
      width: windowWidth / 1 - 10, 
      backgroundColor: "#eaeaea",
      height: 100,
      textAlign: "center",
      alignItems: "center",
      borderRadius: 10,
      marginBottom: 10,
      padding: 10,
    },
    boxtext: {
      marginTop: 10,
      alignItems: "center",  
    },
  });
  