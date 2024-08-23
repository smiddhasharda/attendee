import React, { useEffect, useState, useCallback,useContext } from "react";
import { View, Text, Pressable ,Image} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem, } from "@react-navigation/drawer";

import RoleScreen from "../../component/Roles/RoleScreen";
// import ModuleScreen from "../../component/Module/ModuleScreen";
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
import ReportScreen from "../../component/Report/ReportScreen";
import ManagePasswordScreen from "../../component/Password/ManagePasswordScreen";
import CryptoJS from 'crypto-js';

// Screen components
const RoleComponent = ({ navigation,userAccess, userData }) => <RoleScreen navigation={navigation} userData={userData} userAccess={userAccess} />;
// const ModuleComponent = ({ navigation,userAccess, userData }) => <ModuleScreen userAccess={userAccess}  />;
const DashboardComponent = ({ navigation,userAccess, userData }) => <DashboardScreen navigation={navigation} userData={userData} userAccess={userAccess}  />;
const UserComponent = ({ navigation,userAccess, userData }) => <UserScreen navigation={navigation} userData={userData} userAccess={userAccess}  />;
const ManagePasswordComponent = ({navigation,userAccess, userData }) => <ManagePasswordScreen navigation={navigation} userData={userData} userAccess={userAccess}  />;
const ExamComponent = ({ navigation, userAccess, userData }) => (
  <ExamScreen navigation={navigation} userAccess={userAccess} userData={userData}  />
);
const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({ ...props }) => {
  const { addToast } = useToast();
  const [file, setFile] = useState("");
  const [open, setOpen] = useState(false);

  const checkAuthToken = useCallback(async () => {
    const authToken = atob(await AsyncStorage.getItem(btoa("authToken")));
    if (!authToken) {
      addToast("Authentication token is not available", "error");
      throw new Error("Authentication token is not available");
    }
    return authToken;
  }, [addToast]);

  const decrypt = (encryptedData) => {
    const encryptScreteKey = 'b305723a4d2e49a443e064a111e3e280';
    const [iv, encrypted] = encryptedData.split(':');
    const ivBytes = CryptoJS.enc.Hex.parse(iv);
    const encryptedBytes = CryptoJS.enc.Hex.parse(encrypted);
    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: encryptedBytes },
      CryptoJS.enc.Utf8.parse(encryptScreteKey),
      {
        iv: ivBytes,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    return decrypted.toString(CryptoJS.enc.Utf8);
  };

  const encrypt = (text) => {
    const encryptScreteKey = 'b305723a4d2e49a443e064a111e3e280';
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(text, CryptoJS.enc.Utf8.parse(encryptScreteKey), {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
  
    return iv.toString() + ':' + encrypted.toString();
  };

  const handleImageChange = (imageSource) => {
    setFile(imageSource);
  };

  const handleGetUserData = async () => {
    try {
      const authToken = await checkAuthToken();
      const Parameter = {
        operation: "fetch",
        tblName: "tbl_user_master",
        data: "",
        conditionString: `user_id = ${props.userData?.user_id}`,
        checkAvailability: "",
        customQuery: "",
      };
      const encryptedParams = encrypt(JSON.stringify(Parameter));
      const response = await FetchData(
        encryptedParams,
        authToken
      );

      if (response) {
        const decryptedData = decrypt(response?.data?.receivedData);
        const DecryptedData = JSON.parse(decryptedData);
        await AsyncStorage.setItem( btoa("userData"), btoa(DecryptedData?.[0] && JSON?.stringify(DecryptedData?.[0])) || ""
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
        addToast(`User profile is updated successfully!`, "success");
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };

  const handleAuthErrors = (error) => {
    switch (error.message) {
      case "Invalid credentials":
        addToast("Invalid authentication credentials!", "error");
        break;
      case "Data already exists":
        addToast("Module already exists!", "error");
        break;
      case "No response received from the server":
        addToast("No response received from the server", "error");
        break;
      default:
        addToast("Module Operation Failed", "error");
    }
  };

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
                CameraAccess = {true}
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
              dropDownContainerStyle={styles.dropdownContainer} 
              dropDownMaxHeight={150}
              dropDownDirection="TOP"
              containerStyle={styles.rolePicker}
              listItemContainerStyle={{ height: 30}} 
              listItemLabelStyle={{ fontSize: 14 }}
            />
          </View>
      </View>
      </SafeAreaView>
      <DrawerContentScrollView {...props}>

      <DrawerItemList {...props} style={styles.dropdownmain} />
      <DrawerItem
        label="Logout"
        onPress={props.handleLogout}
        icon={({ color, size }) => (
          <Ionicons 
            name='log-out' 
            size={size} 
            color={color} 
          />
        )}
        labelStyle={styles.drawerItemLabel}
      />
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
      const userRoleArray = atob(await AsyncStorage.getItem(btoa("userRolePermission")));
      const parsedUserRoleArray = userRoleArray ? JSON.parse(userRoleArray) : [];
      const userDataArray = atob(await AsyncStorage.getItem(btoa("userData")));
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
 
  const getIconName = (moduleName, focused) => {
    const icons = {
      Dashboard: focused ? 'home' : 'home-outline',
      RoleScreen: focused ? 'person-circle' : 'person-circle',
      // ModuleScreen: focused ? 'bookmark' : 'bookmark-outline',
      UserScreen: focused ? 'person' : 'person-outline',
      ExamScreen: focused ? 'book' : 'book-outline',
      InvigilatorScreen: focused ? 'people' : 'people-outline',
      ReportScreen: focused ? 'bookmark' : 'bookmarks',
      ManagePasswordScreen: focused ? 'lock-open-sharp' : 'lock-closed-sharp',
    };
    return icons[moduleName] || 'help'; // Default icon if no match is found
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
            && module?.moduleMaster[0]?.moduleName !== "ModuleScreen"
            // &&  module?.moduleMaster[0]?.moduleName !== "ReportScreen" 
        )
        .map((module, index) => (
    //       <Drawer.Screen  options={{
    // drawerIcon: ({ color, size, focused }) => (
    //   <Ionicons 
    //     style={styles.icons} 
    //     name={focused ? 'home' : 'book'}
    //     size={size} 
    //     color={color} 
    //   />
    <Drawer.Screen
    options={{
      title: (() => {
        switch (module?.moduleMaster[0]?.moduleName) {
          case "RoleScreen":
            return "User Role";
          // case "ModuleScreen":
          //   return "Manage Module";
          case "UserScreen":
            return "Manage User";
          case "ExamScreen":
            return "Exam";
          case "InvigilatorScreen":
            return "Invigilator Duties";
          case "ReportScreen":
            return "Report";
          case "ManagePasswordScreen":
            return "Change Password" 
          default:
            return module?.moduleMaster[0]?.moduleName;
        }
      })(),
      drawerIcon: ({ color, size, focused }) => (
        <Ionicons
          style={styles.icons}
          name={getIconName(module.moduleMaster[0].moduleName, focused)}
          size={26}
          color={color}
        />
        
    )
  }}  key={index} name={module?.moduleMaster[0]?.moduleName}>
            {(props) => {
              switch (module?.moduleMaster[0]?.moduleName) {
                case "RoleScreen":
                  return <RoleComponent {...props} navigation={navigation} userAccess={userRoleList?.[userRoleIndex]} userData={userData}  />;
                // case "ModuleScreen":
                //   return <ModuleComponent {...props} navigation={navigation} userAccess={userRoleList?.[userRoleIndex]} userData={userData} />;
                case "Dashboard":
                  return <DashboardComponent {...props} navigation={navigation} userAccess={userRoleList?.[userRoleIndex]} userData={userData}   />;
                case "UserScreen":
                  return <UserComponent {...props} navigation={navigation} userAccess={userRoleList?.[userRoleIndex]} userData={userData}  />;
                case "ExamScreen":
                  return <ExamComponent {...props} navigation={navigation} userAccess={userRoleList?.[userRoleIndex]} userData={userData}  />;
                case "InvigilatorScreen":
                  return <InvigilatorScreen {...props} navigation={navigation} userAccess={userRoleList?.[userRoleIndex]} userData={userData}  />; 
                  case "ManagePasswordScreen":
                  return <ManagePasswordComponent {...props} navigation={navigation} userAccess={userRoleList?.[userRoleIndex]} userData={userData}  />;   
                case "ReportScreen":
                  return <ReportScreen {...props} navigation={navigation} userAccess={userRoleList?.[userRoleIndex]} userData={userData}  />;
                  
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
