import React from 'react';
import { View, Text, StyleSheet, Dimensions, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import DropDownPicker from "react-native-dropdown-picker";

function Learn() {

  return (
    <View style={styles.container}>   
        <Text style={styles.heading}>Student Report</Text>       
        <View style={styles.boxtable}>
             <ScrollView  horizontal>
                <View style={styles.tableWrap}>      
                    <View style={[styles.row, styles.header]}>
                      <Text style={styles.headerText}>Exam 1</Text>
                      <Text style={styles.headerText}>Exam 2</Text>
                      <Text style={styles.headerText}>Exam 3</Text>
                      <Text style={styles.headerText}>Exam 1</Text>
                      <Text style={styles.headerText}>Exam 2</Text>
                      <Text style={styles.headerText}>Exam 3</Text>                
                    </View>         
                    <View style={styles.row}>
                      <Text style={styles.cell}>Data Structure</Text>
                      <Text style={styles.cell}>Data Structure</Text>
                      <Text style={styles.cell}>Data Structure</Text>
                      <Text style={styles.cell}>Data Structure</Text>
                      <Text style={styles.cell}>Data Structure</Text>
                      <Text style={styles.cell}>Data Structure</Text>          
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.cell}>Data Structure</Text>
                      <Text style={styles.cell}>Data Structure</Text>
                      <Text style={styles.cell}>Data Structure</Text>
                      <Text style={styles.cell}>Data Structure</Text>
                      <Text style={styles.cell}>Data Structure</Text>
                      <Text style={styles.cell}>Data Structure</Text>          
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.cell}>Data Structure</Text>
                      <Text style={styles.cell}>Data Structure</Text>
                      <Text style={styles.cell}>Data Structure</Text>
                      <Text style={styles.cell}>Data Structure</Text>
                      <Text style={styles.cell}>Data Structure</Text>
                      <Text style={styles.cell}>Data Structure</Text>          
                    </View>
                </View> 
              </ScrollView> 
      </View> 

  </View> 
  );
}

export default Learn;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  boxtable: {
    padding:5,
    // flex: 1,
    // marginTop: 20,
    // marginBottom: 20,
  },
  heading:{
  fontWeight:"bold",
  marginBottom:5,
  },
  tableWrap: {
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  header: {
    backgroundColor: '#f0f0f0',
  },
  headerText: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cell: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    textAlign: 'center',
  },
});
