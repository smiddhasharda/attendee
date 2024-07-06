import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 

const Pagination = ({ totalItems, pageSize, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  const maxPageNumbers = 5; 

  // Calculate the range of pages to display
  let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
  let endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

  // Adjust startPage and endPage if there are fewer pages than maxPageNumbers
  if (totalPages <= maxPageNumbers) {
    startPage = 1;
    endPage = totalPages;
  } else {
    // Ensure there is always maxPageNumbers visible except in edge cases
    if (currentPage <= Math.floor(maxPageNumbers / 2) + 1) {
      endPage = maxPageNumbers;
    } else if (currentPage + Math.floor(maxPageNumbers / 2) >= totalPages) {
      startPage = totalPages - maxPageNumbers + 1;
    }
  }

  // Array of page numbers to display
  const pageNumbers = [...Array(endPage - startPage + 1).keys()].map(i => startPage + i);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleFirst = () => {
    onPageChange(1);
  };

  const handleLast = () => {
    onPageChange(totalPages);
  };

  const handlePageClick = (page) => {
    onPageChange(page);
  };

  return (
    <View style={styles.paginationContainer}>
      <Pressable style={styles.paginationButton} onPress={handleFirst} disabled={currentPage === 1}>
        <FontAwesome name="angle-double-left" size={20} color={currentPage === 1 ? '#ccc' : '#007AFF'} />
      </Pressable>
      <Pressable style={styles.paginationButton} onPress={handlePrevious} disabled={currentPage === 1}>
        <FontAwesome name="angle-left" size={20} color={currentPage === 1 ? '#ccc' : '#007AFF'} />
      </Pressable>
      {startPage > 1 && (
        <>
          {startPage !== 2 && (
            <>
              <Pressable
                style={styles.paginationButton}
                onPress={() => handlePageClick(startPage - 1)}
              >
                <Text style={styles.paginationText}>{startPage - 1}</Text>
              </Pressable>
              <Text style={styles.paginationText}>...</Text>
            </>
          )}
        </>
      )}
      {pageNumbers.map((page, index) => (
        <Pressable
          key={index}
          style={[styles.paginationButton, currentPage === page ? styles.activePageButton : null]}
          onPress={() => handlePageClick(page)}
        >
          <Text style={[styles.paginationText, currentPage === page ? styles.activePageText : null]}>{page}</Text>
        </Pressable>
      ))}
      {endPage < totalPages && (
        <>
          <Text style={styles.paginationText}>...</Text>
          {endPage !== totalPages - 1 && (
            <Pressable
              style={styles.paginationButton}
              onPress={() => handlePageClick(endPage + 1)}
            >
              <Text style={styles.paginationText}>{endPage + 1}</Text>
            </Pressable>
          )}
        </>
      )}
      <Pressable style={styles.paginationButton} onPress={handleNext} disabled={currentPage === totalPages}>
        <FontAwesome name="angle-right" size={20} color={currentPage === totalPages ? '#ccc' : '#007AFF'} />
      </Pressable>
      <Pressable style={styles.paginationButton} onPress={handleLast} disabled={currentPage === totalPages}>
        <FontAwesome name="angle-double-right" size={20} color={currentPage === totalPages ? '#ccc' : '#007AFF'} />
      </Pressable>
      <Text style={styles.paginationText}>{`Page ${currentPage} of ${totalPages}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  paginationButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
  },
  paginationText: {
    fontSize: 16,
    color: '#007AFF',
  },
  activePageButton: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  activePageText: {
    color: 'white',
  },
});

export default Pagination;
