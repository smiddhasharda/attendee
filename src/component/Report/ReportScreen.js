// import React, { useState, useEffect,useCallback,useMemo  } from 'react';
// import { View, ScrollView, StyleSheet,FlatList ,Pressable,Text,Platform } from 'react-native';
// import { saveAs } from 'file-saver';
// import { useToast } from "../../globalComponent/ToastContainer/ToastContext";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { fetch } from "../../AuthService/AuthService";
// import { parse, format } from 'date-fns';
// import { DataTable, Provider as PaperProvider, DarkTheme as PaperDarkTheme, DefaultTheme as PaperDefaultTheme  } from 'react-native-paper';
// import CustomDateTimePicker from '../../globalComponent/DateTimePicker/CustomDateTimePicker';
// import { Ionicons ,AntDesign} from '@expo/vector-icons'; 
// import { jsPDF } from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import CryptoJS from 'crypto-js';
// import ShardaLogo from '../../local-assets/shardalogo.png'

// let WebTable;
// if (Platform.OS === 'web') {
//   WebTable = require('../../globalComponent/Tables/WebTable').default;
// } else {
//   WebTable = DataTable; // or some other table component for mobile
// }

// const ReportScreen = ({userAccess}) => {
//     const [currentTab, setCurrentTab] = useState('ReportByStudents');
//   const currentDate = new Date();
//   const pastMonthDate = new Date();
//   pastMonthDate.setMonth(currentDate.getMonth() - 1);

//   const [startDate, setStartDate] = useState(pastMonthDate);
//   const [endDate, setEndDate] = useState(currentDate);
//   const tableHead  = ['System Id', 'Roll Number', 'Name','Catalog Number','Exam Date','Exam Start Time','Room','Seat','Status','Attendance Status','Exam Type','School','Graduation','Stream','Copy 1','Copy 2','Copy 3','Copy 4'];
//   const tableHeadByCatelog = ['Catalog Number','Total','Present','Absent','UFM','Debarred','Exam Date','Exam Start Time','School','Exam Type'];
//   const tableHeadByRoom = ['Room','Catalog Number','Total','Present','Absent','UFM','Debarred','Exam Date','Exam Start Time','School','Exam Type'];
//   const [tableData, setTableData] = useState([]);
//   const [tableDataByCatelog, setTableDataByCatelog] = useState([]);
//   const [tableDataByRoom, setTableDataByRoom] = useState([]); 
//   const [schoolList, setSchoolList] = useState([]);
//   const [roomList, setRoomList] = useState([]);
//   const [shiftList, setShiftList] = useState([]);
//   const [examDates, setExamDates] = useState([]);

//   const [examSelectedDate, setExamSelectedDate] = useState("");
//   const { addToast } = useToast();

//   useEffect(() => {
//     handleGetExamDateList();
//   }, [userAccess,startDate,endDate]);


//   const checkAuthToken = useCallback(async () => {
//     const authToken = atob(await AsyncStorage.getItem(btoa("authToken")));
    
//     if (!authToken) {
//       addToast("Authentication token not available", "error");
//       throw new Error("Authentication token not available");
//     }
    
//     return authToken;
//     }, [addToast]);

//     const decrypt = (encryptedData) => {
//       const encryptScreteKey = 'b305723a4d2e49a443e064a111e3e280';
//       const [iv, encrypted] = encryptedData.split(':');
//       const ivBytes = CryptoJS.enc.Hex.parse(iv);
//       const encryptedBytes = CryptoJS.enc.Hex.parse(encrypted);
//       const decrypted = CryptoJS.AES.decrypt(
//         { ciphertext: encryptedBytes },
//         CryptoJS.enc.Utf8.parse(encryptScreteKey),
//         {
//           iv: ivBytes,
//           mode: CryptoJS.mode.CBC,
//           padding: CryptoJS.pad.Pkcs7,
//         }
//       );
//       return decrypted.toString(CryptoJS.enc.Utf8);
//     };
  
//     const generateIV = () => {
//       if (Platform.OS === 'web') {
//         // For web, use CryptoJS's random generator
//         return CryptoJS.lib.WordArray.random(16);
//       } else {
//         // For React Native, use a simple random number generator
//         const arr = new Uint8Array(16);
//         for (let i = 0; i < 16; i++) {
//           arr[i] = Math.floor(Math.random() * 256);
//         }
//         return CryptoJS.lib.WordArray.create(arr);
//       }
//     };
    
//     const encrypt = (plaintext) => {
//       const encryptScreteKey = 'b305723a4d2e49a443e064a111e3e280';
//       const iv = generateIV();
//       const key = CryptoJS.enc.Utf8.parse(encryptScreteKey);
      
//       const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
//         iv: iv,
//         mode: CryptoJS.mode.CBC,
//         padding: CryptoJS.pad.Pkcs7
//       });
    
//       const encryptedBase64 = encrypted.toString();
//       const ivHex = CryptoJS.enc.Hex.stringify(iv);
    
//       return `${ivHex}:${encryptedBase64}`;
//     };
    
//     const handleGetExamDateList = async () => {
//     try {
//     const authToken = await checkAuthToken();
//     const Parameter =  {
//       operation: "custom",
//     tblName: "tbl_report_master",
//     data: "",
//     conditionString: "",
//     checkAvailability: "",
//     customQuery: `SELECT DISTINCT EXAM_DT FROM tbl_report_master WHERE EXAM_DT >= '${startDate.toISOString()}' AND EXAM_DT <= '${endDate.toISOString()}'`,
//      };
//     const encryptedParams = encrypt(JSON.stringify(Parameter));
//     const response = await fetch(
//       encryptedParams,
//     authToken
//     );
    
    
//       if (response) {
//         const decryptedData = decrypt(response?.data?.receivedData);
//         const DecryptedData = JSON.parse(decryptedData);
//         // let ExamDateList = response?.data?.receivedData;
//         setExamDates(DecryptedData || []);
//         setExamSelectedDate(DecryptedData?.[0]?.EXAM_DT);
//         handleGetExamRoomList(DecryptedData?.[0]?.EXAM_DT);
//         handleGetExamReport(DecryptedData?.[0]?.EXAM_DT);
//         handleGetExamReportByCategory(DecryptedData?.[0]?.EXAM_DT);
//         handleGetExamReportByRoom(DecryptedData?.[0]?.EXAM_DT);
//         handleGetSchoolList(DecryptedData?.[0]?.EXAM_DT);
//         handleGetShiftList(DecryptedData?.[0]?.EXAM_DT);
//       }
//     } catch (error) {
//       handleAuthErrors(error);
//     }
//     };
    
//     const handleGetExamRoomList = async (date) => {
//     try {
//     const authToken = await checkAuthToken();
//     const Parameter =  {
//       operation: "custom",
//       tblName: "tbl_report_master",
//       data: "",
//       conditionString: "",
//       checkAvailability: "",
//       customQuery: `SELECT Distinct ROOM_NBR FROM tbl_report_master WHERE EXAM_DT = '${date}'`,
//       };
//     const encryptedParams = encrypt(JSON.stringify(Parameter));
    
//     const response = await fetch(
//       encryptedParams,
//     authToken
//     );
//     if (response) {
//       const decryptedData = decrypt(response?.data?.receivedData);
//       const DecryptedData = JSON.parse(decryptedData);
//     let RoomList = DecryptedData?.map((item) => item.ROOM_NBR) || [];
//     setRoomList(RoomList);
//     }
//     } catch (error) {
//     handleAuthErrors(error);
//     }
//     };
    
//     const handleGetSchoolList = async (date) => {
//       try {
//         const authToken = await checkAuthToken();
//         const Parameter = {
//           operation: "custom",
//           tblName: "tbl_report_master",
//           data: "",
//           conditionString: "",
//           checkAvailability: "",
//           customQuery: `SELECT Distinct DESCR FROM tbl_report_master WHERE EXAM_DT = '${date}'`,
//         };
//         const encryptedParams = encrypt(JSON.stringify(Parameter));
//         const response = await fetch(
//           encryptedParams,
//           authToken
//         );
    
//         if (response) {
//           const decryptedData = decrypt(response?.data?.receivedData);
//       const DecryptedData = JSON.parse(decryptedData);
//           let SchoolList = DecryptedData?.map((item) => item.DESCR) || [];
//           setSchoolList(SchoolList);
//         }
//       } catch (error) {
//         handleAuthErrors(error);
//       }
//     };
    
//     const handleGetShiftList = async (date) => {
//       try {
//       const authToken = await checkAuthToken();
//       const Parameter = {
//         operation: "custom",
//       tblName: "tbl_report_master",
//       data: "",
//       conditionString: "",
//       checkAvailability: "",
//       customQuery:`SELECT JSON_ARRAYAGG(room) AS ShiftData FROM ( SELECT JSON_OBJECT( 'label', EXAM_START_TIME, 'value', EXAM_START_TIME ) AS room FROM tbl_report_master WHERE EXAM_DT = '${date}' GROUP BY EXAM_START_TIME ) AS rooms` ,
//     };
//       const encryptedParams = encrypt(JSON.stringify(Parameter));
//       const response = await fetch(
//         encryptedParams,
//       authToken
//       );
//       if (response) {
//         const decryptedData = decrypt(response?.data?.receivedData);
//         const DecryptedData = JSON.parse(decryptedData);  
//         setShiftList(DecryptedData?.[0]?.ShiftData || []);
//       }
//       } catch (error) {
//       handleAuthErrors(error);
//       }
//       };
//     const handleGetExamReport = async (date) => {
//     try {
//     const authToken = await checkAuthToken();
//     const Parameter =  {
//       operation: "custom",
//       tblName: "tbl_report_master",
//       data: "",
//       conditionString:"",
//       checkAvailability: "",
//       customQuery: `select JSON_ARRAYAGG(json_object('PK_Report_Id',p.PK_Report_Id,'EMPLID',EMPLID,'EXAM_DT',p.EXAM_DT,'ROOM_NBR',p.ROOM_NBR,'EXAM_START_TIME',p.EXAM_START_TIME,'STRM',p.STRM,'CATALOG_NBR',p.CATALOG_NBR,'PTP_SEQ_CHAR',p.PTP_SEQ_CHAR,'NAME_FORMAL',p.NAME_FORMAL,'ADM_APPL_NBR',p.ADM_APPL_NBR,'DESCR',p.DESCR,'DESCR2',p.DESCR2,'DESCR3',p.DESCR3,'Status',p.Status,'Attendece_Status',p.Attendece_Status,'EXAM_TYPE_CD',p.EXAM_TYPE_CD,'isActive',p.isActive,'copyData',( SELECT CAST( CONCAT('[', GROUP_CONCAT( JSON_OBJECT( 'PK_CopyId',q.PK_CopyId,'FK_ReportId',q.FK_ReportId,'EMPLID',q.EMPLID,'copyNumber',q.copyNumber,'alternateCopyNumber1',q.alternateCopyNumber1,'alternateCopyNumber2',q.alternateCopyNumber2,'alternateCopyNumber3',q.alternateCopyNumber3,'alternateCopyNumber4',q.alternateCopyNumber4,'alternateCopyNumber5',q.alternateCopyNumber5,'alternateCopyNumber6',q.alternateCopyNumber6,'isActive',q.isActive) ), ']') AS JSON ) FROM tbl_copy_master q WHERE q.FK_ReportId = p.PK_Report_Id ))) AS ReportMaster from tbl_report_master p where EXAM_DT = '${date}'`,
//     };
//     const encryptedParams = encrypt(JSON.stringify(Parameter));
//     const response = await fetch(
//       encryptedParams,
//     authToken
//     );
//     if (response) {
//       const decryptedData = decrypt(response?.data?.receivedData);
//       const DecryptedData = JSON.parse(decryptedData);  
//       setTableData(DecryptedData?.[0]?.ReportMaster || []);
//     }
//     } catch (error) {
//     handleAuthErrors(error);
//     }
//     };
//     const handleGetExamReportByCategory = async (date) => {
//         try {
//         const authToken = await checkAuthToken();
//         const Parameter =  {
//           operation: "custom",
//           tblName: "tbl_report_master",
//           data: "",
//           conditionString:"",
//           checkAvailability: "",
//           customQuery: `SELECT EXAM_DT, CATALOG_NBR, EXAM_START_TIME, EXAM_TYPE_CD,STRM, DESCR, COUNT(*) AS TotalStudents, SUM(CASE WHEN Status = 'Present' THEN 1 ELSE 0 END) AS PresentStudents, SUM(CASE WHEN Status = 'Absent' THEN 1 ELSE 0 END) AS AbsentStudents, SUM(CASE WHEN Status = 'UFM' THEN 1 ELSE 0 END) AS UFMStudents, SUM(CASE WHEN Attendece_Status = 'Debarred' THEN 1 ELSE 0 END) AS DebarredStudents FROM tbl_report_master WHERE EXAM_DT = '${date}' GROUP BY EXAM_DT, CATALOG_NBR, EXAM_START_TIME, DESCR,EXAM_TYPE_CD,STRM; `,
//        };
//         const encryptedParams = encrypt(JSON.stringify(Parameter));

//         const response = await fetch(
//           encryptedParams,
//         authToken
//         );
//         if (response) {
//           const decryptedData = decrypt(response?.data?.receivedData);
//           const DecryptedData = JSON.parse(decryptedData);      
//         setTableDataByCatelog(DecryptedData || []);
//         }
//         } catch (error) {
//         handleAuthErrors(error);
//         }
//         };
//     const handleGetExamReportByRoom = async (date) => {
//         try {
//         const authToken = await checkAuthToken();
//         const Parameter =  {
//           operation: "custom",
//           tblName: "tbl_report_master",
//           data: "",
//           conditionString:"",
//           checkAvailability: "",
//           customQuery: `SELECT ROOM_NBR,EXAM_DT, CATALOG_NBR, EXAM_START_TIME, EXAM_TYPE_CD,STRM, DESCR, COUNT(*) AS TotalStudents, SUM(CASE WHEN Status = 'Present' THEN 1 ELSE 0 END) AS PresentStudents, SUM(CASE WHEN Status = 'Absent' THEN 1 ELSE 0 END) AS AbsentStudents, SUM(CASE WHEN Status = 'UFM' THEN 1 ELSE 0 END) AS UFMStudents, SUM(CASE WHEN Attendece_Status = 'Debarred' THEN 1 ELSE 0 END) AS DebarredStudents FROM tbl_report_master WHERE EXAM_DT = '${date}' GROUP BY EXAM_DT, CATALOG_NBR, EXAM_START_TIME, DESCR,ROOM_NBR,EXAM_TYPE_CD,STRM`,
//           };
//         const encryptedParams = encrypt(JSON.stringify(Parameter));

//         const response = await fetch(
//           encryptedParams,
//         authToken
//         );
//         if (response) {const decryptedData = decrypt(response?.data?.receivedData);
//           const DecryptedData = JSON.parse(decryptedData);      
//             setTableDataByRoom(DecryptedData || []);
//         }
//         } catch (error) {
//         handleAuthErrors(error);
//         }
//         };
    
//     const handleAuthErrors = (error) => {
//     switch (error.message) {
//     case "Invalid credentials":
//     addToast("Invalid authentication credentials", "error");
//     break;
//     case "Data already exists":
//     addToast("Module with the same name already exists", "error");
//     break;
//     case "No response received from the server":
//     addToast("No response received from the server", "error");
//     break;
//     default:
//     addToast("Module Operation Failed", "error");
//     }
//     };

//     const parseAndFormatDate = (dateString) => {
//       const possibleFormats = [
//         "yyyy-MM-dd'T'HH:mm:ss.SSSX", // ISO format with milliseconds
//         "yyyy-MM-dd'T'HH:mm:ssX",     // ISO format without milliseconds
//         "yyyy-MM-dd'T'HH:mmX",        // ISO format without seconds and milliseconds
//         "dd-MMMM-yyyy",               // e.g., 03-July-2023
//         "MM/dd/yyyy",                 // e.g., 07/03/2023
//         "yyyy-MM-dd",                 // e.g., 2023-07-03
//       ];
    
//       let parsedDate;
//       for (let formatString of possibleFormats) {
//         try {
//           parsedDate = parse(dateString, formatString, new Date());
//           if (!isNaN(parsedDate)) break;
//         } catch (error) {
//           continue;
//         }
//       }
    
//       if (!parsedDate || isNaN(parsedDate)) {
//         console.error('Invalid date format:', dateString);
//         return null;
//       }
    
//       return parsedDate;
//     };
    
//     const parseExcelDate = (SelectedDate,formate) => {
//       return format(new Date(SelectedDate),( formate || 'yyyy-MM-dd'));
//       // return `${year}-${month}-${day}`;
//     };
//     const handleDateClick = (date) => {
//       setExamSelectedDate(date);
//       handleGetExamReport(date);
//       handleGetExamReportByCategory(date);
//       handleGetExamReportByRoom(date);
//       handleGetExamRoomList(date);
//       handleGetSchoolList(date);
//       handleGetShiftList(date);
//     }      


//   const convertedTime = (StartTime) => {
//     const date = new Date(StartTime);
//     const hours = date.getHours();
//     const minutes = date.getMinutes().toString().padStart(2, '0'); // Pad minutes with leading 0
  
//     const amPm = hours >= 12 ? 'PM' : 'AM';
//     const adjustedHours = hours % 12 || 12; // Convert to 12-hour format
  
//     return `${adjustedHours}:${minutes}${amPm}`;
//   }
//   const statusList = ["Present", "Absent", "UFM"]; 
//  const attendenceStatusList = ["Debarred","Eligible","Not Defined"]
  
//  const WebColumns = useMemo(() => [
//   {
//     accessorKey: 'EMPLID',
//     header: 'System Id',
//     size: 150,
//   },
//   {
//     accessorKey: 'ADM_APPL_NBR',
//     header: 'Roll Number',
//     size: 150,
//   },
//   {
//     accessorKey: 'NAME_FORMAL',
//     header: 'Name',
//     size: 150,
//   },
//   {
//     accessorKey: 'CATALOG_NBR',
//     header: 'Catalog Number',
//     size: 150,
//   },
//   {
//     accessorKey: "EXAM_DT",
//     id: "EXAM_DT",
//     header: "Exam Date",
//     accessorFn: (row) => row?.EXAM_DT || "-",
//     Cell: ({ cell }) =>
//       cell?.row?.original?.EXAM_DT
//         ? new Date(cell?.row?.original?.EXAM_DT)?.toLocaleDateString("en-GB")
//         : "-",
//     filterFn: "lessThanOrEqualTo",
//     sortingFn: "datetime",
//   },
//   {
//     accessorKey: "EXAM_START_TIME",
//     id: "EXAM_START_TIME",
//     header: "Exam Shift",
//     accessorFn: (row) => row?.EXAM_START_TIME || "-",
//     Cell: ({ cell }) =>
//       cell?.row?.original?.EXAM_START_TIME
//         ? convertedTime(cell?.row?.original?.EXAM_START_TIME)
//         : "-",
//     filterVariant:"multi-select",
//     filterSelectOptions: shiftList.map(shift => ({
//       label: convertedTime(shift.label),
//       value: shift.value,
//     })),
//   },
//   {
//     accessorKey: 'ROOM_NBR',
//     header: 'Room No.',
//     size: 150,
//     filterVariant: "multi-select",
//     filterSelectOptions: roomList,
//   },
//   {
//     accessorKey: 'PTP_SEQ_CHAR',
//     header: 'Seat No.',
//     size: 150,
//   },
//   {
//     accessorKey: "Status",
//     header: "Status",
//     accessorFn: (row) => row?.Status || "-",
//     Cell: ({ cell }) => (
//       <View
//         style={{
//           backgroundColor:
//           cell?.row?.original?.Status === "Present"
//           ? 'rgb(12, 181, 81)'
//           : cell?.row?.original?.Status === "Absent"
//           ? 'rgb(234, 66, 66)'
//           : cell?.row?.original?.Status === "UFM"
//           ? 'rgb(253, 191, 72)'
//           : 'rgb(64, 65, 66)',
//           borderRadius: 22,
//           color: "#fff",
//           minWidth: 75,
//           maxWidth: "auto",
//           paddingVertical: 2,
//           paddingHorizontal: 7.5,
//           textAlign: "center",
//           alignItems:"center"
//         }}
//       >
//         <Text style={{ color: "#fff" }}>
//           {cell?.row?.original?.Status || "-"}
//         </Text>
//       </View>
//     ),
//     filterVariant: "multi-select",
//     filterSelectOptions: statusList
//   },
//   {
//     accessorKey: "Attendece_Status",
//     header: "Attendance Status",
//     accessorFn: (row) => row?.Attendece_Status || "-",
//     Cell: ({ cell }) => (
//       <View
//         style={{
//           backgroundColor:
//           cell?.row?.original?.Attendece_Status === "Eligible"
//             ? 'rgb(12, 181, 81)'
//             : cell?.row?.original?.Attendece_Status === "Not Defined"
//             ? 'rgb(253, 191, 72)'
//             : cell?.row?.original?.Attendece_Status === "rgb(234, 66, 66)"
//             ? 'red'
//             : 'rgb(64, 65, 66)',           
//           borderRadius: 22,
//           color: "#fff",
//           minWidth: 75,
//           maxWidth: "auto",
//           paddingVertical: 2,
//           paddingHorizontal: 7.5,
//           textAlign: "center",
//           alignItems:"center"
//         }}
//       >
//         <Text style={{ color: "#fff" }}>
//           {cell?.row?.original?.Attendece_Status || "-"}
//         </Text>
//       </View>
//     ),
//     filterVariant: "multi-select",
//     filterSelectOptions: attendenceStatusList
//   },
//   {
//     accessorKey: 'EXAM_TYPE_CD',
//     header: 'Exam Type',
//     size: 150,
//   },
//   {
//     accessorKey: 'DESCR',
//     header: 'School',
//     size: 150,
//     filterVariant: "multi-select",
//     filterSelectOptions: schoolList,
//   },
//   {
//     accessorKey: 'DESCR2',
//     header: 'Graduation',
//     size: 150,
//   },
//   {
//     accessorKey: 'DESCR3',
//     header: 'Stream',
//     size: 150,
//   },
//   {
//     accessorFn: (row) => row?.copyData?.[0]?.copyNumber || "-",
//     header: "Copy 1 Data"
//   },
//   {
//     accessorFn: (row) => row?.copyData?.[1]?.copyNumber || "-",
//     header: "Copy 2 Data"
//   },
//   {
//     accessorFn: (row) => row?.copyData?.[2]?.copyNumber || "-",
//     header: "Copy 3 Data"
//   },
//   {
//     accessorFn: (row) => row?.copyData?.[3]?.copyNumber || "-",
//     header: "Copy 4 Data"
//   },
//   {
//     accessorKey: 'STRM',
//     header: 'Current Term',
//     size: 150,
//   },
// ], [schoolList,roomList,shiftList]);

// const WebColumnsByCatelog = useMemo(() => [
//     {
//       accessorKey: 'CATALOG_NBR',
//       header: 'Catalog Number',
//       size: 150,
//     },
//     {
//         accessorKey: 'TotalStudents',
//         header: 'Total Strength',
//         size: 150,
//     },
//     {
//         accessorKey: 'PresentStudents',
//         header: 'Present',
//         size: 150,
//     },
//     {
//         accessorKey: 'AbsentStudents',
//         header: 'Absent',
//         size: 150,
//     },
//     {
//         accessorKey: 'UFMStudents',
//         header: 'UFM',
//         size: 150,
//     },
//     {
//         accessorKey: 'DebarredStudents',
//         header: 'Debarred',
//         size: 150,
//     },
//     {
//       accessorKey: "EXAM_START_TIME",
//       id: "EXAM_START_TIME",
//       header: "Exam Shift",
//       accessorFn: (row) => row?.EXAM_START_TIME || "-",
//       Cell: ({ cell }) =>
//         cell?.row?.original?.EXAM_START_TIME
//           ? convertedTime(cell?.row?.original?.EXAM_START_TIME)
//           : "-",
//       filterVariant:"multi-select",
//       filterSelectOptions: shiftList.map(shift => ({
//         label: convertedTime(shift.label),
//         value: shift.value,
//       })),
//     },
//     {
//       accessorKey: 'DESCR',
//       header: 'School',
//       size: 150,
//       filterVariant: "multi-select",
//       filterSelectOptions: schoolList,
//     },
//     {
//       accessorKey: 'EXAM_TYPE_CD',
//       header: 'Exam Type',
//       size: 150,
//     },
//     {
//       accessorKey: 'STRM',
//       header: 'Current Term',
//       size: 150,
//     },
//   ], [schoolList,shiftList]);

// const WebColumnsByRoom = useMemo(() => [
// {
//     accessorKey: 'ROOM_NBR',
//     header: 'Room No.',
//     size: 150,
//     filterVariant: "multi-select",
//     filterSelectOptions: roomList,
//     },
// {
//     accessorKey: 'CATALOG_NBR',
//     header: 'Catalog Number',
//     size: 150,
// },
// {
//     accessorKey: 'TotalStudents',
//     header: 'Total Strength',
//     size: 150,
// },
// {
//     accessorKey: 'PresentStudents',
//     header: 'Present',
//     size: 150,
// },
// {
//     accessorKey: 'AbsentStudents',
//     header: 'Absent',
//     size: 150,
// },
// {
//     accessorKey: 'UFMStudents',
//     header: 'UFM',
//     size: 150,
// },
// {
//     accessorKey: 'DebarredStudents',
//     header: 'Debarred',
//     size: 150,
// },
// {
//     accessorKey: "EXAM_DT",
//     id: "EXAM_DT",
//     header: "Exam Date",
//     accessorFn: (row) => row?.EXAM_DT || "-",
//     Cell: ({ cell }) =>
//     cell?.row?.original?.EXAM_DT
//         ? new Date(cell?.row?.original?.EXAM_DT)?.toLocaleDateString("en-GB")
//         : "-",
//     filterFn: "lessThanOrEqualTo",
//     sortingFn: "datetime",
// },
// {
//     accessorKey: "EXAM_START_TIME",
//     id: "EXAM_START_TIME",
//     header: "Exam Shift",
//     accessorFn: (row) => row?.EXAM_START_TIME || "-",
//     Cell: ({ cell }) =>
//     cell?.row?.original?.EXAM_START_TIME
//         ? convertedTime(cell?.row?.original?.EXAM_START_TIME)
//         : "-",
//     filterVariant:"multi-select",
//     filterSelectOptions: shiftList.map(shift => ({
//     label: convertedTime(shift.label),
//     value: shift.value,
//     })),
// },
// {
//     accessorKey: 'DESCR',
//     header: 'School',
//     size: 150,
//     filterVariant: "multi-select",
//     filterSelectOptions: schoolList,
// },
// {
//   accessorKey: 'EXAM_TYPE_CD',
//   header: 'Exam Type',
//   size: 150,
// },
// {
//   accessorKey: 'STRM',
//   header: 'Current Term',
//   size: 150,
// },
// ], [schoolList,roomList,shiftList]);
//      // Export CSV File
//      const csvOptions = {
//        fieldSeparator: ',',
//        quoteStrings: '"',
//        decimalSeparator: '.',
//        showLabels: true,
//        useBom: true,
//        useKeysAsHeaders: false,
//        filename: `Report-${currentDate}`,
//        headers: tableHead
//      };
//      const handleExportData = () => {
//       const csvData = [
//         tableHead.map(header => `"${header}"`), // Headers
//         ...tableData.map(row => [
//           `"${row.EMPLID || '-'}"`,
//           `"${row.ADM_APPL_NBR || '-'}"`,
//           `"${row.NAME_FORMAL || '-'}"`,
//           `"${row.CATALOG_NBR || '-'}"`,
//           `"${parseExcelDate(row.EXAM_DT) || '-'}"`,
//           `"${convertedTime(row.EXAM_START_TIME) || '-'}"`,
//           `"${row.ROOM_NBR || '-'}"`,
//           `"${row.PTP_SEQ_CHAR || '-'}"`,
//           `"${row.Status || '-'}"`,          
//           `"${row.Attendece_Status || '-'}"`,
//           `"${row.EXAM_TYPE_CD || '-'}"`,
//           `"${row.DESCR || '-'}"`,
//           `"${row.DESCR2 || '-'}"`,
//           `"${row.DESCR3 || '-'}"`,
//           `"${row.copyData?.[0]?.copyNumber || '-'}"`,
//           `"${row.copyData?.[1]?.copyNumber || '-'}"`,
//           `"${row.copyData?.[2]?.copyNumber || '-'}"`,
//           `"${row.copyData?.[3]?.copyNumber || '-'}"`
//         ])
//       ];
    
//       const csvRows = csvData.map(row => row.join(csvOptions.fieldSeparator)).join('\n');
//       const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
//       const csvFile = new File([blob], `${csvOptions.filename}.csv`, { type: 'text/csv;charset=utf-8;' });
      
//       saveAs(csvFile);
//     }; 
//     const handleExportRows = (rows) => {
//       const csvData = [
//         tableHead.map(header => `"${header}"`), // Headers
//         ...rows?.map(({ original }) => [
//           `"${original.EMPLID || '-'}"`,
//           `"${original.ADM_APPL_NBR || '-'}"`,
//           `"${original.NAME_FORMAL || '-'}"`,
//           `"${original.CATALOG_NBR || '-'}"`,
//           `"${parseExcelDate(original.EXAM_DT) || '-'}"`,
//           `"${convertedTime(original.EXAM_START_TIME) || '-'}"`,
//           `"${original.ROOM_NBR || '-'}"`,
//           `"${original.PTP_SEQ_CHAR || '-'}"`,
//           `"${original.Status || '-'}"`,          
//           `"${original.Attendece_Status || '-'}"`,
//           `"${original.EXAM_TYPE_CD || '-'}"`,
//           `"${original.DESCR || '-'}"`,
//           `"${original.DESCR2 || '-'}"`,
//           `"${original.DESCR3 || '-'}"`,
//           `"${original.copyData?.[0]?.copyNumber || '-'}"`,
//           `"${original.copyData?.[1]?.copyNumber || '-'}"`,
//           `"${original.copyData?.[2]?.copyNumber || '-'}"`,
//           `"${original.copyData?.[3]?.copyNumber || '-'}"`
//         ])
//       ];
    
//       const csvRows = csvData.map(row => row.join(csvOptions.fieldSeparator)).join('\n');
//       const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
//       const csvFile = new File([blob], `${csvOptions.filename}.csv`, { type: 'text/csv;charset=utf-8;' });
    
//       saveAs(csvFile);
//     };

//     // const handleExportRowsAsPDF = (rows) => {
//     //     const doc = new jsPDF('l', 'mm', 'a4'); // 'l' for landscape
//     //     const tableData = rows?.map(({ original }) => [
//     //         `${original?.EMPLID || '-'}`,
//     //         `${original?.ADM_APPL_NBR || '-'}`,
//     //         `${original?.NAME_FORMAL || '-'}`,
//     //         `${original?.CATALOG_NBR || '-'}`,
//     //         `${parseExcelDate(original?.EXAM_DT) || '-'}`,
//     //         `${convertedTime(original?.EXAM_START_TIME) || '-'}`,
//     //         `${original?.ROOM_NBR || '-'}`,
//     //         `${original?.PTP_SEQ_CHAR || '-'}`,
//     //         `${original?.Status || '-'}`,          
//     //         `${original?.Attendece_Status || '-'}`,
//     //         `"${original?.EXAM_TYPE_CD || '-'}"`,
//     //         `${original?.DESCR || '-'}`,
//     //         `${original?.DESCR2 || '-'}`,
//     //         `${original?.DESCR3 || '-'}`,
//     //         `${original?.copyData?.[0]?.copyNumber || '-'}`,
//     //         `${original?.copyData?.[1]?.copyNumber || '-'}`,
//     //         `${original?.copyData?.[2]?.copyNumber || '-'}`,
//     //         `${original?.copyData?.[3]?.copyNumber || '-'}`
//     //     ]);
    
//     //     autoTable(doc, {
//     //         head: [tableHead],
//     //         body: tableData,
//     //         theme: 'striped',
//     //         styles: {
//     //             fontSize: 7, // Reduce font size
//     //             cellPadding: 1, // Reduce cell padding
//     //             overflow: 'linebreak'
//     //         },
//     //         headStyles: {
//     //             fillColor: [22, 160, 133],
//     //             textColor: [255, 255, 255],
//     //             fontSize: 9, // Adjust font size for header
//     //             halign: 'center'
//     //         },
//     //         bodyStyles: {
//     //             valign: 'middle',
//     //             halign: 'center'
//     //         },
//     //         alternateRowStyles: {
//     //             fillColor: [240, 240, 240]
//     //         },
//     //         columnStyles: {
//     //             0: { cellWidth: 15 },
//     //             1: { cellWidth: 15 },
//     //             2: { cellWidth: 30 },
//     //             3: { cellWidth: 15 },
//     //             4: { cellWidth: 15 },
//     //             5: { cellWidth: 15 },
//     //             6: { cellWidth: 15 },
//     //             7: { cellWidth: 15 },
//     //             8: { cellWidth: 15 },
//     //             9: { cellWidth: 15 },
//     //             10: { cellWidth: 15 },
//     //             11: { cellWidth: 15 },
//     //             12: { cellWidth: 15 },
//     //             13: { cellWidth: 15 },
//     //             14: { cellWidth: 15 },
//     //             15: { cellWidth: 15 },
//     //             16: { cellWidth: 15 }
//     //         },
//     //         margin: { top: 20, bottom: 20, left: 20, right: 20 }
//     //     });
    
//     //     doc.save(`Report-${currentDate}.pdf`);
//     // };

// const handleExportRowsAsPDF = (rows) => {
//   const doc = new jsPDF('p', 'mm', 'a4');
//   const pageWidth = doc.internal.pageSize.width;
//   const pageHeight = doc.internal.pageSize.height;
//   const margin = 10;

//   // Group rows by exam time and room number
//   const groupedByTimeAndRoom = rows.reduce((acc, row) => {
//     const time = row.original.EXAM_START_TIME || 'Unknown Time';
//     const room = row.original.ROOM_NBR || 'Unknown Room';
//     const key = `${time}$${room}`;
//     if (!acc[key]) {
//       acc[key] = [];
//     }
//     acc[key].push(row);
//     return acc;
//   }, {});

//   Object.entries(groupedByTimeAndRoom).forEach(([key, groupRows], index) => {
//     if (index !== 0) doc.addPage();

//     const [time, room] = key.split('$');

//     // Add logo
//     try {
//       doc.addImage(ShardaLogo, 'PNG', margin, margin, 40, 20);
//     } catch (error) {
//       console.warn('Failed to add logo to PDF:', error);
//     }

//     // Add header
//     doc.setFillColor(35, 57, 76);
//     doc.rect(0, 0, pageWidth, 35, 'F');
//     doc.setTextColor(255, 255, 255);
//     doc.setFontSize(24);
//     doc.text('Sharda University', pageWidth / 2, 10, { align: 'center' });
//     doc.setFontSize(18);
//     doc.text('Attendance Record', pageWidth / 2, 20, { align: 'center' });
//     doc.text(`${groupRows[0]?.original?.EXAM_TYPE_CD === "ETE" ? 'End Term' : 'Mid Term'} Examination (${groupRows[0]?.original?.STRM})`, pageWidth / 2, 30, { align: 'center' });

//     // Add exam info
//     doc.setTextColor(0);
//     doc.setFontSize(12);
//     doc.text(`Date: ${parseExcelDate(groupRows[0]?.original?.EXAM_DT, 'dd-MM-yyyy') || '-' }`, margin, 45);
//     doc.text(`Time: ${convertedTime(time)}`, pageWidth / 2, 45, { align: 'center' });
//     doc.text(`Room No: ${room}`, pageWidth - margin, 45, { align: 'right' });

//     const tableHeaders = [
//       ['Sl No.', 'Roll No.', 'Student Name', 'Seat No.', 'Course Code','Status','Attendance Status','Answer Sheet']
//     ];

//     const tableBody = groupRows.map((row, index) => [
//       index + 1,
//       row?.original?.ADM_APPL_NBR || '-',
//       row?.original?.NAME_FORMAL || '-',
//       row?.original?.PTP_SEQ_CHAR || '-',
//       row?.original?.CATALOG_NBR || '-',
//       row?.original?.Status || '-',          
//       row?.original?.Attendece_Status || '-',
//       row?.original?.copyData?.map(copy => copy.copyNumber).join(', ') || '-'
//     ]);

//     autoTable(doc, {
//       head: tableHeaders,
//       body: tableBody,
//       startY: 55,
//       theme: 'grid',
//       styles: { fontSize: 10},
//       headStyles: { fillColor: [242, 242, 242], textColor: [0, 0, 0], fontStyle: 'bold'},
//     });

//     // Add footer
//     doc.setFillColor(35,57,76);
//     doc.rect(0, pageHeight - 10, pageWidth, 20, 'F');
//     doc.setTextColor(255, 255, 255);
//     doc.setFontSize(10);
//     doc.text('© 2024 Sharda Tech Pvt. Ltd. All Rights Reserved.', pageWidth / 2, pageHeight - 4, { align: 'center' });
//   });

//   // Save the PDF
//   doc.save(`AttendanceRecord-${parseExcelDate(rows[0]?.original?.EXAM_DT,'dd-MM-yyyy')}.pdf`);
// };
    
//     const csvOptionsByCategory = {
//         fieldSeparator: ',',
//         quoteStrings: '"',
//         decimalSeparator: '.',
//         showLabels: true,
//         useBom: true,
//         useKeysAsHeaders: false,
//         filename: `ReportByCategory-${currentDate}`,
//         headers: tableHeadByCatelog
//       };
//       const handleExportDataByCatelog = () => {
//        const csvData = [
//          tableHeadByCatelog.map(header => `"${header}"`), // Headers
//          ...tableDataByCatelog.map(row => [
//            `"${row.CATALOG_NBR || '-'}"`,
//            `"${row.TotalStudents || '-'}"`,
//            `"${row.PresentStudents || '-'}"`,
//            `"${row.AbsentStudents || '-'}"`,
//            `"${row.UFMStudents || '-'}"`,
//            `"${row.DebarredStudents || '-'}"`,
//            `"${parseExcelDate(row.EXAM_DT) || '-'}"`,
//            `"${convertedTime(row.EXAM_START_TIME) || '-'}"`,
//            `"${row.DESCR || '-'}"`,
//            `"${row.EXAM_TYPE_CD || '-'}"`,
//          ])
//        ];
     
//        const csvRows = csvData.map(row => row.join(csvOptionsByCategory.fieldSeparator)).join('\n');
//        const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
//        const csvFile = new File([blob], `${csvOptionsByCategory.filename}.csv`, { type: 'text/csv;charset=utf-8;' });
       
//        saveAs(csvFile);
//      };    
//      const handleExportRowsByCatelog = (rows) => {
//        const csvData = [
//          tableHeadByCatelog.map(header => `"${header}"`), // Headers
//          ...rows?.map(({ original }) => [
//             `"${original.CATALOG_NBR || '-'}"`,
//             `"${original.TotalStudents || '-'}"`,
//             `"${original.PresentStudents || '-'}"`,
//             `"${original.AbsentStudents || '-'}"`,
//             `"${original.UFMStudents || '-'}"`,
//             `"${original.DebarredStudents || '-'}"`,
//             `"${parseExcelDate(original.EXAM_DT) || '-'}"`,
//             `"${convertedTime(original.EXAM_START_TIME) || '-'}"`,
//             `"${original.DESCR || '-'}"`,
//             `"${original.EXAM_TYPE_CD || '-'}"`,
//          ])
//        ];
     
//        const csvRows = csvData.map(row => row.join(csvOptionsByCategory.fieldSeparator)).join('\n');
//        const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
//        const csvFile = new File([blob], `${csvOptionsByCategory.filename}.csv`, { type: 'text/csv;charset=utf-8;' });
     
//        saveAs(csvFile);
//      };

//     //  const handleExportRowsAsPDFByCategory = (rows) => {
//     //     const doc = new jsPDF('l', 'mm', 'a4'); // 'l' for landscape
//     //     const tableData = rows?.map(({ original }) => [
//     //        `${original.CATALOG_NBR || '-'}`,
//     //         `${original.TotalStudents || '-'}`,
//     //         `${original.PresentStudents || '-'}`,
//     //         `${original.AbsentStudents || '-'}`,
//     //         `${original.UFMStudents || '-'}`,
//     //         `${original.DebarredStudents || '-'}`,
//     //         `${parseExcelDate(original.EXAM_DT) || '-'}`,
//     //         `${convertedTime(original.EXAM_START_TIME) || '-'}`,
//     //         `${original.DESCR || '-'}`,
//     //         `"${original.EXAM_TYPE_CD || '-'}"`,
//     //     ]);
    
//     //     autoTable(doc, {
//     //         head: [tableHeadByCatelog],
//     //         body: tableData,
//     //         theme: 'striped',
//     //         styles: {
//     //             fontSize: 7, // Reduce font size
//     //             cellPadding: 1, // Reduce cell padding
//     //             overflow: 'linebreak'
//     //         },
//     //         headStyles: {
//     //             fillColor: [22, 160, 133],
//     //             textColor: [255, 255, 255],
//     //             fontSize: 9, // Adjust font size for header
//     //             halign: 'center'
//     //         },
//     //         bodyStyles: {
//     //             valign: 'middle',
//     //             halign: 'center'
//     //         },
//     //         alternateRowStyles: {
//     //             fillColor: [240, 240, 240]
//     //         },
//     //         columnStyles: {
//     //             0: { cellWidth:  25},
//     //             1: { cellWidth: 25 },
//     //             2: { cellWidth: 25 },
//     //             3: { cellWidth: 25 },
//     //             4: { cellWidth: 25 },
//     //             5: { cellWidth: 25 },
//     //             6: { cellWidth: 25 },
//     //             7: { cellWidth: 25 },
//     //             8: { cellWidth: 60 },
//     //         },
//     //         margin: { top: 20, bottom: 20, left: 20, right: 20 }
//     //     });
    
//     //     doc.save(`ReportByCategory-${currentDate}.pdf`);
//     // };

    
// // const handleExportRowsAsPDFByCategory = (rows) => {
// //   const doc = new jsPDF('p', 'mm', 'a4');
// //   const pageWidth = doc.internal.pageSize.width;
// //   const pageHeight = doc.internal.pageSize.height;
// //   const margin = 10;

// //   // Group rows by room number
// //   const groupedByShift = rows.reduce((acc, row) => {
// //       const shift = row.original.EXAM_START_TIME || 'Unknown Time';
// //       if (!acc[shift]) {
// //           acc[shift] = [];
// //       }
// //       acc[shift].push(row);
// //       return acc;
// //   }, {});

// //   // Iterate over each room group and add each to a new page in the PDF
// //   Object.keys(groupedByShift).forEach((shift, index) => {
// //       if (index !== 0) doc.addPage(); // Add a new page for each room after the first one

// //       const shiftRows = groupedByShift[shift];

// //       // Add logo (if available)
// //       try {
// //         doc.addImage(ShardaLogo, 'PNG', margin, margin, 40, 20);      } catch (error) {
// //           console.warn('Failed to add logo to PDF:', error);
// //       }

// //       // Add header
// //       doc.setFillColor(223, 76, 6);
// //       doc.rect(0, 0, pageWidth, 50, 'F');
// //       doc.setTextColor(255, 255, 255);
// //       doc.setFontSize(24);
// //       doc.text('Sharda University', pageWidth / 2, 20, { align: 'center' });
// //       doc.setFontSize(18);
// //       doc.text('Attendance Record', pageWidth / 2, 30, { align: 'center' });
// //       doc.text(`${shiftRows?.[0]?.original?.EXAM_TYPE_CD === "ETE" ? 'End Term ': 'Mid Term'} Examination ((${shiftRows?.[0]?.original?.STRM}))`, pageWidth / 2, 40, { align: 'center' });

// //       // Add room info
// //       doc.setTextColor(0);
// //       doc.setFontSize(12);
// //       doc.text(`Date: ${parseExcelDate(shiftRows?.[0]?.original?.EXAM_DT) || '-'}`, pageWidth - margin, 60, { align: 'right' });
// //       doc.text(`Shift: ${convertedTime(shiftRows?.[0]?.original.EXAM_START_TIME) || '-'}`, pageWidth - margin, 70, { align: 'right' });

// //       // Add main table
// //       const mainTableHeaders = [
// //           [
// //               { content: 'S. No.', rowSpan: 1 },
// //               { content: 'Course Code', rowSpan: 1 },
// //               { content: 'Total', rowSpan: 1 },
// //               { content: 'Present', rowSpan: 1 },
// //               { content: 'Absent', rowSpan: 1 }
// //           ]
// //       ];

// //       const mainTableBody = shiftRows.map((row, index) => [
// //           index + 1,
// //           row.original.CATALOG_NBR || '-',
// //           row.original.TotalStudents || '-',
// //           row.original.PresentStudents || '-',
// //           row.original.AbsentStudents || '-'
// //       ]);

// //       autoTable(doc, {
// //           head: mainTableHeaders,
// //           body: mainTableBody,
// //           startY: 80,
// //           theme: 'grid',
// //           styles: { fontSize: 10, cellPadding: 2 },
// //           headStyles: { fillColor: [242, 242, 242], textColor: [0, 0, 0], fontStyle: 'bold' },
// //       });

// //       // Add footer
// //       doc.setFillColor(223, 76, 6);
// //       doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
// //       doc.setTextColor(255, 255, 255);
// //       doc.setFontSize(12);
// //       doc.text('© 2023 Sharda Tech Pvt. Ltd. All Rights Reserved.', pageWidth / 2, pageHeight - 10, { align: 'center' });
// //   });

// //   // Save the single PDF with all rooms
// //   doc.save(`AnswerSheetSummary-AllCatelog-${parseExcelDate(rows?.[0]?.original?.EXAM_DT) || '-'}.pdf`);
// // };

// const handleExportRowsAsPDFByCategory = (rows) => {
//   const doc = new jsPDF('p', 'mm', 'a4');
//   const pageWidth = doc.internal.pageSize.width;
//   const pageHeight = doc.internal.pageSize.height;
//   const margin = 10;

//   // Group rows by shift
//   const groupedByShift = rows.reduce((acc, row) => {
//     const shift = row.original.EXAM_START_TIME || 'Unknown Time';
//     if (!acc[shift]) {
//       acc[shift] = [];
//     }
//     acc[shift].push(row);
//     return acc;
//   }, {});

//   Object.entries(groupedByShift).forEach(([shift, shiftRows], index) => {
//     if (index !== 0) doc.addPage();

//     // Add logo
//     try {
//       doc.addImage(ShardaLogo, 'PNG', margin, margin, 40, 20);
//     } catch (error) {
//       console.warn('Failed to add logo to PDF:', error);
//     }

//     // Add header
//     doc.setFillColor(223, 76, 6);
//     doc.rect(0, 0, pageWidth, 50, 'F');
//     doc.setTextColor(255, 255, 255);
//     doc.setFontSize(24);
//     doc.text('Sharda University', pageWidth / 2, 20, { align: 'center' });
//     doc.setFontSize(18);
//     doc.text('Attendance Record By Catelog', pageWidth / 2, 30, { align: 'center' });
//     doc.text(`${shiftRows?.[0]?.original?.EXAM_TYPE_CD === "ETE" ? 'End Term ': 'Mid Term'} Examination (${shiftRows?.[0]?.original?.STRM})`, pageWidth / 2, 40, { align: 'center' });

//     // Add summary info
//     doc.setTextColor(0);
//     doc.setFontSize(12);
//     doc.text(`Summary Sheet, ${shiftRows[0]?.original?.STRM}`, margin, 60);
//     // doc.text(`${shiftRows?.map((row)=>row.original.DESCR).join(',')}`, margin, 70);
//     doc.text(`Date: ${parseExcelDate(shiftRows[0]?.original?.EXAM_DT)}`, pageWidth - margin, 60, { align: 'right' });
//     doc.text(`Shift- ${convertedTime(shift)}`, pageWidth - margin, 70, { align: 'right' });

//     // Add main table
//     const tableHeaders = [
//       ['S. No.', 'Course Code', 'Total', 'Present', 'Absent','UFM','Debbared']
//     ];

//     const tableBody = shiftRows.map((row, index) => [
//       index + 1,
//       row.original.CATALOG_NBR || '-',
//       row.original.TotalStudents || '-',
//       row.original.PresentStudents || '-',
//       row.original.AbsentStudents || '-',
//       row.original.UFMStudents || '-',
//       row.original.DebarredStudents || '-',
//     ]);

//     autoTable(doc, {
//       head: tableHeaders,
//       body: tableBody,
//       startY: 80,
//       theme: 'grid',
//       styles: { fontSize: 10, cellPadding: 2 },
//       headStyles: { fillColor: [242, 242, 242], textColor: [0, 0, 0], fontStyle: 'bold' },
//     });

//     // Add footer
//     doc.setFillColor(223, 76, 6);
//     doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
//     doc.setTextColor(255, 255, 255);
//     doc.setFontSize(12);
//     doc.text('© 2023 Sharda Tech Pvt. Ltd. All Rights Reserved.', pageWidth / 2, pageHeight - 10, { align: 'center' });
//   });

//   // Save the PDF
//   doc.save(`SummarySheetByCatelog-${parseExcelDate(rows[0]?.original?.EXAM_DT)}.pdf`);
// };
    
//      const csvOptionsByRoom = {
//         fieldSeparator: ',',
//         quoteStrings: '"',
//         decimalSeparator: '.',
//         showLabels: true,
//         useBom: true,
//         useKeysAsHeaders: false,
//         filename: `ReportByRoom-${currentDate}`,
//         headers: tableHeadByRoom
//       };
//       const handleExportDataByRoom = () => {
//        const csvData = [
//         tableHeadByRoom.map(header => `"${header}"`), // Headers
//          ...tableDataByRoom.map(row => [
//             `"${row.ROOM_NBR || '-'}"`,
//            `"${row.CATALOG_NBR || '-'}"`,
//            `"${row.TotalStudents || '-'}"`,
//            `"${row.PresentStudents || '-'}"`,
//            `"${row.AbsentStudents || '-'}"`,
//            `"${row.UFMStudents || '-'}"`,
//            `"${row.DebarredStudents || '-'}"`,
//            `"${parseExcelDate(row.EXAM_DT) || '-'}"`,
//            `"${convertedTime(row.EXAM_START_TIME) || '-'}"`,
//            `"${row.DESCR || '-'}"`,
//            `"${row.EXAM_TYPE_CD || '-'}"`,
//          ])
//        ];
     
//        const csvRows = csvData.map(row => row.join(csvOptionsByRoom.fieldSeparator)).join('\n');
//        const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
//        const csvFile = new File([blob], `${csvOptionsByRoom.filename}.csv`, { type: 'text/csv;charset=utf-8;' });
       
//        saveAs(csvFile);
//      };    
//      const handleExportRowsByRoom = (rows) => {
//        const csvData = [
//         tableHeadByRoom.map(header => `"${header}"`), // Headers
//          ...rows?.map(({ original }) => [
//             `"${original.ROOM_NBR || '-'}"`,
//             `"${original.CATALOG_NBR || '-'}"`,
//             `"${original.TotalStudents || '-'}"`,
//             `"${original.PresentStudents || '-'}"`,
//             `"${original.AbsentStudents || '-'}"`,
//             `"${original.UFMStudents || '-'}"`,
//             `"${original.DebarredStudents || '-'}"`,
//             `"${parseExcelDate(original.EXAM_DT) || '-'}"`,
//             `"${convertedTime(original.EXAM_START_TIME) || '-'}"`,
//             `"${original.DESCR || '-'}"`,
//             `"${original.EXAM_TYPE_CD || '-'}"`,
//          ])
//        ];
     
//        const csvRows = csvData.map(row => row.join(csvOptionsByRoom.fieldSeparator)).join('\n');
//        const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
//        const csvFile = new File([blob], `${csvOptionsByRoom.filename}.csv`, { type: 'text/csv;charset=utf-8;' });
     
//        saveAs(csvFile);
//      };

//     // Original Code

//     //  const handleExportRowsAsPDFByRoom = (rows) => {
//     //     const doc = new jsPDF('l', 'mm', 'a4'); // 'l' for landscape
//     //     const tableData = rows?.map(({ original }) => [
//     //         `${original.ROOM_NBR || '-'}`,
//     //        `${original.CATALOG_NBR || '-'}`,
//     //         `${original.TotalStudents || '-'}`,
//     //         `${original.PresentStudents || '-'}`,
//     //         `${original.AbsentStudents || '-'}`,
//     //         `${original.UFMStudents || '-'}`,
//     //         `${original.DebarredStudents || '-'}`,
//     //         `${parseExcelDate(original.EXAM_DT) || '-'}`,
//     //         `${convertedTime(original.EXAM_START_TIME) || '-'}`,
//     //         `${original.DESCR || '-'}`,
//     //         `"${original.EXAM_TYPE_CD || '-'}"`,

//     //     ]);
    
//     //     autoTable(doc, {
//     //         head: [tableHeadByRoom],
//     //         body: tableData,
//     //         theme: 'striped',
//     //         styles: {
//     //             fontSize: 7, // Reduce font size
//     //             cellPadding: 1, // Reduce cell padding
//     //             overflow: 'linebreak'
//     //         },
//     //         headStyles: {
//     //             fillColor: [22, 160, 133],
//     //             textColor: [255, 255, 255],
//     //             fontSize: 9, // Adjust font size for header
//     //             halign: 'center'
//     //         },
//     //         bodyStyles: {
//     //             valign: 'middle',
//     //             halign: 'center'
//     //         },
//     //         alternateRowStyles: {
//     //             fillColor: [240, 240, 240]
//     //         },
//     //         columnStyles: {
//     //             0: { cellWidth:  25},
//     //             1: { cellWidth: 25 },
//     //             2: { cellWidth: 25 },
//     //             3: { cellWidth: 25 },
//     //             4: { cellWidth: 25 },
//     //             5: { cellWidth: 25 },
//     //             6: { cellWidth: 25 },
//     //             7: { cellWidth: 25 },
//     //             8: { cellWidth:  25},
//     //             9: { cellWidth: 60 },
//     //         },
//     //         margin: { top: 20, bottom: 20, left: 20, right: 20 }
//     //     });
    
//     //     doc.save(`ReportByCategory-${currentDate}.pdf`);
//     // };


// // Seprate PdF code for rooms

// // const handleExportRowsAsPDFByRoom = (rows) => {
// //   // Group rows by room number
// //   const groupedByRoom = rows.reduce((acc, row) => {
// //       const roomNbr = row.original.ROOM_NBR || 'Unknown Room';
// //       if (!acc[roomNbr]) {
// //           acc[roomNbr] = [];
// //       }
// //       acc[roomNbr].push(row);
// //       return acc;
// //   }, {});

// //   // Iterate over each room group to create separate PDF files
// //   Object.keys(groupedByRoom).forEach((roomNbr) => {
// //       const roomRows = groupedByRoom[roomNbr];
// //       const doc = new jsPDF('p', 'mm', 'a4');
// //       const pageWidth = doc.internal.pageSize.width;
// //       const pageHeight = doc.internal.pageSize.height;
// //       const margin = 10;

// //       // Add logo (if available)
// //       try {
// //           doc.addImage('BASE64_ENCODED_LOGO_STRING', 'PNG', margin, margin, 40, 20);
// //       } catch (error) {
// //           console.warn('Failed to add logo to PDF:', error);
// //       }

// //       // Add header
// //       doc.setFillColor(223, 76, 6);
// //       doc.rect(0, 0, pageWidth, 40, 'F');
// //       doc.setTextColor(255, 255, 255);
// //       doc.setFontSize(20);
// //       doc.text('SHARDA UNIVERSITY', pageWidth / 2, 15, { align: 'center' });
// //       doc.setFontSize(14);
// //       doc.text('ANSWER SHEET SUMMARY REPORT', pageWidth / 2, 25, { align: 'center' });
// //       doc.text('End-Semester Examination (2023-24)', pageWidth / 2, 35, { align: 'center' });

// //       // Add room info
// //       doc.setTextColor(0);
// //       doc.setFontSize(12);
// //       doc.text(`Room No.: ${roomNbr}`, margin, 50);
// //       doc.text(`Date: ${roomRows?.[0]?.original?.EXAM_DT || '-'}`, pageWidth / 2, 50, { align: 'center' });

// //       // Add main table
// //       const mainTableHeaders = [
// //           [
// //               { content: 'Sl No', rowSpan: 2 },
// //               { content: 'Course Code', rowSpan: 2 },
// //               { content: 'Shift Time', rowSpan: 2 },
// //               { content: 'Examinees (Nos.)', colSpan: 5 }
// //           ],
// //           ['Strength', 'Appeared', 'Absent', 'UFM', 'Debarred']
// //       ];

// //       const mainTableBody = roomRows.map((row, index) => [
// //           index + 1,
// //           row.original.CATALOG_NBR || '-',
// //           convertedTime(row.original.EXAM_START_TIME) || '-',
// //           row.original.TotalStudents || '-',
// //           row.original.PresentStudents || '-',
// //           row.original.AbsentStudents || '-',
// //           row.original.UFMStudents || '-',
// //           row.original.DebarredStudents || '-'
// //       ]);

// //       autoTable(doc, {
// //           head: mainTableHeaders,
// //           body: mainTableBody,
// //           startY: 60,
// //           theme: 'grid',
// //           styles: { fontSize: 10, cellPadding: 2 },
// //           headStyles: { fillColor: [242, 242, 242], textColor: [0, 0, 0], fontStyle: 'bold' },
// //       });

// //       // Add UFM row
// //       const ufmY = doc.lastAutoTable.finalY + 5;
// //       doc.text('No of Copy used in UFM', margin, ufmY);

// //       // Add copies table
// //       const copiesTableHeaders = [
// //           ['Copies Issued for Room (Nos)', 'Used Copies (Nos)', 'Unused Copies (Nos)']
// //       ];
// //       const copiesTableBody = [
// //           ['-', '-', '-'] // Replace with actual data if available
// //       ];

// //       autoTable(doc, {
// //           head: copiesTableHeaders,
// //           body: copiesTableBody,
// //           startY: ufmY + 10,
// //           theme: 'grid',
// //           styles: { fontSize: 10, cellPadding: 2 },
// //           headStyles: { fillColor: [242, 242, 242], textColor: [0, 0, 0], fontStyle: 'bold' },
// //       });

// //       // Add footer
// //       doc.setFillColor(223, 76, 6);
// //       doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
// //       doc.setTextColor(255, 255, 255);
// //       doc.setFontSize(10);
// //       doc.text('© 2023 Sharda Tech Pvt. Ltd. All Rights Reserved.', pageWidth / 2, pageHeight - 10, { align: 'center' });

// //       // Save the PDF for the current room
// //       const examDate = roomRows?.[0]?.original?.EXAM_DT || 'Unknown Date';
// //       doc.save(`AnswerSheetSummary-${roomNbr}-${examDate}.pdf`);
// //   });
// // };

// const handleExportRowsAsPDFByRoom = (rows) => {
//     const doc = new jsPDF('p', 'mm', 'a4');
//     const pageWidth = doc.internal.pageSize.width;
//     const pageHeight = doc.internal.pageSize.height;
//     const margin = 10;

//     // Group rows by room number
//     const groupedByRoom = rows.reduce((acc, row) => {
//         const roomNbr = row.original.ROOM_NBR || 'Unknown Room';
//         if (!acc[roomNbr]) {
//             acc[roomNbr] = [];
//         }
//         acc[roomNbr].push(row);
//         return acc;
//     }, {});

//     // Iterate over each room group and add each to a new page in the PDF
//     Object.keys(groupedByRoom).forEach((roomNbr, index) => {
//         if (index !== 0) doc.addPage(); // Add a new page for each room after the first one

//         const roomRows = groupedByRoom[roomNbr];

//         // Add logo (if available)
//         try {
//             doc.addImage(ShardaLogo, 'PNG', margin, margin, 40, 20);
//           } catch (error) {
//               console.warn('Failed to add logo to PDF:', error);
//           }
  
//           // Add header
//           doc.setFillColor(223, 76, 6);
//           doc.rect(0, 0, pageWidth, 40, 'F');
//           doc.setTextColor(255, 255, 255);
//           doc.setFontSize(20);
//           doc.text('SHARDA UNIVERSITY', pageWidth / 2, 15, { align: 'center' });
//           doc.setFontSize(14);
//           doc.text('ANSWER SHEET SUMMARY REPORT', pageWidth / 2, 25, { align: 'center' });
//           doc.text(`${roomRows?.[0]?.original?.EXAM_TYPE_CD === "ETE" ? 'End Term ': 'Mid Term'} Examination (${roomRows?.[0]?.original?.STRM})`, pageWidth / 2, 35, { align: 'center' });
  
//           // Add room info
//           doc.setTextColor(0);
//           doc.setFontSize(12);
//           doc.text(`Room No.: ${roomNbr}`, margin, 50);
//           doc.text(`Date: ${parseExcelDate(roomRows?.[0]?.original?.EXAM_DT) || '-'}`, pageWidth / 2, 50, { align: 'center' });
  
//           // Add main table
//           const mainTableHeaders = [
//               [
//                   { content: 'Sl No', rowSpan: 2 },
//                   { content: 'Course Code', rowSpan: 2 },
//                   { content: 'Shift Time', rowSpan: 2 },
//                   { content: 'Examinees (Nos.)', colSpan: 5 }
//               ],
//               ['Strength', 'Appeared', 'Absent', 'UFM', 'Debarred']
//           ];
  
//           const mainTableBody = roomRows.map((row, index) => [
//               index + 1,
//               row.original.CATALOG_NBR || '-',
//               convertedTime(row.original.EXAM_START_TIME) || '-',
//               row.original.TotalStudents || '-',
//               row.original.PresentStudents || '-',
//               row.original.AbsentStudents || '-',
//               row.original.UFMStudents || '-',
//               row.original.DebarredStudents || '-'
//           ]);
  
//           autoTable(doc, {
//               head: mainTableHeaders,
//               body: mainTableBody,
//               startY: 60,
//               theme: 'grid',
//               styles: { fontSize: 10, cellPadding: 2 },
//               headStyles: { fillColor: [242, 242, 242], textColor: [0, 0, 0], fontStyle: 'bold' },
//           });
  
          
//           // Add footer
//           doc.setFillColor(223, 76, 6);
//           doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
//           doc.setTextColor(255, 255, 255);
//           doc.setFontSize(10);
//           doc.text('© 2023 Sharda Tech Pvt. Ltd. All Rights Reserved.', pageWidth / 2, pageHeight - 10, { align: 'center' });
//       });
  
//       // Save the single PDF with all rooms
//       doc.save(`AnswerSheetSummary-AllRooms-${parseExcelDate(rows?.[0]?.original?.EXAM_DT) || '-'}.pdf`);
//   };
  
  
  
  
//       const renderTable = () => {
//           if (Platform.OS === 'web') {
//             switch (currentTab) {
//               case "ReportByStudents":
//                 return (
//                   <React.Suspense fallback={<Text>Loading...</Text>}>
//                     <WebTable
//                       data={tableData}
//                       columns={WebColumns}
//                       exportHead={tableHead}
//                       handleExportData={handleExportData}
//                       handleExportRows={handleExportRows}
//                       handleRefreshData={() => handleDateClick(examSelectedDate)}
//                       handleExportRowsAsPDF={handleExportRowsAsPDF}
//                       style={styles.tablebtn}
//                     />
//                   </React.Suspense>
//                 );
//               case "ReportByCatelog":
//                 return (
//                   <React.Suspense fallback={<Text>Loading...</Text>}>
//                     <WebTable
//                       data={tableDataByCatelog}
//                       columns={WebColumnsByCatelog}
//                       exportHead={tableHeadByCatelog}
//                       handleExportData={handleExportDataByCatelog}
//                       handleExportRows={handleExportRowsByCatelog}
//                       handleRefreshData={() => handleDateClick(examSelectedDate)}
//                       handleExportRowsAsPDF={handleExportRowsAsPDFByCategory}
//                       style={styles.tablebtn}
//                     />
//                   </React.Suspense>
//                 );
//                 case "ReportByRoom":
//                   return (
//                     <React.Suspense fallback={<Text>Loading...</Text>}>
//                       <WebTable
//                         data={tableDataByRoom}
//                         columns={WebColumnsByRoom}
//                         exportHead={tableHeadByRoom}
//                         handleExportData={handleExportDataByRoom}
//                         handleExportRows={handleExportRowsByRoom}
//                         handleRefreshData={() => handleDateClick(examSelectedDate)}
//                         handleExportRowsAsPDF={handleExportRowsAsPDFByRoom}                      
//                         style={styles.tablebtn}
//                       />
//                     </React.Suspense>
//                   );
//               default:
//                 return <Text>Module Operation Failed</Text>;
//             }
//           } else {
//             return <Text>Unsupported Platform</Text>;
//           }
//         };
        
  
//     return (
//       <View style={styles.container}>
//        <View style={styles.dropdownWrap}>
//         <CustomDateTimePicker  date={startDate} handelChangeDate={setStartDate} inputStyle={styles.inputStyle} datePickerStyle={styles.datePickerStyle}   /> 
//         <CustomDateTimePicker date={endDate} handelChangeDate={setEndDate} />   
//         <Pressable onPress={handleGetExamDateList} style={styles.searchbtn}>
//         <Text style={styles.searchtext}><AntDesign name="search1" size={20} color="white" /></Text>
//         </Pressable>
//       </View>
//             <View style={styles.datesWrap}>
//           <View style={styles.dates}>
//             {examDates?.length > 0 ?  
//             <FlatList
//               data={examDates}
//               renderItem={({ item }) => {
//                 const isActiveItem = item.EXAM_DT === examSelectedDate;
//                 const normalizedDate = parseAndFormatDate(item.EXAM_DT);
//                 return (
//                    <Pressable onPress={() => handleDateClick(item.EXAM_DT)}>
//                         <View style={[styles.dateItem, isActiveItem && styles.activebox]}>
//                           <Text style={[styles.dateDay, isActiveItem && styles.activeText]}>
//                             {normalizedDate.toString().split(' ')[0]}
//                           </Text>
//                           <Text style={[styles.dateNumber, isActiveItem && styles.activeText]}>
//                             {normalizedDate.getDate()}
//                           </Text>
//                           <Text style={[styles.dateMonth, isActiveItem && styles.activeText]}>
//                             {normalizedDate.toString().split(' ')[1]}
//                           </Text>
//                         </View>
//                   </Pressable>
//                 );
//               }}
//               horizontal
//               keyExtractor={(item) => item.EXAM_DT}
//             /> : <Text style={styles.nodatestext}>There is no data available for the dates between {startDate.toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: '2-digit'}).toUpperCase().replace(/ /g, '-')} to {endDate.toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: '2-digit'}).toUpperCase().replace(/ /g, '-')}</Text>}
//           </View>
//         </View>
  
//         <View style={styles.tabContainer}>
//           <Pressable style={[styles.tabButton ,styles.tabWrap]} onPress={() => setCurrentTab('ReportByStudents')}>
//             <Text style={currentTab === 'ReportByStudents' ? styles.activeTabText : styles.tabText}>Students Report</Text>
//           </Pressable>
//           <Pressable style={[styles.tabButton,styles.tabWrap]} onPress={() => setCurrentTab('ReportByCatelog')}>
//             <Text style={currentTab === 'ReportByCatelog' ? styles.activeTabText : styles.tabText}>Catalog Report</Text>
//           </Pressable>
//           <Pressable style={[styles.tabButton,styles.tabWrap]} onPress={() => setCurrentTab('ReportByRoom')}>
//             <Text style={currentTab === 'ReportByRoom' ? styles.activeTabText : styles.tabText}>Rooms Report </Text>
//           </Pressable>
//         </View>
//         {renderTable()}
//         </View>
//     );
//   };
  
//   const styles = StyleSheet.create({
//     datesWrap:{
//       flexDirection:"row",
//       justifyContent:"space-between",
//       alignItems:"center",
//        marginBottom:15,
//     },
//     searchicons:{
//        padding:"10px",
//        alignSelf:"center",
//        flexDirection:"row",
//        marginRight:"10px",
//     },
//     dates: {
//       width:'auto',
//       backgroundColor: "#ffffff",
//       borderBottomWidth: 1,
//       borderBottomColor: "#dddedf",
//       borderTopWidth: 0,
//       marginTop: 0,
//     },
//     dateItem: {
//       padding: 10,
//       minWidth: 60,
//       alignItems: "center",
//     },
//     dateNumber: {
//       fontSize: 16,
//       fontWeight: 'bold',
//     },
//     dateDay: {
//       fontSize: 12,
//       marginBottom: 3,
//     },
//     dateMonth: {
//       fontSize: 12,
//       marginTop: 3,
//     },
//       activebox: {
//         backgroundColor: "#0cb551",
//         color: "#fff",
        
//       },
//       activeText: {
//         color: "#fff",
//       },
//       inactivetext: {
//       color: "#fff",
//       },
//       inactivebox: {
//       backgroundColor: "#e50d0d",
//       },
//     container: { flex: 1, padding:10, },
//     head: { height: 40, backgroundColor: '#f1f8ff' },
//     text: { margin: 6 },
//     searchBar: { marginBottom: 10, backgroundColor:"#fff", borderWidth:1, borderColor:"#ccc"},
//       dropdownWrap: {
//         flexDirection: 'row',
//         justifyContent: "flex-start",
//         marginBottom: 24,
//         zIndex:9999,
//        position:"relative",
//         // left:26
//       },
//       headerWidth:{
//        flex:1
//       },
  
//       dropdown:{
//         width:"100%",
//         },
//         dropdownContainer:{
//           flex:1,
//           marginRight:5,
//           zIndex:9999,
//         },
//         drawerItemLabel:{
//         },
//       table:{
//       clear:"both"
//       },
//       headerText:{
//         color:"#fff",
     
//       },
  
//       tablheader:{
//         backgroundColor:"rgb(17, 65, 102)",
//         border:0,
    
//       },
//       tabledataText:{
//         color:"#000",
//         textWrap:"noWrap",
    
   
//       },
//       pagination:{
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         paddingHorizontal: 10,
//       },
//     paginationText:{
//       color:"#000",
//     },
   
//     searchbtn:{
//       backgroundColor:"green",
//       padding:7,
//       borderRadius:6,
//       // marginRight:24,
//     },
//     searchtext:{
//       color:"#fff"
//     },
//     tablebtn:{
//       backgroundColor:"rgb(17, 65, 102)",
//       padding:10,
//       borderRadius:8,
//       flexDirection:"row",
//       justifyContent:"center",
//       alignItems:"center"
   
//     },
//     btnicon:{
//       textAlign:"center",
//       color:"#fff"
//     },
   
  
//     nodatestext:{
//       padding:14,
//       borderRadius:5,
//     },
//     tabContainer: {
//       flexDirection: 'row',
//       // justifyContent: 'space-around',
//       backgroundColor: '#f8f8f8',
//       padding: 10,
//     },
//     tabButton: {
//       // flex: 1,
//       // alignItems: 'center',
//       padding: 10,
    
      
//     },
  
   
//     tabText: {
//       fontSize: 16,
//       color: '#000',
//       fontWeight:"600",
//       backgroundColor:'#ccc',
//       padding:10,
//       borderRadius:5,
     
//     },
//     activeTabText: {
//       fontSize: 16,
//       color: '#fff',
//       fontWeight: '600',
//       backgroundColor:"green",
//       borderRadius:5,
//       padding:10,
//     },
//     itemContainer: {
//       padding: 10,
//       borderBottomWidth: 1,
//       borderBottomColor: '#ccc',
//     },
//     itemText: {
//       fontSize: 16,
//     },
//   });
  
//   export default ReportScreen;
  