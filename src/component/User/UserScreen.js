import React, { useState, useEffect, useCallback } from "react";
import {View, Text, TextInput, FlatList, StyleSheet, Pressable, LayoutAnimation, Dimensions} from "react-native";
import { insert, fetch, update } from "../../AuthService/AuthService";
import { useToast } from "../../globalComponent/ToastContainer/ToastContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import passwordValidator from "../../helpers/passwordValidator";
import emailValidator from "../../helpers/emailValidator";
import useStateWithCallback from "../../helpers/useStateWithCallback";
import Tooltip from "../../globalComponent/ToolTip/Tooltip";
import CheckBox from "expo-checkbox";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons,AntDesign,Feather} from "@expo/vector-icons";
import { display } from "@mui/system";
import Pagination from "../../globalComponent/Pagination/PaginationComponent";

const UserScreen = ({userAccess,refresh}) => { 
  const UserAccess = userAccess?.module?.find( (item) => item?.FK_ModuleId === 4 );
  const { addToast } = useToast();
  const [userData, setUserData] = useState({
    userId: '',
    name: '',
    password: '',
    emailId:'',
    contactNumber:'',
    username:'',
    status: 1,
    rolePermissions:[]
  });
  const [userList, setUserList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [userContainerVisible, setUserContainerVisible] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isEmailTooltipVisible, setEmailTooltipVisible] = useStateWithCallback(false);
  const [isNameTooltipVisible, setNameTooltipVisible] = useStateWithCallback(false);
  const [isEmplyIdTooltipVisible, setEmplyIdTooltipVisible] = useStateWithCallback(false);
  const [isContactNumberTooltipVisible, setContactNumberTooltipVisible] = useStateWithCallback(false);
  const [isPasswordTooltipVisible, setPasswordTooltipVisible] = useStateWithCallback(false);
    //---------------------------------------------------- dimension based view--------------------------------------------//
    const { width, height } = Dimensions.get('window');
    const isMobile = width < 768; 
    const tableWidth = isMobile ? width  : width * 0.95; 
    const tableHeight = isMobile ? height * 0.68 : height * 0.6; 
    // console.log(`Table Width: ${tableWidth}, Table Height: ${tableHeight} `,);
    const tableWidth1 = isMobile ? width-200 : width * 0.96; 
    const tableHeight1 = isMobile ? height * 0.4  : height * 0.24; 
    // console.log(`Table Width1: ${tableWidth1}, Table Height1: ${tableHeight1}, `,);
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 25;
  const paginatedData = userList.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // const duplicatePageSize = 10;
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const checkAuthToken = useCallback(async () => {
    const authToken = await AsyncStorage.getItem("authToken");

    if (!authToken) {
      addToast("Authentication token is not available", "error");
      throw new Error("Authentication token not available");
    }

    return authToken;
  }, [addToast]);

  const handleAddUser = async () => {
    try {
      const authToken = await checkAuthToken();
      if (!handleNameValidation()) return;
      if (!handleEmployeeIdValidation()) return;
      if (!handlePasswordValidation()) return;
      if (!handleEmailValidation()) return;
      if (!handleContactNumberValidation()) return;
      const response = await insert(
        {
          operation: "insert",
          tblName: "tbl_user_master",
          data: {
            username: userData.emailId,
            name: userData.name,           
            password: userData.password,
            contact_number: userData.contactNumber,
            email_id: userData.emailId,
            username:userData.username,
            isActive: userData.status,
            isVerified: 1
          },
          conditionString: '',
          checkAvailability: '',
          customQuery: '',
        },
        authToken
      );

      if (response) {
        if (userData?.rolePermissions) {
          const rolePermissionsWithId = userData?.rolePermissions?.map(
            (permissions) => ({
              FK_userId: response?.data?.receivedData?.insertId,
              ...permissions,
            })
          );

          await insert(
            {
              operation: "insert",
              tblName: "tbl_user_role_permission",
              data: rolePermissionsWithId,
              conditionString: "",
              checkAvailability: "",
              customQuery: "",
            },
            authToken
          );

          addToast("User is created successfully!", "success");
          await handleClose();
          handleGetUserList();
        }
        else {
          addToast("User is created successfully!", "success");
          await handleClose();
          handleGetUserList();
        }
     
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };

  const handleUpdateUser = async () => {
    try {
      const authToken = await checkAuthToken();
      handleNameValidation();
      handleEmailValidation();
      handlePasswordValidation();
      handleEmailValidation();
      handleContactNumberValidation();
      const response = await update(
        {
          operation: "update",
          tblName: "tbl_user_master",
          data: {
            name: userData.name,           
            password: userData.password,
            contact_number: userData.contactNumber,
            email_id: userData.emailId,
            username:userData.username,
            isActive: userData.status,
          },
          conditionString: `user_id = ${userData.userId}`,
          checkAvailability: '',
          customQuery: '',
        },
        authToken
      );

      if (response) {
        if (userData?.rolePermissions) {
          const rolePermissionsWithId = userData?.rolePermissions?.map(
            (permissions) => (
              permissions?.Id
                ? { ...permissions }
                : {
                    Id: 0,
                    FK_userId: userData?.userId,
                    ...permissions,
                  }
            )
          );

          await update(
            {
              operation: "update",
              tblName: "tbl_user_role_permission",
              data: rolePermissionsWithId,
              conditionString: `PK_user_role_permissionId = ? `,
              checkAvailability: true,
              customQuery: "",
            },
            authToken
          );

          addToast("User is updated successfully!", "success");
          await handleClose();
          handleGetUserList();
        }
        else {
          addToast("User is updated successfully!", "success");
          await handleClose();
          handleGetUserList();
        }
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };

  const handleGetUserList = async () => {
    try {
      const authToken = await checkAuthToken();
      const response = await fetch(
        {
          operation: "custom",
          tblName: "tbl_user_master",
          data: '',
          conditionString: '',
          checkAvailability: '',
          customQuery: `select JSON_ARRAYAGG(json_object('user_id',p.user_id,'username',username,'password',p.password,'name',p.name,'contact_number',p.contact_number,'email_id',p.email_id,'profile_image_url',p.profile_image_url,'isActive',p.isActive,'rolePermission',( SELECT CAST( CONCAT('[', GROUP_CONCAT( JSON_OBJECT( 'Id',q.PK_user_role_permissionId,'FK_userId', q.FK_userId,'FK_RoleId', q.FK_RoleId,'isActive',q.isActive) ), ']') AS JSON ) FROM tbl_user_role_permission q WHERE q.FK_userId = p.user_id ))) AS UserMaster from tbl_user_master p`,
        },
        authToken
      );

      if (response) {
        setUserList(response?.data?.receivedData?.[0]?.UserMaster);
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };

  const handleUserStatus = async (userId, status) => {
    try {
      const authToken = await checkAuthToken();
      const response = await update(
        {
          operation: "update",
          tblName: "tbl_user_master",
          data: { isActive: !status },
          conditionString: `user_id = ${userId}`,
          checkAvailability: '',
          customQuery: '',
        },
        authToken
      );

      if (response) {
        addToast(
          `User ${status === 0 ? "Active" : "Inactive"} Successful`,
          "success"
        );
        handleGetUserList();
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };

  const handleEditUser = async (selectedUser) => {
      setUserData({
        userId: selectedUser.user_id,
        name: selectedUser.name,
        password: selectedUser.password,
        emailId: selectedUser.email_id,
        contactNumber: selectedUser.contact_number,
        username: selectedUser.username,
        status: selectedUser.isActive,
        rolePermissions: selectedUser.rolePermission,
        
      });
      setUserContainerVisible(true);
  };

  const handleAuthErrors = (error) => {
    switch (error.message) {
      case "Invalid credentials":
        addToast("Invalid authentication credentials", "error");
        break;
      case "Data already exists":
        addToast("User already exists!", "error");
        break;
      case "No response received from the server":
        addToast("No response received from the server", "error");
        break;
      default:
        addToast("User Operation Failed", "error");
    }
  };

  const handleClose = async () => {
    setUserContainerVisible(false);
    setUserData({
      userId: '',
      name: '',
      password: '',
      emailId:'',
      contactNumber:'',
      username:'',
      status: 1,
      rolePermissions:[]
    });
  };
  const handlePasswordChange = (text) => {
    isPasswordTooltipVisible && setPasswordTooltipVisible(false);
    setUserData({ ...userData, password: text });
  };
  const handleEyePress = () => {
    setPasswordVisible((oldValue) => !oldValue);
  };
  const handlePasswordValidation = () => {
    if (passwordValidator(userData.password)) {
        setPasswordTooltipVisible(false);
      return true;
    } else {
      LayoutAnimation.spring();
      setPasswordTooltipVisible(true);
      return false;
    }
  };
  const renderPasswordInput = () => {
    const eyeIcon = isPasswordVisible
      ? require("../../local-assets/eye.png")
      : require("../../local-assets/eye-off.png");


    const renderTooltipContent = () =>
       ( <View style={styles.passwordTooltipContainer}>
          <Text style={styles.passwordTooltipTextStyle}>
            Incorrect
            <Text style={styles.passwordTooltipRedTextStyle}>password</Text>
          </Text>
        </View>);

    return (
        <View style={styles.passwordTextInputContainer}>
          {isPasswordTooltipVisible && (
            <Tooltip>{renderTooltipContent()}</Tooltip>
          )}
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={userData.password}
            secureTextEntry={!isPasswordVisible}
            onChangeText={handlePasswordChange}
            enableIcon
            iconImageSource={eyeIcon}
            autoCapitalize="none"
            onFocus={() => {
              setPasswordTooltipVisible(false);
            }}
            onIconPress={handleEyePress}
          />
        </View>
    );
  };

  const renderEmailInput = () => {
    const tooltipContent = () => (
      <View style={styles.emailTooltipContainer}>
        <Text style={styles.emailTooltipTextStyle}>
          That
          <Text style={styles.emailTooltipRedTextStyle}>email address</Text>
          doesn't look right
        </Text>
      </View>
    );
    return (
      <View style={styles.emailTextInputContainer}>
        <>
          {isEmailTooltipVisible && (
            <Tooltip>{tooltipContent()}</Tooltip>
          )}
          <TextInput
               style={styles.input}
            placeholder="emailId"
            value={userData.emailId}
            onChangeText={handleEmailChange}
            autoCapitalize="none"
            onFocus={() => setEmailTooltipVisible(false)}
          />
        </>
      </View>
    );
  };
  const handleEmailValidation = () => {
    if (emailValidator(userData.emailId)) {
        setEmailTooltipVisible(false);
      return true;
    } else {
      LayoutAnimation.spring();
      setEmailTooltipVisible(true);
      return false;
    }
  };
  const handleEmailChange = (text) => {
    isEmailTooltipVisible && setEmailTooltipVisible(false);
    setUserData({ ...userData, emailId: text });
  };

  const renderNameInput = () => {
    const tooltipContent = () => (
      <View style={styles.emailTooltipContainer}>
        <Text style={styles.emailTooltipTextStyle}>
          That
          <Text style={styles.emailTooltipRedTextStyle}>name</Text>
          is required !
        </Text>
      </View>
    );
    return (
      <View style={styles.nameTextInputContainer}>
        <>
          {isNameTooltipVisible && (
            <Tooltip>{tooltipContent()}</Tooltip>
          )}
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={userData.name}
            onChangeText={handleNameChange}
            onFocus={() => setNameTooltipVisible(false)}
          />
        </>
      </View>
    );
  };
  const renderEmployeeId = () => {
    const tooltipContent = () => (
      <View style={styles.emailTooltipContainer}>
        <Text style={styles.emailTooltipTextStyle}>
          That
          <Text style={styles.emailTooltipRedTextStyle}>EmployeeId</Text>
          is required !
        </Text>
      </View>
    );
    return (
      <View style={styles.nameTextInputContainer}>
        <>
          {isEmplyIdTooltipVisible && (
            <Tooltip>{tooltipContent()}</Tooltip>
          )}
          <TextInput
            style={styles.input}
            placeholder="Employee Id"
            value={userData.username}
            onChangeText={handleEmployeeIdChange}
            onFocus={() => setEmplyIdTooltipVisible(false)}
          />
        </>
      </View>
    );
  };
  const handleNameValidation = () => {
    if (userData.name) {
      setNameTooltipVisible(false);
      return true;
    } else {
      LayoutAnimation.spring();
      setNameTooltipVisible(true);
      return false;
    }
  };
  const handleEmployeeIdValidation = () => {
    if (userData.username) {
      setEmplyIdTooltipVisible(false);
      return true;
    } else {
      LayoutAnimation.spring();
      setEmplyIdTooltipVisible(true);
      return false;
    }
  };
  const handleNameChange = (text) => {
    isNameTooltipVisible && setNameTooltipVisible(false);
    setUserData({ ...userData, name: text });
  };

  const handleEmployeeIdChange = (text) => {
    isEmailTooltipVisible && setEmplyIdTooltipVisible(false);
    setUserData({ ...userData, username: text });
  };

  const renderContactNumberInput = () => {
    const tooltipContent = () => (
      <View style={styles.emailTooltipContainer}>
        <Text style={styles.emailTooltipTextStyle}>
          That
          <Text style={styles.emailTooltipRedTextStyle}>contact number</Text>
          is required !
        </Text>
      </View>
    );
    return (
      <View style={styles.contactTextInputContainer}>
        <>
          {isContactNumberTooltipVisible && (
            <Tooltip>{tooltipContent()}</Tooltip>
          )}
          <TextInput
            style={styles.input}
            placeholder="Contact Number "
            value={userData.contactNumber}
            onChangeText={handleContactNumberChange}
            onFocus={() => setContactNumberTooltipVisible(false)}
          />
        </>
      </View>
    );
  };
  const handleContactNumberValidation = () => {
    if (userData.contactNumber) {
      setContactNumberTooltipVisible(false);
      return true;
    } else {
      LayoutAnimation.spring();
      setContactNumberTooltipVisible(true);
      return false;
    }
  };
  const handleContactNumberChange = (text) => {
    isContactNumberTooltipVisible && setContactNumberTooltipVisible(false);
    setUserData({ ...userData, contactNumber: text });
  };
  const handleUpdatePermissions = (role,permission) => {
    setUserData((prevData) => {
      const updatedRolePermissions = prevData?.rolePermissions ? [...prevData.rolePermissions] : [];
      const existingRoleIndex = updatedRolePermissions.findIndex(
        (data) => data?.FK_RoleId === role?.PK_RoleId
      );
      if (existingRoleIndex !== -1) {
        const updatedRole = {
          ...updatedRolePermissions[existingRoleIndex],
          [permission]:
            !updatedRolePermissions[existingRoleIndex][permission],
        };

        updatedRolePermissions[existingRoleIndex] = updatedRole;
      }
       else {
        const newRole = {
          FK_RoleId: role?.PK_RoleId,
          isActive : 1
        };
  
        updatedRolePermissions.push(newRole);
      }
  
      return {
        ...prevData,
        rolePermissions: updatedRolePermissions,
      };
    });
  };
  const getRolePermission = (role, permission) => {
    const roleData = userData?.rolePermissions?.find(
      (item) => item?.FK_RoleId === role?.PK_RoleId
    );
    return roleData?.[permission] || false;
  };
  
  const renderRoleCheckboxes = (item) => {
    return (
      <View style={styles.listItem} key={item?.PK_ModuleId}>
        <Text style={[styles.listItemText,]}>
          {item?.roleName}
        </Text>
        <View style={[styles.checkboxContainer, ]}>
          <CheckBox
            value={getRolePermission(item,'isActive')}
            onValueChange={() =>handleUpdatePermissions(item,'isActive') }
          />
        </View>
      </View>
    );
  };

  const handleGetRoleList = async () => {
    try {
      const authToken = await checkAuthToken();
      const response = await fetch(
        {
          operation: "fetch",
          tblName: "tbl_role_master",
          data: "",
          conditionString: "",
          checkAvailability: "",
          customQuery: "",
        },
        authToken
      );

      if (response) {
        setRoleList(response?.data?.receivedData);
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };

  const HorizontalItem = ({ item }) => (
    <View style={styles.horizontalItem}>
      <Text>{item.key}</Text>
    </View>
  );
  
  const VerticalItem = ({ item }) => (
    <FlatList
      horizontal
      data={item}
      renderItem={({ item }) => <HorizontalItem item={item} />}
      keyExtractor={(item) => item.key}
      showsHorizontalScrollIndicator={false}
    />
  );

  const renderRoleList = () =>{
    return(
        <View>
        <Text style={[styles.header,{marginTop:10}]}> Role List : </Text>
        <View style={{maxHeight: tableHeight1, minWidth: isMobile ? tableWidth1 :tableWidth1 }}>
        <FlatList
          data={roleList}
          keyExtractor={(item) => item?.PK_RoleId?.toString()}
          ListHeaderComponent={() => (
            <View style={[styles.tableHeader ,]}>
              <Text style={[styles.tableHeaderText, ]}>
                Role Name
              </Text>
              <Text style={[styles.tableHeaderText,]}>
                Access
              </Text>
            </View>
          )}
          renderItem={({ item }) => renderRoleCheckboxes(item)}
          stickyHeaderIndices={[0]} 
        />
        </View>
        </View>
    )
  }
  useEffect(() => {
    handleGetUserList();
    handleGetRoleList();
  }, [UserAccess,refresh]);
    return (
      <View style={styles.container}>
      {userContainerVisible ? (
        <View style={styles.formContainer}>
          {renderNameInput()}
          {renderEmployeeId()}
          {renderPasswordInput()}
          {renderEmailInput()}
          {renderContactNumberInput()}
          {renderRoleList()}
          <View style={styles.adddetails}>
          {userData.userId ? (
            <View style={styles.buttonContainer}>
              <Pressable  style={styles.addbtnWrap} onPress={() => handleUpdateUser()}>
                    <Text  numberOfLines={1} style={styles.addbtntext }  >Update User</Text>
                  </Pressable>
                  <Pressable onPress={() => handleClose()}>
                    <Text  style={styles.cancelbtn}>Cancel</Text>
                  </Pressable>
            </View>
          ) : (
            <View style={styles.buttonContainer}>
              <Pressable style={styles.addbtnWrap} onPress={() => handleAddUser()}>
                    <Text  numberOfLines={1} style={styles.addbtntext } >Add User</Text>
                  </Pressable>
                  <Pressable onPress={() => handleClose()}>
                    <Text style={styles.cancelbtn}>Cancel</Text>
                  </Pressable>
            </View>
          )}
        </View>
        </View>
      ) : 
    (<View style={styles.userListWrap}>
        <Text style={styles.header}>User List:</Text>      
          <View style={{alignItems:"flex-end"}}>
          {UserAccess?.create === 1 &&    
         ( <Pressable onPress={() => setUserContainerVisible(true)}>
                    <Text style={styles.addBtn}> 
                      <Ionicons name="add-circle-outline" size={28} color="black" style={styles.icons} />
                    </Text>
                  </Pressable>) }
          </View>
          <ScrollView horizontal>
          <View style={{maxHeight: tableHeight, minWidth: isMobile ? tableWidth :tableWidth }}>
        <FlatList 
          data={paginatedData}
          keyExtractor={(item) => item.user_id.toString()}
          ListHeaderComponent={() => (
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText,{width:120}, ]}>Employee Id</Text>
              <Text style={[styles.tableHeaderText,{width:200,textAlign:"center"}, ]}>Name</Text>
              <Text style={[styles.tableHeaderText, {width:170,textAlign:"center"} ]}>Mob.No</Text>
              <Text style={[styles.tableHeaderText,{width:90,textAlign:"center"}  ]}>Status</Text>
              <Text style={[styles.tableHeaderText,{width:120 ,textAlign:"center"}, ]}>Created Date</Text>
              <Text style={[styles.tableHeaderText,{width:120 ,textAlign:"center"}, ]}>Updated Date</Text>
              <Text style={[styles.tableHeaderText,{width:120,textAlign:"center"}, ]}>Created By</Text>
              <Text style={[styles.tableHeaderText,{width:120,textAlign:"center"}, ]}>Updated By</Text>
              <Text style={[styles.tableHeaderText, {width:60, textAlign:"center"} ]}>Actions</Text>
            </View>
          )}
          renderItem={({ item }) => (
            // console.log("All items",item),
            <View style={styles.listItem}>
              <Text style={[styles.listItemText,{width:120}]}>{item.username}</Text>
              <Text style={[styles.listItemText,{width:200,textAlign:"center"}]}>{item.name}</Text>
              <Text style={[styles.listItemText, {width:170,textAlign:"center"}]}>{item.contact_number}</Text>
                    <View style={[styles.listItemText, {display:"inline-block", alignItems:"center", width:90}]}>
                      <Pressable style={{display:"inline-block" ,alignItems:"center"} } onPress={() =>UserAccess?.update === 1 ? handleUserStatus(item.user_id, item?.isActive) : ''}>
                    <Text style={[styles.listItemText,  item.isActive ? styles.actionbtn : styles.inactivebtn,]}>{item.isActive ? "Active" : "Inactive"}</Text>
                    </Pressable>     
                    </View>  
                    <Text style={[styles.listItemText, { width: 120, display: "inline-block",textAlign:"center" }]} numberOfLines={1}>
                      {item.created_at ? new Date(item.created_at.split('T')[0]).toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' }) : 'N/A'}
                    </Text>
                    <Text style={[styles.listItemText, { width: 120, display: "inline-block",textAlign:"center" }]} numberOfLines={1}>
                    {item.created_at ? new Date(item.created_at.split('T')[0]).toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' }) : 'N/A'}
                    </Text>   
                    <Text style={[styles.listItemText, { width: 120, display: "inline-block",textAlign:"center" }]} numberOfLines={1}>
                      {item.created_by ? created_by: 'N/A'}
                    </Text>
                    <Text style={[styles.listItemText, { width: 120, display: "inline-block",textAlign:"center" }]} numberOfLines={1}>
                    {item.updated_by ? updated_by: 'N/A'}
                    </Text>
              <View style={{width:60, display:"inline-block", alignItems:"center",textAlign:"center"}}>
              {UserAccess?.update === 1 ? 
              (<Pressable style={[styles.listItemEditButton ,{display:"inline-block"}]} onPress={() => handleEditUser(item)}>
                    <Text style={styles.listItemEditText} ><Feather name="edit" size={16} color="#0C7C62" /></Text>
                  </Pressable>) : (<Text>-</Text>)}
              </View>
            </View>
          )}
          stickyHeaderIndices={[0]} 
         />
         </View>
         </ScrollView>         
         <Pagination
          totalItems={userList?.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={handlePageChange}
              />
      </View>)
      }
      </View>     
      );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  formContainer: {
    marginBottom: 20,
    backgroundColor:"#fff",
    padding:20,
    elevation:2,
  },
  userListWrap:{
   backgroundColor:"#fff",
   padding:20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    marginTop:10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent:"space-between",
    backgroundColor: "rgb(17, 65, 102)",
    // paddingVertical: 10,
    // paddingHorizontal: 15,
    padding: 10,
    marginBottom: 10,
    borderRadius:5,
  },
  tableHeaderText: {
    fontWeight: 'bold',
    color:"#fff",
    textAlign:"left",
    alignItems:"center",
    // flexShrink:1,
    fontSize:14,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',   
  },
  listItemText: {
    fontSize:14,
    // textWrap:"noWrap"
  },
  listItemActiveStatus: {
    color: 'green',
  },
  listItemInactiveStatus: {
    color: 'red',
  },
  listItemEditButton: {
    //backgroundColor: "#0C7C62",
    padding: 0,
    borderRadius: 5,
  },
  listItemEditText: {
    color: '#0C7C62',
  },

  logoImageStyle: {
    width: 200,
    height: 200,
    alignSelf: "center",
  },
  textInputContainer: {
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  passwordTextInputContainer: {
    // marginTop: 16,
    // alignItems: "center",
    // justifyContent: "center",
  },
  dividerStyle: {
    height: 0.5,
    marginTop: 24,
    marginBottom: 12,
    borderRadius: 16,
    alignSelf: "center",
    backgroundColor: "#ccc",
  },
  eyeIconContainer: {
    right: 16,
    top: 14,
    position: "absolute",
  },
  eyeIcon: {
    width: 24,
    height: 24,
    // tintColor: "#555",
  },
  
  shakeText: {
    color: "red",
    marginTop: 8,
    marginLeft: 12,
    marginRight: "auto",
  },
  emailTextInputContainer: {
    // alignItems: "center",
    // justifyContent: "center",
  },
  emailTooltipContainer: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  emailTooltipTextStyle: {
    fontSize: 16,
  },
  emailTooltipRedTextStyle: {
    fontWeight: "bold",
    color: "red",
  },
  emailTooltipContentStyle: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  emailTooltipBackgroundStyle: {
    backgroundColor: "transparent",
  },
  passwordTooltipStyle: {
    marginTop: 30,
  },
  passwordTooltipContainer: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  passwordTooltipTextStyle: {
    fontSize: 16,
  },
  passwordTooltipRedTextStyle: {
    fontWeight: "bold",
    color: "red",
  },
  passwordTooltipBackgroundStyle: {
    backgroundColor: "transparent",
  },
  passwordTooltipContentStyle: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  addWrap:{
   width:100,
   alignSelf:"flex-end",
   marginBottom:10,
  },
  addbtnWrap:{
    width:100,
    alignSelf:"flex-end",
    marginBottom:10,
    backgroundColor:"#0C7C62",
    padding:10,
    borderRadius:5,
  },
  addbtntext:{
    color:"#fff",
    textAlign:"center",
   },
   addBtn: {
    alignItems:"flex-end", 
    position: "relative", 
    bottom: 34,
  },
   cancelbtn:{
    width:100,
    marginBottom:10,
    backgroundColor:"rgb(237, 52, 52)",
    padding:10,
    borderRadius:5,
    textAlign:"center",
    color:"#fff"
  },
  actionbtn:{
    backgroundColor:"#0CB551",
    borderRadius:4,
    width:60,
    padding:5, 
    color:"#fff",
    textAlign:"center",

},
inactivebtn:{
 backgroundColor:"red",
    borderRadius:4,
    width:60,
    padding:5, 
    color:"#fff",
    textAlign:"center",
},
});

export default UserScreen;