import inputTypes from "../inputTypes";
import React from "react";

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    required: true,
    dataType: {
      type: inputTypes.string,
      primaryKey: true
    }
  },
  {
    title: 'Product',
    dataIndex: 'product',
    required: true,
    isTableColumn: true,
    mainColumn: true,
    dataType: {
      type: inputTypes.string,
    }
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    required: true,
    isTableColumn: true,
    dataType: {
      type: inputTypes.number,
    }
  },
  {
    title: 'Cost Price',
    dataIndex: 'costPrice',
    required: true,
    isTableColumn: true,
    render: (text) => {
      return <i style={{ fontStyle: 'normal'}}>{!isNaN(text) ? `GHS ${text}` : ''}</i>
    },
    dataType: {
      type: inputTypes.number,
    }
  },
  {
    title: 'Selling Price',
    dataIndex: 'sellingPrice',
    required: true,
    isTableColumn: true,
    render: (text) => <i style={{ fontStyle: 'normal'}}>{text ? `GHS ${text}` :
        <i style={{color: 'red', fontStyle: 'normal'}}>Not Stated</i>}</i>,
    dataType: {
      type: inputTypes.number,
    }
  },
];

export default columns;
