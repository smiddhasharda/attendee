import React,{ useMemo,useState  } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';

const WebTable = ({...props}) => {

  // const table = useMaterialReactTable({
  //   columns,
  //   data,
  // });

  return <MaterialReactTable
  columns={props?.columns}
  data={props?.data || ''}
/>;
};

export default WebTable;
