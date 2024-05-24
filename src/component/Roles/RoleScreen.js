import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, FlatList, Pressable,tableHeader } from "react-native";
import { insert, fetch, update } from "../../AuthService/AuthService";
import { useToast } from "../../globalComponent/ToastContainer/ToastContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CheckBox from "expo-checkbox";
import styles from "./RoleScreen.style";
import { ScrollView } from "react-native-gesture-handler";
const RoleScreen = ({userAccess}) => {
  const UserAccess = userAccess?.module?.find( (item) => item?.FK_ModuleId === 2 );
  const { showToast } = useToast();
  const [roleData, setRoleData] = useState({
    roleId: "",
    roleName: "",
    roleDescription: "",
    roleStatus: 1,
    modulePermissions: [],
  });
  const [roleList, setRoleList] = useState([]);
  const [roleContainerVisible, setRoleContainerVisible] = useState(false);
  const [moduleList, setModuleList] = useState([]);
  const [tempModulePermission, setTempModulePermission] = useState([]);
  
  const checkAuthToken = useCallback(async () => {
    const authToken = await AsyncStorage.getItem("authToken");

    if (!authToken) {
      showToast("Authentication token not available", "error");
      throw new Error("Authentication token not available");
    }

    return authToken;
  }, [showToast]);

  const handleAddRole = async () => {
    try {
      const authToken = await checkAuthToken();
      const response = await insert(
        {
          operation: "insert",
          tblName: "tbl_role_master",
          data: {
            roleName: roleData.roleName,
            description: roleData.roleDescription,
            isActive: roleData.roleStatus,
          },
          conditionString: "",
          checkAvailability: "",
          customQuery: "",
        },
        authToken
      );

      if (response) {
        if (roleData?.modulePermissions) {
          const rolePermissionsWithId = roleData?.modulePermissions?.map(
            (permissions) => ({
              FK_RoleId: response?.data?.insertId,
              ...permissions,
            })
          );

          await insert(
            {
              operation: "insert",
              tblName: "tbl_role_module_permission",
              data: rolePermissionsWithId,
              conditionString: "",
              checkAvailability: "",
              customQuery: "",
            },
            authToken
          );

          showToast("Role Add Successful", "success");
          await handleClose();
          handleGetRoleList();
        }
        else {
          showToast("Role Add Successful", "success");
          await handleClose();
          handleGetRoleList();
        }
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };

  const handleUpdateRole = async () => {
    try {
      const authToken = await checkAuthToken();
      const response = await update(
        {
          operation: "update",
          tblName: "tbl_role_master",
          data: {
            roleName: roleData.roleName,
            description: roleData.roleDescription,
            isActive: roleData.roleStatus,
          },
          conditionString: `PK_RoleId = ${roleData.roleId}`,
          checkAvailability: "",
          customQuery: "",
        },
        authToken
      );

      if (response) {
        if (roleData?.modulePermissions) {
          const rolePermissionsWithId = roleData?.modulePermissions?.map(
            (permissions) =>
              permissions?.Id
                ? { ...permissions }
                : {
                    Id: 0,
                    FK_RoleId: roleData?.roleId,
                    ...permissions,
                  }
          );
          await update(
            {
              operation: "update",
              tblName: "tbl_role_module_permission",
              data: rolePermissionsWithId,
              conditionString: `PK_role_module_permissionId = ?`,
              checkAvailability: true,
              customQuery: "",
            },
            authToken
          );

          showToast("Role Update Successful", "success");
          await handleClose();
          handleGetRoleList();
        }
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };

  const handleGetRoleList = async () => {
    try {
      const authToken = await checkAuthToken();
      const response = await fetch(
        {
          operation: "custom",
          tblName: "tbl_role_master",
          data: "",
          conditionString: "",
          checkAvailability: "",
          customQuery: `select JSON_ARRAYAGG(json_object('PK_RoleId',p.PK_RoleId,'roleName',roleName,'description',p.description,'isActive',p.isActive,'modulePermission',( SELECT CAST( CONCAT('[', GROUP_CONCAT( JSON_OBJECT( 'Id',q.PK_role_module_permissionId,'FK_RoleId', q.FK_RoleId,'FK_ModuleId', q.FK_ModuleId, 'create', q.create, 'read', q.read, 'update', q.update, 'delete', q.delete, 'special', q.special) ), ']') AS JSON ) FROM tbl_role_module_permission q WHERE q.FK_RoleId = p.PK_RoleId ))) AS RoleMaster from tbl_role_master p`,
        },
        authToken
      );

      if (response) {
        setRoleList(response?.data?.[0]?.RoleMaster);
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };

  const handleRoleStatus = async (roleId, status) => {
    try {
      const authToken = await checkAuthToken();
      const response = await update(
        {
          operation: "update",
          tblName: "tbl_role_master",
          data: { isActive: !status },
          conditionString: `PK_RoleId = ${roleId}`,
          checkAvailability: "",
          customQuery: "",
        },
        authToken
      );

      if (response) {
        showToast(
          `Role ${status === 0 ? "Active" : "Inactive"} Successful`,
          "success"
        );
        handleGetRoleList();
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };

  const handleEditRole = async (selectedRole) => {
    setRoleData({
      roleId: selectedRole.PK_RoleId,
      roleName: selectedRole.roleName,
      roleDescription: selectedRole.description,
      roleStatus: selectedRole.isActive,
      modulePermissions: selectedRole.modulePermission,
    });
    setRoleContainerVisible(true);
  };
  const handleGetModuleList = async () => {
    try {
      const authToken = await checkAuthToken();
      const response = await fetch(
        {
          operation: "fetch",
          tblName: "tbl_module_master",
          data: "",
          conditionString: "",
          checkAvailability: "",
          customQuery: "",
        },
        authToken
      );

      if (response) {
        setModuleList(response?.data);
        let ModulePermissionData = response?.data?.map((item) => ({
          FK_ModuleId: item?.PK_ModuleId,
          create: 0,
          delete: 0,
          read: 0,
          update: 0,
          special: 0
        }));
        setRoleData({ ...roleData, modulePermissions: ModulePermissionData });
        setTempModulePermission(ModulePermissionData);
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
        showToast("Role with the same name already exists", "error");
        break;
      case "No response received from the server":
        showToast("No response received from the server", "error");
        break;
      default:
        showToast("Role Operation Failed", "error");
    }
  };

  const handleClose = async () => {
    setRoleContainerVisible(false);
    setRoleData({
      roleId: "",
      roleName: "",
      roleDescription: "",
      roleStatus: 1,
      modulePermissions: tempModulePermission,
    });
  };

  const handleUpdatePermissions = (module, permission) => {
    setRoleData((prevData) => {
      const updatedModulePermissions = [...prevData?.modulePermissions];
      const existingModuleIndex = updatedModulePermissions?.findIndex(
        (item) => item?.FK_ModuleId === module?.PK_ModuleId
      );

      if (existingModuleIndex !== -1) {
        const updatedModule = {
          ...updatedModulePermissions[existingModuleIndex],
          [permission]:
            !updatedModulePermissions[existingModuleIndex][permission],
        };

        updatedModulePermissions[existingModuleIndex] = updatedModule;
      } else {
        const newModule = {
          FK_ModuleId: module.PK_ModuleId,
          [permission]:
            !prevData.modulePermissions[module.PK_ModuleId]?.[permission],
        };

        updatedModulePermissions.push(newModule);
      }

      return {
        ...prevData,
        modulePermissions: updatedModulePermissions,
      };
    });
  };

  const getModulePermission = (module, permission) => {
    const moduleData = roleData?.modulePermissions?.find(
      (item) => item?.FK_ModuleId === module?.PK_ModuleId
    );
    return moduleData?.[permission] || false;
  };

  const renderModuleCheckboxes = (item) => {
    return (
      <View style={styles.listItem} key={item?.PK_ModuleId}>
        <Text style={[styles.listItemText, { flex: 2 }]}>
          {item?.moduleName}
        </Text>
        <View style={[styles.checkboxContainer, { flex: 1 }]}>
          <CheckBox
            value={getModulePermission(item, "create")}
            onValueChange={() => handleUpdatePermissions(item, "create")}
          />
        </View>
        <View style={[styles.checkboxContainer, { flex: 1 }]}>
          <CheckBox
            value={getModulePermission(item, "read")}
            onValueChange={() => handleUpdatePermissions(item, "read")}
          />
        </View>
        <View style={[styles.checkboxContainer, { flex: 1 }]}>
          <CheckBox
            value={getModulePermission(item, "update")}
            onValueChange={() => handleUpdatePermissions(item, "update")}
          />
        </View>
        <View style={[styles.checkboxContainer, { flex: 1 }]}>
          <CheckBox
            value={getModulePermission(item, "delete")}
            onValueChange={() => handleUpdatePermissions(item, "delete")}
          />
        </View>
        <View style={[styles.checkboxContainer, { flex: 1 }]}>
          <CheckBox
            value={getModulePermission(item, "special")}
            onValueChange={() => handleUpdatePermissions(item, "special")}
          />
        </View>
      </View>
    );
  };

  useEffect(() => {
    handleGetRoleList();
    handleGetModuleList();
  }, []);

  return (
    <ScrollView>
    <View style={styles.container}>
      {roleContainerVisible ? (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="New Role Name"
            value={roleData.roleName}
            onChangeText={(text) =>
              setRoleData({ ...roleData, roleName: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Role Description"
            value={roleData.roleDescription}
            onChangeText={(text) =>
              setRoleData({ ...roleData, roleDescription: text })
            }
          />
          <Text style={styles.header}> Module List : </Text>
          <FlatList
            data={moduleList}
            keyExtractor={(item) => item?.PK_ModuleId?.toString()}
            ListHeaderComponent={() => (
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, { flex: 2 }]}>
                  Module Name
                </Text>
                <Text style={[styles.tableHeaderText, { flex: 1 }]}>
                  Create
                </Text>
                <Text style={[styles.tableHeaderText, { flex: 1 }]}>Read</Text>
                <Text style={[styles.tableHeaderText, { flex: 1 }]}>
                  Update
                </Text>
                <Text style={[styles.tableHeaderText, { flex: 1 }]}>
                  Delete
                </Text>
                <Text style={[styles.tableHeaderText, { flex: 1 }]}>
                  Special
                </Text>
              </View>
            )}
            renderItem={({ item }) => renderModuleCheckboxes(item)}
          />
        <View style={styles.buttonContainer}>    
              <Pressable style={styles.addbtnWrap} onPress={() => roleData.roleId ?  handleUpdateRole() : handleAddRole()} >
                    <Text style={styles.addbtntext } numberOfLines={1}>{roleData.roleId ?  "Update Role" : "Add New Role"}</Text>
                  </Pressable>
          <Pressable onPress={() => handleClose()}>
                    <Text style={styles.cancelbtn}>Cancel</Text>
                  </Pressable>
         </View>

        </View>
           ) :
       <View style={styles.roleLists}>
        <Text style={styles.header}>Role List:</Text>
        {UserAccess?.create === 1 &&
          <View style={styles.addbtnWrap}>

        <Pressable onPress={() => setRoleContainerVisible(true)}>
                    <Text style={styles.addbtntext}>Add</Text>
                  </Pressable> 
                  </View>
}
      <FlatList
        data={roleList}
        keyExtractor={(item) => item.PK_RoleId.toString()}
          ListHeaderComponent={() => (
            <View style={styles.tableHeader}>
              <Text  numberOfLines={1} style={[styles.tableHeaderText, { flex: 2 }]}>Role Name</Text>
              <Text style={[styles.tableHeaderText, { flex: 3 }]}>
                Description
              </Text>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>Status</Text>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>Actions</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={[styles.listItemText, { flex: 2 }]}>
                {item.roleName}
              </Text>
              <Text style={[styles.listItemText, { flex: 3 }]}>
                {item.description}
              </Text>
              <Pressable
                onPress={() => UserAccess?.update === 1 ? handleRoleStatus(item.PK_RoleId, item?.isActive) : ''}
              >
                <Text
                  style={[
                    styles.listItemText,
                    { flex: 1 },
                    item.isActive
                      ? styles.listItemActiveStatus
                      : styles.listItemInactiveStatus,
                  ]}
                >
                  {item.isActive ? "Active" : "Inactive"}
                </Text>
              </Pressable>
              <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end", alignItems: "center", }} >
                {UserAccess?.update === 1 ?
                  <Pressable style={styles.listItemEditButton} onPress={() => handleEditRole(item)}>
                      <Text style={styles.listItemEditText}>Edit</Text>
                    </Pressable> : ' - '}
              </View>
            </View>
          )}
      />
        </View>
        }
    </View>
    </ScrollView>
  );
};

export default RoleScreen;
 