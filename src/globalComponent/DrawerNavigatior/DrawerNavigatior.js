import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Pressable ,Image} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";

import RoleScreen from "../../component/Roles/RoleScreen";
import ModuleScreen from "../../component/Module/ModuleScreen";
import DashboardScreen from "../../component/Dashboard/DashboardScreen";
import UserScreen from "../../component/User/UserScreen";
import ExamScreen from "../../component/Exam/ExamScreen";
import { logout } from "../../AuthService/AuthService";
import DropDownPicker from "react-native-dropdown-picker";
import CustomeImagePicker from "../CustomeImagePicker/CustomeImagePicker";
import { multer, fetch as FetchData } from "../../AuthService/AuthService";
import { useToast } from "../../globalComponent/ToastContainer/ToastContext";
import styles from "./DrawerNavigator.style";
import { Ionicons,Feather } from '@expo/vector-icons'; 
import { SafeAreaView } from "react-native-safe-area-context";

import InvigilatorScreen from "../../component/Invigilator/InvigilatorScreen";

// Screen components
const RoleComponent = ({ userAccess }) => <RoleScreen userAccess={userAccess} />;
const ModuleComponent = ({ userAccess }) => <ModuleScreen userAccess={userAccess} />;
const DashboardComponent = ({ userAccess }) => <DashboardScreen userAccess={userAccess} />;
const UserComponent = ({ userAccess }) => <UserScreen userAccess={userAccess} />;
const ExamComponent = ({ navigation, userAccess, userData }) => (
  <ExamScreen navigation={navigation} userAccess={userAccess} userData={userData} />
);
const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({ ...props }) => {
  const { addToast } = useToast();
  const [file, setFile] = useState("");
  const [open, setOpen] = useState(false);

  const checkAuthToken = useCallback(async () => {
    const authToken = await AsyncStorage.getItem("authToken");
    if (!authToken) {
      addToast("Authentication token not available", "error");
      throw new Error("Authentication token not available");
    }
    return authToken;
  }, [addToast]);

  const handleImageChange = (imageSource) => {
    setFile(imageSource);
  };

  const handleGetUserData = async () => {
    try {
      const authToken = await checkAuthToken();
      const response = await FetchData(
        {
          operation: "fetch",
          tblName: "tbl_user_master",
          data: "",
          conditionString: `user_id = ${props.userData?.user_id}`,
          checkAvailability: "",
          customQuery: "",
        },
        authToken
      );

      if (response) {
        await AsyncStorage.setItem(
          "userData",
          (response.data?.[0] && JSON?.stringify(response.data?.[0])) || ""
        );
        setFile("");
        await props.fetchUserRolePermission();
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };

  const handleProfilePic = async () => {
    try {
      const authToken = await checkAuthToken();
      const formData = new FormData();
      formData.append("tblName", "tbl_user_master");
      formData.append("data", "");
      formData.append("fileParam", "profile_image_url");
      formData.append("conditionString", `user_id = ${props.userData?.user_id}`);

      const { fileName, uri, mimeType } = file?.[0];
      const response1 = await fetch(uri);
      const blob = await response1.blob();
      const ProfilePics = new File([blob], fileName, { type: mimeType });
      formData.append("profile_pics", ProfilePics);
      const response = await multer(formData, authToken);
    
      if (response) {
        await AsyncStorage.removeItem("userData");
        await handleGetUserData();
        addToast(`User Profile Update Successful`, "success");
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
        addToast("Module with the same name already exists", "error");
        break;
      case "No response received from the server":
        addToast("No response received from the server", "error");
        break;
      default:
        addToast("Module Operation Failed", "error");
    }
  };
const sidebaricons=[
    {
      name:"home", 
      size:"20",
      color:"rgb(8 96 88)",
    },
    {
      name:"settings", 
      size:"20",
      color:"rgb(8 96 88)",
    },
    {
      name:"person", 
      size:"20",
      color:"rgb(8 96 88)",
    }
  
]

  return (
    <View style={styles.container}>
      <SafeAreaView>
      <View style={styles.header}>
          <CustomeImagePicker
                imageUri={
                  file?.[0]?.uri ||
                  (props.userData?.profile_image_url &&
                    (global.SERVER_URL +
                      "/userImg/" +
                      props.userData?.profile_image_url ||
                      ""))
                }
                onImageChange={handleImageChange}
                
          />
  
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <>{file && (
              <View style={styles.buttonwrap}>
                <Pressable onPress={() => handleProfilePic()} style={styles.saveButton}>
                  <Text style={styles.btntext}>Save</Text>
                </Pressable>
                <Pressable onPress={() => setFile("")} style={styles.cancelButton}>
                  <Text style={styles.btntext}>Cancel</Text>
                </Pressable>
              </View>
            )}</>
          </View>
          <Text style={styles.username}>{props?.userData?.name}</Text>
          <View style={styles.dropdownWrap}>
            <DropDownPicker
              open={open}
              value={props?.userRoleIndex}
              items={props?.userRoleList}
              setOpen={setOpen}
              setValue={(value) => props?.handleRoleSelect(value)}
              style={styles.dropdown}
              dropDownStyle={{ backgroundColor: "#fafafa"}}
              dropDownMaxHeight={150}
              dropDownDirection="TOP"
              containerStyle={styles.rolePicker}
              listItemContainerStyle={{ height: 40}} 
              listItemLabelStyle={{ fontSize: 14 }}
            />
          </View>
      </View>
      </SafeAreaView>
      <DrawerContentScrollView {...props}>

      <DrawerItemList {...props} style={styles.dropdownmain} />
      <View>
        <Pressable onPress={() => props.handleLogout()}>
          <Text style={{ margin: 16 }}>Logout</Text>
        </Pressable>
      </View>
      </DrawerContentScrollView>
    </View>
  );
};

const DrawerNavigator = ({ navigation }) => {
  const [userRolePermission, setUserRolePermission] = useState([]);
  const [userRoleList, setUserRoleList] = useState([]);
  const [userRoleIndex, setUserRoleIndex] = useState(0);
  const [userData, setUserData] = useState("");
  const TopHeaderCommonConfig = { 
    headerStyle: {
      backgroundColor: 'rgb(17, 65, 102)',
    },
    headerLeftContainerStyle: {
      // paddingLeft: 0,
      // marginLeft: -10, 
    },
    headerTitleContainerStyle: {
      // paddingLeft: 0, 
      marginLeft: 0,
      marginRight:0,
    }, 
    headerTintColor: '#fff',
  }

  const handleRoleSelect = (value) => {
    setUserRoleIndex(value);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigation.replace("Login");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchUserRolePermission = async () => {
    try {
      const userRoleArray = await AsyncStorage.getItem("userRolePermission");
      const parsedUserRoleArray = userRoleArray ? JSON.parse(userRoleArray) : [];
      const userDataArray = await AsyncStorage.getItem("userData");
      const parsedUserDataArray = userDataArray ? JSON.parse(userDataArray) : [];
      const RoleList = parsedUserRoleArray?.map((item, index) => ({
        label: item?.rolePermission?.[0]?.roleName,
        value: index,
        module: item?.modulePermission,
      }));
      setUserRoleList(RoleList);
      setUserRolePermission(parsedUserRoleArray);
      setUserData(parsedUserDataArray);
    } catch (error) {
      console.error("Error fetching user role permission:", error);
    }
  };

  useEffect(() => {
    fetchUserRolePermission();
  }, []);

  if (!userRolePermission || userRolePermission.length === 0 || !userRoleList) {
    return (
      <View>
        <Text>
          You do not have access to any modules. Please contact admin first!
        </Text>
        <Pressable onPress={() => handleLogout()}>
          <Text style={{ margin: 16 }}>Logout</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      drawerContent={(props) => (
        <>

<SafeAreaView>
{/* <View style={{
  height:200,
  width:"100%",
  justifyContent:"center",
  alignItems:"center",
  backgroundColor: 'rgb(17, 65, 102)',
}}>

<Image   source= {require("../../local-assets/profile.jpg")}  style={{
           height:100,
           width:100,
           borderRadius:50,
           aliSelf:"center",
           alignItem:"center"

         }}/>  
         <Text >Medha Yadav </Text>
</View> */}
        {/* <DrawerItemList {...props} /> */}
      </SafeAreaView>
        <CustomDrawerContent
          {...props}
          handleRoleSelect={handleRoleSelect}
          userRoleList={userRoleList}
          userRoleIndex={userRoleIndex}
          userData={userData}
          fetchUserRolePermission={fetchUserRolePermission}
          handleLogout={handleLogout}
        />
        
               </>
      )}
      screenOptions={TopHeaderCommonConfig}
    >
      {userRoleList?.[userRoleIndex]?.module
        .filter(
          (module) =>
            module?.read === 1 &&
            module?.moduleMaster[0]?.moduleName !== "StudentInfo" &&
            module?.moduleMaster[0]?.moduleName !== "RoomDetail"
        )
        .map((module, index) => (
          <Drawer.Screen  options={{
    drawerIcon: ({ color, size, focused }) => (
      <Ionicons 
        style={styles.icons} 
        name={focused ? 'home' : 'book'}
        size={size} 
        color={color} 
      />
    )
  }}  key={index} name={module?.moduleMaster[0]?.moduleName}>
            {(props) => {
              switch (module?.moduleMaster[0]?.moduleName) {
                case "RoleScreen":
                  return <RoleComponent {...props} userAccess={userRoleList?.[userRoleIndex]} 
                  />;
                case "ModuleScreen":
                  return <ModuleComponent {...props} userAccess={userRoleList?.[userRoleIndex]} />;
                case "Dashboard":
                  return <DashboardComponent {...props} userAccess={userRoleList?.[userRoleIndex]}   />;
                case "UserScreen":
                  return <UserComponent {...props} userAccess={userRoleList?.[userRoleIndex]} />;
                case "ExamScreen":
                  return <ExamComponent {...props} navigation={navigation} userAccess={userRoleList?.[userRoleIndex]} userData={userData} />;
                case "InvigilatorScreen":
                  return <InvigilatorScreen {...props} navigation={navigation} userAccess={userRoleList?.[userRoleIndex]} userData={userData} />;  
                  default:
                  return null;
              }
            }}
          </Drawer.Screen>
        ))}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
