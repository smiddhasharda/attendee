import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Pagination = ({ total, currentPage, pageSize, onPageChange }) => {
  const totalPages = Math.ceil(total / pageSize);

  return (
    <View style={styles.pagination}>
      <TouchableOpacity onPress={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        <Text style={styles.pageNumber}>Previous</Text>
      </TouchableOpacity>
      {Array.from({ length: totalPages }, (_, index) => (
        <TouchableOpacity key={index} onPress={() => onPageChange(index + 1)} disabled={currentPage === index + 1}>
          <Text style={[styles.pageNumber, currentPage === index + 1 && styles.currentPage]}>{index + 1}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity onPress={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        <Text style={styles.pageNumber}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  pagination: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  pageNumber: { margin: 5, fontSize: 18 },
  currentPage: { fontWeight: 'bold', color: 'blue' }
});

export default Pagination;
