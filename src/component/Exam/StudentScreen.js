import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { insert, fetch, update } from "../../AuthService/AuthService";
import { useToast } from "../../globalComponent/ToastContainer/ToastContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomDateTimePicker from '../../globalComponent/DateTimePicker/CustomDateTimePicker';

const StudentScreen = () => {
  const { showToast } = useToast();
  const [StudentData, setStudentData] = useState({
    studentId: "",
    studentName: "",
    studentDescription: "",
    studentStartDate: "",
    studentEndDate: "",
    studentController: "",
    studentStatus: 1,
  });
  const [studentList, setStudentList] = useState([]);
  const [studentContainerVisible, setStudentContainerVisible] = useState(false);

  const checkAuthToken = useCallback(async () => {
    const authToken = await AsyncStorage.getItem("authToken");

    if (!authToken) {
      showToast("Authentication token not available", "error");
      throw new Error("Authentication token not available");
    }

    return authToken;
  }, [showToast]);

  const handleAddStudent = async () => {
    try {
      const authToken = await checkAuthToken();
      const response = await insert(
        {
          operation: "insert",
          tblName: "tbl_exam_master",
          data: {
            studentName: StudentData.studentName,
            description: StudentData.studentDescription,
            studentStartDate: StudentData.studentStartDate,
            studentEndDate: StudentData.studentEndDate,
            studentController: StudentData.studentController,
            isActive: StudentData.studentStatus,
          },
          conditionString: "",
          checkAvailability: "",
          customQuery: "",
        },
        authToken
      );

      if (response) {
        showToast("Exam Add Successful", "success");
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
          tblName: "tbl_exam_master",
          data: {
            studentName: StudentData.studentName,
            description: StudentData.studentDescription,
            studentStartDate: StudentData.studentStartDate,
            studentEndDate: StudentData.studentEndDate,
            studentController: StudentData.studentController,
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
          tblName: "tbl_exam_master",
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

  const handleStudentStatus = async (studentId, status) => {
    try {
      const authToken = await checkAuthToken();
      const response = await update(
        {
          operation: "update",
          tblName: "tbl_exam_master",
          data: { isActive: !status },
          conditionString: `PK_StudentId = ${studentId}`,
          checkAvailability: "",
          customQuery: "",
        },
        authToken
      );

      if (response) {
        showToast(
          `Exam ${status === 0 ? "Active" : "Inactive"} Successful`,
          "success"
        );
        handleGetStudentList();
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };

  const handleEditStatus = async (selectedExam) => {
    setStudentData({
      studentId: selectedExam.PK_StudentId,
      studentName: selectedExam.studentName,
      studentDescription: selectedExam.description,
      studentStatus: selectedExam.isActive,
      studentStartDate: selectedExam.studentStartDate,
      studentEndDate: selectedExam.studentEndDate,
      studentController: selectedExam.studentController,
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
      studentId: "",
      studentName: "",
      studentDescription: "",
      studentStartDate: "",
      studentEndDate: "",
      studentController: "",
      studentStatus: 1,
    });
  };

  useEffect(() => {
    handleGetStudentList();
  }, []);

  const handelChangeDateFrom = async (date) => {
    setStudentData({ ...StudentData, studentStartDate: date })
  };

  const handelChangeDateTo = async (date) => {
    setStudentData({ ...StudentData, studentEndDate: date })
  };

  return (
    <View style={styles.container}>
      {studentContainerVisible ? (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Exam Name"
            value={StudentData.studentName}
            onChangeText={(text) =>
              setStudentData({ ...StudentData, studentName: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={StudentData.studentDescription}
            onChangeText={(text) =>
              setStudentData({ ...StudentData, studentDescription: text })
            }
          />
          <Text>Exam Start From </Text>
          <CustomDateTimePicker date={StudentData.studentStartDate} handelChangeDate={handelChangeDateFrom}/>
          <Text>Exam End To </Text>
          <CustomDateTimePicker date={StudentData.studentEndDate} handelChangeDate={handelChangeDateTo}/>
            <TextInput
            style={styles.input}
            placeholder="Exam Controller"
            value={StudentData.studentController}
            onChangeText={(text) =>
              setStudentData({ ...StudentData, studentController: text })
            }
          />
          {StudentData.studentId ? (
            <View style={styles.buttonContainer}>
              <Button title="Update Exam" onPress={handleUpdateStudent} />
              <Button title="Cancel" onPress={handleClose} />
            </View>
          ) : (
            <View style={styles.buttonContainer}>
              <Button title="Add New Exam" onPress={handleAddStudent} />
              <Button title="Cancel" onPress={handleClose} />
            </View>
          )}
        </View>
      ) : (
        <View>
          <Text style={styles.header}>Exam List:</Text>
          <Button title="Add" onPress={() => setStudentContainerVisible(true)} />
          <FlatList
            data={studentList}
            keyExtractor={(item) => item.PK_StudentId.toString()}
            ListHeaderComponent={() => (
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, { flex: 2 }]}>
                  Exam Name
                </Text>
                <Text style={[styles.tableHeaderText, { flex: 3 }]}>
                  Description
                </Text>
                <Text style={[styles.tableHeaderText, { flex: 1 }]}>
                  Exam Start From
                </Text>
                <Text style={[styles.tableHeaderText, { flex: 1 }]}>
                  Exam End To
                </Text>
                <Text style={[styles.tableHeaderText, { flex: 1 }]}>
                  Exam Controller
                </Text>
                <Text style={[styles.tableHeaderText, { flex: 1 }]}>
                  Status
                </Text>
                <Text style={[styles.tableHeaderText, { flex: 1 }]}>
                  Actions
                </Text>
              </View>
            )}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text style={[styles.listItemText, { flex: 2 }]}>
                  {item.studentName}
                </Text>
                <Text style={[styles.listItemText, { flex: 3 }]}>
                  {item.description}
                </Text>
                <Text style={[styles.listItemText, { flex: 1 }]}>
                  {item.studentStartDate}
                </Text>
                <Text style={[styles.listItemText, { flex: 1 }]}>
                  {item.studentEndDate}
                </Text>
                <Text style={[styles.listItemText, { flex: 1 }]}>
                  {item.studentController}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    handleStudentStatus(item.PK_StudentId, item?.isActive)
                  }
                >
                  <Text
                    style={[
                      styles.listItemText,
                      { flex: 1 },
                      item.isActive
                        ? styles.listItemActiveStatus
                        : styles.listItemInactiveStatus,
                    ]}
                  >
                    {item.isActive ? "Active" : "Inactive"}
                  </Text>
                </TouchableOpacity>

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
