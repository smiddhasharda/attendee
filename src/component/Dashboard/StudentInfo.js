import {React,useState,useEffect} from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions ,ScrollView,Image,TextInput,ActivityIndicator} from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import user from '../../local-assets/userimg.jpg'

const StudentInfo = () => {
  return (
    <View style={styles.container}>   
        <View style={styles.studentInfoWrap}>
          <Text style={styles.infoHeader}>Student Info:</Text> 
          <View style={styles.container}>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.value}>John Doe</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Father Name:</Text>
                <Text style={styles.value}>Michael Doe</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Mother Name:</Text>
                <Text style={styles.value}>Kathie Doe</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Roll No:</Text>
                <Text style={styles.value}>2010503</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>System Id:</Text>
                <Text style={styles.value}>0008873</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Semester:</Text>
                <Text style={styles.value}>2</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Program Name:</Text>
                <Text style={styles.value}>Bachelor of Technology</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Branch Name:</Text>
                <Text style={styles.value}>Computer Science</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>School Name:</Text>
                <Text style={styles.value}>School of Dental Science</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.studentInfoWrap}>
          <Text style={styles.infoHeader}>Course Info:</Text> 
          <View style={styles.container}>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Paper Id:</Text>
                <Text style={styles.value}>123456</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Course Code:</Text>
                <Text style={styles.value}>SDBE123</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Course Name:</Text>
                <Text style={styles.value}>Data Networks</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Room No:</Text>
                <Text style={styles.value}>101/Block D</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Seat No:</Text>
                <Text style={styles.value}>12</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Status:</Text>
                <Text style={styles.value}>Eligible</Text>
              </View>
            </View>
          </View>
        </View>
  </View>
  )
}

export default StudentInfo



const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:"#fff" ,
    },
    studentInfoWrap: {
      fontSize: 16,
      backgroundColor: '#EAEAEA',
      padding:20,
      marginLeft: 20,
      marginRight: 20,
      marginBottom: 15,
      borderRadius: 8,
      width: 100 + '%'
    },
    infoHeader: {
      fontSize: 18,
      fontWeight: 'bold',
      margin: 20,
      padding: 10
    },
    studentInfoRow: {
      flexDirection: 'row', 
      height: 100, 
      padding: 20
    },
    container: {
      flex: 1,
      padding: 20,
      //justifyContent: 'center',
      alignItems: 'center',
    },
    row: {
      flexDirection: 'row',
      //justifyContent: 'space-between',
      width: '100%',
      marginBottom: 20,
      alignItems: 'center',
    },
    column: {
      flex: 1,
      flexDirection: 'row',
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    value: {
      fontSize: 16,
      marginLeft: 5,
    },
  });
