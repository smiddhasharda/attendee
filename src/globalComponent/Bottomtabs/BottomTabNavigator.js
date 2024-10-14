 import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from "../../component/Dashboard/DashboardScreen";
import ExamScreen from "../../component/Exam/ExamScreen";
import Privacy from "../../component/LandingScreeens/Privacy";
import LoginScreen from "../../component/Login/LoginScreen"
import UserScreen from '../../component/User/UserScreen';
import RoleScreen from '../../component/Roles/RoleScreen';

const BottomTab = createBottomTabNavigator();

const BottomTabNavigator = ({navigation}) => {
  const [isMenuVisible, setMenuVisible] = useState(false); 

  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigation.replace("Login");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <BottomTab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Dashboard') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Exam') {
              iconName = focused ? 'book' : 'book';
            } else if (route.name === 'Privacy') {
              iconName = 'log-out-outline'; 
            }
            else if (route.name === 'LoginScreen') {
              iconName = 'settings'; 
            }
            // Return the Ionicons component
            return <Ionicons name={iconName} size={18} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: '#fff',
                tabBarStyle: {
                backgroundColor: 'rgb(17, 65, 102)', 
                padding: 5,
                height: 64, 
                },
                tabBarLabelStyle: {
                  marginTop: 8, 
                  fontSize: 14, 
                },
        })}
      >
        <BottomTab.Screen name="Dashboard" component={DashboardScreen} />
        <BottomTab.Screen name="Exam" component={ExamScreen} /> 
        {/* <BottomTab.Screen name="UserScreen" component={UserScreen} /> 
        <BottomTab.Screen name="RoleScreen" component={RoleScreen} />  */}
        <BottomTab.Screen
          name="Privacy"
          component={Privacy} 
          options={{
            tabBarButton: (props) => (
              <TouchableOpacity {...props} onPress={toggleMenu} />
            ),
          }}
        />
      </BottomTab.Navigator>

      {/* Dropdown menu modal */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={isMenuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.menu}>
            <Text
              style={styles.menuItem}
              onPress={() => {
                toggleMenu();
                navigation.navigate('UserScreen'); 
              }}
            >
              User Role
            </Text>
            <Text
              style={styles.menuItem}
              onPress={() => {
                toggleMenu();
                navigation.navigate('RoleScreen'); 
              }}
            >
              Manage User
            </Text>
            <Text
              style={styles.menuItem}
              onPress={() => {
                toggleMenu();
                navigation.navigate('ChangePassword');
              }}
            >
              Change Password
            </Text>
            <TouchableOpacity onPress={toggleMenu}>
              <Text style={styles.closeMenu}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Role  */}
    </>
  );
};


const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    width: 200,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 10,
    textAlign: 'center',
  },
  closeMenu: {
    color: 'red',
    textAlign: 'center',
    paddingVertical: 10,
  },
});

export default BottomTabNavigator;
