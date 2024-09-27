import React, { useState, useEffect,useCallback,useMemo  } from 'react';
import { View, Text, StyleSheet, ScrollView,FlatList,Pressable,TextInput,Linking,Platform } from 'react-native';
import { saveAs } from 'file-saver';
import { useToast } from "../../globalComponent/ToastContainer/ToastContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { parse, format,parseISO } from 'date-fns';
import { DataTable, Provider as PaperProvider, DarkTheme as PaperDarkTheme, DefaultTheme as PaperDefaultTheme  } from 'react-native-paper';
import CustomDateTimePicker from '../../globalComponent/DateTimePicker/CustomDateTimePicker';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Feather,FontAwesome5,FontAwesome ,FontAwesome6,Entypo,AntDesign,Ionicons} from "@expo/vector-icons";
import Bulkpload from '../../globalComponent/Bulkupload/BulkUpload';
import DropDownPicker from "react-native-dropdown-picker";
import { insert, update, fetch,view } from "../../AuthService/AuthService";
import { formatInTimeZone } from 'date-fns-tz';


let WebTable;
if (Platform.OS === 'web') {
  WebTable = require('../../globalComponent/Tables/WebTable').default;
} else {
  WebTable = DataTable; // or some other table component for mobile
}

const InvigilatorScreen = ({userAccess,userData}) => {
  const [refreshing, setRefreshing] = useState(false);
  const UserAccess = userAccess?.module?.find( (item) => item?.FK_ModuleId === 8 );
  const currentDate = new Date();
  const pastMonthDate = new Date();
  pastMonthDate.setMonth(currentDate.getMonth() - 1);

  const [startDate, setStartDate] = useState(pastMonthDate);
  const [endDate, setEndDate] = useState(currentDate);
  const tableHead  = ['Employee Id','Name','Exam Date','Exam Shift','Room','Status','Created Date','Created By','Updated Date','Updated By'];
  const [roomList, setRoomList] = useState([]);
  const [filterRoomList, setFilterRoomList] = useState([]);
  const [shiftList, setShiftList] = useState([]);
  const [filterShiftList, setFilterShiftList] = useState([]);

  const [examDates, setExamDates] = useState([]);
  const [invigilatorList, setInvigilatorList] = useState([]);
  const [invigilatorDateList, setInvigilatorDateList] = useState([]);


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
  const StatusList = [{label: "primary" ,value :"primary" },{label:"secondary",value :"secondary"}];

  const [invigilatorDutySelectedDate, setInvigilatorDutySelectedDate] = useState("");
  const { addToast } = useToast();

  const checkAuthToken = useCallback(async () => {
    const authToken = atob(await AsyncStorage.getItem(btoa("authToken")));
    
    if (!authToken) {
      addToast("Authentication token not available", "error");
      throw new Error("Authentication token not available");
    }
    
    return authToken;
    }, [addToast]);
  

    const parseAndFormatDate = (dateString,dateFormat) => {
      const possibleFormats = [
        "yyyy-MM-dd'T'HH:mm:ss.SSSX", // ISO format with milliseconds
        "yyyy-MM-dd'T'HH:mm:ssX",     // ISO format without milliseconds
        "yyyy-MM-dd'T'HH:mmX",        // ISO format without seconds and milliseconds
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
      if(dateFormat){
        const formattedDate = format(parsedDate,dateFormat);
        return formattedDate;
      }
      return parsedDate;
    };
    
    const parseExcelDate = (SelectedDate,formate) => {
      return format(new Date(SelectedDate),( formate || 'yyyy-MM-dd'));
      // return `${year}-${month}-${day}`;
    };
    const handleDateClick = async(date) => {
      setLoading(true);
      setInvigilatorDutySelectedDate(date);
      await handleGetInigilatorDuty(date);
    }      


  // const convertedTime = (StartTime) => {
  //   const date = new Date(StartTime);
  //   const hours = date.getHours();
  //   const minutes = date.getMinutes().toString().padStart(2, '0'); // Pad minutes with leading 0
  
  //   const amPm = hours >= 12 ? 'PM' : 'AM';
  //   const adjustedHours = hours % 12 || 12; // Convert to 12-hour format
  
  //   return `${adjustedHours}:${minutes}${amPm}`;
  // }


     // Export CSV File
     const csvOptions = {
       fieldSeparator: ',',
       quoteStrings: '"',
       decimalSeparator: '.',
       showLabels: true,
       useBom: true,
       useKeysAsHeaders: false,
       filename: `Invigilator-Duties-${currentDate}`,
       headers: tableHead
     };
     const handleExportData = () => {
      const csvData = [
        tableHead.map(header => `"${header}"`), // Headers
        ...invigilatorList.map(row => [
          `"${row.employeeId || '-'}"`,
          `"${row.invigilatorName || '-'}"`,
          `"${parseExcelDate(row.date) || '-'}"`,
          `"${convertedTime(row.shift) || '-'}"`,
          `"${row.room || '-'}"`,
          `"${row.duty_status || '-'}"`,          
          `"${parseExcelDate(row.created_at) || '-'}"`,
          `"${row.created_by || '-'}"`,
          `"${parseExcelDate(row.updated_at) || '-'}"`,
          `"${row.updated_by || '-'}"`
        ])
      ];
    
      const csvRows = csvData.map(row => row.join(csvOptions.fieldSeparator)).join('\n');
      const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
      const csvFile = new File([blob], `${csvOptions.filename}.csv`, { type: 'text/csv;charset=utf-8;' });
      
      saveAs(csvFile);
    }; 
    const handleExportRows = (rows) => {
      const csvData = [
        tableHead.map(header => `"${header}"`), 
        ...rows?.map(({ original }) => [
          `"${original.employeeId || '-'}"`,
          `"${original.invigilatorName || '-'}"`,
          `"${parseExcelDate(original.date) || '-'}"`,
          `"${convertedTime(original.shift) || '-'}"`,
          `"${original.room || '-'}"`,
          `"${original.duty_status || '-'}"`,          
          `"${parseExcelDate(original.created_at) || '-'}"`,
          `"${original.created_by || '-'}"`,
          `"${parseExcelDate(original.updated_at) || '-'}"`,
          `"${original.updated_by || '-'}"`
        ])
      ];
    
      const csvRows = csvData.map(row => row.join(csvOptions.fieldSeparator)).join('\n');
      const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
      const csvFile = new File([blob], `${csvOptions.filename}.csv`, { type: 'text/csv;charset=utf-8;' });
    
      saveAs(csvFile);
    };


// const getAcademicYear = (strm) => {
//   const strmString = String(strm);
//   const yearCode = parseInt(strmString.substring(0, 2));
//   const startYear = 2000 + yearCode;
//   const endYear = startYear + 1;
//   return `${startYear} - ${endYear}`;
// };

// const handleExportRowsAsPDF = (rows) => {
//   const doc = new jsPDF('p', 'mm', 'a4');
//   const pageWidth = doc.internal.pageSize.width;
//   const pageHeight = doc.internal.pageSize.height;
//   const margin = 10;

//   const headerColor = [242, 242, 242];
//   const headerTextColor = [0, 0, 0];
//   const footerColor = [242, 242, 242];
//   const footerTextColor = [0, 0, 0];

//   const drawHeader = (roomNbr, shift, examType, strm, examDate) => {
//     doc.setFillColor(...headerColor);
//     doc.rect(0, 0, pageWidth, 33, 'F');

//     try {
//       doc.addImage(ShardaLogoBase64, 'PNG', margin, margin, 60, 15);
//     } catch (error) {
//       console.warn('Failed to add logo to PDF:', error);
//     }

//     doc.setTextColor(...headerTextColor);
//     doc.setFontSize(18);
//     doc.text('Sharda University, Greater Noida', pageWidth / 1.5 , 10, { align: 'center' });
//     // doc.setFontSize(14);
//     // doc.text('Greater Noida', pageWidth / 1.5, 20, { align: 'center' });
//     doc.setFontSize(14);
//     doc.text('Attendance Record', pageWidth / 1.5, 20, { align: 'center' });
//     doc.text(`${examType} Examination (${getAcademicYear(strm)})`, pageWidth / 1.5 , 28, { align: 'center' });

//     doc.setTextColor(0);
//     doc.setFontSize(12);
//     doc.text(`Date: ${examDate || '-'}`, margin, 43);
//   };

//   const drawFooter = () => {
//     doc.setFillColor(...footerColor);
//     doc.rect(0, pageHeight - 10, pageWidth, 20, 'F');
//     doc.setTextColor(...footerTextColor);
//     doc.setFontSize(10);
//     doc.text('© 2024 Sharda Tech Pvt. Ltd. All Rights Reserved.', pageWidth / 2, pageHeight - 4, { align: 'center' });
//   };


//   Object.entries(groupedByTimeAndRoom).forEach(([key, groupRows], index) => {
//     if (index !== 0) doc.addPage();

//     // Collect all invigilator names (assuming created_by, updated_by, and possibly others)
//     const invigilators = new Set();
//     groupRows.forEach(row => {
//       if (row.original.created_by) invigilators.add(row.original.created_by);
//       // if (row.original.updated_by) invigilators.add(row.original.updated_by);
//       // Add any other relevant fields that might contain invigilator names here
//     });

//     // Convert Set to Array to iterate and display
//     const invigilatorNames = Array.from(invigilators);

//     const [shift,roomNbr] = key.split('$');
//     const examType = groupRows[0]?.original?.EXAM_TYPE_CD === "ETE" ? 'End Semester' : 'Mid Semester';
//     const strm = groupRows[0]?.original?.STRM;
//     const examDate = parseExcelDate(groupRows[0]?.original?.EXAM_DT, 'dd-MM-yyyy');

//     drawHeader(roomNbr, shift, examType, strm, examDate);

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
//       startY: 50,
//       theme: 'grid',
//       styles: { fontSize: 10},
//       headStyles: { fillColor: [242, 242, 242], textColor: [0, 0, 0], fontStyle: 'bold'},
//     });

//     drawSignatures(invigilatorNames);
//     drawFooter();
//   });

//   doc.save(`AttendanceRecord-${parseExcelDate(rows[0]?.original?.EXAM_DT,'dd-MM-yyyy')}.pdf`);
// };      
  



//  ---------------------------------------------------------------------------------------------------------------------------
const [loading, setLoading] = useState(false);

const statusList = ["primary", "secondary"]; 
  
const WebColumns = useMemo(() => [
 {
   accessorKey: 'employeeId',
   header: 'Employee Id',
   size: 150,
 },
 {
   accessorKey: 'invigilatorName',
   header: 'Name',
   size: 150,
 },
 {
   accessorKey: "date",
   id: "date",
   header: "Exam Date",
   accessorFn: (row) => row?.date || "-",
   Cell: ({ cell }) =>
     cell?.row?.original?.date
       ? new Date(cell?.row?.original?.date)?.toLocaleDateString("en-GB")
       : "-",
   filterFn: "lessThanOrEqualTo",
   sortingFn: "datetime",
 },
 {
   accessorKey: "shift",
   id: "shift",
   header: "Exam Shift",
   accessorFn: (row) => row?.shift || "-",
   Cell: ({ cell }) =>
     cell?.row?.original?.shift
       ? convertedTime(cell?.row?.original?.shift)
       : "-",
   filterVariant:"multi-select",
   filterSelectOptions: filterShiftList,
 },
 {
   accessorKey: 'room',
   header: 'Room No.',
   size: 150,
   filterVariant: "multi-select",
   filterSelectOptions: filterRoomList,
 },
 {
   accessorKey: "duty_status",
   header: "Status",
   accessorFn: (row) => row?.duty_status || "-",
   Cell: ({ cell }) => (
     <View
       style={{
         backgroundColor:
         cell?.row?.original?.duty_status === "primary"
         ? 'rgb(12, 181, 81)'
         : cell?.row?.original?.duty_status === "secondary"
         ? 'rgb(253, 191, 72)'
         : 'rgb(64, 65, 66)',
         borderRadius: 22,
         color: "#fff",
         minWidth: 75,
         maxWidth: "auto",
         paddingVertical: 2,
         paddingHorizontal: 7.5,
         textAlign: "center",
         alignItems:"center"
       }}
     >
       <Text style={{ color: "#fff" }}>
         {cell?.row?.original?.duty_status || "-"}
       </Text>
     </View>
   ),
   filterVariant: "multi-select",
   filterSelectOptions: statusList
 },
 {
   accessorKey: "created_at",
   id: "created_at",
   header: "Created Date",
   accessorFn: (row) => row?.created_at || "-",
   Cell: ({ cell }) =>
     cell?.row?.original?.date
       ? new Date(cell?.row?.original?.created_at)?.toLocaleDateString("en-GB")
       : "-",
   filterFn: "lessThanOrEqualTo",
   sortingFn: "datetime",
 },
 {
   accessorKey: 'created_by',
   header: 'Created By',
   size: 150,
 },
 {
   accessorKey: "updated_at",
   id: "updated_at",
   header: "Updated Date",
   accessorFn: (row) => row?.updated_at || "-",
   Cell: ({ cell }) =>
     cell?.row?.original?.date
       ? new Date(cell?.row?.original?.updated_at)?.toLocaleDateString("en-GB")
       : "-",
   filterFn: "lessThanOrEqualTo",
   sortingFn: "datetime",
 },
 {
   accessorKey: 'updated_by',
   header: 'Updated By',
   size: 150,
 },
 
], [filterRoomList,filterShiftList]);

const renderTable = () => {
  if (Platform.OS === 'web') {
        return (
          <React.Suspense fallback={<Text>Loading...</Text>}>
            <WebTable
              data={invigilatorList}
              columns={WebColumns}
              exportHead={tableHead}
              handleExportData={handleExportData}
              handleExportRows={handleExportRows}
              handleRefreshData={() => handleDateClick(invigilatorDutySelectedDate)}
              // handleExportRowsAsPDF={handleExportRowsAsPDF}
              style={styles.tablebtn}
              loading={loading}
              action={UserAccess?.update === 1  ? true : false }
              renderAction={({ row, table }) => (
                <View sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
                <Pressable style={[{width:80}, {alignItems:"center"}]} onPress={() => handleEditInvigilator(row.original)}>
                <Text style={styles.listItemEditText}><Feather name="edit" size={16} color="green" /></Text>
                  </Pressable>
                </View>
              )
              }
            />
          </React.Suspense>);

  } else {
    return <Text>Unsupported Platform</Text>;
  }
};

const handleGetRoomView = async (SelectedDate) => {
  try {
    const authToken = await checkAuthToken();
    let formattedDate;
    if(SelectedDate){
      const date = new Date(SelectedDate);
  const day = date.toLocaleDateString('en-GB', { day: '2-digit' });
  const monthIndex = date.getMonth();
  const year = date.toLocaleDateString('en-GB', { year: '2-digit' });
  
  // Array of month abbreviations
  const monthAbbreviations = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const month = monthAbbreviations[monthIndex];
  
  formattedDate = `${day}-${month}-${year}`;
    }
    else{
      formattedDate = ''
    }
    // const formattedDate = SelectedDate ? new Date(SelectedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).toUpperCase().replace(/ /g, '-') : '';
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

    const response = await view(
      Parameter,
      authToken
    );

    if (response) {
      let RoomData = response?.map((item) => ({label : item?.ROOM_NBR , value : item?.ROOM_NBR }));
      setRoomList(RoomData);
    }
  } catch (error) {
    handleAuthErrors(error);
  }
};

const convertedTime = (StartTime) => {
  const date = new Date(StartTime);
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0'); // Pad minutes with leading 0

  const amPm = hours >= 12 ? 'PM' : 'AM';
  const adjustedHours = hours % 12 || 12; // Convert to 12-hour format

  return `${adjustedHours}:${minutes}${amPm}`;
}
const handleGetInigilatorDuty = async (selectedData) => {
  try {
    const authToken = await checkAuthToken();
    const Parameter = {
      operation: "custom",
      tblName: "tbl_invigilator_duty",
      data: "",
      conditionString: "",
      checkAvailability: "",
      customQuery: `SELECT * FROM tbl_invigilator_duty WHERE date = '${parseExcelDate(selectedData || invigilatorDutySelectedDate)}' order by PK_InvigilatorDutyId Desc`,
    };
    const response = await fetch(
      Parameter,
      authToken
    );

    if (response) {
      setInvigilatorList(response);
      let RoomList = [...new Set(response?.map((item) => item.room))] || [];
      setFilterRoomList(RoomList);
      let uniqueShifts = [...new Set(response?.map((item) => item.shift))];
      let ExamDates = uniqueShifts.map((shift) => ({
        label: shift?.length > 0 ? convertedTime(shift) : shift,
        value: shift,
      }));
      setFilterShiftList(ExamDates);
      setRefreshing(false);
      setLoading(false);
    }
  } catch (error) {
    setRefreshing(false);
    setLoading(false);
    handleAuthErrors(error);
  }
};

const handleGetInigilatorDutyDate = async () => {
  try {
    setLoading(true);
    const authToken = await checkAuthToken();
    const Parameter = {
      operation: "custom",
      tblName: "tbl_invigilator_duty",
      data: "",
      conditionString: "",
      checkAvailability: "",
      customQuery: `SELECT Distinct date FROM tbl_invigilator_duty WHERE date >= '${startDate.toISOString()}' AND date <= '${endDate.toISOString()}' order by date`,
    };
    const response = await fetch(
      Parameter,
      authToken
    );

    if (response?.length > 0) {
      setInvigilatorDateList(response);
      setInvigilatorDutySelectedDate(response?.[0]?.date);
      await handleGetInigilatorDuty(response?.[0]?.date);
      setRefreshing(false);
    }
    else{
      setInvigilatorDateList([]);
      setInvigilatorDutySelectedDate("");
      setInvigilatorList([]);
      setRefreshing(false);
      setLoading(false);

    }
  } catch (error) {
    setRefreshing(false);
    handleAuthErrors(error);
  }
};
const handleAddInvigilator = async () => {
  try {
    if(!invigilatorData?.employeeId || !invigilatorData?.invigilatorName){
    return addToast("Please set employee id first","error");
    }
    else if(!invigilatorData?.date ){
      return addToast("Please select exam date","error");
      }
    else if(invigilatorData?.room.replace(/\s+/g, '') === "" ){
      return addToast("Please enter room detials","error");
      }
    else if(invigilatorData?.shift.replace(/\s+/g, '') === "" ){
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
      duty_status:invigilatorData.duty_status,
      created_by:`${userData?.name} (${userData?.username})`
    },
      conditionString: `employeeId = '${invigilatorData.employeeId}' AND date = '${parseExcelDate(invigilatorData.date)}' AND shift = '${invigilatorData.shift}'`,
      checkAvailability: true,
      customQuery: "",
    };
    const response = await insert(
      Parameter,
      authToken
    );

    if (response) {
      addToast("Invigilator duty is added successfully!", "success");
      await handleClose();
    }
  } catch (error) {
    handleAuthErrors(error);
  }
};

// const convertedTime = (startTime) => {    
//   const date = parseISO(startTime); // Parse the input ISO date string
//   const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; // Get the current timezone
//   const zonedDate = formatInTimeZone(date, timeZone ,'h:mm a' ); // Convert the date to the local timezone
//   return zonedDate;
// };

const resetTime = (date) => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0); // Set time to midnight
  return newDate;
};
const handleEditInvigilator = async (selectedData) => {
  const selectedDate = resetTime(parseISO(selectedData.date));
  const currentDate = resetTime(new Date());

  if (selectedDate<currentDate) {
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

const handleAddButton = async() =>{
  setInvigilatorContainerVisible(true);
  await handleGetDateView();
}
const handleUpdateInvigilator = async () => {
  try {
    if(!invigilatorData?.employeeId || !invigilatorData?.invigilatorName){
      return addToast("Please set employee id first","error");
      }
      else if(!invigilatorData?.date ){
        return addToast("Please select exam date","error");
        }
      else if(invigilatorData?.room.replace(/\s+/g, '') === "" ){
        return addToast("Please enter room detials","error");
        }
      else if(invigilatorData?.shift.replace(/\s+/g, '') === "" ){
        return addToast("Please enter shift details","error");
        }
    const authToken = await checkAuthToken();
    const Parameter ={
      operation: "update",
      tblName: "tbl_invigilator_duty",
      data: {
        employeeId: invigilatorData.employeeId,
        invigilatorName: invigilatorData.invigilatorName,
        date:parseExcelDate(invigilatorData.date),
        shift:invigilatorData.shift,
        room:invigilatorData.room,
        duty_status:invigilatorData.duty_status,
        updated_by:`${userData?.name} (${userData?.username})`
      },
      conditionString: `PK_InvigilatorDutyId = ${invigilatorData.PK_InvigilatorDutyId}`,
      checkAvailability: "",
      customQuery: "",
    };
    const response = await update(
      Parameter,
      authToken
    );

    if (response) {
      addToast("Invigilator duty is updated successfully!", "success");
      await handleClose();
    }
  } catch (error) {
    handleAuthErrors(error);
  }
};
const handleAuthErrors = (error) => {
  setLoading(false);
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
    setOpen(0);
    setSearchedEmployee('');
    setLoading(true);
    await handleGetInigilatorDutyDate();
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

      const response = await view(
        Parameter,
        authToken
      );
      if (response?.length > 0) {
        let EmployeeData = response?.[0]
        setInvigilatorData({ ...invigilatorData, invigilatorName: EmployeeData?.DISPLAY_NAME,employeeId:EmployeeData?.EMPLID });
      }
      else{
        addToast('Please Search Correct Employee Id','error');
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };

  const handleGetDateView = async () => {
    // let CurrentDate = new Date().toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: '2-digit'}).toUpperCase().replace(/ /g, '-');
    const date = new Date();
    const day = date.toLocaleDateString('en-GB', { day: '2-digit' });
    const monthIndex = date.getMonth();
    const year = date.toLocaleDateString('en-GB', { year: '2-digit' });
    
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

      const response = await view(
        Parameter,
        authToken
      );
 
      if (response) {
        let ExamDates = response?.map((item) => ({label : `${parseAndFormatDate(item?.EXAM_DT,'dd-MMMM-yyyy')}` , value : item?.EXAM_DT}));
        setExamDates(ExamDates);
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };

  const handleGetShiftList = async (SelectedDate) => {
    const date = new Date(SelectedDate);
    let formattedDate
    if(SelectedDate){
      const day = date.toLocaleDateString('en-GB', { day: '2-digit' });
      const monthIndex = date.getMonth();
      const year = date.toLocaleDateString('en-GB', { year: '2-digit' });
      
      // Array of month abbreviations
      const monthAbbreviations = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const month = monthAbbreviations[monthIndex];
      
    formattedDate = `${day}-${month}-${year}`;
    }
    else{
    formattedDate = '';
    }

    // const formattedDate = SelectedDate ? new Date(SelectedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).toUpperCase().replace(/ /g, '-') : '';
     
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
    const response = await view(
    Parameter,
    authToken
    );
    if (response) {
      let ExamDates = response?.map((item) => ({label : convertedTime(item.EXAM_START_TIME) , value : item.EXAM_START_TIME}));
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

useEffect(() => {
  handleGetInigilatorDutyDate();
}, [userAccess,startDate,endDate]);

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
            disabled
          />
          <TextInput
            style={styles.input}
            placeholder="Employee Name"
            value={invigilatorData.invigilatorName}
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
 <View style={styles.dropdownWrap}>
        <CustomDateTimePicker  date={startDate} handelChangeDate={setStartDate} inputStyle={styles.inputStyle} datePickerStyle={styles.datePickerStyle}   /> 
        <CustomDateTimePicker date={endDate} handelChangeDate={setEndDate} />   
        <Pressable onPress={handleGetInigilatorDutyDate} style={styles.searchbtn}>
        <Text style={styles.searchtext}><AntDesign name="search1" size={20} color="white" /></Text>
        </Pressable>
      </View>
      {/* <View style={{flexDirection:"row", justifyContent:"space-between",alignItems:"center", backgroundColor:"#fff", marginBottom:20 ,borderRadius:10}}>
      <Text style={styles.header}>Invigilator Duties:</Text>      
      <View style={styles.addWrap}>
        {UserAccess?.create === 1 &&    
          ( <Text >         
           <View style={{flexDirection:"row",justifyContent:"space-between",}} >
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
        </View> */}
            <View style={styles.datesWrap}>
          <View style={[styles.dates ,{maxWidth:"90%"}]}>
            {invigilatorDateList?.length > 0 ?  
            <FlatList
              data={invigilatorDateList}
              renderItem={({ item }) => {
                const isActiveItem = item.date === invigilatorDutySelectedDate;
                const normalizedDate = parseAndFormatDate(item.date);
                return (
                   <Pressable onPress={() => handleDateClick(item.date)}>
                        <View style={[styles.dateItem, isActiveItem && styles.activebox]}>
                          <Text style={[styles.dateDay, isActiveItem && styles.activeText]}>
                            {normalizedDate.toString().split(' ')[0]}
                          </Text>
                          <Text style={[styles.dateNumber, isActiveItem && styles.activeText]}>
                            {normalizedDate.getDate()}
                          </Text>
                          <Text style={[styles.dateMonth, isActiveItem && styles.activeText]}>
                            {normalizedDate.toString().split(' ')[1]}
                          </Text>
                        </View>
                  </Pressable>
                );
              }}
              horizontal
              keyExtractor={(item) => item.date}
            /> : <Text style={styles.nodatestext}>There is no data available for the dates between {startDate.toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: '2-digit'}).toUpperCase().replace(/ /g, '-')} to {endDate.toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: '2-digit'}).toUpperCase().replace(/ /g, '-')}</Text>}
          </View>
          <View style={[styles.addWrap,{maxWidth:"10%",}]}>
        {UserAccess?.create === 1 &&    
          ( <Text >         
           <View style={{flexDirection:"row",justifyContent:"space-between",}} >
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

        {renderTable()}
      </View>
   ))
    }
        </View>
    );
  };
  
  const styles = StyleSheet.create({
    datesWrap:{
      flexDirection:"row",
      justifyContent:"space-between",
      alignItems:"center",
       marginBottom:15,
    },
    dates: {
      width:'auto',
      backgroundColor: "#ffffff",
      borderBottomWidth: 1,
      borderBottomColor: "#dddedf",
      borderTopWidth: 0,
      marginTop: 0,
    },
    dateItem: {
      padding: 10,
      minWidth: 60,
      alignItems: "center",
    },
    dateNumber: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    dateDay: {
      fontSize: 12,
      marginBottom: 3,
    },
    dateMonth: {
      fontSize: 12,
      marginTop: 3,
    },
      activebox: {
        backgroundColor: "#0cb551",
        color: "#fff",
        
      },
      activeText: {
        color: "#fff",
      },
    container: { flex: 1, padding:10, },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    text: { margin: 6 },
     dropdownWrap: {
        flexDirection: 'row',
        justifyContent: "flex-start",
        marginBottom: 24,
        zIndex:9999,
       position:"relative",
        // left:26
      },
  
      dropdown:{
        width:"100%",
        },
        dropdownContainer:{
          flex:1,
          marginRight:5,
          zIndex:9999,
        },
        drawerItemLabel:{
        },
      table:{
      clear:"both"
      },
   
    searchbtn:{
      backgroundColor:"green",
      padding:7,
      borderRadius:6,
      // marginRight:24,
    },
    searchtext:{
      color:"#fff"
    },
    tablebtn:{
      backgroundColor:"rgb(17, 65, 102)",
      padding:10,
      borderRadius:8,
      flexDirection:"row",
      justifyContent:"center",
      alignItems:"center"
   
    },
    nodatestext:{
      padding:14,
      borderRadius:5,
    },

    // ---------------------------------------\\

    formContainer: {
      marginBottom: 20,
      backgroundColor:"#fff",
      padding:20,
      elevation:2,
    
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
    listItemEditText: {
      color: 'white',
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
  });
  
  export default InvigilatorScreen;
  