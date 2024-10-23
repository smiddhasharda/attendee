import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // If using React Navigation

const Profile = () => {
  const navigation = useNavigation();
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    employeeId: '',
    username: '',
    phone: '',
    address: ''
  });

  // Simulate fetching user details
  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    // Simulate an API call to get user data
    const fetchedData = {
      name: 'Megha Yadav',
      email: 'medha@gmail.com',
      employeeId: '8309033',
      username: 'meghay',
      phone: '8709823339',
      address: '123 Main St, City, Country'
    };
    setUserDetails(fetchedData);
  };

  const handleEdit = () => {
    // Navigate to the edit profile screen or open a modal
    navigation.navigate('EditProfile', { userDetails });
  };

  const handleLogout = () => {
    // Implement logout logic (clearing user session, tokens, etc.)
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: () => {
        console.log('Logging out...');
        // Clear session and navigate to login screen
        navigation.replace('Login');
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        <Image
          source={require("../../local-assets/profile.jpg")}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{userDetails.name}</Text>
        <Text style={styles.email}>{userDetails.email}</Text>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Employee Id</Text>
          <Text style={styles.detailValue}>{userDetails.employeeId}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Username:</Text>
          <Text style={styles.detailValue}>{userDetails.username}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Email:</Text>
          <Text style={styles.detailValue}>{userDetails.email}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Phone:</Text>
          <Text style={styles.detailValue}>{userDetails.phone}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Address:</Text>
          <Text style={styles.detailValue}>{userDetails.address}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    padding: 20,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  editButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  detailsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  detailValue: {
    fontSize: 16,
    color: '#666',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Profile;
