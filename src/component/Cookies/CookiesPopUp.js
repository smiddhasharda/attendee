import React, { useEffect, useState } from 'react';
import { View, Text, Button, Modal, StyleSheet } from 'react-native';
import { setCookie, getCookie } from './CookiesManager'; 

const CookiesPopUp = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    checkCookie();
  }, []);

  const checkCookie = async () => {
    const consent = await getCookie('userConsent');
    if (!consent) {
      setIsVisible(true);
    }
    // else {
    //   onAccept(); // Notify parent component that cookies have been accepted
    // }
  };

  // const checkCookie = async () => {
  //   const consent = await getCookie('userConsent');
  //   console.log('Consent cookie:', consent); // Log the cookie value
  //   if (!consent) {
  //     setIsVisible(true);
  //   }
  // };
  
  const acceptCookies = async () => {
    await setCookie('userConsent', 'true');
    setIsVisible(false);
    // onAccept();
  };

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="fade"
      onRequestClose={() => setIsVisible(false)}
    >
      <View style={styles.container}>
        <View style={styles.popup}>
          <Text style={styles.text}>
            We use cookies to improve your experience. By continuing to use our
            app, you accept our use of cookies.
          </Text>
          <Button title="Accept" onPress={acceptCookies} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popup: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  text: {
    marginBottom: 20,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CookiesPopUp;
