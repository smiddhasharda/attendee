import React, { useState } from 'react';
import { View, Text, Button, TextInput, FlatList, StyleSheet, Pressable ,ScrollView,Image,} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import loginBackground from '../../local-assets/attendlogin.jpg';
import classe from '../../local-assets/classes.jpg';
import { useNavigation } from '@react-navigation/native'; 
import PieChart from './PieChart';
import DropDownPicker from "react-native-dropdown-picker";
import TopHeader from '../../globalComponent/Header/TopHeader';
const DashboardScreen = () => {
const { navigate } = useNavigation(); 
  const handleLearnPress = () => {
    navigate('Learn');
  };
  const handleTaskPress = () => {
    navigate('InvigilatorScreen');
  };


  return (

    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to Attendace Portal</Text>      
          <TextInput
            style={styles.searchBox}
            placeholder="Search..."          
          />
          
            <View style={styles.subtext}>
              <Text  style={styles.taskheading}>Exam Details</Text>
              {/* <Text  onPress={handleLearnPress} style={styles.viewAll}>View All</Text> */}
            </View>
            <ScrollView vertical>        
            <View style={[styles.boxcontainer,]}>            
                <View style={[styles.box, styles.activebox]} >
                <Ionicons style={styles.icons} name="book" size={24} color="rgb(8 96 88)"  />
                <View  style={[styles.boxtext,]}>
                  <Text style={styles.activeboxtext} onPress={handleLearnPress}>Exam</Text>
                  {/* <Text>Chapter 1</Text> */}
                </View>
              </View>
              <View style={styles.box}>
              <Ionicons name="book" size={24} color="rgb(8 96 88)" />
              <View  style={styles.boxtext}>
                  <Text onPress={handleTaskPress}>Report</Text>
                  {/* <Text>Chapter 2</Text> */}
                  </View>
              </View>
              <View style={styles.box}>
              <Ionicons name="book" onPress={()=> navigate('TopHeader')} size={24} color="rgb(8 96 88)" />
                   <View  style={styles.boxtext}>
                  <Text>Setting</Text>
                  {/* <Text>Chapter 3</Text> */}
                  </View>
              </View> 
              <View style={styles.box}>
              <Ionicons name="book" size={24} color="rgb(8 96 88)" />
              <View  style={styles.boxtext}>
                  <Text onPress={handleTaskPress}>Profile</Text>
                  {/* <Text>Chapter 2</Text> */}
                  </View>
              </View>     
              <View style={styles.box}>
              <Ionicons name="book" size={24} color="rgb(8 96 88)" />
              <View  style={styles.boxtext}>
                  <Text onPress={handleTaskPress}>Profile</Text>
                  {/* <Text>Chapter 2</Text> */}
                  </View>
              </View>  
              <View style={styles.box}>
              <Ionicons name="book" size={24} color="rgb(8 96 88)" />
              <View  style={styles.boxtext}>
                  <Text onPress={handleTaskPress}>Profile</Text>
                  {/* <Text>Chapter 2</Text> */}
                  </View>
              </View>         
              <View style={styles.box}>
              <Ionicons name="book" size={24} color="rgb(8 96 88)" />
              <View  style={styles.boxtext}>
                  <Text onPress={handleTaskPress}>Profile</Text>
                  {/* <Text>Chapter 2</Text> */}
                  </View>
              </View>  
              <View style={styles.box}>
              <Ionicons name="book" size={24} color="rgb(8 96 88)" />
              <View  style={styles.boxtext}>
                  <Text onPress={handleTaskPress}>Profile</Text>
                  {/* <Text>Chapter 2</Text> */}
                  </View>
              </View>  
              <View style={styles.box}>
              <Ionicons name="book" size={24} color="rgb(8 96 88)" />
              <View  style={styles.boxtext}>
                  <Text onPress={handleTaskPress}>Profile</Text>
                  {/* <Text>Chapter 2</Text> */}
                  </View>
              </View>  
              <View style={styles.box}>
              <Ionicons name="book" size={24} color="rgb(8 96 88)" />
              <View  style={styles.boxtext}>
                  <Text onPress={handleTaskPress}>Profile</Text>
                  {/* <Text>Chapter 2</Text> */}
                  </View>
              </View>  
              <View style={styles.box}>
              <Ionicons name="book" size={24} color="rgb(8 96 88)" />
              <View  style={styles.boxtext}>
                  <Text onPress={handleTaskPress}>Profile</Text>
                  {/* <Text>Chapter 2</Text> */}
                  </View>
              </View>  
              <View style={styles.box}>
              <Ionicons name="book" size={24} color="rgb(8 96 88)" />
              <View  style={styles.boxtext}>
                  <Text onPress={handleTaskPress}>Profile</Text>
               
                  </View>
              </View>  
              <View style={styles.box}>
              <Ionicons name="book" size={24} color="rgb(8 96 88)" />
              <View  style={styles.boxtext}>
                  <Text onPress={handleTaskPress}>Profile</Text>
               
                  </View>
              </View>  
              <View style={styles.box}>
              <Ionicons name="book" size={24} color="rgb(8 96 88)" />
              <View  style={styles.boxtext}>
                  <Text onPress={handleTaskPress}>Profile</Text>
               
                  </View>
              </View>  
              <View style={styles.box}>
              <Ionicons name="book" size={24} color="rgb(8 96 88)" />
              <View  style={styles.boxtext}>
                  <Text onPress={handleTaskPress}>Profile</Text>
               
                  </View>
              </View>  
              <View style={styles.box}>
              <Ionicons name="book" size={24} color="rgb(8 96 88)" />
              <View  style={styles.boxtext}>
                  <Text onPress={handleTaskPress}>Profile</Text>
                 
                  </View>
              </View> 
            </View>
            <View style={[styles.boxcontainer,]}>            
                <View style={[styles.box, styles.activebox]} >
                <Ionicons style={styles.icons} name="book" size={24} color="rgb(8 96 88)"  />
                <View  style={[styles.boxtext,]}>
                  <Text style={styles.activeboxtext} onPress={handleLearnPress}>Exam</Text>
                  {/* <Text>Chapter 1</Text> */}
                </View>
              </View>
              <View style={styles.box}>
              <Ionicons name="book" size={24} color="rgb(8 96 88)" />
              <View  style={styles.boxtext}>
                  <Text onPress={handleTaskPress}>Report</Text>
                  {/* <Text>Chapter 2</Text> */}
                  </View>
              </View>
              <View style={styles.box}>
              <Ionicons name="book" size={24} color="rgb(8 96 88)" />
                   <View  style={styles.boxtext}>
                  <Text>Setting</Text>
                  {/* <Text>Chapter 3</Text> */}
                  </View>
              </View> 
              <View style={styles.box}>
              <Ionicons name="book" size={24} color="rgb(8 96 88)" />
              <View  style={styles.boxtext}>
                  <Text onPress={handleTaskPress}>Profile</Text>
                  {/* <Text>Chapter 2</Text> */}
                  </View>
              </View>     
              <View style={styles.box}>
              <Ionicons name="book" size={24} color="rgb(8 96 88)" />
              <View  style={styles.boxtext}>
                  <Text onPress={handleTaskPress}>Profile</Text>
                  {/* <Text>Chapter 2</Text> */}
                  </View>
              </View>  
              <View style={styles.box}>
              <Ionicons name="book" size={24} color="rgb(8 96 88)" />
              <View  style={styles.boxtext}>
                  <Text onPress={handleTaskPress}>Profile</Text>
                  {/* <Text>Chapter 2</Text> */}
                  </View>
              </View>         
              <View style={styles.box}>
              <Ionicons name="book" size={24} color="rgb(8 96 88)" />
              <View  style={styles.boxtext}>
                  <Text onPress={handleTaskPress}>Profile</Text>
                  {/* <Text>Chapter 2</Text> */}
                  </View>
              </View>  
              <View style={styles.box}>
              <Ionicons name="book" size={24} color="rgb(8 96 88)" />
              <View  style={styles.boxtext}>
                  <Text onPress={handleTaskPress}>Profile</Text>
                  {/* <Text>Chapter 2</Text> */}
                  </View>
              </View>  
              <View style={styles.box}>
              <Ionicons name="book" size={24} color="rgb(8 96 88)" />
              <View  style={styles.boxtext}>
                  <Text onPress={handleTaskPress}>Profile</Text>
                  {/* <Text>Chapter 2</Text> */}
                  </View>
              </View>  
              <View style={styles.box}>
              <Ionicons name="book" size={24} color="rgb(8 96 88)" />
              <View  style={styles.boxtext}>
                  <Text onPress={handleTaskPress}>Profile</Text>
                  {/* <Text>Chapter 2</Text> */}
                  </View>
              </View>  
              <View style={styles.box}>
              <Ionicons name="book" size={24} color="rgb(8 96 88)" />
              <View  style={styles.boxtext}>
                  <Text onPress={handleTaskPress}>Profile</Text>
                  {/* <Text>Chapter 2</Text> */}
                  </View>
              </View>  
              <View style={styles.box}>
              <Ionicons name="book" size={24} color="rgb(8 96 88)" />
              <View  style={styles.boxtext}>
                  <Text onPress={handleTaskPress}>Profile</Text>
               
                  </View>
              </View>  
              <View style={styles.box}>
              <Ionicons name="book" size={24} color="rgb(8 96 88)" />
              <View  style={styles.boxtext}>
                  <Text onPress={handleTaskPress}>Profile</Text>
               
                  </View>
              </View>  
              <View style={styles.box}>
              <Ionicons name="book" size={24} color="rgb(8 96 88)" />
              <View  style={styles.boxtext}>
                  <Text onPress={handleTaskPress}>Profile</Text>
               
                  </View>
              </View>  
              <View style={styles.box}>
              <Ionicons name="book" size={24} color="rgb(8 96 88)" />
              <View  style={styles.boxtext}>
                  <Text onPress={handleTaskPress}>Profile</Text>
               
                  </View>
              </View>  
              <View style={styles.box}>
              <Ionicons name="book" size={24} color="rgb(8 96 88)" />
              <View  style={styles.boxtext}>
                  <Text onPress={handleTaskPress}>Profile</Text>
                 
                  </View>
              </View> 
            </View>
            </ScrollView>
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
           
            {/* <View  style={styles.piechart}>        
               <PieChart />     
            </View>    */}             
    </View>
  
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 16,
    backgroundColor: '#fff',
   
  },
  activebox:{
   backgroundColor:"green",

  },
  activeboxtext:{
    color:"#fff"
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
 
    flexDirection:"row",
    justifyContent:"space-between",
    flexWrap:"wrap"
  
  },

  box:{
    borderWidth:1,
    borderColor:"#ccc",
    width:"20%",
    backgroundColor:"#eaeaea",
    height:60,
    textAlign:"center",
    alignItems:"center",
    borderRadius:5,
    marginBottom:10,
    marginRight:5
   
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
 
  // dropdown: {
  //   width: 150,
  //   height: 50,
  //   transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }], 
  // },
});

export default DashboardScreen;
