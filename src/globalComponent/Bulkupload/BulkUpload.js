import React, { useState } from 'react';
import { View, Pressable, Text, FlatList, StyleSheet, Platform, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as XLSX from 'xlsx';

const BulkUpload = () => {
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

  const uploadFile = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    const uploadUrl = 'http://your-server-ip:3000/upload';
    const formData = new FormData();

    formData.append('file', {
      uri: selectedFile.uri,
      type: selectedFile.type,
      name: selectedFile.name,
    });

    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // Add progress tracking using platform-specific methods (optional)
      });

      const data = await response.json();
      console.log('Upload successful:', data);
      setSelectedFile(null);
      setUploadProgress(0);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Error uploading file.');
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
              <Pressable onPress={() => uploadFile()}>
                <Text>Upload</Text>
              </Pressable>
              <Pressable onPress={() => cancelUpload()}>
                <Text>Cancel</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
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
