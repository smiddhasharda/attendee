import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Dimensions, FlatList, Pressable, Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import DropDownPicker from "react-native-dropdown-picker";
import PieChart from "./PieChart";
import { fetch,view } from "../../AuthService/AuthService";
import { useToast } from "../../globalComponent/ToastContainer/ToastContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Learn() {
  const [drawerOpen, setDrawerOpen] = useState({
    examDrawer:false,
    roomDrawer: false,
    shiftDrawer: false,
  });


  const { addToast } = useToast();
  const [examDates, setExamDates] = useState([]);
  const [examSelectedDate, setExamSelectedDate] = useState("");
  const [examRoomList, setExamRoomList] = useState([]);
  const [examSelectedRoom, setExamSelectedRoom] = useState("");
  const [examSelectedshift, setExamSelectedShift] = useState("");
  const [examShiftList, setExamShiftList] = useState([]);
  const [examReportData, setExamReportData] = useState([]);
  const examlist=[
 
    { label: 'AI', value: 'AI' },
    { label: '.Net', value: '.Net' },
    { label: 'C', value: 'C' },
    { label: 'C++', value: 'C++' },
    { label: 'AI', value: 'AI' },
  ];

  const [sampleData , setSampleData] = useState();
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
          customQuery: "SELECT DISTINCT EXAM_DT FROM tbl_report_master ;",
        },
        authToken
      );

      if (response) {
        let ExamDateList = response?.data;
        setExamDates(ExamDateList || []);
        setExamSelectedDate(ExamDateList?.[0]?.EXAM_DT);
        handleGetExamRoomList(ExamDateList?.[0]?.EXAM_DT);
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
          customQuery: `SELECT JSON_ARRAYAGG(room) AS ReportData FROM ( SELECT JSON_OBJECT( 'label', ROOM_NBR, 'value', ROOM_NBR, 'shifts', JSON_ARRAYAGG( JSON_OBJECT('label', EXAM_START_TIME, 'value', EXAM_START_TIME) ) ) AS room FROM tbl_report_master WHERE EXAM_DT = '${date}' GROUP BY ROOM_NBR ) AS rooms; `,
        },
        authToken
      );
      if (response) {
        setExamRoomList(response.data?.[0]?.ReportData);
        setExamSelectedRoom(response.data?.[0]?.ReportData?.[0]);
        setExamShiftList(response.data?.[0]?.ReportData?.[0]?.shifts);
        setExamSelectedShift(response.data?.[0]?.ReportData?.[0]?.shifts?.[0]);
        handleGetExamReport(
          date,
          response.data?.[0]?.ReportData?.[0]?.label,
          response.data?.[0]?.ReportData?.[0]?.shifts?.[0]?.label
        );
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
          customQuery: `select JSON_ARRAYAGG(json_object('PK_Report_Id',p.PK_Report_Id,'EMPLID',EMPLID,'EXAM_DT',p.EXAM_DT,'ROOM_NBR',p.ROOM_NBR,'EXAM_START_TIME',p.EXAM_START_TIME,'STRM',p.STRM,'CATALOG_NBR',p.CATALOG_NBR,'PTP_SEQ_CHAR',p.PTP_SEQ_CHAR,'NAME_FORMAL',p.NAME_FORMAL,'ADM_APPL_NBR',p.ADM_APPL_NBR,'DESCR',p.DESCR,'DESCR2',p.DESCR2,'DESCR3',p.DESCR3,'Status',p.Status,'isActive',p.isActive,'copyData',( SELECT CAST( CONCAT('[', GROUP_CONCAT( JSON_OBJECT( 'PK_CopyId',q.PK_CopyId,'FK_ReportId',q.FK_ReportId,'EMPLID',q.EMPLID,'copyNumber',q.copyNumber,'alternateCopyNumber1',q.alternateCopyNumber1,'alternateCopyNumber2',q.alternateCopyNumber2,'alternateCopyNumber3',q.alternateCopyNumber3,'alternateCopyNumber4',q.alternateCopyNumber4,'alternateCopyNumber5',q.alternateCopyNumber5,'alternateCopyNumber6',q.alternateCopyNumber6,'isActive',q.isActive) ), ']') AS JSON ) FROM tbl_copy_master q WHERE q.FK_ReportId = p.PK_Report_Id ))) AS ReportMaster from tbl_report_master p where EXAM_DT = '${date}' AND ROOM_NBR = '${room}' AND EXAM_START_TIME = '${shift}'`,
        },
        authToken
      );
      if (response) {
        setExamReportData(response.data?.[0]?.ReportMaster || []);
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

  const handleGetTestView = async () => {
    try {
      const authToken = await checkAuthToken();
      const response = await view(
        {
          operation: "custom",
          tblName: "PS_S_PRD_PHOTO_VW",
          data: '',
          conditionString: '',
          checkAvailability: '',
          customQuery: `SELECT * from PS_S_PRD_PHOTO_VW`,
        },
        authToken
      );

      if (response) {
        setSampleData(response.data);
      }
    } catch (error) {
      setLoading(false);
      handleAuthErrors(error);
    }
  };

  const handleDateClick = (date) => {
    setExamSelectedDate(date);
    handleGetExamRoomList(date);
  };

  const handleChangeRoom = (data) => {
    setExamSelectedRoom(data);
    setExamShiftList(data?.shifts);
    setExamSelectedShift(data?.shifts?.[0]);
    handleGetExamReport(
      examSelectedDate,
      data?.label,
      data?.shifts?.[0]?.label
    );
  };
  handleChangeShift = (data) => {
    setExamSelectedShift(data);
    handleGetExamReport(examSelectedDate, examSelectedRoom?.label, data?.label);
  };

  const binaryToBase64 = (binary) => {
    return btoa(
      new Uint8Array(binary)
        .reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
  };
  const binaryData = sampleData?.[0]?.EMPLOYEE_PHOTO;
  const base64Image = binaryToBase64(binaryData);

  console.log("base64Image : ",binaryData)


  useEffect(() => {
    handleGetExamDateList();
    handleGetTestView();
  }, []);
  return (
    <ScrollView>
      <View style={styles.container}>
        {/* <Text style={styles.heading}>Student Report</Text> */}
        {/* <Image source={{ uri: `data:image/png;base64,${base64Image}` }} style={{ width: 100, height: 100, borderRadius: 50 }} /> */}
  
        <View style={styles.datesWrap}>
          <View style={styles.dates}>
            <FlatList
              data={examDates}
              renderItem={({ item }) => (
                <Pressable onPress={() => handleDateClick(item.EXAM_DT)}>
                  <View
                    style={[
                      styles.dateItem,
                      item.EXAM_DT === examSelectedDate && styles.activebox,
                    ]}
                  >
                    <Text style={styles.dateDay}>
                      {item.EXAM_DT.split("-")[1]}
                    </Text>
                    <Text style={styles.dateNumber}>
                      {item.EXAM_DT.split("-")[0]}
                    </Text>
                    <Text style={styles.dateMonth}>
                      {item.EXAM_DT.split("-")[2]}
                    </Text>
                  </View>
                </Pressable>
              )}
              horizontal={true}
              // showsHorizontalScrollIndicator={false}
              // scrollEnabled={false}
            />
          </View>
          </View>
      
            <View style={styles.dropdownWrap}>
            <View style={styles.dropdownContainer}>
                  <Text style={styles.label}>Exam</Text>
                  <DropDownPicker
                    open={drawerOpen.examDrawer}
                    value={examSelectedshift?.label}
                    items={examlist}
                    setOpen={() =>
                      setDrawerOpen({ examDrawer: !drawerOpen.examDrawer })
                    }
                    onSelectItem={(value) => handleChangeShift(value)}
                    style={styles.dropdown}
                    dropDownStyle={styles.dropDownList}
                    // dropDownStyle={{ backgroundColor: "#fafafa" }}
                    dropDownMaxHeight={150}
                    dropDownDirection="BOTTOM"
                    containerStyle={styles.rolePicker}
              />
              </View>
            <View style={styles.dropdownContainer}>
            <Text  style={styles.label}>Rooms</Text>
              <DropDownPicker
                open={drawerOpen.roomDrawer}
                value={examSelectedRoom?.label}
                items={examRoomList}
                setOpen={() =>
                  setDrawerOpen({ roomDrawer: !drawerOpen.roomDrawer })
                }
                onSelectItem={(value) => handleChangeRoom(value)}
                style={styles.dropdown}
                dropDownStyle={styles.dropDownList}
                // dropDownStyle={{ backgroundColor: "#fafafa" }}
                dropDownMaxHeight={150}
                dropDownDirection="TOP"
                containerStyle={styles.rolePicker}
              />
              </View>
              <View style={styles.dropdownContainer}>
                  <Text style={styles.label}>Times</Text>
                  <DropDownPicker
                    open={drawerOpen.shiftDrawer}
                    value={examSelectedshift?.label}
                    items={examShiftList}
                    setOpen={() =>
                      setDrawerOpen({ shiftDrawer: !drawerOpen.shiftDrawer })
                    }
                    onSelectItem={(value) => handleChangeShift(value)}
                    style={styles.dropdown}
                    dropDownStyle={styles.dropDownList}
                    // dropDownStyle={{ backgroundColor: "#fafafa" }}
                    dropDownMaxHeight={150}
                    dropDownDirection="TOP"
                    containerStyle={styles.rolePicker}
              />
              </View>
            </View>
       
          <View style={styles.boxtable}>  
              <View style={styles.tableWrap}>
                <View style={[styles.tableHeader]}>
                  <Text  style={styles.tableHeaderText}>System Id</Text>
                  <Text style={styles.tableHeaderText}>Roll Number</Text>
                  <Text style={styles.tableHeaderText}>Name</Text>
                  <Text style={styles.tableHeaderText}>Room Number</Text>
                  <Text style={styles.tableHeaderText}>Seat Number</Text>
                  <Text style={styles.tableHeaderText}>Status</Text>  
                  <Text style={styles.tableHeaderText}>School</Text>                
                  <Text style={styles.tableHeaderText}>Graduation</Text>                
                  <Text style={styles.tableHeaderText}>Stream</Text>                
              
                </View>
                {examReportData?.map((reportData) => (
                  <View style={styles.listItem}>
                    <Text  style={styles.listItemText}>{reportData.EMPLID}</Text>
                    <Text style={styles.listItemText}>{reportData.ADM_APPL_NBR}</Text>
                    <Text style={styles.listItemText}>{reportData.NAME_FORMAL}</Text>
                    <Text style={styles.listItemText}>{reportData.ROOM_NBR}</Text>
                    <Text style={styles.listItemText}>{reportData.PTP_SEQ_CHAR}</Text>
                    <Text style={styles.listItemText}>{reportData.Status}</Text>
                    <Text style={styles.listItemText}>{reportData.DESCR}</Text>
                    <Text style={styles.listItemText}>{reportData.DESCR2}</Text>
                    <Text style={styles.listItemText}>{reportData.DESCR3}</Text>
                  </View>
                ))}
              </View>     
          </View>
        <Text>Total Student:50</Text>
        
        <PieChart />
      </View>
    </ScrollView>
  );
}

export default Learn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  boxtable: {
    backgroundColor:"#fff",
    padding:20,
    // padding: 5,
    // flex: 1,
    // marginTop: 20,
    // marginBottom: 20,
  },
  heading: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  tableWrap: {
    flexDirection: 'column',
    // borderWidth: 1,
    // borderColor: '#000',
    // padding:10,
   
  },
  row: {
    flexDirection: "row",
    // borderBottomWidth: 1,
    // borderBottomColor: "#ccc",
    marginBottom:4,
  },
  header: {
    backgroundColor: "#f0f0f0",
  },
  headerText: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    fontWeight: "bold",
    textAlign: "center",
  },
  cell: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  datesWrap:{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
  },
  dates: {
    width:"auto",
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#dddedf",
    borderTopWidth: 0,
    marginTop: 0,
  },

  dateItem: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginRight: 6,
    alignItems: "center",
    width: 45,
  },

  dateNumber: {
    fontSize: 16,
    fontWeight: "bold",
  },
  dateDay: {
    fontSize: 12,
    marginBottom: 5,
  },
  dateMonth: {
    fontSize: 12,
    marginTop: 5,
  },
  examstatus: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 10,
  },

  roomNumber: {
    // flexDirection: "row",
    // flexWrap: "wrap",
    marginBottom: 10,
    padding: 10,
  },
  box: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: Dimensions.get("window").width / 1 - 10,
    backgroundColor: "#eaeaea",
    // height: 55,
    // textAlign: "center",
    // alignItems: "center",
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    flexDirection: "row",
  },
  boxtext: {
    // alignItems:"center",
    flexDirection: "row",
    marginLeft: 10,
    color: "#000",
  },
  examtime: {
    alignItems: "flex-start",
    color: "#a79f9f",
    marginRight: 10,
    marginLeft: 40,
  },
  examname: {
    fontWeight: "bold",
    marginRight: 30,
    maxWidth: 80,
    color: "#000",
  },
  activebox: {
    backgroundColor: "#0cb551",
    color: "#fff",
  },
  activetext: {
    color: "#fff",
  },
  inactivetext: {
    color: "#fff",
  },
  inactivebox: {
    backgroundColor: "#e50d0d",
  },

  dropdownmain:{
   flexDirection:"row",
   justifyContent:"space-between",
   width:"100%"

  },
  dropdownWrap: {
    // width: '100%',
    zIndex: 1000,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom:10,
    padding:10,
  
  },
  dropdown: {
    width: 160,
    minHeight:30,
  },
  rolePicker: {
    width: 160,
    height:"auto",
  },
  
  tableHeaderText: {
    fontWeight: 'bold',
    color:"#fff",
    textAlign:"center",
    alignItems:"center",
    fontSize:16,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent:"space-between",
    backgroundColor: "rgb(17, 65, 102)",
    flexWrap:"wrap",
    paddingVertical: 10,
    paddingHorizontal: 15,
    // marginBottom: 10,
    borderRadius:5,
  },
  listItem: {
    flexDirection: 'row',
    flexWrap:"wrap",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',   
  },
  listItemText: {
    flex: 1,
  },
  label: {
    // flex: 1,
    // fontWeight: "bold",
    fontWeight: "bold",
    color: "#333",
    width: "40%",
  },
});
