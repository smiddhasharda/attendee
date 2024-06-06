import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { view, fetch } from "../../AuthService/AuthService";
import { useToast } from "../../globalComponent/ToastContainer/ToastContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { parse, format } from 'date-fns';

const ExamScreen = ({ navigation, userAccess, userData }) => {
  const UserAccess = userAccess?.module?.find((item) => item?.FK_ModuleId === 5);
  const [examDates, setExamDates] = useState([]);
  const [roomDetails, setRoomDetails] = useState([]);
  const [examSelectedDate, setExamSelectedDate] = useState('');
  const [invigilatorData, setInvigilatorData] = useState();
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  // const [open, setOpen] = useState(false);
  // const [userRoleList, setUserRoleList] = useState([
  //   { label: 'OnGoing', value: 'ongoing' },
  //   { label: 'Upcoming Exam', value: 'Upcoming' },
 
  // ]);

  const checkAuthToken = useCallback(async () => {
    const authToken = await AsyncStorage.getItem("authToken");
    if (!authToken) {
      addToast("Authentication token not available", "error");
      throw new Error("Authentication token not available");
    }
    return authToken;
  }, [addToast]);

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
    addToast(errorMessages[error.message] || "Module Operation Failed", "error");
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

  const convertedTime = (StartTime) => {
    const date = new Date(StartTime);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Pad minutes with leading 0
  
    const amPm = hours >= 12 ? 'PM' : 'AM';
    const adjustedHours = hours % 12 || 12; // Convert to 12-hour format
  
    return `${adjustedHours}:${minutes}${amPm}`;
  }
  
  const parseAndFormatDate = (dateString) => {
    // Define possible date formats
    const possibleFormats = [
      "yyyy-MM-dd'T'HH:mm:ss.SSSX", // ISO format
      "dd-MMMM-yyyy",               // e.g., 03-July-2023
      "MM/dd/yyyy",                 // e.g., 07/03/2023
      "yyyy-MM-dd",                 // e.g., 2023-07-03
    ];
  
    let parsedDate;
    for (let formatString of possibleFormats) {
      try {
        parsedDate = parse(dateString, formatString, new Date());
        if (!isNaN(parsedDate)) break;
      } catch (error) {
        continue;
      }
    }
  
    if (!parsedDate || isNaN(parsedDate)) {
      console.error('Invalid date format:', dateString);
      return null;
    }
  
    return parsedDate;
  };
  

  useEffect(() => {
    fetchRoomDetails(examSelectedDate);
  }, [UserAccess]);

  return (
    <View style={styles.container}>
      <View style={styles.datesWrap}>
        <View style={styles.dates}>
          <FlatList
            data={examDates}
            renderItem={({ item }) => {
              const isActiveItem = item.EXAM_DT === examSelectedDate;
              const normalizedDate = parseAndFormatDate(item.EXAM_DT);
              return (
                 <Pressable onPress={() => handleDateClick(item.EXAM_DT)}>
      <View style={[styles.dateItem, isActiveItem && styles.activebox]}>
        <Text style={[styles.dateDay, isActiveItem && styles.activeText]}>
          {normalizedDate.toString().split(' ')[0]}
        </Text>
        <Text style={[styles.dateNumber, isActiveItem && styles.activeText]}>
          {normalizedDate.getDate()}
        </Text>
        <Text style={[styles.dateMonth, isActiveItem && styles.activeText]}>
          {normalizedDate.toString().split(' ')[1]}
        </Text>
      </View>
    </Pressable>
              );
            }}
            horizontal
            keyExtractor={(item) => item.EXAM_DT}
          />
        </View>
        {/* <View style={styles.searchicons}>
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
        </View>  */}
      </View>
      <View style={styles.roomNumber}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          // roomDetails.length > 0 ? (
          //   <ScrollView style={styles.scrollabar}>
          //     {roomDetails.map((roomData, index) => (
          //       <Pressable
          //         key={index}
          //         onPress={() => UserAccess?.create === 1 ? navigation.navigate("RoomDetail", { room_Nbr: roomData.ROOM_NBR, exam_Dt: roomData.EXAM_DT, startTime: roomData.EXAM_START_TIME,navigation,userAccess }) : null}
          //       >
          //         <View  style={styles.box}>   
          //           <View style={styles.boxTextWrap}>
          //             <Text style={styles.examName}>{roomData.ROOM_NBR}</Text>
          //             <Text style={styles.examTimedetail}>{roomData.EXAM_START_TIME?.split("T")?.[1]?.split(".")?.[0]}</Text>
          //           </View>
          //         </View>
          //       </Pressable>
          //     ))}
          //   </ScrollView>
          // ) : (
          //   <Text>No rooms available for selected date.</Text>
          // )

          <FlatList 
          style={styles.roomsListWrap}
          data={roomDetails}
          renderItem={({ item, index }) => (
            <Pressable
              key={index}
              onPress={() => UserAccess?.create === 1 ? navigation.navigate("RoomDetail", { room_Nbr: item.ROOM_NBR, exam_Dt: item.EXAM_DT, startTime: item.EXAM_START_TIME, userAccess}) : null}
            >
                <View style={[styles.box,styles.boxTextWrap]}>
                  <Text style={styles.examName}>{item.ROOM_NBR}</Text>
                  {/* <Text style={styles.examTime}>{item.EXAM_START_TIME?.split("T")?.[1]?.split(".")?.[0]}</Text> */}
                  <Text style={styles.examTime}>{convertedTime(item.EXAM_START_TIME)}</Text>

                </View>
            </Pressable>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
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
    alignItems:"center",
     marginBottom:15,
  },
  searchicons:{
     padding:"10px",
     alignSelf:"center",
     flexDirection:"row",
     marginRight:"10px",
  },
  dates: {
    // padding: 10,
    // width:"50%",
    width:'auto',
    // backgroundColor:"#e1e1e1",
    // // borderWidth:1,
    // // borderRadius:25,
    // borderColor:"#ccc",
    // borderTopWidth:1,
    // borderBottomWidth:1,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#dddedf",
    borderTopWidth: 0,
    marginTop: 0,
  },
  dateItem: {
    padding: 10,
    // marginRight: 6,
    minWidth: 60,
    alignItems: "center",
    //  width:65,
    //  height:40,
    //  justifyContent:"center"
  },
  dateNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateDay: {
    fontSize: 12,
    marginBottom: 3,
  },
  dateMonth: {
    fontSize: 12,
    marginTop: 3,
  },
  roomNumber: {
    flex: 1,
    // marginTop:4,
    // marginHorizontal:0,
    // marginVertical:0,
  },
  roomsListWrap:{
    overflow: "auto",
    padding: 8
  },
  box: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: 'auto',
    borderRadius: 6,
    marginBottom: 12,
    minHeight: 62,
    padding:12,
    flexDirection:"column",
    alignItems: "center",
    clear: "both"
  },
  
  boxTextWrap:{
    flexDirection:"row",
    // marginLeft:10,
    color:"#000",
    justifyContent:"space-between",

  },
 
  examTimedetail: {
    textAlign: "right",
    color:"#a79f9f",
    // marginRight:10,
    // marginLeft:40, 
  },
  examName: {
    fontWeight: "bold",
    marginRight: 30,
  },
  activebox: {
    backgroundColor: "#0cb551",
    color: "#fff",
    
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
