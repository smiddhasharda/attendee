import React, { useState } from 'react';
import { View, Text, Button, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const DashboardScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Welcome To Dashboard</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  }
});

export default DashboardScreen;
