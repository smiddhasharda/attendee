import React, { useState,useCallback } from 'react';
import { View, Pressable, Text, FlatList, StyleSheet, Platform, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as XLSX from 'xlsx';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { bulkupload } from "../../AuthService/AuthService";
import { useToast } from "../../globalComponent/ToastContainer/ToastContext";


const BulkUpload = (props) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const pickFile = async () => {
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
      console.error('Error reading file:', error);
      alert('Error reading file.');
    }
  };

  const readExcelFileMobile = async (fileUri) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (fileInfo.exists && fileInfo.isFile) {
        const content = await FileSystem.readAsStringAsync(fileUri);
        return parseExcelData(content);
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
        setExcelData(parseExcelData(content));
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        alert('Error reading file.');
      };
      reader.readAsBinaryString(blob);
    } catch (error) {
      console.error('Error reading file:', error);
      alert('Error reading file.');
    }
  };

  const parseExcelData = (data) => {
    const workbook = XLSX.read(data, { type: 'binary' });
    const sheetName = workbook.SheetNames[0]; // Assuming only one sheet
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  };

  const { showToast } = useToast();
  const checkAuthToken = useCallback(async () => {
    const authToken = await AsyncStorage.getItem("authToken");

    if (!authToken) {
      showToast("Authentication token not available", "error");
      throw new Error("Authentication token not available");
    }

    return authToken;
  }, [showToast]);

  const handleBulkInvigiltor = async () => {
    try {
      if (!selectedFile) {
        showToast('Please select a file to upload.',"error");
        return;
      } else {
        const authToken = await checkAuthToken();
        const formData = new FormData();
        formData.append("tblName", "tbl_invigilator_duty");
        formData.append("conditionString", "employeeId = ?");
        formData.append("checkColumn", "employeeId");
        formData.append("checkAvailability", true);
        formData.append("bulkupload_doc", selectedFile);
        const { fileName, uri, mimeType } = selectedFile;
        const response1 = await fetch(uri);
        const blob = await response1.blob();
        const ProfilePics = new File([blob], fileName, { type: mimeType });
        formData.append("bulkupload_doc", ProfilePics);
        
        // Assuming bulkupload is a function that handles the file upload
        const response = await bulkupload(formData, authToken);
  
        if (response) {
          setSelectedFile(null);
          showToast(response.message, "success");
        }
      }    
    } catch (error) {
      handleAuthErrors(error);
    }
  };  

  const handleAuthErrors = (error) => {
    switch (error.message) {
      case "Invalid credentials":
        showToast("Invalid authentication credentials", "error");
        break;
      case "Data already exists":
        showToast("Data with the same name already exists", "error");
        break;
      case "No response received from the server":
        showToast("No response received from the server", "error");
        break;
      default:
        showToast("Bulkupload Operation Failed", "error");
    }
  };


  const cancelUpload = () => {
    setSelectedFile(null);
    setExcelData([]);
  };
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Pressable onPress={() => pickFile()}>
        <Text>Pick Excel File</Text>
      </Pressable>
      <ScrollView>
        {selectedFile && (
          <View style={{ marginTop: 20 }}>
            <Text>Selected File:</Text>
            <Text>{selectedFile.name}</Text>
            <Text style={styles.previewTitle}>Preview:</Text>
            <ScrollView>
              <FlatList
                data={excelData}
                renderItem={({ item }) => (
                  <Text style={styles.cell}>{item}</Text>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </ScrollView>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <Pressable onPress={() => handleBulkInvigiltor()}>
                <Text>Upload</Text>
              </Pressable>
              <Pressable onPress={() => cancelUpload()}>
                <Text>Cancel Upload</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
      {props?.handleClose &&
      <Pressable onPress={() => props?.handleClose()}>
                <Text>Cancel</Text>
       </Pressable>}
    </View>
  );
};

const styles = StyleSheet.create({
  previewTitle: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  cell: {
    padding: 5,
  },
});

export default BulkUpload;
