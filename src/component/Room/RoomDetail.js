import React, { useState, useEffect,useCallback  } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TextInput, ActivityIndicator, Dimensions, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import user from '../../local-assets/userimg.jpg'
import { useRoute } from '@react-navigation/native';
import CodeScanner from '../../globalComponent/CodeScanner/CodeScanner'; // Make sure to import CodeScanner properly
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetch, view } from "../../AuthService/AuthService";
import { useToast } from "../../globalComponent/ToastContainer/ToastContext";

function RoomDetail({navigation}) {
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
      addToast("Authentication token not available", "error");
      throw new Error("Authentication token not available");
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
    addToast("User Not Belong In This Room !", "error");
    handleCancel();
   }
  
  };
  const handleCancel = () => {
    setIsScanning(false);
    navigation.setOptions({ headerShown: true});
  };

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
          conditionString: `EXAM_DT = '${new Date(SelectedDate).toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: '2-digit'}).toUpperCase().replace(/ /g, '-')}' AND ROOM_NBR = '${SelectedRoom}'`,
          checkAvailability: '',
          customQuery: ''
        },
        authToken
      );

      if (response) {
       setStudentDetails(response?.data);
       setTempStudentDetails(response?.data);
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
        addToast("Student Info with the same name already exists", "error");
        break;
      case "No response received from the server":
        addToast("No response received from the server", "error");
        break;
      default:
        addToast("Student Info Operation Failed", "error");
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

  
  
  useEffect(() => {
    fetchStudentDetails(exam_Dt, room_Nbr);
    handleGetReportData();
  }, [UserAccess]);

  return (
    <View style={styles.container}>
        {isScanning ? <CodeScanner onScannedData={ handleScannedData} onCancel={handleCancel} /> : 
        <View >
        <View style={styles.topdetails}>
           <View style={styles.searchWrap}>
           <TextInput
            style={styles.searchBox}
            placeholder="Search by name, system id and seat number..."
            onChangeText={handleSearchData}
            value={searchText}
          />
          {searchText.length > 0 && (
            <Pressable onPress={clearSearchText} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Clear Searched Text</Text>
            </Pressable>
          )} 
      </View>
      <View style={[styles.magnifying]}>
        {/* <Ionicons name="search-outline" size={27} color="#fff" style={styles.searchIcon} /> */}
        {UserAccess?.create === 1 && <Pressable onPress={startScanning}>
          <Ionicons name="qr-code-outline" size={27} color="#fff" style={styles.searchIcon} />
        </Pressable>}
        {scannedData && (
          <View>
            <Text>Scanned Data: {scannedData}</Text>
          </View>
        )}
      </View>
      </View>
    <ScrollView style={styles.roomNumber}>
  {loading ? (
    <ActivityIndicator size="large" color="#0000ff" />
  ) : (
    studentDetails?.length > 0 ? tempStudentDetails?.length > 0 ? (
      tempStudentDetails.map((studentData, index) => (
        <Pressable 
          key={studentData.EMPLID}  // Use a unique identifier from studentData, such as EMPLID
          onPress={() => UserAccess?.create === 1 ? navigation.navigate("StudentInfo", { room_Nbr: studentData.ROOM_NBR, exam_Dt: studentData.EXAM_DT, catlog_Nbr: studentData.CATALOG_NBR, system_Id: studentData.EMPLID, seat_Nbr: studentData.PTP_SEQ_CHAR, current_Term: studentData.STRM, reportId: presentStudentList?.filter((item) => item.EMPLID === Number(studentData.EMPLID))?.[0]?.PK_Report_Id, userAccess }) : ''}
        >
          <View style={[styles.box, presentStudentList?.find((item) => item.EMPLID === Number(studentData.EMPLID)) ? styles.activebox : '']} key={studentData.EMPLID}>
            <View style={styles.boxtext}>
              <Image source={user} style={styles.userimage} resizeMode="cover" />
              <Text style={styles.examname}>{studentData.NAME}</Text>
              <Text style={styles.employeeid}>{studentData.EMPLID}</Text>
              <Text style={styles.seqnumber}>{studentData.PTP_SEQ_CHAR}</Text>
            </View>
          </View>
        </Pressable>
      ))
    ) : (
      <Text>There Is No Student Present In this Class you Searched !!</Text>
    ) : (
      <Text>There Is No Student Present In this Class !!</Text>
    )
  )}
</ScrollView>

          </View>
          }
  </View>
  );
}

export default RoomDetail;


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:"#fff" ,
     clearfix:"both"
    },
    heading: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
 
  
    topdetails:{
    //  padding:8,
    //  clearfix:"both",
     flexDirection:"row",
     justifyContent:"space-between",
 
    },
    roomNumber: {
    //   flexDirection: "column",
      // flexWrap: "nowrap",
      // marginBottom: 10,
      padding: 4,
      // flex:1,
      clearfix:"both",
      // position:"relative",
      // overflowX:"visible",
      
      // maxHeight:"0%"
     
    },
    box: {
      borderWidth: 1,
      borderColor: "#ccc",
      // width: Dimensions.get("window").width / 1 - 20, 
      // backgroundColor: "#eaeaea",
      // height: 55,
      // textAlign: "center",
      // alignItems: "center",
      borderRadius: 25,
      marginBottom: 10,
      padding:10,
      flexDirection:"column",
      width:"auto",
  
    },
    boxtext:{
      // alignItems:"center",  
      flexDirection:"row",
      marginLeft:10,
      color:"#000",
      justifyContent:"space-between",
      alignItems:"center",
  
    
    },
    userimage:{
        width:40,
        height:40,
        borderRadius:50,
        marginRight:10
    },
 
    employeeid:{
      color:"#a79f9f",
      fontWeight:"bold",
      marginRight:30, 
    },
    examname:{
     fontWeight:"bold",
      marginRight:30, 
      color:"#a79f9f"
    },
    seqnumber:{
      fontWeight:"bold",
  
      color:"#a79f9f",
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
      padding: 10,
      width:"100%",
      // width:'auto',
    },
    searchIcon:{
      // position:"absolute",
      // bottom:0,
      // left:4,
      borderRadius:5,
      backgroundColor:"#1b6913",
      padding:10,
      // top:44,
      alignItems:"center"
      
    },
    magnifying:{
      // padding:20,
      right:40,
      // width:85,
      // left:"82%",
      // position:"absolute",
      position:"fixed",
      zIndex:1,
      top:"90%"
      // top:0,
      // bottom:"90%",
    },
  });
