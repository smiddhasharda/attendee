import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../component/Dashboard/DashboardScreen';
import ExamScreen from '../component/Exam/ExamScreen';
import RoleScreen from '../component/Roles/RoleScreen';
import StudentInfo from '../component/Student/StudentInfo';
import { Ionicons } from '@expo/vector-icons'; 
import { Platform } from 'react-native-web';

const Tab = createBottomTabNavigator();
const screenOptions={
  tabBarShowLabel:false,

  tabbarStyle:{
    position:"absolute",
    bottom:0,
    right:0,
    left:0,
    backgroundColor:"#fff",
    height:Platform.OS ==="ios" ? 90 :60,
  }

}

function TabNavigator() {
  return (
    <Tab.Navigator
       screenOptions={{
            tabBarLabelPosition: "below-icon",
            tabBarShowLabel:true,
            tabBarActiveTintColor:"blue",
           }}
       >
        <Tab.Screen name="Dashboard" component={DashboardScreen} options={{
            tabBarLabel: "My Dashboard",
            tabBarIcon: () => <Ionicons name='home' size={20} />,
            tabBarBadge:2,
             }}  
        />

        <Tab.Screen name="Exam" component={ExamScreen}   />
        <Tab.Screen name="RoleScreen" component={RoleScreen} />
        <Tab.Screen name="StudentInfo" component={StudentInfo} />
      </Tab.Navigator>
 
  );
}

export default TabNavigator;
