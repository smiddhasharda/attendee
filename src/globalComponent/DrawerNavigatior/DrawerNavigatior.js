import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Pressable, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem, } from "@react-navigation/drawer";
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

// Screen components

const RoleComponent = ({ userAccess }) => <RoleScreen userAccess={userAccess} />;
const ModuleComponent = ({ userAccess }) => <ModuleScreen userAccess={userAccess} />;
const DashboardComponent = ({ userAccess }) => <DashboardScreen userAccess={userAccess} />;
const UserComponent = ({ userAccess }) => <UserScreen userAccess={userAccess} />;
const ExamComponent = ({ navigation, userAccess }) => <ExamScreen navigation={navigation} userAccess={userAccess} />;
const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({ ...props }) => {
  const { showToast } = useToast();
  const [file, setFile] = useState("");
  const [open, setOpen] = useState(false);
  const checkAuthToken = useCallback(async () => {
    const authToken = await AsyncStorage.getItem("authToken");

    if (!authToken) {
      showToast("Authentication token not available", "error");
      throw new Error("Authentication token not available");
    }

    return authToken;
  }, [showToast]);

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
      formData.append(
        "conditionString",
        `user_id = ${props.userData?.user_id}`
      );

      const { fileName, uri, mimeType } = file?.[0];
      const response1 = await fetch(uri);
      const blob = await response1.blob();
      const ProfilePics = new File([blob], fileName, { type: mimeType });
      formData.append("profile_pics", ProfilePics);
      const response = await multer(formData, authToken);

      if (response) {
        await AsyncStorage.removeItem("userData");
        await handleGetUserData();
        showToast(`User Profile Update Successful`, "success");
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
      <View style={styles.container}>
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
          {file && (
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={styles.buttonwrap}>
                <Pressable onPress={() => handleProfilePic()}>
                  <Text>Save</Text>
                </Pressable>
                <Pressable onPress={() => setFile("")}>
                  <Text>Cancel</Text>
                </Pressable>
              </View>
            </View>
          )}
          <Text style={styles.username}> {props?.userData?.name}</Text>
          <View style={styles.dropdownWrap}>
            <DropDownPicker
              open={open}
              value={props?.userRoleIndex}
              items={props?.userRoleList}
              setOpen={setOpen}
              setValue={(value) => props?.handleRoleSelect(value)}
              style={styles.dropdown}
              dropDownStyle={{ backgroundColor: "#fafafa" }}
              dropDownMaxHeight={150}
              dropDownDirection="TOP"
              containerStyle={styles.rolePicker}
            />
          </View>
        </View>
      </View>
      <DrawerItemList {...props} style={styles.dropdownmain} />
      <View>
        <Pressable onPress={() =>props.handleLogout()}>
          <Text style={{ margin: 16 }}>Logout</Text>
        </Pressable>
      </View>
    </DrawerContentScrollView>
  );
};

const DrawerNavigator = ({ navigation }) => {
  const [userRolePermission, setUserRolePermission] = useState([]);
  const [userRoleList, setUserRoleList] = useState([]);
  const [userRoleIndex, setUserRoleIndex] = useState(0);
  const [userData, setUserData] = useState("");

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
  useEffect(() => {
    fetchUserRolePermission();
  }, []);
  
  if (!userRolePermission || userRolePermission.length === 0 || !userRoleList) {
    return (
      <View>
        <Text>
          You do not have access to any modules. Please contact admin first!
        </Text>
        <Pressable onPress={() =>handleLogout()}>
          <Text style={{ margin: 16 }}>Logout</Text>
        </Pressable>
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
          fetchUserRolePermission={fetchUserRolePermission}
          handleLogout={handleLogout}
        />
      )}
    >
      {userRoleList?.[userRoleIndex]?.module
        .filter((module) => module?.read === 1 && (module?.moduleMaster[0]?.moduleName !== "StudentInfo" && module?.moduleMaster[0]?.moduleName !== "RoomDetail" ))
        .map((module, index) => (
          <Drawer.Screen key={index} name={module?.moduleMaster[0]?.moduleName}>
            {(props) => {
              switch (module?.moduleMaster[0]?.moduleName) {
                case "RoleScreen":
                  return <RoleComponent {...props} userAccess={userRoleList?.[userRoleIndex]} />;
                case "ModuleScreen":
                  return <ModuleComponent {...props} userAccess={userRoleList?.[userRoleIndex]} />;
                case "Dashboard":
                  return <DashboardComponent {...props} userAccess={userRoleList?.[userRoleIndex]} />;
                case "UserScreen":
                  return <UserComponent {...props} userAccess={userRoleList?.[userRoleIndex]} />;
                case "ExamScreen":
                  return <ExamComponent {...props} navigation={navigation} userAccess={userRoleList?.[userRoleIndex]} />;
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
