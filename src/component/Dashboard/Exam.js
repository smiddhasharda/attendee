import React, { useState,useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons'

const Exam = ({ navigation }) => {
  const [examDates, setExamDates] = useState([{ EXAM_DT: '06-FEB-24' }, { EXAM_DT: '07-FEB-24' }, { EXAM_DT: '10-FEB-24' }])
  const [roomDetails, setRoomDetails] = useState([]);
  const [examSelectedDate, setExamSelectedDate] = useState(examDates[0].EXAM_DT);
  const [loading, setLoading] = useState(false);

  // Sample data for room details
  const sampleRoomData = [
    { EXAM_DT: '06-FEB-24', ROOM_NBR: 'RM-202 (BLOCK 4)',EXAM_START_TIME:'09:30:00.000000000 AM' },
    { EXAM_DT: '06-FEB-24', ROOM_NBR: 'RM-203 (BLOCK 4)',EXAM_START_TIME:'09:30:00.000000000 AM' },
    { EXAM_DT: '06-FEB-24', ROOM_NBR: 'RM-204 (BLOCK 4)',EXAM_START_TIME:'09:30:00.000000000 AM' },
    { EXAM_DT: '06-FEB-24', ROOM_NBR: 'RM-205 (BLOCK 4)',EXAM_START_TIME:'09:30:00.000000000 AM' },
    { EXAM_DT: '07-FEB-24', ROOM_NBR: 'RM-202 (BLOCK 4)',EXAM_START_TIME:'09:30:00.000000000 AM' },
    { EXAM_DT: '07-FEB-24', ROOM_NBR: 'RM-203 (BLOCK 4)',EXAM_START_TIME:'09:30:00.000000000 AM' },
    { EXAM_DT: '07-FEB-24', ROOM_NBR: 'RM-204 (BLOCK 4)',EXAM_START_TIME:'09:30:00.000000000 AM' },
    { EXAM_DT: '10-FEB-24', ROOM_NBR: 'RM-205 (BLOCK 4)',EXAM_START_TIME:'09:30:00.000000000 AM' }
  ];

  const fetchRoomDetails = (date) => {
    setLoading(true);
    // Simulate fetching data from API
    setTimeout(() => {
      const filteredRooms = sampleRoomData.filter(room => room.EXAM_DT === date);
      setRoomDetails(filteredRooms);
      setLoading(false);
    }, 1000); // Simulate 1 second delay
  };

  const handleDateClick = (date) => {
    setExamSelectedDate(date);
    fetchRoomDetails(date);
  };
  useEffect(() => {
    fetchRoomDetails(examSelectedDate)
  }, []);
  // const [currentTime, setCurrentTime] = useState(new Date());
  // useEffect(() => {
  //   // Update current time every second
  //   const interval = setInterval(() => {
  //     setCurrentTime(new Date());
  //   }, 1000);

  //   // Clear interval on component unmount
  //   return () => clearInterval(interval);
  // }, []);
  //  // Format time to HH:MM:SS format
  //  const formatTime = (time) => {
  //   const hours = time.getHours().toString().padStart(2, '0');
  //   const minutes = time.getMinutes().toString().padStart(2, '0');
  //   const seconds = time.getSeconds().toString().padStart(2, '0');
  //   return `${hours}:${minutes}:${seconds}`;
  // };
  // console.log(new Date()?.toLocaleDateString("en-GB", { day: "numeric", month: "numeric", year: "numeric", }) === new Date('05-APR-24')?.toLocaleDateString("en-GB", { day: "numeric", month: "numeric", year: "numeric", }))
  
  return (
    <View style={styles.container}>
       {/* <View >
      <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
    </View> */}
      <View style={styles.dates}>
        <FlatList
          data={examDates}
          renderItem={({ item }) => (
            <Pressable onPress={() => handleDateClick(item.EXAM_DT)}>
              <View style={[styles.dateItem, (item.EXAM_DT === examSelectedDate) && styles.activebox]}>
                <Text style={styles.dateDay}>{item.EXAM_DT.split('-')[1]}</Text>
                <Text style={styles.dateNumber}>{item.EXAM_DT.split('-')[0]}</Text>
                <Text style={styles.dateMonth}>{item.EXAM_DT.split('-')[2]}</Text>
              </View>
            </Pressable>
          )}
          horizontal={true}
        />
      </View>
      <View style={styles.roomNumber}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          roomDetails.length > 0 ? (
            <ScrollView>
              {roomDetails.map((roomData, index) => (
                // <View key={index} style={[styles.box, styles.activebox]}>
                //   <Ionicons style={styles.icons} name="book" size={24} color="rgb(8 96 88)" />
                //   <View style={styles.boxtext}>
                //     <Text style={[styles.examname, styles.activetext]}>{roomData.ROOM_NBR}</Text>
                //     <Text style={[styles.examtime, styles.activetext]}>{roomData.EXAM_START_TIME}</Text>
                //   </View>
                // </View>
                <Pressable onPress={() => navigation.navigate("RoomDetail", { room_Nbr: roomData.ROOM_NBR ,exam_Dt: roomData.EXAM_DT , startTime: roomData.EXAM_START_TIME })}>
                <View key={index} style={[styles.box]}>
                <Ionicons style={styles.icons} name="book" size={24} color="rgb(8 96 88)" />
                <View style={styles.boxtext}>
                  <Text style={[styles.examname]}>{roomData.ROOM_NBR}</Text>
                  <Text style={[styles.examtime]}>{roomData.EXAM_START_TIME}</Text>
                </View>
              </View>
              </Pressable>
                 
        /* <View style={styles.box}>
          <Ionicons name="book" size={24} color="rgb(8 96 88)" />
          <View style={styles.boxtext}>
          <Text style={styles.examname}>Exam Name</Text>       
          <Text>Room No.1</Text>
          <Text style={styles.examtime}>10:30 am</Text>
          </View>
        </View>
        <View style={styles.box}>
          <Ionicons name="book" size={24} color="rgb(8 96 88)" />
          <View style={styles.boxtext}>
          <Text style={styles.examname}>Exam Name</Text>       
          <Text>Room No.1</Text>
          <Text style={styles.examtime}>10:30 am</Text>
          </View>
        </View>
        <View style={styles.box}>
          <Ionicons name="book" size={24} color="rgb(8 96 88)" />
          <View style={styles.boxtext}>
          <Text style={styles.examname}>Exam Name</Text>      
          <Text>Room No.1</Text>
          <Text style={styles.examtime}>10:30 am</Text>
          </View>
        </View>
        <View style={styles.box}>
          <Ionicons name="book" size={24} color="rgb(8 96 88)" />
          <View style={styles.boxtext}>
          <Text style={styles.examname}>Exam Name</Text>      
          <Text>Room No.1</Text>
          <Text style={styles.examtime}>10:30 am</Text>
          </View>
        </View>
        <View style={styles.box}>
          <Ionicons name="book" size={24} color="rgb(8 96 88)" />
          <View style={styles.boxtext}>
          <Text style={styles.examname}>Exam Name</Text>      
          <Text>Room No.1</Text>
          <Text style={styles.examtime}>10:30 am</Text>
          </View>
        </View>
        <View style={styles.box}>
          <Ionicons name="book" size={24} color="rgb(8 96 88)" />
          <View style={styles.boxtext}>
          <Text style={styles.examname}>Exam Name</Text>      
          <Text>Room No.1</Text>
          <Text style={styles.examtime}>10:30 am</Text>
          </View>
        </View>
        <View style={styles.box}>
          <Ionicons name="book" size={24} color="rgb(8 96 88)" />
          <View style={styles.boxtext}>
          <Text style={styles.examname}>Exam Name</Text>      
          <Text>Room No.1</Text>
          <Text style={styles.examtime}>10:30 am</Text>
          </View>
        </View>
        <View style={[styles.box, styles.inactiveboxx]}>
          <Ionicons style={styles.icons} name="book" size={24} color="rgb(8 96 88)" />
          <View style={[styles.boxtext]}>
          <Text style={[styles.examname,styles. inactivetexts]}>Exam Name</Text>     
          <Text style={[styles.examname,styles. inactivetexts]}>Room No.1</Text>
          <Text style={[styles.examtime,styles. inactivetext]}>10:30 am</Text>
          </View>
        </View> */
              ))}
            </ScrollView>
          ) : (
            <Text>No rooms available for selected date.</Text>
          )
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  dates: {
    flexDirection: 'row',
    padding: 10
  },
  dateItem: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginRight: 6,
    alignItems: "center",
    width: 45,
  },
  dateNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateDay: {
    fontSize: 12,
    marginBottom: 5,
  },
  dateMonth: {
    fontSize: 12,
    marginTop: 5
  },
  roomNumber: {
    flex: 1,
    padding: 10,
  },
  box: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: Dimensions.get("window").width / 1 - 10,
    backgroundColor: "#eaeaea",
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
  examtime: {
    alignItems: "flex-start",
    color: "#a79f9f",
    marginRight: 10,
    marginLeft: 40,
  },
  examname: {
    fontWeight: "bold",
    marginRight: 30,
    maxWidth: 80,
  },
  activebox: {
    backgroundColor: "#0cb551",
    color: "#fff"
  },
  activetext: {
    color: "#fff",
  }
});

export default Exam;

