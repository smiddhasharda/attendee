 import React,{useEffect,useCallback, useState} from 'react';
 import { View, Text, StyleSheet, Dimensions,ScrollView,FlatList,Pressable,TextInput } from 'react-native';
 import Bulkpload from '../../globalComponent/Bulkupload/BulkUpload';
 import DropDownPicker from "react-native-dropdown-picker";
 import { insert, update, fetch } from "../../AuthService/AuthService";
import { useToast } from "../../globalComponent/ToastContainer/ToastContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons,AntDesign,Feather} from "@expo/vector-icons";
const windowWidth = Dimensions.get("window").width;

 const InvigilatorScreen = ({userAccess}) => {
  const UserAccess = userAccess?.module?.find( (item) => item?.FK_ModuleId === 4 );
  const { addToast } = useToast();
  const [invigilatorList, setInvigilatorList] = useState([]);
  const [isBulkuploadInvigilater, setIsBulkuploadInvigilater] = useState(false);
  const [invigilatorContainerVisible, setInvigilatorContainerVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [invigilatorData, setInvigilatorData] = useState({
    PK_InvigilatorDutyId: "",
    employeeId: "",
    invigilatorName: "",
    date:"",
    shift:"",
    room:"",
    duty_status:"primary",
    isActive: 1,
  });
  const StatusList = [{label: "primary" ,value :"primary" },{label:"secondary",value :"secondary"}]

  const checkAuthToken = useCallback(async () => {
    const authToken = await AsyncStorage.getItem("authToken");

    if (!authToken) {
      addToast("Authentication token not available", "error");
      throw new Error("Authentication token not available");
    }

    return authToken;
  }, [addToast]);

  const handleGetInigilatorDuty = async () => {
    try {
      const authToken = await checkAuthToken();
      const response = await fetch(
        {
          operation: "fetch",
          tblName: "tbl_invigilator_duty",
          data: "",
          conditionString: "",
          checkAvailability: "",
          customQuery: "",
        },
        authToken
      );

      if (response) {
        setInvigilatorList(response.data)
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };

  const handleAddButton = async() =>{
    setInvigilatorContainerVisible(true);
  }
  
  const handleAddInvigilator = async () => {
    try {
      const authToken = await checkAuthToken();
      const response = await insert(
        {
          operation: "insert",
          tblName: "tbl_invigilator_duty",
          data: { employeeId: invigilatorData.employeeId,
          invigilatorName: invigilatorData.invigilatorName,
          date:invigilatorData.date,
          shift:invigilatorData.shift,
          room:invigilatorData.room,
          duty_status:invigilatorData.duty_status,},
          conditionString: "",
          checkAvailability: "",
          customQuery: "",
        },
        authToken
      );

      if (response) {
        addToast("Invigilator Add Successful", "success");
        await handleClose();
        handleGetInigilatorDuty();
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };

  const handleUpdateInvigilator = async () => {
    try {
      const authToken = await checkAuthToken();
      const response = await update(
        {
          operation: "update",
          tblName: "tbl_invigilator_duty",
          data: {
            date:invigilatorData.date,
            shift:invigilatorData.shift,
            room:invigilatorData.room,
            duty_status:invigilatorData.duty_status,
          },
          conditionString: `PK_InvigilatorDutyId = ${invigilatorData.PK_InvigilatorDutyId}`,
          checkAvailability: "",
          customQuery: "",
        },
        authToken
      );

      if (response) {
        addToast("Invigilator Update Successful", "success");
        await handleClose();
        handleGetInigilatorDuty();
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };


  // const handleModuleStatus = async (moduleId, status) => {
  //   try {
  //     const authToken = await checkAuthToken();
  //     const response = await update(
  //       {
  //         operation: "update",
  //         tblName: "tbl_module_master",
  //         data: { isActive: !status },
  //         conditionString: `PK_ModuleId = ${moduleId}`,
  //         checkAvailability: "",
  //         customQuery: "",
  //       },
  //       authToken
  //     );

  //     if (response) {
  //       addToast(
  //         `Module ${status === 0 ? "Active" : "Inactive"} Successful`,
  //         "success"
  //       );
  //       handleGetModuleList();
  //     }
  //   } catch (error) {
  //     handleAuthErrors(error);
  //   }
  // };

  const handleEditInvigilator = async (selectedData) => {
    setInvigilatorData({
      PK_InvigilatorDutyId: selectedData.PK_InvigilatorDutyId,
    employeeId: selectedData.employeeId,
    invigilatorName: selectedData.invigilatorName,
    date:selectedData.date,
    shift:selectedData.shift,
    room:selectedData.room,
    duty_status:selectedData.duty_status,
    isActive: selectedData.isActive,
    });
    setInvigilatorContainerVisible(true);
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
    setInvigilatorContainerVisible(false);
    setIsBulkuploadInvigilater(false);
    setInvigilatorData({
      PK_InvigilatorDutyId: "",
    employeeId: "",
    invigilatorName: "",
    date:"",
    shift:"",
    room:"",
    duty_status:"primary",
    isActive: 1,
    });
  };

  useEffect(() => {
    handleGetInigilatorDuty();
  }, [UserAccess]);

   return (
    <View style={styles.container}>
      {isBulkuploadInvigilater ? (<Bulkpload handleClose={() => handleClose()} />) : 
        (invigilatorContainerVisible ? (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Employee Id"
            value={invigilatorData.employeeId}
            onChangeText={(text) =>
              setInvigilatorData({ ...invigilatorData, employeeId: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Employee Name"
            value={invigilatorData.invigilatorName}
            onChangeText={(text) =>
              setInvigilatorData({ ...invigilatorData, invigilatorName: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Date"
            value={invigilatorData.date}
            onChangeText={(text) =>
              setInvigilatorData({ ...invigilatorData, date: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Room"
            value={invigilatorData.room}
            onChangeText={(text) =>
              setInvigilatorData({ ...invigilatorData, room: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Shift"
            value={invigilatorData.shift}
            onChangeText={(text) =>
              setInvigilatorData({ ...invigilatorData, shift: text })
            }
          />
          <DropDownPicker
            open={open}
            value={invigilatorData.duty_status}
            items={StatusList}
            setOpen={setOpen}
            setValue={(callback) => setInvigilatorData((prevState) => ({
              ...prevState,
              duty_status: callback(invigilatorData.duty_status)
            }))}
                    style={styles.dropdown}
            dropDownStyle={{ backgroundColor: "#fafafa"}}
            dropDownMaxHeight={150}
            dropDownDirection="TOP"
            containerStyle={styles.rolePicker}
            listItemContainerStyle={{ height: 40}} 
            listItemLabelStyle={{ fontSize: 14 }}
          />
          <View style={styles.buttonContainer}>
            <Pressable onPress={() => invigilatorData.PK_InvigilatorDutyId ? handleUpdateInvigilator() : handleAddInvigilator()}>
              <Text>{invigilatorData.PK_InvigilatorDutyId ? "Update Invigilator Duty" : "Add New Invigilator Duty"}</Text>
            </Pressable>
            <Pressable onPress={() => handleClose()}>
              <Text style={styles.cancelbtn}>Cancel</Text>
            </Pressable>
          </View>
        </View>
   ): (
    <View style={styles.userListWrap}>
      <Text style={styles.header}>Invigilator Duty List :</Text>      
     
        {UserAccess?.create === 1 &&    
          ( <View style={styles.addWrap}><Pressable style={styles.addbtnWrap} onPress={() => setIsBulkuploadInvigilater(true)}>
            <Text style={styles.addbtntext}>BulkUpload</Text>
          </Pressable>
          <Pressable style={styles.addbtnWrap} onPress={() => handleAddButton()}>
          <Text style={styles.addbtntext}>Add</Text>
        </Pressable> </View>
)
        }
      <FlatList 
        data={invigilatorList}
        keyExtractor={(item) => item.PK_InvigilatorDutyId.toString()}
            ListHeaderComponent={() => (
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText,]}>Duty Id</Text>
                <Text style={[styles.tableHeaderText, ]}>Employee Id</Text>
                <Text style={[styles.tableHeaderText,]}>Invigilator Name</Text>
                <Text style={[styles.tableHeaderText, ]}>Room</Text>
                <Text style={[styles.tableHeaderText,]}>Date</Text>
                <Text style={[styles.tableHeaderText,]}>Shift</Text>
                <Text style={[styles.tableHeaderText, ]}>Duty Status</Text>
                <Text style={[styles.tableHeaderText,]}>Actions </Text>
              </View>
      )} renderItem={({ item }) => (          
        <View style={styles.listItem}>
          <Text style={[styles.listItemText, ]}>{item.PK_InvigilatorDutyId}</Text>
          <Text style={[styles.listItemText, ]}>{item.employeeId}</Text>
          <Text style={[styles.listItemText, ]}>{item.invigilatorName}</Text>
          <Text style={[styles.listItemText, ]}>{item.room}</Text>
          <Text style={[styles.listItemText, ]}>{item.date}</Text>
          <Text style={[styles.listItemText,]}>{item.shift}</Text>
          <Text style={[styles.listItemText, ]}>{item.duty_status}</Text>    
          {UserAccess?.update === 1 ? <Pressable style={styles.listItemEditButton} onPress={() => handleEditInvigilator(item)}>
           <Text style={styles.listItemEditText}><Feather name="edit" size={16} color="white" /></Text>
            </Pressable> : (<Text>-</Text>)}  
        </View>
        )}
      />
    </View>
   ))
    }
    </View>   
   );
 };
 
 export default InvigilatorScreen;

 const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  formContainer: {
    marginBottom: 20,
    backgroundColor:"#fff",
    padding:20,
    elevation:2,
  },
  userListWrap:{
   backgroundColor:"#fff",
   padding:20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    marginTop:10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgb(17, 65, 102)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderRadius:5,
  },
  tableHeaderText: {
    fontSize: 16, 
      fontWeight: 'bold', 
      // paddingHorizontal: 5,
      color:"#fff",
      textAlign:"center",
      alignItems:"center",
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 15,
    textAlign:"center",
  },
  listItemText: {
    flex: 1,
  },
  listItemActiveStatus: {
    color: 'green',
  },
  listItemInactiveStatus: {
    color: 'red',
  },
  listItemEditButton: {
    backgroundColor: '#0C7C62',
    padding: 5,
    borderRadius: 5,
  },
  listItemEditText: {
    color: 'white',
  },

  logoImageStyle: {
    width: 200,
    height: 200,
    alignSelf: "center",
  },
  textInputContainer: {
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  passwordTextInputContainer: {
    // marginTop: 16,
    // alignItems: "center",
    // justifyContent: "center",
  },
  dividerStyle: {
    height: 0.5,
    marginTop: 24,
    marginBottom: 12,
    borderRadius: 16,
    alignSelf: "center",
    backgroundColor: "#ccc",
  },
  eyeIconContainer: {
    right: 16,
    top: 14,
    position: "absolute",
  },
  eyeIcon: {
    width: 24,
    height: 24,
    // tintColor: "#555",
  },
  
  shakeText: {
    color: "red",
    marginTop: 8,
    marginLeft: 12,
    marginRight: "auto",
  },
  emailTextInputContainer: {
    // alignItems: "center",
    // justifyContent: "center",
  },
  emailTooltipContainer: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  emailTooltipTextStyle: {
    fontSize: 16,
  },
  emailTooltipRedTextStyle: {
    fontWeight: "bold",
    color: "red",
  },
  emailTooltipContentStyle: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  emailTooltipBackgroundStyle: {
    backgroundColor: "transparent",
  },
  passwordTooltipStyle: {
    marginTop: 30,
  },
  passwordTooltipContainer: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  passwordTooltipTextStyle: {
    fontSize: 16,
  },
  passwordTooltipRedTextStyle: {
    fontWeight: "bold",
    color: "red",
  },
  passwordTooltipBackgroundStyle: {
    backgroundColor: "transparent",
  },
  passwordTooltipContentStyle: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  addWrap:{
   width:100,
   alignSelf:"flex-end",
   marginBottom:10,
  },
  addbtnWrap:{
    width:100,
    alignSelf:"flex-end",
    marginBottom:10,
    backgroundColor:"#0C7C62",
    padding:10,
    borderRadius:5,
    
  },
});
  