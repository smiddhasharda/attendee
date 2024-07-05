import React, { useState, useCallback } from 'react';
import { View, Pressable, Text, FlatList, StyleSheet, Platform, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as XLSX from 'xlsx';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { bulkupload,view } from "../../AuthService/AuthService";
import { useToast } from "../../globalComponent/ToastContainer/ToastContext";
import { FontAwesome} from '@expo/vector-icons'; 
import Pagination from '../Pagination/PaginationComponent';

const BulkUpload = (props) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [duplicateData,setDuplicateData] =useState([]);
  const { addToast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentDuplicatePage, setCurrentDuplicatePage] = useState(1);

  const pageSize = 10;
  const duplicatePageSize = 10;

const pickFile = async () => {
  try {
    let result = await DocumentPicker.getDocumentAsync({
      type: Platform.OS === 'ios' || Platform.OS === 'android'
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'
        : 'application/*',
    });
    if (!result.canceled) {
      setSelectedFile({
        uri: result.assets[0].uri,
        name: result.assets[0].name,
        type: result.assets[0].mimeType,
      });
      readExcelFile(result.assets[0].uri);
    }
  } catch (error) {
      console.error('Error picking file:', error);
      addToast('Error picking file.', 'error');
    }
  };

  const readExcelFile = async (fileUri) => {
    try {
      let content;
      if (Platform.OS === 'web') {
        content = await readExcelFileWeb(fileUri); 
      } else {
        content = await readExcelFileMobile(fileUri);
      }

      const validData = validateAndProcessData(content);
      if (validData.isValid) {
        setExcelData(validData.data);
      } else {
        addToast(validData.error, 'error');
      }
    } catch (error) {
      console.error('Error in reading file:', error);
      addToast('Error in reading file.', 'error');
    }
  };
  
  const readExcelFileMobile = async (fileUri) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (fileInfo.exists && fileInfo.isFile) {
        const content = await FileSystem.readAsStringAsync(fileUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const workbook = XLSX.read(content, { type: 'base64' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        return XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      } else {
        addToast('File does not exist or is not a file','error');
      }
    } catch (error) {
      console.error('Error reading file:', error);
      throw error;
    }
  };
  
  const readExcelFileWeb = async (fileUri) => {
    try {
      const response = await fetch(fileUri);
      const blob = await response.blob();
      const reader = new FileReader();
  
      return new Promise((resolve, reject) => {
        reader.onload = () => {
          const arrayBuffer = reader.result;
          const content = new Uint8Array(arrayBuffer);
          const workbook = XLSX.read(content, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const parsedExcelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          const filteredExcelData = parsedExcelData.filter(row => row.length > 0 && row.some(value => value !== ""));
          resolve(filteredExcelData);
        };
        reader.onerror = (error) => {
          console.error('Error in reading file:', error);
          reject(error);
        };
  
        reader.readAsArrayBuffer(blob);
      });
    } catch (error) {
      console.error('Error in reading file:', error);
      addToast('Error in reading file.','error');
    }
  };
  
  const validateAndProcessData = (data) => {
    if (!data || data.length < 2) {
      return { isValid: false, error: 'No data or insufficient data rows.' };
    }
  
    const headers = data[0];
    const rows = data.slice(1);
  
    const requiredColumns = ['employeeId', 'invigilatorName', 'date', 'room', 'shift'];
    const errors = [];
    const uniqueRows = new Set();
    const duplicateIndices = [];
  
    for (let col of requiredColumns) {
      if (!headers.includes(col)) {
        errors.push(`Missing column "${col}" in header.`);
      }
    }
  
    const processedRows = rows.map((row, index) => {
      const processedRow = {};
  
      headers.forEach((header, idx) => {
        processedRow[header] = row[idx];
      });
  
      if (processedRow['date']) {
        try {
          processedRow['date'] = convertExcelDateToJSDate(processedRow['date']);
        } catch (error) {
          errors.push(`Invalid date format at row ${index + 2}`);
        }
      }
  
      const rowString = JSON.stringify(processedRow);
      if (uniqueRows.has(rowString)) {
        duplicateIndices.push(processedRow);
      } else {
        uniqueRows.add(rowString);
      }
  
      requiredColumns.forEach((column, colIndex) => {
        if (!processedRow[column] || processedRow[column] === '') {
          errors.push(`Missing or empty column "${column}" at row ${index + 2}`);
        } else if (column === 'date' && !isValidDateFormat(processedRow[column])) {
          errors.push(`Invalid date format at row ${index + 2}. Date should be in yyyy-MM-dd format.`);
        }
      });
      setDuplicateData(duplicateIndices);
      return processedRow;
    }).filter(row => row !== null); 
  
    if (errors.length > 0) {
      return { isValid: false, error: errors.join('\n') };
    }
  
    return { isValid: true, data: processedRows };
  };

  const convertExcelDateToJSDate = (excelDateNumber) => {
    const date = new Date(Date.UTC(1899, 11, 30));
    date.setDate(date.getDate() + excelDateNumber);
  
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date value for Excel date number ${excelDateNumber}`);
    }
  
    return date.toISOString().slice(0, 10);
  };
  
//   const ExcelDateToJSDate = (date) => {
//     let converted_date = new Date(Math.round((date - 25569) * 864e5));
//     converted_date = String(converted_date).slice(4, 15)
//     date = converted_date.split(" ")
//     let day = date[1];
//     let month = date[0];
//     month = "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(month) / 3 + 1
//     if (month.toString().length <= 1)
//         month = '0' + month
//     let year = date[2];
//     return String(day + '-' + month + '-' + year.slice(2, 4))
// }

  const isValidDateFormat = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dateString);
  };

  const checkAuthToken = useCallback(async () => {
    try {
    const authToken = await AsyncStorage.getItem("authToken");
    if (!authToken) {
      addToast("Authentication token is not available", "error");
    }
    return authToken;
  } catch (error) {
    console.error('Error fetching auth token:', error);
    addToast("Error fetching authentication token", "error");
  }
  }, [addToast]);

  
  const handleGetEmployeeSearch = async () => {
    try {
      const authToken = await checkAuthToken();
      let EmployeeeSearch = excelData?.map((data) => `'${data.employeeId}'`).join();
      const response = await view(
        {
          operation: "custom",
          tblName: "PS_SU_PSFT_COEM_VW",
          data: '',
          conditionString: '',
          checkAvailability: '',
          customQuery: `SELECT DISPLAY_NAME, EMPLID FROM PS_SU_PSFT_COEM_VW WHERE EMPLID IN (${EmployeeeSearch})`,
          viewType: 'HRMS_View'
        },
        authToken
      );
  
      const dbEmployeeIds = new Set(response?.data?.receivedData?.map(emp => emp.EMPLID));
      const missingEmployeeIds = excelData.filter(data => !dbEmployeeIds.has(data.employeeId));
  
      if (missingEmployeeIds.length === 0) {
        handleBulkInvigilator();
      } else {
        const missingIdsString = missingEmployeeIds.map(data => data.employeeId).join(', ');
        addToast(`The following employee IDs are incorrect: ${missingIdsString}`, 'error', false);
      }
    } catch (error) {
      console.log(error)
      handleAuthErrors(error);
    }
  };
  
  const handleBulkInvigilator = async () => {
    try {
      if (!selectedFile) {
        addToast('Please select a file to upload.', "error");
        return;
      } else if (excelData?.length < 1) {
        addToast('Please check the file data is empty.', "error");
        return;
      }
        const authToken = await checkAuthToken();
        if (!authToken) return;
        const formData = new FormData();
        formData.append("tblName", "tbl_invigilator_duty");
        formData.append("conditionString", "employeeId = ? AND date = ? AND room = ? AND shift = ?");
        formData.append("checkColumn", JSON.stringify(["employeeId", "date", "room", "shift"]));
        formData.append("checkAvailability", true);
        const { fileName, uri, mimeType } = selectedFile;
        const response1 = await fetch(uri);
        const blob = await response1.blob();
        const SelectedFile = new File([blob], fileName, { type: mimeType });
        formData.append("bulkupload_doc", SelectedFile);
        
        const response = await bulkupload(formData, authToken);
        const existingRows = response?.data?.existingRows;
        if (response) {
          setSelectedFile(null);
          setExcelData([]);
          setDuplicateData([]);
          addToast(
            response?.data?.message + 
            (existingRows?.length > 0 
              ? existingRows.map(item => 
                  `{ Employee Id: ${item?.employeeId}, Room Number: ${item?.room}, Shift: ${item?.shift} }`
                ).join(',')
              : ''
            ), 
            existingRows?.length > 0 ? 'error' : 'success', 
            false
          );
          
          
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
        addToast("Data already exists!", "error");
        break;
      case "No response received from the server":
        addToast("No response received from the server", "error");
        break;
      default:
        addToast("Bulk Upload Operation Failed", "error");
    }
  };

  const cancelUpload = () => {
    setSelectedFile(null);
    setExcelData([]);
    setDuplicateData([]);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleDuplicatePageChange = (page) => {
    setCurrentDuplicatePage(page);
  };

  const paginatedData = excelData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const paginatedDuplicateData = duplicateData.slice((currentDuplicatePage - 1) * duplicatePageSize, currentDuplicatePage * duplicatePageSize);


  return (
    <View style={styles.container}>
      {selectedFile ? (
        <ScrollView style={styles.fileContainer}>
          <View style={styles.fileDetails}>
          <Text style={styles.fileName}>Selected File: <Text style={{color:"green"}}>{selectedFile.name}</Text> <Pressable onPress={() =>cancelUpload()}>
            <FontAwesome name="remove" size={20} color="red" />
              </Pressable></Text>
              <Text style={styles.previewTitle}>Preview:</Text>
              <ScrollView horizontal={true} vertical={true}>
                <FlatList
                  data={paginatedData}
                  keyExtractor={(item, index) => index.toString()}
                  ListHeaderComponent={props?.renderData}
                  renderItem={({ item }) => (
                    <View style={styles.listItem}>
                        <Text style={styles.listItemText}>{item.employeeId}</Text>
                        <Text  style={styles.listItemText}>{item.invigilatorName}</Text>
                        <Text  style={styles.listItemText}>{item.date}</Text>
                        <Text  style={styles.listItemText}>{item.shift}</Text>
                        <Text  style={styles.listItemText}>{item.room}</Text>
                        <Text  style={styles.listItemText}>{item.duty_status}</Text>                 
          </View>
                  )}
                />
              </ScrollView>
              <Pagination
                    totalItems={excelData.length}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
              />
            {duplicateData?.length > 0  && 
                <View style={styles.fileDetails}>
                <Text style={styles.previewTitle}>Duplicate Rows:</Text>
                <ScrollView horizontal={true} vertical={true}>
                <FlatList
                  data={paginatedDuplicateData}
                  keyExtractor={(item, index) => index.toString()}
                  ListHeaderComponent={props?.renderData}
                  renderItem={({ item }) => (
                    <View style={styles.listItem}>
                        <Text style={styles.listItemText}>{item.employeeId}</Text>
                        <Text  style={styles.listItemText}>{item.invigilatorName}</Text>
                        <Text  style={styles.listItemText}>{item.date}</Text>
                        <Text  style={styles.listItemText}>{item.shift}</Text>
                        <Text  style={styles.listItemText}>{item.room}</Text>
                        <Text  style={styles.listItemText}>{item.duty_status}</Text>                 
                       </View>
                  )}
                />
                  <Pagination
          totalItems={duplicateData.length}
          pageSize={duplicatePageSize}
          currentPage={currentDuplicatePage}
          onPageChange={handleDuplicatePageChange}
        />
                </ScrollView>
              </View>
            }
            <View style={styles.buttonContainer}>
            {!(duplicateData?.length > 0)  && <Pressable style={styles.uploadButton} onPress={() => handleGetEmployeeSearch()}>
                <Text style={styles.buttonText}>Upload</Text>
              </Pressable>}
              <Pressable style={styles.cancelButton} onPress={() => cancelUpload()}>
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>      
        </ScrollView>
      ) : (
        <Pressable style={[styles.pickFileButton,{position:"relative", top:"40%"}]} onPress={() => pickFile()}>
      <Text style={styles.buttonText}>Browse File</Text>
    </Pressable>
      )}
      {props?.handleClose && (
         <Pressable style={[styles.cancelButton,{position:"relative", top:-38}]} onPress={() => props?.handleClose()}>
         <Text style={styles.buttonText}>Go Back</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  pickFileButton: {
    padding: 10,
    backgroundColor:'#0C7C62',
    borderRadius: 5,
    marginBottom:5,
    width:120,
    alignSelf:"center",
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  fileContainer: {
    width: '100%',
  },
  fileDetails: {
    alignItems: 'center',
  },
  fileName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf:"flex-start",

  },
  previewTitle: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: 'bold',
    alignSelf:"flex-start",
    fontSize:20
  },
  cell: {
    padding: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent:"space-between",
    alignSelf:"flex-end"
  },
  uploadButton: {
    padding: 10,
    backgroundColor: '#4caf50',
    borderRadius: 5,
    marginRight: 10,
  },
  cancelButton: {
    padding: 10,
    backgroundColor: '#f44336',
    borderRadius: 5,
    width:100,
    alignSelf:"flex-end",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgb(17, 65, 102)",
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  tableHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  moduleListContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  listItemText: {

    width:220,
  },
  listItemActiveStatus: {
    color: "green",
  },
  listItemInactiveStatus: {
    color: "red",
  },
  listItemEditButton: {
    backgroundColor: "#0C7C62",
    padding: 4,
    borderRadius: 5,
  },
  listItemActionContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  backbtnWrap:{
    backgroundColor:"red",
    width:100,
   borderRadius:5,
   padding:4, 
   position:"relative",
   top:-38, 
   alignSelf:"flex-end"
  },
  // paginationStyling: {
  //   display: "block"
  // }
});

export default BulkUpload;
