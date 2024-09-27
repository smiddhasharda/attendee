import React from 'react';
import { MaterialReactTable } from 'material-react-table';
import { View, Pressable, Text,  ScrollView} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

const WebTable = ({ columns, data,handleExportRows,handleExportData,handleRefreshData,style,handleExportRowsAsPDF,loading,action,renderAction }) => {

  return (
    <ScrollView  style={{ maxHeight: "62vh" }} horizontal>
 <ScrollView>
    <MaterialReactTable
    columns={columns}
    data={data || ''}
    enableRowSelection
    enableRowActions={action || false}
    positionActionsColumn='last'
    rowsPerPageOptions={[
        { label: '20 rows', value: 50 },
   
      ]}
      showRowsPerPage={true}
    renderTopToolbarCustomActions={({ table }) => (
      <View style={{ flexDirection: 'row', gap: '1rem', padding: '0.5rem', flexWrap: 'wrap' , }}>
        
        {/* Refresh Data Button */}
        <Pressable onPress={handleRefreshData} style={style}>
          <Text style={{ marginRight: 10, color: "#fff", textAlign: "center", fontSize: 14 }}>
            Refresh Data
          </Text>
        </Pressable>
    
        {/* Export All Data Button */}
        {handleExportData && (
          <Pressable onPress={handleExportData} style={style}>
            <Text style={{ color: "#fff", textAlign: "center" }}>
              Export All Data
            </Text>
          </Pressable>
        )}
    
        {/* Export Page Rows and Selected Rows */}
        {handleExportRows && (
            <Pressable
              disabled={table.getRowModel().rows.length === 0}
              onPress={() => handleExportRows(table.getRowModel().rows)}
              style={style}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>
                Export Page Rows
              </Text>
            </Pressable>
        )}
         {handleExportRows && (
            <Pressable
              disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
              onPress={() => handleExportRows(table.getSelectedRowModel().rows)}
              style={style}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>
                Export Selected Rows
              </Text>
            </Pressable>
        )}
    
        {/* Export All Data As PDF */}
        {handleExportRowsAsPDF && (
          <Pressable
            disabled={table.getPrePaginationRowModel().rows.length === 0}
            onPress={() => handleExportRowsAsPDF(table.getPrePaginationRowModel().rows)}
            style={style}
          >
            <Text style={{ color: "#fff", textAlign: "center" }}>
              Export All Data As PDF
            </Text>
          </Pressable>
        )}
    
        {/* Export Page Rows As PDF and Export Selected Rows As PDF */}
        {handleExportRowsAsPDF && (
            <Pressable
              disabled={table.getRowModel().rows.length === 0}
              onPress={() => handleExportRowsAsPDF(table.getRowModel().rows)}
              style={style}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>
                Export Page Rows As PDF
              </Text>
            </Pressable>
        )}
        {handleExportRowsAsPDF && (
            <Pressable
              disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
              onPress={() => handleExportRowsAsPDF(table.getSelectedRowModel().rows)}
              style={style}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>
                Export Selected Rows As PDF
              </Text>
            </Pressable>
        )}
        
      </View>
    )}
    
    renderRowActions={renderAction}

    state={{ isLoading: loading }}
    muiCircularProgressProps={{
      color: 'secondary',
      thickness: 5,
      size: 55,
    }}
    muiSkeletonProps={{
      animation: 'pulse',
      height: 28,
    }}
    // rowCount={data?.length || 0}
  />
  </ScrollView>
  </ScrollView>
 
  );
};

export default WebTable;
