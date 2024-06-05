import React, { useState, useEffect,useCallback  } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TextInput, ActivityIndicator, Dimensions, Pressable } from 'react-native';
import { Ionicons,FontAwesome, Entypo } from '@expo/vector-icons'
import user from '../../local-assets/userimg.jpg'
import { useRoute } from '@react-navigation/native';
import CodeScanner from '../../globalComponent/CodeScanner/CodeScanner'; // Make sure to import CodeScanner properly
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetch, view } from "../../AuthService/AuthService";
import { useToast } from "../../globalComponent/ToastContainer/ToastContext";
import style from 'react-native-datepicker/style';

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
        <View>
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
          <ScrollView style={styles.roomNumber}>
          <View style={styles.countWrap}>
            <View style={styles.countMain}>
              <View style={styles.countbg1}>
                <Text style={styles.count}>10</Text>
              </View>
              <Text style={styles.cotext}>Present</Text>
            </View>
            <View style={styles.countMain}>
              <View style={styles.countbg2}>
                <Text style={styles.count}>10</Text>
              </View>
              <Text style={styles.cotext}>Absent</Text>
            </View>
            <View style={styles.countMain}>
              <View style={styles.countbg3}>
                <Text style={styles.count}>10</Text>
              </View>
              <Text style={styles.cotext}>UFM</Text>
            </View>
            <View style={styles.countMain}>
              <View style={styles.countbg4}>
                <Text style={styles.count}>10</Text>
              </View>
              <Text style={styles.cotext}>Total Count</Text>
            </View>
        </View>



        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          studentDetails?.length > 0 ? tempStudentDetails?.length > 0 ? (
            tempStudentDetails.map((studentData, index) => (
              <Pressable 
                key={studentData.EMPLID}  // Use a unique identifier from studentData, such as EMPLID
                onPress={() => UserAccess?.create === 1 ?  navigation.navigate("StudentInfo", { room_Nbr: studentData.ROOM_NBR ,exam_Dt: studentData.EXAM_DT,catlog_Nbr: studentData.CATALOG_NBR ,system_Id:studentData.EMPLID, seat_Nbr: studentData.PTP_SEQ_CHAR ,startTime: startTime,current_Term:studentData.STRM,reportId: presentStudentList?.filter((item)=>item.EMPLID === Number(studentData.EMPLID))?.[0]?.PK_Report_Id ,userAccess }) : ''}
              >
                <View style={[styles.box, presentStudentList?.find((item) => item.EMPLID === Number(studentData.EMPLID)) ? styles.activebox : '']} key={studentData.EMPLID}>
                  <View style={styles.boxtext}>
                    {/* <View style={styles.imgWrap}>
                  
                  </View> */}
                    <View  style={styles.info}>
                    {/* <Image source={user}  /> */}
                    <FontAwesome name="user-circle" size={36}  color="black" style={styles.userimage} />
                  <View style={styles.stuWrap}>
                    <Text style={styles.examname }>{studentData.NAME}</Text>
                    <Text style={styles.employeeid}>{studentData.EMPLID}</Text>
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
          </ScrollView>
        </View>
          }
           <View style={[styles.magnifying]}>
              {/* <Ionicons name="search-outline" size={27} color="#fff" style={styles.searchIcon} /> */}
              {UserAccess?.create === 1 && <Pressable onPress={startScanning}>
                <Ionicons name="qr-code-outline" size={27} color="#fff" style={styles.magIcon} />
              </Pressable>}
              {scannedData && (
                <View>
                  <Text>Scanned Data: {scannedData}</Text>
                </View>
              )}
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
     position: "relative"
    },
   
    // imgWrap:{
    //   width:"10%",
    //  },

     seqWrap:{
       backgroundColor:"#ccc",
       borderRadius:22,
       width:35,
       height:35,
       display: "flex",
       alignItems: "center",
       justifyContent: "center",
       backgroundColor: "#0CB551",
     } ,
     info:{
       display:"flex",
       flexDirection:"row",
       alignItems:"center",
       minWeight:"98%",
  
     },
    heading: {
      fontSize: 20,
      fontWeight:"bold",
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
      padding: 12,
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
      borderRadius: 6,
      marginBottom: 15,
      padding:12,
    },
    boxtext:{
      // alignItems:"center",  
      display:"flex",
      flexDirection:"row",
      // marginLeft:10,
      color:"#000",
      justifyContent:"space-between",
      // alignItems:"center",

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
        // width:75,
        // height:75,
        borderRadius:50,
        marginRight:10
    },
    examname:{
      color:"#000000",
      fontWeight:"600"
    },
    employeeid:{
      color:"#a79f9f",
      fontSize: 12,
      fontWeight:"400"
    },
    seqnumber:{
      fontWeight:"400",
      color:"#fff",
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
      fontWeight:"bold",
      flexDirection:"row",
      alignSelf:"flex-end",
      // width:"50%",
      // justifyContent:"space-between",
      
    },
    countbg1:{
       borderRadius:5,
       width:30,
       height:30,
      //  display: "flex",
       alignItems: "center",
       justifyContent: "center",
       backgroundColor: "#0CB551",
       
    },
    countbg2:{
      borderRadius:5,
      width:30,
      height:30,
     //  display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "red",
    },
    countbg4:{
      borderRadius:5,
      width:30,
      height:30,
     //  display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "grey",
    },
    countbg3:{
      borderRadius:5,
      width:30,
      height:30,
     //  display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "purple",
    },
    countMain:{
     flexDirection:"row",
     alignItems:"center",
     alignSelf:"center",
     marginRight:10,
     marginBottom:10,
    },
    count:{
    color:"#fff",
    textAlign:"center",
    },
    cotext:{
      color:"#000",
      marginLeft:5,
      fontWeight:600,
    }
  });
 