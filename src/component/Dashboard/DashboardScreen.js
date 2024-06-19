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
      <Text style={styles.heading}>Welcome to Attendance Portal</Text>      
          <TextInput
            style={styles.searchBox}
            placeholder="Search..."          
          />          
            <View style={styles.subtext}>
              <Text  style={styles.taskheading}>Navigation</Text>
            </View>
            <ScrollView vertical>        
            <View style={[styles.boxcontainer,]}>            
                <View style={[styles.box, styles.activebox]} >
                <Ionicons style={styles.icons} name="book" size={24} color="#fff"   />
                <View  style={[styles.boxtext,]}>
                  <Text style={styles.activeboxtext} onPress={handleLearnPress}>Exam</Text>
                  {/* <Text>Chapter 1</Text> */}
                </View>
              </View>
              <View style={styles.box}>
              <Ionicons  style={styles.icons} name="book" size={24} color="rgb(71 75 78)" />
              <View  style={styles.boxtext}>
                  <Text onPress={handleTaskPress}>Report</Text>
                  {/* <Text>Chapter 2</Text> */}
                  </View>
              </View>
              <View style={styles.box}>
              <Ionicons   style={styles.icons} name="book" onPress={()=> navigate('TopHeader')} size={24} color="rgb(71 75 78)" />
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
    minHeight:"100%"
   
  },
  activebox:{
  //  backgroundColor:"green",
  backgroundColor:"rgb(58 195 87)"

  },
  activeboxtext:{
    color:"#fff"
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtext:{
    flexDirection:"row",
    justifyContent:"space-between",
    marginBottom:10,  
  },
  taskheading:{
   fontSize:18,
   fontWeight:"bold",
  },
  viewAll:{
    fontSize:16,
    marginTop:10,
  },
  // icons:{
  // color:"#fff",
  // },
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
    borderColor:"transparent",
    // width:"20%",
    width:"30%",
   backgroundColor:"rgb(201 209 208)",
    // height:60,
    // height:"40%",
    padding:10,
    textAlign:"center",
    alignItems:"center",
    borderRadius:5,
    marginBottom:10,
    marginRight:5,
    alignSelf:"center",
   
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
