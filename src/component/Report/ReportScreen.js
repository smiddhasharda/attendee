import React, { useState, useEffect,useCallback,useMemo  } from 'react';
import { View, ScrollView, StyleSheet, Alert,FlatList ,Pressable,Text, Tooltip,Platform } from 'react-native';
// import { Table, Row, Rows } from 'react-native-table-component';
import { Searchbar, Button } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import { saveAs } from 'file-saver';
// import Pagination from '../../globalComponent/Pagination/PaginationComponent';
import { useToast } from "../../globalComponent/ToastContainer/ToastContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetch, view } from "../../AuthService/AuthService";
import { parse, format } from 'date-fns';
import DropDownPicker from "react-native-dropdown-picker";
import { DataTable, Provider as PaperProvider, DarkTheme as PaperDarkTheme, DefaultTheme as PaperDefaultTheme  } from 'react-native-paper';
import { DarkTheme } from '@react-navigation/native';
import CustomDateTimePicker from '../../globalComponent/DateTimePicker/CustomDateTimePicker';


let WebTable;
if (Platform.OS === 'web') {
  WebTable = require('../../globalComponent/Tables/WebTable').default;
} else {
  WebTable = DataTable; // or some other table component for mobile
}
// const WebTable = require('../../globalComponent/Tables/WebTable')?.default;
// const WebTable = lazy(() => import('../../globalComponent/Tables/WebTable'));
// const AndroidTable = React.lazy(() => import('material-react-table'));
// const IOSTable = React.lazy(() => import('material-react-table'));

const ReportScreen = ({userAccess}) => {
  // let CurrentDate = new Date().toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: '2-digit'}).toUpperCase().replace(/ /g, '-');  const currentDate = new Date();
  const currentDate = new Date();
  const pastMonthDate = new Date();
  pastMonthDate.setMonth(currentDate.getMonth() - 1);

  const [startDate, setStartDate] = useState(pastMonthDate);
  const [endDate, setEndDate] = useState(currentDate);
  const [tableHead, setTableHead] = useState(['System Id', 'Roll Number', 'Name','Copy','Room','Seat','Status','School','Graduation','Stream','Catelog Number','Exam Date','Exam Time']);
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [schoolList, setSchoolList] = useState([]);
  const [schoolFilter, setSchoolFilter] = useState('');
  const [roomList, setRoomList] = useState([]);
  const [roomFilter, setRoomFilter] = useState('');
  const [shiftList, setShiftList] = useState([]);
  const [shiftFilter, setShiftFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [examDates, setExamDates] = useState([]);
  // const [startDate, setStartDate] = useState(CurrentDate?.setMonth(CurrentDate?.getMonth() - 1) || '');
  // const [endDate,setEndDate] =useState(CurrentDate || ''); 

  const [examSelectedDate, setExamSelectedDate] = useState("");
  const [open, setOpen] = useState(false);
  const pageSize = 10;
  const { addToast } = useToast();

  useEffect(() => {
    handleGetExamDateList();
  }, []);

  useEffect(() => {
    filterData();
  }, [searchQuery, schoolFilter, shiftFilter,roomFilter]);

  const filterData = () => {
    let data = tableData;
    if (roomFilter) {
      data = data.filter(item => item.ROOM_NBR === roomFilter);
    }
    if (schoolFilter) {
      data = data.filter(item => item.DESCR === schoolFilter);
    }
    if (shiftFilter) {
      data = data.filter(item => item.EXAM_START_TIME === shiftFilter);
    }
    if (searchQuery) {
      data = data.filter(item =>
        Object.values(item).some(field => field && field.toString().toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    setFilteredData(data);
    // setCurrentPage(1); // Reset to first page after filtering
  };

  const exportToCSV = () => {
    const csvData = [tableHead, ...filteredData];
    const csvString = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'report.csv');
  };
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
    customQuery:`SELECT JSON_ARRAYAGG(room) AS ReportData FROM ( SELECT JSON_OBJECT( 'label', ROOM_NBR, 'value', ROOM_NBR, 'shifts', JSON_ARRAYAGG( JSON_OBJECT('label', EXAM_START_TIME, 'value', EXAM_START_TIME) ) ) AS room FROM tbl_report_master WHERE EXAM_DT = '${date}' GROUP BY ROOM_NBR,EXAM_START_TIME ) AS rooms` ,
    },
    authToken
    );
    if (response) {
    // setExamRoomList(response?.data?.receivedData?.[0]?.ReportData);
    // setExamSelectedRoom(response?.data?.receivedData?.[0]?.ReportData?.[0]);
    // setExamShiftList(response?.data?.receivedData?.[0]?.ReportData?.[0]?.shifts);
    // setExamSelectedShift(response?.data?.receivedData?.[0]?.ReportData?.[0]?.shifts?.[0]);
    setRoomList(response?.data?.receivedData?.[0]?.ReportData);
    // handleGetExamReport(
    // date,
    // response?.data?.receivedData?.[0]?.ReportData?.[0]?.label,
    // response?.data?.receivedData?.[0]?.ReportData?.[0]?.shifts?.[0]?.label
    // );
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
      customQuery:`SELECT JSON_ARRAYAGG(room) AS SchoolData FROM ( SELECT JSON_OBJECT( 'label', DESCR, 'value', DESCR ) AS room FROM tbl_report_master WHERE EXAM_DT = '${date}' GROUP BY DESCR ) AS rooms` ,
      },
      authToken
      );
      if (response) {
      setSchoolList(response?.data?.receivedData?.[0]?.SchoolData);
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
      setShiftList(response?.data?.receivedData?.[0]?.ShiftData);
      }
      } catch (error) {
      handleAuthErrors(error);
      }
      };
    const handleGetExamReport = async (date, room, shift) => {
    try {
    const authToken = await checkAuthToken();
    const response = await fetch(
    {
    operation: "custom",
    tblName: "tbl_report_master",
    data: "",
    conditionString:"",
    checkAvailability: "",
    // customQuery: `select JSON_ARRAYAGG(json_object('PK_Report_Id',p.PK_Report_Id,'EMPLID',EMPLID,'EXAM_DT',p.EXAM_DT,'ROOM_NBR',p.ROOM_NBR,'EXAM_START_TIME',p.EXAM_START_TIME,'STRM',p.STRM,'CATALOG_NBR',p.CATALOG_NBR,'PTP_SEQ_CHAR',p.PTP_SEQ_CHAR,'NAME_FORMAL',p.NAME_FORMAL,'ADM_APPL_NBR',p.ADM_APPL_NBR,'DESCR',p.DESCR,'DESCR2',p.DESCR2,'DESCR3',p.DESCR3,'Status',p.Status,'isActive',p.isActive,'copyData',( SELECT CAST( CONCAT('[', GROUP_CONCAT( JSON_OBJECT( 'PK_CopyId',q.PK_CopyId,'FK_ReportId',q.FK_ReportId,'EMPLID',q.EMPLID,'copyNumber',q.copyNumber,'alternateCopyNumber1',q.alternateCopyNumber1,'alternateCopyNumber2',q.alternateCopyNumber2,'alternateCopyNumber3',q.alternateCopyNumber3,'alternateCopyNumber4',q.alternateCopyNumber4,'alternateCopyNumber5',q.alternateCopyNumber5,'alternateCopyNumber6',q.alternateCopyNumber6,'isActive',q.isActive) ), ']') AS JSON ) FROM tbl_copy_master q WHERE q.FK_ReportId = p.PK_Report_Id ))) AS ReportMaster from tbl_report_master p where EXAM_DT = '${date}' AND ROOM_NBR = '${room}' AND EXAM_START_TIME = '${shift}'`,
    customQuery: `select JSON_ARRAYAGG(json_object('PK_Report_Id',p.PK_Report_Id,'EMPLID',EMPLID,'EXAM_DT',p.EXAM_DT,'ROOM_NBR',p.ROOM_NBR,'EXAM_START_TIME',p.EXAM_START_TIME,'STRM',p.STRM,'CATALOG_NBR',p.CATALOG_NBR,'PTP_SEQ_CHAR',p.PTP_SEQ_CHAR,'NAME_FORMAL',p.NAME_FORMAL,'ADM_APPL_NBR',p.ADM_APPL_NBR,'DESCR',p.DESCR,'DESCR2',p.DESCR2,'DESCR3',p.DESCR3,'Status',p.Status,'Attendece_Status',p.Attendece_Status,'isActive',p.isActive,'copyData',( SELECT CAST( CONCAT('[', GROUP_CONCAT( JSON_OBJECT( 'PK_CopyId',q.PK_CopyId,'FK_ReportId',q.FK_ReportId,'EMPLID',q.EMPLID,'copyNumber',q.copyNumber,'alternateCopyNumber1',q.alternateCopyNumber1,'alternateCopyNumber2',q.alternateCopyNumber2,'alternateCopyNumber3',q.alternateCopyNumber3,'alternateCopyNumber4',q.alternateCopyNumber4,'alternateCopyNumber5',q.alternateCopyNumber5,'alternateCopyNumber6',q.alternateCopyNumber6,'isActive',q.isActive) ), ']') AS JSON ) FROM tbl_copy_master q WHERE q.FK_ReportId = p.PK_Report_Id ))) AS ReportMaster from tbl_report_master p where EXAM_DT = '${date}'`,

  },
    authToken
    );
    if (response) {
      // let ReportData = response?.data?.receivedData?.[0]?.ReportMaster || [];
      // if(ReportData){
      // let SetupData =  ReportData.map(item => [ item.EMPLID, item.ADM_APPL_NBR, item.NAME_FORMAL,item.copyData?.map((item, index) => `Copy Number ${index + 1}: ${item.copyNumber}`).join(', '), item.ROOM_NBR, item.PTP_SEQ_CHAR, item.Status,item.DESCR, item.DESCR2, item.DESCR3, item.CATALOG_NBR,  item.EXAM_DT, item.EXAM_START_TIME ])
      // setTableData(SetupData);
      // setFilteredData(SetupData);
      // }
      // else{
      //   setTableData([]);
      //   setFilteredData([]);
      // }
      
      setFilteredData(response?.data?.receivedData?.[0]?.ReportMaster || []);
      setTableData(response?.data?.receivedData?.[0]?.ReportMaster || []);
    }
    } catch (error) {
    console.log(error);
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
    
    const handleDateClick = (date) => {
      setExamSelectedDate(date);
      handleGetExamReport(date);
      handleGetExamRoomList(date);
      handleGetSchoolList(date);
      handleGetShiftList(date);
    }      

  // const filteredDataPaginated = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const [page, setPage] = useState(0);
  const [numberOfItemsPerPageList] = useState([10,20,30,40,50,60,70,80,90,100]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0]
  );

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, filteredData.length);

  const renderCell = (text) => (
    <Tooltip popover={<Text>{text}</Text>} backgroundColor="rgba(0,0,0,0.8)">
      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.tabledataText}>
        {text}
      </Text>
    </Tooltip>
  );

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
    size: 200,
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
  },
  {
    accessorKey: 'ROOM_NBR',
    header: 'Room',
    size: 150,
  },
  {
    accessorKey: 'PTP_SEQ_CHAR',
    header: 'Seat',
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
          ? 'green'
          : cell?.row?.original?.Status === "Absent"
          ? 'yellow'
          : cell?.row?.original?.Status === "UFM"
          ? 'red'
          : 'blue',
          borderRadius: 22,
          color: "#fff",
          minWidth: 75,
          maxWidth: "auto",
          paddingVertical: 2,
          paddingHorizontal: 7.5,
          textAlign: "center",
        }}
      >
        <Text style={{ color: "#fff" }}>
          {cell?.row?.original?.Status || "-"}
        </Text>
      </View>
    ),
    filterVariant: "select",
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
            ? 'green'
            : cell?.row?.original?.Attendece_Status === "Not Defined"
            ? 'yellow'
            : cell?.row?.original?.Attendece_Status === "Debarred"
            ? 'red'
            : 'blue',           
          borderRadius: 22,
          color: "#fff",
          minWidth: 75,
          maxWidth: "auto",
          paddingVertical: 2,
          paddingHorizontal: 7.5,
          textAlign: "center",
        }}
      >
        <Text style={{ color: "#fff" }}>
          {cell?.row?.original?.Attendece_Status || "-"}
        </Text>
      </View>
    ),
    filterVariant: "select",
    filterSelectOptions: attendenceStatusList
  },
  {
    accessorKey: 'DESCR',
    header: 'School',
    size: 150,
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
    // Uncomment if you need the date filter
    // Filter: ({ column }) => (
    //   <LocalizationProvider dateAdapter={AdapterDayjs}>
    //     <DatePicker
    //       onChange={(newValue) => {
    //         column?.setFilterValue(newValue);
    //       }}
    //       slotProps={{
    //         textField: {
    //           helperText: 'Filter Mode: Less Than',
    //           sx: { minWidth: '120px' },
    //           variant: 'standard',
    //         },
    //       }}
    //       value={column?.getFilterValue()}
    //     />
    //   </LocalizationProvider>
    // ),
  },
  {
    accessorKey: "EXAM_START_TIME",
    id: "EXAM_START_TIME",
    header: "Exam Start Time / Shift",
    accessorFn: (row) => row?.EXAM_START_TIME || "-",
    Cell: ({ cell }) =>
      cell?.row?.original?.EXAM_START_TIME
        ? convertedTime(cell?.row?.original?.EXAM_START_TIME)
        : "-",
  },
], []);

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
      const headers = Object.keys(tableHead).map((key) => tableHead[key]);
      const csvData = [headers,...tableData.map((row) => [
        row.EMPLID || '-', 
        row.ADM_APPL_NBR || '-', 
        row.NAME_FORMAL || '-', 
        row.ROOM_NBR || '-', 
        row.PTP_SEQ_CHAR || '-', 
        row.Status || '-', 
        row.Attendece_Status || '-', 
        row.DESCR || '-', 
        row.DESCR2 || '-', 
        row.DESCR3 || '-', 
        row.CATALOG_NBR || '-', 
        row.EXAM_DT || '-', 
        row.EXAM_START_TIME || '-', 
      ])];
    
      const csvRows = csvData.map((row, index) => {
        if (index === 0) { // header row
          return row.map((cell) => `"${cell}"`).join(csvOptions.fieldSeparator);
        } else {
          return row.map((cell) => `"${cell}"`).join(csvOptions.fieldSeparator);
        }
      });
    
      const csvString = csvRows.join('\n');
    
      const blob = new Blob([csvString], { type: 'application/vnd.ms-excel' });
      const csvFile = new File([blob], `${csvOptions.filename}.xls`, {
        lastModified: new Date().getTime(),
      });
    
      saveAs(csvFile);
    };
    
    const handleExportRows = (rows) => {
      const headers = Object.keys(rows[0].original).map((key) => rows[0].original[key]);
      const csvData = [headers,...rows.map(({ original }) => [
        original.EMPLID || '-', 
        original.ADM_APPL_NBR || '-', 
        original.NAME_FORMAL || '-', 
        original.ROOM_NBR || '-', 
        original.PTP_SEQ_CHAR || '-', 
        original.Status || '-', 
        original.Attendece_Status || '-', 
        original.DESCR || '-', 
        original.DESCR2 || '-', 
        original.DESCR3 || '-', 
        original.CATALOG_NBR || '-', 
        original.EXAM_DT || '-', 
        original.EXAM_START_TIME || '-', 
      ])];
    
      const csvRows = csvData.map((row, index) => {
        if (index === 0) { // header row
          return row.map((cell) => `"${cell}"`).join(csvOptions.fieldSeparator);
        } else {
          return row.map((cell) => `"${cell}"`).join(csvOptions.fieldSeparator);
        }
      });
    
      const csvString = csvRows.join('\n');
    
      const blob = new Blob([csvString], { type: 'application/vnd.ms-excel' });
      const csvFile = new File([blob], `${csvOptions.filename}.xls`, {
        lastModified: new Date().getTime(),
      });
    
      saveAs(csvFile);
    };
  const renderTable = () => {
    if (Platform.OS === 'web') {
      return (
        <React.Suspense fallback={<Text>Loading...</Text>}>
          <WebTable data={tableData} columns={WebColumns} exportHead={tableHead} handleExportData={() => handleExportData()} handleExportRows={(rows)=> handleExportRows(rows)}/>
        </React.Suspense>
      );
    } 
    else if (Platform.OS === 'android') {
      return (
        <View>
          <Searchbar
        placeholder="Search"
        onChangeText={query => setSearchQuery(query)}
        value={searchQuery}
        style={styles.searchBar}
      />
      <View>
      <View style={styles.dropdownWrap}>
                        <DropDownPicker
                        open={open}
                        value=""
                        items={schoolList}
                        setOpen={setOpen}
                        setValue=""               
                        style={styles.dropdown}
                        dropDownStyle={{ backgroundColor: "#fafafa"}}
                        // dropDownContainerStyle={styles.dropdownContainer} 
                        dropDownMaxHeight={150}
                        // containerStyle={{  width: 200,  }}
                        dropDownDirection="Bottom"
                        containerStyle={styles.dropdownContainer}
                        listItemContainerStyle={{ height: 30}} 
                        listItemLabelStyle={{ fontSize: 14 }}
                        zIndex={1000}
                                  /> 
                        <DropDownPicker
                          open={open}
                          value=""
                          items={roomList}
                          setOpen={setOpen}
                          setValue=""
                          style={[styles.dropdown, { backgroundColor:"#fff" }]}
                          labelStyle={{
                            color: "white"
                          }}
                          dropDownStyle={{ backgroundColor: "#fafafa" }}
                          dropDownContainerStyle={styles.dropdownContainer}
                          dropDownMaxHeight={150}
                          dropDownDirection="BOTTOM"
                          containerStyle={styles.dropdownContainer}
                          listItemContainerStyle={{ height: 30 }}
                          listItemLabelStyle={{ fontSize: 14 }}
                          zIndex={1000}
                         /> 
                        <DropDownPicker
                          open={open}
                          value=""
                          items={schoolList}
                          setOpen={setOpen}
                          setValue=""
                          containerStyle={styles.dropdownContainer}
                          style={[styles.dropdown, { backgroundColor:"#fff" }]}
                          labelStyle={{
                            color: "white"
                          }}
                          dropDownStyle={{ backgroundColor: "#fafafa" }}
                          dropDownContainerStyle={styles.dropdownContainer}
                          dropDownMaxHeight={150}
                          dropDownDirection="BOTTOM"
                          listItemContainerStyle={{ height: 30 }}
                          listItemLabelStyle={{ fontSize: 14 }}
                        /> 
                        
                </View>


          {/* <RNPickerSelect
            onValueChange={(value) => setSchoolFilter(value)}
            items={schoolList}
            placeholder={{ label: 'Select School', value: '' }}
            // style={pickerSelectStyles}   
            style={{
          inputIOS: pickerSelectStyles.inputIOS,
          inputAndroid: pickerSelectStyles.inputAndroid,
          inputWeb: pickerSelectStyles.inputWeb,
          chevron: pickerSelectStyles.chevron,
          placeholder: pickerSelectStyles.placeholder,
          viewContainer: pickerSelectStyles.viewContainer,
          modalViewBottom: pickerSelectStyles.modalViewBottom,
        }}
          />
          <RNPickerSelect
            onValueChange={(value) => setRoomFilter(value)}
            items={roomList}
            placeholder={{ label: 'Select Room', value: '' }}
            style={pickerSelectStyles}
          />
          <RNPickerSelect
            onValueChange={(value) => setShiftFilter(value)}
            items={shiftList}
            placeholder={{ label: 'Select Shift', value: '' }}
            style={pickerSelectStyles}
          /> */}
      </View>
      <View style={styles.tableWrap}>
          <ScrollView horizontal={true}>
                <DataTable style={styles.table}>
                <DataTable.Header style={styles.tablheader}>
                  <DataTable.Title textStyle={[styles.headerText,styles.headerWidth]} >System Id</DataTable.Title>
                  <DataTable.Title textStyle={[styles.headerText,styles.headerWidth]}>Roll Number</DataTable.Title>
                  <DataTable.Title textStyle={[styles.headerText,styles.headerWidth]}>Name</DataTable.Title>
                  <DataTable.Title textStyle={[styles.headerText,styles.headerWidth]}>Copy</DataTable.Title>
                  <DataTable.Title textStyle={[styles.headerText,styles.headerWidth]}>Room</DataTable.Title>
                  <DataTable.Title textStyle={[styles.headerText,styles.headerWidth]}>Seat</DataTable.Title>
                  <DataTable.Title textStyle={[styles.headerText,styles.headerWidth]}>Status</DataTable.Title>
                  <DataTable.Title textStyle={[styles.headerText,styles.headerWidth]}>Attendece Status</DataTable.Title>                  
                  <DataTable.Title textStyle={[styles.headerText,styles.headerWidth]}>School</DataTable.Title>
                  <DataTable.Title textStyle={[styles.headerText,styles.headerWidth]}>Graduation</DataTable.Title>
                  <DataTable.Title textStyle={[styles.headerText,styles.headerWidth]}>Stream</DataTable.Title>
                  <DataTable.Title textStyle={[styles.headerText,styles.headerWidth]}>Catelog Number</DataTable.Title>
                  <DataTable.Title textStyle={[styles.headerText,styles.headerWidth]}>Exam Date</DataTable.Title>
                  <DataTable.Title textStyle={[styles.headerText,styles.headerWidth]}>Exam Time</DataTable.Title>
                </DataTable.Header>

                {filteredData.slice(from, to).map((item) => (
                  <DataTable.Row style={{color:"#000"}}    key={item.EMPLID}>
                  <DataTable.Cell   textStyle={[styles.tabledataText, {flex:1.5}]}>{item.EMPLID}</DataTable.Cell>
                    <DataTable.Cell textStyle={styles.tabledataText}>{item.ADM_APPL_NBR}</DataTable.Cell>
                    <DataTable.Cell textStyle={styles.tabledataText}>{item.NAME_FORMAL}</DataTable.Cell>
                    <DataTable.Cell textStyle={styles.tabledataText}>{item.copyData?.map((item, index) => `Copy Number ${index + 1}: ${item.copyNumber}`).join(', ')}</DataTable.Cell>
                    <DataTable.Cell textStyle={styles.tabledataText}>{item.ROOM_NBR}</DataTable.Cell>
                    <DataTable.Cell textStyle={styles.tabledataText}>{item.PTP_SEQ_CHAR}</DataTable.Cell>
                    <DataTable.Cell  textStyle={styles.tabledataText}>{item.Status}</DataTable.Cell>
                    <DataTable.Cell  textStyle={styles.tabledataText}>{item.Attendece_Status}</DataTable.Cell>
                    <DataTable.Cell textStyle={styles.tabledataText}>{item.DESCR}</DataTable.Cell>
                    <DataTable.Cell textStyle={styles.tabledataText}>{item.DESCR2}</DataTable.Cell>
                    <DataTable.Cell textStyle={styles.tabledataText} >{item.DESCR3}</DataTable.Cell>          
                    <DataTable.Cell textStyle={styles.tabledataText}>{item.CATALOG_NBR}</DataTable.Cell>
                    <DataTable.Cell textStyle={styles.tabledataText}>{item.EXAM_DT}</DataTable.Cell>
                    <DataTable.Cell textStyle={styles.tabledataText}>{item.EXAM_START_TIME}</DataTable.Cell>
                  </DataTable.Row>
                ))}
                </DataTable>
                </ScrollView>
                <DataTable.Pagination
                  page={page}
                  numberOfPages={Math.ceil(filteredData.length / itemsPerPage)}
                  onPageChange={(page) => setPage(page)}
                  label={`${from + 1}-${to} of ${filteredData.length}`}
                  numberOfItemsPerPageList={numberOfItemsPerPageList}
                  numberOfItemsPerPage={itemsPerPage}
                  onItemsPerPageChange={onItemsPerPageChange}
                  showFastPaginationControls
                  selectPageDropdownLabel={'Rows per page'}
                  style={styles.pagination}
                  labelStyle={styles.paginationText}
                  selectPageDropdownStyle={styles.paginationDropdown}
                  theme={DarkTheme}
                />   
          </View>
        </View>
       
      );
    } else if (Platform.OS === 'ios') {
      // return (
      //   <React.Suspense fallback={<Text>Loading...</Text>}>
      //     <IOSTable /* ios-specific props */ />
      //   </React.Suspense>
      // );
    } else {
      return <Text>Unsupported Platform</Text>;
    }
  };
  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);
  return (
    <View style={styles.container}>
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
          /> : <Text>There is no Dates Available Between {startDate.toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: '2-digit'}).toUpperCase().replace(/ /g, '-')} to {endDate.toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: '2-digit'}).toUpperCase().replace(/ /g, '-')}</Text>}
        </View>
      </View>
      <View style={styles.dropdownWrap}>
      <CustomDateTimePicker date={startDate} handelChangeDate={setStartDate} /> 
      <CustomDateTimePicker date={endDate} handelChangeDate={setEndDate} />   
      <Pressable onPress={handleGetExamDateList}><Text>Search</Text></Pressable>
    </View>

      
{renderTable()}

      {/* <Button icon="download" mode="contained" onPress={exportToCSV}>
        Export CSV
      </Button> */}
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
  // Header:{backgroundColor:"#000", color:"#fff"},
  text: { margin: 6 },
  // tableBorder: { borderWidth: 2, borderColor: '#c8e1ff' },
  searchBar: { marginBottom: 10, backgroundColor:"#fff", borderWidth:1, borderColor:"#ccc"},
    dropdownWrap: {
      flexDirection: 'row',
      justifyContent: "space-between",
      marginBottom: 24,
      // alignItems: 'center',
      // padding: 10,
    },
    headerWidth:{
     flex:1
    },

    dropdown:{
      // width:250,
      // minHeight:40,
      // margin: "auto",
      // textAlign: "center"
      width:"100%",
      },
      dropdownContainer:{
        flex:1,
        marginRight:5,
        // width:250,
        zIndex:9999,
 
        // padding: [10, 5],
        // height: "auto"
      },
      drawerItemLabel:{
        // marginLeft:10,
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
      // marginRight:40,
  
 
    },
    pagination:{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
    // justifyContent:"center"
    },
  paginationText:{
    color:"#000",
  },
 
 
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    marginBottom: 10,
    backgroundColor: 'white',
  },
 
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  inputWeb:{
    padding:8,
    borderRadius:4,
    marginRight:10,
  },
  modalViewBottom:{
  backgroundColor:"red",
  },
  iconContainer:{
    backgroundColor:"red",
    color:"green",
    padding:40,
  },


});

// const dateSelectStyles = StyleSheet.create({
// datesWrap:{
//   flexDirection:"row",
//   justifyContent:"space-between",
//   alignItems:"center",
//    marginBottom:15,
// },
// searchicons:{
//    padding:"10px",
//    alignSelf:"center",
//    flexDirection:"row",
//    marginRight:"10px",
// },
// dates: {
//   width:'auto',
//   backgroundColor: "#ffffff",
//   borderBottomWidth: 1,
//   borderBottomColor: "#dddedf",
//   borderTopWidth: 0,
//   marginTop: 0,
// },
// dateItem: {
//   padding: 10,
//   minWidth: 60,
//   alignItems: "center",
// },
// dateNumber: {
//   fontSize: 16,
//   fontWeight: 'bold',
// },
// dateDay: {
//   fontSize: 12,
//   marginBottom: 3,
// },
// dateMonth: {
//   fontSize: 12,
//   marginTop: 3,
// },
//   activebox: {
//     backgroundColor: "#0cb551",
//     color: "#fff",
    
//   },
//   activeText: {
//     color: "#fff",
//   },
//   inactivetext: {
//   color: "#fff",
//   },
//   inactivebox: {
//   backgroundColor: "#e50d0d",
//   },
  
// });

export default ReportScreen;
