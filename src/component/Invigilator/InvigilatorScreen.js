 import React,{useEffect,useCallback, useState} from 'react';
 import { View, Text, StyleSheet, Dimensions,ScrollView,FlatList,Pressable,TextInput,Linking } from 'react-native';
 import Bulkpload from '../../globalComponent/Bulkupload/BulkUpload';
 import DropDownPicker from "react-native-dropdown-picker";
 import { insert, update, fetch,view } from "../../AuthService/AuthService";
import { useToast } from "../../globalComponent/ToastContainer/ToastContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather,FontAwesome5,FontAwesome ,FontAwesome6} from "@expo/vector-icons";
const { parse, format } = require('date-fns');


 const InvigilatorScreen = ({userAccess}) => {
  const UserAccess = userAccess?.module?.find( (item) => item?.FK_ModuleId === 4 );
  const { addToast } = useToast();
  const [invigilatorList, setInvigilatorList] = useState([]);
  const [isBulkuploadInvigilater, setIsBulkuploadInvigilater] = useState(false);
  const [invigilatorContainerVisible, setInvigilatorContainerVisible] = useState(false);
  const [open, setOpen] = useState(0);
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
  const [searchedEmployee , setSearchedEmployee] = useState('');
  const StatusList = [{label: "primary" ,value :"primary" },{label:"secondary",value :"secondary"}]
  const [examDates, setExamDates] = useState([]);

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
        setInvigilatorList(response?.data?.receivedData)
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
      if(!invigilatorData?.employeeId || !invigilatorData?.invigilatorName){
      return addToast("Please set Invigilator","error");
      }
      else if(!invigilatorData?.date ){
        return addToast("Please select exam date","error");
        }
      else if(!invigilatorData?.room.replace(/\s+/g, '') === "" ){
        return addToast("Please enter room detials","error");
        }
      else if(!invigilatorData?.shift.replace(/\s+/g, '') === "" ){
        return addToast("Please enter shift details","error");
        }
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
      if(!invigilatorData?.employeeId || !invigilatorData?.invigilatorName){
        return addToast("Please set Invigilator","error");
        }
        else if(!invigilatorData?.date ){
          return addToast("Please select exam date","error");
          }
        else if(!invigilatorData?.room.replace(/\s+/g, '') === "" ){
          return addToast("Please enter room detials","error");
          }
        else if(!invigilatorData?.shift.replace(/\s+/g, '') === "" ){
          return addToast("Please enter shift details","error");
          }
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

  const handleDownload = () => {
    const url = global.SERVER_URL + "/invigilatorDoc/invgilator_bulkupload.xlsx";
    Linking.openURL(url);
  };

  const handleGetEmployeeSearch = async () => {
    try {
      const authToken = await checkAuthToken();
      const response = await view(
        {
          operation: "custom",
          tblName: "PS_SU_PSFT_COEM_VW",
          data: '',
          conditionString: '',
          checkAvailability: '',
          customQuery: `SELECT DISPLAY_NAME, EMPLID FROM PS_SU_PSFT_COEM_VW WHERE EMPLID = '${searchedEmployee}'`,
          viewType: 'HRMS_View'
        },
        authToken
      );
  
      if (response) {
        let EmployeeData = response?.data?.receivedData?.[0]
        setInvigilatorData({ ...invigilatorData, invigilatorName: EmployeeData?.DISPLAY_NAME,employeeId:EmployeeData?.EMPLID })
        // let EmployeeData = response?.data?.receivedData?.map((item) => ({
        //   label: `${item?.DISPLAY_NAME} (${item?.EMPLID})`,
        //   value: `${item?.DISPLAY_NAME} !#! ${item?.EMPLID}`,
        // }));
        // console.log(EmployeeData);
        // setEmployeesList(EmployeeData);
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };
    
  const parseAndFormatDate = (dateString) => {
    const possibleFormats = [
      "yyyy-MM-dd'T'HH:mm:ss.SSSX", // ISO format
      "dd-MMMM-yyyy",               // e.g., 03-July-2023
      "MM/dd/yyyy",                 // e.g., 07/03/2023
      "yyyy-MM-dd",                 // e.g., 2023-07-03
    ];
  
    let parsedDate;
    for (let formatString of possibleFormats) {
      try {
        parsedDate = parse(dateString, formatString, new Date());
        if (!isNaN(parsedDate)) break;
      } catch (error) {
        continue;
      }
    }
  
    if (!parsedDate || isNaN(parsedDate)) {
      console.error('Invalid date format:', dateString);
      return null;
    }
  
    const formattedDate = format(parsedDate, 'dd-MMMM-yyyy');
    return formattedDate;
  };

  const handleGetDateView = async () => {
    let CurrentDate = new Date().toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: '2-digit'}).toUpperCase().replace(/ /g, '-');
    try {
      const authToken = await checkAuthToken();
      const response = await view(
        {
          operation: "custom",
          tblName: "PS_S_PRD_EX_TME_VW",
          data: '',
          conditionString: '',
          checkAvailability: '',
          customQuery: `SELECT DISTINCT EXAM_DT FROM PS_S_PRD_EX_TME_VW WHERE EXAM_DT >= '${CurrentDate}' ORDER BY EXAM_DT ASC`,
          // customQuery: `SELECT DISTINCT EXAM_DT FROM PS_S_PRD_EX_TME_VW ORDER BY EXAM_DT ASC`,
          viewType:'Campus_View'
        },
        authToken
      );
 
      if (response) {
        let ExamDates = response?.data?.receivedData?.map((item) => ({label : `${parseAndFormatDate(item?.EXAM_DT)}` , value : parseAndFormatDate(item?.EXAM_DT)}));
        setExamDates(ExamDates);
      }
    } catch (error) {
      setLoading(false);
      handleAuthErrors(error);
    }
  };

  useEffect(() => {
    handleGetInigilatorDuty();
    handleGetDateView();
  }, [UserAccess]);
   return (
    <View style={styles.container}>
      {isBulkuploadInvigilater ? (<Bulkpload handleClose={() => handleClose()} renderData={    <View style={styles.tableHeader}>
                  <Text style={styles.tableHeaderText}>Employee Id</Text>
                  <Text style={styles.tableHeaderText}>Name</Text>
                  <Text style={styles.tableHeaderText}>Date</Text>
                  <Text style={styles.tableHeaderText}>Shift</Text>
                  <Text style={styles.tableHeaderText}>Room</Text>
                  <Text style={styles.tableHeaderText}>Duty Status</Text>
                </View>} />) : 
        (invigilatorContainerVisible ? (
        <View style={styles.formContainer}>
            <TextInput
            style={styles.input}
            placeholder="Search By Employee Id"
            value={searchedEmployee}
            onChangeText={(text) => setSearchedEmployee(text) }
          />
          <Pressable onPress={handleGetEmployeeSearch}><Text>Search</Text></Pressable>
          <TextInput
            style={styles.input}
            placeholder="Employee Id"
            value={invigilatorData.employeeId}
            // onChangeText={(text) =>
            //   setInvigilatorData({ ...invigilatorData, employeeId: text })
            // }
            disabled
          />
          <TextInput
            style={styles.input}
            placeholder="Employee Name"
            value={invigilatorData.invigilatorName}
            // onChangeText={(text) =>
            //   setInvigilatorData({ ...invigilatorData, invigilatorName: text })
            // }
            disabled
          />

      <DropDownPicker
            open={open === 1}
            value={invigilatorData.date}
            items={examDates}
            setOpen={() => setOpen(open === 1 ? 0 : 1)}
            setValue={(callback) => setInvigilatorData((prevState) => ({
              ...prevState,
              date: callback(invigilatorData.date)
            }))}
            placeholder='Select Exam Date'
            style={styles.dropdown}
            dropDownStyle={{ backgroundColor: "#fafafa"}}
            dropDownMaxHeight={150}
            dropDownDirection="TOP"
            containerStyle={styles.rolePicker}
            listItemContainerStyle={{ height: 40}} 
            listItemLabelStyle={{ fontSize: 14 }}
          />
          {/* <TextInput
            style={styles.input}
            placeholder="Date"
            value={invigilatorData.date}
            onChangeText={(text) =>
              setInvigilatorData({ ...invigilatorData, date: text })
            }
          /> */}
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
            open={open === 2}
            value={invigilatorData.duty_status}
            items={StatusList}
            setOpen={() => setOpen(open === 2 ? 0 : 2)} 
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
            <Pressable  style={[styles.addbtnWrap, {width:180},{alignItems:"center"}]} onPress={() => invigilatorData.PK_InvigilatorDutyId ? handleUpdateInvigilator() : handleAddInvigilator()}>
              <Text style={styles.addbtntext}>{invigilatorData.PK_InvigilatorDutyId ? "Update Invigilator Duty" : "Add New Invigilator Duty"}</Text>
            </Pressable>
            <Pressable style={styles.cancelbtn} onPress={() => handleClose()}>
              <Text style={styles.cancelbtntext}>Cancel</Text>
            </Pressable>
          </View>
        </View>
   ): (
    <View style={styles.userListWrap}>
    <View style={{flexDirection:"row", justifyContent:"space-between",alignItems:"center"}}>
      <Text style={styles.header}>Invigilator Duty List :</Text>      
      <View style={styles.addWrap}>
        {UserAccess?.create === 1 &&    
          ( <Text >
          
           <View style={{flexDirection:"row",justifyContent:"space-between",}} >
        
          <Pressable  style={{marginRight:20}}  onPress={() => handleDownload()}>
          <Text ><FontAwesome5 name="download" size={20} color="purple" /></Text>
        </Pressable>
        <Pressable style={{marginRight:20}} onPress={() => setIsBulkuploadInvigilater(true)}>
            <Text ><FontAwesome name="upload" size={20} color="purple" /></Text>
          </Pressable>
          <Pressable  onPress={() => handleAddButton()}>
          <Text style={styles.addbtntext}><FontAwesome6 name="add" size={20} color="purple" /></Text>
        </Pressable>
       
        </View>
   </Text>
)
        }
        </View>
        </View>
        <ScrollView horizontal>
        <View style={{minHeight:"56%", width: '100%' ,}}>
          <FlatList 
            data={invigilatorList}
            keyExtractor={(item) => item.PK_InvigilatorDutyId.toString()}
                ListHeaderComponent={() => (
                  <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText,{width:100} ]}>Id</Text>
                    <Text style={[styles.tableHeaderText, {width:200}]}>EmpId</Text>
                    <Text style={[styles.tableHeaderText,{width:200} ]}>Name</Text>
                    <Text style={[styles.tableHeaderText,{width:200}  ]}>Room</Text>
                    <Text style={[styles.tableHeaderText,{width:200} ]}>Date</Text>
                    <Text style={[styles.tableHeaderText,{width:200} ]}>Shift</Text>
                    <Text style={[styles.tableHeaderText,{width:100}  ]}>Status</Text>
                    <Text style={[styles.tableHeaderText,{width:60} ]}>Actions </Text>
                    
                  </View>
          )} renderItem={({ item }) => (          
            <View style={styles.listItem}>
              <Text style={[styles.listItemText,{width:100}  ]}>{item.PK_InvigilatorDutyId}</Text>
              <Text style={[styles.listItemText, {width:200} ]}>{item.employeeId}</Text>
              <Text style={[styles.listItemText,{width:200}  ]}>{item.invigilatorName}</Text>
              <Text style={[styles.listItemText,{width:200} ]}>{item.room}</Text>
              <Text style={[styles.listItemText,{width:200}  ]}>{item.date}</Text>
              <Text style={[styles.listItemText,{width:200} ]}>{item.shift}</Text>
              <Text style={[styles.listItemText, {width:100} ]}>{item.duty_status}</Text>    
              {UserAccess?.update === 1 ? <Pressable style={[{width:60} ,{alignItems:"center"}]} onPress={() => handleEditInvigilator(item)}>
              <Text style={styles.listItemEditText}><Feather name="edit" size={16} color="green" /></Text>
                </Pressable> : (<Text>-</Text>)}  
            </View>
            )}
          />
      </View>
      </ScrollView>
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
      textAlign:"",
      // alignItems:"center",
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 15,
    // textAlign:"center",
  },
  listItemText: {
    // flex: 1,

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
   marginBottom:10,
  },
  addbtntext:{
    color:"#fff",
    textAlign:"center"
  },
  addbtnWrap:{
    width:100,
    // alignSelf:"flex-end",
    marginBottom:10,
    backgroundColor:"#0C7C62",
    padding:10,
    borderRadius:5,
    marginRight:10,
    
  },
  cancelbtn:{
    width:100,
    marginBottom:10,
    backgroundColor:"rgb(237, 52, 52)",
    padding:10,
    borderRadius:5,
    textAlign:"center",
    color:"#fff"
  },
  cancelbtntext:{
    color:"#fff",
    textAlign:"center"

  }
});
  