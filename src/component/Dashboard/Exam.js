 import React from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions ,ScrollView} from 'react-native';
import { Ionicons } from '@expo/vector-icons'

const Exam = () => {
  return (
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
            <View style={styles.dateItem}>
                 <Text style={styles.dateDay}>{item.weekday}</Text>
                <Text style={styles.dateNumber}>{item.date}</Text>
                <Text style={styles.dateMonth}>{item.month}</Text>
            </View>
      
          )}
          horizontal={true}
        />
      </View>
      <View style={styles.examstatus}>
          <Text style={styles.ongoing}>Ongoing</Text>
          <Text style={styles.upcoming}>Upcoming</Text>
      </View>
      <ScrollView style={styles.roomNumber}>
     
    <View style={styles.box}>
      <Ionicons style={styles.icons} name="book" size={24} color="rgb(8 96 88)" />
      <View style={styles.boxtext}>
        <Text>Room No.1</Text>
        <Text>17/2/24</Text>
        <Text>10:30 am</Text>
      </View>
    </View>
    <View style={styles.box}>
      <Ionicons name="book" size={24} color="rgb(8 96 88)" />
      <View style={styles.boxtext}>
      <Text>Room No.1</Text>
        <Text>17/2/24</Text>
        <Text>10:30 am</Text>
      </View>
    </View>
    <View style={styles.box}>
      <Ionicons name="book" size={24} color="rgb(8 96 88)" />
      <View style={styles.boxtext}>
      <Text>Room No.1</Text>
        <Text>17/2/24</Text>
        <Text>10:30 am</Text>
      </View>
    </View>
    <View style={styles.box}>
      <Ionicons name="book" size={24} color="rgb(8 96 88)" />
      <View style={styles.boxtext}>
      <Text>Room No.1</Text>
        <Text>17/2/24</Text>
        <Text>10:30 am</Text>
      </View>
    </View>
    <View style={styles.box}>
      <Ionicons style={styles.icons} name="book" size={24} color="rgb(8 96 88)" />
      <View style={styles.boxtext}>
        <Text>Room No.1</Text>
        <Text>17/2/24</Text>
        <Text>10:30 am</Text>
      </View>
    </View>
    <View style={styles.box}>
      <Ionicons name="book" size={24} color="rgb(8 96 88)" />
      <View style={styles.boxtext}>
      <Text>Room No.1</Text>
        <Text>17/2/24</Text>
        <Text>10:30 am</Text>
      </View>
    </View>
    <View style={styles.box}>
      <Ionicons name="book" size={24} color="rgb(8 96 88)" />
      <View style={styles.boxtext}>
      <Text>Room No.1</Text>
        <Text>17/2/24</Text>
        <Text>10:30 am</Text>
      </View>
    </View>
    <View style={styles.box}>
      <Ionicons name="book" size={24} color="rgb(8 96 88)" />
      <View style={styles.boxtext}>
      <Text>Room No.1</Text>
        <Text>17/2/24</Text>
        <Text>10:30 am</Text>
      </View>
    </View>
  </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginRight: 10,
    alignItems:"center"
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
    height: 100,
    textAlign: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 10,
    padding:10,
    
  },
  boxtext:{
    alignItems:"center",  
  },
});

export default Exam;
