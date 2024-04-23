import React, { useState } from 'react';
import { View, Text, Button, TextInput, FlatList, StyleSheet, Pressable ,ScrollView,Image,} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import loginBackground from '../../local-assets/attendlogin.jpg';
import classe from '../../local-assets/classes.jpg';
import { useNavigation } from '@react-navigation/native'; 
import PieChart from './PieChart';
import DropDownPicker from "react-native-dropdown-picker";
const DashboardScreen = () => {
const { navigate } = useNavigation(); 
  const handleLearnPress = () => {
    navigate('Learn');
  };

  const handleTaskPress = () => {
    navigate('Task');
  };

  const data = [
    { key: 'A', value: 50,},
    { key: 'B', value: 30 },
    { key: 'C', value: 20 },
  ];

  return (
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome</Text>      
          <TextInput
            style={styles.searchBox}
            placeholder="Search..."          
          />
            <View style={styles.subtext}>
              <Text  style={styles.taskheading}>Exam Details</Text>
              <Text  onPress={handleLearnPress} style={styles.viewAll}>View All</Text>
            </View>        
            <View style={styles.boxcontainer}>            
                <View style={styles.box}>
                <Ionicons style={styles.icons} name="book" size={24} color="rgb(8 96 88)"  />
                <View  style={styles.boxtext}>
                  <Text>Exam 1</Text>
                  {/* <Text>Chapter 1</Text> */}
                </View>
              </View>
              <View style={styles.box}>
              <Ionicons name="book" size={24} color="rgb(8 96 88)" />
              <View  style={styles.boxtext}>
                  <Text>Exam 2</Text>
                  {/* <Text>Chapter 2</Text> */}
                  </View>
              </View>
              <View style={styles.box}>
              <Ionicons name="book" size={24} color="rgb(8 96 88)" />
                   <View  style={styles.boxtext}>
                  <Text>Exam 3</Text>
                  {/* <Text>Chapter 3</Text> */}
                  </View>
              </View>             
            </View>
            {/* <View style={styles.subtext}>
              <Text style={styles.taskheading}>Up Coming Exam</Text>
              <Text onPress={handleTaskPress} style={styles.viewAll}>View All</Text>
            </View>         */}
            {/* <View style={styles.boxcontainer}>            
                <View style={styles.taskbox}>
                <Ionicons name="book" size={24} color="rgb(8 96 88)"  />
                <View  style={styles.boxtext}>
                  <Text>19 Jan 2024</Text>
                </View>
              </View>
          
              <View style={styles.taskbox}>
              <Ionicons name="book" size={24} color="rgb(8 96 88)" />
              <View  style={styles.boxtext}>
              <Text>20 Jan 2024</Text>
                  </View>
              </View>
            
            </View> */}
            {/* <View style={styles.subtext}>
              <Text style={styles.taskheading}>Past Exam</Text>
              <Text style={styles.viewAll}>View All</Text>
            </View>         */}
            {/* <View style={styles.boxcontainer}>            
                <View style={styles.taskbox}>               
                <Image source ={classe} style={styles.imagebg} />       
              </View>
              <View style={styles.taskbox}>               
                <Image source ={classe} style={styles.imagebg} />       
              </View>              
            </View>      */}
            <View style={styles.boxtable}>
              <ScrollView horizontal>
                  <View style={styles.tableWrap}>      
                      <View style={[styles.row, styles.header]}>
                        <Text style={styles.headerText}>Exam 1</Text>
                        <Text style={styles.headerText}>Exam 2</Text>
                        <Text style={styles.headerText}>Exam 3</Text>
                        <Text style={styles.headerText}>Exam 1</Text>
                        <Text style={styles.headerText}>Exam 2</Text>
                        <Text style={styles.headerText}>Exam 3</Text>
                        <Text style={styles.headerText}>Exam 2</Text>
                        <Text style={styles.headerText}>Exam 3</Text>
                      </View>
                      <View style={styles.row}>
                        <Text style={styles.cell}>Computer Science</Text>
                        <Text style={styles.cell}>Computer Science</Text>
                        <Text style={styles.cell}>Computer Science</Text>
                        <Text style={styles.cell}>Computer Science</Text>
                        <Text style={styles.cell}>Computer Science</Text>
                        <Text style={styles.cell}>Computer Science</Text>          
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
            <View  style={styles.piechart}>        
               <PieChart />     
            </View>   

              
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 16,
    backgroundColor: '#fff',
   
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtext:{
    flexDirection:"row",
    justifyContent:"space-between",
    marginBottom:10,  
  },
  taskheading:{
   fontSize:24,
   fontWeight:"bold",
  },
  viewAll:{
    fontSize:16,
    marginTop:10,
  },
  searchBox: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding:10,
    marginBottom: 16,
 
  },
  boxcontainer:{
    flex:1,
    flexDirection:"row",
    justifyContent:"space-between",
    marginBottom:10,
  },

  box:{
    borderWidth:1,
    borderColor:"#ccc",
    width:"30%",
    backgroundColor:"#eaeaea",
    height:100,
    textAlign:"center",
    alignItems:"center",
    borderRadius:10,
   
  },
  taskbox:{
  width:"48%",
  borderWidth:1,
  borderColor:"#ccc",
  backgroundColor:"#eaeaea",
  height:100,
  textAlign:"center",
  alignItems:"center",
  borderRadius:10,
  },
  boxtext:{
    marginTop:10,
    alignItems:"center",  
  },
  imagebg:{
    width:"100%",
    height:"100%",
  },
  boxtable:{
    padding:5,
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
  // dropdown: {
  //   width: 150,
  //   height: 50,
  //   transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }], 
  // },
});

export default DashboardScreen;
