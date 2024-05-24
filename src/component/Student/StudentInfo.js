import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from "react-native";
import { Ionicons, FontAwesome, AntDesign,MaterialCommunityIcons ,MaterialIcons,Entypo} from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useToast } from "../../globalComponent/ToastContainer/ToastContext";
import CodeScanner from "../../globalComponent/CodeScanner/CodeScanner";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { insert, fetch, update,remove,view } from "../../AuthService/AuthService";

const StudentInfo = () => {
  const route = useRoute();
  const { showToast } = useToast();
  const [studentDetails, setStudentDetails] = useState({});
  const [courseDetails, setCourseDetails] = useState({});
  const [attendanceDetails, setAttendanceDetails] = useState({});
  const { room_Nbr, catlog_Nbr, system_Id, seat_Nbr, exam_Dt, startTime, reportId, navigation, userAccess } = route.params;
  const UserAccess = userAccess?.module?.find((item)=> item?.FK_ModuleId === 6);
  const [copiesData, setCopiesData] = useState([
    // {
    //   id: 0,
    //   mainCopy: "",
    //   alternateCopies: [],
    // },
  ]);
  const [tempCopyNumber, setTempNumber] = useState("");
  const [mainCopyIndex, setMainCopyIndex] = useState("");
  const [alternateCopyIndex, setAlternateCopyIndex] = useState("");
  const [tempCopyType, setTempCopyType] = useState("");
  const [copyList, setCopyList] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false);


  const sampleStudentData = [
    {
      NAME_FORMAL: "Dev Saxena",
      EMPLID: "2023408405",
      ADM_APPL_NBR: "00021604",
      STRM: "1501",
      DESCR: "School of Dental Sciences",
      DESCR2: "Bachelor of Dental Science",
      DESCR3: "Mechanical",
    },
    {
      NAME_FORMAL: "Medha Yadav",
      EMPLID: "2023408406",
      ADM_APPL_NBR: "00021604",
      STRM: "1501",
      DESCR: "School of Dental Sciences",
      DESCR2: "Bachelor of Dental Science",
      DESCR3: "Mechanical",
    },
    {
      NAME_FORMAL: "Rohit Mehra",
      EMPLID: "2023408407",
      ADM_APPL_NBR: "00021604",
      STRM: "1501",
      DESCR: "School of Dental Sciences",
      DESCR2: "Bachelor of Dental Science",
      DESCR3: "Mechanical",
    },
    {
      NAME_FORMAL: "Saurabh Middha",
      EMPLID: "2023408408",
      ADM_APPL_NBR: "00021604",
      STRM: "1501",
      DESCR: "School of Dental Sciences",
      DESCR2: "Bachelor of Dental Science",
      DESCR3: "Mechanical",
    },
    {
      NAME_FORMAL: "Aman Bhadoriya",
      EMPLID: "2023408409",
      ADM_APPL_NBR: "00021604",
      STRM: "1501",
      DESCR: "School of Dental Sciences",
      DESCR2: "Bachelor of Dental Science",
      DESCR3: "Mechanical",
    },
    {
      NAME_FORMAL: "Abhishak patel",
      EMPLID: "2023408410",
      ADM_APPL_NBR: "00021604",
      STRM: "1501",
      DESCR: "School of Dental Sciences",
      DESCR2: "Bachelor of Dental Science",
      DESCR3: "Mechanical",
    },
  ];

  const sampleCourseData = [
    { SU_PAPER_ID: "1000021", CATALOG_NBR: "BPO353", DESCR100: "Enzymology" },
    { SU_PAPER_ID: "1000021", CATALOG_NBR: "BPO353", DESCR100: "Enzymology" },
    { SU_PAPER_ID: "1000021", CATALOG_NBR: "BPO353", DESCR100: "Enzymology" },
    { SU_PAPER_ID: "1000021", CATALOG_NBR: "BPO353", DESCR100: "Enzymology" },
    { SU_PAPER_ID: "1000021", CATALOG_NBR: "BPO353", DESCR100: "Enzymology" },
  ];

  const sampleAttendanceData = [
    {
      EMPLID: "2023408405",
      STRM: "2301",
      PERCENTCHG: "65",
      CATALOG_NBR: "BPO353",
      PERCENTAGE: "85.71",
    },
    {
      EMPLID: "2023408406",
      STRM: "2301",
      PERCENTCHG: "65",
      CATALOG_NBR: "BPO353",
      PERCENTAGE: "85.71",
    },
    {
      EMPLID: "2023408407",
      STRM: "2301",
      PERCENTCHG: "65",
      CATALOG_NBR: "BPO353",
      PERCENTAGE: "85.71",
    },
    {
      EMPLID: "2023408408",
      STRM: "2301",
      PERCENTCHG: "65",
      CATALOG_NBR: "BPO353",
      PERCENTAGE: "85.71",
    },
    {
      EMPLID: "2023408409",
      STRM: "2301",
      PERCENTCHG: "65",
      CATALOG_NBR: "BPO353",
      PERCENTAGE: "85.71",
    },
    {
      EMPLID: "2023408410",
      STRM: "2301",
      PERCENTCHG: "65",
      CATALOG_NBR: "BPO353",
      PERCENTAGE: "85.71",
    },
  ];

  const checkAuthToken = useCallback(async () => {
    const authToken = await AsyncStorage.getItem("authToken");

    if (!authToken) {
      showToast("Authentication token not available", "error");
      throw new Error("Authentication token not available");
    }

    return authToken;
  }, [showToast]);

  const handleMainCopyChange = (copyNumber, index) => {
    const updatedCopies = [...copiesData];
    updatedCopies[index].mainCopy = copyNumber;
    setCopiesData(updatedCopies);
    setTempNumber("");
  };

  const handleAlternateCopyChange = (copyNumber, copyIndex, index) => {
    const updatedCopies = [...copiesData];
    updatedCopies[index].alternateCopies[copyIndex] = copyNumber;
    setCopiesData(updatedCopies);
    setTempNumber("");
  };

  const handleAddAlternateCopy = (index) => {
    const updatedCopies = [...copiesData];
    updatedCopies[index].alternateCopies.push("");
    setCopiesData(updatedCopies);
  };

  const handleRemoveAlternateCopy = (copyIndex, index) => {
    const updatedCopies = [...copiesData];
    updatedCopies[index].alternateCopies.splice(copyIndex, 1);
    setCopiesData(updatedCopies);
  };

  const handleAddCopy = () => {
    setCopiesData([
      ...copiesData,
      {
        id: copiesData.length,
        mainCopy: "",
        alternateCopies: [],
      },
    ]);
  };

  const handleRemoveCopy = (index) => {
    const updatedCopies = copiesData.filter((copy, i) => i !== index);
    setCopiesData(updatedCopies);
  };

  const handleScanBarcode = (scannedCopyNumber, copyType, index, copyIndex) => {
    handleCancel();
    copyType === "AnswerSheet"
      ? handleMainCopyChange(scannedCopyNumber, index)
      : handleAlternateCopyChange(scannedCopyNumber, copyIndex, index);
  };

  const handleSaveCopy = (copyType, copyNumber, index, copyIndex) => {
    copyType === "AnswerSheet"
      ? handleMainCopyChange(copyNumber, index)
      : handleAlternateCopyChange(copyNumber, copyIndex, index);
  };

  const renderCopyInput = (copyType, index, copyIndex) => {
    const isLastAlternateCopy =
      copyIndex === copiesData[index].alternateCopies.length - 1;
    return (
      <View style={{flexDirection:"row",  justifyContent:"space-between"}}>
      <View style={{width:"auto",}} key={copyIndex}>
      <TextInput
        style={[styles.input,]}
        placeholder={`Enter ${copyType + ' ' + copyIndex + 1} Number`}
          onChangeText={(copyNumber) => setTempNumber(copyNumber)}
   />
      </View>
      {tempCopyNumber && (
                <Pressable
                  style={styles.addButton}
                  onPress={() =>
                    handleSaveCopy(copyType, tempCopyNumber, index, copyIndex)
                  }
                >
                  <Text tyle={{color:"#fff"}}>Save</Text>
                </Pressable>
              )}
      {copyType === "Alternate" && isLastAlternateCopy && (
          <Pressable
            style={styles.removeButton}
            onPress={() => handleRemoveAlternateCopy(copyIndex, index)}
          >
            <Text style={styles.addButtonText}>
              <Entypo name="circle-with-cross" size={20} alignItems="center" />
      
       
            </Text>
          </Pressable>
        )}
      </View>
    );
  };

  const handleCancel = () => {
    setIsScanning(false);
    setTempCopyType("");
    setMainCopyIndex("");
    setAlternateCopyIndex("");
  };

  const startScanning = (copyType, index, copyIndex) => {
    setIsScanning(true);
    setTempCopyType(copyType);
    setMainCopyIndex(index);
    setAlternateCopyIndex(copyIndex);
  };

  const handleStudentInfoSubmit = async () => {
    try {
      const authToken = await checkAuthToken();
      const response = await insert(
        {
          operation: "insert",
          tblName: "tbl_report_master",
          data: {
            EMPLID: studentDetails.EMPLID,
            NAME_FORMAL: studentDetails.NAME_FORMAL,
            STRM: studentDetails.STRM,
            ADM_APPL_NBR: studentDetails.ADM_APPL_NBR,
            DESCR: studentDetails.DESCR,
            DESCR2: studentDetails.DESCR2,
            DESCR3: studentDetails.DESCR3,
            EXAM_DT: exam_Dt,
            ROOM_NBR: room_Nbr,
            EXAM_START_TIME: startTime,
            CATALOG_NBR: catlog_Nbr,
            PTP_SEQ_CHAR: seat_Nbr,
            Status:
              attendanceDetails.PERCENTAGE >= attendanceDetails.PERCENTCHG
                ? "Eligible"
                : "Debarred",
            SU_PAPER_ID: courseDetails.SU_PAPER_ID,
            DESCR100: courseDetails.DESCR100,
          },
          conditionString: "",
          checkAvailability: "",
          customQuery: "",
        },
        authToken
      );

      if (response) {
        // const studentCopyWithId = copiesData?.map(
        //   (items) => ({
        //     FK_ReportId: response?.data?.insertId,
        //     ...items,
        //   })
        // );
        const studentCopyWithId = copiesData.map((item) => {
          let newItem = {
            FK_ReportId: response?.data?.insertId,
            copyNumber: item.mainCopy,
            EMPLID: studentDetails.EMPLID,
          };
          item.alternateCopies.forEach((copy, index) => {
            newItem[`alternateCopyNumber${index + 1}`] = copy;
          });
          return newItem;
        });
        const NewResponse = await insert(
          {
            operation: "insert",
            tblName: "tbl_copy_master",
            data: studentCopyWithId,
            conditionString: "",
            checkAvailability: "",
            customQuery: "",
          },
          authToken
        );
        if (NewResponse) {
          showToast("Student Details Add Successful", "success");
          navigation.navigate("RoomDetail", {
            room_Nbr: room_Nbr,
            exam_Dt: exam_Dt,
            startTime: startTime,
            navigation,
          });
        }
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };

  const handleGetCopyData = async () => {
    try {
      const authToken = await checkAuthToken();
      const response = await fetch(
        {
          operation: "custom",
          tblName: "tbl_report_master",
          data: "",
          conditionString: "",
          checkAvailability: "",
          customQuery: `select JSON_ARRAYAGG(json_object('PK_Report_Id',p.PK_Report_Id,'copyData',( SELECT CAST( CONCAT('[', GROUP_CONCAT( JSON_OBJECT( 'PK_CopyId',q.PK_CopyId,'FK_ReportId', q.FK_ReportId,'EMPLID', q.EMPLID,'copyNumber',q.copyNumber,'alternateCopyNumber1',q.alternateCopyNumber1,'alternateCopyNumber2',q.alternateCopyNumber2,'alternateCopyNumber3',q.alternateCopyNumber3,'alternateCopyNumber4',q.alternateCopyNumber4,'alternateCopyNumber5',q.alternateCopyNumber5,'alternateCopyNumber6',q.alternateCopyNumber6) ), ']') AS JSON ) FROM tbl_copy_master q WHERE q.FK_ReportId = p.PK_Report_Id ))) AS ReportData from tbl_report_master p where PK_Report_Id = ${reportId}`,
        },
        authToken
      );

      if (response) {
        let CopyFetchDetails =
          response.data?.[0]?.ReportData?.[0]?.copyData?.map((item, index) => ({
            id: index,
            mainCopy: item.copyNumber,
            alternateCopies: [
              item.alternateCopyNumber1,
              item.alternateCopyNumber2,
              item.alternateCopyNumber3,
              item.alternateCopyNumber4,
              item.alternateCopyNumber5,
              item.alternateCopyNumber6,
            ].filter(Boolean),
          }));
        setCopiesData(CopyFetchDetails);
        let TempcopyList = response.data?.[0]?.ReportData?.[0]?.copyData?.map(
          (item) => item.PK_CopyId
        );
        setCopyList(TempcopyList);
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };

  const handleStudentInfoUpdate = async () => {
    try {
      const authToken = await checkAuthToken();
      const response = await update(
        {
          operation: "update",
          tblName: "tbl_report_master",
          data: {
            EMPLID: studentDetails.EMPLID,
            NAME_FORMAL: studentDetails.NAME_FORMAL,
            STRM: studentDetails.STRM,
            ADM_APPL_NBR: studentDetails.ADM_APPL_NBR,
            DESCR: studentDetails.DESCR,
            DESCR2: studentDetails.DESCR2,
            DESCR3: studentDetails.DESCR3,
            EXAM_DT: exam_Dt,
            ROOM_NBR: room_Nbr,
            EXAM_START_TIME: startTime,
            CATALOG_NBR: catlog_Nbr,
            PTP_SEQ_CHAR: seat_Nbr,
            Status:
              attendanceDetails.PERCENTAGE >= attendanceDetails.PERCENTCHG
                ? "Eligible"
                : "Debarred",
            SU_PAPER_ID: courseDetails.SU_PAPER_ID,
            DESCR100: courseDetails.DESCR100,
          },
          conditionString: `PK_Report_Id = ${reportId}`,
          checkAvailability: "",
          customQuery: "",
        },
        authToken
      );

      if (response) {
        const DeleteResponse = await remove(
          {
            operation: "delete",
            tblName: "tbl_copy_master",
            data: '',
            conditionString: `PK_CopyId IN (${copyList})`,
            checkAvailability: '',
            customQuery: "",
          },
          authToken
        );
        if(DeleteResponse){
          const studentCopyWithId = copiesData.map((item) => {
            let newItem = {
              FK_ReportId: reportId,
              copyNumber: item.mainCopy,
              EMPLID: studentDetails.EMPLID,
            };
            item.alternateCopies.forEach((copy, index) => {
              newItem[`alternateCopyNumber${index + 1}`] = copy;
            });
            return newItem;
          });
          const NewResponse = await insert(
            {
              operation: "insert",
              tblName: "tbl_copy_master",
              data: studentCopyWithId,
              conditionString: "",
              checkAvailability: "",
              customQuery: "",
            },
            authToken
          );
          if (NewResponse) {
            showToast("Student Details Update Successful", "success");
            navigation.navigate("RoomDetail", {
              room_Nbr: room_Nbr,
              exam_Dt: exam_Dt,
              startTime: startTime,
              navigation,
            });
          }
        }
        }
    } catch (error) {
      console.log(error)
      handleAuthErrors(error);
    }
  };

  const handleAuthErrors = (error) => {
    switch (error.message) {
      case "Invalid credentials":
        showToast("Invalid authentication credentials", "error");
        break;
      case "Data already exists":
        showToast("Student Info with the same name already exists", "error");
        break;
      case "No response received from the server":
        showToast("No response received from the server", "error");
        break;
      default:
        showToast("Student Info Operation Failed", "error");
    }
  };

  const handleGetStudentInfo = async () => {
    try {
      const authToken = await checkAuthToken();
      const response = await view(
        {
          operation: "fetch",
          tblName: "PS_S_PRD_STDNT_VW",
          data: '',
          conditionString: `EMPLID = '${system_Id}'`,
          checkAvailability: '',
          customQuery: ''
        },
        authToken
      );
      if (response) {
        setStudentDetails(response?.data?.[0]);
        // setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      handleAuthErrors(error);
    }
  };
  const handleGetStudentCouseInfo = async () => {
    try {
      const authToken = await checkAuthToken();
      const response = await view(
        {
          operation: "custom",
          tblName: "PS_S_PRD_EX_TME_VW",
          data: '',
          conditionString: '',
          checkAvailability: '',
          customQuery: `SELECT DISTINCT CATALOG_NBR, DESCR100 FROM PS_S_PRD_EX_TME_VW WHERE CATALOG_NBR = '${catlog_Nbr}'`
        },
        authToken
      );
      if (response) {
        setCourseDetails(response?.data?.[0] || []);
        // setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      handleAuthErrors(error);
    }
  };
  const handleGetStudentAttendenceInfo = async () => {
    try {
      const authToken = await checkAuthToken();
      const response = await view(
        {
          operation: "fetch",
          tblName: "PS_S_PRD_CT_ATT_VW",
          data: '',
          conditionString: '',
          checkAvailability: '',
          // customQuery: `SELECT DISTINCT PS_S_PRD_CT_ATT_VW.PERCENTAGE,PS_S_PRD_TRS_AT_VW.PERCENTCHG FROM PS_S_PRD_CT_ATT_VW JOIN PS_S_PRD_TRS_AT_VW ON PS_S_PRD_TRS_AT_VW.EMPLID = PS_S_PRD_CT_ATT_VW.EMPLID WHERE PS_S_PRD_CT_ATT_VW.EMPLID = '${system_Id}' AND PS_S_PRD_CT_ATT_VW.CATALOG_NBR = '${catlog_Nbr}' `
          customQuery: `SELECT PS_S_PRD_CT_ATT_VW.PERCENTAGE,PS_S_PRD_TRS_AT_VW.PERCENTCHG FROM PS_S_PRD_CT_ATT_VW JOIN PS_S_PRD_TRS_AT_VW ON PS_S_PRD_TRS_AT_VW.EMPLID = PS_S_PRD_CT_ATT_VW.EMPLID  `
        },
        authToken
      );
      if (response) {
        console.log(response?.data || []);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      handleAuthErrors(error);
    }
  };
  const fetchData = async() => {
      setLoading(true);
     await handleGetStudentInfo();
     await handleGetStudentCouseInfo();
     await handleGetStudentAttendenceInfo();
      // await handleGetCopyData();
}
  


  useEffect(() => {
    fetchData();
  }, [system_Id, catlog_Nbr]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isScanning ? (
        <CodeScanner
          onScannedData={(data) =>
            handleScanBarcode( data, tempCopyType, mainCopyIndex, alternateCopyIndex )
          }
          onCancel={handleCancel}
        />
      ) : (
        <View>
          <View style={styles.studentInfoWrap}>
            <Text style={styles.infoHeader}>Student Info:</Text>
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.value}>
                  {studentDetails.NAME_FORMAL || ""}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.label}>Roll No:</Text>
                <Text style={styles.value}>
                  {studentDetails.ADM_APPL_NBR || ""}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.label}>System Id:</Text>
                <Text style={styles.value}>{studentDetails.EMPLID || ""}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.label}>Semester:</Text>
                <Text style={styles.value}>
                  {studentDetails.STRM?.split("")?.[3] || ""}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.label}>School Name:</Text>
                <Text style={styles.value}>{studentDetails.DESCR || ""}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.label}>Program Name:</Text>
                <Text style={styles.value}>{studentDetails.DESCR2 || ""}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.label}>Branch Name:</Text>
                <Text style={styles.value}>{studentDetails.DESCR3 || ""}</Text>
              </View>
            </View>
          </View>
          <View style={styles.studentInfoWrap}>
            <Text style={styles.infoHeader}>Course Info:</Text>
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Text style={styles.label}>Paper Id:</Text>
                <Text style={styles.value}>
                  {courseDetails.SU_PAPER_ID || ""}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.label}>Course Code:</Text>
                <Text style={styles.value}>
                  {courseDetails.CATALOG_NBR || ""}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.label}>Course Name:</Text>
                <Text style={styles.value}>{courseDetails.DESCR100 || ""}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.label}>Room No:</Text>
                <Text style={styles.value}>{room_Nbr}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.label}>Seat No:</Text>
                <Text style={styles.value}>{seat_Nbr}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.label}>Status:</Text>
                <Text style={styles.value}>
                  {attendanceDetails.PERCENTAGE >= attendanceDetails.PERCENTCHG ? "Eligible" : "Debarred"}
                </Text>
              </View>
            </View>
          </View>
          <View style={{flexDirection:"row" ,justifyContent:"space-between"}}>
              <Text style={styles.addAnsheading}> Add AnswerSheet </Text>
              {copiesData?.length === 0 &&   <AntDesign style={styles.addicon} name="pluscircleo" size={24} color="black" onPress={handleAddCopy} />}
              </View>
          {copiesData?.length > 0 ? (copiesData.map((copy, index) => (
            <View key={index} >
            
              <View style={styles.inputContainer}>
              <Pressable
                    onPress={() => handleRemoveCopy(index)}
                  >
                    <Text style={styles.addButtonText}>           
                    <AntDesign  name="delete" size={24} alignItems="flex-end" color="red" />
                    </Text>
                  </Pressable>
              </View>
              <View>          
                   
              <View style={[styles.tablewrap,styles.table]}>
                {/* <View style={styles.row}> */}
                <View>
                  {copy.mainCopy ? (
                    <View style={styles.sheetDetails}>
                    <View key={index} style={[styles.box]}>
                    <View style={styles.boxtext}>
                    <Text style={[ styles.header]}>Answersheet Number</Text>
                      <Text style={[styles.examname]}>{copy.mainCopy}</Text>
                      <View style={styles.iconsWrap}>
                      {!(
                        copy.alternateCopies.length > 0 ||
                        copy.alternateCopies?.includes("")
                      ) && (
                        <Entypo name="circle-with-cross" size={20} color="red" onPress={() => handleSaveCopy("AnswerSheet", "", index)} />  
                        
                      )}
                      </View>
                    </View>
                  </View>
                    </View>
                  ) : (
                  <View style={{width:"100%" ,justifyContent:"space-between",flexDirection:"row"}}>
                  <Text style={{fontWeight:"bold"}}>Answersheet</Text>
                   <MaterialCommunityIcons name="barcode-scan" onPress={() => startScanning("AnswerSheet", index)} size={40} color="black" />
                      <Text>OR</Text>
                      {renderCopyInput("AnswerSheet", index)}
                    </View>
                  )}
                   </View>
                  

                {copy.mainCopy && (
                  <View>
                    {copy.alternateCopies.map((alternateCopy, copyIndex) =>
                      alternateCopy ? ( 
                        <View>
                           <View key={index} style={[styles.box]}>
                           <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                           <Text style={[ styles.header]}>
                            Alternate Copy {copyIndex + 1}
                          </Text>
                            <View style={styles.boxtext}>
                              <Text style={[styles.examname]}>{alternateCopy}</Text>
                              <View >
                              {copyIndex === copy.alternateCopies.length - 1 && (
                                <View >
                                <Entypo name="circle-with-cross"  size={20} color="r"  marginLeft="10px"  onPress={() => handleSaveCopy( "Alternate", "", index, copyIndex ) }/>
                          </View>
                          )}        
                              </View>
                            </View>   
                            </View>        
                        </View>
                        {(copyIndex === copy.alternateCopies.length - 1 && copy.alternateCopies.length < 6) && (
                                <Pressable
                                style={styles.submitButton} 
                                onPress={() => handleAddAlternateCopy(index)}   
                              >
                                <Text style={{color:"#fff"}}>Add SupplySheet</Text>
                                </Pressable>
                              )}  
                              </View>
                      ) : (
                        <View style={styles.supplysheet}>
                        <Text style={{fontWeight:"bold"}}>Supply </Text>
                      <MaterialCommunityIcons name="barcode-scan" onPress={() =>  startScanning("Alternate", index, copyIndex)} size={40} color="black" />
                      <Text>OR</Text>
                        {renderCopyInput("Alternate", index, copyIndex)}
                        </View>
                      )
                    )}
                    {copy.alternateCopies.length === 0 && (
                       <Pressable
                       style={styles.submitButton} 
                       onPress={() => handleAddAlternateCopy(index)}   
                     >
                       <Text style={{color:"#fff"}}>Add SupplySheet</Text>
                       </Pressable>
                    )}
                  </View>
                )}
              </View>
              </View>
            </View>
          ))) :    ( <View  style={styles.tablewrap}>
          <Text style={styles.nodatadisplay}>There is no answersheet added yet!</Text> </View>) }
          <View style={styles.buttonWrap}>
          {copiesData?.length > 0 && 
            (<Pressable style={styles.addButton} onPress={handleAddCopy}>
              <Text style={styles.addButtonText}> Add Copy</Text>
            </Pressable>) }
            <Pressable
              style={styles.submitButton}
              onPress={ reportId ? handleStudentInfoUpdate: handleStudentInfoSubmit }
            >
              <Text style={styles.addButtonText}> Submit</Text>
            </Pressable>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default StudentInfo;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  studentInfoWrap: {
    backgroundColor: "#EAEAEA",
    marginBottom: 20,
    borderRadius: 8,
    padding: 5,
  },
  infoHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 20,
    marginVertical: 10,
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  infoItem: {
    flexDirection: "row",
    marginBottom: 10,
  },
  label: {
    flex: 1,
    fontWeight: "bold",
  },
  value: {
    flex: 2,
  },
  table: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#f9f9f9",
    marginBottom: 20,
    padding: 10,
  },
  tablewrap:{
    backgroundColor:"#fff",
    padding:"20px",
    borderRadius:"10px",

  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  cell: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    color: "#333",
  },
  header: {
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginRight: 10,
    backgroundColor: "#fff",
  },
  orText: {
    marginRight: 4,
  },
  addButton: {
    padding: 10,
    borderRadius: 7,
    backgroundColor: "#129912",
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginTop: 6,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  removeButton: {
    alignSelf: "flex-end",
    padding: 5,
    borderRadius: 5,
    backgroundColor: "#e60e1c",
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginTop: 12,
  },
  mainText: {
    flexDirection: "row",
    alignItems: "center",
  },
  addcopybtn: {
    flexDirection: "row",
    alignSelf: "flex-end",
  },
  addtext: {
    alignItems: "center",
    marginLeft: 5,
    marginTop: 10,
  },
  buttonWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  submitButton: {
    backgroundColor: "#0c7c62",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  mainCopyText: {
    color: "#000",
    boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)',
    fontWeight: "bold",
  },
  addAnsheading:{
    fontSize:"24px",
    fontWeight:"bold",
    padding:10,
  },
  nodatadisplay:{
    fontSize:"18px",
    alignItems:"center",
    textAlign:"center",
  },
  box: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: 'auto',
    backgroundColor: "#eaeaea",
    borderRadius: 25,
    marginBottom: 10,
    marginTop:10,
    padding:10,
    flexDirection:"column",
 
  },
  boxtext:{
    // alignItems:"center",  
    flexDirection:"row",
    marginLeft:10,
    color:"#000",
    justifyContent:"space-between",

  },
  iconsWrap:{
    flexDirection:"row",
    justifyContent:"space-between",
  },
  addicon:{
    marginRight:"10px",
    marginTop:"18px"
    },
    supplysheet:{
      flexDirection:"row",
      justifyContent:"space-between",
    }
});
