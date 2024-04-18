import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Button, TextInput, FlatList, StyleSheet, } from "react-native";
import { insert, fetch, update } from "../../AuthService/AuthService";
import { useToast } from "../../globalComponent/ToastContainer/ToastContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DropDownPicker from "react-native-dropdown-picker";
import Bulkupload from '../../globalComponent/Bulkupload/BulkUpload';

const StudentScreen = () => {
  const { showToast } = useToast();
  const [StudentData, setStudentData] = useState({
    studentId: '',
    name: '',
    systemId :'' ,
    rollNumber:'', 
    school:'', 
    program:'', 
    plan:'', 
    progAction:'', 
    term:'', 
    semester:'', 
    classNumber:'', 
    courseType:'', 
    courseCode:'', 
    courseStatus:'', 
    paperId:'', 
    examData:[],
    debardStatus:'',
    studentStatus: 1,
  });
  const [studentList, setStudentList] = useState([]);
  const [studentContainerVisible, setStudentContainerVisible] = useState(false);
  const [examList, setExamList] = useState([]);
  const [open, setOpen] = useState(false);

  const checkAuthToken = useCallback(async () => {
    const authToken = await AsyncStorage.getItem("authToken");

    if (!authToken) {
      showToast("Authentication token not available", "error");
      throw new Error("Authentication token not available");
    }

    return authToken;
  }, [showToast]);

  const handleGetExamList = async () => {
    try {
      const authToken = await checkAuthToken();
      const response = await fetch(
        {
          operation: "fetch",
          tblName: "tbl_exam_master",
          data: "",
          conditionString: "",
          checkAvailability: "",
          customQuery: "",
        },
        authToken
      );

      if (response) {
        let ExamList = response?.data?.map((item, index) => ({
          label: item?.examName,
          value: item?.PK_ExamId,
          examDateFrom: item?.examDateFrom,
          examDateTo: item?.examDateTo
        }));
        setExamList(ExamList);
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };
  const handleAddStudent = async () => {
    try {
      const authToken = await checkAuthToken();
      const response = await insert(
        {
          operation: "insert",
          tblName: "tbl_student_master",
          data: {
            name: StudentData.name,
            systemId: StudentData.systemId,
            isActive: StudentData.studentStatus,
          },
          conditionString: "",
          checkAvailability: "",
          customQuery: "",
        },
        authToken
      );

      if (response) {
        showToast("Student Add Successful", "success");
        await handleClose();
        handleGetStudentList();
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };

  const handleUpdateStudent = async () => {
    try {
      const authToken = await checkAuthToken();
      const response = await update(
        {
          operation: "update",
          tblName: "tbl_student_master",
          data: {
            name: StudentData.name,
            isActive: StudentData.studentStatus,
          },
          conditionString: `PK_StudentId = ${StudentData.studentId}`,
          checkAvailability: "",
          customQuery: "",
        },
        authToken
      );

      if (response) {
        showToast("Student Update Successful", "success");
        await handleClose();
        handleGetStudentList();
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };

  const handleGetStudentList = async () => {
    try {
      const authToken = await checkAuthToken();
      const response = await fetch(
        {
          operation: "fetch",
          tblName: "tbl_student_master",
          data: "",
          conditionString: "",
          checkAvailability: "",
          customQuery: "",
        },
        authToken
      );

      if (response) {
        setStudentList(response?.data);
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };


  const handleEditStatus = async (selectedExam) => {
    setStudentData({
      studentId: selectedExam.PK_StudentId,
      name: selectedExam.name,
      systemId :'' ,
      rollNumber:'',
      school:'', 
      program:'', 
      plan:'', 
      progAction:'', 
      term:'', 
      semester:'', 
      classNumber:'', 
      courseType:'', 
      courseCode:'', 
      courseStatus:'', 
      paperId:'', 
      examData:[],
      debardStatus:'',
      studentStatus: selectedExam.isActive,
    });
    setStudentContainerVisible(true);
  };

  const handleAuthErrors = (error) => {
    switch (error.message) {
      case "Invalid credentials":
        showToast("Invalid authentication credentials", "error");
        break;
      case "Data already exists":
        showToast("Module with the same name already exists", "error");
        break;
      case "No response received from the server":
        showToast("No response received from the server", "error");
        break;
      default:
        showToast("Module Operation Failed", "error");
    }
  };

  const handleClose = async () => {
    setStudentContainerVisible(false);
    setStudentData({
      studentId:'',
      name: '',
      systemId :'' ,
      rollNumber:'', 
      school:'', 
      program:'', 
      plan:'', 
      progAction:'', 
      term:'', 
      semester:'', 
      classNumber:'', 
      courseType:'', 
      courseCode:'', 
      courseStatus:'', 
      paperId:'', 
      examData:[],
      debardStatus:'',
      studentStatus: 1,
    });
  };

  useEffect(() => {
    handleGetStudentList();
    handleGetExamList();
  }, []);
 
  const handleExamSelect = (value) => {
    setStudentData({ ...StudentData, examData: value })
  };

  return (
    
    <View style={styles.container}>
      <Bulkupload/>
      {studentContainerVisible ? (
        <View style={styles.formContainer}>
              <DropDownPicker
          open={open}
          value={StudentData.examData}
          items={examList}
          setOpen={setOpen}
          setValue={handleExamSelect}
          // containerStyle={{ marginTop: 20, width: "30%", alignSelf: "center" }}
          // style={{ backgroundColor: "#fafafa" }}
          // labelStyle={{ fontSize: 16, textAlign: "left", color: "#000" }}
          // dropDownStyle={{ backgroundColor: "#fafafa" }}
          // dropDownMaxHeight={150}
        />
          <TextInput
            style={styles.input}
            placeholder="Student Name"
            value={StudentData.name}
            onChangeText={(text) =>
              setStudentData({ ...StudentData, name: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="System Id"
            value={StudentData.systemId}
            onChangeText={(text) =>
              setStudentData({ ...StudentData, systemId: text })
            }
          />
            <TextInput
            style={styles.input}
            placeholder="Roll Number"
            value={StudentData.rollNumber}
            onChangeText={(text) =>
              setStudentData({ ...StudentData, rollNumber: text })
            }
          />
            <TextInput
            style={styles.input}
            placeholder="School"
            value={StudentData.school}
            onChangeText={(text) =>
              setStudentData({ ...StudentData, school: text })
            }
          />
            <TextInput
            style={styles.input}
            placeholder="Program"
            value={StudentData.program}
            onChangeText={(text) =>
              setStudentData({ ...StudentData, program: text })
            }
          />
            <TextInput
            style={styles.input}
            placeholder="Plan"
            value={StudentData.plan}
            onChangeText={(text) =>
              setStudentData({ ...StudentData, plan: text })
            }
          /> 
           <TextInput
            style={styles.input}
            placeholder="Prog Action"
            value={StudentData.progAction}
            onChangeText={(text) =>
              setStudentData({ ...StudentData, progAction: text })
            }
          />
           <TextInput
            style={styles.input}
            placeholder="Academic Term"
            value={StudentData.term}
            onChangeText={(text) =>
              setStudentData({ ...StudentData, term: text })
            }
          />
           <TextInput
            style={styles.input}
            placeholder="Semester"
            value={StudentData.semester}
            onChangeText={(text) =>
              setStudentData({ ...StudentData, semester: text })
            }
          />
           <TextInput
            style={styles.input}
            placeholder="Class Number"
            value={StudentData.classNumber}
            onChangeText={(text) =>
              setStudentData({ ...StudentData, classNumber: text })
            }
          />
           <TextInput
            style={styles.input}
            placeholder="Course Type"
            value={StudentData.courseType}
            onChangeText={(text) =>
              setStudentData({ ...StudentData, courseType: text })
            }
          />
           <TextInput
            style={styles.input}
            placeholder="Course Code"
            value={StudentData.courseCode}
            onChangeText={(text) =>
              setStudentData({ ...StudentData, courseCode: text })
            }
          />
           <TextInput
            style={styles.input}
            placeholder="Course Status"
            value={StudentData.courseStatus}
            onChangeText={(text) =>
              setStudentData({ ...StudentData, courseStatus: text })
            }
          />
            <TextInput
            style={styles.input}
            placeholder="Paper Id"
            value={StudentData.paperId}
            onChangeText={(text) =>
              setStudentData({ ...StudentData, paperId: text })
            }
          />
            <TextInput
            style={styles.input}
            placeholder="Debard Status"
            value={StudentData.debardStatus}
            onChangeText={(text) =>
              setStudentData({ ...StudentData, debardStatus: text })
            }
          />
           <TextInput
            style={styles.input}
            placeholder="Student Status"
            value={StudentData.studentStatus}
            onChangeText={(text) =>
              setStudentData({ ...StudentData, studentStatus: text })
            }
          />
          {StudentData.studentId ? (
            <View style={styles.buttonContainer}>
              <Button title="Update Student" onPress={handleUpdateStudent} />
              <Button title="Cancel" onPress={handleClose} />
            </View>
          ) : (
            <View style={styles.buttonContainer}>
              <Button title="Add New Student" onPress={handleAddStudent} />
              <Button title="Cancel" onPress={handleClose} />
            </View>
          )}
        </View>
      ) : (
        <View>
          <Text style={styles.header}>Student List:</Text>
          <Button title="Add" onPress={() => setStudentContainerVisible(true)} />
          <FlatList
            data={studentList}
            keyExtractor={(item) => item.PK_StudentId.toString()}
            ListHeaderComponent={() => (
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, { flex: 2 }]}>
                  Student Name
                </Text>
              </View>
            )}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text style={[styles.listItemText, { flex: 2 }]}>
                  {item.name}
                </Text>

                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <Button
                    title="Edit"
                    onPress={() => handleEditStatus(item)}
                    style={styles.listItemEditButton}
                    textStyle={styles.listItemEditText}
                  />
                </View>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  tableHeaderText: {
    fontWeight: "bold",
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  listItemText: {
    flex: 1,
  },
  listItemActiveStatus: {
    color: "green",
  },
  listItemInactiveStatus: {
    color: "red",
  },
  listItemEditButton: {
    backgroundColor: "blue",
    padding: 5,
    borderRadius: 5,
  },
  listItemEditText: {
    color: "white",
  },
});

export default StudentScreen;
