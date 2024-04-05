import React from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions ,ScrollView,Image,TextInput} from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import user from '../../local-assets/userimg.jpg'

function RoomDetail() {
  return (
    <View style={styles.container}>   
    <View  style={styles.searchWrap}>
      <TextInput
            style={styles.searchBox}
            placeholder="Search..."          
          />
  </View>
    <ScrollView style={styles.roomNumber}>   
          <View style={[styles.box,]}>   
          <View style={[styles.boxtext]}>
          <Image source={user} style={styles.userimage}   />
          <Text style={[styles.examname,styles. activetext]}>Shubham</Text>     
          <Text style={[styles.examname,styles. activetext]}>Seat No</Text>
          </View>  
          </View>
          <View style={[styles.box, styles.activebox]}>   
          <View style={[styles.boxtext]}>
          <Image source={user} style={styles.userimage}   />
          <Text style={[styles.examname,styles. activetext]}>Shubham</Text>     
          <Text style={[styles.examname,styles. activetext]}>Seat No</Text>
          </View>  
          </View>
          <View style={[styles.box, ]}>   
          <View style={[styles.boxtext]}>
          <Image source={user} style={styles.userimage}   />
          <Text style={[styles.examname,styles. activetext]}>Shubham</Text>     
          <Text style={[styles.examname,styles. activetext]}>Seat No</Text>
          </View>  
          </View>
          <View style={[styles.box, ]}>   
          <View style={[styles.boxtext]}>
          <Image source={user} style={styles.userimage}   />
          <Text style={[styles.examname,styles. activetext]}>Shubham</Text>     
          <Text style={[styles.examname,styles. activetext]}>Seat No</Text>
          </View>  
          </View>
          <View style={[styles.box,]}>   
          <View style={[styles.boxtext]}>
          <Image source={user} style={styles.userimage}   />
          <Text style={[styles.examname,styles. activetext]}>Shubham</Text>     
          <Text style={[styles.examname,styles. activetext]}>Seat No</Text>
          </View>  
          </View>
          <View style={[styles.box, ]}>   
          <View style={[styles.boxtext]}>
          <Image source={user} style={styles.userimage}   />
          <Text style={[styles.examname,styles. activetext]}>Shubham</Text>     
          <Text style={[styles.examname,styles. activetext]}>Seat No</Text>
          </View>  
          </View>
          <View style={[styles.box, ]}>   
          <View style={[styles.boxtext]}>
          <Image source={user} style={styles.userimage}   />
          <Text style={[styles.examname,styles. activetext]}>Shubham</Text>     
          <Text style={[styles.examname,styles. activetext]}>Seat No</Text>
          </View>  
          </View>
          <View style={[styles.box, ]}>   
          <View style={[styles.boxtext]}>
          <Image source={user} style={styles.userimage}   />
          <Text style={[styles.examname,styles. activetext]}>Shubham</Text>     
          <Text style={[styles.examname,styles. activetext]}>Seat No</Text>
          </View>  
          </View>
    </ScrollView>
  </View>
  );
}

export default RoomDetail;


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:"#fff" ,

    },
    heading: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    dates: {
      flexDirection: 'row',
      padding:10
    },
    
    dateItem: {
      padding: 10,
      backgroundColor: '#f0f0f0',
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 5,
      marginRight: 6,
      alignItems:"center",
      width: 45,
  
    },
   
    dateNumber: {
      fontSize: 16,
      fontWeight: 'bold',
   
    },
    dateDay: {
      fontSize: 12,
      marginBottom:5,
    },
    dateMonth: {
      fontSize: 12,
      marginTop:5
    },
    examstatus:{
        flexDirection:"row",
        justifyContent:"space-between",
        padding:12,
        borderBottomWidth: 1,
        borderBottomColor:"#ccc",
        marginBottom:10
     
    },
    ongoing:{
          fontSize:16,
          fontWeight:"bold",
          borderWidth:1,
          borderColor:"#ccc",
          padding:10,
          backgroundColor:"#0cb551",
          // color:"#fff"
    },
    upcoming:{
      fontSize:16,
      fontWeight:"bold",
      borderWidth:1,
      borderColor:"#ccc",
      padding:10 ,
      backgroundColor:"#ccc"
  
    },
    roomNumber: {
    //   flexDirection: "column",
      // flexWrap: "wrap",
      marginBottom: 10,
      padding: 10,
     
    },
    box: {
      borderWidth: 1,
      borderColor: "#ccc",
      width: Dimensions.get("window").width / 1 - 10, 
      backgroundColor: "#eaeaea",
      // height: 55,
      // textAlign: "center",
      // alignItems: "center",
      borderRadius: 10,
      marginBottom: 10,
      padding:10,
      flexDirection:"row",
  
    },
    boxtext:{
      // alignItems:"center",  
      flexDirection:"row",
      marginLeft:10,
      justifyContent:"space-between",
      alignItems:"center",
   
    
    },
    userimage:{
        width:40,
        height:40,
        borderRadius:50,
        resizeMode:"cover",
        marginRight:10
    },
    examtime:{
      alignItems:"flex-start",
      color:"#a79f9f",
      marginRight:10,
      marginLeft:40,
   
    },
    examname:{
      fontWeight:"bold",
      marginRight:30,
      maxWidth:80,
  
    },
    activebox:{
      backgroundColor:"#0cb551",
      color:"#fff"
    },
    activetext:{
      color:"#fff",
    },
    inactivetext:{
      color:"#fff",
    },
    inactivebox:{
      backgroundColor:"#e50d0d"
    },
    searchBox: {
      height: 40,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      padding:10,
      marginBottom: 16,
   
    },
    searchWrap:{
      padding:10,
    }
  });
