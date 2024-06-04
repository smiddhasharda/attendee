import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
} from "react-native";
import { insert, fetch, update } from "../../AuthService/AuthService";
import { useToast } from "../../globalComponent/ToastContainer/ToastContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./ModuleScreen.style";
import { Ionicons,Feather} from "@expo/vector-icons";
const ModuleScreen = ({ userAccess }) => {
  const UserAccess = userAccess?.module?.find( (item) => item?.FK_ModuleId === 3 );
  const { addToast } = useToast();
  const [moduleData, setModuleData] = useState({
    moduleId: "",
    moduleName: "",
    moduleDescription: "",
    moduleStatus: 1,
  });

  const [moduleList, setModuleList] = useState([]);
  const [moduleContainerVisible, setModuleContainerVisible] = useState(false);

  const checkAuthToken = useCallback(async () => {
    const authToken = await AsyncStorage.getItem("authToken");

    if (!authToken) {
      addToast("Authentication token not available", "error");
      throw new Error("Authentication token not available");
    }

    return authToken;
  }, [addToast]);

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
          conditionString: "",
          checkAvailability: "",
          customQuery: "",
        },
        authToken
      );

      if (response) {
        addToast("Module Add Successful", "success");
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
          checkAvailability: "",
          customQuery: "",
        },
        authToken
      );

      if (response) {
        addToast("Module Update Successful", "success");
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
          data: "",
          conditionString: "",
          checkAvailability: "",
          customQuery: "",
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
          checkAvailability: "",
          customQuery: "",
        },
        authToken
      );

      if (response) {
        addToast(
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
        addToast("Invalid authentication credentials", "error");
        break;
      case "Data already exists":
        addToast("Module with the same name already exists", "error");
        break;
      case "No response received from the server":
        addToast("No response received from the server", "error");
        break;
      default:
        addToast("Module Operation Failed", "error");
    }
  };

  const handleClose = async () => {
    setModuleContainerVisible(false);
    setModuleData({
      moduleId: "",
      moduleName: "",
      moduleDescription: "",
      moduleStatus: 1,
    });
  };

  useEffect(() => {
    handleGetModuleList();
  }, [UserAccess]);

  return (
      <View style={styles.container}>
        {moduleContainerVisible ? (
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="New Module Name"
              value={moduleData.moduleName}
              onChangeText={(text) =>
                setModuleData({ ...moduleData, moduleName: text })
              }
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
                <Pressable onPress={() => handleUpdateModule()}>
                  <Text style={styles.updatebtn}>Update Module</Text>
                </Pressable>
                <Pressable onPress={() => handleClose()}>
                  <Text style={styles.cancelbtn}>Cancel</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.buttonContainer}>
                <Pressable onPress={() => handleAddModule()}>
                  <Text numberOfLines={1} style={styles.updatebtn}>Add New Module</Text>
                </Pressable>
                <Pressable onPress={() => handleClose()}>
                  <Text style={styles.cancelbtn}>Cancel</Text>
                </Pressable>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.modulists}>
            <Text style={styles.header}>Module List:</Text>
              {UserAccess?.create === 1 && (
              <View style={{alignItems:"flex-end"}}>
                <Pressable onPress={() => setModuleContainerVisible(true)}>
                  <Text ><Ionicons   name="add-circle-outline" size={35} color="black" /></Text>
                </Pressable>
               </View>
              )}
            <FlatList
              data={moduleList}
              keyExtractor={(item) => item.PK_ModuleId.toString()}
              ListHeaderComponent={() => (
                <View style={styles.tableHeader}>
                  <Text  numberOfLines={1} style={[styles.tableHeaderText,]}>
                    Module 
                  </Text>
                  <Text style={[styles.tableHeaderText, ]}>
                    Description
                  </Text>
                  <Text style={[styles.tableHeaderText, ]}>
                    Status
                  </Text>
                  <Text style={[styles.tableHeaderText, ]}>
                    Actions
                  </Text>
                </View>
              )}
              renderItem={({ item }) => (
                <View style={styles.listItem}>
                  <Text numberOfLines={1}  style={[styles.listItemText, ]}>
                    {item.moduleName}
                  </Text>
                  <Text style={[styles.listItemText, ]}>
                    {item.description}
                  </Text>
                  <Pressable onPress={() => UserAccess?.update === 1 ? handleModuleStatus(item.PK_ModuleId, item?.isActive) : '' }
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
                    {UserAccess?.update === 1 ?    <Pressable   style={styles.listItemEditButton} onPress={() => handleEditModule(item)}>
                      <Text style={styles.listItemEditText}><Feather name="edit" size={16} color="white" /></Text>
                    </Pressable> : ' - '}                  
                  </View>
                </View>
              )}
            />
          </View>
        )}
      </View>
  );
};

export default ModuleScreen;
