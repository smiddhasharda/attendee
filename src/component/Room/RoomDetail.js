import React, { useState, useEffect,useCallback  } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TextInput, ActivityIndicator, Dimensions, Pressable } from 'react-native';
import { Ionicons,FontAwesome, Entypo } from '@expo/vector-icons'
import { useRoute,useFocusEffect } from '@react-navigation/native';
import CodeScanner from '../../globalComponent/CodeScanner/CodeScanner'; // Make sure to import CodeScanner properly
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetch, view } from "../../AuthService/AuthService";
import { useToast } from "../../globalComponent/ToastContainer/ToastContext";
import { parse, format,parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';


function RoomDetail({navigation,refresh}) {
  const [isScanning, setIsScanning] = useState(false);
  const route = useRoute();
  const { addToast } = useToast();
  const [studentDetails, setStudentDetails] = useState([]);
  const [tempStudentDetails, setTempStudentDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [presentStudentList, setPresentStudentList] = useState();
  const [searchText, setSearchText] = useState('');
  const { room_Nbr, exam_Dt,startTime,userAccess } = route.params;
  const UserAccess = userAccess?.module?.find((item)=> item?.FK_ModuleId === 7);

  const checkAuthToken = useCallback(async () => {
    const authToken = await AsyncStorage.getItem("authToken");

    if (!authToken) {
      addToast("Authentication token is not available", "error");
      throw new Error("Authentication token is not available");
    }

    return authToken;
  }, [addToast]);

  const fetchStudentDetails = (date, room) => {
    setLoading(true);
    handleGetStudentView(date, room);
  };

  const [scannedData, setScannedData] = useState(null);

  
  const handleScannedData = (ScannedData) => {
    setScannedData(ScannedData);
    setIsScanning(false);
    navigation.setOptions({ headerShown: true});
   let studentData = studentDetails?.filter((data)=> data.EMPLID === ScannedData)?.[0] || '';
   if(studentData){
    navigation.navigate("StudentInfo", { room_Nbr: studentData.ROOM_NBR ,exam_Dt: studentData.EXAM_DT,catlog_Nbr: studentData.CATALOG_NBR ,system_Id:studentData.EMPLID, seat_Nbr: studentData.PTP_SEQ_CHAR ,startTime: startTime,current_Term:studentData.STRM,reportId: presentStudentList?.filter((item)=>item.EMPLID === Number(studentData.EMPLID))?.[0]?.PK_Report_Id ,userAccess });
   }
   else{
    addToast("Student not available in this room!", "error");
    handleCancel();
   }
  
  };
  const handleCancel = () => {
    setIsScanning(false);
    navigation.setOptions({ headerShown: true});
  };

  const { width, height } = Dimensions.get('window');
  const isMobile = width < 768; 
  const tableWidth = isMobile ? width - 10 : width * 0.96; 
  const tableHeight = isMobile ? height * 0.8 : height * 0.66; 
  
  const startScanning = () => {
    setIsScanning(true);
    navigation.setOptions({ headerShown: false});
    setScannedData(null); // Reset scanned data when starting a new scan
  };
 const handleGetReportData = async () => {
    try {
      const authToken = await checkAuthToken();
      const response = await fetch(
        {
          operation: "custom",
          tblName: "tbl_report_master",
          data: '',
          conditionString:'',
          checkAvailability: '',
          customQuery: `select PK_Report_Id,EMPLID,Status,EXAM_START_TIME from tbl_report_master where EXAM_DT = '${exam_Dt}' AND ROOM_NBR = '${room_Nbr}' AND EXAM_START_TIME = '${startTime}' `, 
        },
        authToken
      );
      if (response) {
        setPresentStudentList(response?.data?.receivedData)
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };

  const formatShiftTime = (dateString) => {
    const date = parseISO(dateString);
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; // Get the current timezone
    const time = formatInTimeZone(date, timeZone ,'hh:mm' );
  
    // Format each part of the date as required
    // const day = format(date, 'dd');
    // const month = format(date, 'MMM').toUpperCase();
    // const year = format(date, 'yy');
  return time
    // return `${day}-${month}-${year} ${time}`;
  };
  const formatShiftTimePrefix = (dateString) => {
    const date = parseISO(dateString);
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; // Get the current timezone
    const prefix = formatInTimeZone(date, timeZone ,'a');
    return prefix;
  };

  const handleGetStudentView = async (SelectedDate,SelectedRoom) => {
    const selectedDate = new Date(SelectedDate);
const day = selectedDate.getDate().toString().padStart(2, '0');
const month = selectedDate.toLocaleString('en-GB', { month: 'short' }).toUpperCase();
const year = selectedDate.getFullYear().toString().slice(-2);
const formattedDate = `${day}-${month}-${year}`;

const formattedShiftTime = formatShiftTime(startTime);
const formattedShiftTimePrefix = formatShiftTimePrefix(startTime);
    try {
      const authToken = await checkAuthToken();
      const response = await view(
        {
          operation: "custom",
          tblName: "PS_S_PRD_EX_RME_VW",
          data: '',
          conditionString: `EXAM_DT = '${new Date(SelectedDate).toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: '2-digit'}).toUpperCase().replace(/ /g, '-')}' AND ROOM_NBR = '${SelectedRoom}' ORDER BY CAST(PTP_SEQ_CHAR AS int)`,
          checkAvailability: '',
          // customQuery: ` SELECT DISTINCT PS_S_PRD_EX_RME_VW.EMPLID, PS_S_PRD_EX_RME_VW.STRM, PS_S_PRD_EX_RME_VW.CATALOG_NBR, PS_S_PRD_EX_RME_VW.EXAM_DT, PS_S_PRD_EX_RME_VW.ROOM_NBR, PS_S_PRD_EX_RME_VW.PTP_SEQ_CHAR FROM PS_S_PRD_EX_RME_VW JOIN PS_S_PRD_EX_TME_VW ON PS_S_PRD_EX_RME_VW.EXAM_DT = PS_S_PRD_EX_TME_VW.EXAM_DT AND PS_S_PRD_EX_RME_VW.CATALOG_NBR = PS_S_PRD_EX_TME_VW.CATALOG_NBR AND PS_S_PRD_EX_TME_VW.EXAM_START_TIME = '${startTime}' WHERE PS_S_PRD_EX_RME_VW.EXAM_DT = '${new Date(SelectedDate).toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: '2-digit'}).toUpperCase().replace(/ /g, '-')}' AND PS_S_PRD_EX_RME_VW.ROOM_NBR = '${SelectedRoom}' ORDER BY CAST(PTP_SEQ_CHAR AS int) `,
          // customQuery: `SELECT DISTINCT PS_S_PRD_EX_RME_VW.EMPLID, PS_S_PRD_EX_RME_VW.STRM, PS_S_PRD_EX_RME_VW.CATALOG_NBR, PS_S_PRD_EX_RME_VW.EXAM_DT, PS_S_PRD_EX_RME_VW.ROOM_NBR, PS_S_PRD_EX_RME_VW.PTP_SEQ_CHAR FROM PS_S_PRD_EX_RME_VW JOIN PS_S_PRD_EX_TME_VW ON PS_S_PRD_EX_RME_VW.EXAM_DT = PS_S_PRD_EX_TME_VW.EXAM_DT AND PS_S_PRD_EX_RME_VW.CATALOG_NBR = PS_S_PRD_EX_TME_VW.CATALOG_NBR AND PS_S_PRD_EX_TME_VW.EXAM_START_TIME = '${startTime}' WHERE PS_S_PRD_EX_RME_VW.EXAM_DT = '${new Date(SelectedDate).toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: '2-digit'}).toUpperCase().replace(/ /g, '-')}' AND PS_S_PRD_EX_RME_VW.ROOM_NBR = '${SelectedRoom}' ORDER BY CAST(PS_S_PRD_EX_RME_VW.PTP_SEQ_CHAR AS INT) `,
          customQuery:`SELECT PS_S_PRD_EX_RME_VW.EXAM_DT,PS_S_PRD_EX_RME_VW.NAME,PS_S_PRD_EX_RME_VW.EMPLID,PS_S_PRD_EX_RME_VW.ROOM_NBR,PS_S_PRD_EX_RME_VW.PTP_SEQ_CHAR,PS_S_PRD_EX_RME_VW.CATALOG_NBR,PS_S_PRD_EX_RME_VW.STRM, PS_S_PRD_EX_TME_VW.EXAM_START_TIME FROM PS_S_PRD_EX_RME_VW JOIN PS_S_PRD_EX_TME_VW ON PS_S_PRD_EX_RME_VW.EXAM_DT = PS_S_PRD_EX_TME_VW.EXAM_DT AND PS_S_PRD_EX_RME_VW.CATALOG_NBR = PS_S_PRD_EX_TME_VW.CATALOG_NBR WHERE PS_S_PRD_EX_RME_VW.EXAM_DT = '${formattedDate}' AND PS_S_PRD_EX_RME_VW.ROOM_NBR = '${SelectedRoom}' AND TO_CHAR(PS_S_PRD_EX_TME_VW.EXAM_START_TIME, 'HH:MI') = '${formattedShiftTime}' AND TO_CHAR(PS_S_PRD_EX_TME_VW.EXAM_START_TIME, '${formattedShiftTimePrefix}') = '${formattedShiftTimePrefix}' ORDER BY TO_NUMBER(PS_S_PRD_EX_RME_VW.PTP_SEQ_CHAR)`,         
          viewType:'Campus_View'
        },
        // AND PS_S_PRD_EX_TME_VW.EXAM_START_TIME ='${formattedShiftTime}'
        authToken
      );
      if (response) {
        
       setStudentDetails(response?.data?.receivedData);
       setTempStudentDetails(response?.data?.receivedData);
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
        addToast("Invalid authentication credentials", "error");
        break;
      case "Data already exists":
        addToast("Student details already exists!", "error");
        break;
      case "No response received from the server":
        addToast("No response received from the server", "error");
        break;
      default:
        addToast("Student Info Operation Failed!", "error");
    }
  };

  const handleSearchData = async(studentSearchText) => {
    setSearchText(studentSearchText);
    const searchTextLower = studentSearchText.toLowerCase();
    let FilteredStudentData = studentDetails?.filter((item) => 
      item?.NAME.toLowerCase().includes(searchTextLower) ||  item?.EMPLID.toLowerCase().includes(searchTextLower) || item?.PTP_SEQ_CHAR.toLowerCase().includes(searchTextLower)
    );
    setTempStudentDetails(FilteredStudentData);
  }

  const clearSearchText = () => {
    setSearchText('');
    setTempStudentDetails(studentDetails);
  };

  const getStatuscolor = (status) => {
    switch (status) {
      case 'Present':
        return {
          backgroundColor: '#0cb551',
          borderColor: "#0cb551",
          borderWidth: 1,
          color: "#fff",        
        };
      case 'UFM':
        return {
          backgroundColor: '#fdbf48',
          borderColor: "#fdbf48",
          borderWidth: 1,
          color: "#fff"
        };
      case 'Absent':
        return {
          backgroundColor: '#ea4242',
          borderColor: "#ea4242",
          borderWidth: 1,
          color: "#fff"
        };
      default:
      return ''
    }
    
  }
  const capitalizeName = (name) => {
    if (!name) return ''; // Handle null, undefined, or empty string
  
    const words = name.split(' ');
    const capitalizedWords = words.map(word => {
      if (word.length === 0) return ''; // Handle empty words (in case of multiple spaces)
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
  
    return capitalizedWords.join(' ');
  };
 
  useFocusEffect(
    useCallback(() => {
      fetchStudentDetails(exam_Dt, room_Nbr);
      handleGetReportData();
    }, [UserAccess, refresh])
  );
  return (
    <View style={styles.container}>
        {isScanning ? (<CodeScanner onScannedData={ handleScannedData} onCancel={handleCancel} BarCodeTypes={['qr']} />) : 
       ( <View>
          <View style={styles.topdetails}>
           <View style={styles.searchWrap}>
           <TextInput
            style={styles.searchBox}
            placeholder="Search By Name, System Id Or Seat Number..."
            onChangeText={handleSearchData}
            value={searchText}
            onIconPress={clearSearchText}
          />

          {searchText.length > 0 && (
            <Pressable onPress={clearSearchText} style={styles.crossIcon} >
              <Entypo name="circle-with-cross" size={20} alignItems="center" />
            </Pressable>
          )}
          
          </View>
        
          </View>
          
          <View style={[styles.countWrap,isMobile ? styles.mobstatus : ''] }>
          {/* <View style={isMobile ? styles.mobcolumn : styles.desktop}> */}
            <View style={[styles.countMain ,isMobile ? { marginRight: 3 } : {}]}>
              <View style={styles.countbg1}>
                <Text style={[styles.count,isMobile ? { fontSize: 12 } : {}]}>{presentStudentList?.filter((item)=> item?.Status === "Present")?.length || "0"}</Text>
              </View>
              
              <Text style={[styles.cotext, isMobile ? { fontSize: 12 } : {}]}>Present</Text>
            </View>
            <View style={[styles.countMain ,isMobile ? { marginRight: 3 } : {}]}>
              <View style={styles.countbg2}>
                <Text style={[styles.count,isMobile ? { fontSize: 12 } : {}]}>{presentStudentList?.filter((item)=> item?.Status === "Absent")?.length || "0"}</Text>
              </View>
              <Text style={[styles.cotext, isMobile ? { fontSize: 12 } : {}]}>Absent</Text>
            </View>
            {/* </View> */}
            {/* <View style={isMobile ? styles.mobcolumn : styles.desktop}> */}
            <View style={[styles.countMain ,isMobile ? { marginRight: 3 } : {}]}>
              <View style={styles.countbg3}>
                <Text style={[styles.count,isMobile ? { fontSize: 12 } : {}]}>{presentStudentList?.filter((item)=> item?.Status === "UFM")?.length || "0"}</Text>
              </View>
              <Text style={[styles.cotext, isMobile ? { fontSize: 12 } : {}]}>UFM</Text>
            </View>    
            <View style={[styles.countMain ,isMobile ? { marginRight: 3 } : {}]}>
              <View style={styles.countbg5}>
                <Text style={[styles.count,isMobile ? { fontSize: 12 } : {}]}>{studentDetails?.length - presentStudentList?.length  || "0"}</Text>
              </View>
              <Text style={[styles.cotext, isMobile ? { fontSize: 12 } : {}]}>Pending</Text>
            </View>
            {/* </View> */}
            <View style={{flexDirection:"column"}}>
            <View style={[styles.countMain ,isMobile ? { marginRight: 3 } : {}]}>
              <View style={styles.countbg4}>
                <Text style={[styles.count,isMobile ? { fontSize: 12 } : {}]}>{studentDetails?.length || "0"}</Text>
              </View>
              <Text style={[styles.cotext, isMobile ? { fontSize: 12 } : {}]}>Total</Text>
            </View>
            </View>
        </View>
        <ScrollView style={{maxHeight: isMobile ? 540: tableHeight,  }}>
          <View style={styles.studentWrapSec}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            studentDetails?.length > 0 ? tempStudentDetails?.length > 0 ? (
              tempStudentDetails.map((studentData, index) => (             
                <Pressable 
                  key={studentData.EMPLID}  // Use a unique identifier from studentData, such as EMPLID
                  onPress={() => UserAccess?.create === 1 ?  navigation.navigate("StudentInfo", { room_Nbr: studentData.ROOM_NBR ,exam_Dt: studentData.EXAM_DT,catlog_Nbr: studentData.CATALOG_NBR ,system_Id:studentData.EMPLID, seat_Nbr: studentData.PTP_SEQ_CHAR ,startTime: startTime,current_Term:studentData.STRM,reportId: presentStudentList?.filter((item)=>item.EMPLID === Number(studentData.EMPLID))?.[0]?.PK_Report_Id ,userAccess }) : ''} >
                         
                    <View style={[styles.box,getStatuscolor(presentStudentList?.filter((item) => item.EMPLID === Number(studentData.EMPLID))?.[0]?.Status)]} key={studentData.EMPLID}>
                      <View style={styles.boxtext}>
                        {/* <View style={styles.imgWrap}></View> */}
                        <View  style={styles.info}>
                          {/* <Image source={user}  /> */}
                          <FontAwesome name="user-circle" size={36}  color="black" style={styles.userimage} />
                          <View style={styles.stuWrap}>
                            <Text style={[styles.examname,getStatuscolor(presentStudentList?.filter((item) => item.EMPLID === Number(studentData.EMPLID))?.[0]?.Status)]} numberOfLines={1} ellipsizeMode='tail'>{capitalizeName(studentData?.NAME)}</Text>
                            <Text style={[styles.employeeid,getStatuscolor(presentStudentList?.filter((item) => item.EMPLID === Number(studentData.EMPLID))?.[0]?.Status)]}> {studentData.EMPLID}</Text>
                            </View>
                        </View>
                        <View style={styles.seqWrap}>
                          <Text style={styles.seqnumber}>{studentData.PTP_SEQ_CHAR}</Text>
                        </View>
                      </View>
                    </View>
                  
                </Pressable>
                
              ))
            ) : (
                <Text style={styles.centerText}>There is no student available in this room you searched for!</Text>
            ) : (
                <Text style={styles.centerText}>There are no records found!</Text>
            )
          )}
          </View>
        </ScrollView>        
        </View>)
          }
           <View style={[styles.magnifying]}>
              {/* <Ionicons name="search-outline" size={27} color="#fff" style={styles.searchIcon} /> */}
              {(UserAccess?.create === 1 && !isScanning) &&(<Pressable onPress={startScanning}>
                <Ionicons name="qr-code-outline" size={27} color="#fff" style={styles.magIcon} />
              </Pressable>)}
            </View>
    </View>
  );
}

export default RoomDetail;


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:"#fff" ,
     clearfix:"both",
     position: "relative",
    },
     seqWrap:{
       borderRadius:22,
       width:35,
       height:35,
       display: "flex",
       alignItems: "center",
       justifyContent: "center",
       backgroundColor: "#f7eac7",
     } ,
     info:{
       display:"flex",
       flexDirection:"row",
       alignItems:"center",
       minWeight:"98%",
     },
    heading: {
      fontSize: 20,
      marginBottom: 10,
    },
 
    topdetails:{
     flexDirection:"row",
     justifyContent:"space-between",
    },
    roomNumber: {
      padding: 12,
      //marginBottom: 20,
      clear:"both"
    },
    box: {
      borderWidth: 1,
      borderColor: "#dcdcdc",
      backgroundColor: "#f3f3f3",
      // width: Dimensions.get("window").width / 1 - 20, 
      borderRadius: 6,
      marginBottom: 10,
      paddingTop: 15,
      paddingBottom:15,
      paddingLeft: 10,
      paddingRight: 10,
      clear: "both",
      marginLeft: 8,
      marginRight: 8
      // overflow: "hidden"
    },
    boxtext:{
      display:"flex",
      flexDirection:"row",
      color:"#fff",
      justifyContent:"space-between",
      width:"98%",
      alignItems:"center",
    },
    stuWrap:{
      flexDirection:"column",
    },
    crossIcon:{
      position: "absolute",
      right: 20,
      top: 28
    },
    // searchGlassIcon:{
    //   position: "absolute",
    //   right: 40,
    //   top: 28
    // },
    userimage:{
        borderRadius:50,
        marginRight:10,
        color:'#dcdcdc'
    },
    examname:{
      color:"#0c1e35",
      fontWeight:"600",
      width: 200,
      overflow: 'hidden',
    },
    employeeid:{
      color:"#0c1e35",
      fontSize: 12,
      fontWeight:"400"
    },
    seqnumber:{
      fontWeight:"400",
      color:"#000",
    },
    activebox:{
      backgroundColor:"#e55353",
      borderColor:"#e55353",
      borderWidth: 1,
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
    searchBox: {
      height: 40,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      padding:10,
      marginBottom: 8,
      marginTop: 10
    },
    searchWrap:{
      padding: 10,
      width:"100%",
      position: "relative"
      // width:'auto',
    },
    magIcon:{
      borderRadius:5,
      backgroundColor:"#114166",
      padding:10,
      alignItems:"center"
    },
    magnifying:{
      right:10,
      position:"absolute",
      zIndex:9999,
      bottom:10
    },
    centerText:{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center"
    },
    countWrap:{
      flexDirection:"row",
      alignSelf:"flex-end",
    },
    mobstatus:{
    alignSelf:"center"
    },
    countbg1:{
       borderRadius:3,
       width:28,
       height:28,
       alignItems: "center",
       justifyContent: "center",
       backgroundColor: "#0cb551",
       
    },
    countbg2:{
      borderRadius:3,
      width:28,
      height:28,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#ea4242",
    },
    countbg3:{
      borderRadius:3,
      width:28,
      height:28,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#fdbf48",
    },
    countbg4:{
      borderRadius:3,
      width:28,
       height:28,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#404142",
    },
    countbg5:{
      borderRadius:3,
      width:28,
      height:28,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#b1b1b1",
    },
    countMain:{
     flexDirection:"row",
     alignItems:"center",
    //  alignSelf:"center",
     marginTop: 0,
     marginBottom: 20,
     marginRight: 18,
     marginLeft:0,
     
 
    },
    count:{
      color:"#fff",
      textAlign:"center",
      fontSize:14,
    },
    cotext:{
      color:"#000",
      marginLeft:3,
      fontWeight:"600",
      fontSize:14
    },
    studentWrapSec: {
 
      // overflowY:"scroll",
      // maxHeight: 330,
      // minHeight:300,

      //maxHeight: 440,
      clear: "both"
    },

    mobcolumn:{
      flexDirection:"column"
    },
    desktop:{
      flexDirection:"row",
    }
  });
 
  