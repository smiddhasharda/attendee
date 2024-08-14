import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  Dimensions
} from "react-native";
import { insert, fetch, update } from "../../AuthService/AuthService";
import { useToast } from "../../globalComponent/ToastContainer/ToastContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./ModuleScreen.style";
import { Ionicons, Feather } from "@expo/vector-icons";
import Pagination from "../../globalComponent/Pagination/PaginationComponent";
import { ScrollView } from "react-native-gesture-handler";
import ShimmerEffect from "../../globalComponent/Refresh/ShimmerEffect";

const ModuleScreen = ({ userAccess }) => {
  const userAccessForModule = userAccess?.module?.find(item => item?.FK_ModuleId === 3);
  const { addToast } = useToast();

  const [moduleData, setModuleData] = useState({
    moduleId: "",
    moduleName: "",
    moduleDescription: "",
    moduleStatus: 1,
  });


  const [currentPage, setCurrentPage] = useState(1);
  const [moduleList, setModuleList] = useState([]);
  const [moduleContainerVisible, setModuleContainerVisible] = useState(false);
  
const handlePageChange = (page) => {
  setCurrentPage(page);
};
const pageSize = 10;
const paginatedData = moduleList.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    //---------------------------------------------------- dimension based view--------------------------------------------//
    const { width, height } = Dimensions.get('window');
    const isMobile = width < 768; 
    const tableWidth = isMobile ? width  : width * 0.96; 
    const tableHeight = isMobile ? height * 0.70 : height * 0.67; 
    
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
  
  useEffect(() => {
    fetchModuleList();
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
        <View style={styles.moduleListContainer}>
          <Text style={styles.header}>Manage Modules:</Text>
            {
              userAccessForModule?.create === 1 && (
                <View style={styles.addBtn}>
                  <Pressable onPress={() => setModuleContainerVisible(true)}>
                    <Ionicons name="add-circle-outline" size={28} color="black" />
                  </Pressable>
                </View>
              )
            }  
              <ScrollView horizontal={true}>
              <View style={{maxHeight: tableHeight, minWidth: isMobile ? tableWidth :tableWidth }}>
                <FlatList
                  data={paginatedData}
                  style={styles.modulesTbl}
                  keyExtractor={item => item.PK_ModuleId.toString()}
                  ListHeaderComponent={() => (
                    <View style={styles.tableHeader}>
                      <Text style={[styles.tableHeaderText, {width:120, display:"inline-block" ,}]} numberOfLines={1}>Module</Text>
                      <Text style={[styles.tableHeaderText, {width:100, display:"inline-block",}]} numberOfLines={1}>Status</Text>
                      <Text style={[styles.tableHeaderText, {width:100, display:"inline-block", textAlign:"center"}]} numberOfLines={1}>Created Date</Text>
                      <Text style={[styles.tableHeaderText, {width:100, display:"inline-block", textAlign:"center"}]} numberOfLines={1}>Updated Date</Text>
                      <Text style={[styles.tableHeaderText, {width:120, display:"inline-block", textAlign:"center"}]} numberOfLines={1}>Created By</Text>
                      <Text style={[styles.tableHeaderText, {width:120, display:"inline-block",textAlign:"center"}]} numberOfLines={1}>Updated By</Text>              
                      <Text style={[styles.tableHeaderText, {width:100, display:"inline-block", textAlign:"center"}]} numberOfLines={1}>Actions</Text>
                    </View>
                    
                  )}
                  renderItem={({ item }) => (
                    refreshing ? <ShimmerEffect/> :
                    <View style={[styles.listItem]}>
                      <Text style={[styles.listItemText, {width:120, display: "inline-block",}]} numberOfLines={1}>{item.moduleName}</Text>
                      <View style={[styles.listItemText, {width:100, display: "inline-block" ,textAlign:"center"}]}> 
                      <Pressable style={[ { display: "inline-block"}]} onPress={() => userAccessForModule?.update === 1 && handleModuleStatus(item.PK_ModuleId, item.isActive)}>
                        <Text style={[styles.listItemText, item.isActive ? styles.actionbtn : styles.inactivebtn, styles.columnStatus,]} numberOfLines={1}>
                          {item.isActive ? "Active" : "Inactive"}
                        </Text>
                      </Pressable>
                      </View>
                      <Text style={[styles.listItemText, {width:120, display: "inline-block", textAlign:"center" }]} numberOfLines={1}>
                        {item.created_at ? new Date(item.created_at.split('T')[0]).toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' }) : 'N/A'}
                      </Text>
                      <Text style={[styles.listItemText, { width:120, display: "inline-block",textAlign:"center" }]} numberOfLines={1}>
                      {item.updated_at ? new Date(item.updated_at.split('T')[0]).toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' }) : 'N/A'}
                      </Text>
                      <Text style={[styles.listItemText, {width:120, display: "inline-block" , textAlign:"center"}]} numberOfLines={1}>
                        {item.created_by ? created_by:'N/A'}
                      </Text>
                      <Text style={[styles.listItemText, {width:120, display: "inline-block",textAlign:"center" }]} numberOfLines={1}>
                        {item.updated_by ? updated_by:'N/A'}
                      </Text>
                
                      <View style={[styles.listItemText, {width:120, display:"inline-block", alignItems:"center" ,textAlign:"center"}]}>
                        {userAccessForModule?.update === 1 ? (
                          <Pressable style={[styles.listItemEditButton, {display:"inline-block"}]}  onPress={() => handleEditModule(item)}>
                            <Feather name="edit" size={16} color="#0C7C62" />
                          </Pressable>
                        ) : (<Text>-</Text>)}
                      </View>
                    </View>
                  )}
                  stickyHeaderIndices={[0]}  
                />
              </View>
              </ScrollView>
            <Pagination
                totalItems={moduleList?.length}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={handlePageChange}              
          />
        </View>
      )}
    </View>
  );
};

export default ModuleScreen;
