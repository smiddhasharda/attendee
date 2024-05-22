import React from 'react';
import { View, Text, TextInput, StyleSheet ,ScrollView,} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native'; 
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
            </View>
            </ScrollView>
    </View>
  
  );
};

const styles = StyleSheet.create({
  container: {
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
});

export default DashboardScreen;
