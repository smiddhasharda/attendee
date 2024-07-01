import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
} from "react-native";
import { insert, fetch, update,view } from "../../AuthService/AuthService";
import { useToast } from "../../globalComponent/ToastContainer/ToastContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./ModuleScreen.style";
import { Ionicons, Feather } from "@expo/vector-icons";

const ModuleScreen = ({ userAccess }) => {
  const userAccessForModule = userAccess?.module?.find(item => item?.FK_ModuleId === 3);
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
      addToast("Authentication token is not available", "error");
      throw new Error("Authentication token is not available");
    }
    return authToken;
  }, [addToast]);

  const handleModuleOperation = useCallback(async (operation, data, successMessage, conditionString = "") => {
    try {
      const authToken = await checkAuthToken();
      const response = await (operation === 'insert' ? insert : update)(
        {
          operation,
          tblName: "tbl_module_master",
          data,
          conditionString,
        },
        authToken
      );
      if (response) {
        addToast(successMessage, "success");
        await handleClose();
        await fetchModuleList();
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  }, [checkAuthToken, moduleData, addToast]);

  const handleAddModule = useCallback(() => {
    if (moduleData.moduleName.replace(/\s+/g, '') === "") {
      addToast("Enter the module name!", "error");
    }
    else {
      handleModuleOperation('insert', { moduleName: moduleData.moduleName, description: moduleData.moduleDescription, isActive: moduleData.moduleStatus, }, "Module Add Successful");
    }
  }, [handleModuleOperation, moduleData]);

  const handleUpdateModule = useCallback(() => {
    if (moduleData.moduleName.replace(/\s+/g, '') === "") {
      addToast("Enter the module name!", "error");
    }
    else {
      handleModuleOperation('update', { moduleName: moduleData.moduleName, description: moduleData.moduleDescription, isActive: moduleData.moduleStatus, }, "Module Update Successful", `PK_ModuleId = ${moduleData.moduleId}`);
    }
  }, [handleModuleOperation, moduleData]);

  const fetchModuleList = useCallback(async () => {
    try {
      const authToken = await checkAuthToken();
      const response = await fetch({
        operation: "fetch",
        tblName: "tbl_module_master",
        data: "",
        conditionString: "",
      }, authToken);

      if (response) {
        setModuleList(response?.data?.receivedData);
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  }, [checkAuthToken]);

  const handleModuleStatus = useCallback(async (moduleId, status) => {
    handleModuleOperation('update', { isActive: !status }, `Module ${status === 0 ? "Active" : "Inactive"} Successful`, `PK_ModuleId = ${moduleId}`);
  }, [handleModuleOperation]);

  const handleEditModule = useCallback((selectedModule) => {
    setModuleData({
      moduleId: selectedModule.PK_ModuleId,
      moduleName: selectedModule.moduleName,
      moduleDescription: selectedModule.description,
      moduleStatus: selectedModule.isActive,
    });
    setModuleContainerVisible(true);
  }, []);

  const handleAuthErrors = (error) => {
    const errorMessage = {
      "Invalid credentials": "Invalid authentication credentials",
      "Data already exists": "Module with the same name already exists",
      "No response received from the server": "No response received from the server",
    }[error.message] || "Module Operation Failed";
    addToast(errorMessage, "error");
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

  // const handleGetSampleView = async () => {
  //   try {
  //     const authToken = await checkAuthToken();
  //     const response = await view(
  //       {
  //         operation: "fetch",
  //         tblName: "PS_SU_PSFT_COEM_VW",
  //         data: '',
  //         conditionString: '',
  //         checkAvailability: '',
  //         customQuery: '',
  //         viewType:'HRMS_View'
  //       },
  //       authToken
  //     );

  //     if (response) {
  //       console.log("View Data : ",response?.data);
  //       // setLoading(false);
  //     }
  //   } catch (error) {
  //     // setLoading(false);
  //     handleAuthErrors(error);
  //   }
  // };

  useEffect(() => {
    fetchModuleList();
    // handleGetSampleView();
  }, [userAccessForModule]);

  return (
    <View style={styles.container}>
      {moduleContainerVisible ? (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Module Name*"
            value={moduleData.moduleName}
            onChangeText={text => setModuleData({ ...moduleData, moduleName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Module Description"
            value={moduleData.moduleDescription}
            onChangeText={text => setModuleData({ ...moduleData, moduleDescription: text })}
          />
          <View style={styles.buttonContainer}>
            {moduleData.moduleId ? (
              <>
                <Pressable onPress={handleUpdateModule}>
                  <Text style={styles.updatebtn}>Update Module</Text>
                </Pressable>
                <Pressable onPress={handleClose}>
                  <Text style={styles.cancelbtn}>Cancel</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Pressable onPress={handleAddModule}>
                  <Text style={styles.updatebtn}>Add Module</Text>
                </Pressable>
                <Pressable onPress={handleClose}>
                  <Text style={styles.cancelbtn}>Cancel</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      ) : (
        // <View style={styles.moduleListContainer}>
        //   <Text style={styles.header}>Manage Modules:</Text>
        //   {userAccessForModule?.create === 1 && (
        //     <View style={styles.addBtn}>
        //       <Pressable onPress={() => setModuleContainerVisible(true)}>
        //         <Ionicons name="add-circle-outline" size={35} color="black" />
        //       </Pressable>
        //     </View>
        //   )}
        //   <FlatList
        //     data={moduleList}
        //     style={styles.modulesTbl}
        //     keyExtractor={item => item.PK_ModuleId.toString()}
        //     ListHeaderComponent={() => (
        //       <View style={styles.tableHeader}>
        //         <Text style={[styles.tableHeaderText, styles.column10]}>Module</Text>
        //         <Text style={[styles.tableHeaderText, styles.column60]}>Description</Text>
        //         <Text style={[styles.tableHeaderText, styles.column10]}>Status</Text>
        //         <Text style={[styles.tableHeaderText, styles.column10]}>Actions</Text>
        //       </View>
        //     )}
        //     renderItem={({ item }) => (
        //       <View style={styles.listItem}>
        //         <Text style={[styles.listItemText, styles.column10]}>{item.moduleName}</Text>
        //         <Text style={[styles.listItemText, styles.column60]}>{item.description}</Text>
        //         <Pressable onPress={() => userAccessForModule?.update === 1 && handleModuleStatus(item.PK_ModuleId, item.isActive)}>
        //           <Text style={[styles.listItemText, item.isActive ? styles.listItemActiveStatus : styles.listItemInactiveStatus, styles.column10]}>
        //             {item.isActive ? "Active" : "Inactive"}
        //           </Text>
        //         </Pressable>
        //         <View style={[styles.listItemActionContainer, styles.column10]}>
        //           {userAccessForModule?.update === 1 ? (
        //             <Pressable style={styles.listItemEditButton} onPress={() => handleEditModule(item)}>
        //               <Feather name="edit" size={16} color="white" />
        //             </Pressable>
        //           ) : (<Text>-</Text>)}
        //         </View>
        //       </View>
        //     )}
        //   />

        // </View>
        <View style={styles.moduleListContainer}>
  <Text style={styles.header}>Manage Modules:</Text>
  {userAccessForModule?.create === 1 && (
    <View style={styles.addBtn}>
      <Pressable onPress={() => setModuleContainerVisible(true)}>
        <Ionicons name="add-circle-outline" size={24} color="black" />
      </Pressable>
    </View>
  )}
  <View style={{height:"60%"}}>
  <FlatList
    data={moduleList}
    style={styles.modulesTbl}
    keyExtractor={item => item.PK_ModuleId.toString()}
    ListHeaderComponent={() => (
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, styles.columnModule,{width:"60%"}]} numberOfLines={1}>Module</Text>
        {/* <Text style={[styles.tableHeaderText, styles.columnDescription]} numberOfLines={1}>Description</Text> */}
        <Text style={[styles.tableHeaderText, styles.columnStatus,{width:"20%"}]} numberOfLines={1}>Status</Text>
        <Text style={[styles.tableHeaderText, styles.columnAction,{width:"20%"},{textAlign:"center"}]} numberOfLines={1}>Actions</Text>
      </View>
    )}
    renderItem={({ item }) => (
      <View style={styles.listItem}>
        <Text style={[styles.listItemText, styles.columnModule,{width:"60%"}]} numberOfLines={1}>{item.moduleName}</Text>
        {/* <Text style={[styles.listItemText, styles.columnDescription]} numberOfLines={1}>{item.description}</Text> */}
        <Pressable style={{width:"20%"}} onPress={() => userAccessForModule?.update === 1 && handleModuleStatus(item.PK_ModuleId, item.isActive)}>
          <Text style={[styles.listItemText, item.isActive ? styles.listItemActiveStatus : styles.listItemInactiveStatus, styles.columnStatus]} numberOfLines={1}>
            {item.isActive ? "Active" : "Inactive"}
          </Text>
        </Pressable>
        <View style={[styles.listItemActionContainer, styles.columnAction,{width:"20%"},{alignItems:"center"}]}>
          {userAccessForModule?.update === 1 ? (
            <Pressable style={styles.listItemEditButton} onPress={() => handleEditModule(item)}>
              <Feather name="edit" size={16} color="#0C7C62" />
            </Pressable>
          ) : (<Text>-</Text>)}
        </View>
      </View>
    )}
    stickyHeaderIndices={[0]} 
  />
  </View>
</View>

      )}
    </View>
  );
};

export default ModuleScreen;
