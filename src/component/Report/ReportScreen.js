import React, { useState, useEffect,useCallback,useMemo  } from 'react';
import { View, ScrollView, StyleSheet,FlatList ,Pressable,Text,Platform } from 'react-native';
import { saveAs } from 'file-saver';
import { useToast } from "../../globalComponent/ToastContainer/ToastContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetch } from "../../AuthService/AuthService";
import { parse, format } from 'date-fns';
import { DataTable, Provider as PaperProvider, DarkTheme as PaperDarkTheme, DefaultTheme as PaperDefaultTheme  } from 'react-native-paper';
import CustomDateTimePicker from '../../globalComponent/DateTimePicker/CustomDateTimePicker';
import { Ionicons ,AntDesign} from '@expo/vector-icons'; 

let WebTable;
if (Platform.OS === 'web') {
  WebTable = require('../../globalComponent/Tables/WebTable').default;
} else {
  WebTable = DataTable; // or some other table component for mobile
}

const ReportScreen = ({userAccess,refresh}) => {
  const currentDate = new Date();
  const pastMonthDate = new Date();
  pastMonthDate.setMonth(currentDate.getMonth() - 1);

  const [startDate, setStartDate] = useState(pastMonthDate);
  const [endDate, setEndDate] = useState(currentDate);
  const [tableHead, setTableHead] = useState(['System Id', 'Roll Number', 'Name','Catalog Number','Exam Date','Exam Start Time','Room','Seat','Status','Attendance Status','School','Graduation','Stream','Copy 1','Copy 2','Copy 3','Copy 4']);
  const [tableData, setTableData] = useState([]);
  const [schoolList, setSchoolList] = useState([]);
  const [roomList, setRoomList] = useState([]);
  const [shiftList, setShiftList] = useState([]);
  const [examDates, setExamDates] = useState([]);

  const [examSelectedDate, setExamSelectedDate] = useState("");
  const { addToast } = useToast();

  useEffect(() => {
    handleGetExamDateList();
  }, [userAccess,refresh]);


  const checkAuthToken = useCallback(async () => {
    const authToken = await AsyncStorage.getItem("authToken");
    
    if (!authToken) {
      addToast("Authentication token not available", "error");
      throw new Error("Authentication token not available");
    }
    
    return authToken;
    }, [addToast]);
    
    const handleGetExamDateList = async () => {
    try {
    const authToken = await checkAuthToken();
    const response = await fetch(
    {
    operation: "custom",
    tblName: "tbl_report_master",
    data: "",
    conditionString: "",
    checkAvailability: "",
    customQuery: `SELECT DISTINCT EXAM_DT FROM tbl_report_master WHERE EXAM_DT >= '${startDate.toISOString()}' AND EXAM_DT <= '${endDate.toISOString()}'`,
    },
    authToken
    );
    
    
      if (response) {
        let ExamDateList = response?.data?.receivedData;
        setExamDates(ExamDateList || []);
        setExamSelectedDate(ExamDateList?.[0]?.EXAM_DT);
        handleGetExamRoomList(ExamDateList?.[0]?.EXAM_DT);
        handleGetExamReport(ExamDateList?.[0]?.EXAM_DT);
        handleGetSchoolList(ExamDateList?.[0]?.EXAM_DT);
        handleGetShiftList(ExamDateList?.[0]?.EXAM_DT);
      }
    } catch (error) {
      handleAuthErrors(error);
    }
    };
    
    const handleGetExamRoomList = async (date) => {
    try {
    const authToken = await checkAuthToken();
    const response = await fetch(
    {
    operation: "custom",
    tblName: "tbl_report_master",
    data: "",
    conditionString: "",
    checkAvailability: "",
    customQuery: `SELECT Distinct ROOM_NBR FROM tbl_report_master WHERE EXAM_DT = '${date}'`,
    },
    authToken
    );
    if (response) {
    let RoomList = response?.data?.receivedData?.map((item) => item.ROOM_NBR) || [];
    setRoomList(RoomList);
    }
    } catch (error) {
    handleAuthErrors(error);
    }
    };
    
    const handleGetSchoolList = async (date) => {
      try {
        const authToken = await checkAuthToken();
        const response = await fetch(
          {
            operation: "custom",
            tblName: "tbl_report_master",
            data: "",
            conditionString: "",
            checkAvailability: "",
            customQuery: `SELECT Distinct DESCR FROM tbl_report_master WHERE EXAM_DT = '${date}'`,
          },
          authToken
        );
    
        if (response) {
          let SchoolList = response?.data?.receivedData?.map((item) => item.DESCR) || [];
          setSchoolList(SchoolList);
        }
      } catch (error) {
        handleAuthErrors(error);
      }
    };
    
    const handleGetShiftList = async (date) => {
      try {
      const authToken = await checkAuthToken();
      const response = await fetch(
      {
      operation: "custom",
      tblName: "tbl_report_master",
      data: "",
      conditionString: "",
      checkAvailability: "",
      customQuery:`SELECT JSON_ARRAYAGG(room) AS ShiftData FROM ( SELECT JSON_OBJECT( 'label', EXAM_START_TIME, 'value', EXAM_START_TIME ) AS room FROM tbl_report_master WHERE EXAM_DT = '${date}' GROUP BY EXAM_START_TIME ) AS rooms` ,
    },
      authToken
      );
      if (response) {
        setShiftList(response?.data?.receivedData?.[0]?.ShiftData || []);
      }
      } catch (error) {
      handleAuthErrors(error);
      }
      };
    const handleGetExamReport = async (date) => {
    try {
    const authToken = await checkAuthToken();
    const response = await fetch(
    {
    operation: "custom",
    tblName: "tbl_report_master",
    data: "",
    conditionString:"",
    checkAvailability: "",
    customQuery: `select JSON_ARRAYAGG(json_object('PK_Report_Id',p.PK_Report_Id,'EMPLID',EMPLID,'EXAM_DT',p.EXAM_DT,'ROOM_NBR',p.ROOM_NBR,'EXAM_START_TIME',p.EXAM_START_TIME,'STRM',p.STRM,'CATALOG_NBR',p.CATALOG_NBR,'PTP_SEQ_CHAR',p.PTP_SEQ_CHAR,'NAME_FORMAL',p.NAME_FORMAL,'ADM_APPL_NBR',p.ADM_APPL_NBR,'DESCR',p.DESCR,'DESCR2',p.DESCR2,'DESCR3',p.DESCR3,'Status',p.Status,'Attendece_Status',p.Attendece_Status,'isActive',p.isActive,'copyData',( SELECT CAST( CONCAT('[', GROUP_CONCAT( JSON_OBJECT( 'PK_CopyId',q.PK_CopyId,'FK_ReportId',q.FK_ReportId,'EMPLID',q.EMPLID,'copyNumber',q.copyNumber,'alternateCopyNumber1',q.alternateCopyNumber1,'alternateCopyNumber2',q.alternateCopyNumber2,'alternateCopyNumber3',q.alternateCopyNumber3,'alternateCopyNumber4',q.alternateCopyNumber4,'alternateCopyNumber5',q.alternateCopyNumber5,'alternateCopyNumber6',q.alternateCopyNumber6,'isActive',q.isActive) ), ']') AS JSON ) FROM tbl_copy_master q WHERE q.FK_ReportId = p.PK_Report_Id ))) AS ReportMaster from tbl_report_master p where EXAM_DT = '${date}'`,

  },
    authToken
    );
    if (response) {
      setTableData(response?.data?.receivedData?.[0]?.ReportMaster || []);
    }
    } catch (error) {
    handleAuthErrors(error);
    }
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

    const parseAndFormatDate = (dateString) => {
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
    
      return parsedDate;
    };
    
    const parseExcelDate = (SelectedDate) => {
      return format(new Date(SelectedDate), 'yyyy-MM-dd');
      // return `${year}-${month}-${day}`;
    };
    const handleDateClick = (date) => {
      setExamSelectedDate(date);
      handleGetExamReport(date);
      handleGetExamRoomList(date);
      handleGetSchoolList(date);
      handleGetShiftList(date);
    }      


  const convertedTime = (StartTime) => {
    const date = new Date(StartTime);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Pad minutes with leading 0
  
    const amPm = hours >= 12 ? 'PM' : 'AM';
    const adjustedHours = hours % 12 || 12; // Convert to 12-hour format
  
    return `${adjustedHours}:${minutes}${amPm}`;
  }
  const statusList = ["Present", "Absent", "UFM"]; 
 const attendenceStatusList = ["Debarred","Eligible","Not Defined"]
  
 const WebColumns = useMemo(() => [
  {
    accessorKey: 'EMPLID',
    header: 'System Id',
    size: 150,
  },
  {
    accessorKey: 'ADM_APPL_NBR',
    header: 'Roll Number',
    size: 150,
  },
  {
    accessorKey: 'NAME_FORMAL',
    header: 'Name',
    size: 150,
  },
  {
    accessorKey: 'CATALOG_NBR',
    header: 'Catalog Number',
    size: 150,
  },
  {
    accessorKey: "EXAM_DT",
    id: "EXAM_DT",
    header: "Exam Date",
    accessorFn: (row) => row?.EXAM_DT || "-",
    Cell: ({ cell }) =>
      cell?.row?.original?.EXAM_DT
        ? new Date(cell?.row?.original?.EXAM_DT)?.toLocaleDateString("en-GB")
        : "-",
    filterFn: "lessThanOrEqualTo",
    sortingFn: "datetime",
  },
  {
    accessorKey: "EXAM_START_TIME",
    id: "EXAM_START_TIME",
    header: "Exam Shift",
    accessorFn: (row) => row?.EXAM_START_TIME || "-",
    Cell: ({ cell }) =>
      cell?.row?.original?.EXAM_START_TIME
        ? convertedTime(cell?.row?.original?.EXAM_START_TIME)
        : "-",
    filterVariant:"multi-select",
    filterSelectOptions: shiftList.map(shift => ({
      label: convertedTime(shift.label),
      value: shift.value,
    })),
  },
  {
    accessorKey: 'ROOM_NBR',
    header: 'Room No.',
    size: 150,
    filterVariant: "multi-select",
    filterSelectOptions: roomList,
  },
  {
    accessorKey: 'PTP_SEQ_CHAR',
    header: 'Seat No.',
    size: 150,
  },
  {
    accessorKey: "Status",
    header: "Status",
    accessorFn: (row) => row?.Status || "-",
    Cell: ({ cell }) => (
      <View
        style={{
          backgroundColor:
          cell?.row?.original?.Status === "Present"
          ? 'rgb(12, 181, 81)'
          : cell?.row?.original?.Status === "Absent"
          ? 'rgb(234, 66, 66)'
          : cell?.row?.original?.Status === "UFM"
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
          {cell?.row?.original?.Status || "-"}
        </Text>
      </View>
    ),
    filterVariant: "multi-select",
    filterSelectOptions: statusList
  },
  {
    accessorKey: "Attendece_Status",
    header: "Attendance Status",
    accessorFn: (row) => row?.Attendece_Status || "-",
    Cell: ({ cell }) => (
      <View
        style={{
          backgroundColor:
          cell?.row?.original?.Attendece_Status === "Eligible"
            ? 'rgb(12, 181, 81)'
            : cell?.row?.original?.Attendece_Status === "Not Defined"
            ? 'rgb(253, 191, 72)'
            : cell?.row?.original?.Attendece_Status === "rgb(234, 66, 66)"
            ? 'red'
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
          {cell?.row?.original?.Attendece_Status || "-"}
        </Text>
      </View>
    ),
    filterVariant: "multi-select",
    filterSelectOptions: attendenceStatusList
  },
  {
    accessorKey: 'DESCR',
    header: 'School',
    size: 150,
    filterVariant: "multi-select",
    filterSelectOptions: schoolList,
  },
  {
    accessorKey: 'DESCR2',
    header: 'Graduation',
    size: 150,
  },
  {
    accessorKey: 'DESCR3',
    header: 'Stream',
    size: 150,
  },
  {
    accessorFn: (row) => row?.copyData?.[0]?.copyNumber || "-",
    header: "Copy 1 Data"
  },
  {
    accessorFn: (row) => row?.copyData?.[1]?.copyNumber || "-",
    header: "Copy 2 Data"
  },
  {
    accessorFn: (row) => row?.copyData?.[2]?.copyNumber || "-",
    header: "Copy 3 Data"
  },
  {
    accessorFn: (row) => row?.copyData?.[3]?.copyNumber || "-",
    header: "Copy 4 Data"
  }
], [schoolList,roomList,shiftList]);

     // Export CSV File
     const csvOptions = {
       fieldSeparator: ',',
       quoteStrings: '"',
       decimalSeparator: '.',
       showLabels: true,
       useBom: true,
       useKeysAsHeaders: false,
       filename: `Report-${currentDate}`,
       headers: tableHead
     };
     const handleExportData = () => {
      const csvData = [
        tableHead.map(header => `"${header}"`), // Headers
        ...tableData.map(row => [
          `"${row.EMPLID || '-'}"`,
          `"${row.ADM_APPL_NBR || '-'}"`,
          `"${row.NAME_FORMAL || '-'}"`,
          `"${row.CATALOG_NBR || '-'}"`,
          `"${parseExcelDate(row.EXAM_DT) || '-'}"`,
          `"${convertedTime(row.EXAM_START_TIME) || '-'}"`,
          `"${row.ROOM_NBR || '-'}"`,
          `"${row.PTP_SEQ_CHAR || '-'}"`,
          `"${row.Status || '-'}"`,          
          `"${row.Attendece_Status || '-'}"`,
          `"${row.DESCR || '-'}"`,
          `"${row.DESCR2 || '-'}"`,
          `"${row.DESCR3 || '-'}"`,
          `"${row.copyData?.[0]?.copyNumber || '-'}"`,
          `"${row.copyData?.[1]?.copyNumber || '-'}"`,
          `"${row.copyData?.[2]?.copyNumber || '-'}"`,
          `"${row.copyData?.[3]?.copyNumber || '-'}"`
        ])
      ];
    
      const csvRows = csvData.map(row => row.join(csvOptions.fieldSeparator)).join('\n');
      const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
      const csvFile = new File([blob], `${csvOptions.filename}.csv`, { type: 'text/csv;charset=utf-8;' });
      
      saveAs(csvFile);
    };
    
    
    const handleExportRows = (rows) => {
      const csvData = [
        tableHead.map(header => `"${header}"`), // Headers
        ...rows?.map(({ original }) => [
          `"${original.EMPLID || '-'}"`,
          `"${original.ADM_APPL_NBR || '-'}"`,
          `"${original.NAME_FORMAL || '-'}"`,
          `"${original.CATALOG_NBR || '-'}"`,
          `"${parseExcelDate(original.EXAM_DT) || '-'}"`,
          `"${convertedTime(original.EXAM_START_TIME) || '-'}"`,
          `"${original.ROOM_NBR || '-'}"`,
          `"${original.PTP_SEQ_CHAR || '-'}"`,
          `"${original.Status || '-'}"`,          
          `"${original.Attendece_Status || '-'}"`,
          `"${original.DESCR || '-'}"`,
          `"${original.DESCR2 || '-'}"`,
          `"${original.DESCR3 || '-'}"`,
          `"${original.copyData?.[0]?.copyNumber || '-'}"`,
          `"${original.copyData?.[1]?.copyNumber || '-'}"`,
          `"${original.copyData?.[2]?.copyNumber || '-'}"`,
          `"${original.copyData?.[3]?.copyNumber || '-'}"`
        ])
      ];
    
      const csvRows = csvData.map(row => row.join(csvOptions.fieldSeparator)).join('\n');
      const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
      const csvFile = new File([blob], `${csvOptions.filename}.csv`, { type: 'text/csv;charset=utf-8;' });
    
      saveAs(csvFile);
    };
    
  const renderTable = () => {
    if (Platform.OS === 'web') {
      return (
        <React.Suspense fallback={<Text>Loading...</Text>}>
          <WebTable data={tableData} columns={WebColumns} 
          exportHead={tableHead} handleExportData={() => handleExportData()}
           handleExportRows={(rows)=> handleExportRows(rows)}
            handleRefreshData={()=>handleDateClick(examSelectedDate)}
            style={[styles.tablebtn,]}
           />
        </React.Suspense>
      );
    } else {
      return <Text>Unsupported Platform</Text>;
    }
  };

  return (
    <View style={styles.container}>
     <View style={styles.dropdownWrap}>
      <CustomDateTimePicker  date={startDate} handelChangeDate={setStartDate} inputStyle={styles.inputStyle} datePickerStyle={styles.datePickerStyle}   /> 
      <CustomDateTimePicker date={endDate} handelChangeDate={setEndDate} />   
      <Pressable onPress={handleGetExamDateList} style={styles.searchbtn}>
      <Text style={styles.searchtext}><AntDesign name="search1" size={20} color="white" /></Text>
      </Pressable>
    </View>
          <View style={styles.datesWrap}>
        <View style={styles.dates}>
          {examDates?.length > 0 ?  
          <FlatList
            data={examDates}
            renderItem={({ item }) => {
              const isActiveItem = item.EXAM_DT === examSelectedDate;
              const normalizedDate = parseAndFormatDate(item.EXAM_DT);
              return (
                 <Pressable onPress={() => handleDateClick(item.EXAM_DT)}>
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
            keyExtractor={(item) => item.EXAM_DT}
          /> : <Text style={styles.nodatestext}>There is no data available for the dates between {startDate.toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: '2-digit'}).toUpperCase().replace(/ /g, '-')} to {endDate.toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: '2-digit'}).toUpperCase().replace(/ /g, '-')}</Text>}
        </View>
      </View>
     
{renderTable()}
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
  searchicons:{
     padding:"10px",
     alignSelf:"center",
     flexDirection:"row",
     marginRight:"10px",
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
    inactivetext: {
    color: "#fff",
    },
    inactivebox: {
    backgroundColor: "#e50d0d",
    },
  container: { flex: 1, padding:10, },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6 },
  searchBar: { marginBottom: 10, backgroundColor:"#fff", borderWidth:1, borderColor:"#ccc"},
    dropdownWrap: {
      flexDirection: 'row',
      justifyContent: "flex-start",
      marginBottom: 24,
      zIndex:9999,
     position:"relative",
      // left:26
    },
    headerWidth:{
     flex:1
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
    headerText:{
      color:"#fff",
   
    },

    tablheader:{
      backgroundColor:"rgb(17, 65, 102)",
      border:0,
  
    },
    tabledataText:{
      color:"#000",
      textWrap:"noWrap",
  
 
    },
    pagination:{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
    },
  paginationText:{
    color:"#000",
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
  btnicon:{
    textAlign:"center",
    color:"#fff"
  },
 
  nodatestext:{
    padding:14,
    borderRadius:5,
 
  }
  
});

export default ReportScreen;
