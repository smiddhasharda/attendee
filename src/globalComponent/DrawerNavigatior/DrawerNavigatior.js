import React, { useEffect, useState,useCallback } from "react";
import { View, Text, Pressable, Image,Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem, } from "@react-navigation/drawer";
import RoleScreen from "../../component/Roles/RoleScreen";
import ModuleScreen from "../../component/Module/ModuleScreen";
import DashboardScreen from "../../component/Dashboard/DashboardScreen";
import UserScreen from "../../component/User/UserScreen";
import ExamScreen from "../../component/Exam/ExamScreen";
import StudentScreen from "../../component/Exam/StudentScreen";
import { logout } from "../../AuthService/AuthService";
import DropDownPicker from "react-native-dropdown-picker";
import CustomeImagePicker from "../CustomeImagePicker/CustomeImagePicker";
import Exam from '../../component/Dashboard/Exam';
import RoomDetail from '../../component/Dashboard/RoomDetail';
import StudentInfo from '../../component/Dashboard/StudentInfo';
import { multer } from "../../AuthService/AuthService";
import { useToast } from "../../globalComponent/ToastContainer/ToastContext";
import styles from "./DrawerNavigator.style";

// Define your screen components

const RoleComponent = () => <RoleScreen />;
const ModuleComponent = () => <ModuleScreen />;
const DashboardComponent = () => <DashboardScreen />;
const UserComponent = () => <UserScreen />;
const ExamComponent = ({ navigation }) => <Exam navigation={navigation} />;
const StudentComponent = () => <StudentInfo />;
const RoomDetailComponent = () => <RoomDetail />;
const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({ ...props }) => {
  const { showToast } = useToast();
  // const [userImage, setUserImage] = useState( props.userData?.profile_image_url || '');
    const [file, setFile] = useState('');
    const [open, setOpen] = useState(false);

  const checkAuthToken = useCallback(async () => {
    const authToken = await AsyncStorage.getItem("authToken");

    if (!authToken) {
      showToast("Authentication token not available", "error");
      throw new Error("Authentication token not available");
    }

    return authToken;
  }, [showToast]);

  const handleLogout = async () => {
    try {
      await logout();
      props?.navigation.replace("Login");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleImageChange = (imageSource) => {
    // setUserImage(imageSource);
    setFile(imageSource);
  };
  const handleProfilePic = async () => {
    try {
      const authToken = await checkAuthToken();
      const formData = new FormData();
      formData.append('profile_pics', file);
      formData.append('tblName', 'tbl_user_master');
      formData.append('data', '');
      formData.append('fileParam', 'profile_image_url');
      formData.append('conditionString', `user_id = ${props.userData?.user_id}`);
      const response = await multer(
        formData,
        authToken
      );
      if (response) {
        console.log(response);
        showToast(
          `User File Update Successful`,
          "success"
        );
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };

  const handleAuthErrors = (error) => {
    switch (error.message) {
      case "Invalid credentials":
        showToast("Invalid authentication credentials", "error");
        break;
      case "Data already exists":
        showToast("Module with the same name already exists", "error");
        break;
      case "No response received from the server":
        showToast("No response received from the server", "error");
        break;
      default:
        showToast("Module Operation Failed", "error");
    }
  };

 return (
    <DrawerContentScrollView {...props}>
      <View  style={styles.container}>
        <View style={styles.header}>
        <CustomeImagePicker imageUri={file?.[0]?.uri || ''} onImageChange={handleImageChange} />
      {props.userData?.profile_image_url != file && (<View style={{  flexDirection: 'row', justifyContent: 'space-between'}}>  
                {/* <View style={styles.buttonwrap}>           
                <Button title="Cancel" onPress={()=>file('')} />
                <Button style={styles.savebtn}  title="Save" onPress={handleProfilePic} />
                </View> */}
              </View>)}
          <Text style={styles.username}> {props?.userData?.name}</Text>
          <View   style={styles.dropdownWrap}>
            <DropDownPicker
              open={open}
              value={props?.userRoleIndex}
              items={props?.userRoleList}
              setOpen={setOpen}
              setValue={(value) => props?.handleRoleSelect(value)}
              // containerStyle={{ marginTop: 20, width: "30%", alignSelf: "center" }}
              style={ styles.dropdown}
              // labelStyle={{ fontSize: 16, textAlign: "left", color: "#000" }}
              dropDownStyle={{ backgroundColor: "#fafafa" }}
              dropDownMaxHeight={150}
              dropDownDirection="TOP" 
              containerStyle={styles.rolePicker}
            />
          </View>
        </View>
      </View>
      <DrawerItemList {...props} style={styles.dropdownmain} />
        <Pressable onPress={handleLogout}>
          <Text style={{ margin: 16 }}>Logout</Text>
        </Pressable>
    </DrawerContentScrollView>
  );
};

const DrawerNavigator = ({navigation}) => {
  const [userRolePermission, setUserRolePermission] = useState([]);
  const [userRoleList, setUserRoleList] = useState([]);
  const [userRoleIndex, setUserRoleIndex] = useState(0);
  const [userData, setUserData] = useState("");
  const handleRoleSelect = (value) => {
    setUserRoleIndex(value);
  };

  useEffect(() => {
    const fetchUserRolePermission = async () => {
      try {
        const userRoleArray = await AsyncStorage.getItem("userRolePermission");
        const parsedUserRoleArray = userRoleArray
          ? JSON.parse(userRoleArray)
          : [];
        const userDataArray = await AsyncStorage.getItem("userData");
        const parsedUserDataArray = userDataArray
          ? JSON.parse(userDataArray)
          : [];
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
    fetchUserRolePermission();
  }, []);

  if (!userRolePermission || userRolePermission.length === 0 || !userRoleList) {
    return (
      <View>
        <Text>
          You do not have access to any modules. Please contact admin first!
        </Text>
      </View>
    );
  }
  return (
    <Drawer.Navigator
    initialRouteName="Dashboard"
    drawerContent={(props) => (
      <CustomDrawerContent
        {...props}
        handleRoleSelect={handleRoleSelect}
        userRoleList={userRoleList}
        userRoleIndex={userRoleIndex}
        userData={userData}
      />
    )}
  >
    {userRoleList?.[userRoleIndex]?.module
      .filter((module) => module?.read === 1)
      .map((module, index) => (
        <Drawer.Screen
          key={index}
          name={module?.moduleMaster[0]?.moduleName}
        >
          {() => {
            switch (module?.moduleMaster[0]?.moduleName) {
              case "RoleScreen":
                return <RoleComponent />;
              case "ModuleScreen":
                return <ModuleComponent />;
              case "Dashboard":
                return <DashboardComponent />;
              case "UserScreen":
                return <UserComponent />;
              case "ExamScreen":
                return <ExamComponent navigation={navigation} />;
              case "StudentScreen":
                return <StudentComponent />;
              case "RoomDetail":
                return <RoomDetailComponent />;
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

 