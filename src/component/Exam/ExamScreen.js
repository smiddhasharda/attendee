import React, { useState, useEffect, useCallback,useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, ActivityIndicator, Dimensions,Platform } from 'react-native';
import { view, fetch } from "../../AuthService/AuthService";
import { useToast } from "../../globalComponent/ToastContainer/ToastContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { parse, format,parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import CryptoJS from 'crypto-js';

const { width, height } = Dimensions.get('window');

const ExamScreen = ({ navigation, userAccess, userData }) => {
  const UserAccess = userAccess?.module?.find((item) => item?.FK_ModuleId === 5);
  const [refreshing, setRefreshing] = useState(false);
  const [pageRefreshing, setPageRefreshing] = useState(false);
  const [examDates, setExamDates] = useState([]);
  const [roomDetails, setRoomDetails] = useState([]);
  const [examSelectedDate, setExamSelectedDate] = useState('');
  const [invigilatorData, setInvigilatorData] = useState();
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const checkAuthToken = useCallback(async () => {
    const authToken = atob(await AsyncStorage.getItem(btoa("authToken")));
    if (!authToken) {
      addToast("Authentication token is not available", "error");
      throw new Error("Authentication token is not available");
    }
    return authToken;
  }, [addToast]);

  const decrypt = (encryptedData) => {
    const encryptScreteKey = 'b305723a4d2e49a443e064a111e3e280';
    const [iv, encrypted] = encryptedData.split(':');
    const ivBytes = CryptoJS.enc.Hex.parse(iv);
    const encryptedBytes = CryptoJS.enc.Hex.parse(encrypted);
    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: encryptedBytes },
      CryptoJS.enc.Utf8.parse(encryptScreteKey),
      {
        iv: ivBytes,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    return decrypted.toString(CryptoJS.enc.Utf8);
  };

  const generateIV = () => {
    if (Platform.OS === 'web') {
      // For web, use CryptoJS's random generator
      return CryptoJS.lib.WordArray.random(16);
    } else {
      // For React Native, use a simple random number generator
      const arr = new Uint8Array(16);
      for (let i = 0; i < 16; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return CryptoJS.lib.WordArray.create(arr);
    }
  };
  
  const encrypt = (plaintext) => {
    const encryptScreteKey = 'b305723a4d2e49a443e064a111e3e280';
    const iv = generateIV();
    const key = CryptoJS.enc.Utf8.parse(encryptScreteKey);
    
    const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
  
    const encryptedBase64 = encrypted.toString();
    const ivHex = CryptoJS.enc.Hex.stringify(iv);
  
    return `${ivHex}:${encryptedBase64}`;
  };

  const handleGetDateView = async () => {
    let CurrentDate = new Date().toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: '2-digit'}).toUpperCase().replace(/ /g, '-');
    try {
      const authToken = await checkAuthToken();
      const response = await view(
        {
          operation: "custom",
          tblName: "PS_S_PRD_EX_TME_VW",
          data: '',
          conditionString: '',
          checkAvailability: '',
          // customQuery: `SELECT DISTINCT EXAM_DT FROM PS_S_PRD_EX_TME_VW WHERE EXAM_DT >= '${CurrentDate}' ORDER BY EXAM_DT ASC`,
          customQuery: `SELECT DISTINCT EXAM_DT FROM PS_S_PRD_EX_TME_VW  ORDER BY EXAM_DT ASC`,
          viewType:'Campus_View'
        },
        authToken
      );

      if (response) {
        setExamDates(response?.data?.receivedData);
        setExamSelectedDate(response?.data?.receivedData?.[0]?.EXAM_DT || '');
        handleGetRoomView(response?.data?.receivedData?.[0]?.EXAM_DT || '');
      }
    } catch (error) {
      setLoading(false);
      setRefreshing(false);
      setPageRefreshing(false);
      handleAuthErrors(error);
    }
  };

  const handleGetInvigilatorDutyDate = async () => {
    let CurrentDate = new Date().toLocaleDateString('en-GB', { year: '2-digit', month: '2-digit', day: '2-digit' }).split('/').reverse().join('-');
    try {
      const authToken = await checkAuthToken();
      const Parameter =  {
        operation: "custom",
        tblName: "tbl_invigilator_duty",
        data: '',
        conditionString: '',
        checkAvailability: '',
        customQuery: `SELECT DISTINCT date, room, shift FROM tbl_invigilator_duty WHERE employeeId = '${userData?.username}' AND date >= '${CurrentDate}' ORDER BY date ASC`,
      };
      const encryptedParams = encrypt(JSON.stringify(Parameter));
      const response = await fetch(
        encryptedParams,
        authToken
      );
  
      if (response) {
        const decryptedData = decrypt(response?.data?.receivedData);
        const DecryptedData = JSON.parse(decryptedData);
        setInvigilatorData(DecryptedData);
        const ExamDateArray = DecryptedData.filter((item, index, self) => index === self.findIndex((t) => t.date === item.date)).map((item) => ({ EXAM_DT: item.date }));
        setExamDates(ExamDateArray);
        setExamSelectedDate(DecryptedData?.[0]?.date);
        const RoomArray = DecryptedData.filter((item) => item.date === response?.data?.receivedData?.[0]?.date).map((item) => ({ room: item.room, shift: item.shift }));
        handleGetRoomView(DecryptedData?.[0]?.date, RoomArray);
      }
    } catch (error) {
      setRefreshing(false);
      setPageRefreshing(false);
      handleAuthErrors(error);
    }
  };

  
  const formatShiftTime = (dateString) => {
    const date = parseISO(dateString);
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; // Get the current timezone
    const time = formatInTimeZone(date, timeZone, 'hh:mm');
    return time;
  };
  
  const formatShiftTimePrefix = (dateString) => {
    const date = parseISO(dateString);
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; // Get the current timezone
    const prefix = formatInTimeZone(date, timeZone, 'a');
    return prefix;
  };
  
  const handleGetRoomView = async (SelectedDate, RoomArray) => {
    try {
      const authToken = await checkAuthToken();
      const formattedDate = SelectedDate ? new Date(SelectedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).toUpperCase().replace(/ /g, '-') : '';

      let roomShiftConditions = '';
  
      if (RoomArray && RoomArray.length > 0) {
        roomShiftConditions = RoomArray.map(({ room, shift }) => 
          `(${shift 
            ? `TO_CHAR(PS_S_PRD_EX_TME_VW.EXAM_START_TIME, 'HH:MI') = '${formatShiftTime(shift)}' 
               AND TO_CHAR(PS_S_PRD_EX_TME_VW.EXAM_START_TIME, '${formatShiftTimePrefix(shift)}') = '${formatShiftTimePrefix(shift)}' 
               AND ` 
            : ''}PS_S_PRD_EX_RME_VW.ROOM_NBR = '${room}')`
        ).join(' OR ');
  
        roomShiftConditions = `AND (${roomShiftConditions})`;
      }
  
      const customQuery = `SELECT DISTINCT PS_S_PRD_EX_RME_VW.EXAM_DT, PS_S_PRD_EX_RME_VW.ROOM_NBR, PS_S_PRD_EX_TME_VW.EXAM_START_TIME FROM PS_S_PRD_EX_RME_VW JOIN PS_S_PRD_EX_TME_VW ON PS_S_PRD_EX_RME_VW.EXAM_DT = PS_S_PRD_EX_TME_VW.EXAM_DT AND PS_S_PRD_EX_RME_VW.CATALOG_NBR = PS_S_PRD_EX_TME_VW.CATALOG_NBR WHERE PS_S_PRD_EX_RME_VW.EXAM_DT = '${formattedDate}' ${roomShiftConditions} ORDER BY PS_S_PRD_EX_TME_VW.EXAM_START_TIME,PS_S_PRD_EX_RME_VW.ROOM_NBR`;
  
      const response = await view(
        {
          operation: "custom",
          tblName: "PS_S_PRD_EX_RME_VW",
          data: '',
          conditionString: '',
          checkAvailability: '',
          customQuery: customQuery,
          viewType: 'Campus_View'
        },
        authToken
      );
  
      if (response) {
        setRoomDetails(response?.data?.receivedData);
      }
      setLoading(false);
      setRefreshing(false);
      setPageRefreshing(false);
    } catch (error) {
      setLoading(false);
      setRefreshing(false);
      setPageRefreshing(false);
      handleAuthErrors(error);
    }
  };
  
  const handleAuthErrors = (error) => {
    const errorMessages = { "Invalid credentials": "Invalid authentication credentials", "Data already exists": "Module with the same name already exists", "No response received from the server": "No response received from the server", };
    addToast(errorMessages[error.message] || "Module Operation Failed", "error");
  };

  const fetchRoomDetails = async (date) => {
    setLoading(true);
    if (userAccess?.label === "Admin" || UserAccess?.special === 1) {
      handleGetDateView();
    } else {
      handleGetInvigilatorDutyDate();
    }
  };

  const handleDateClick = (date) => {
    setLoading(true);
    setExamSelectedDate(date);
    const RoomArray = invigilatorData?.filter((item) => item.date === date) ?.map((item) => ({ room: item.room, shift: item.shift }));
    handleGetRoomView(date, (userAccess?.label !== "Admin" && UserAccess?.special !== 1) && RoomArray);
  };

  const convertedTime = (startTime) => {
    const date = parseISO(startTime); // Parse the input ISO date string
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; // Get the current timezone
    const zonedDate = formatInTimeZone(date, timeZone ,'h:mm a' ); // Convert the date to the local timezone
    return zonedDate;
  };
  const parseAndFormatDate = (dateString) => {
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
  
    // return parsedDate;
    return format(parsedDate, 'dd$MMM,yy$EEE')  };
  
    const onRefresh = useCallback((date) => {
      setRefreshing(true);
      handleDateClick(date);
    }, []);

    const onPageRefresh = useCallback(() => {
      setPageRefreshing(true);
      fetchRoomDetails();
    }, []);
    
  useEffect(() => {
    fetchRoomDetails(examSelectedDate);
  }, [UserAccess]);

  return (
    <View style={styles.container}>
      <View style={styles.datesWrap}>
            <View style={{maxWidth:"100%"}}>
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
                            {normalizedDate?.split('$')[2]}
                          </Text>
                          <Text style={[styles.dateNumber, isActiveItem && styles.activeText]}>
                          {normalizedDate?.split('$')[0]}
                          </Text>
                          <Text style={[styles.dateMonth, isActiveItem && styles.activeText]}>
                          {normalizedDate?.split('$')[1]}
                          </Text>
                        </View>
                   </Pressable>
                  );
                }}
                horizontal
                keyExtractor={(item) => item.EXAM_DT}
                refreshing={pageRefreshing}
                onRefresh={()=>onPageRefresh()}
              />
            </View>
            </View>
      </View>
 
      <View style={styles.roomNumber}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        roomDetails.length > 0 ? (
          <FlatList 
            style={styles.roomsListWrap}
            data={roomDetails}
            renderItem={({ item, index }) => (
              <Pressable
                key={index}
                onPress={() => UserAccess?.create === 1 ? navigation.navigate("RoomDetail", { room_Nbr: item.ROOM_NBR, exam_Dt: item.EXAM_DT, startTime: item.EXAM_START_TIME, userAccess}) : null} >  
                <View style={[styles.box, styles.boxTextWrap]}>
                  <Text style={styles.examName}>{item.ROOM_NBR}</Text>
                  <Text style={styles.examTime}>{convertedTime(item.EXAM_START_TIME)}</Text>
                </View>
              </Pressable>
            )}
            refreshing={refreshing}
            onRefresh={()=>onRefresh(examSelectedDate)}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <Text style={styles.noRecordsText}>No Record Found!</Text>
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
    alignItems:"center",
     marginBottom:15,
    backgroundColor:"#f8f8f8",
 
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
    // backgroundColor: "#ffffff",
    // backgroundColor:"#f6f6f6",
    borderBottomWidth: 1,
    borderBottomColor: "#E9E8E8",
    borderTopWidth: 0,
    marginTop: 0,
  },
  dateItem: {
    padding: 10,
    // marginRight: 6,
    minWidth: 60,
    alignItems: "center",
    borderRightWidth:1,
    borderRightColor:"#E9E8E8",
    backgroundColor:"#fff",
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
  },
  roomsListWrap:{
    // overflow: "auto",
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
    color:"#000",
    justifyContent:"space-between",
  },
 
  examTimedetail: {
    textAlign: "right",
    color:"#a79f9f",
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
  noRecordsText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#ddd",
    position: 'absolute',
    textAlign: 'center',
    borderRadius: 12,
    fontSize: 16,
    left: width / 2 - 150,  // Subtract half the element's width
    top: height / 2 - 150,  // Subtract half the element's height
    width: 300,  // Adjust this based on your requirements
    padding: 12,  // Adjust this based on your requirements
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ExamScreen;
