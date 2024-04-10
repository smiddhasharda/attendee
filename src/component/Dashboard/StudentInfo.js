import {React,useState,useEffect} from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions ,ScrollView,Image,TextInput,ActivityIndicator, Pressable} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';

const StudentInfo = () => {
  const route = useRoute(); 
  const [studentDetails, setStudentDetails] = useState([]);
  const [courseDetails, setCourseDetails] = useState([]);
  const [attendenceDetails, sethAttendenceDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const { room_Nbr,exam_Dt,catlog_Nbr,system_Id, seat_Nbr,navigation } = route.params;

    // Sample data for room details
    // Table Name [ SU_CS_BRAHM_VW ]
    const sampleStudentData = [
      {NAME_FORMAL: 'Dev Saxena',EMPLID: '2023408405',ADM_APPL_NBR:'00021604',ADMIT_TERM:'0901',STRM:'1501',DESCR:'School of Dental Sciences',DESCR2:'Bachelor of Dental Science',DESCR3:'Mechanical'},
      {NAME_FORMAL: 'Medha Yadav',EMPLID: '2023408406',ADM_APPL_NBR:'00021604',ADMIT_TERM:'0901',STRM:'1501',DESCR:'School of Dental Sciences',DESCR2:'Bachelor of Dental Science',DESCR3:'Mechanical'},
      {NAME_FORMAL: 'Rohit Mehra',EMPLID: '2023408407',ADM_APPL_NBR:'00021604',ADMIT_TERM:'0901',STRM:'1501',DESCR:'School of Dental Sciences',DESCR2:'Bachelor of Dental Science',DESCR3:'Mechanical'},
      {NAME_FORMAL: 'Saurabh Middha',EMPLID: '2023408408',ADM_APPL_NBR:'00021604',ADMIT_TERM:'0901',STRM:'1501',DESCR:'School of Dental Sciences',DESCR2:'Bachelor of Dental Science',DESCR3:'Mechanical'},
      {NAME_FORMAL: 'Aman Bhadoriya',EMPLID: '2023408409',ADM_APPL_NBR:'00021604',ADMIT_TERM:'0901',STRM:'1501',DESCR:'School of Dental Sciences',DESCR2:'Bachelor of Dental Science',DESCR3:'Mechanical'},
      {NAME_FORMAL: 'Abhishak patel',EMPLID: '2023408410',ADM_APPL_NBR:'00021604',ADMIT_TERM:'0901',STRM:'1501',DESCR:'School of Dental Sciences',DESCR2:'Bachelor of Dental Science',DESCR3:'Mechanical'}    
    ];

    // Sample data for course details
    // Table Name [ SU_CAT_DESC_TBL ]
    const sampleCourseData = [
      {SU_PAPER_ID:'1000021',CATALOG_NBR: 'BPO353',DESCR100:'Enzymology'},
      {SU_PAPER_ID:'1000021',CATALOG_NBR: 'BPO353',DESCR100:'Enzymology'},
      {SU_PAPER_ID:'1000021',CATALOG_NBR: 'BPO353',DESCR100:'Enzymology'},
      {SU_PAPER_ID:'1000021',CATALOG_NBR: 'BPO353',DESCR100:'Enzymology'},
      {SU_PAPER_ID:'1000021',CATALOG_NBR: 'BPO353',DESCR100:'Enzymology'}
       ];

        // Sample data for course details
    // Table Name [ S_ADM_CARD_SS ]         comined the tables         [S_ICL_ATT_RC]
    const sampleAttendenceData = [
      {EMPLID:'2023408405',STRM:'2301',PERCENTCHG:'65',    CATALOG_NBR: 'BPO353',SSR_COMPONENT : 'PRA', PERCENTAGE : '85.71' },
      {EMPLID:'2023408406',STRM:'2301',PERCENTCHG:'65',    CATALOG_NBR: 'BPO353',SSR_COMPONENT : 'PRA', PERCENTAGE : '85.71' },
      {EMPLID:'2023408407',STRM:'2301',PERCENTCHG:'65',    CATALOG_NBR: 'BPO353',SSR_COMPONENT : 'PRA', PERCENTAGE : '85.71' },
      {EMPLID:'2023408408',STRM:'2301',PERCENTCHG:'65',    CATALOG_NBR: 'BPO353',SSR_COMPONENT : 'PRA', PERCENTAGE : '85.71' },
      {EMPLID:'2023408409',STRM:'2301',PERCENTCHG:'65',    CATALOG_NBR: 'BPO353',SSR_COMPONENT : 'PRA', PERCENTAGE : '85.71' },
      {EMPLID:'2023408410',STRM:'2301',PERCENTCHG:'65',    CATALOG_NBR: 'BPO353',SSR_COMPONENT : 'PRA', PERCENTAGE : '85.71' },
       ];

       const fetchStudentDetails = (system_Id,catlog_Nbr) => {
        setLoading(true);
        // Simulate fetching data from API
        setTimeout(() => {
          const filteredStudentData = sampleStudentData.filter(studentData => (studentData.EMPLID === system_Id));
          setStudentDetails(filteredStudentData[0] || []);
          const filteredCourseData = sampleCourseData.filter(courseData => (courseData.CATALOG_NBR === catlog_Nbr));
          setCourseDetails(filteredCourseData[0] || []);
          const filteredAttendenceData = sampleAttendenceData.filter(attendenceData => (attendenceData.EMPLID === system_Id) && (attendenceData.CATALOG_NBR === catlog_Nbr));
          sethAttendenceDetails(filteredAttendenceData[0] || []);
          setLoading(false);
        }, 1000); // Simulate 1 second delay
      };

      useEffect(() => {
    fetchStudentDetails(system_Id,catlog_Nbr)
  }, []);


  return (
    <ScrollView >
      <View style={styles.container}>   
        <View style={styles.studentInfoWrap}>
          <Text style={styles.infoHeader}>Student Info:</Text> 
          <View style={styles.container}>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.value}>{studentDetails.NAME_FORMAL || ''}</Text>
              </View>
              {/* <View style={styles.column}>
                <Text style={styles.label}>Father Name:</Text>
                <Text style={styles.value}>Michael Doe</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Mother Name:</Text>
                <Text style={styles.value}>Kathie Doe</Text>
              </View> */}
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Roll No:</Text>
                <Text style={styles.value}>{studentDetails.ADM_APPL_NBR || ''}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>System Id:</Text>
                <Text style={styles.value}>{studentDetails.EMPLID || ''}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Semester:</Text>
                <Text style={styles.value}>{studentDetails.STRM?.split('')?.[3] || ''}</Text>
              </View>
            </View>
            <View style={styles.column}>
                <Text style={styles.label}>School Name:</Text>
                <Text style={styles.value}>{studentDetails.DESCR || ''}</Text>
              </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Program Name:</Text>
                <Text style={styles.value}>{studentDetails.DESCR2 || ''}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Branch Name:</Text>
                <Text style={styles.value}>{studentDetails.DESCR3 || ''}</Text>
              </View>             
            </View>
          </View>
        </View>
        <View style={styles.studentInfoWrap}>
          <Text style={styles.infoHeader}>Course Info:</Text> 
          <View style={styles.container}>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Paper Id:</Text>
                <Text style={styles.value}>{courseDetails.SU_PAPER_ID || ''}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Course Code:</Text>
                <Text style={styles.value}>{courseDetails.CATALOG_NBR || ''}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Course Name:</Text>
                <Text style={styles.value}>{courseDetails.DESCR100 || ''}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Room No:</Text>
                <Text style={styles.value}>{room_Nbr}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Seat No:</Text>
                <Text style={styles.value}>{seat_Nbr}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Status:</Text>
                <Text style={styles.value}>{attendenceDetails.PERCENTAGE >= attendenceDetails.PERCENTCHG ? 'Eligible': 'Debart'}</Text>
              </View>
            </View>
          </View>
        </View>   
        
       <View style={styles.studentInfoWrap}>
            <Pressable style={styles.addButton}>
              <Text style={styles.addButtonText}>Add Copies</Text>
            </Pressable>
            <View style={styles.table}>
              <View style={styles.row}>
                <Text style={[styles.cell, styles.header]}>Copy</Text>
                <View style={styles.inputContainer}>
                  <TextInput style={styles.input} placeholder="Enter Copy Number" editable={false} />
                  <Text style={styles.orText}>OR</Text>
                  <Ionicons name="barcode-sharp" size={24} color="black" />
                  <Ionicons name="stop-circle" size={24} color="black" />
                  <Ionicons name="add" size={24} color="red" />
                </View>
              </View>
              <View style={styles.row}>
                <Text style={[styles.cell, styles.header]}>Supplymentry 1</Text>
                <View style={styles.inputContainer}>
                  <TextInput style={styles.input} placeholder="Enter Copy Number" editable={false} />       
                  <Ionicons name="add" size={24} color="red" />
                </View>
              </View>
            </View>
       </View>
       </View>
 
  </ScrollView>
  )
}

export default StudentInfo

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:"#fff" , 
    },
    studentInfoWrap: {
      fontSize: 16,
      backgroundColor: '#EAEAEA',
      padding:20,
      // marginLeft: 20,
      marginRight: 20,
      marginBottom: 15,
      borderRadius: 8,
      width: 100 + '%'
      // width: Dimensions.get("window").width / 1 - 40,
    },
    infoHeader: {
      fontSize: 18,
      fontWeight: 'bold',
      margin: 20,
      padding: 10
    },
    studentInfoRow: {
      flexDirection: 'column', 
      height: 100, 
      padding: 20
    },
    container: {
      flex: 1,
      padding: 20,
      //justifyContent: 'center',
      alignItems: 'center',
    },
    row: {
      flexDirection: 'row',
      //justifyContent: 'space-between',
      width: '100%',
      marginBottom: 20,
      alignItems: 'center',
    },
    column: {
      flex: 1,
      flexDirection: 'row',
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    value: {
      fontSize: 16,
      marginLeft: 5,
    },
    container: {
      flex: 1,
      padding: 10,
      // justifyContent: 'center',
      // alignItems: 'center',
      },
      table: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 10,
      overflow: 'hidden',
      marginBottom: 20,
      backgroundColor: '#f9f9f9',
      shadowColor: '#000',
      shadowOffset: {
      width: 0,
      height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      // width: '100%',
      },
      row: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: '#ddd',
      alignItems: 'center',
      paddingHorizontal: 10,
      },
      cell: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 8,
      color: '#333',
      },
      header: {
      fontWeight: 'bold',
      backgroundColor: '#f0f0f0',
  
      },
      inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      // marginLeft: 'auto', 
      },
      input: {
      flex: 1,
      padding: 8,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 5,
      marginRight: 10,
      backgroundColor: '#fff',
      },

      orText: {
      marginRight: 10,
      },
      addButton:{
        padding:10,
        borderRadius:5,
        backgroundColor:"#129912",
        width:100,
        marginBottom:10,
        justifyContent:"right",
      
      },
      addButtonText:{
        color:"#fff"
      },
      basicdetails:{
        flexDirection:"row",
        justifyContent:"space-between",
        marginBottom:10,
        
      },
      basicinfo:{
        flexDirection:"row",
        alignItems:"center",
      }
  });
