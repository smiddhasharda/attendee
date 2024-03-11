import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Button, TextInput, FlatList, StyleSheet,TouchableOpacity } from "react-native";
import { insert, fetch, update } from "../../AuthService/AuthService";
import { useToast } from "../../globalComponent/ToastContainer/ToastContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from "./ModuleScreen.style";

const ModuleScreen = () => {
  const { showToast } = useToast();
  const [moduleData, setModuleData] = useState({
    moduleId: '',
    moduleName: '',
    moduleDescription: '',
    moduleStatus: 1,
  });
  const [moduleList, setModuleList] = useState([]);
  const [moduleContainerVisible, setModuleContainerVisible] = useState(false);

  const checkAuthToken = useCallback(async () => {
    const authToken = await AsyncStorage.getItem("authToken");

    if (!authToken) {
      showToast("Authentication token not available", "error");
      throw new Error("Authentication token not available");
    }

    return authToken;
  }, [showToast]);

  const handleAddModule = async () => {
    try {
      const authToken = await checkAuthToken();
      const response = await insert(
        {
          operation: "insert",
          tblName: "tbl_module_master",
          data: {
            moduleName: moduleData.moduleName,
            description: moduleData.moduleDescription,
            isActive: moduleData.moduleStatus,
          },
          conditionString: '',
          checkAvailability: '',
          customQuery: '',
        },
        authToken
      );

      if (response) {
        showToast("Module Add Successful", "success");
        await handleClose();
        handleGetModuleList();
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };

  const handleUpdateModule = async () => {
    try {
      const authToken = await checkAuthToken();
      const response = await update(
        {
          operation: "update",
          tblName: "tbl_module_master",
          data: {
            moduleName: moduleData.moduleName,
            description: moduleData.moduleDescription,
            isActive: moduleData.moduleStatus,
          },
          conditionString: `PK_ModuleId = ${moduleData.moduleId}`,
          checkAvailability: '',
          customQuery: '',
        },
        authToken
      );

      if (response) {
        showToast("Module Update Successful", "success");
        await handleClose();
        handleGetModuleList();
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };

  const handleGetModuleList = async () => {
    try {
      const authToken = await checkAuthToken();
      const response = await fetch(
        {
          operation: "fetch",
          tblName: "tbl_module_master",
          data: '',
          conditionString: '',
          checkAvailability: '',
          customQuery: '',
        },
        authToken
      );

      if (response) {
        setModuleList(response?.data);
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };

  const handleModuleStatus = async (moduleId, status) => {
    try {
      const authToken = await checkAuthToken();
      const response = await update(
        {
          operation: "update",
          tblName: "tbl_module_master",
          data: { isActive: !status },
          conditionString: `PK_ModuleId = ${moduleId}`,
          checkAvailability: '',
          customQuery: '',
        },
        authToken
      );

      if (response) {
        showToast(
          `Module ${status === 0 ? "Active" : "Inactive"} Successful`,
          "success"
        );
        handleGetModuleList();
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };

  const handleEditModule = async (selectedModule) => {
      setModuleData({
        moduleId: selectedModule.PK_ModuleId,
        moduleName: selectedModule.moduleName,
        moduleDescription: selectedModule.description,
        moduleStatus: selectedModule.isActive,
      });
      setModuleContainerVisible(true);
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
    setModuleContainerVisible(false);
    setModuleData({
      moduleId: '',
      moduleName: '',
      moduleDescription: '',
      moduleStatus: 1,
    });
  };

  useEffect(() => {
    handleGetModuleList();
  }, []);

  return (
    <View style={styles.container}>
      {moduleContainerVisible ? (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="New Module Name"
            value={moduleData.moduleName}
            onChangeText={(text) => setModuleData({ ...moduleData, moduleName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Module Description"
            value={moduleData.moduleDescription}
            onChangeText={(text) =>
              setModuleData({ ...moduleData, moduleDescription: text })
            }
          />
          {moduleData.moduleId ? (
            <View style={styles.buttonContainer}>
              <Button title="Update Module" onPress={handleUpdateModule} />
              <Button title="Cancel" onPress={handleClose} />
            </View>
          ) : (
            <View style={styles.buttonContainer}>
              <Button title="Add New Module" onPress={handleAddModule} />
              <Button title="Cancel" onPress={handleClose} />
            </View>
          )}
        </View>
      ) : <View>
        <Text style={styles.header}>Module List:</Text>
      <Button title="Add" onPress={() => setModuleContainerVisible(true)} />
      <FlatList
  data={moduleList}
  keyExtractor={(item) => item.PK_ModuleId.toString()}
  ListHeaderComponent={() => (
    <View style={styles.tableHeader}>
      <Text style={[styles.tableHeaderText, { flex: 2 }]}>Module Name</Text>
      <Text style={[styles.tableHeaderText, { flex: 3 }]}>Description</Text>
      <Text style={[styles.tableHeaderText, { flex: 1 }]}>Status</Text>
      <Text style={[styles.tableHeaderText, { flex: 1 }]}>Actions</Text>
    </View>
  )}
  renderItem={({ item }) => (
    <View style={styles.listItem}>
      <Text style={[styles.listItemText, { flex: 2 }]}>{item.moduleName}</Text>
      <Text style={[styles.listItemText, { flex: 3 }]}>{item.description}</Text>
      <TouchableOpacity onPress={() =>handleModuleStatus(item.PK_ModuleId, item?.isActive)}>
      <Text style={[styles.listItemText, { flex: 1 }, item.isActive ? styles.listItemActiveStatus : styles.listItemInactiveStatus]}>{item.isActive ? "Active" : "Inactive"}</Text>
      </TouchableOpacity>
  
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
        <Button
          title="Edit"
          onPress={() => handleEditModule(item)}
          style={styles.listItemEditButton}
          textStyle={styles.listItemEditText}
        />
      </View>
    </View>
  )}
/>
        </View>}
    </View>
  );
};



export default ModuleScreen;
