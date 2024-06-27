import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

const Pagination = ({ total, currentPage, pageSize, onPageChange }) => {
  const totalPages = Math.ceil(total / pageSize);

  return (
    <View style={styles.pagination}>
      <Pressable onPress={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        <Text style={styles.pageNumber}>Previous</Text>
      </Pressable>
      {Array.from({ length: totalPages }, (_, index) => (
        <Pressable key={index} onPress={() => onPageChange(index + 1)} disabled={currentPage === index + 1}>
          <Text style={[styles.pageNumber, currentPage === index + 1 && styles.currentPage]}>{index + 1}</Text>
        </Pressable>
      ))}
      <Pressable onPress={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        <Text style={styles.pageNumber}>Next</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  pagination: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  pageNumber: { margin: 5, fontSize: 18 },
  currentPage: { fontWeight: 'bold', color: 'blue' }
});

export default Pagination;
