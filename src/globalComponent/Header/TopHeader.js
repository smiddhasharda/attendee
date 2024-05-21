import React,{useState} from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import DropDownPicker from "react-native-dropdown-picker";
import TabNavigator from '../TabNavigator';


function TopHeader() {
  
  const [open, setOpen] = useState(false);
  const [userRoleList, setUserRoleList] = useState([
    { label: 'OnGoing', value: 'ongoing' },
    { label: 'Upcoming Exam', value: 'Upcoming' },
 
  ]);
  return (
    <ScrollView>
    <View style={styles.container}>
      <View style={styles.headerWrap}>
          <View style={styles.headertextWrap}>
                  <View style={styles.profileinfo}>
                  <Text style={{color:"#fff" ,fontSize:"16px" ,fontWeight:"bold" }}>Sanaya Dubey</Text>
                  <View style={styles.facultyWrap}>
                  <Text  style={{color:"#fff",fontSize:"16px", fontWeight:"bold"}}>Faculty Role</Text>
                  {/* <View style={styles.dropdownWrap}>             
                 <DropDownPicker
                  open={open}
                  value={''}
                  items={userRoleList}
                  setOpen={setOpen}
                  // setValue={(value) => ''}
                  style={styles.dropdown}
                  // dropDownStyle={{ backgroundColor: "#fafafa" }}
                  dropDownMaxHeight={100}
                  dropDownDirection="Bottom"                 
                  containerStyle={styles.rolePicker}
                />
                </View> */}
            </View>
                  </View>
                  <View style={{top:"0"}}>
                  <Image  style={styles.profileimg}  source= {require("../../local-assets/profile.jpg")} />   
                  </View>
          </View>  
      </View>     
                        {/* <View style={styles.graphicalrep}>
                          <View>
                              <Text>Graphical View</Text>
                          
                          </View>
                        </View> */}
                        {/* <Content /> */}
                          {/* <View style={styles.maincontain}>
                          <Text style={styles.attendacehead}>Attendance</Text>
                            <View style={styles.boxmain}>
                          <View style={styles.boxesWrap}>
                            <Text style={styles.boxcount}>02</Text>
                            <Text>Exam</Text>
                          </View>
                            <View style={styles.boxesWrap}>
                              <Text style={styles.boxcount}>02</Text>
                              <Text>Report</Text>
                            </View>
                            <View style={styles.boxesWrap}>
                              <Text style={styles.boxcount}>02</Text>
                              <Text>Report</Text>
                            </View>
                            <View style={styles.boxesWrap}>
                              <Text style={styles.boxcount}>02</Text>
                              <Text>Report</Text>
                            </View>
                            <View style={styles.boxesWrap}>
                              <Text style={styles.boxcount}>02</Text>
                              <Text>Report</Text>
                            </View>
                        
                            </View>
                          </View> */}
                         
    </View>
    </ScrollView>
  );
}

export default TopHeader;

const styles = StyleSheet.create({
    container:{
       flex:1,
       alignItems:"center"
    },
  headerWrap: {
    backgroundColor: "rgb(17, 65, 102)",
    // padding: 40,
    // width:400,
    width:"100%",
    // height:"40%",
  },
  headertextWrap:{
     padding:10,
     justifyContent:"space-between",
     flexDirection:"row",
     alignItems:"center",
  },
  graphicalrep:{
      backgroundColor:"#fff",
      padding:20,
      width:"50%",
      position:"relative",
      bottom:"20px",
      borderRadius:"10px",
      height:"50%"
  },
  maincontain:{
     width:"100%",
  },
  profileimg:{
    width:40,
    height:40,
    borderRadius:50,
    top:"-14px",
    position:"relative",
    // left:"10%",
  },
  profileinfo:{
    top:0,
  },
  maincontain:{
    backgroundColor:"#fff",
    width:"90%",
    padding:20,
    borderRadius:"20px"
  },
  attendacehead:{
    fontSize:"16px",
    fontWeight:"600",
    marginBottom:"10px",
  },
  boxmain:{
  flexDirection:"row",
  justifyContent:"space-between",
  flexWrap:"wrap",
  },
  boxesWrap:{
    borderWidth:1,
    borderColor:"#ccc",
    padding:"10px",
    backgroundColor:"rgb(219 233 245);",
    marginBottom:"10px",
    borderRadius:"10px",
    marginRight:"10px",
    alignItems:"center",
    width:"42%",
    // marginRight:"10px"
 
  },
  boxcount:{
    fontWeight:"bold",
  },
  facultyWrap:{
    flexDirection:"row",
    marginRight:"20px",
    padding:"10px"
  }
});
