import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { view, fetch } from "../../AuthService/AuthService";
import { useToast } from "../../globalComponent/ToastContainer/ToastContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from "react-native-dropdown-picker";

const ExamScreen = ({ navigation, userAccess, userData }) => {
  const UserAccess = userAccess?.module?.find((item) => item?.FK_ModuleId === 5);
  const [examDates, setExamDates] = useState([]);
  const [roomDetails, setRoomDetails] = useState([]);
  const [examSelectedDate, setExamSelectedDate] = useState('');
  const [invigilatorData, setInvigilatorData] = useState();
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();

  const [open, setOpen] = useState(false);
  const [userRoleList, setUserRoleList] = useState([
    { label: 'OnGoing', value: 'ongoing' },
    { label: 'Upcoming Exam', value: 'Upcoming' },
 
  ]);

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
          customQuery: `SELECT DISTINCT EXAM_DT FROM PS_S_PRD_EX_TME_VW ORDER BY EXAM_DT ASC`,
        },
        authToken
      );

      if (response) {
        setExamDates(response.data);
        setExamSelectedDate(response.data?.[0]?.EXAM_DT);
        handleGetRoomView(response.data?.[0]?.EXAM_DT);
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
          data: '',
          conditionString: '',
          checkAvailability: '',
          customQuery: `SELECT DISTINCT date, room FROM tbl_invigilator_duty WHERE employeeId = '${userData?.username}' ORDER BY date ASC`,
        },
        authToken
      );

      if (response) {
        setInvigilatorData(response.data);
        const ExamDateArray = response.data.filter((item, index, self) => index === self.findIndex((t) => t.date === item.date)).map((item) => ({ EXAM_DT: item.date }));
        setExamDates(ExamDateArray);
        setExamSelectedDate(response.data?.[0]?.date);
        const RoomArray = response.data.filter((item) => item.date === response.data?.[0]?.date).map((item) => item.room);
        handleGetRoomView(response.data?.[0]?.date, RoomArray);
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
      const customQuery = `SELECT DISTINCT PS_S_PRD_EX_RME_VW.EXAM_DT, PS_S_PRD_EX_RME_VW.ROOM_NBR, PS_S_PRD_EX_TME_VW.EXAM_START_TIME FROM PS_S_PRD_EX_RME_VW JOIN PS_S_PRD_EX_TME_VW ON PS_S_PRD_EX_RME_VW.EXAM_DT = PS_S_PRD_EX_TME_VW.EXAM_DT WHERE PS_S_PRD_EX_RME_VW.EXAM_DT = '${formattedDate}' ${roomCondition}`;

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
        setRoomDetails(response.data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      handleAuthErrors(error);
    }
  };

  const handleAuthErrors = (error) => {
    const errorMessages = { "Invalid credentials": "Invalid authentication credentials", "Data already exists": "Module with the same name already exists", "No response received from the server": "No response received from the server", };
    showToast(errorMessages[error.message] || "Module Operation Failed", "error");
  };

  const fetchRoomDetails = async (date) => {
    setLoading(true);
    if (userAccess?.label === "Admin") {
      handleGetDateView();
    } else {
      handleGetInvigilatorDutyDate();
    }
  };

  const handleDateClick = (date) => {
    setLoading(true);
    setExamSelectedDate(date);
    const RoomArray = invigilatorData?.filter((item) => item.date === date)?.map((item) => item.room);
    handleGetRoomView(date, userAccess?.label !== "Admin" && RoomArray);
  };

  useEffect(() => {
    fetchRoomDetails(examSelectedDate);
  }, []);

  return (
    <View style={styles.container}>
    <View style={styles.datesWrap}>
      <View style={styles.dates}>
        <FlatList
          data={examDates}
          renderItem={({ item }) => {
            const isActiveItem = item.EXAM_DT === examSelectedDate;
            return (
              <Pressable onPress={() => handleDateClick(item.EXAM_DT)}>
                <View style={[styles.dateItem, isActiveItem && styles.activebox]}>
                  <Text style={[styles.dateDay, isActiveItem && styles.activeText]}>{new Date(item.EXAM_DT).toString().split(' ')[0]}</Text>
                  <Text style={[styles.dateNumber, isActiveItem && styles.activeText]}>{new Date(item.EXAM_DT).getDate()}</Text>
                  <Text style={[styles.dateMonth, isActiveItem && styles.activeText]}>{new Date(item.EXAM_DT).toString().split(' ')[1]}</Text>
                </View>
              </Pressable>
            );
          }}
          horizontal
          keyExtractor={(item) => item.EXAM_DT}
        />
      </View>
      <View style={styles.searchicons}>
            <View style={styles.dropdownWrap}>             
                 <DropDownPicker
                  open={open}
                  value={''}
                  items={userRoleList}
                  setOpen={setOpen}
                  // setValue={(value) => ''}
                  style={styles.dropdown}
                  dropDownStyle={{ backgroundColor: "#fafafa" }}
                  dropDownMaxHeight={150}
                  dropDownDirection="Bottom"                 
                  containerStyle={styles.rolePicker}
                />
            </View>
      <Feather name="search" size={28} color="black" />
      </View> 
      </View>
      <View style={styles.roomNumber}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          roomDetails.length > 0 ? (
            <ScrollView style={styles.scrollabar}>
              {roomDetails.map((roomData, index) => (
                <Pressable
                  key={index}
                  onPress={() => UserAccess?.create === 1 ? navigation.navigate("RoomDetail", { room_Nbr: roomData.ROOM_NBR, exam_Dt: roomData.EXAM_DT, startTime: roomData.EXAM_START_TIME,navigation,userAccess }) : null}
                >
                  <View style={styles.box}>
                    <Ionicons style={styles.icons} name="book" size={24} color="rgb(8 96 88)" />
                    <View style={styles.boxText}>
                      <Text style={styles.examName}>{roomData.ROOM_NBR}</Text>
                      <Text style={styles.examTime}>{roomData.EXAM_START_TIME?.split("T")?.[1]?.split(".")?.[0]}</Text>
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
    backgroundColor: "#fff",
  },
  datesWrap:{
    flexDirection:"row",
    justifyContent:"space-between",
  },
  searchicons:{
     padding:"10px",
     alignSelf:"center",
     flexDirection:"row",
     marginRight:"10px",
  },

  dates: {
    padding: 10,
    width:"50%",
  },
  dateItem: {
    padding: 10,
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
    marginTop: 5,
  },
  roomNumber: {
    flex: 1,
    padding: 20,
  },
  box: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: 'auto',
    borderRadius: 25,
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
 
  examtime: {
    alignItems: "flex-start",
    color: "#a79f9f"
  },
  examName: {
    fontWeight: "bold",
    marginRight: 30,
  },
  activebox: {
    backgroundColor: "#0cb551",
  },
  activeText: {
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
