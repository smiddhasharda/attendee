import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function Learn() {
  return (
    <View style={styles.boxcontainer}>
      <View style={styles.box}>
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
      </View>
    </View>
  );
}

export default Learn;

const styles = StyleSheet.create({
  boxcontainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
    padding: 10,
    justifyContent:"space-between"
  },
  box: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: Dimensions.get("window").width / 2 - 20, 
    backgroundColor: "#eaeaea",
    height: 100,
    textAlign: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 10,
    padding:10,
    
  },
  boxtext:{
    marginTop:10,
    alignItems:"center",  
  },
});
