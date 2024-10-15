// ExamPieChart.js
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const data = [
  {
    name: 'Math',
    score: 215,
    color: '#f00',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
  {
    name: 'English',
    score: 280,
    color: '#0f0',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
  {
    name: 'Science',
    score: 527,
    color: '#00f',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
  {
    name: 'History',
    score: 853,
    color: '#ff0',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
];

const ExamPieChart = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exam Scores</Text>
      <PieChart
        data={data}
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
        accessor="score"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute  
      />
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
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
});

export default ExamPieChart;
