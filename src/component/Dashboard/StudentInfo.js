import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';
import { Ionicons,FontAwesome6 , AntDesign} from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';

const StudentInfo = () => {
  const route = useRoute();
  const [studentDetails, setStudentDetails] = useState({});
  const [courseDetails, setCourseDetails] = useState({});
  const [attendanceDetails, setAttendanceDetails] = useState({});
  const { room_Nbr, catlog_Nbr, system_Id, seat_Nbr } = route.params;

  const sampleStudentData = [
    { NAME_FORMAL: 'Dev Saxena', EMPLID: '2023408405', ADM_APPL_NBR: '00021604', STRM: '1501', DESCR: 'School of Dental Sciences', DESCR2: 'Bachelor of Dental Science', DESCR3: 'Mechanical' },
    { NAME_FORMAL: 'Medha Yadav', EMPLID: '2023408406', ADM_APPL_NBR: '00021604', STRM: '1501', DESCR: 'School of Dental Sciences', DESCR2: 'Bachelor of Dental Science', DESCR3: 'Mechanical' },
    { NAME_FORMAL: 'Rohit Mehra', EMPLID: '2023408407', ADM_APPL_NBR: '00021604', STRM: '1501', DESCR: 'School of Dental Sciences', DESCR2: 'Bachelor of Dental Science', DESCR3: 'Mechanical' },
    { NAME_FORMAL: 'Saurabh Middha', EMPLID: '2023408408', ADM_APPL_NBR: '00021604', STRM: '1501', DESCR: 'School of Dental Sciences', DESCR2: 'Bachelor of Dental Science', DESCR3: 'Mechanical' },
    { NAME_FORMAL: 'Aman Bhadoriya', EMPLID: '2023408409', ADM_APPL_NBR: '00021604', STRM: '1501', DESCR: 'School of Dental Sciences', DESCR2: 'Bachelor of Dental Science', DESCR3: 'Mechanical' },
    { NAME_FORMAL: 'Abhishak patel', EMPLID: '2023408410', ADM_APPL_NBR: '00021604', STRM: '1501', DESCR: 'School of Dental Sciences', DESCR2: 'Bachelor of Dental Science', DESCR3: 'Mechanical' }
  ];

  const sampleCourseData = [
    { SU_PAPER_ID: '1000021', CATALOG_NBR: 'BPO353', DESCR100: 'Enzymology' },
    { SU_PAPER_ID: '1000021', CATALOG_NBR: 'BPO353', DESCR100: 'Enzymology' },
    { SU_PAPER_ID: '1000021', CATALOG_NBR: 'BPO353', DESCR100: 'Enzymology' },
    { SU_PAPER_ID: '1000021', CATALOG_NBR: 'BPO353', DESCR100: 'Enzymology' },
    { SU_PAPER_ID: '1000021', CATALOG_NBR: 'BPO353', DESCR100: 'Enzymology' }
  ];

  const sampleAttendanceData = [
    { EMPLID: '2023408405', STRM: '2301', PERCENTCHG: '65', CATALOG_NBR: 'BPO353', PERCENTAGE: '85.71' },
    { EMPLID: '2023408406', STRM: '2301', PERCENTCHG: '65', CATALOG_NBR: 'BPO353', PERCENTAGE: '85.71' },
    { EMPLID: '2023408407', STRM: '2301', PERCENTCHG: '65', CATALOG_NBR: 'BPO353', PERCENTAGE: '85.71' },
    { EMPLID: '2023408408', STRM: '2301', PERCENTCHG: '65', CATALOG_NBR: 'BPO353', PERCENTAGE: '85.71' },
    { EMPLID: '2023408409', STRM: '2301', PERCENTCHG: '65', CATALOG_NBR: 'BPO353', PERCENTAGE: '85.71' },
    { EMPLID: '2023408410', STRM: '2301', PERCENTCHG: '65', CATALOG_NBR: 'BPO353', PERCENTAGE: '85.71' }
  ];

  useEffect(() => {
    // Simulate fetching data from API
    const fetchData = () => {
      const filteredStudentData = sampleStudentData.find(student => student.EMPLID === system_Id) || {};
      const filteredCourseData = sampleCourseData.find(course => course.CATALOG_NBR === catlog_Nbr) || {};
      const filteredAttendanceData = sampleAttendanceData.find(attendance => attendance.EMPLID === system_Id && attendance.CATALOG_NBR === catlog_Nbr) || {};
      setStudentDetails(filteredStudentData);
      setCourseDetails(filteredCourseData);
      setAttendanceDetails(filteredAttendanceData);
    };

    fetchData();
  }, [system_Id, catlog_Nbr]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.studentInfoWrap}>
        <Text style={styles.infoHeader}>Student Info:</Text>
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{studentDetails.NAME_FORMAL || ''}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Roll No:</Text>
            <Text style={styles.value}>{studentDetails.ADM_APPL_NBR || ''}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>System Id:</Text>
            <Text style={styles.value}>{studentDetails.EMPLID || ''}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Semester:</Text>
            <Text style={styles.value}>{studentDetails.STRM?.split('')?.[3] || ''}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>School Name:</Text>
            <Text style={styles.value}>{studentDetails.DESCR || ''}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Program Name:</Text>
            <Text style={styles.value}>{studentDetails.DESCR2 || ''}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Branch Name:</Text>
            <Text style={styles.value}>{studentDetails.DESCR3 || ''}</Text>
          </View>
        </View> 
      </View>
      {/* <View style={styles.studentInfoWrap}>
      <Text style={styles.infsss}>Student info</Text>
      <View style={initemss}>
      <Text style={styles.label}>Name:</Text>
      </View>

      </View> */}
      <View style={styles.studentInfoWrap}>
        <Text style={styles.infoHeader}>Course Info:</Text>
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Paper Id:</Text>
            <Text style={styles.value}>{courseDetails.SU_PAPER_ID || ''}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Course Code:</Text>
            <Text style={styles.value}>{courseDetails.CATALOG_NBR || ''}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Course Name:</Text>
            <Text style={styles.value}>{courseDetails.DESCR100 || ''}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Room No:</Text>
            <Text style={styles.value}>{room_Nbr}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Seat No:</Text>
            <Text style={styles.value}>{seat_Nbr}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>{attendanceDetails.PERCENTAGE >= attendanceDetails.PERCENTCHG ? 'Eligible' : 'Debart'}</Text>
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
              <FontAwesome6 name="delete-left" size={24} color="black" />
              <Ionicons name="add" size={24} color="red" />
            </View>
          </View>
          <View style={styles.row}>
            <Text style={[styles.cell, styles.header]}>Supplementary 1</Text>
            <View style={styles.inputContainer}>
              <TextInput style={styles.input} placeholder="Enter Copy Number" editable={false} />
              <Ionicons name="barcode-sharp" size={24} color="black" />
              <FontAwesome6 name="trash-alt" size={24} color="black" />
              <Ionicons name="add" size={24} color="red" />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default StudentInfo;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  studentInfoWrap: {
    backgroundColor: '#EAEAEA',
    marginBottom: 20,
    borderRadius: 8,
  },
  infoHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  label: {
    flex: 1,
    fontWeight: 'bold',
  },
  value: {
    flex: 2,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
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
    paddingHorizontal: 10,
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
    marginRight: 4,
  },
  addButton: {
    alignSelf: 'flex-end',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#129912',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
