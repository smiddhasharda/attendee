import React from 'react'
import { View, Text, Pressable, StyleSheet,Label } from 'react-native';

const ManagePassword = () => {
  return (
    <View style={styles.container}>
    ManagePassword
    <Label>Current Password:</Label>
    <TextInput style={styles.input}></TextInput>
    
    </View>
  )
}

export default ManagePassword;

const styles = StyleSheet.create({
    container:{

    }

})