import React from 'react';
import { MaterialReactTable } from 'material-react-table';
import { View, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

const WebTable = ({ columns, data,handleExportRows,handleExportData }) => {

  return (
    <MaterialReactTable
    columns={columns}
    data={data || ''}
    enableRowSelection
    renderTopToolbarCustomActions={({ table }) => (
      <View style={{ flexDirection: 'row', gap: '1rem', padding: '0.5rem', flexWrap: 'wrap' }}>
        <Pressable onPress={() => ''}>
          <Text style={{ marginRight: 10 }}>
            <Ionicons name='refresh' size={20} /> Refresh Data
          </Text>
        </Pressable>
        <Pressable onPress={handleExportData}>
          <Text>
            <Ionicons name='download' size={20} /> Export All Data
          </Text>
        </Pressable>
        <Pressable
          disabled={table.getRowModel().rows.length === 0}
          onPress={() => handleExportRows(table.getRowModel().rows)}
        >
          <Text>
            <Ionicons name='download' size={20} /> Export Page Rows
          </Text>
        </Pressable>
        <Pressable
          disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
          onPress={() => handleExportRows(table.getSelectedRowModel().rows)}
        >
          <Text>
            <Ionicons name='download' size={20} /> Export Selected Rows
          </Text>
        </Pressable>
      </View>
    )}
    rowCount={data?.length || 0}
  />
  );
};

export default WebTable;
