 import React,{useEffect,useCallback, useState} from 'react';
 import { View, Text, StyleSheet, Dimensions,ScrollView,FlatList,Pressable,TextInput,ActivityIndicator,Linking,Platform } from 'react-native';
 import Bulkpload from '../../globalComponent/Bulkupload/BulkUpload';
 import DropDownPicker from "react-native-dropdown-picker";
 import { insert, update, fetch,view } from "../../AuthService/AuthService";
import { useToast } from "../../globalComponent/ToastContainer/ToastContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather,FontAwesome5,FontAwesome ,FontAwesome6,Entypo} from "@expo/vector-icons";
import { parse, format,parseISO,isBefore } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import Pagination from "../../globalComponent/Pagination/PaginationComponent";
import ShimmerEffect from '../../globalComponent/Refresh/ShimmerEffect';
import CryptoJS from 'crypto-js';

 const InvigilatorScreen = ({userAccess}) => {
  const [refreshing, setRefreshing] = useState(false);
  const UserAccess = userAccess?.module?.find( (item) => item?.FK_ModuleId === 8 );
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
    duty_status:"Primary",
    isActive: 1,
  });
  const [searchedEmployee , setSearchedEmployee] = useState('');
  const StatusList = [{label: "Primary" ,value :"Primary" },{label:"Secondary",value :"Secondary"}]
  const [examDates, setExamDates] = useState([]);
  const [roomList, setRoomList] = useState([]);
  const [shiftList, setShiftList] = useState([]);

  const [searchText, setSearchText] = useState('');


    //---------------------------------------------------- dimension based view--------------------------------------------//
    const { width, height } = Dimensions.get('window');
    const isMobile = width < 768; 
    const tableWidth = isMobile ? width - 10 : width * 0.96; 
    const tableHeight = isMobile ? height * 0.72 : height * 0.66; 
    // console.log(`Table Width: ${tableWidth}, Table Height: ${tableHeight} `,);
    
// Pagination
const [currentPage, setCurrentPage] = useState(1);
const handlePageChange = (page) => {
  setCurrentPage(page);
};
const pageSize = 25;
const paginatedData = invigilatorList.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const checkAuthToken = useCallback(async () => {
    const authToken = atob(await AsyncStorage.getItem(btoa("authToken")));

    if (!authToken) {
      addToast("Authentication token is not available", "error");
      throw new Error("Authentication token not available");
    }

    return authToken;
  }, [addToast]);

  const decrypt = (encryptedData) => {
    const encryptScreteKey = 'b305723a4d2e49a443e064a111e3e280';
    const [iv, encrypted] = encryptedData.split(':');
    const ivBytes = CryptoJS.enc.Hex.parse(iv);
    const encryptedBytes = CryptoJS.enc.Hex.parse(encrypted);
    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: encryptedBytes },
      CryptoJS.enc.Utf8.parse(encryptScreteKey),
      {
        iv: ivBytes,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    return decrypted.toString(CryptoJS.enc.Utf8);
  };

  const generateIV = () => {
    if (Platform.OS === 'web') {
      // For web, use CryptoJS's random generator
      return CryptoJS.lib.WordArray.random(16);
    } else {
      // For React Native, use a simple random number generator
      const arr = new Uint8Array(16);
      for (let i = 0; i < 16; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return CryptoJS.lib.WordArray.create(arr);
    }
  };
  
  const encrypt = (plaintext) => {
    const encryptScreteKey = 'b305723a4d2e49a443e064a111e3e280';
    const iv = generateIV();
    const key = CryptoJS.enc.Utf8.parse(encryptScreteKey);
    
    const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
  
    const encryptedBase64 = encrypted.toString();
    const ivHex = CryptoJS.enc.Hex.stringify(iv);
  
    return `${ivHex}:${encryptedBase64}`;
  };

  const handleGetInigilatorDuty = async () => {
    try {
      const authToken = await checkAuthToken();
      const Parameter = {
        operation: "custom",
        tblName: "tbl_invigilator_duty",
        data: "",
        conditionString: "",
        checkAvailability: "",
        customQuery: "SELECT * FROM tbl_invigilator_duty order by PK_InvigilatorDutyId Desc",
      };
      const encryptedParams = encrypt(JSON.stringify(Parameter));
      const response = await fetch(
        encryptedParams,
        authToken
      );

      if (response) {
        const decryptedData = decrypt(response?.data?.receivedData);
        const DecryptedData = JSON.parse(decryptedData);
        setInvigilatorList(DecryptedData);
        setRefreshing(false);
      }
    } catch (error) {
      setRefreshing(false);
      handleAuthErrors(error);
    }
  };

  const handleAddButton = async() =>{
    setInvigilatorContainerVisible(true);
    await handleGetDateView();
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
      const Parameter = {
        operation: "insert",
        tblName: "tbl_invigilator_duty",
        data: { employeeId: invigilatorData.employeeId,
        invigilatorName: invigilatorData.invigilatorName,
        date:parseExcelDate(invigilatorData.date),
        shift:invigilatorData.shift,
        room:invigilatorData.room,
        duty_status:invigilatorData.duty_status,},
        conditionString: `employeeId = '${invigilatorData.employeeId}' AND date = '${parseExcelDate(invigilatorData.date)}' AND shift = '${invigilatorData.shift}'`,
        checkAvailability: true,
        customQuery: "",
      };
      const encryptedParams = encrypt(JSON.stringify(Parameter));
      const response = await insert(
        encryptedParams,
        authToken
      );

      if (response) {
        addToast("Invigilator duty is added successfully!", "success");
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
      const Parameter ={
        operation: "update",
        tblName: "tbl_invigilator_duty",
        data: {
          date:parseExcelDate(invigilatorData.date),
          shift:invigilatorData.shift,
          room:invigilatorData.room,
          duty_status:invigilatorData.duty_status,
        },
        conditionString: `PK_InvigilatorDutyId = ${invigilatorData.PK_InvigilatorDutyId}`,
        checkAvailability: "",
        customQuery: "",
      };
      const encryptedParams = encrypt(JSON.stringify(Parameter));
      const response = await update(
        encryptedParams,
        authToken
      );

      if (response) {
        addToast("Invigilator duty is updated successfully!", "success");
        await handleClose();
        handleGetInigilatorDuty();
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };

  const handleGetRoomView = async (SelectedDate) => {
    try {
      const authToken = await checkAuthToken();
      const formattedDate = SelectedDate ? new Date(SelectedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).toUpperCase().replace(/ /g, '-') : '';
      const customQuery = `SELECT DISTINCT ROOM_NBR FROM PS_S_PRD_EX_RME_VW WHERE EXAM_DT = '${formattedDate}' order by ROOM_NBR`;
      const Parameter = {
        operation: "custom",
          tblName: "PS_S_PRD_EX_RME_VW",
          data: '',
          conditionString: '',
          checkAvailability: '',
          customQuery: customQuery,
          viewType:'Campus_View'
      };
      const encryptedParams = encrypt(JSON.stringify(Parameter));

      const response = await view(
        encryptedParams,
        authToken
      );

      if (response) {
        const decryptedData = decrypt(response?.data?.receivedData);
        const DecryptedData = JSON.parse(decryptedData);
        let RoomData = DecryptedData?.map((item) => ({label : item?.ROOM_NBR , value : item?.ROOM_NBR }));
        setRoomList(RoomData);
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
  const convertedTime = (startTime) => {    
    const date = parseISO(startTime); // Parse the input ISO date string
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; // Get the current timezone
    const zonedDate = formatInTimeZone(date, timeZone ,'h:mm a' ); // Convert the date to the local timezone
    return zonedDate;
  };

  const handleEditInvigilator = async (selectedData) => {
    const selectedDate = parseISO(selectedData.date);
    const currentDate = new Date();
    if (!isBefore(selectedDate, currentDate)) {
      // Prevent editing if the date is less than the current date
      addToast("You cannot edit past invigilator duties.", "error");
      return;
    }
  
    setInvigilatorData({
      PK_InvigilatorDutyId: selectedData.PK_InvigilatorDutyId,
      employeeId: selectedData.employeeId,
      invigilatorName: selectedData.invigilatorName,
      date: selectedData.date,
      shift: selectedData.shift,
      room: selectedData.room,
      duty_status: selectedData.duty_status,
      isActive: selectedData.isActive,
    });
    setInvigilatorContainerVisible(true);
    await handleGetDateView(selectedData.date);
    await handleGetRoomView(selectedData.date);
    await handleGetShiftList(selectedData.date);
  };


  <Pressable
    style={[{ width: 80 }, { alignItems: "center" }]}
    onPress={() => handleEditInvigilator(item)}
  >
    <Text style={styles.listItemEditText}>
      <Feather name="edit" size={16} color="green" />
    </Text>
  </Pressable>
  

  const handleAuthErrors = (error) => {
    switch (error.message) {
      case "Invalid credentials":
        addToast("Invalid authentication credentials", "error");
        break;
      case "Data already exists":
        addToast("This Duty already exists!", "error");
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
    duty_status:"Primary",
    isActive: 1,
    });
    setOpen(0);
    setSearchedEmployee('');
    await handleGetInigilatorDuty();
  };

  const handleDownload = () => {
    const url = global.SERVER_URL + "/invigilatorDoc/invigilator_bulkupload.xlsx";
    Linking.openURL(url);
  };

  const handleGetEmployeeSearch = async () => {
    try {
      const authToken = await checkAuthToken();
      const Parameter = {
        operation: "custom",
        tblName: "PS_SU_PSFT_COEM_VW",
        data: '',
        conditionString: '',
        checkAvailability: '',
        customQuery: `SELECT DISPLAY_NAME, EMPLID FROM PS_SU_PSFT_COEM_VW WHERE EMPLID = '${searchedEmployee}'`,
        viewType: 'HRMS_View'
      };
      const encryptedParams = encrypt(JSON.stringify(Parameter));

      const response = await view(
        encryptedParams,
        authToken
      );
  
      if (response) {
        const decryptedData = decrypt(response?.data?.receivedData);
        const DecryptedData = JSON.parse(decryptedData);
        let EmployeeData = DecryptedData?.[0]
        setInvigilatorData({ ...invigilatorData, invigilatorName: EmployeeData?.DISPLAY_NAME,employeeId:EmployeeData?.EMPLID });
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
  const parseExcelDate = (SelectedDate) => {
    return format(new Date(SelectedDate), 'yyyy-MM-dd');
    // return `${year}-${month}-${day}`;
  };

  const handleGetDateView = async (date) => {
    // let CurrentDate = new Date().toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: '2-digit'}).toUpperCase().replace(/ /g, '-');
    const Date = new Date();
    const day = Date.toLocaleDateString('en-GB', { day: '2-digit' });
    const monthIndex = Date.getMonth();
    const year = Date.toLocaleDateString('en-GB', { year: '2-digit' });
    
    // Array of month abbreviations
    const monthAbbreviations = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const month = monthAbbreviations[monthIndex];
    
    const CurrentDate = `${day}-${month}-${year}`;
    try {
      const authToken = await checkAuthToken();
      const Parameter = {
        operation: "custom",
        tblName: "PS_S_PRD_EX_TME_VW",
        data: '',
        conditionString: '',
        checkAvailability: '',
        customQuery: `SELECT DISTINCT EXAM_DT FROM PS_S_PRD_EX_TME_VW WHERE EXAM_DT >= '${CurrentDate}' ORDER BY EXAM_DT ASC`,
        viewType:'Campus_View'
      };
      const encryptedParams = encrypt(JSON.stringify(Parameter));

      const response = await view(
        encryptedParams,
        authToken
      );
 
      if (response) {
        const decryptedData = decrypt(response?.data?.receivedData);
        const DecryptedData = JSON.parse(decryptedData);
        let ExamDates = DecryptedData?.map((item) => ({label : `${parseAndFormatDate(item?.EXAM_DT)}` , value : item?.EXAM_DT}));
        // let UpdatedDate = response?.data?.receivedData?.find((item)=>item?.EXAM_DT === date) ? ExamDates : ExamDates?.push({label :`${parseAndFormatDate(date)}` , value: date }); 
        setExamDates(ExamDates);
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };

  const handleGetShiftList = async (SelectedDate) => {
    const formattedDate = SelectedDate ? new Date(SelectedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).toUpperCase().replace(/ /g, '-') : '';
     
    try {
    const authToken = await checkAuthToken();
    const Parameter = {
      operation: "custom",
    tblName: "PS_S_PRD_EX_TME_VW",
    data: "",
    conditionString: "",
    checkAvailability: "",
    customQuery:`SELECT DISTINCT EXAM_START_TIME  FROM PS_S_PRD_EX_TME_VW WHERE EXAM_DT = '${formattedDate}'` ,
 };
    const encryptedParams = encrypt(JSON.stringify(Parameter));
    const response = await view(
      encryptedParams,
    authToken
    );
    if (response) {
      const decryptedData = decrypt(response?.data?.receivedData);
        const DecryptedData = JSON.parse(decryptedData);
      let ExamDates = DecryptedData?.map((item) => ({label : convertedTime(item.EXAM_START_TIME) , value : item.EXAM_START_TIME}));
      setShiftList(ExamDates);
    }
    } catch (error) {
    handleAuthErrors(error);
    }
    };

    const onRefresh = useCallback((date) => {
      setRefreshing(true);
      handleGetInigilatorDuty(date);
    }, []);

    const clearSearchText = () => {
      setSearchText('');
    };

    const handleSearchData = async(searchText) => {
      setSearchText(searchText);
      const searchTextLower = searchText.toLowerCase();
      let FilteredData = invigilatorList?.filter((item) => 
        item?.invigilatorName.toLowerCase().includes(searchTextLower) ||  item?.employeeId.toLowerCase().includes(searchTextLower)
      );
      console.log(FilteredData);
      // setTempStudentDetails(FilteredData);
    }

  useEffect(() => {
    handleGetInigilatorDuty();
  }, [UserAccess]);
   return (
    
    <View style={styles.container}>
      {isBulkuploadInvigilater ? (<Bulkpload handleClose={() => handleClose()} renderData={   
         <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderText ,{width:220}]  }>Employee Id</Text>
                  <Text style={[styles.tableHeaderText ,{width:220}]  }>Name</Text>
                  <Text style={[styles.tableHeaderText ,{width:220}]  }>Date</Text>
                  <Text style={[styles.tableHeaderText ,{width:220}]  }>Shift</Text>
                  <Text style={[styles.tableHeaderText ,{width:220}]  }>Room</Text>
                  <Text style={[styles.tableHeaderText ,{width:220}]  }>Duty Status</Text>
                </View>} />
                ) : 
        (invigilatorContainerVisible ? (
        <View style={styles.formContainer}>
            <TextInput
            style={styles.input}
            placeholder="Search By Employee Id"
            value={searchedEmployee}
            onChangeText={(text) => setSearchedEmployee(text) }
          />
          <Pressable onPress={handleGetEmployeeSearch} style={styles.searchIcon}>
            <Text ><FontAwesome name="search" size={23} color="purple" /></Text>
          </Pressable>
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
            setValue={(callback) => {
              setInvigilatorData((prevState) => {
                const newDate = callback(prevState.date);
                handleGetRoomView(newDate);
                return { ...prevState, date: newDate };
              });
            }}
            placeholder='Select Exam Date'
            style={[styles.dropdown, styles.dropdownExam]}
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
          {/* <TextInput
            style={styles.input}
            placeholder="Room"
            value={invigilatorData.room}
            onChangeText={(text) =>
              setInvigilatorData({ ...invigilatorData, room: text })
            }
          /> */}
          <DropDownPicker
            open={open === 2}
            value={invigilatorData.room}
            items={roomList}
            setOpen={() => setOpen(open === 2 ? 0 : 2)}
            setValue={(callback) => {
              setInvigilatorData((prevState) => {
                const roomData = callback(prevState.room);
                handleGetShiftList(invigilatorData.date);
                return { ...prevState, room: roomData };
              });
            }}
            placeholder='Select Room'
            style={[styles.dropdown, styles.dropdownExam]}
            dropDownStyle={{ backgroundColor: "#fafafa"}}
            dropDownMaxHeight={150}
            dropDownDirection="TOP"
            containerStyle={styles.rolePicker}
            listItemContainerStyle={{ height: 40}} 
            listItemLabelStyle={{ fontSize: 14 }}
          />

<DropDownPicker
            open={open === 3}
            value={invigilatorData.shift}
            items={shiftList}
            setOpen={() => setOpen(open === 3 ? 0 : 3)}
            setValue={(callback) => {
              setInvigilatorData((prevState) => {
                const shiftData = callback(prevState.shift);
                return { ...prevState, shift: shiftData };
              });
            }}
            placeholder='Select Shift (Start Time)'
            style={[styles.dropdown, styles.dropdownExam]}
            dropDownStyle={{ backgroundColor: "#fafafa"}}
            dropDownMaxHeight={150}
            dropDownDirection="TOP"
            containerStyle={styles.rolePicker}
            listItemContainerStyle={{ height: 40}} 
            listItemLabelStyle={{ fontSize: 14 }}
          />
          {/* <TextInput
            style={styles.input}
            placeholder="Shift"
            value={invigilatorData.shift}
            onChangeText={(text) =>
              setInvigilatorData({ ...invigilatorData, shift: text })
            }
          /> */}
          <DropDownPicker
            open={open === 4}
            value={invigilatorData.duty_status}
            items={StatusList}
            setOpen={() => setOpen(open === 4 ? 0 : 4)} 
            setValue={(callback) => setInvigilatorData((prevState) => ({
              ...prevState,
              duty_status: callback(invigilatorData.duty_status)
            }))}
            placeholder='Select Duty'
            style={styles.dropdown}
            dropDownStyle={{ backgroundColor: "#fafafa"}}
            dropDownMaxHeight={150}
            dropDownDirection="TOP"
            containerStyle={styles.rolePicker}
            listItemContainerStyle={{ height: 40}} 
            listItemLabelStyle={{ fontSize: 14 }}
          />
          <View style={styles.buttonContainer}>
            <Pressable  style={[styles.addbtnWrap, {width:120, marginTop:10, alignItems:"center"}]} onPress={() => invigilatorData.PK_InvigilatorDutyId ? handleUpdateInvigilator() : handleAddInvigilator()}>
              <Text style={styles.addbtntext}>{invigilatorData.PK_InvigilatorDutyId ? "Update Duty" : "Add Duty"}</Text>
            </Pressable>
            <Pressable style={[styles.cancelbtn, {width:120, marginTop:10, alignItems:"center"}]} onPress={() => handleClose()}>
              <Text style={styles.cancelbtntext}>Cancel</Text>
            </Pressable>
          </View>
        </View>
   ): (
    <View>
    {/* <View style={styles.topdetails}>
           <View style={styles.searchWrap}>
           <TextInput
            style={styles.searchBox}
            placeholder="Search By Invigilator Name, System Id ..."
            onChangeText={handleSearchData}
            value={searchText}
            onIconPress={clearSearchText}
          />

          {searchText.length > 0 && (
            <Pressable onPress={clearSearchText} style={styles.crossIcon} >
              <Entypo name="circle-with-cross" size={20} alignItems="center" />
            </Pressable>
          )}
          
          </View>
          </View> */}
          <View style={styles.userListWrap}>
    <View style={{flexDirection:"row", justifyContent:"space-between",alignItems:"center"}}>
      <Text style={styles.header}>Invigilator Duties:</Text>      
      <View style={styles.addWrap}>
        {UserAccess?.create === 1 &&    
          ( <Text >         
           <View style={{flexDirection:"row",justifyContent:"space-between",}} >
           {/* <View style={styles.searchWrap}>
           <TextInput
            style={styles.searchBox}
            placeholder="Search By Invigilator Name, System Id ..."
            onChangeText={handleSearchData}
            value={searchText}
            onIconPress={clearSearchText}
          />

          {searchText.length > 0 && (
            <Pressable onPress={clearSearchText} style={styles.crossIcon} >
              <Entypo name="circle-with-cross" size={20} alignItems="center" />
            </Pressable>
          )}
          
          </View> */}
          <Pressable  style={{marginRight:20}}  onPress={() => handleDownload()}>
          <Text><FontAwesome5 title="Download Sample Data" name="download" size={20} color="purple" /></Text>
        </Pressable>
        <Pressable style={{marginRight:20}} onPress={() => setIsBulkuploadInvigilater(true)}>
            <Text title="Upload Invigilator Data"><FontAwesome name="upload" size={23} color="purple" /></Text>
          </Pressable>
          <Pressable  onPress={() => handleAddButton()}>
          <Text title="Add Invigilator Duty" style={styles.addbtntext}><FontAwesome6 name="add" size={20} color="purple" /></Text>
        </Pressable>
       
        </View>
   </Text>
)
        }
        </View>
        </View>
        <ScrollView horizontal>
        <View style={{maxHeight: tableHeight, minWidth: isMobile ? tableWidth :tableWidth}}>
          <FlatList 
            data={paginatedData}
            keyExtractor={(item) => item.PK_InvigilatorDutyId.toString()}
                ListHeaderComponent={() => (
                  <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, {width:20} ]}>Id</Text>
                    <Text style={[styles.tableHeaderText, {width:110, textAlign:"center"}]}>Employee Id</Text>
                    <Text style={[styles.tableHeaderText,{width:180, textAlign:"center"} ]}>Name</Text>
                    <Text style={[styles.tableHeaderText,{width:120, textAlign:"center"}  ]}>Room</Text>
                    <Text style={[styles.tableHeaderText,{width:120, textAlign:"center"} ]}>Date</Text>
                    <Text style={[styles.tableHeaderText,{width:120, textAlign:"center"} ]}>Shift</Text>
                    <Text style={[styles.tableHeaderText,{width:120, textAlign:"center"}  ]}>Status</Text>
                    <Text style={[styles.tableHeaderText, {width:120, display:"inline-block", textAlign:"center"}]} numberOfLines={1}>Created Date</Text>
                    <Text style={[styles.tableHeaderText, {width:120, display:"inline-block", textAlign:"center"}]} numberOfLines={1}>Updated Date</Text>
                    <Text style={[styles.tableHeaderText, {width:120, display:"inline-block", textAlign:"center"}]} numberOfLines={1}>Created By</Text>
                    <Text style={[styles.tableHeaderText, {width:120, display:"inline-block",textAlign:"center"}]} numberOfLines={1}>Updated By</Text>
                    <Text style={[styles.tableHeaderText,{width:80} ]}>Actions </Text>
                    
                  </View>
          )} renderItem={({ item,index }) => (  
            refreshing ? <ShimmerEffect/> :
           ( <View style={styles.listItem}>
              <Text style={[styles.listItemText, {width:20}]}>{index + 1}</Text>
              <Text style={[styles.listItemText, {width:120, textAlign:"center"}]}>{item.employeeId}</Text>
              <Text style={[styles.listItemText, {width:180, textAlign:"center"}]}>{item.invigilatorName}</Text>
              <Text style={[styles.listItemText, {width:120, textAlign:"center"}]}>{item.room}</Text>
              <Text style={[styles.listItemText, {width:120, textAlign:"center"}]}>{parseAndFormatDate(item.date)}</Text>
              <Text style={[styles.listItemText, {width:120, textAlign:"center"}]}>{convertedTime(item.shift)}</Text>
              <Text style={[styles.listItemText, {width:120, textAlign:"center"}]}>{item.duty_status}</Text>   
              <Text style={[styles.listItemText, {width:120, display: "inline-block", textAlign:"center" }]} numberOfLines={1}>
                      {item.created_at ? new Date(item.created_at.split('T')[0]).toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' }) : 'N/A'}
                    </Text>
                    <Text style={[styles.listItemText, { width:120, display: "inline-block",textAlign:"center" }]} numberOfLines={1}>
                    {item.updated_at ? new Date(item.updated_at.split('T')[0]).toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' }) : 'N/A'}
                    </Text>
                    <Text style={[styles.listItemText, {width:120, display: "inline-block" , textAlign:"center"}]} numberOfLines={1}>
                      {item.created_by ? item.created_by:'N/A'}
                    </Text>
                    <Text style={[styles.listItemText, {width:120, display: "inline-block",textAlign:"center" }]} numberOfLines={1}>
                      {item.updated_by ? item.updated_by:'N/A'}
                    </Text> 
              {UserAccess?.update === 1  ? <Pressable style={[{width:80}, {alignItems:"center"}]} onPress={() => handleEditInvigilator(item)}>
              <Text style={styles.listItemEditText}><Feather name="edit" size={16} color="green" /></Text>
                </Pressable> : (<Text>-</Text>)}  
            </View>)
            )}
            stickyHeaderIndices={[0]} 
            refreshing={refreshing}
            onRefresh={() => onRefresh()}    
            />
               
      </View>
      </ScrollView>
      <Pagination
                    totalItems={invigilatorList?.length}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
              />
    </View>
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
  },
  dropdownExam:{
    marginBottom: 10,
    minHeight: 45
  },
  
  searchIcon: {
    marginRight: 20,
    position: "absolute",
    top: 27,
    right: 15
  },
  searchBox: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding:10,
    marginBottom: 8,
    marginTop: 10
  },
  searchWrap:{
    padding: 10,
    width:"100%",
    position: "relative"
    // width:'auto',
  },
  topdetails:{
    flexDirection:"row",
    justifyContent:"space-between",
   },
});
  