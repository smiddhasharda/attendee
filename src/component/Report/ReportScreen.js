import React, { useState, useEffect,useCallback,useMemo  } from 'react';
import { View, ScrollView, StyleSheet,FlatList ,Pressable,Text,Platform,ActivityIndicator } from 'react-native';
import { saveAs } from 'file-saver';
import { useToast } from "../../globalComponent/ToastContainer/ToastContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetch } from "../../AuthService/AuthService";
import { parse, format } from 'date-fns';
import { DataTable, Provider as PaperProvider, DarkTheme as PaperDarkTheme, DefaultTheme as PaperDefaultTheme  } from 'react-native-paper';
import CustomDateTimePicker from '../../globalComponent/DateTimePicker/CustomDateTimePicker';
import { Ionicons ,AntDesign} from '@expo/vector-icons'; 
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
// import ShardaLogo from '../../local-assets/shardalogo.png'

let WebTable;
if (Platform.OS === 'web') {
  WebTable = require('../../globalComponent/Tables/WebTable').default;
} else {
  WebTable = DataTable; // or some other table component for mobile
}

const ReportScreen = ({userAccess}) => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
    const [currentTab, setCurrentTab] = useState('ReportByStudents');
  const currentDate = new Date();
  const pastMonthDate = new Date();
  pastMonthDate.setMonth(currentDate.getMonth() - 1);

  const [startDate, setStartDate] = useState(pastMonthDate);
  const [endDate, setEndDate] = useState(currentDate);
  const tableHead  = ['System Id', 'Roll Number', 'Name','Catalog Number','Exam Date','Exam Start Time','Room','Seat','Status','Attendance Status','Exam Type','School','Graduation','Stream','Copy 1','Copy 2','Copy 3','Copy 4'];
  const tableHeadByCatelog = ['Catalog Number','Total','Present','Absent','UFM','Debarred','Exam Date','Exam Start Time','School','Exam Type'];
  const tableHeadByRoom = ['Room','Catalog Number','Total','Present','Absent','UFM','Debarred','Exam Date','Exam Start Time','School','Exam Type'];
  const [tableData, setTableData] = useState([]);
  const [tableDataByCatelog, setTableDataByCatelog] = useState([]);
  const [tableDataByRoom, setTableDataByRoom] = useState([]); 
  const [schoolList, setSchoolList] = useState([]);
  const [roomList, setRoomList] = useState([]);
  const [shiftList, setShiftList] = useState([]);
  const [examDates, setExamDates] = useState([]);

  const [examSelectedDate, setExamSelectedDate] = useState("");
  const { addToast } = useToast();

  const fetchDetails = async () => {
    setLoading(true);
    setRefreshing(true);
    await handleGetExamDateList().then(() => {
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  };
  

  useEffect(() => {
    fetchDetails();
  }, [userAccess,startDate,endDate]);


  const checkAuthToken = useCallback(async () => {
    const authToken = atob(await AsyncStorage.getItem(btoa("authToken")));
    
    if (!authToken) {
      addToast("Authentication token not available", "error");
      throw new Error("Authentication token not available");
    }
    
    return authToken;
    }, [addToast]);
    
    const handleGetExamDateList = async () => {
    try {
    const authToken = await checkAuthToken();
    const Parameter =  {
      operation: "custom",
    tblName: "tbl_report_master",
    data: "",
    conditionString: "",
    checkAvailability: "",
    customQuery: `SELECT DISTINCT EXAM_DT FROM tbl_report_master WHERE EXAM_DT >= '${startDate.toISOString()}' AND EXAM_DT <= '${endDate.toISOString()}'`,
     };
    const response = await fetch(
      Parameter,
    authToken
    );
    
    
      if (response) {
        setRefreshing(false);
        setExamDates(response || []);
        setExamSelectedDate(response?.[0]?.EXAM_DT);
        await handleGetExamRoomList(response?.[0]?.EXAM_DT);
        await handleGetExamReport(response?.[0]?.EXAM_DT);
        await handleGetExamReportByCategory(response?.[0]?.EXAM_DT);
        await handleGetExamReportByRoom(response?.[0]?.EXAM_DT);
        await handleGetSchoolList(response?.[0]?.EXAM_DT);
        await handleGetShiftList(response?.[0]?.EXAM_DT);
      }
    } catch (error) {
      handleAuthErrors(error);
    }
    };
    
    const handleGetExamRoomList = async (date) => {
    try {
    const authToken = await checkAuthToken();
    const Parameter =  {
      operation: "custom",
      tblName: "tbl_report_master",
      data: "",
      conditionString: "",
      checkAvailability: "",
      customQuery: `SELECT Distinct ROOM_NBR FROM tbl_report_master WHERE EXAM_DT = '${date}'`,
      };
    
    const response = await fetch(
      Parameter,
    authToken
    );
    if (response) {
    let RoomList = response?.map((item) => item.ROOM_NBR) || [];
    setRoomList(RoomList);
    }
    } catch (error) {
    handleAuthErrors(error);
    }
    };
    
    const handleGetSchoolList = async (date) => {
      try {
        const authToken = await checkAuthToken();
        const Parameter = {
          operation: "custom",
          tblName: "tbl_report_master",
          data: "",
          conditionString: "",
          checkAvailability: "",
          customQuery: `SELECT Distinct DESCR FROM tbl_report_master WHERE EXAM_DT = '${date}'`,
        };
        const response = await fetch(
          Parameter,
          authToken
        );
    
        if (response) {
          let SchoolList = response?.map((item) => item.DESCR) || [];
          setSchoolList(SchoolList);
        }
      } catch (error) {
        handleAuthErrors(error);
      }
    };
    
    const handleGetShiftList = async (date) => {
      try {
      const authToken = await checkAuthToken();
      const Parameter = {
        operation: "custom",
      tblName: "tbl_report_master",
      data: "",
      conditionString: "",
      checkAvailability: "",
      customQuery:`SELECT JSON_ARRAYAGG(room) AS ShiftData FROM ( SELECT JSON_OBJECT( 'label', EXAM_START_TIME, 'value', EXAM_START_TIME ) AS room FROM tbl_report_master WHERE EXAM_DT = '${date}' GROUP BY EXAM_START_TIME ) AS rooms` ,
    };
      const response = await fetch(
        Parameter,
      authToken
      );
      if (response) {
        setShiftList(response?.[0]?.ShiftData || []);
      }
      } catch (error) {
      handleAuthErrors(error);
      }
      };
    const handleGetExamReport = async (date) => {
    try {
     const authToken = await checkAuthToken();
    const Parameter =  {
      operation: "custom",
      tblName: "tbl_report_master",
      data: "",
      conditionString:"",
      checkAvailability: "",
      customQuery:`SELECT JSON_ARRAYAGG( JSON_OBJECT( 'PK_Report_Id', p.PK_Report_Id, 'EMPLID', p.EMPLID, 'EXAM_DT', p.EXAM_DT, 'ROOM_NBR', p.ROOM_NBR, 'EXAM_START_TIME', p.EXAM_START_TIME, 'STRM', p.STRM, 'CATALOG_NBR', p.CATALOG_NBR, 'PTP_SEQ_CHAR', p.PTP_SEQ_CHAR, 'NAME_FORMAL', p.NAME_FORMAL, 'ADM_APPL_NBR', p.ADM_APPL_NBR, 'DESCR', p.DESCR, 'DESCR2', p.DESCR2, 'DESCR3', p.DESCR3, 'Status', p.Status, 'Attendece_Status', p.Attendece_Status, 'EXAM_TYPE_CD', p.EXAM_TYPE_CD, 'created_by', p.created_by, 'updated_by', p.updated_by, 'isActive', p.isActive, 'copyData', cd.copy_data_json ) ) AS ReportMaster FROM tbl_report_master p LEFT JOIN ( SELECT FK_ReportId, CAST(CONCAT('[', GROUP_CONCAT(JSON_OBJECT( 'PK_CopyId', PK_CopyId, 'FK_ReportId', FK_ReportId, 'EMPLID', EMPLID, 'copyNumber', copyNumber, 'isActive', isActive )), ']') AS JSON) AS copy_data_json FROM tbl_copy_master GROUP BY FK_ReportId ) cd ON p.PK_Report_Id = cd.FK_ReportId WHERE p.EXAM_DT = '${date}'`,
      // customQuery: `select JSON_ARRAYAGG(json_object('PK_Report_Id',p.PK_Report_Id,'EMPLID',EMPLID,'EXAM_DT',p.EXAM_DT,'ROOM_NBR',p.ROOM_NBR,'EXAM_START_TIME',p.EXAM_START_TIME,'STRM',p.STRM,'CATALOG_NBR',p.CATALOG_NBR,'PTP_SEQ_CHAR',p.PTP_SEQ_CHAR,'NAME_FORMAL',p.NAME_FORMAL,'ADM_APPL_NBR',p.ADM_APPL_NBR,'DESCR',p.DESCR,'DESCR2',p.DESCR2,'DESCR3',p.DESCR3,'Status',p.Status,'Attendece_Status',p.Attendece_Status,'EXAM_TYPE_CD',p.EXAM_TYPE_CD,'created_by',p.created_by,'updated_by',p.updated_by,'isActive',p.isActive,'copyData',( SELECT CAST( CONCAT('[', GROUP_CONCAT( JSON_OBJECT( 'PK_CopyId',q.PK_CopyId,'FK_ReportId',q.FK_ReportId,'EMPLID',q.EMPLID,'copyNumber',q.copyNumber,'alternateCopyNumber1',q.alternateCopyNumber1,'alternateCopyNumber2',q.alternateCopyNumber2,'alternateCopyNumber3',q.alternateCopyNumber3,'alternateCopyNumber4',q.alternateCopyNumber4,'alternateCopyNumber5',q.alternateCopyNumber5,'alternateCopyNumber6',q.alternateCopyNumber6,'isActive',q.isActive) ), ']') AS JSON ) FROM tbl_copy_master q WHERE q.FK_ReportId = p.PK_Report_Id ))) AS ReportMaster from tbl_report_master p where EXAM_DT = '${date}'`,
    };
    const response = await fetch(
      Parameter,
    authToken
    );
    if (response) {
      setTableData(response?.[0]?.ReportMaster || []);
    }
    } catch (error) {
    handleAuthErrors(error);
    }
    };
    const handleGetExamReportByCategory = async (date) => {
        try {
        const authToken = await checkAuthToken();
        const Parameter =  {
          operation: "custom",
          tblName: "tbl_report_master",
          data: "",
          conditionString:"",
          checkAvailability: "",
          customQuery: `SELECT EXAM_DT, CATALOG_NBR, EXAM_START_TIME, EXAM_TYPE_CD,STRM, DESCR,created_by,updated_by, COUNT(*) AS TotalStudents, SUM(CASE WHEN Status = 'Present' THEN 1 ELSE 0 END) AS PresentStudents, SUM(CASE WHEN Status = 'Absent' THEN 1 ELSE 0 END) AS AbsentStudents, SUM(CASE WHEN Status = 'UFM' THEN 1 ELSE 0 END) AS UFMStudents, SUM(CASE WHEN Attendece_Status = 'Debarred' THEN 1 ELSE 0 END) AS DebarredStudents FROM tbl_report_master WHERE EXAM_DT = '${date}' GROUP BY EXAM_DT, CATALOG_NBR, EXAM_START_TIME, DESCR,EXAM_TYPE_CD,STRM,created_by,updated_by; `,
       };

        const response = await fetch(
          Parameter,
        authToken
        );
        if (response) {      
        setTableDataByCatelog(response || []);
        }
        } catch (error) {
        handleAuthErrors(error);
        }
        };
    const handleGetExamReportByRoom = async (date) => {
        try {
        const authToken = await checkAuthToken();
        const Parameter =  {
          operation: "custom",
          tblName: "tbl_report_master",
          data: "",
          conditionString:"",
          checkAvailability: "",
          customQuery: `SELECT ROOM_NBR,EXAM_DT, CATALOG_NBR, EXAM_START_TIME, EXAM_TYPE_CD,STRM, DESCR,created_by,updated_by, COUNT(*) AS TotalStudents, SUM(CASE WHEN Status = 'Present' THEN 1 ELSE 0 END) AS PresentStudents, SUM(CASE WHEN Status = 'Absent' THEN 1 ELSE 0 END) AS AbsentStudents, SUM(CASE WHEN Status = 'UFM' THEN 1 ELSE 0 END) AS UFMStudents, SUM(CASE WHEN Attendece_Status = 'Debarred' THEN 1 ELSE 0 END) AS DebarredStudents FROM tbl_report_master WHERE EXAM_DT = '${date}' GROUP BY EXAM_DT, CATALOG_NBR, EXAM_START_TIME, DESCR,ROOM_NBR,EXAM_TYPE_CD,STRM,created_by,updated_by`,
          };

        const response = await fetch(
          Parameter,
        authToken
        );
        if (response) {      
            setTableDataByRoom(response || []);
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
    
    const parseExcelDate = (SelectedDate,formate) => {
      return format(new Date(SelectedDate),( formate || 'yyyy-MM-dd'));
      // return `${year}-${month}-${day}`;
    };
    // const handleDateClick = async(date) => {
    //   setLoading(true);
    //   setExamSelectedDate(date);
    //   await handleGetExamReport(date);
    //   await handleGetExamReportByCategory(date);
    //   await handleGetExamReportByRoom(date);
    //   await handleGetExamRoomList(date);
    //   await handleGetSchoolList(date);
    //   await handleGetShiftList(date);
    // then(() => {
    //   setLoading(false);
    // }).catch(() => {
    //   setLoading(false);
    // });
     
    // }  
    
    const handleDateClick = async (date) => {
      setLoading(true);
      setExamSelectedDate(date);
    
      try {
        await handleGetExamReport(date);
        await handleGetExamReportByCategory(date);
        await handleGetExamReportByRoom(date);
        await handleGetExamRoomList(date);
        await handleGetSchoolList(date);
        await handleGetShiftList(date);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
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
    accessorKey: 'EXAM_TYPE_CD',
    header: 'Exam Type',
    size: 150,
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
  },
  {
    accessorKey: 'STRM',
    header: 'Current Term',
    size: 150,
  },
  {
    accessorKey: 'created_by',
    header: 'Created By',
    size: 150,
  },
  {
    accessorKey: 'updated_by',
    header: 'Updated By',
    size: 150,
  },
  
], [schoolList,roomList,shiftList]);

const WebColumnsByCatelog = useMemo(() => [
    {
      accessorKey: 'CATALOG_NBR',
      header: 'Catalog Number',
      size: 150,
    },
    {
        accessorKey: 'TotalStudents',
        header: 'Total Strength',
        size: 150,
    },
    {
        accessorKey: 'PresentStudents',
        header: 'Present',
        size: 150,
    },
    {
        accessorKey: 'AbsentStudents',
        header: 'Absent',
        size: 150,
    },
    {
        accessorKey: 'UFMStudents',
        header: 'UFM',
        size: 150,
    },
    {
        accessorKey: 'DebarredStudents',
        header: 'Debarred',
        size: 150,
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
      accessorKey: 'DESCR',
      header: 'School',
      size: 150,
      filterVariant: "multi-select",
      filterSelectOptions: schoolList,
    },
    {
      accessorKey: 'EXAM_TYPE_CD',
      header: 'Exam Type',
      size: 150,
    },
    {
      accessorKey: 'STRM',
      header: 'Current Term',
      size: 150,
    },
    {
      accessorKey: 'created_by',
      header: 'Created By',
      size: 150,
    },
    {
      accessorKey: 'updated_by',
      header: 'Updated By',
      size: 150,
    },
  ], [schoolList,shiftList]);

const WebColumnsByRoom = useMemo(() => [
{
    accessorKey: 'ROOM_NBR',
    header: 'Room No.',
    size: 150,
    filterVariant: "multi-select",
    filterSelectOptions: roomList,
    },
{
    accessorKey: 'CATALOG_NBR',
    header: 'Catalog Number',
    size: 150,
},
{
    accessorKey: 'TotalStudents',
    header: 'Total Strength',
    size: 150,
},
{
    accessorKey: 'PresentStudents',
    header: 'Present',
    size: 150,
},
{
    accessorKey: 'AbsentStudents',
    header: 'Absent',
    size: 150,
},
{
    accessorKey: 'UFMStudents',
    header: 'UFM',
    size: 150,
},
{
    accessorKey: 'DebarredStudents',
    header: 'Debarred',
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
    accessorKey: 'DESCR',
    header: 'School',
    size: 150,
    filterVariant: "multi-select",
    filterSelectOptions: schoolList,
},
{
  accessorKey: 'EXAM_TYPE_CD',
  header: 'Exam Type',
  size: 150,
},
{
  accessorKey: 'STRM',
  header: 'Current Term',
  size: 150,
},
{
  accessorKey: 'created_by',
  header: 'Created By',
  size: 150,
},
{
  accessorKey: 'updated_by',
  header: 'Updated By',
  size: 150,
},
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
          `"${row.EXAM_TYPE_CD || '-'}"`,
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
          `"${original.EXAM_TYPE_CD || '-'}"`,
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

    // const handleExportRowsAsPDF = (rows) => {
    //     const doc = new jsPDF('l', 'mm', 'a4'); // 'l' for landscape
    //     const tableData = rows?.map(({ original }) => [
    //         `${original?.EMPLID || '-'}`,
    //         `${original?.ADM_APPL_NBR || '-'}`,
    //         `${original?.NAME_FORMAL || '-'}`,
    //         `${original?.CATALOG_NBR || '-'}`,
    //         `${parseExcelDate(original?.EXAM_DT) || '-'}`,
    //         `${convertedTime(original?.EXAM_START_TIME) || '-'}`,
    //         `${original?.ROOM_NBR || '-'}`,
    //         `${original?.PTP_SEQ_CHAR || '-'}`,
    //         `${original?.Status || '-'}`,          
    //         `${original?.Attendece_Status || '-'}`,
    //         `"${original?.EXAM_TYPE_CD || '-'}"`,
    //         `${original?.DESCR || '-'}`,
    //         `${original?.DESCR2 || '-'}`,
    //         `${original?.DESCR3 || '-'}`,
    //         `${original?.copyData?.[0]?.copyNumber || '-'}`,
    //         `${original?.copyData?.[1]?.copyNumber || '-'}`,
    //         `${original?.copyData?.[2]?.copyNumber || '-'}`,
    //         `${original?.copyData?.[3]?.copyNumber || '-'}`
    //     ]);
    
    //     autoTable(doc, {
    //         head: [tableHead],
    //         body: tableData,
    //         theme: 'striped',
    //         styles: {
    //             fontSize: 7, // Reduce font size
    //             cellPadding: 1, // Reduce cell padding
    //             overflow: 'linebreak'
    //         },
    //         headStyles: {
    //             fillColor: [22, 160, 133],
    //             textColor: [255, 255, 255],
    //             fontSize: 9, // Adjust font size for header
    //             halign: 'center'
    //         },
    //         bodyStyles: {
    //             valign: 'middle',
    //             halign: 'center'
    //         },
    //         alternateRowStyles: {
    //             fillColor: [240, 240, 240]
    //         },
    //         columnStyles: {
    //             0: { cellWidth: 15 },
    //             1: { cellWidth: 15 },
    //             2: { cellWidth: 30 },
    //             3: { cellWidth: 15 },
    //             4: { cellWidth: 15 },
    //             5: { cellWidth: 15 },
    //             6: { cellWidth: 15 },
    //             7: { cellWidth: 15 },
    //             8: { cellWidth: 15 },
    //             9: { cellWidth: 15 },
    //             10: { cellWidth: 15 },
    //             11: { cellWidth: 15 },
    //             12: { cellWidth: 15 },
    //             13: { cellWidth: 15 },
    //             14: { cellWidth: 15 },
    //             15: { cellWidth: 15 },
    //             16: { cellWidth: 15 }
    //         },
    //         margin: { top: 20, bottom: 20, left: 20, right: 20 }
    //     });
    
    //     doc.save(`Report-${currentDate}.pdf`);
    // };
const ShardaLogoBase64 = 'data:image/png;base64,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';

const getAcademicYear = (strm) => {
  const strmString = String(strm);
  const yearCode = parseInt(strmString.substring(0, 2));
  const startYear = 2000 + yearCode;
  const endYear = startYear + 1;
  return `${startYear} - ${endYear}`;
};

const handleExportRowsAsPDF = (rows) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 10;

  const headerColor = [242, 242, 242];
  const headerTextColor = [0, 0, 0];
  const footerColor = [242, 242, 242];
  const footerTextColor = [0, 0, 0];

  const drawHeader = (roomNbr, shift, examType, strm, examDate) => {
    doc.setFillColor(...headerColor);
    doc.rect(0, 0, pageWidth, 33, 'F');

    try {
      doc.addImage(ShardaLogoBase64, 'PNG', margin, margin, 60, 15);
    } catch (error) {
      console.warn('Failed to add logo to PDF:', error);
    }

    doc.setTextColor(...headerTextColor);
    doc.setFontSize(18);
    doc.text('Sharda University, Greater Noida', pageWidth / 1.5 , 10, { align: 'center' });
    // doc.setFontSize(14);
    // doc.text('Greater Noida', pageWidth / 1.5, 20, { align: 'center' });
    doc.setFontSize(14);
    doc.text('Attendance Record', pageWidth / 1.5, 20, { align: 'center' });
    doc.text(`${examType} Examination (${getAcademicYear(strm)})`, pageWidth / 1.5 , 28, { align: 'center' });

    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.text(`Room No.: ${roomNbr}`, margin, 43);
    doc.text(`Date: ${examDate || '-'}`, pageWidth / 2, 43, { align: 'center' });
    doc.text(`Shift Time: ${shift}`, pageWidth - margin, 43, { align: 'right' });
  };

  const drawFooter = () => {
    doc.setFillColor(...footerColor);
    doc.rect(0, pageHeight - 10, pageWidth, 20, 'F');
    doc.setTextColor(...footerTextColor);
    doc.setFontSize(10);
    doc.text('© 2024 Sharda Tech Pvt. Ltd. All Rights Reserved.', pageWidth / 2, pageHeight - 4, { align: 'center' });
  };

  const drawSignatures = (invigilatorNames) => {
    doc.setFontSize(12);
    doc.text('Name of Invigilators:', margin, pageHeight - 55);
    doc.text('Signature of Copy Collector:', pageWidth - margin - 10, pageHeight - 55, { align: 'right' });

    // Dynamically add each invigilator's name and a line for their signature
    invigilatorNames.forEach((name, i) => {
      doc.text(`${i + 1}. ${name}`, margin, pageHeight - 45 + (i * 10));
      doc.text('____________________', pageWidth - margin - 10, pageHeight - 45 + (i * 10), { align: 'right' });
    });
    
  };

   // Group rows by exam time and room number
   const groupedByTimeAndRoom = rows.reduce((acc, row) => {
    const roomNbr = row.original.ROOM_NBR || 'Unknown Room';
    const shift = convertedTime(row.original.EXAM_START_TIME) || 'Unknown Shift';
    const key = `${shift}$${roomNbr}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(row);
    return acc;
  }, {});

  Object.entries(groupedByTimeAndRoom).forEach(([key, groupRows], index) => {
    if (index !== 0) doc.addPage();

    // Collect all invigilator names (assuming created_by, updated_by, and possibly others)
    const invigilators = new Set();
    groupRows.forEach(row => {
      if (row.original.created_by) invigilators.add(row.original.created_by);
      // if (row.original.updated_by) invigilators.add(row.original.updated_by);
      // Add any other relevant fields that might contain invigilator names here
    });

    // Convert Set to Array to iterate and display
    const invigilatorNames = Array.from(invigilators);

    const [shift,roomNbr] = key.split('$');
    const examType = groupRows[0]?.original?.EXAM_TYPE_CD === "ETE" ? 'End Semester' : 'Mid Semester';
    const strm = groupRows[0]?.original?.STRM;
    const examDate = parseExcelDate(groupRows[0]?.original?.EXAM_DT, 'dd-MM-yyyy');

    drawHeader(roomNbr, shift, examType, strm, examDate);

    const tableHeaders = [
      ['Sl No.', 'Roll No.', 'Student Name', 'Seat No.', 'Course Code','Status','Attendance Status','Answer Sheet']
    ];

    const tableBody = groupRows.map((row, index) => [
      index + 1,
      row?.original?.ADM_APPL_NBR || '-',
      row?.original?.NAME_FORMAL || '-',
      row?.original?.PTP_SEQ_CHAR || '-',
      row?.original?.CATALOG_NBR || '-',
      row?.original?.Status || '-',          
      row?.original?.Attendece_Status || '-',
      row?.original?.copyData?.map(copy => copy.copyNumber).join(', ') || '-'
    ]);

    autoTable(doc, {
      head: tableHeaders,
      body: tableBody,
      startY: 50,
      theme: 'grid',
      styles: { fontSize: 10},
      headStyles: { fillColor: [242, 242, 242], textColor: [0, 0, 0], fontStyle: 'bold'},
    });

    drawSignatures(invigilatorNames);
    drawFooter();
  });

  doc.save(`AttendanceRecord-${parseExcelDate(rows[0]?.original?.EXAM_DT,'dd-MM-yyyy')}.pdf`);
};


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
    
    //     // Collect all invigilator names (assuming created_by, updated_by, and possibly others)
    //     const invigilators = new Set();
    //     groupRows.forEach(row => {
    //       if (row.original.created_by) invigilators.add(row.original.created_by);
    //       // if (row.original.updated_by) invigilators.add(row.original.updated_by);
    //       // Add any other relevant fields that might contain invigilator names here
    //     });
    
    //     // Convert Set to Array to iterate and display
    //     const invigilatorNames = Array.from(invigilators);
    
    //     // Add logo
    //     try {
    //       doc.addImage(ShardaLogoBase64, 'PNG', margin, margin, 40, 20);
    //     } catch (error) {
    //       console.warn('Failed to add logo to PDF:', error);
    //     }
    
    //     // Add header
    //     doc.setFillColor(35, 57, 76);
    //     doc.rect(0, 0, pageWidth, 45, 'F');
    //     doc.setTextColor(255, 255, 255);
    //     doc.setFontSize(24);
    //     doc.text('Sharda University', pageWidth / 2, 10, { align: 'center' });
    //     doc.setFontSize(16);
    //     doc.text('Greater Noida', pageWidth / 2, 20, { align: 'center' });
    //     doc.setFontSize(18);
    //     doc.text('Attendance Record', pageWidth / 2, 30, { align: 'center' });
    //     doc.text(`${groupRows[0]?.original?.EXAM_TYPE_CD === "ETE" ? 'End Semester' : 'Mid Semester'} Examination (${getAcademicYear(groupRows[0]?.original?.STRM)})`, pageWidth / 2, 40, { align: 'center' });
    
    //     // Add exam info
    //     doc.setTextColor(0);
    //     doc.setFontSize(12);
    //     doc.text(`Date: ${parseExcelDate(groupRows[0]?.original?.EXAM_DT, 'dd-MM-yyyy') || '-' }`, margin, 55);
    //     doc.text(`Shift Time: ${convertedTime(time)}`, pageWidth / 2, 55, { align: 'center' });
    //     doc.text(`Room No: ${room}`, pageWidth - margin, 55, { align: 'right' });
    
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
    //       startY: 60,
    //       theme: 'grid',
    //       styles: { fontSize: 10},
    //       headStyles: { fillColor: [242, 242, 242], textColor: [0, 0, 0], fontStyle: 'bold'},
    //     });
    
    //     // Signature Section with Dynamic Names
    //     doc.setFontSize(12);
    //     doc.text('Name of Invigilators:', margin, pageHeight - 55);
    
    //     // Dynamically add each invigilator's name and a line for their signature
    //     invigilatorNames.forEach((name, i) => {
    //       doc.text(`${i + 1}. ${name}`, margin, pageHeight - 45 + (i * 10));
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
    
    
    const csvOptionsByCategory = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        useBom: true,
        useKeysAsHeaders: false,
        filename: `ReportByCategory-${currentDate}`,
        headers: tableHeadByCatelog
      };
      const handleExportDataByCatelog = () => {
       const csvData = [
         tableHeadByCatelog.map(header => `"${header}"`), // Headers
         ...tableDataByCatelog.map(row => [
           `"${row.CATALOG_NBR || '-'}"`,
           `"${row.TotalStudents || '-'}"`,
           `"${row.PresentStudents || '-'}"`,
           `"${row.AbsentStudents || '-'}"`,
           `"${row.UFMStudents || '-'}"`,
           `"${row.DebarredStudents || '-'}"`,
           `"${parseExcelDate(row.EXAM_DT) || '-'}"`,
           `"${convertedTime(row.EXAM_START_TIME) || '-'}"`,
           `"${row.DESCR || '-'}"`,
           `"${row.EXAM_TYPE_CD || '-'}"`,
         ])
       ];
     
       const csvRows = csvData.map(row => row.join(csvOptionsByCategory.fieldSeparator)).join('\n');
       const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
       const csvFile = new File([blob], `${csvOptionsByCategory.filename}.csv`, { type: 'text/csv;charset=utf-8;' });
       
       saveAs(csvFile);
     };    
     const handleExportRowsByCatelog = (rows) => {
       const csvData = [
         tableHeadByCatelog.map(header => `"${header}"`), // Headers
         ...rows?.map(({ original }) => [
            `"${original.CATALOG_NBR || '-'}"`,
            `"${original.TotalStudents || '-'}"`,
            `"${original.PresentStudents || '-'}"`,
            `"${original.AbsentStudents || '-'}"`,
            `"${original.UFMStudents || '-'}"`,
            `"${original.DebarredStudents || '-'}"`,
            `"${parseExcelDate(original.EXAM_DT) || '-'}"`,
            `"${convertedTime(original.EXAM_START_TIME) || '-'}"`,
            `"${original.DESCR || '-'}"`,
            `"${original.EXAM_TYPE_CD || '-'}"`,
         ])
       ];
     
       const csvRows = csvData.map(row => row.join(csvOptionsByCategory.fieldSeparator)).join('\n');
       const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
       const csvFile = new File([blob], `${csvOptionsByCategory.filename}.csv`, { type: 'text/csv;charset=utf-8;' });
     
       saveAs(csvFile);
     };

    //  const handleExportRowsAsPDFByCategory = (rows) => {
    //     const doc = new jsPDF('l', 'mm', 'a4'); // 'l' for landscape
    //     const tableData = rows?.map(({ original }) => [
    //        `${original.CATALOG_NBR || '-'}`,
    //         `${original.TotalStudents || '-'}`,
    //         `${original.PresentStudents || '-'}`,
    //         `${original.AbsentStudents || '-'}`,
    //         `${original.UFMStudents || '-'}`,
    //         `${original.DebarredStudents || '-'}`,
    //         `${parseExcelDate(original.EXAM_DT) || '-'}`,
    //         `${convertedTime(original.EXAM_START_TIME) || '-'}`,
    //         `${original.DESCR || '-'}`,
    //         `"${original.EXAM_TYPE_CD || '-'}"`,
    //     ]);
    
    //     autoTable(doc, {
    //         head: [tableHeadByCatelog],
    //         body: tableData,
    //         theme: 'striped',
    //         styles: {
    //             fontSize: 7, // Reduce font size
    //             cellPadding: 1, // Reduce cell padding
    //             overflow: 'linebreak'
    //         },
    //         headStyles: {
    //             fillColor: [22, 160, 133],
    //             textColor: [255, 255, 255],
    //             fontSize: 9, // Adjust font size for header
    //             halign: 'center'
    //         },
    //         bodyStyles: {
    //             valign: 'middle',
    //             halign: 'center'
    //         },
    //         alternateRowStyles: {
    //             fillColor: [240, 240, 240]
    //         },
    //         columnStyles: {
    //             0: { cellWidth:  25},
    //             1: { cellWidth: 25 },
    //             2: { cellWidth: 25 },
    //             3: { cellWidth: 25 },
    //             4: { cellWidth: 25 },
    //             5: { cellWidth: 25 },
    //             6: { cellWidth: 25 },
    //             7: { cellWidth: 25 },
    //             8: { cellWidth: 60 },
    //         },
    //         margin: { top: 20, bottom: 20, left: 20, right: 20 }
    //     });
    
    //     doc.save(`ReportByCategory-${currentDate}.pdf`);
    // };

    
// const handleExportRowsAsPDFByCategory = (rows) => {
//   const doc = new jsPDF('p', 'mm', 'a4');
//   const pageWidth = doc.internal.pageSize.width;
//   const pageHeight = doc.internal.pageSize.height;
//   const margin = 10;

//   // Group rows by room number
//   const groupedByShift = rows.reduce((acc, row) => {
//       const shift = row.original.EXAM_START_TIME || 'Unknown Time';
//       if (!acc[shift]) {
//           acc[shift] = [];
//       }
//       acc[shift].push(row);
//       return acc;
//   }, {});

//   // Iterate over each room group and add each to a new page in the PDF
//   Object.keys(groupedByShift).forEach((shift, index) => {
//       if (index !== 0) doc.addPage(); // Add a new page for each room after the first one

//       const shiftRows = groupedByShift[shift];

//       // Add logo (if available)
//       try {
//         doc.addImage(ShardaLogo, 'PNG', margin, margin, 40, 20);      } catch (error) {
//           console.warn('Failed to add logo to PDF:', error);
//       }

//       // Add header
//       doc.setFillColor(223, 76, 6);
//       doc.rect(0, 0, pageWidth, 50, 'F');
//       doc.setTextColor(255, 255, 255);
//       doc.setFontSize(24);
//       doc.text('Sharda University', pageWidth / 2, 20, { align: 'center' });
//       doc.setFontSize(18);
//       doc.text('Attendance Record', pageWidth / 2, 30, { align: 'center' });
//       doc.text(`${shiftRows?.[0]?.original?.EXAM_TYPE_CD === "ETE" ? 'End Semester ': 'Mid Semester'} Examination ((${shiftRows?.[0]?.original?.STRM}))`, pageWidth / 2, 40, { align: 'center' });

//       // Add room info
//       doc.setTextColor(0);
//       doc.setFontSize(12);
//       doc.text(`Date: ${parseExcelDate(shiftRows?.[0]?.original?.EXAM_DT) || '-'}`, pageWidth - margin, 60, { align: 'right' });
//       doc.text(`Shift: ${convertedTime(shiftRows?.[0]?.original.EXAM_START_TIME) || '-'}`, pageWidth - margin, 70, { align: 'right' });

//       // Add main table
//       const mainTableHeaders = [
//           [
//               { content: 'S. No.', rowSpan: 1 },
//               { content: 'Course Code', rowSpan: 1 },
//               { content: 'Total', rowSpan: 1 },
//               { content: 'Present', rowSpan: 1 },
//               { content: 'Absent', rowSpan: 1 }
//           ]
//       ];

//       const mainTableBody = shiftRows.map((row, index) => [
//           index + 1,
//           row.original.CATALOG_NBR || '-',
//           row.original.TotalStudents || '-',
//           row.original.PresentStudents || '-',
//           row.original.AbsentStudents || '-'
//       ]);

//       autoTable(doc, {
//           head: mainTableHeaders,
//           body: mainTableBody,
//           startY: 80,
//           theme: 'grid',
//           styles: { fontSize: 10, cellPadding: 2 },
//           headStyles: { fillColor: [242, 242, 242], textColor: [0, 0, 0], fontStyle: 'bold' },
//       });

//       // Add footer
//       doc.setFillColor(223, 76, 6);
//       doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
//       doc.setTextColor(255, 255, 255);
//       doc.setFontSize(12);
//       doc.text('© 2023 Sharda Tech Pvt. Ltd. All Rights Reserved.', pageWidth / 2, pageHeight - 10, { align: 'center' });
//   });

//   // Save the single PDF with all rooms
//   doc.save(`AnswerSheetSummary-AllCatelog-${parseExcelDate(rows?.[0]?.original?.EXAM_DT) || '-'}.pdf`);
// };

const handleExportRowsAsPDFByCategory = (rows) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 10;

  const headerColor = [242, 242, 242];
  const headerTextColor = [0, 0, 0];
  const footerColor = [242, 242, 242];
  const footerTextColor = [0, 0, 0];

  const drawHeader = (school, shift, examType, strm, examDate) => {
    doc.setFillColor(...headerColor);
    doc.rect(0, 0, pageWidth, 33, 'F');

    try {
      doc.addImage(ShardaLogoBase64, 'PNG', margin, margin, 60, 15);
    } catch (error) {
      console.warn('Failed to add logo to PDF:', error);
    }

    doc.setTextColor(...headerTextColor);
    doc.setFontSize(18);
    doc.text('Sharda University, Greater Noida', pageWidth / 1.5 , 10, { align: 'center' });
    doc.setFontSize(14);
    doc.text('Attendance Record By Category', pageWidth / 1.5, 20, { align: 'center' });
    doc.text(`${examType} Examination (${getAcademicYear(strm)})`, pageWidth / 1.5 , 28, { align: 'center' });

    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.text(`School: ${school}`, margin, 43);
    doc.text(`Date: ${examDate || '-'}`, pageWidth / 2, 43, { align: 'center' });
    doc.text(`Shift Time: ${convertedTime(shift)}`, pageWidth - margin, 43, { align: 'right' });
  };

  const drawFooter = () => {
    doc.setFillColor(...footerColor);
    doc.rect(0, pageHeight - 10, pageWidth, 20, 'F');
    doc.setTextColor(...footerTextColor);
    doc.setFontSize(10);
    doc.text('© 2024 Sharda Tech Pvt. Ltd. All Rights Reserved.', pageWidth / 2, pageHeight - 4, { align: 'center' });
  };

   // Group rows by exam time and room number
   const groupedByShiftAndSchool = rows.reduce((acc, row) => {
    const shift = row.original.EXAM_START_TIME || 'Unknown Time';
    const school = row.original.DESCR || 'Unknown School';
    if (!acc[shift]) acc[shift] = {};
    if (!acc[shift][school]) acc[shift][school] = [];
    acc[shift][school].push(row);
    return acc;
  }, {});

  Object.entries(groupedByShiftAndSchool).forEach(([shift, schools]) => {
    Object.entries(schools).forEach(([school, schoolRows], schoolIndex) => {
      if (schoolIndex !== 0) doc.addPage();

      // Add logo
      try {
        doc.addImage(ShardaLogoBase64, 'PNG', margin, margin, 40, 20);
      } catch (error) {
        console.warn('Failed to add logo to PDF:', error);
      }

      
    const examType = schoolRows[0]?.original?.EXAM_TYPE_CD === "ETE" ? 'End Semester' : 'Mid Semester';
    const strm = schoolRows[0]?.original?.STRM;
    const examDate = parseExcelDate(schoolRows[0]?.original?.EXAM_DT, 'dd-MM-yyyy');

    drawHeader(school, shift, examType, strm, examDate);

      // Add main table
      const tableHeaders = [
        [
          { content: 'Sl No', rowSpan: 2 },
          { content: 'Course Code', rowSpan: 2 },
          { content: 'Strength', rowSpan: 2 },
          { content: 'Appeared', colSpan: 2 },
          { content: 'Non-Appeared', colSpan: 2 }
        ],
        ['Present', 'UFM', 'Absent', 'Debarred']        
      ];

      const tableBody = schoolRows.map((row, index) => [
        index + 1,
        row.original.CATALOG_NBR || '-',
        row.original.TotalStudents || '-',
        row.original.PresentStudents || '-',
        row.original.UFMStudents || '-',
        row.original.AbsentStudents || '-',
        row.original.DebarredStudents || '-',
      ]);

      autoTable(doc, {
        head: tableHeaders,
        body: tableBody,
        startY: 50,
        theme: 'grid',
        styles: { fontSize: 10},
        headStyles: { fillColor: [242, 242, 242], textColor: [0, 0, 0], fontStyle: 'bold' },
      });

      drawFooter();
    });
  });
    
  // Save the PDF
  doc.save(`SummarySheetByCategory-${parseExcelDate(rows[0]?.original?.EXAM_DT,'dd-MM-yyyy')}.pdf`);
};

// const handleExportRowsAsPDFByCategory = (rows) => {
//   const doc = new jsPDF('p', 'mm', 'a4');
//   const pageWidth = doc.internal.pageSize.width;
//   const pageHeight = doc.internal.pageSize.height;
//   const margin = 10;

//   // Group rows by shift and school
//   const groupedByShiftAndSchool = rows.reduce((acc, row) => {
//     const shift = row.original.EXAM_START_TIME || 'Unknown Time';
//     const school = row.original.DESCR || 'Unknown School';
//     if (!acc[shift]) acc[shift] = {};
//     if (!acc[shift][school]) acc[shift][school] = [];
//     acc[shift][school].push(row);
//     return acc;
//   }, {});

//   Object.entries(groupedByShiftAndSchool).forEach(([shift, schools]) => {
//     Object.entries(schools).forEach(([school, schoolRows], schoolIndex) => {
//       if (schoolIndex !== 0) doc.addPage();

//       // Add logo
//       try {
//         doc.addImage(ShardaLogoBase64, 'PNG', margin, margin, 40, 20);
//       } catch (error) {
//         console.warn('Failed to add logo to PDF:', error);
//       }

//       // Add header
//       doc.setFillColor(35, 57, 76);
//       doc.rect(0, 0, pageWidth, 45, 'F');
//       doc.setTextColor(255, 255, 255);
//       doc.setFontSize(24);
//       doc.text('Sharda University', pageWidth / 2, 10, { align: 'center' });
//       doc.setFontSize(16);
//       doc.text('Greater Noida', pageWidth / 2, 20, { align: 'center' });
//       doc.setFontSize(18);
//       doc.text('Attendance Record By Category', pageWidth / 2, 30, { align: 'center' });
//       doc.text(`${schoolRows[0]?.original?.EXAM_TYPE_CD === "ETE" ? 'End Semester' : 'Mid Semester'} Examination (${getAcademicYear(schoolRows[0]?.original?.STRM)})`, pageWidth / 2, 40, { align: 'center' });

//       // Add exam info
//       doc.setTextColor(0);
//       doc.setFontSize(12);
//       doc.text(`School: ${school}`, margin, 55);
//       doc.text(`Date: ${parseExcelDate(schoolRows[0]?.original?.EXAM_DT,'dd-MM-yyyy')}`, pageWidth - margin, 55, { align: 'right' });
//       doc.text(`Shift Time: ${convertedTime(shift)}`, pageWidth - margin, 65, { align: 'right' });

//       // Add main table
//       const tableHeaders = [
//         ['Sl No.', 'Course Code', 'Total', 'Present', 'Absent', 'UFM', 'Debarred']
//       ];

//       const tableBody = schoolRows.map((row, index) => [
//         index + 1,
//         row.original.CATALOG_NBR || '-',
//         row.original.TotalStudents || '-',
//         row.original.PresentStudents || '-',
//         row.original.AbsentStudents || '-',
//         row.original.UFMStudents || '-',
//         row.original.DebarredStudents || '-',
//       ]);

//       autoTable(doc, {
//         head: tableHeaders,
//         body: tableBody,
//         startY: 75,
//         theme: 'grid',
//         styles: { fontSize: 10},
//         headStyles: { fillColor: [242, 242, 242], textColor: [0, 0, 0], fontStyle: 'bold' },
//       });

//       // Add footer
//       doc.setFillColor(35, 57, 76);
//       doc.rect(0, pageHeight - 10, pageWidth, 20, 'F');
//       doc.setTextColor(255, 255, 255);
//       doc.setFontSize(10);
//       doc.text('© 2024 Sharda Tech Pvt. Ltd. All Rights Reserved.', pageWidth / 2, pageHeight - 4, { align: 'center' });
//     });
//   });

//   // Save the PDF
//   doc.save(`SummarySheetByCategory-${parseExcelDate(rows[0]?.original?.EXAM_DT,'dd-MM-yyyy')}.pdf`);
// };
    
     const csvOptionsByRoom = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        useBom: true,
        useKeysAsHeaders: false,
        filename: `ReportByRoom-${currentDate}`,
        headers: tableHeadByRoom
      };
      const handleExportDataByRoom = () => {
       const csvData = [
        tableHeadByRoom.map(header => `"${header}"`), // Headers
         ...tableDataByRoom.map(row => [
            `"${row.ROOM_NBR || '-'}"`,
           `"${row.CATALOG_NBR || '-'}"`,
           `"${row.TotalStudents || '-'}"`,
           `"${row.PresentStudents || '-'}"`,
           `"${row.AbsentStudents || '-'}"`,
           `"${row.UFMStudents || '-'}"`,
           `"${row.DebarredStudents || '-'}"`,
           `"${parseExcelDate(row.EXAM_DT) || '-'}"`,
           `"${convertedTime(row.EXAM_START_TIME) || '-'}"`,
           `"${row.DESCR || '-'}"`,
           `"${row.EXAM_TYPE_CD || '-'}"`,
         ])
       ];
     
       const csvRows = csvData.map(row => row.join(csvOptionsByRoom.fieldSeparator)).join('\n');
       const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
       const csvFile = new File([blob], `${csvOptionsByRoom.filename}.csv`, { type: 'text/csv;charset=utf-8;' });
       
       saveAs(csvFile);
     };    
     const handleExportRowsByRoom = (rows) => {
       const csvData = [
        tableHeadByRoom.map(header => `"${header}"`), // Headers
         ...rows?.map(({ original }) => [
            `"${original.ROOM_NBR || '-'}"`,
            `"${original.CATALOG_NBR || '-'}"`,
            `"${original.TotalStudents || '-'}"`,
            `"${original.PresentStudents || '-'}"`,
            `"${original.AbsentStudents || '-'}"`,
            `"${original.UFMStudents || '-'}"`,
            `"${original.DebarredStudents || '-'}"`,
            `"${parseExcelDate(original.EXAM_DT) || '-'}"`,
            `"${convertedTime(original.EXAM_START_TIME) || '-'}"`,
            `"${original.DESCR || '-'}"`,
            `"${original.EXAM_TYPE_CD || '-'}"`,
         ])
       ];
     
       const csvRows = csvData.map(row => row.join(csvOptionsByRoom.fieldSeparator)).join('\n');
       const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
       const csvFile = new File([blob], `${csvOptionsByRoom.filename}.csv`, { type: 'text/csv;charset=utf-8;' });
     
       saveAs(csvFile);
     };

    // Original Code

    //  const handleExportRowsAsPDFByRoom = (rows) => {
    //     const doc = new jsPDF('l', 'mm', 'a4'); // 'l' for landscape
    //     const tableData = rows?.map(({ original }) => [
    //         `${original.ROOM_NBR || '-'}`,
    //        `${original.CATALOG_NBR || '-'}`,
    //         `${original.TotalStudents || '-'}`,
    //         `${original.PresentStudents || '-'}`,
    //         `${original.AbsentStudents || '-'}`,
    //         `${original.UFMStudents || '-'}`,
    //         `${original.DebarredStudents || '-'}`,
    //         `${parseExcelDate(original.EXAM_DT) || '-'}`,
    //         `${convertedTime(original.EXAM_START_TIME) || '-'}`,
    //         `${original.DESCR || '-'}`,
    //         `"${original.EXAM_TYPE_CD || '-'}"`,

    //     ]);
    
    //     autoTable(doc, {
    //         head: [tableHeadByRoom],
    //         body: tableData,
    //         theme: 'striped',
    //         styles: {
    //             fontSize: 7, // Reduce font size
    //             cellPadding: 1, // Reduce cell padding
    //             overflow: 'linebreak'
    //         },
    //         headStyles: {
    //             fillColor: [22, 160, 133],
    //             textColor: [255, 255, 255],
    //             fontSize: 9, // Adjust font size for header
    //             halign: 'center'
    //         },
    //         bodyStyles: {
    //             valign: 'middle',
    //             halign: 'center'
    //         },
    //         alternateRowStyles: {
    //             fillColor: [240, 240, 240]
    //         },
    //         columnStyles: {
    //             0: { cellWidth:  25},
    //             1: { cellWidth: 25 },
    //             2: { cellWidth: 25 },
    //             3: { cellWidth: 25 },
    //             4: { cellWidth: 25 },
    //             5: { cellWidth: 25 },
    //             6: { cellWidth: 25 },
    //             7: { cellWidth: 25 },
    //             8: { cellWidth:  25},
    //             9: { cellWidth: 60 },
    //         },
    //         margin: { top: 20, bottom: 20, left: 20, right: 20 }
    //     });
    
    //     doc.save(`ReportByCategory-${currentDate}.pdf`);
    // };


// Seprate PdF code for rooms

// const handleExportRowsAsPDFByRoom = (rows) => {
//   // Group rows by room number
//   const groupedByRoom = rows.reduce((acc, row) => {
//       const roomNbr = row.original.ROOM_NBR || 'Unknown Room';
//       if (!acc[roomNbr]) {
//           acc[roomNbr] = [];
//       }
//       acc[roomNbr].push(row);
//       return acc;
//   }, {});

//   // Iterate over each room group to create separate PDF files
//   Object.keys(groupedByRoom).forEach((roomNbr) => {
//       const roomRows = groupedByRoom[roomNbr];
//       const doc = new jsPDF('p', 'mm', 'a4');
//       const pageWidth = doc.internal.pageSize.width;
//       const pageHeight = doc.internal.pageSize.height;
//       const margin = 10;

//       // Add logo (if available)
//       try {
//           doc.addImage('BASE64_ENCODED_LOGO_STRING', 'PNG', margin, margin, 40, 20);
//       } catch (error) {
//           console.warn('Failed to add logo to PDF:', error);
//       }

//       // Add header
//       doc.setFillColor(223, 76, 6);
//       doc.rect(0, 0, pageWidth, 40, 'F');
//       doc.setTextColor(255, 255, 255);
//       doc.setFontSize(20);
//       doc.text('SHARDA UNIVERSITY', pageWidth / 2, 15, { align: 'center' });
//       doc.setFontSize(14);
//       doc.text('ANSWER SHEET SUMMARY REPORT', pageWidth / 2, 25, { align: 'center' });
//       doc.text('End-Semester Examination (2023-24)', pageWidth / 2, 35, { align: 'center' });

//       // Add room info
//       doc.setTextColor(0);
//       doc.setFontSize(12);
//       doc.text(`Room No.: ${roomNbr}`, margin, 50);
//       doc.text(`Date: ${roomRows?.[0]?.original?.EXAM_DT || '-'}`, pageWidth / 2, 50, { align: 'center' });

//       // Add main table
//       const mainTableHeaders = [
//           [
//               { content: 'Sl No', rowSpan: 2 },
//               { content: 'Course Code', rowSpan: 2 },
//               { content: 'Shift Time', rowSpan: 2 },
//               { content: 'Examinees (Nos.)', colSpan: 5 }
//           ],
//           ['Strength', 'Appeared', 'Absent', 'UFM', 'Debarred']
//       ];

//       const mainTableBody = roomRows.map((row, index) => [
//           index + 1,
//           row.original.CATALOG_NBR || '-',
//           convertedTime(row.original.EXAM_START_TIME) || '-',
//           row.original.TotalStudents || '-',
//           row.original.PresentStudents || '-',
//           row.original.AbsentStudents || '-',
//           row.original.UFMStudents || '-',
//           row.original.DebarredStudents || '-'
//       ]);

//       autoTable(doc, {
//           head: mainTableHeaders,
//           body: mainTableBody,
//           startY: 60,
//           theme: 'grid',
//           styles: { fontSize: 10, cellPadding: 2 },
//           headStyles: { fillColor: [242, 242, 242], textColor: [0, 0, 0], fontStyle: 'bold' },
//       });

//       // Add UFM row
//       const ufmY = doc.lastAutoTable.finalY + 5;
//       doc.text('No of Copy used in UFM', margin, ufmY);

//       // Add copies table
//       const copiesTableHeaders = [
//           ['Copies Issued for Room (Nos)', 'Used Copies (Nos)', 'Unused Copies (Nos)']
//       ];
//       const copiesTableBody = [
//           ['-', '-', '-'] // Replace with actual data if available
//       ];

//       autoTable(doc, {
//           head: copiesTableHeaders,
//           body: copiesTableBody,
//           startY: ufmY + 10,
//           theme: 'grid',
//           styles: { fontSize: 10, cellPadding: 2 },
//           headStyles: { fillColor: [242, 242, 242], textColor: [0, 0, 0], fontStyle: 'bold' },
//       });

//       // Add footer
//       doc.setFillColor(223, 76, 6);
//       doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
//       doc.setTextColor(255, 255, 255);
//       doc.setFontSize(10);
//       doc.text('© 2023 Sharda Tech Pvt. Ltd. All Rights Reserved.', pageWidth / 2, pageHeight - 10, { align: 'center' });

//       // Save the PDF for the current room
//       const examDate = roomRows?.[0]?.original?.EXAM_DT || 'Unknown Date';
//       doc.save(`AnswerSheetSummary-${roomNbr}-${examDate}.pdf`);
//   });
// };

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
  
          
//       // Add header
//       doc.setFillColor(35, 57, 76);
//       doc.rect(0, 0, pageWidth, 45, 'F');
//       doc.setTextColor(255, 255, 255);
//       doc.setFontSize(24);
//       doc.text('Sharda University', pageWidth / 2, 10, { align: 'center' });
//       doc.setFontSize(16);
//       doc.text('Greater Noida', pageWidth / 2, 20, { align: 'center' });
//       doc.setFontSize(18);
//       doc.text('ANSWER SHEET SUMMARY REPORT', pageWidth / 2, 30, { align: 'center' });
//       doc.text(`${roomRows?.[0]?.original?.EXAM_TYPE_CD === "ETE" ? 'End Semester ': 'Mid Semester'} Examination (${roomRows?.[0]?.original?.STRM})`, pageWidth / 2, 40, { align: 'center' });

//       // Add room info
//       doc.setTextColor(0);
//       doc.setFontSize(12);
//       doc.text(`Room No.: ${roomNbr}`, margin, 50);
//       doc.text(`Date: ${parseExcelDate(roomRows?.[0]?.original?.EXAM_DT) || '-'}`, pageWidth / 2, 50, { align: 'center' });
//       doc.text(`Shift Time: ${convertedTime(shift)}`, pageWidth - margin, 50, { align: 'right' });

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
  
          
//          // Add footer
//       doc.setFillColor(35, 57, 76);
//       doc.rect(0, pageHeight - 10, pageWidth, 20, 'F');
//       doc.setTextColor(255, 255, 255);
//       doc.setFontSize(10);
//       doc.text('© 2024 Sharda Tech Pvt. Ltd. All Rights Reserved.', pageWidth / 2, pageHeight - 4, { align: 'center' });
//     });
  
//       // Save the single PDF with all rooms
//       doc.save(`AnswerSheetSummary-AllRooms-${parseExcelDate(rows?.[0]?.original?.EXAM_DT) || '-'}.pdf`);
//   };

const handleExportRowsAsPDFByRoom = (rows) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 10;

  const headerColor = [242, 242, 242];
  const headerTextColor = [0, 0, 0];
  const footerColor = [242, 242, 242];
  const footerTextColor = [0, 0, 0];

  const drawHeader = (roomNbr, shift, examType, strm, examDate) => {
    doc.setFillColor(...headerColor);
    doc.rect(0, 0, pageWidth, 33, 'F');

    try {
      doc.addImage(ShardaLogoBase64, 'PNG', margin, margin, 60, 15);
    } catch (error) {
      console.warn('Failed to add logo to PDF:', error);
    }

    doc.setTextColor(...headerTextColor);
    doc.setFontSize(18);
    doc.text('Sharda University, Greater Noida', pageWidth / 1.5 , 10, { align: 'center' });
    // doc.setFontSize(14);
    // doc.text('Greater Noida', pageWidth / 1.5, 20, { align: 'center' });
    doc.setFontSize(14);
    doc.text('ANSWER SHEET SUMMARY REPORT', pageWidth / 1.5 , 20, { align: 'center' });
    doc.text(`${examType} Examination (${getAcademicYear(strm)})`, pageWidth / 1.5 , 28, { align: 'center' });

    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.text(`Room No.: ${roomNbr}`, margin, 43);
    doc.text(`Date: ${examDate || '-'}`, pageWidth / 2, 43, { align: 'center' });
    doc.text(`Shift Time: ${shift}`, pageWidth - margin, 43, { align: 'right' });
  };

  const drawFooter = () => {
    doc.setFillColor(...footerColor);
    doc.rect(0, pageHeight - 10, pageWidth, 20, 'F');
    doc.setTextColor(...footerTextColor);
    doc.setFontSize(10);
    doc.text('© 2024 Sharda Tech Pvt. Ltd. All Rights Reserved.', pageWidth / 2, pageHeight - 4, { align: 'center' });
  };

  const drawSignatures = (invigilatorNames) => {
    doc.setFontSize(12);
    doc.text('Name of Invigilators:', margin, pageHeight - 55);
    doc.text('Signature of Copy Collector:', pageWidth - margin - 10, pageHeight - 55, { align: 'right' });

    // Dynamically add each invigilator's name and a line for their signature
    invigilatorNames.forEach((name, i) => {
      doc.text(`${i + 1}. ${name}`, margin, pageHeight - 45 + (i * 10));
      doc.text('____________________', pageWidth - margin - 10, pageHeight - 45 + (i * 10), { align: 'right' });
    });
    
  };

  const groupedByRoomAndShift = rows.reduce((acc, row) => {
    const roomNbr = row.original.ROOM_NBR || 'Unknown Room';
    const shift = convertedTime(row.original.EXAM_START_TIME) || 'Unknown Shift';
    const key = `${roomNbr}$${shift}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(row);
    return acc;
  }, {});

  Object.entries(groupedByRoomAndShift).forEach(([key, groupRows], index) => {
    if (index !== 0) doc.addPage();

    // Collect all invigilator names (assuming created_by, updated_by, and possibly others)
    const invigilators = new Set();
    groupRows.forEach(row => {
      if (row.original.created_by) invigilators.add(row.original.created_by);
      // if (row.original.updated_by) invigilators.add(row.original.updated_by);
      // Add any other relevant fields that might contain invigilator names here
    });

    // Convert Set to Array to iterate and display
    const invigilatorNames = Array.from(invigilators);

    const [roomNbr, shift] = key.split('$');
    const examType = groupRows[0]?.original?.EXAM_TYPE_CD === "ETE" ? 'End Semester' : 'Mid Semester';
    const strm = groupRows[0]?.original?.STRM;
    const examDate = parseExcelDate(groupRows[0]?.original?.EXAM_DT, 'dd-MM-yyyy');

    drawHeader(roomNbr, shift, examType, strm, examDate);

    const mainTableHeaders = [
      [
        { content: 'Sl No', rowSpan: 2 },
        { content: 'Course Code', rowSpan: 2 },
        { content: 'Strength', rowSpan: 2 },
        { content: 'Appeared', colSpan: 2 },
        { content: 'Non-Appeared', colSpan: 2 }
      ],
      ['Present', 'UFM', 'Absent', 'Debarred']        
    ];

    const mainTableBody = groupRows.map((row, index) => [
      index + 1,
      row.original.CATALOG_NBR || '-',
      row.original.TotalStudents || '-',
      row.original.PresentStudents || '-',
      row.original.UFMStudents || '-',
      row.original.AbsentStudents || '-',
      row.original.DebarredStudents || '-'
    ]);

    autoTable(doc, {
      head: mainTableHeaders,
      body: mainTableBody,
      startY: 50,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [242, 242, 242], textColor: [0, 0, 0], fontStyle: 'bold' },
    });

    drawSignatures(invigilatorNames);
    drawFooter();
  });

  doc.save(`AnswerSheetSummary-AllRooms-${parseExcelDate(rows?.[0]?.original?.EXAM_DT) || '-'}.pdf`);
};



  
  
  
  
      const renderTable = () => {
          if (Platform.OS === 'web') {
            switch (currentTab) {
              case "ReportByStudents":
                return (
                  <React.Suspense fallback={<Text>Loading...</Text>}>
                    <WebTable
                      data={tableData}
                      columns={WebColumns}
                      exportHead={tableHead}
                      handleExportData={handleExportData}
                      handleExportRows={handleExportRows}
                      handleRefreshData={() => handleDateClick(examSelectedDate)}
                      handleExportRowsAsPDF={handleExportRowsAsPDF}
                      style={styles.tablebtn}
                      loading={loading}
                    />
                  </React.Suspense>
                );
              case "ReportByCatelog":
                return (
                  <React.Suspense fallback={<Text>Loading...</Text>}>
                    <WebTable
                      data={tableDataByCatelog}
                      columns={WebColumnsByCatelog}
                      exportHead={tableHeadByCatelog}
                      handleExportData={handleExportDataByCatelog}
                      handleExportRows={handleExportRowsByCatelog}
                      handleRefreshData={() => handleDateClick(examSelectedDate)}
                      handleExportRowsAsPDF={handleExportRowsAsPDFByCategory}
                      style={styles.tablebtn}
                      loading={loading}
                    />
                  </React.Suspense>
                );
                case "ReportByRoom":
                  return (
                    <React.Suspense fallback={<Text>Loading...</Text>}>
                      <WebTable
                        data={tableDataByRoom}
                        columns={WebColumnsByRoom}
                        exportHead={tableHeadByRoom}
                        handleExportData={handleExportDataByRoom}
                        handleExportRows={handleExportRowsByRoom}
                        handleRefreshData={() => handleDateClick(examSelectedDate)}
                        handleExportRowsAsPDF={handleExportRowsAsPDFByRoom}                      
                        style={styles.tablebtn}
                        loading={loading}
                      />
                    </React.Suspense>
                  );
              default:
                return <Text>Module Operation Failed</Text>;
            }
          } else {
            return <Text>Unsupported Platform</Text>;
          }
        };
        
  
    return (
      // loading ? (
      //   <ActivityIndicator size="large" color="#0000ff" />
      // ) :
      (<View style={styles.container}>
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
              refreshing={refreshing}
              horizontal
              keyExtractor={(item) => item.EXAM_DT}
            /> : <Text style={styles.nodatestext}>There is no data available for the dates between {startDate.toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: '2-digit'}).toUpperCase().replace(/ /g, '-')} to {endDate.toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: '2-digit'}).toUpperCase().replace(/ /g, '-')}</Text>}
          </View>
        </View>
  
        <View style={styles.tabContainer}>
          <Pressable style={[styles.tabButton ,styles.tabWrap]} onPress={() => setCurrentTab('ReportByStudents')}>
            <Text style={currentTab === 'ReportByStudents' ? styles.activeTabText : styles.tabText}>Students Report</Text>
          </Pressable>
          <Pressable style={[styles.tabButton,styles.tabWrap]} onPress={() => setCurrentTab('ReportByCatelog')}>
            <Text style={currentTab === 'ReportByCatelog' ? styles.activeTabText : styles.tabText}>Catalog Report</Text>
          </Pressable>
          <Pressable style={[styles.tabButton,styles.tabWrap]} onPress={() => setCurrentTab('ReportByRoom')}>
            <Text style={currentTab === 'ReportByRoom' ? styles.activeTabText : styles.tabText}>Rooms Report </Text>
          </Pressable>
        </View>
        {renderTable()}
        </View>)
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
    },
    tabContainer: {
      flexDirection: 'row',
      // justifyContent: 'space-around',
      backgroundColor: '#f8f8f8',
      padding: 10,
    },
    tabButton: {
      // flex: 1,
      // alignItems: 'center',
      padding: 10,
    
      
    },
  
   
    tabText: {
      fontSize: 16,
      color: '#000',
      fontWeight:"600",
      backgroundColor:'#ccc',
      padding:10,
      borderRadius:5,
     
    },
    activeTabText: {
      fontSize: 16,
      color: '#fff',
      fontWeight: '600',
      backgroundColor:"green",
      borderRadius:5,
      padding:10,
    },
    itemContainer: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    itemText: {
      fontSize: 16,
    },
  });
  
  export default ReportScreen;
  