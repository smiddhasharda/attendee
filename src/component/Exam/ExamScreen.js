import React, { useState,useEffect,useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {  view,fetch } from "../../AuthService/AuthService";
import { useToast } from "../../globalComponent/ToastContainer/ToastContext";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ExamScreen = ({ navigation,userAccess,userData }) => {
  const UserAccess = userAccess?.module?.filter((item)=> item?.FK_ModuleId === 5)?.[0];
  const [examDates, setExamDates] = useState([]);
  const [roomDetails, setRoomDetails] = useState([]);
  const [examSelectedDate, setExamSelectedDate] = useState('');
  const [invigilatorData, setInvigilatorData] = useState();

  const [loading, setLoading] = useState(false);

  const fetchRoomDetails = async(date) => {
    setLoading(true);
    await userAccess?.label === "Admin" ? handleGetDateView() : handleGetInvigilatorDutyDate() ;
  };


  const handleDateClick = (date) => {
    setLoading(true);
    setExamSelectedDate(date);
    let RoomArray = invigilatorData?.filter((item) => item?.date === date)?.map((item)=> item?.room);
    handleGetRoomView(date, userAccess?.label !== "Admin" && RoomArray); 
  };

  const { showToast } = useToast();
  const checkAuthToken = useCallback(async () => {
    const authToken = await AsyncStorage.getItem("authToken");

    if (!authToken) {
      showToast("Authentication token not available", "error");
      throw new Error("Authentication token not available");
    }

    return authToken;
  }, [showToast]);

  const handleGetDateView = async () => {
    try {
      const authToken = await checkAuthToken();
      const response = await view(
        {
          operation: "custom",
          tblName: "PS_S_PRD_EX_TME_VW",
          data: '',
          conditionString: '',
          checkAvailability: '',
          customQuery: `SELECT DISTINCT EXAM_DT FROM PS_S_PRD_EX_TME_VW ORDER BY EXAM_DT ASC `,                 
        },
        authToken
      );

      if (response) {
        setExamDates(response?.data);
        setExamSelectedDate(response?.data?.[0]?.EXAM_DT);
        handleGetRoomView(response?.data?.[0]?.EXAM_DT);
      }
    } catch (error) {
      setLoading(false);
      handleAuthErrors(error);
    }
  };

  const handleGetInvigilatorDutyDate = async () => {
    try {
      const authToken = await checkAuthToken();
      const response = await fetch(
        {
          operation: "custom",
          tblName: "tbl_invigilator_duty",
          data: "",
          conditionString: `employeeId = '${userData?.username}' ORDER BY date ASC `,
          checkAvailability: "",
          customQuery: `SELECT DISTINCT date,room FROM tbl_invigilator_duty WHERE employeeId = '${userData?.username}' ORDER BY date ASC `,
        },
        authToken
      );

      if (response) {
        setInvigilatorData(response.data);
        let ExamDateArray = response?.data ?.filter((item, index, self) => index === self.findIndex((t) => t.date === item.date) ) ?.map((item) => ({ 'EXAM_DT': item?.date }));
        setExamDates(ExamDateArray);
        setExamSelectedDate(response?.data?.[0]?.date);
        let RoomArray = response?.data ?.filter((item) => item?.date === response?.data?.[0]?.date)?.map((item)=> item?.room);
        handleGetRoomView(response?.data?.[0]?.date,RoomArray);
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };


  const handleGetRoomView = async (SelectedDate, RoomArray) => {
    try {
      const authToken = await checkAuthToken();
      const formattedDate = new Date(SelectedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).toUpperCase().replace(/ /g, '-');
      const roomCondition = RoomArray && RoomArray.length > 0 ? `AND PS_S_PRD_EX_RME_VW.ROOM_NBR IN (${RoomArray.map(room => `'${room}'`).join(', ')})` : '';
      const customQuery = ` SELECT DISTINCT PS_S_PRD_EX_RME_VW.EXAM_DT, PS_S_PRD_EX_RME_VW.ROOM_NBR, PS_S_PRD_EX_TME_VW.EXAM_START_TIME FROM PS_S_PRD_EX_RME_VW JOIN PS_S_PRD_EX_TME_VW ON PS_S_PRD_EX_RME_VW.EXAM_DT = PS_S_PRD_EX_TME_VW.EXAM_DT WHERE PS_S_PRD_EX_RME_VW.EXAM_DT = '${formattedDate}' ${roomCondition} `;
     const response = await view(
        {
          operation: "custom",
          tblName: "PS_S_PRD_EX_RME_VW",
          data: '',
          conditionString: '',
          checkAvailability: '',
          customQuery: customQuery
        },
        authToken
      );
  
      if (response) {
        setRoomDetails(response?.data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      handleAuthErrors(error);
    }
  };


  const handleAuthErrors = (error) => {
    switch (error.message) {
      case "Invalid credentials":
        showToast("Invalid authentication credentials", "error");
        break;
      case "Data already exists":
        showToast("Module with the same name already exists", "error");
        break;
      case "No response received from the server":
        showToast("No response received from the server", "error");
        break;
      default:
        showToast("Module Operation Failed", "error");
    }
  };

  useEffect(() => {
    fetchRoomDetails(examSelectedDate)
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.dates}>
      <FlatList
  data={examDates}
  renderItem={({ item }) => {
    let isActiveItem = item.EXAM_DT === examSelectedDate;
    return (
      <Pressable onPress={() => handleDateClick(item.EXAM_DT)}> 
        <View style={[styles.dateItem, isActiveItem && styles.activebox]}>
        <Text style={[styles.dateDay, isActiveItem && { color: 'white' }]}> {new Date(item.EXAM_DT).toString().split(' ')[1]} </Text>
          <Text style={[styles.dateNumber, isActiveItem && { color: 'white' }]}>{new Date(item.EXAM_DT).toString().split(' ')[2]}</Text>
          <Text style={[styles.dateMonth, isActiveItem && { color: 'white' }]}>{new Date(item.EXAM_DT).toString().split(' ')[3]}</Text>
        </View>
      </Pressable>
    );
  }}
  horizontal={true}
/>
      </View>
      <View style={styles.roomNumber}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          roomDetails.length > 0 ? (
            <ScrollView style={styles.scrollabar}>
              {roomDetails.map((roomData, index) => (
                <Pressable onPress={() => UserAccess?.create === 1 ? navigation.navigate("RoomDetail", { room_Nbr: roomData.ROOM_NBR ,exam_Dt: roomData.EXAM_DT , startTime: roomData.EXAM_START_TIME ,navigation,userAccess }) : ''}>
                <View key={index} style={[styles.box]}>
                {/* <View key={index} style={[styles.box, styles.activebox]}> */}
                <Ionicons style={styles.icons} name="book" size={24} color="rgb(8 96 88)" />
                <View style={styles.boxtext}>
                  <Text style={[styles.examname]}>{roomData.ROOM_NBR}</Text>
                  <Text style={[styles.examtime]}>{roomData.EXAM_START_TIME?.split("T")?.[1]?.split(".")?.[0]}</Text>
                </View>
              </View>
              </Pressable>
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
    width: 'auto',
    borderRadius: 10,
    marginBottom: 10,
    padding:20,
    flexDirection:"column",
  },
  boxtext:{ 
    flexDirection:"row",
    marginLeft:10,
    color:"#000",
    justifyContent:"space-between",
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
  },
  dropdownWrap: {
    marginRight:"10px"
  },
  dropdown: {
    width: '50%',
    width: '100%',  
  },
});

export default ExamScreen;

