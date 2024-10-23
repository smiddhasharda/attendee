import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

// Sample data with scores
const data = [
  { name: 'Math', score: 215, color: '#ccc' },
  { name: 'English', score: 280, color: 'green' },
  { name: 'Science', score: 527, color: '#00f' },
  { name: 'History', score: 853, color: 'red' },
];

// Calculate the total score for percentage calculations
const totalScore = data.reduce((acc, item) => acc + item.score, 0);

// Data with percentage for each slice
const dataWithPercentage = data.map(item => ({
  name: item.name,
  percentage: ((item.score / totalScore) * 100).toFixed(2), // Calculate percentage
  score: item.score,
  color: item.color,
}));

const ExamPieChart = () => {
  return (
    <View style={styles.container}>
       <View style={styles.percentageContainer}>
        {dataWithPercentage.map((item, index) => (
          <View key={index} style={styles.percentageItem}>
            <View style={[styles.colorBox, { backgroundColor: item.color }]} />
            <Text style={[styles.percentageText,]}>
              {item.percentage}%
             
            </Text>
          </View>
        ))}
      </View>
      <View style={{alignItems:"center",justifyContent:"center"}}>
      <PieChart
        data={dataWithPercentage}
        width={screenWidth}
        height={220}
        chartConfig={{
          backgroundColor: '#1cc910',
          backgroundGradientFrom: '#eff3ff',
          backgroundGradientTo: '#efefef',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        accessor="score" // Use the raw score as the accessor for slice size
        backgroundColor="transparent"
        paddingLeft="0" // Adjust to center the chart
        absolute
        // style={{justifyContent:"center"}}
        hasLegend={false} // Remove external legends
      />
      </View>
      {/* Display percentages with color representation in a single row */}
   
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  percentageContainer: {
    flexDirection: 'row', // Aligns the percentages in a single row
    justifyContent: 'center',
    marginTop: 10, // Space between the chart and percentages
  },
  percentageItem: {
    flexDirection: 'row', // Aligns color box and text
    alignItems: 'center',
    marginHorizontal: 10, // Space between percentage items
  },
  colorBox: {
    width: 20,  // Width of the colored box
    height: 20, // Height of the colored box
    borderRadius: 4, // Rounded corners for the box
    marginRight: 5, // Space between the color box and text
  },
  percentageText: {
    fontSize: 16,
    color: '#000',
  },
});

export default ExamPieChart;
