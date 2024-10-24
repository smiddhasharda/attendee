import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

// Sample data with scores
const data = [
  { name: 'Math', score: 215, color: '#f88C75' },
  { name: 'English', score: 280, color: '#FABE6A' },
  { name: 'Science', score: 527, color: '#4D5FB8' },
  { name: 'History', score: 853, color: '#ECB7EA' },
 
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
  const radius = screenWidth < 768 ? 90 : 140; 

  return (
    <View style={styles.container}>
      <View style={{ padding:20 }}>
        <View style={styles.chartContainer}>
          <PieChart
            data={dataWithPercentage}
            width={screenWidth}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            accessor="score" // Use the raw score as the accessor for slice size
            backgroundColor="transparent"
            paddingLeft="60" // Adjust to center the chart
            absolute
            hasLegend={false} // Remove external legends
          />
          {/* Overlay for percentage labels */}
          <View style={styles.overlay}>
            {dataWithPercentage.map((item, index) => {
              const total = 360; // Total degrees in a circle
              const angle = (item.score / totalScore) * total; // Angle for this slice
              const offsetAngle = dataWithPercentage.slice(0, index).reduce((acc, item) => acc + (item.score / totalScore) * total, 0); // Cumulative angle

              // Calculate position based on the angle
              const x = Math.cos((offsetAngle + angle / 2) * (Math.PI / 180)) * (radius * 0.6); // Adjust multiplier for distance from center
              const y = Math.sin((offsetAngle + angle / 2) * (Math.PI / 180)) * (radius * 0.6); // Adjust multiplier for distance from center

              return (
                <View key={index} style={[styles.percentageLabel, { left: screenWidth / 2 + x - 60, top: 140 + y - 60 }]}>
                  <Text style={styles.percentageText}>{`${item.percentage}%`}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
      <View style={styles.percentageContainer}>
        {dataWithPercentage.map((item, index) => (
          <View key={index} style={styles.percentageItem}>
            <View style={[styles.colorBox, { backgroundColor: item.color }]} />
            <Text style={[styles.percentageText]}>
              {item.name}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  chartContainer: {
    position: 'relative', // Enable positioning for overlay
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageLabel: {
    position: 'absolute',
    alignItems: 'center', // Ensures percentage text is centered
    justifyContent: 'center',
  },
  percentageText: {
    fontSize: 14,
    color: '#000',
    position:"relative",
    // top:4,
    left:10,
    alignItems:"center",
    textAlign:"center",
    
    // Adjust text color for better visibility
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
});

export default ExamPieChart;
