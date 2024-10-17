import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const Profile = () => {
  const handleEdit = () => {
    // Logic for editing the profile
    console.log('Edit Profile');
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.headerText}>My Profile</Text>
      </View> */}

      <View style={styles.profileInfo}>
        <Image
          source= {require("../../local-assets/profile.jpg")} 
          style={styles.profileImage}
        />
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.email}>john.doe@example.com</Text>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Employee Id</Text>
          <Text style={styles.detailValue}>8309033</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Username:</Text>
          <Text style={styles.detailValue}>johndoe</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Email:</Text>
          <Text style={styles.detailValue}>johndoe@gmail.com</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Phone:</Text>
          <Text style={styles.detailValue}>8709823339</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Address:</Text>
          <Text style={styles.detailValue}>123 Main St, City, Country</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton}>
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
  header: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
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
