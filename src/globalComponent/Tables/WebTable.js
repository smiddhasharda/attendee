import React from 'react';
import { MaterialReactTable } from 'material-react-table';
import { View, Pressable, Text,  ScrollView} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

const WebTable = ({ columns, data,handleExportRows,handleExportData,handleRefreshData,style, }) => {

  return (
    <ScrollView  style={{ maxHeight: 410 }} horizontal>
 <ScrollView>
    <MaterialReactTable
    columns={columns}
    data={data || ''}
    enableRowSelection
    renderTopToolbarCustomActions={({ table }) => (
      <View style={{ flexDirection: 'row', gap: '1rem', padding: '0.5rem', flexWrap: 'wrap' }}>
        <Pressable onPress={() => handleRefreshData()} style={style}>
          <Text style={{ marginRight: 10 ,color:"#fff" ,textAlign:"center"  ,fontSize:14}}>
            {/* <Ionicons name='refresh' size={16} color="#fff"  textAlign="center" marginTop="5px" /> */}
             Refresh Data
          </Text>
        </Pressable>
        <Pressable onPress={handleExportData} style={style}>
          <Text style={{ color:"#fff" ,textAlign:"center"}}>
            {/* <Ionicons name='download' size={20}  color="#fff"  textAlign="center"/>  */}
            Export All Data
          </Text>
        </Pressable>
        <Pressable
          disabled={table.getRowModel().rows.length === 0}
          onPress={() => handleExportRows(table.getRowModel().rows)}
          style={style}
        >
          <Text style={{ color:"#fff", textAlign:"center" }}>
            {/* <Ionicons name='download' size={20} color="#fff"  textAlign="center" />  */}
            Export Page Rows
          </Text>
        </Pressable>
        <Pressable
          disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
          onPress={() => handleExportRows(table.getSelectedRowModel().rows)}
          style={style}
        >
          <Text style={{ color:"#fff",textAlign:"center"}}>
            {/* <Ionicons name='download' size={20}  color="#fff"  textAlign="center"/> */}
             Export Selected Rows
          </Text>
        </Pressable>
      </View>
    )}
    rowCount={data?.length || 0}
  />
  </ScrollView>
  </ScrollView>
 
  );
};

export default WebTable;
