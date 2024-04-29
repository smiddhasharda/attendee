import React,{useState} from 'react';
import { View, Text, StyleSheet, Dimensions,FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import DropDownPicker from "react-native-dropdown-picker";
import PieChart from './PieChart';

function Learn() {
  const [open, setOpen] = useState(false);
  const [examDates, setExamDates] = useState([])
  
  const [userRoleList, setUserRoleList] = useState([
    { label: 'Admin', value: 'admin' },
    { label: 'Teacher', value: 'teacher' },
    { label: 'Student', value: 'student' },
  ]);
  return (
    <ScrollView>
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
          <View style={styles.container}>    
               <View style={styles.dates}>
                <FlatList
                  data={[
                    { date: '1', weekday: 'Mon', month: 'Apr' },
                    { date: '2',weekday: 'Tue', month: 'Apr' },
                    { date: '3', weekday: 'Wed', month: 'Apr' },
                    { date: '4',weekday: 'Thu', month: 'Apr' },
                    { date: '5', weekday: 'Fri', month: 'Apr' },
                    { date: '6', weekday: 'Sat', month: 'Apr' },
                    {date: '7', weekday: 'Sun', month: 'Apr' },
                    {date: '8', weekday: 'Mon', month: 'Apr' },
                    { date: '9', weekday: 'Tue', month: 'Apr' },
                    { date: '10', weekday: 'Wed', month: 'Apr' },
                    { date: '11', weekday: 'Thu', month: 'Apr' },
                    {date: '12', weekday: 'Fri', month: 'Apr' },
                    { date: '13', weekday: 'Sat', month: 'Apr' },
                    { date: '14', weekday: 'Sun', month: 'Apr' },       
                  ]}
                  renderItem={({ item }) => (           
                    <View style={[styles.dateItem] }>
                        <Text style={styles.dateDay}>{item.weekday}</Text>
                        <Text style={styles.dateNumber}>{item.date}</Text>
                        <Text style={styles.dateMonth}>{item.month}</Text>
                    </View>
              
                  )}
                  horizontal={true}
                  // showsHorizontalScrollIndicator={false}
                  // scrollEnabled={false} 
                />
               </View>
                <View>
                <View style={styles.dropdownWrap}>
                    <DropDownPicker
                      open={open}
                      value={''}
                      items={userRoleList}
                      setOpen={setOpen}
                      setValue={(value) => ''}
                      style={styles.dropdown}
                      dropDownStyle={styles.dropDownList}               
                      // dropDownStyle={{ backgroundColor: "#fafafa" }}
                      dropDownMaxHeight={150}   
                      dropDownDirection="TOP"
                      containerStyle={styles.rolePicker}
                    />
                    <DropDownPicker
                      open={open}
                      value={''}
                      items={userRoleList}
                      setOpen={setOpen}
                      setValue={(value) => ''}
                      style={styles.dropdown}
                      dropDownStyle={{ backgroundColor: "#fafafa" }}
                      dropDownMaxHeight={150}
                      dropDownDirection="TOP"                  
                      containerStyle={styles.rolePicker}
                    />
                </View>
                  <PieChart/>
               </View>
          <Text>Total Student:50</Text>     
          </View>
       </View> 
  </ScrollView>
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
  container: {
    flex: 1,
    backgroundColor:"#fff" 
    
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
 
  roomNumber: {
    // flexDirection: "row",
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
    color:"#000",
  
  
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
    color:"#000"

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
  dropdownWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding:20,
  },
  dropdown: {
    width: '100%',
    
  },
  rolePicker:{
    width: 180,
  }
  
});
