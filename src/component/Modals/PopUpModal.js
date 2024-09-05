// import React, {useState} from 'react';
// import {Alert, Modal, StyleSheet, Text, Pressable, View,Dimensions} from 'react-native';
// import Entypo from '@expo/vector-icons/Entypo';
// const PopUpModal = ( { visible, onRequestClose, animationType, children }) => {

//   const { width, height } = Dimensions.get('window');
//   const isMobile = width < 768; 
//   return (
//     <View style={styles.centeredView}>
//       <Modal
//         animationType={animationType}
//         transparent={true}
//         visible={visible}
//         onRequestClose={onRequestClose}>
//         <View style={styles.centeredView}>
//         <View style={[styles.modalView, { width: isMobile ? '90%' : '70%', maxWidth: 450 }]}>
//           {children}
//             {/* <Text style={styles.modalText}>Hello World!</Text> */}
//             <Pressable
//               style={[styles.button, styles.buttonClose]}
//               onPress={onRequestClose}>
//               <Entypo name="squared-cross" size={24} color="red" />
//             </Pressable>
//           </View>
//         </View>
//       </Modal>
//       {/* <Pressable
//         style={[styles.button, styles.buttonOpen]}
//         onPress={() => setModalVisible(true)}>
//         <Text style={styles.textStyle}>Show Modal</Text>
//       </Pressable> */}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   centeredView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 22,
//   },
//   modalView: {
//     //margin: 20,
//     // backgroundColor: 'green',
//     backgroundColor:"#fff",
//     borderRadius: 20,
//     padding: 25,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
 
//   },
//   button: {
//     borderRadius: 20,
//     padding: 10,
//     elevation: 2,
//   },
//   buttonOpen: {
//     backgroundColor: '#F194FF',
//   },
//   buttonClose: {
//     // backgroundColor: '#2196F3',
//     position:"absolute",
//     padding:0,
//     top:4,
//     right:4,
//   },
//   textStyle: {
//     color: 'white',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   modalText: {
//     marginBottom: 15,
//     textAlign: 'center',
//   },
// });

// export default PopUpModal;


import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, Pressable, View, Dimensions, Image } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';

const PopUpModal = ({ visible, onRequestClose, animationType, children, imageData, sizeMode = 'auto' }) => {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const isMobile = screenWidth < 768;
  const maxSize = sizeMode === 'auto' ? Infinity : (typeof sizeMode === 'number' ? sizeMode : 400);

  useEffect(() => {
    if (imageData) {
      Image.getSize(`data:image/png;base64,${imageData}`, (width, height) => {
        let newWidth = width;
        let newHeight = height;

        if (sizeMode !== 'auto') {
          const aspectRatio = width / height;
          if (width > height) {
            newWidth = Math.min(width, maxSize);
            newHeight = newWidth / aspectRatio;
          } else {
            newHeight = Math.min(height, maxSize);
            newWidth = newHeight * aspectRatio;
          }
        }

        // Ensure the image fits within the modal
        const modalWidth = isMobile ? screenWidth * 0.9 : Math.min(screenWidth * 0.7, 450);
        const modalHeight = screenHeight * 0.8;

        if (newWidth > modalWidth - 50) {
          newWidth = modalWidth - 50;
          newHeight = newWidth / (width / height);
        }
        if (newHeight > modalHeight - 100) {
          newHeight = modalHeight - 100;
          newWidth = newHeight * (width / height);
        }

        setImageSize({ width: newWidth, height: newHeight });
      }, (error) => {
        console.error("Error getting image size:", error);
      });
    }
  }, [imageData, sizeMode, screenWidth, screenHeight, isMobile]);

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType={animationType}
        transparent={true}
        visible={visible}
        onRequestClose={onRequestClose}>
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { width: isMobile ? '90%' : '70%', maxWidth: 450 }]}>
            {imageData ? (
              <Image
                source={{ uri: `data:image/png;base64,${imageData}` }}
                style={[styles.image, { width: imageSize.width, height: imageSize.height }]}
                resizeMode="contain"
              />
            ) : (
              children
            )}
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={onRequestClose}>
              <Entypo name="squared-cross" size={24} color="red" />
            </Pressable>
          </View>
        </View>
      </Modal>
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
    backgroundColor: "#fff",
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
  buttonClose: {
    position: "absolute",
    padding: 0,
    top: 4,
    right: 4,
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
  },
});

export default PopUpModal;