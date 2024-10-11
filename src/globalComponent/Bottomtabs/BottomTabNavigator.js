 import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from "../../component/Dashboard/DashboardScreen";
import ExamScreen from "../../component/Exam/ExamScreen";
import Privacy from "../../component/LandingScreeens/Privacy";

const BottomTab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const [isMenuVisible, setMenuVisible] = useState(false); 

  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
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
              iconName = focused ? 'settings' : 'settings-outline';
            } else if (route.name === 'Privacy') {
              iconName = 'menu'; // Use the same icon for focused and unfocused
            }

            // Return the Ionicons component
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <BottomTab.Screen name="Dashboard" component={DashboardScreen} />
        <BottomTab.Screen name="Exam" component={ExamScreen} />
        <BottomTab.Screen
          name="Privacy"
          component={Privacy} // Link Privacy component directly here
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
            <Text style={styles.menuItem} onPress={() => alert('Privacy Policy')}>
              Privacy Policy
            </Text>
            <Text style={styles.menuItem} onPress={() => alert('Terms of Service')}>
              Terms of Service
            </Text>
            <Text style={styles.menuItem} onPress={() => alert('Help')}>
              Help
            </Text>
            <TouchableOpacity onPress={toggleMenu}>
              <Text style={styles.closeMenu}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
