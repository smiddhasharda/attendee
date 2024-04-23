import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Pressable,
} from "react-native";
import { insert, fetch, update } from "../../AuthService/AuthService";
import { useToast } from "../../globalComponent/ToastContainer/ToastContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomDateTimePicker from "../../globalComponent/DateTimePicker/CustomDateTimePicker";

const ExamScreen = () => {
  const { showToast } = useToast();
  const [examData, setExamData] = useState({
    examId: "",
    examName: "",
    examDescription: "",
    examStartFrom: "",
    examEndTo: "",
    examType: "",
    examStatus: 1,
  });
  const [examList, setExamList] = useState([]);
  const [examContainerVisible, setExamContainerVisible] = useState(false);

  const checkAuthToken = useCallback(async () => {
    const authToken = await AsyncStorage.getItem("authToken");

    if (!authToken) {
      showToast("Authentication token not available", "error");
      throw new Error("Authentication token not available");
    }

    return authToken;
  }, [showToast]);

  const handleAddExam = async () => {
    try {
      const authToken = await checkAuthToken();
      const response = await insert(
        {
          operation: "insert",
          tblName: "tbl_exam_master",
          data: {
            examName: examData.examName,
            description: examData.examDescription,
            isActive: examData.examStatus,
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
        handleGetExamList();
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };

  const handleUpdateExam = async () => {
    try {
      const authToken = await checkAuthToken();
      const response = await update(
        {
          operation: "update",
          tblName: "tbl_exam_master",
          data: {
            examName: examData.examName,
            description: examData.examDescription,
            isActive: examData.examStatus,
          },
          conditionString: `PK_ExamId = ${examData.examId}`,
          checkAvailability: "",
          customQuery: "",
        },
        authToken
      );

      if (response) {
        showToast("Exam Update Successful", "success");
        await handleClose();
        handleGetExamList();
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };

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
        setExamList(response?.data);
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };

  const handleExamStatus = async (examId, status) => {
    try {
      const authToken = await checkAuthToken();
      const response = await update(
        {
          operation: "update",
          tblName: "tbl_exam_master",
          data: { isActive: !status },
          conditionString: `PK_ExamId = ${examId}`,
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
        handleGetExamList();
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };

  const handleEditExam = async (selectedExam) => {
    setExamData({
      examId: selectedExam.PK_ExamId,
      examName: selectedExam.examName,
      examDescription: selectedExam.description,
      examStatus: selectedExam.isActive,
      examStartFrom: selectedExam.examStartFrom,
      examEndTo: selectedExam.examEndTo,
      examType: selectedExam.examType,
    });
    setExamContainerVisible(true);
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
    setExamContainerVisible(false);
    setExamData({
      examId: "",
      examName: "",
      examDescription: "",
      examStartFrom: "",
      examEndTo: "",
      examType: "",
      examStatus: 1,
    });
  };

  useEffect(() => {
    handleGetExamList();
  }, []);

  const handelChangeDateFrom = async (date) => {
    setExamData({ ...examData, examStartFrom: date });
  };

  const handelChangeDateTo = async (date) => {
    setExamData({ ...examData, examEndTo: date });
  };

  return (
    <View style={styles.container}>
      {examContainerVisible ? (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Exam Name"
            value={examData.examName}
            onChangeText={(text) =>
              setExamData({ ...examData, examName: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={examData.examDescription}
            onChangeText={(text) =>
              setExamData({ ...examData, examDescription: text })
            }
          />
          <Text>Exam Start From </Text>
          <CustomDateTimePicker
            date={examData.examStartFrom}
            handelChangeDate={handelChangeDateFrom}
          />
          <Text>Exam End To </Text>
          <CustomDateTimePicker
            date={examData.examEndTo}
            handelChangeDate={handelChangeDateTo}
          />
          <TextInput
            style={styles.input}
            placeholder="Exam Type"
            value={examData.examType}
            onChangeText={(text) =>
              setExamData({ ...examData, examType: text })
            }
          />
          {examData.examId ? (
            <View style={styles.buttonContainer}>
               <Pressable onPress={() => handleUpdateExam()}>
                    <Text>Update Exam</Text>
                  </Pressable>
                  <Pressable onPress={() => handleClose()}>
                    <Text>Cancel</Text>
                  </Pressable>
              {/* <Button title="Update Exam" onPress={handleUpdateExam} />
              <Button title="Cancel" onPress={handleClose} /> */}
            </View>
          ) : (
            <View style={styles.buttonContainer}>
                <Pressable onPress={() => handleAddExam()}>
                    <Text>Add New Exam</Text>
                  </Pressable>
                  <Pressable onPress={() => handleClose()}>
                    <Text>Cancel</Text>
                  </Pressable>
              {/* <Button title="Add New Exam" onPress={handleAddExam} />
              <Button title="Cancel" onPress={handleClose} /> */}
            </View>
          )}
        </View>
      ) : (
        <View>
          <Text style={styles.header}>Exam List:</Text>
          <Pressable onPress={() => setExamContainerVisible(true)}>
                    <Text>Add</Text>
                  </Pressable>
          {/* <Button title="Add" onPress={() => setExamContainerVisible(true)} /> */}
          <FlatList
            data={examList}
            keyExtractor={(item) => item.PK_ExamId.toString()}
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
                  Exam Type
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
                  {item.examName}
                </Text>
                <Text style={[styles.listItemText, { flex: 3 }]}>
                  {item.description}
                </Text>
                <Text style={[styles.listItemText, { flex: 1 }]}>
                  {item.examStartFrom}
                </Text>
                <Text style={[styles.listItemText, { flex: 1 }]}>
                  {item.examEndTo}
                </Text>
                <Text style={[styles.listItemText, { flex: 1 }]}>
                  {item.examType}
                </Text>
                <Pressable
                  onPress={() =>
                    handleExamStatus(item.PK_ExamId, item?.isActive)
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
                </Pressable>

                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <Pressable onPress={() => handleEditExam(item)}>
                    <Text>Edit</Text>
                  </Pressable>
                  {/* <Button
                    title="Edit"
                    onPress={() => handleEditExam(item)}
                    style={styles.listItemEditButton}
                    textStyle={styles.listItemEditText}
                  /> */}
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
    backgroundColor: "#fff",
    padding: 30,
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

export default ExamScreen;
