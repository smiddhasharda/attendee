import React, { useState, useEffect,useCallback  } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TextInput, ActivityIndicator, Dimensions, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import user from '../../local-assets/userimg.jpg'
import { useRoute } from '@react-navigation/native';
import CodeScanner from '../../globalComponent/CodeScanner/CodeScanner'; // Make sure to import CodeScanner properly
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetch, view } from "../../AuthService/AuthService";
import { useToast } from "../../globalComponent/ToastContainer/ToastContext";

function RoomDetail() {
  const [isScanning, setIsScanning] = useState(false);
  const route = useRoute();
  const { showToast } = useToast();

  // Sample data for room details
      // Table Name [ SU_ADM_SEATNMRC ]
  const sampleStudentData = [
    { EMPLID: '2023408405', STRM: '2301',CATALOG_NBR:'BCT112',EXAM_DT:'06-FEB-24',ROOM_NBR:'RM-202 (BLOCK 4)',PTP_SEQ_CHAR:'115' },
    { EMPLID: '2023408406', STRM: '2301',CATALOG_NBR:'BCT112',EXAM_DT:'06-FEB-24',ROOM_NBR:'RM-202 (BLOCK 4)',PTP_SEQ_CHAR:'116' },
    { EMPLID: '2023408407', STRM: '2301',CATALOG_NBR:'BCT112',EXAM_DT:'06-FEB-24',ROOM_NBR:'RM-202 (BLOCK 4)',PTP_SEQ_CHAR:'117' },
    { EMPLID: '2023408408', STRM: '2301',CATALOG_NBR:'BCT112',EXAM_DT:'06-FEB-24',ROOM_NBR:'RM-202 (BLOCK 4)',PTP_SEQ_CHAR:'118' },
    { EMPLID: '2023408409', STRM: '2301',CATALOG_NBR:'BCT112',EXAM_DT:'06-FEB-24',ROOM_NBR:'RM-202 (BLOCK 4)',PTP_SEQ_CHAR:'119' },
    { EMPLID: '2023408410', STRM: '2301',CATALOG_NBR:'BCT112',EXAM_DT:'06-FEB-24',ROOM_NBR:'RM-202 (BLOCK 4)',PTP_SEQ_CHAR:'120' },
    { EMPLID: '2023408411', STRM: '2301',CATALOG_NBR:'BCT112',EXAM_DT:'06-FEB-24',ROOM_NBR:'RM-202 (BLOCK 4)',PTP_SEQ_CHAR:'121' },
  ];

  const [studentDetails, setStudentDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [presentStudentList, setPresentStudentList] = useState();
  const { room_Nbr, exam_Dt,startTime,navigation,userAccess } = route.params;
  const UserAccess = userAccess?.module?.filter((item)=> item?.FK_ModuleId === 7);

  const checkAuthToken = useCallback(async () => {
    const authToken = await AsyncStorage.getItem("authToken");

    if (!authToken) {
      showToast("Authentication token not available", "error");
      throw new Error("Authentication token not available");
    }

    return authToken;
  }, [showToast]);

  const fetchStudentDetails = (date, room) => {
    setLoading(true);
    handleGetStudentView(date, room);
    // Simulate fetching data from API
    setTimeout(() => {
      const filteredStudentData = sampleStudentData.filter(studentData => (studentData.EXAM_DT === date) && (studentData.ROOM_NBR === room));
      setStudentDetails(filteredStudentData);
      setLoading(false);
    }, 1000); // Simulate 1 second delay
  };

  const [scannedData, setScannedData] = useState(null);

  const handleScannedData = (ScannedData) => {
    setScannedData(ScannedData);
    setIsScanning(false);
   let studentData = studentDetails?.filter((data)=> data.EMPLID === ScannedData)?.[0] || '';
    navigation.navigate("StudentInfo", { room_Nbr: studentData.ROOM_NBR ,exam_Dt: studentData.EXAM_DT,catlog_Nbr: studentData.CATALOG_NBR ,system_Id:studentData.EMPLID, seat_Nbr: studentData.PTP_SEQ_CHAR ,startTime: startTime,reportId: presentStudentList?.filter((item)=>item.EMPLID === Number(studentData.EMPLID))?.[0]?.PK_Report_Id ,navigation,userAccess });
  };
  const handleCancel = () => {
    setIsScanning(false);
  };

  const startScanning = () => {
    setIsScanning(true);
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
          customQuery: `select PK_Report_Id,EMPLID from tbl_report_master where EXAM_DT = '${exam_Dt}' AND ROOM_NBR = '${room_Nbr}' AND EXAM_START_TIME = '${startTime}' `, 
        },
        authToken
      );

      if (response) {
        setPresentStudentList(response.data)
      }
    } catch (error) {
      console.log(error);
      handleAuthErrors(error);
    }
  };

  const handleGetStudentView = async (SelectedDate,SelectedRoom) => {
    try {
      const authToken = await checkAuthToken();
      const response = await view(
        {
          operation: "fetch",
          tblName: "PS_S_PRD_EX_RME_VW",
          data: '',
          conditionString: `EXAM_DT = ${SelectedDate} AND ROOM_NBR = ${SelectedRoom}`,
          checkAvailability: '',
          customQuery: ''
        },
        authToken
      );



      if (response) {
        console.log(response?.data);
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
        showToast("Student Info with the same name already exists", "error");
        break;
      case "No response received from the server":
        showToast("No response received from the server", "error");
        break;
      default:
        showToast("Student Info Operation Failed", "error");
    }
  };

  useEffect(() => {
        // fetchStudentDetails('06-FEB-24','RM-202 (BLOCK 4)')
    fetchStudentDetails(exam_Dt, room_Nbr);
    handleGetReportData();
  }, []);

  return (
    <View style={styles.container}>
        {isScanning ? <CodeScanner onScannedData={UserAccess?.create === 1 ? handleScannedData : ''} onCancel={handleCancel} /> : 
        <View>
           <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchBox}
          placeholder="Search..."
        />
      </View>
      <View style={[styles.magnifying]}>
        {/* <Ionicons name="search-outline" size={27} color="#fff" style={styles.searchIcon} /> */}
        <Pressable onPress={startScanning}>
          <Ionicons name="qr-code-outline" size={27} color="#fff" style={styles.searchIcon} />
        </Pressable>
        {scannedData && (
          <View>
            <Text>Scanned Data: {scannedData}</Text>
          </View>
        )}
      </View>
      <ScrollView style={styles.roomNumber}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          studentDetails?.length > 0 ? studentDetails?.map((studentData, index) =>
            ( <Pressable onPress={() => UserAccess?.create === 1 ?navigation.navigate("StudentInfo", { room_Nbr: studentData.ROOM_NBR ,exam_Dt: studentData.EXAM_DT,catlog_Nbr: studentData.CATALOG_NBR ,system_Id:studentData.EMPLID, seat_Nbr: studentData.PTP_SEQ_CHAR, reportId: presentStudentList?.filter((item)=>item.EMPLID === Number(studentData.EMPLID))?.[0]?.PK_Report_Id, navigation,userAccess }) : ''}>
            <View style={[styles.box,presentStudentList?.find((item)=>item.EMPLID === Number(studentData.EMPLID)) ? styles.activebox :'' ]} key={index}>
              <View style={[styles.boxtext]}>
                <Image source={user} style={styles.userimage} resizeMode="cover" />
                <Text style={[styles.examname]}>{studentData.EMPLID}</Text>
                <Text style={[styles.examname]}>{studentData.PTP_SEQ_CHAR}</Text>
              </View>
            </View>
            </Pressable>)) : <Text>There Is No Student Present In this Class !!</Text>
        )}
    </ScrollView>
          </View>}
  </View>
  );
}

export default RoomDetail;


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:"#fff" ,

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
    //   flexDirection: "column",
      // flexWrap: "wrap",
      marginBottom: 10,
      padding: 10,
     
    },
    box: {
      borderWidth: 1,
      borderColor: "#ccc",
      width: Dimensions.get("window").width / 1 - 20, 
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
      justifyContent:"space-between",
      alignItems:"center",
   
    
    },
    userimage:{
        width:40,
        height:40,
        borderRadius:50,
        marginRight:10
    },
 
    examname:{
      fontWeight:"bold",
      marginRight:30,
      maxWidth:80,
  
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
    searchBox: {
      height: 40,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      padding:10,
      marginBottom: 16,
   
    },
    searchWrap:{
      padding:10,
    },
    searchIcon:{
      position:"absolute",
      // bottom:0,
      left:4,
      borderRadius:5,
      backgroundColor:"#1b6913",
      padding:10,
      top:50,
      
    },
    magnifying:{
      padding:10,
      width:40,
      left:"85%",
      position:"absolute",
      zIndex:1,
    },
  });
