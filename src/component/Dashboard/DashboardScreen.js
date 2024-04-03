import React, { useState } from 'react';
import { View, Text, Button, TextInput, FlatList, StyleSheet, TouchableOpacity ,ScrollView,Image} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import loginBackground from '../../local-assets/attendlogin.jpg';
import classe from '../../local-assets/classes.jpg';
import { useNavigation } from '@react-navigation/native'; 
const DashboardScreen = ({ navigation }) => {
  const { navigate } = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome</Text>      
          <TextInput
            style={styles.searchBox}
            placeholder="Search..."          
          />
  
            <View style={styles.subtext}>
              <Text  style={styles.taskheading}>Learn</Text>
              <Text  onPress={() => navigate('Learn')} style={styles.viewAll}>View All</Text>
            </View>
         
            <View style={styles.boxcontainer}>            
                <View style={styles.box}>
                <Ionicons style={styles.icons} name="book" size={24} color="rgb(8 96 88)"  />
                <View  style={styles.boxtext}>
                  <Text>Maths</Text>
                  <Text>Chapter 1</Text>
                </View>
              </View>
              <View style={styles.box}>
              <Ionicons name="book" size={24} color="rgb(8 96 88)" />
              <View  style={styles.boxtext}>
                  <Text>Statics</Text>
                  <Text>Chapter 2</Text>
                  </View>
              </View>
              <View style={styles.box}>
              <Ionicons name="book" size={24} color="rgb(8 96 88)" />
              <View  style={styles.boxtext}>
                  <Text>Econamics</Text>
                  <Text>Chapter 3</Text>
                  </View>
              </View>
              
            </View>
            <View style={styles.subtext}>
              <Text style={styles.taskheading}>Task</Text>
              <Text onPress={() => navigate('Task')} style={styles.viewAll}>View All</Text>
            </View>
          
            <View style={styles.boxcontainer}>            
                <View style={styles.taskbox}>
                <Ionicons name="book" size={24} color="rgb(8 96 88)"  />
                <View  style={styles.boxtext}>
                  <Text>Hindi Lectures</Text>
                  <Text>2 tasks</Text>
                </View>
              </View>
          
              <View style={styles.taskbox}>
              <Ionicons name="book" size={24} color="rgb(8 96 88)" />
              <View  style={styles.boxtext}>
                  <Text>English Lectures</Text>
                  <Text>2 tasks</Text>
                  </View>
              </View>
            
            </View>
            <View style={styles.subtext}>
              <Text style={styles.taskheading}>Up Coming Classes</Text>
              <Text style={styles.viewAll}>View All</Text>
            </View>
         
            <View style={styles.boxcontainer}>            
                <View style={styles.taskbox}>               
                <Image source ={classe} style={styles.imagebg} />       
              </View>
              <View style={styles.taskbox}>               
                <Image source ={classe} style={styles.imagebg} />       
              </View>              
            </View>
      
    </View>
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

});

export default DashboardScreen;
