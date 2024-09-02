import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View,Dimensions} from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
const PopUpModal = ( { visible, onRequestClose, animationType, children }) => {
  // const [modalVisible, setModalVisible] = useState(false);
  const { width, height } = Dimensions.get('window');
  const isMobile = width < 768; 
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType={animationType}
        transparent={true}
        visible={visible}
        onRequestClose={onRequestClose}>
        <View style={styles.centeredView}>
          <View style={[styles.modalView,{width:isMobile?"90%": '50%', height: 'auto'}]}>
          {children}
            {/* <Text style={styles.modalText}>Hello World!</Text> */}
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={onRequestClose}>
              <Entypo name="squared-cross" size={24} color="red" />
            </Pressable>
          </View>
        </View>
      </Modal>
      {/* <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.textStyle}>Show Modal</Text>
      </Pressable> */}
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    //margin: 20,
    // backgroundColor: 'green',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
 
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    // backgroundColor: '#2196F3',
    position:"absolute",
    padding:0,
    top:4,
    right:4,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default PopUpModal;