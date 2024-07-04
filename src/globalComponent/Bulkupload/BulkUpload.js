import React, { useState, useCallback } from 'react';
import { View, Pressable, Text, FlatList, StyleSheet, Platform, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as XLSX from 'xlsx';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { bulkupload } from "../../AuthService/AuthService";
import { useToast } from "../../globalComponent/ToastContainer/ToastContext";
import { Ionicons ,FontAwesome5,AntDesign,Entypo ,MaterialCommunityIcons} from '@expo/vector-icons'; 

const BulkUpload = (props) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const { addToast } = useToast();

const pickFile = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: Platform.OS === 'ios' || Platform.OS === 'android'
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'
        : 'application/*',
    });
    if (!result.canceled) {
      setSelectedFile({
        // uri: result.uri,
        // name: result.name,
        // type: result.mimeType,
        uri: result.assets[0].uri,
        name: result.assets[0].name,
        type: result.assets[0].mimeType,
      });
      // readExcelFile(result.uri);
      readExcelFile(result.assets[0].uri);
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
      
      setExcelData(content);
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
        // const content = await FileSystem.readAsStringAsync(fileUri);
        // return parseExcelData(content);
        const workbook = XLSX.read(content, { type: 'base64' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        return XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      } else {
        throw new Error('File does not exist or is not a file');
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
      reader.onload = () => {
        const content = reader.result;
        const parsedExcelData =parseExcelData(content); 
         // Remove empty rows from parsedExcelData
      const filteredExcelData = parsedExcelData.filter(row => row.length > 0 && row.some(value => value !== ""));
  
        setExcelData(filteredExcelData);
      };
      reader.onerror = (error) => {
        console.error('Error in reading file:', error);
        addToast('Error in reading file.', 'error');
      };
      reader.readAsBinaryString(blob);
    } catch (error) {
      console.error('Error in reading file:', error);
      addToast('Error in reading file.', 'error');
    }
  };

  const parseExcelData = (data) => {
    const workbook = XLSX.read(data, { type: 'binary' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  };

  const checkAuthToken = useCallback(async () => {
    const authToken = await AsyncStorage.getItem("authToken");
    if (!authToken) {
      addToast("Authentication token is not available", "error");
      throw new Error("Authentication is token not available");
    }
    return authToken;
  }, [addToast]);

  const handleBulkInvigiltor = async () => {
    try {
      if (!selectedFile) {
        addToast('Please select a file to upload.', "error");
        return;
      }
      else if(excelData?.length  < 2){
        addToast('Please check the file data is empty.', "error");
        return;
      } else {
        const authToken = await checkAuthToken();
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
  
        if (response) {
          setSelectedFile(null);
          addToast(response?.data?.message, "success");
        }
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
  };
  return (
    <View style={styles.container}>
      <Pressable style={[styles.pickFileButton,{position:"relative", top:"40%"}]} onPress={() => pickFile()}>
        <Text style={styles.buttonText}>Browse File</Text>
      </Pressable>
      {selectedFile && (
        <ScrollView style={styles.fileContainer}>
          <View style={styles.fileDetails}>
            <Text style={styles.fileName}>Selected File: <Text style={{color:"green"}}>{selectedFile.name}</Text></Text>
            <Text style={styles.previewTitle}>Preview:</Text>
            <ScrollView horizontal={true} vertical={true}>
            <FlatList
              data={excelData?.slice(1)}
              keyExtractor={(item, index) => index.toString()}
              ListHeaderComponent={props?.renderData}
              renderItem={({ item }) => (
                <View style={styles.listItem}>
                {item?.map((data, index) => (
                    <Text key={index} style={styles.listItemText}>{data}</Text>
                  ))}

                  {/* <Text style={styles.listItemText}>{item?.[0]}</Text>
                  <Text style={styles.listItemText}>{item?.[1]}</Text>
                  <Text style={styles.listItemText}>{item?.[2]}</Text>
                  <Text style={styles.listItemText}>{item?.[3]}</Text>
                  <Text style={styles.listItemText}>{item?.[4]}</Text>
                  <Text style={styles.listItemText}>{item?.[5]}</Text> */}
                </View>
              )}
            />
            </ScrollView>
            <View style={[styles.buttonContainer,]}>
              <Pressable style={styles.uploadButton} onPress={() => handleBulkInvigiltor()}>
                <Text style={styles.buttonText}>Upload</Text>
              </Pressable>
              <Pressable style={styles.cancelButton} onPress={() => cancelUpload()}>
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      )}
      {props?.handleClose && (
        <Pressable style={[styles.cancelButton,{position:"relative", top:-38}]} onPress={() => props?.handleClose()}>
          <Text style={styles.buttonText}>Go Back

          {/* <MaterialCommunityIcons name="keyboard-backspace" size={22} color="white" textAlign="center" /> */}
          
          </Text>
     
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
    // marginTop: 20,
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
  }
});

export default BulkUpload;
