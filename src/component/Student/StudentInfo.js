import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, ActivityIndicator, Image,Dimensions,RefreshControl } from "react-native";
import { Ionicons, FontAwesome, AntDesign, MaterialCommunityIcons, MaterialIcons, Entypo, FontAwesome6, } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useToast } from "../../globalComponent/ToastContainer/ToastContext";
import CodeScanner from "../../globalComponent/CodeScanner/CodeScanner";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { insert, fetch, update, remove, view, } from "../../AuthService/AuthService";
import DropDownPicker from "react-native-dropdown-picker";
import CheckBox from "expo-checkbox";
import { parseISO, format, differenceInSeconds, addMinutes, subMinutes, isSameDay,isBefore } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

const { width, height } = Dimensions.get('window');
const isMobile = width < 768; 

const StudentInfo = ({ navigation }) => {

  const route = useRoute();
  const { addToast } = useToast();
  const [studentDetails, setStudentDetails] = useState({});
  const [studentPicture, setStudentPicture] = useState('');
  const [studentSign, setStudentSign] = useState('');
  const [courseDetails, setCourseDetails] = useState({});
  const [timeLeft, setTimeLeft] = useState('Attendance Not Started');
  const { room_Nbr, catlog_Nbr, system_Id, seat_Nbr, exam_Dt, startTime, reportId, userAccess, current_Term } = route.params;

  const UserAccess = userAccess?.module?.find((item) => item?.FK_ModuleId === 6);
  const [copiesData, setCopiesData] = useState([]);
  const [tempCopyNumber, setTempNumber] = useState("");
  const [mainCopyIndex, setMainCopyIndex] = useState("");
  const [alternateCopyIndex, setAlternateCopyIndex] = useState("");
  const [tempCopyType, setTempCopyType] = useState("");
  const [copyList, setCopyList] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Present');
  const [disabledStatus, setDisabledStatus] = useState('Present');
  const [attendenceStatus, setAttendenceStatus] = useState('Not Defined');
  const [currentTime, setCurrentTime] = useState(new Date()?.getTime()); // Added current time state
  const [isActive, setIsActive] = useState(false); // Added active status state

  const items = [
    { label: 'Present', value: 'Present' },
    { label: 'Absent', value: 'Absent' },
    { label: 'UFM', value: 'UFM' },
  ];
  const checkAuthToken = useCallback(async () => {
    const authToken = await AsyncStorage.getItem("authToken");

    if (!authToken) {
      addToast("Authentication token not available", "error");
      throw new Error("Authentication token not available");
    }

    return authToken;
  }, [addToast]);

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

  const renderCopyInput = (copyType, index, copyIndex, InputStyle) => {
    return (
      <View style={styles.answerSheetWrap} key={copyIndex}>
        <View r key={copyIndex}>
          <TextInput
            style={[InputStyle, styles.input]}
            placeholder={`Enter ${copyType + " " + copyIndex + 1} Number`}
            onChangeText={(copyNumber) => setTempNumber(copyNumber)}
          />
          {/* <MaterialIcons name="done" size={24} color="green" style={styles.righticon}/> */}
        </View>
        {/* <> */}
        {tempCopyNumber && (
          <Pressable style={styles.doneWrap}
            onPress={() =>
              handleSaveCopy(copyType, tempCopyNumber, index, copyIndex)
            }
          >
            <Text style={{color:"#fff"}}>Save</Text>
            {/* <MaterialIcons name="done" size={16} color="#fff" style={styles.saveicon} /> */}
          </Pressable>
        )}
        {/* </>
              <> */}
        {/* {copyType === "Alternate" && isLastAlternateCopy && (
          <Pressable
            style={styles.removeButton}
            onPress={() => handleRemoveAlternateCopy(copyIndex, index)}
          >
            <Text style={styles.addButtonText}>
              <Entypo
                name="squared-cross"
                color="red"
                size={20}
                alignItems="center"
              />
            </Text>
          </Pressable>
        )} */}
        {/* </> */}
      </View>
    );
  };
  const handleCancel = () => {
    setIsScanning(false);
    navigation.setOptions({ headerShown: true });
    setTempCopyType("");
    setMainCopyIndex("");
    setAlternateCopyIndex("");
  };

  const startScanning = (copyType, index, copyIndex) => {
    setIsScanning(true);
    navigation.setOptions({ headerShown: false });
    setTempCopyType(copyType);
    setMainCopyIndex(index);
    setAlternateCopyIndex(copyIndex);
  };


  const handleStudentInfoSubmit = async () => {
    try {
      const CopyEmptyValues = copiesData?.length > 0 ? copiesData.some(data => data.mainCopy === "" || data.alternateCopies.includes("")) : true;
      if (CopyEmptyValues && status !== "Absent") {
        addToast("Enter the copy details!", "error");
      }
      else if(status === "Absent" && copiesData?.length > 0) {
        addToast("Please remove the copy details for mark Absent!", "error");
      }
      else {
        // Check for duplicate mainCopy values
        const uniqueMainCopies = new Set();
        let duplicateFound = false;
        
        for (const data of copiesData) {
          if (uniqueMainCopies.has(data.mainCopy)) {
            duplicateFound = true;
            break;
          }
          uniqueMainCopies.add(data.mainCopy);
        }
        
        if (duplicateFound) {
          addToast("Duplicate copy numbers are not allowed!", "error");
          return;
        }
  
        const authToken = await checkAuthToken();
        let CopyArray = copiesData?.length > 0 ? copiesData?.map((item) => `'${item?.mainCopy}'`) : `""`;
        const CopyExistResponse = await fetch(
          {
            operation: "custom",
            tblName: "tbl_copy_master",
            data: '',
            conditionString: "",
            checkAvailability: "",
            customQuery: `Select * from tbl_copy_master Where copyNumber in (${CopyArray})`,
          },
          authToken
        );
        if (CopyExistResponse.data.receivedData?.length > 0) {
          // ${CopyExistResponse.data.receivedData?.map((item) => item.copyNumber)}
          addToast(`Copy Number Already Linked With Previous Student : ${CopyExistResponse.data.receivedData?.map((item) => item.copyNumber)} `, "error",false);
        } else {
          const response = await insert(
            {
              operation: "insert",
              tblName: "tbl_report_master",
              data: {
                EMPLID: studentDetails.EMPLID,
                NAME_FORMAL: studentDetails.NAME_FORMAL,
                STRM: studentDetails.STRM,
                ADM_APPL_NBR: studentDetails.CAMPUS_ID,
                DESCR: studentDetails.DESCR,
                DESCR2: studentDetails.DESCR2,
                DESCR3: studentDetails.DESCR3,
                EXAM_DT: exam_Dt,
                ROOM_NBR: room_Nbr,
                EXAM_START_TIME: startTime,
                CATALOG_NBR: catlog_Nbr,
                PTP_SEQ_CHAR: seat_Nbr,
                Attendece_Status: attendenceStatus,
                Status: status,
                SU_PAPER_ID: courseDetails.SU_PAPER_ID,
                DESCR100: courseDetails.DESCR100,
              },
              conditionString: `EMPLID = '${studentDetails.EMPLID}' AND EXAM_DT = '${exam_Dt}' AND ROOM_NBR = '${room_Nbr}' AND EXAM_START_TIME = '${startTime}'`,
              checkAvailability: true,
              customQuery: "",
            },
            authToken
          );
  
          if (response) {
            const studentCopyWithId = copiesData.map((item) => {
              let newItem = {
                FK_ReportId: response?.data?.receivedData?.insertId,
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
              addToast("Student details are updated successfully!", "success");
              navigation.navigate("RoomDetail", { room_Nbr: room_Nbr, exam_Dt: exam_Dt, startTime: startTime, navigation: navigation, userAccess });
            }
          }
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
          customQuery: `select JSON_ARRAYAGG(json_object('PK_Report_Id',p.PK_Report_Id,'Status',p.Status,'copyData',( SELECT CAST( CONCAT('[', GROUP_CONCAT( JSON_OBJECT( 'PK_CopyId',q.PK_CopyId,'FK_ReportId', q.FK_ReportId,'EMPLID', q.EMPLID,'copyNumber',q.copyNumber,'alternateCopyNumber1',q.alternateCopyNumber1,'alternateCopyNumber2',q.alternateCopyNumber2,'alternateCopyNumber3',q.alternateCopyNumber3,'alternateCopyNumber4',q.alternateCopyNumber4,'alternateCopyNumber5',q.alternateCopyNumber5,'alternateCopyNumber6',q.alternateCopyNumber6) ), ']') AS JSON ) FROM tbl_copy_master q WHERE q.FK_ReportId = p.PK_Report_Id ))) AS ReportData from tbl_report_master p where PK_Report_Id = ${reportId}`,
        },
        authToken
      );

      if (response) {
        setStatus(response?.data?.receivedData?.[0]?.ReportData?.[0]?.Status);
        let CopyFetchDetails =
          response?.data?.receivedData?.[0]?.ReportData?.[0]?.copyData?.map((item, index) => ({
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
        setCopiesData(CopyFetchDetails || []);
        let TempcopyList = response?.data?.receivedData?.[0]?.ReportData?.[0]?.copyData?.map(
          (item) => item.PK_CopyId
        );
        setCopyList(TempcopyList);
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };
  // const handleStudentInfoUpdate = async () => {
  //   try {
  //     const CopyEmptyValues = copiesData?.length > 0 ? copiesData.some(data => data.mainCopy === "" || data.alternateCopies.includes("")) : true;
  //     // if (CopyEmptyValues) {
  //       if (CopyEmptyValues && status !== "Absent" ) {
  //       addToast("Please enter the copy details!", "error");
  //     }
  //     else if(status === "Absent" && copiesData?.length > 0) {
  //       addToast("Please remove the copy details for mark Absent!", "error");
  //     }
  //      else {
  //       // Check for duplicate mainCopy values
  //       const uniqueMainCopies = new Set();
  //       let duplicateFound = false;
        
  //       for (const data of copiesData) {
  //         if (uniqueMainCopies.has(data.mainCopy)) {
  //           duplicateFound = true;
  //           break;
  //         }
  //         uniqueMainCopies.add(data.mainCopy);
  //       }
        
  //       if (duplicateFound) {
  //         addToast("Duplicate copy numbers are not allowed!", "error");
  //         return;
  //       }
  
  //       const authToken = await checkAuthToken();
  //       let CopyArray = copiesData?.length > 0 ? copiesData?.map((item) => `'${item?.mainCopy}'`) : `""`;;
  //       const CopyExistResponse = await fetch(
  //         {
  //           operation: "custom",
  //           tblName: "tbl_copy_master",
  //           data: '',
  //           conditionString: "",
  //           checkAvailability: "",
  //           customQuery: `Select * from tbl_copy_master Where PK_CopyId NOT IN (${copyList?.length > 0 ? copyList: `""`}) AND copyNumber in (${CopyArray})`,
  //         },
  //         authToken
  //       );
  
  //       if (CopyExistResponse.data.receivedData?.length > 0) {
  //         addToast(`Copy Number Already Exist ${CopyExistResponse.data.receivedData?.map((item) => item.copyNumber)}`, "error");
  //       } else {
  //         const response = await update(
  //           {
  //             operation: "update",
  //             tblName: "tbl_report_master",
  //             data: {
  //               EMPLID: studentDetails.EMPLID,
  //               NAME_FORMAL: studentDetails.NAME_FORMAL,
  //               STRM: studentDetails.STRM,
  //               ADM_APPL_NBR: studentDetails.ADM_APPL_NBR,
  //               DESCR: studentDetails.DESCR,
  //               DESCR2: studentDetails.DESCR2,
  //               DESCR3: studentDetails.DESCR3,
  //               EXAM_DT: exam_Dt,
  //               ROOM_NBR: room_Nbr,
  //               EXAM_START_TIME: startTime,
  //               CATALOG_NBR: catlog_Nbr,
  //               PTP_SEQ_CHAR: seat_Nbr,
  //               Attendece_Status: attendenceStatus,
  //               Status: status,
  //               SU_PAPER_ID: courseDetails.SU_PAPER_ID,
  //               DESCR100: courseDetails.DESCR100,
  //             },
  //             conditionString: `PK_Report_Id = ${reportId}`,
  //             checkAvailability: "",
  //             customQuery: "",
  //           },
  //           authToken
  //         );
  
  //         if (response && (copiesData?.length > 0 || copyList?.length > 0) ) {
  //           if(copyList?.length > 0){
  //             const DeleteResponse = await remove(
  //               {
  //                 operation: "delete",
  //                 tblName: "tbl_copy_master",
  //                 data: "",
  //                 conditionString: `PK_CopyId IN (${copyList})`,
  //                 checkAvailability: "",
  //                 customQuery: "",
  //               },
  //               authToken
  //             );
    
  //             if (DeleteResponse && copiesData?.length > 0) {
  //               const studentCopyWithId = copiesData.map((item) => {
  //                 let newItem = {
  //                   FK_ReportId: reportId,
  //                   copyNumber: item.mainCopy,
  //                   EMPLID: studentDetails.EMPLID,
  //                 };
  //                 item.alternateCopies.forEach((copy, index) => {
  //                   newItem[`alternateCopyNumber${index + 1}`] = copy;
  //                 });
  //                 return newItem;
  //               });
    
  //               const NewResponse = await insert(
  //                 {
  //                   operation: "insert",
  //                   tblName: "tbl_copy_master",
  //                   data: studentCopyWithId,
  //                   conditionString: "",
  //                   checkAvailability: "",
  //                   customQuery: "",
  //                 },
  //                 authToken
  //               );
    
  //               if (NewResponse) {
  //                 addToast("Student details are updated successfully!", "success");
  //                 navigation.navigate("RoomDetail", { room_Nbr: room_Nbr, exam_Dt: exam_Dt, startTime: startTime, navigation: navigation, userAccess, refresh });
  //               }
  //             }
  //             else{
  //               addToast("Student details are updated successfully!", "success");
  //               navigation.navigate("RoomDetail", { room_Nbr: room_Nbr, exam_Dt: exam_Dt, startTime: startTime, navigation: navigation, userAccess, refresh });
  //             }
  //           }
  //           else if(copiesData?.length > 0) {
  //             const NewResponse = await insert(
  //               {
  //                 operation: "insert",
  //                 tblName: "tbl_copy_master",
  //                 data: studentCopyWithId,
  //                 conditionString: "",
  //                 checkAvailability: "",
  //                 customQuery: "",
  //               },
  //               authToken
  //             );
  
  //             if (NewResponse) {
  //               addToast("Student details are updated successfully!", "success");
  //               navigation.navigate("RoomDetail", { room_Nbr: room_Nbr, exam_Dt: exam_Dt, startTime: startTime, navigation: navigation, userAccess, refresh });
  //             }
  //           }         
  //         }
  //         else{
  //           addToast("Student details are updated successfully!", "success");
  //           navigation.navigate("RoomDetail", { room_Nbr: room_Nbr, exam_Dt: exam_Dt, startTime: startTime, navigation: navigation, userAccess, refresh });
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error)
  //     handleAuthErrors(error);
  //   }
  // };
  
  const handleStudentInfoUpdate = async () => {
    try {
      const copyEmptyValues = copiesData?.length > 0 ? copiesData.some(data => data.mainCopy === "" || data.alternateCopies.includes("")) : true;
  
      if (copyEmptyValues && status !== "Absent") {
        addToast("Please enter the copy details!", "error");
      } else if (status === "Absent" && copiesData?.length > 0) {
        addToast("Please remove the copy details to mark Absent!", "error");
      } else {
        const uniqueMainCopies = new Set();
        let duplicateFound = false;
  
        for (const data of copiesData) {
          if (uniqueMainCopies.has(data.mainCopy)) {
            duplicateFound = true;
            break;
          }
          uniqueMainCopies.add(data.mainCopy);
        }
  
        if (duplicateFound) {
          addToast("Duplicate copy numbers are not allowed!", "error");
          return;
        }
  
        const authToken = await checkAuthToken();
        let copyArray = copiesData?.length > 0 ? copiesData.map(item => `'${item?.mainCopy}'`).join(",") : `""`;
        const copyExistResponse = await fetch(
          {
            operation: "custom",
            tblName: "tbl_copy_master",
            data: '',
            conditionString: "",
            checkAvailability: "",
            customQuery: `SELECT * FROM tbl_copy_master WHERE PK_CopyId NOT IN (${copyList?.length > 0 ? copyList : `""`}) AND copyNumber IN (${copyArray})`,
          },
          authToken
        );
  
        if (copyExistResponse.data.receivedData?.length > 0) {
          // ${copyExistResponse.data.receivedData.map(item => item.copyNumber).join(", ")}
          addToast(`Copy Number Already Linked With Previous Student : ${copyExistResponse.data.receivedData?.map((item) => item.copyNumber)} `, "error",false);
        } else {
          const response = await update(
            {
              operation: "update",
              tblName: "tbl_report_master",
              data: {
                EMPLID: studentDetails.EMPLID,
                NAME_FORMAL: studentDetails.NAME_FORMAL,
                STRM: studentDetails.STRM,
                ADM_APPL_NBR: studentDetails.CAMPUS_ID,
                DESCR: studentDetails.DESCR,
                DESCR2: studentDetails.DESCR2,
                DESCR3: studentDetails.DESCR3,
                EXAM_DT: exam_Dt,
                ROOM_NBR: room_Nbr,
                EXAM_START_TIME: startTime,
                CATALOG_NBR: catlog_Nbr,
                PTP_SEQ_CHAR: seat_Nbr,
                Attendece_Status: attendenceStatus,
                Status: status,
                SU_PAPER_ID: courseDetails.SU_PAPER_ID,
                DESCR100: courseDetails.DESCR100,
              },
              conditionString: `PK_Report_Id = ${reportId}`,
              checkAvailability: "",
              customQuery: "",
            },
            authToken
          );
  
          if (response && (copiesData?.length > 0 || copyList?.length > 0)) {
            if (copyList?.length > 0) {
              const deleteResponse = await remove(
                {
                  operation: "delete",
                  tblName: "tbl_copy_master",
                  data: "",
                  conditionString: `PK_CopyId IN (${copyList})`,
                  checkAvailability: "",
                  customQuery: "",
                },
                authToken
              );
  
              if (deleteResponse && copiesData?.length > 0) {
                const studentCopyWithId = copiesData.map(item => {
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
  
                const newResponse = await insert(
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
  
                if (newResponse) {
                  addToast("Student details are updated successfully!", "success");
                  navigation.navigate("RoomDetail", { room_Nbr: room_Nbr, exam_Dt: exam_Dt, startTime: startTime, navigation, userAccess });
                }
              } else {
                addToast("Student details are updated successfully!", "success");
                navigation.navigate("RoomDetail", { room_Nbr: room_Nbr, exam_Dt: exam_Dt, startTime: startTime, navigation, userAccess });
              }
            } else if (copiesData?.length > 0) {
              const studentCopyWithId = copiesData.map(item => {
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
  
              const newResponse = await insert(
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
  
              if (newResponse) {
                addToast("Student details are updated successfully!", "success");
                navigation.navigate("RoomDetail", { room_Nbr: room_Nbr, exam_Dt: exam_Dt, startTime, navigation, userAccess });
              }
            }
          } else {
            addToast("Student details are updated successfully!", "success");
            navigation.navigate("RoomDetail", { room_Nbr: room_Nbr, exam_Dt: exam_Dt, startTime, navigation, userAccess });
          }
        }
      }
    } catch (error) {
      console.log(error);
      handleAuthErrors(error);
    }
  };

  const handleAuthErrors = (error) => {
    switch (error.message) {
      case "Invalid credentials":
        addToast("Invalid authentication credentials!", "error");
        break;
      case "Data already exists":
        addToast("Student details already exists!", "error");
        break;
      case "No response received from the server":
        addToast("No response received from the server", "error");
        break;
      default:
        addToast("Student details operation failed", "error");
    }
  };

  const handleGetStudentInfo = async () => {
    try {
      const authToken = await checkAuthToken();
      const response = await view(
        {
          operation: "fetch",
          tblName: "PS_S_PRD_STDNT_VW",
          data: "",
          conditionString: `EMPLID = '${system_Id}'`,
          checkAvailability: "",
          customQuery: "",
          viewType: 'Campus_View'
        },
        authToken
      );
      if (response) {
        setStudentDetails(response?.data?.receivedData?.[0]);
        // setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      handleAuthErrors(error);
    }
  };
  const handleGetStudentPicture = async () => {
    try {
      const authToken = await checkAuthToken();
      const response = await view(
        {
          operation: "blobFromOracle",
          tblName: "PS_S_PRD_PHOTO_VW",
          data: '',
          conditionString: `EMPLID = '${system_Id}'`,
          checkAvailability: '',
          customQuery: `SELECT EMPLOYEE_PHOTO,DERIVED_STUPHOTO,EMPLID FROM PS_S_PRD_PHOTO_VW Where EMPLID = '${system_Id}' `,
          // customQuery: `SELECT EMPLOYEE_PHOTO,DERIVED_STUPHOTO,EMPLID FROM PS_S_PRD_PHOTO_VW Where EMPLID = 2023000230 `,
          viewType: 'CAMPUS2_View'
        },
        authToken
      );
      if (response) {
        setStudentPicture(response?.data?.receivedData?.[0]?.EMPLOYEE_PHOTO || '');
        setStudentSign(response?.data?.receivedData?.[0]?.DERIVED_STUPHOTO || '');
        setLoading(false);
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
          data: "",
          conditionString: "",
          checkAvailability: "",
          customQuery: `SELECT DISTINCT CATALOG_NBR, DESCR100,EXAM_TIME_CODE FROM PS_S_PRD_EX_TME_VW WHERE CATALOG_NBR = '${catlog_Nbr}'`,
          viewType: 'Campus_View'
        },
        authToken
      );
      if (response) {
        setCourseDetails(response?.data?.receivedData?.[0] || []);
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
          operation: "custom",
          tblName: "PS_S_PRD_CT_ATT_VW",
          data: "",
          conditionString: "",
          checkAvailability: "",
          customQuery: `SELECT DISTINCT PS_S_PRD_CT_ATT_VW.PERCENTAGE,PS_S_PRD_TRS_AT_VW.PERCENTCHG FROM PS_S_PRD_CT_ATT_VW JOIN PS_S_PRD_TRS_AT_VW ON PS_S_PRD_TRS_AT_VW.EMPLID = PS_S_PRD_CT_ATT_VW.EMPLID WHERE PS_S_PRD_CT_ATT_VW.EMPLID = '${system_Id}' AND PS_S_PRD_CT_ATT_VW.CATALOG_NBR = '${catlog_Nbr}' AND PS_S_PRD_CT_ATT_VW.STRM = '${current_Term}'`,
          viewType: 'Campus_View',
        },
        authToken
      );
      if (response) {
        let AttendenceDetials = response?.data?.receivedData?.[0] || ''
        let AttendenceStatus = AttendenceDetials ? AttendenceDetials.PERCENTAGE >= AttendenceDetials.PERCENTCHG ? "Eligible" : "Debarred" : "Not Defined";
        setAttendenceStatus(AttendenceStatus);
        setStatus(AttendenceStatus === "Debarred" ? "Absent" : "Present");
        setDisabledStatus(AttendenceStatus === "Debarred" ? "Absent" : "Present");
        // setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      handleAuthErrors(error);
    }
  };
  // const fetchData = async () => {
  //   setLoading(true);
  //   await handleGetStudentInfo();
  //   await handleGetStudentCouseInfo();
  //   await handleGetStudentAttendenceInfo();
  //   // await handleGetStudentPicture();
  //   (await reportId) ? handleGetCopyData() : "";
  // };

  const fetchData = async () => {
    setLoading(true);
    try {
      await handleGetStudentInfo();
      await handleGetStudentCouseInfo();
    await handleGetStudentAttendenceInfo();
      await handleGetStudentPicture();
      if (await reportId) {
        await handleGetCopyData();
      }
    } finally {
      setLoading(false);
    }
  };
  
  const getStatuscolor = () => {
    switch (status) {
      case 'UFM':
        return 'red';
      case 'Absent':
        return 'grey';
      default:
        return 'green';
    }
  }

  const getAttendenceStatuscolor = () => {
    switch (attendenceStatus) {
      case 'Debarred':
        return {
          backgroundColor:'red',
          borderRadius:4,
          borderColor:'red',
          color: 'white',
          marginRight: 54,
          padding: 6,
          width: 75,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        };
      case 'Not Defined':
        return {
          backgroundColor:'grey',
          borderRadius:4,
          borderColor:'grey',
          color: 'white',
          marginRight: 54,
          padding: 6,
          width: 110,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        };    
      default:
        return {
          backgroundColor:'green',
          borderRadius:4,
          height: 30,
          textAlign: "center",
          borderColor:'green',
          color: 'white',
          marginRight: 54,
          padding: 4,
          width: 75,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        };
    }
  }

  // const formatShiftTime = (dateString) => {
  //   const date = parseISO(dateString);
  //   const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; // Get the current timezone
  //   const time = formatInTimeZone(date, timeZone, 'hh:mm');
  //   return time;
  // };


  useEffect(() => {
    fetchData();
  }, [UserAccess]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const now = new Date();
  //     setCurrentTime(now);

  //     // Extract the hours and minutes from the startTime
  //     const startHours = new Date(startTime).getUTCHours();
  //     const startMinutes = new Date(startTime).getUTCMinutes();

  //     // Create today's date with the same time as startTime
  //     const startToday = new Date(now);
  //     startToday.setUTCHours(startHours);
  //     startToday.setUTCMinutes(startMinutes);
  //     startToday.setUTCSeconds(0);
  //     startToday.setUTCMilliseconds(0);

  //     const start = startToday.getTime() - (15 * 60 * 1000); // 15 minutes before start time
  //     const end = startToday.getTime() + (60 * 60 * 1500); // 1 hour after start time

  //     if (now.getTime() >= start && now.getTime() <= end) {
  //       setIsActive(true);
  //     } else {
  //       setIsActive(true);   
  //       // set false after changes//
        
  //     }
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, [startTime]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      // Parse the exam date and start time
      const examDate = parseISO(exam_Dt);
      const start = parseISO(startTime);

      // Check if today is the exam date
      if (!isSameDay(now, examDate)) {
        setIsActive(false);
        // setIsActive(true);
        let PastDate = !isBefore(examDate, now)
        setTimeLeft(PastDate ? 'Attendance Not Started': 'Attendance Completed');
        return;
      }

      // Get the current timezone
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Convert the start time to the current time zone
      const zonedStart = toZonedTime(start, timeZone);
      // Extract only the time from the fixed date
      const startHours = zonedStart.getHours();
      const startMinutes = zonedStart.getMinutes();
      // Create today's date with the same time as startTime
      const startToday = new Date(now);
      startToday.setHours(startHours);
      startToday.setMinutes(startMinutes);
      startToday.setSeconds(0);
      startToday.setMilliseconds(0);

      // Calculate the time window
      const startWindow = subMinutes(startToday, 15).getTime(); // 15 minutes before start time
      const endWindow = addMinutes(startToday, 90).getTime(); // 1.5 hours after start time

      if (now.getTime() >= startWindow && now.getTime() <= endWindow) {
        setIsActive(true);

        // Calculate the countdown
        const timeDiffInSeconds = differenceInSeconds(endWindow, now.getTime());
        const minutes = Math.floor(timeDiffInSeconds / 60);
        const seconds = timeDiffInSeconds % 60;
        setTimeLeft(`${minutes}:${seconds < 10 ? '0' : ''}${seconds} min`);
      } else {
        setIsActive(false); // make false after changes
        setTimeLeft(now.getTime() > endWindow ? 'Attendance Completed' : 'Attendance Not Started');
  
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, exam_Dt]);

  return loading ? (
    <ActivityIndicator size="large" color="#0000ff" />
  ) : (
    <ScrollView contentContainerStyle={styles.container}  refreshControl={
      <RefreshControl refreshing={loading} onRefresh={()=>fetchData()} />
    }>
      {isScanning ? (
        <CodeScanner
          onScannedData={(data) =>
            handleScanBarcode(
              data,
              tempCopyType,
              mainCopyIndex,
              alternateCopyIndex
            )
          }
          onCancel={handleCancel}
          BarCodeTypes={['code39']}
        />
      ) : (
        <View>
          <View style={styles.studentInfoWrap}>
          <View style={styles.headerWrap}>
          {/* <Text style={[styles.infoHeader,{marginBottom:0}]}>Student Info:</Text> */}
              <View style={styles.countWrap}>
                <View style={styles.countDown}>
                <Text style={styles.cotext}>Time Left :</Text>
                  <View style={[styles.countbg1,  timeLeft === 'Attendance Completed' && styles.completeBackground] }>     
                    <Text  style={[styles.count,]}>
                    {timeLeft}
                    </Text>
                  </View>
        
                </View>
            
            </View>        
            </View>
            <View style={[styles.infoContainer,{flexDirection:"row"}]}>
              <View style={[styles.userDetailWrap,{marginRight:0}]}>
                {studentPicture ? (
              <Image
            source={{ uri: `data:image/png;base64,${studentPicture}` }}
            style={styles.studProfile}



            
          />
          ) : (
                <FontAwesome name="user" size={40} color="#fff" style={styles.studProfile} />        
              )} 
                {studentSign ? (
              <Image 
            source={{ uri: `data:image/png;base64,${studentSign}` }}
            style={[styles.signature ,isMobile ?styles.signaturemob:styles.signature]} 
            
          />
          ) : (
                <FontAwesome6 name="signature" size={34} color="black" />        
              )} 
              </View>
              <View style={[styles.infoItemWrap]}>
                    <View style={styles.infoItem}>
                      <Text style={styles.label1}>Name:</Text>
                      <Text style={styles.value1} numberOfLines={1}>
                        {" "}
                        {studentDetails?.NAME_FORMAL || ""}{" "}
                      </Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Text style={styles.label1}>System Id:</Text>
                      <Text style={styles.value1} numberOfLines={1}> {studentDetails?.EMPLID || ""} </Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Text style={styles.label1} >Roll No:</Text>
                      <Text style={styles.value1} numberOfLines={1}> {studentDetails?.CAMPUS_ID || ""}
                      </Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Text style={styles.label1} >School:</Text>
                      <Text style={styles.value1} numberOfLines={1} ellipsizeMode='tail'> {studentDetails?.DESCR || ""}</Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Text style={styles.label1}>Program:</Text>
                      <Text style={styles.value1} numberOfLines={1} > {studentDetails?.DESCR2 || ""}</Text>
                    </View>
               
                    <View style={styles.infoItem}>
                      <Text style={styles.label1}>Branch:</Text>
                      <Text style={styles.value1} numberOfLines={1}> {studentDetails?.DESCR3 || ""}</Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Text style={styles.label1}>Semester:</Text>
                      <Text style={styles.value1} numberOfLines={1}> {studentDetails?.ACAD_LEVEL_BOT || "0"}</Text>
                  
                    </View>
                    {/* <View style={styles.infoItem}>
                      <Text style={styles.label1}>Signature:</Text>

                      {studentSign ? (
              <Image
            source={{ uri: `data:image/png;base64,${studentSign}` }}
            style={styles.studProfile} 
          />
          ) : (
                <FontAwesome6 name="signature" size={34} color="black" />        
              )} 
                    </View> */}
              </View>
            </View>
          </View>
          <View style={styles.studentInfoWrap}>
      
            <View style={styles.infoContainer}>
            <View style={{ borderBottomColor:"#ccc",borderBottomWidth:1,padding:10, marginBottom:10}}>
            <Text style={styles.infoHeader}>Exam Info:</Text>
            </View>
            <View style={styles.infopWrap}>
              <View style={[styles.infoItem,]}>
                <Text style={[styles.label,{width:"40%"}]}>Paper Id:</Text>
                <Text style={styles.value}>
                  {courseDetails?.EXAM_TIME_CODE || ""}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={[styles.label,{width:"60%"}]}>Course Code:</Text>
                <Text style={styles.value}>
                  {courseDetails?.CATALOG_NBR || ""}
                </Text>
              </View>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.label}>Course Name:</Text>
                <Text style={styles.value}>{courseDetails?.DESCR100 || ""}</Text>
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
                <Text style={styles.label}>Class Status:</Text>
                <Text style={[styles.value, {marginBottom: 10}, getAttendenceStatuscolor()]}>
                  {attendenceStatus}
                </Text>
              </View>
              <View style={[styles.infoItem, styles.studStatus]}>
                <Text style={[styles.label]}>Status</Text>
                <View style={styles.attStatus}>
                  <CheckBox value={status === "Present"} onValueChange={(item) =>setStatus("Present")} color={getStatuscolor()} disabled={((!isActive && !(userAccess?.label === "Admin")) || disabledStatus === "Absent")} />                
                  <Text style={[styles.value, styles.customValue]}>Present</Text>
                </View>
                <View style={styles.attStatus}>
                <CheckBox value={status === "Absent"} onValueChange={() => setStatus("Absent")} color={getStatuscolor()} disabled={((!isActive && !(userAccess?.label === "Admin"))) || disabledStatus === "Absent"} />
                <Text style={[styles.value, styles.customValue]}>Absent</Text>
                </View>
                <View style={styles.attStatus}>
                <CheckBox value={status === "UFM"} onValueChange={() => setStatus("UFM")} color={getStatuscolor()} disabled={((!isActive && !(userAccess?.label === "Admin"))) || disabledStatus === "Absent"} />
                <Text style={[styles.value, styles.customValue]}>UFM</Text>
                </View>
                
                

                {/* <DropDownPicker
                  open={open}
                  value={status}
                  items={items}
                  setOpen={setOpen}
                  setValue={setStatus}
                  style={[styles.dropdown, { backgroundColor: getStatuscolor() }]}
                  labelStyle={{
                    color: "white"
                  }}
                  dropDownStyle={{ backgroundColor: "#fafafa" }}
                  dropDownContainerStyle={styles.dropdownContainer}
                  dropDownMaxHeight={150}
                  dropDownDirection="BOTTOM"
                  listItemContainerStyle={{ height: 30 }}
                  listItemLabelStyle={{ fontSize: 14 }}
                /> */}
              </View>
            </View>
          </View>

          {/* -------------------------------------------------Amswersheet main code---------------------------------------------- */}
          {/* <View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.addAnsheading}> AnswerSheet </Text>
              {copiesData?.length < 6 && (
                <AntDesign
                  style={styles.addicon}
                  name="pluscircleo"
                  size={24}
                  color="black"
                  onPress={handleAddCopy}
                />
              )}
            </View>
            {copiesData?.length > 0 ? (
              copiesData.map((copy, index) => (
                <View key={copy.id || index}>
                  <View style={styles.inputContainer}>
                    <Pressable onPress={() => handleRemoveCopy(index)}>
                      <Text style={styles.addButtonText}>
                        <AntDesign
                          name="delete"
                          size={24}
                          alignItems="flex-end"
                          color="red"
                        />
                      </Text>
                    </Pressable>
                  </View>
                  <View>
                    <View style={[styles.tablewrap]}>
                      <View style={styles.mainCopyheading}>
                        <Text style={{ fontWeight: "bold", padding: 5 }}>
                          Main Copy
                        </Text>
                        <View style={styles.inputContainer}>
                          <Pressable onPress={() => handleRemoveCopy(index)}>
                            <Text style={styles.crossiconWrap}>
                              <Entypo name="cross" size={24} color="#fff" />
                            </Text>
                          </Pressable>
                        </View>
                      </View>
                      <View>
                        {copy.mainCopy ? (
                          <View
                            key={index}
                            style={[
                              styles.sheetDetails,
                              styles.box,
                              styles.boxtext,
                            ]}
                          >
                            <Text style={[styles.header]}>
                              AnswerSheet Number {index + 1}
                            </Text>
                            <Text style={[styles.examname]}>
                              {copy.mainCopy}
                            </Text>
                            <View style={styles.iconsWrap}>
                              {!(
                                copy.alternateCopies.length > 0 ||
                                copy.alternateCopies?.includes("")
                              ) && (
                                <Entypo
                                  name="circle-with-cross"
                                  size={20}
                                  color="red"
                                  onPress={() =>
                                    handleSaveCopy("AnswerSheet", "", index)
                                  }
                                />
                              )}
                            </View>
                          </View>
                        ) : (
                          <View
                            style={[
                              styles.sheetDetails,
                              styles.box,
                              styles.boxtext,
                            ]}
                          >
                            <Text style={{ fontWeight: "bold" }}>
                              AnswerSheet {index + 1}
                            </Text>
                            <MaterialCommunityIcons
                              name="barcode-scan"
                              onPress={() =>
                                startScanning("AnswerSheet", index)
                              }
                              size={40}
                              color="black"
                            />
                            <Text>OR</Text>
                            {renderCopyInput("AnswerSheet", index)}
                          </View>
                        )}
                      </View>

                      {copy.mainCopy && (
                        <View>
                          {copy.alternateCopies.map(
                            (alternateCopy, copyIndex) =>
                              alternateCopy ? (
                                <View>
                                  <View key={index} style={[styles.box]}>
                                    <View
                                      style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <Text style={[styles.header]}>
                                        Alternate Copy {copyIndex + 1}
                                      </Text>
                                      <View style={styles.boxtext}>
                                        <Text style={[styles.examname]}>
                                          {alternateCopy}
                                        </Text>
                                        <View>
                                          {copyIndex ===
                                            copy.alternateCopies.length - 1 && (
                                            <View>
                                              <Entypo
                                                name="circle-with-cross"
                                                size={20}
                                                color="red"
                                                marginLeft="10px"
                                                onPress={() =>
                                                  handleSaveCopy(
                                                    "Alternate",
                                                    "",
                                                    index,
                                                    copyIndex
                                                  )
                                                }
                                              />
                                            </View>
                                          )}
                                        </View>
                                      </View>
                                    </View>
                                  </View>
                                  {copyIndex ===
                                    copy.alternateCopies.length - 1 &&
                                    copy.alternateCopies.length < 6 && (
                                      <Pressable
                                        style={styles.submitButton}
                                        onPress={() =>
                                          handleAddAlternateCopy(index)
                                        }
                                      >
                                        <Text
                                          style={{
                                            color: "#fff",
                                            textAlign: "center",
                                            alignItems: "center",
                                          }}
                                        >
                                          Add SupplySheet
                                        </Text>
                                      </Pressable>
                                    )}
                                </View>
                              ) : (
                                <View style={styles.supplysheet}>
                                  <Text style={{ fontWeight: "bold" }}>
                                    Supply{" "}
                                  </Text>
                                  <MaterialCommunityIcons
                                    name="barcode-scan"
                                    onPress={() =>
                                      startScanning(
                                        "Alternate",
                                        index,
                                        copyIndex
                                      )
                                    }
                                    size={40}
                                    color="black"
                                  />
                                  <Text>OR</Text>
                                  {renderCopyInput(
                                    "Alternate",
                                    index,
                                    copyIndex
                                  )}
                                </View>
                              )
                          )}
                          {copy.alternateCopies.length === 0 && (
                            <Pressable
                              style={styles.submitButton}
                              onPress={() => handleAddAlternateCopy(index)}
                            >
                              <Text style={{ color: "#fff" }}>
                                Add SupplySheet
                              </Text>
                            </Pressable>
                          )}
                        </View>
                      )}

                    </View>
                  </View>
                </View>
              ))
            ) : (
              <Text style={[styles.tablewrap, styles.nodatadisplay]}>
                There is no answersheet added yet!
              </Text>
            )}
            <View style={styles.buttonWrap}>
              <Pressable
                style={styles.submitButton}
                onPress={
                  reportId ? handleStudentInfoUpdate : handleStudentInfoSubmit
                }
              >
                <Text style={styles.addButtonText}>
                  {" "}
                  {reportId ? "Update" : "Submit"}
                </Text>
              </Pressable>
              <Pressable
                style={styles.submitButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.addButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View> */}


          {/* -------------------------------------------------- New AnsweSheet code-------------------------------------------- */}
          <View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.addAnsheading}>Answersheet</Text>
              {((copiesData?.length < 4 && isActive && attendenceStatus != 'Debarred')) && (
                <AntDesign style={styles.addicon} name="pluscircleo" size={24} color="black" onPress={handleAddCopy} />
              )}
            </View>
            {copiesData?.length > 0 ? (
              copiesData.map((copy, index) => (
                <View key={copy.id || index}>
                  <View>
                    <View style={[styles.tablewrap]}>
                      <View style={styles.mainCopyheading}>
                        <Text style={{ fontWeight: "bold", padding: 5 }}>
                          Main Copy
                        </Text>
                        {isActive &&(
                        <View style={styles.inputContainer}>
                        <Pressable onPress={() => handleRemoveCopy(index)}>
                          <Text style={styles.addButtonText}>
                            <AntDesign name="delete" size={24} alignItems="flex-end" color="red" />
                          </Text>
                        </Pressable>
                      </View>
                      )}                      
                      </View>
                      <View>
                        {copy.mainCopy ? (
                          <View
                            key={index}
                            style={[
                              styles.sheetDetails,
                              styles.box,
                              styles.boxtext,
                              styles.boxcopy,
                            ]}
                          >
                            {/* <Text style={[styles.header]}>
                              AnswerSheet Number{" "}
                            </Text> */}
                            <Text style={[styles.examname]}>
                              {copy.mainCopy}
                            </Text>
                            <View style={[styles.iconsWrap]}>
                              {/* {!(( copy.alternateCopies.length > 0 || copy.alternateCopies?.includes("")) && isActive */}
                              {isActive
                               && (
                                  <Entypo
                                    name="circle-with-cross"
                                    size={20}
                                    color="red"
                                    onPress={() =>
                                      handleSaveCopy("AnswerSheet", "", index)
                                    }
                                  />
                                )}
                            </View>
                          </View>
                        ) : (
                          <View
                            style={[
                              styles.sheetDetails,
                              styles.box,
                              styles.boxtext,
                            ]}
                          >
                            {/* <Text style={{ fontWeight: "bold" }}>
                              AnswerSheet {index + 1}
                            </Text> */}
                            <MaterialCommunityIcons
                              style={styles.gapBwIcon}
                              name="barcode-scan"
                              onPress={() =>
                                startScanning("AnswerSheet", index)
                              }
                              size={50}
                              color="black"
                            />
                            <Text style={styles.gapBwIcon}>OR</Text>
                            {renderCopyInput("AnswerSheet", index, '')}
                          </View>
                        )}
                      </View>

                      {/* {copy.mainCopy && (
                        <View>

                          {copy.alternateCopies && (
                            <View style={styles.cpoiesmainblock}>
                              <View style={styles.supplyblockWrap}>                                
                                {copy.alternateCopies.length < 6 ? 
                                  (<View style={styles.buttoncontainer}>
                                    <Pressable style={styles.addsuplybtn} onPress={() => handleAddAlternateCopy(index)}>
                                      <Text style={{ color: "#fff", textAlign: "center", }}>Add SupplySheet</Text>
                                    </Pressable>
                                  </View> ):
                                 ( <Text
                                  style={{ fontWeight: "bold", padding: 10 }}
                                >
                                  Supplementary Sheet
                                </Text>)
                                }
                                {copy.alternateCopies?.length > 0 &&
                                  (<View style={styles.tr}>
                                    <Text style={styles.thead}>Copy No</Text>
                                    <Text style={styles.thead}>Scan</Text>
                                    <Text style={[styles.thead]} >Actions</Text>
                                  </View>)}
                                  {copy.alternateCopies.map(
                                    (alternateCopy, copyIndex) => (
                                      <View style={styles.tr}>

                                        <Text style={styles.td}>{index + 1}.{copyIndex + 1}</Text>


                                        <Text style={[styles.td,]} >
                                          {alternateCopy ? (<Text > {alternateCopy} </Text>
                                          ) : (
                                            <Text style={[styles.tablescan,]} >
                                              <MaterialCommunityIcons name="barcode-scan" onPress={() => startScanning("Alternate", index, copyIndex)} size={24} color="black" />
                                              <Text>OR</Text>
                                              {renderCopyInput("Alternate", index, copyIndex, styles.tableinput)}
                                            </Text>
                                          )}
                                        </Text>


                                        <Text style={[styles.td, styles.tableActionBtn,]} >
                                          <MaterialIcons name="delete" size={24} color="red" onPress={() => handleRemoveAlternateCopy(copyIndex, index)} />
                                        </Text>
                                      </View>
                                    )
                                  )}
                              </View>
                            </View>
                          )}
                        </View>
                      )} */}
                      {/* </> */}
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <Text style={[styles.tablewrap, styles.nodatadisplay]}>
                There is no answersheet added yet!
              </Text>
            )}
          </View>

        <View style={styles.buttonWrap}>
        {((copiesData?.length > 0 || status === "Absent") && ((isActive) || userAccess?.label === "Admin") ) && (<Pressable style={styles.submitButton} onPress={reportId ? handleStudentInfoUpdate : handleStudentInfoSubmit} >
            <Text style={styles.addButtonText}> {" "} {reportId ? "Update" : "Submit"} </Text>
          </Pressable>) }
          
          <Pressable style={[styles.submitButton,{backgroundColor:"red"}]} onPress={() => navigation.goBack()} >
            <Text style={styles.addButtonText}> Cancel </Text>
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
    marginBottom: 20,
    borderRadius: 8,
    padding: 5,
    //overflow: "hidden"
  },
  infoHeader: {
    // fontSize: 14,
    fontSize:18,
    fontWeight: "600",
 
  },

  countWrap:{
    flexDirection:"row",
    alignSelf:"flex-end",
  },
  countDown:{
    flexDirection:"row",
    alignItems:"center"
  },

  countbg1:{
    width:"auto",
    height:"",
    borderRadius:24,
    padding:10,
    //  width:30,
    //  height:30,
     alignItems: "center",
     justifyContent: "center",
     backgroundColor: "#0cb551",
     
  },
  countbg2:{
    borderRadius:3,
    width:30,
    height:30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ea4242",
  },
  countbg3:{
    borderRadius:3,
    width:30,
    height:30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fdbf48",
  },
  countbg4:{
    borderRadius:3,
    width:30,
    height:30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#404142",
  },
  countMain:{
   flexDirection:"row",
   alignItems:"center",
   alignSelf:"center",
   marginTop: 0,
   marginBottom: 20,
   marginRight: 10,
   marginLeft:0
  },
  count:{
    color:"#fff",
    textAlign:"center",
    fontWeight:"600",
    fontSize:12
  },
  cotext:{
    color:"#000",
    marginRight:4,
    fontWeight:"600",
    alignItems:"center",
    textAlign:"center",
    fontSize:14,
    fontWeight: "600",
  },
  infoContainer: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
  },
  infoItem: {
    flex: 1,
    flexDirection: "row",
    maxWidth:250,
    // flexDirection: "column",
    justifyContent: "flex-start",
    marginBottom: 10,
    alignItems: "center" 
  },
  label: {
    fontWeight: "bold",
    color: "#333",
    width: "35%",
    display: "inline-block"
  },
  value: {
    color: "#555",
    width: "65%",
  },
  label1: {
    fontWeight: "bold",
    color: "#333",
    // width: "35%",
    display: "inline-block"
  },
  value1: {
    color: "#555",
    overflow: 'hidden',

  },
  // table: {
  //   // borderWidth: 1,
  //   // borderColor: "#DDDDDD",
  //   borderRadius: 10,
  //   overflow: "hidden",
  //   backgroundColor: "#F9F9F9",
  //   marginBottom: 20,
  //   padding: 10,
  // },
  tablewrap: {
    backgroundColor: "#FFFFFF",
    padding: 5,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#FFF",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  cell: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    color: "#333333",
  },
  header: {
    fontWeight: "bold",
    backgroundColor: "#F0F0F0",
  },
  inputContainer: {
    flexDirection: "row",
    display: "flex",
    alignItems: "center",
    maxWidth: 150
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    // padddingTop:10,
    // paddingBottom:10,
    // paddingLeft:5,
    // paddingRight:5,
    padding:8,
    marginRight: 8,
    maxWidth: 150
  },
  addButton: {
    backgroundColor: "#129912",
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    minWidth: 75
  },
  trashButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    alignItems: "center",
    textAlign: "center",
    marginRight: 5
  },
  removeButton: {
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
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
    marginTop: 0,
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: "#0C7C62",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginRight: 10,
    Width: 100,
  },
  mainCopyText: {
    color: "#000000",
    elevation: 5,
    fontWeight: "bold",
  },
  addAnsheading: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 10,
  },
  nodatadisplay: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    padding: 12,
    marginTop: 12,
    width: "90%",
    margin: "auto"
  },
  box: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start"  
  },

  boxcopy:{
  justifyContent:"space-between"
  },
  boxtext: {
    flexDirection: "row",
    color: "#000000",
  },
  iconsWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  addicon: {
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  supplysheet: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sheetDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
 
  },
  answerSheetWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
  
    width: "auto",
    alignItems: "center",
  },

  saveicon: {
    position: "relative",
    top: 0,
    right: 0,
  },

  mainCopyheading: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  userimage: {
    width: 90,
    height: 90,
  },
  signaturemob:{
  width:50,
  height:30,
  },

  signature:{
  width:170,
  height:50,
  borderWidth:1,
  borderColor:"#dadada"
  },

  studProfile: {
    // width: 100,
    // height: 100,
    width: isMobile ? 54 : 170,
    height:isMobile ? 66 : 215,
    backgroundColor: '#dfdfdf',
    // borderRadius: 50,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    verticalAlign: "middle",
    marginBottom: 20
  },
  studProfilemob:{
  // width:50,
  // height:64,
  },
  copiesdataWrap: {
    marginTop: 10,
    backgroundColor: "rgb(240 243 245)",
    borderWidth: 1,
    padding: 8,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  mainWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  crossiconWrap: {
    backgroundColor: "red",
    borderRadius: 5,
  },
  addsuplybtn: {
    backgroundColor: "#0C7C62",
    padding: 10,
    borderRadius: 5,
    marginTop: 0,
    width: 130,
    textAlign: "center",
    marginBottom: 10,
  },
  tr: {
    flexDirection: "row",
    marginBottom: 4,
  },
  thead: {
    flex: 1,
    fontWeight: "bold",
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  td: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cpoiesmainblock: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 10,
    width: "auto",
    marginTop: 0,
  },
  // tablescan: {
  //   alignItems: "center",
  //   justifyContent: "space-between",
  //   flexDirection:"row",
  //   justifyContent:"space-between",
  // },
  tableActionBtn: {
    display: "flex",
  },
  // theadcopy: {
  //   width: "20%",
  //   flexWrap: "wrap",
  // },
  // tdcopyno: {
  //   width: "20%",
  // },
  // theadscan: {
  //   width: "60%",
  // },
  // tdscan: {
  //   width: "20%",
  // },
  doneWrap: {
    backgroundColor: "rgb(4 63 127)",
    borderRadius: 4,
    padding:10,
    width:75,
    textAlign:"center",
    alignItems:"center"
  },
  tableinput: {
   display: "none"
  },
  dropdown: {
    width: 160,
    minHeight: 30,
    borderWidth: 0,
  },
  dropdownContainer: {
    width: 160,
    padding: [10, 5],
    height: "auto",
  },
  dropdownWrap: {
    width: "40%",
    zIndex: 1000,
  },

  customValue:{
    fontSize: 12,
    marginTop: 5,
    fontWeight: "bold"
  },
  attStatus: {
    width: 75,
    flexDirection: "column",
    marginRight: 0,
  },
  completeBackground:{
 
    backgroundColor:"red"
  },
  gapBwIcon: {
    marginRight: 6
  },
  headerWrap:{
        // justifyContent:"space-between" ,
        // alignItems:"center",
        marginBottom:12,
        alignSelf:"flex-end"
   
},
infoItemWrap:{
  width:"80%"
},
userDetailWrap: {
  // width: "100%",
  // alignItems: "center",
  width:"20%",
  display: "flex",
  // justifyContent: 'center'
},
infopWrap:{
  flexDirection:"row",
},

});
