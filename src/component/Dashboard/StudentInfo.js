import {React,useState,useEffect} from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions ,ScrollView,Image,TextInput,ActivityIndicator, Pressable} from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import user from '../../local-assets/userimg.jpg'

const StudentInfo = () => {
  return (
    <ScrollView >
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
        <View>
         <Text style={styles.infoHeader}>Course Info:</Text> 

         
        </View>
        {/* <View style={styles.studentInfoWrap}>
      <View style={[styles.row,]}>
        <Text style={[styles.label,{marginRight:4}]}>Copy Number:</Text>
        <TextInput style={[styles.input,{marginRight:10}]} placeholder="Enter Copy Number"  editable={false} />
          <Ionicons  name="barcode-sharp" size={24} color="black"  ></Ionicons>
          <Ionicons name="stop-circle" size={24} color="black" ></Ionicons>
      </View>   
  <Text style={styles.label}>Alternate Sheet 1</Text>
    <Text  style={styles.label}>Alternate Sheet 2</Text>
      <View style={[styles.row,{justifyContent:"right"}]} >
          <Ionicons name="add" size={24} color="black" ></Ionicons>
          </View>
        </View> */}

       <View style={styles.studentInfoWrap}>
            <Pressable style={styles.addButton}>
              <Text style={styles.addButtonText}>Add Copies</Text>
            </Pressable>
            <View style={styles.table}>
              <View style={styles.row}>
                <Text style={[styles.cell, styles.header]}>Copy</Text>
                <View style={styles.inputContainer}>
                  <TextInput style={styles.input} placeholder="Enter Copy Number" editable={false} />
                  <Text style={styles.orText}>OR</Text>
                  <Ionicons name="barcode-sharp" size={24} color="black" />
                  <Ionicons name="stop-circle" size={24} color="black" />
                  <Ionicons name="add" size={24} color="red" />
                </View>
              </View>
              <View style={styles.row}>
                <Text style={[styles.cell, styles.header]}>Supplymentry 1</Text>
                <View style={styles.inputContainer}>
                  <TextInput style={styles.input} placeholder="Enter Copy Number" editable={false} />       
                  <Ionicons name="add" size={24} color="red" />
                </View>
              </View>
            </View>
       </View>
      </View>
  </ScrollView>
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
      // width: Dimensions.get("window").width / 1 - 40,
    },
    infoHeader: {
      fontSize: 18,
      fontWeight: 'bold',
      margin: 20,
      padding: 10
    },
    studentInfoRow: {
      flexDirection: 'column', 
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
    container: {
      flex: 1,
      padding: 10,
      // justifyContent: 'center',
      // alignItems: 'center',
      },
      table: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 10,
      overflow: 'hidden',
      marginBottom: 20,
      backgroundColor: '#f9f9f9',
      shadowColor: '#000',
      shadowOffset: {
      width: 0,
      height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      // width: '100%',
      },
      row: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: '#ddd',
      alignItems: 'center',
      paddingHorizontal: 10,
      },
      cell: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 8,
      color: '#333',
      },
      header: {
      fontWeight: 'bold',
      backgroundColor: '#f0f0f0',
  
      },
      inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      // marginLeft: 'auto', 
      },
      input: {
      flex: 1,
      padding: 8,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 5,
      marginRight: 10,
      backgroundColor: '#fff',
      },

      orText: {
      marginRight: 10,
      },
      addButton:{
        padding:10,
        borderRadius:5,
        backgroundColor:"#129912",
        width:100,
        marginBottom:10,
        justifyContent:"right",
      
      },
      addButtonText:{
        color:"#fff"
      },
    
  });
