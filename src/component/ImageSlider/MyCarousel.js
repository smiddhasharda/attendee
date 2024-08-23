import React, { useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';

import Carousel from 'react-native-snap-carousel/src/carousel/Carousel';

const data = [
  { id: 1, image: require('../../local-assets/home-img.png'), title: 'Image 1' },
  { id: 2, image: require('../../local-assets/home-img.png'), title: 'Image 2' },
  { id: 3, image: require('../../local-assets/home-img.png'), title: 'Image 3' },
  // Add more images as needed
];
 
const screenWidth = Dimensions.get('window').width;

const MyCarousel = () => {
  const carouselRef = useRef(null);

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.itemContainer}>
        <Image source={item.image} style={styles.image} />
        <Text style={styles.title}>{item.title}</Text>
      </View>
    );
  };

  return (
    <Carousel
      ref={carouselRef}
      data={data}
      renderItem={renderItem}
      sliderWidth={screenWidth}
      itemWidth={screenWidth * 0.2} 
      loop={true} 
      autoplay={true} 
      autoplayDelay={100} 
      autoplayInterval={3000} 
      activeItem={1}
    />
  );
};

export default MyCarousel;

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: '#ccc',
    borderRadius: 10,
    height: 250, // This sets the height of each carousel item.
    padding: 15,  // Reduced padding for a tighter fit.
    marginLeft: 15, // Reduced margin for less spacing between items.
    marginRight: 15,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 200, // Keep this in proportion to your itemContainer height.
    borderRadius: 10,
    resizeMode:"contain"
  },
  title: {
    fontSize: 18, // Adjust font size as needed.
    textAlign: 'center',
    marginTop: 10,
  },
});
