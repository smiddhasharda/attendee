import React from 'react';
import { View,StyleSheet } from 'react-native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import LinearGradient from 'expo-linear-gradient';

const ShimmerEffect = () => {
    const renderShimmerItem = () => (
        <View style={styles.listItem}>
            <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                style={styles.shimmer}
            />
        </View>
    );

    return renderShimmerItem();
};

const styles = StyleSheet.create({
    listItem: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    listItemText: {
      fontSize: 16,
      color: '#333',
    },
    shimmer: {
      width: '100%',
      height: 20,
      borderRadius: 4,
    },
    // Add other styles as needed
  });
export default ShimmerEffect;
