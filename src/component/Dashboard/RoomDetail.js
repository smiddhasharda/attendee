import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TextInput, ActivityIndicator, Dimensions, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import user from '../../local-assets/userimg.jpg'
import { useRoute } from '@react-navigation/native';
import CodeScanner from '../../globalComponent/CodeScanner/CodeScanner'; // Make sure to import CodeScanner properly

function RoomDetail() {
  const [isScanning, setIsScanning] = useState(false);
  const route = useRoute(); // Add this line to access route params
  // Sample data for room details
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
  const { room_Nbr, exam_Dt,navigation } = route.params;

  const fetchStudentDetails = (date, room) => {
    setLoading(true);
    // Simulate fetching data from API
    setTimeout(() => {
      const filteredStudentData = sampleStudentData.filter(studentData => (studentData.EXAM_DT === date) && (studentData.ROOM_NBR === room));
      setStudentDetails(filteredStudentData);
      setLoading(false);
    }, 1000); // Simulate 1 second delay
  };

  const [scannedData, setScannedData] = useState(null);

  const handleScannedData = (data) => {
    setScannedData(data);
    setIsScanning(false);
    let studentData = studentDetails?.filter((data)=> data.EMPLID === scannedData)?.[0] || '';
    navigation.navigate("StudentScreen", { room_Nbr: studentData.ROOM_NBR ,exam_Dt: studentData.EXAM_DT,catlog_Nbr: studentData.CATALOG_NBR ,system_Id:studentData.EMPLID, seat_Nbr: studentData.PTP_SEQ_CHAR ,navigation });
  };

  const handleCancel = () => {
    setIsScanning(false);
  };

  const startScanning = () => {
    setIsScanning(true);
    setScannedData(null); // Reset scanned data when starting a new scan
  };
  useEffect(() => {
        // fetchStudentDetails('06-FEB-24','RM-202 (BLOCK 4)')
    fetchStudentDetails(exam_Dt, room_Nbr)
  }, []);

  return (
    <View style={styles.container}>
        {isScanning ? <CodeScanner onScannedData={handleScannedData} onCancel={handleCancel} /> : 
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
            ( <Pressable onPress={() => navigation.navigate("StudentScreen", { room_Nbr: studentData.ROOM_NBR ,exam_Dt: studentData.EXAM_DT,catlog_Nbr: studentData.CATALOG_NBR ,system_Id:studentData.EMPLID, seat_Nbr: studentData.PTP_SEQ_CHAR ,navigation })}>
            <View style={[styles.box]} key={index}>
              <View style={[styles.boxtext]}>
                <Image source={user} style={styles.userimage} resizeMode="cover" />
                <Text style={[styles.examname]}>{studentData.EMPLID}</Text>
                <Text style={[styles.examname]}>{studentData.PTP_SEQ_CHAR}</Text>
              </View>
            </View>
            </Pressable>)) : <Text>There Is No Student Present In this Class !!</Text>
        )}
         
          {/* <View style={[styles.box, styles.activebox]}>   
          <View style={[styles.boxtext]}>
          <Image source={user} style={styles.userimage}   />
          <Text style={[styles.examname,styles. activetext]}>Shubham</Text>     
          <Text style={[styles.examname,styles. activetext]}>Seat No</Text>
          </View>  
          </View>
          <View style={[styles.box, ]}>   
          <View style={[styles.boxtext]}>
          <Image source={user} style={styles.userimage}   />
          <Text style={[styles.examname,]}>Shubham</Text>     
          <Text style={[styles.examname,]}>Seat No</Text>
          </View>  
          </View>
          <View style={[styles.box, ]}>   
          <View style={[styles.boxtext]}>
          <Image source={user} style={styles.userimage}   />
          <Text style={[styles.examname,]}>Shubham</Text>     
          <Text style={[styles.examname,]}>Seat No</Text>
          </View>  
          </View>
          <View style={[styles.box,]}>   
          <View style={[styles.boxtext]}>
          <Image source={user} style={styles.userimage}   />
          <Text style={[styles.examname,]}>Shubham</Text>     
          <Text style={[styles.examname,]}>Seat No</Text>
          </View>  
          </View>
          <View style={[styles.box, ]}>   
          <View style={[styles.boxtext]}>
          <Image source={user} style={styles.userimage}   />
          <Text style={[styles.examname,]}>Shubham</Text>     
          <Text style={[styles.examname,]}>Seat No</Text>
          </View>  
          </View>
          <View style={[styles.box, ]}>   
          <View style={[styles.boxtext]}>
          <Image source={user} style={styles.userimage}   />
          <Text style={[styles.examname,]}>Shubham</Text>     
          <Text style={[styles.examname,]}>Seat No</Text>
          </View>  
          </View>
          <View style={[styles.box, ]}>   
          <View style={[styles.boxtext]}>
          <Image source={user} style={styles.userimage}   />
          <Text style={[styles.examname,]}>Shubham</Text>     
          <Text style={[styles.examname,]}>Seat No</Text>
          </View>  
          </View> */}
   
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
