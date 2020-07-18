import inputTypes from "../inputTypes";
import React from "react";
import {Tag} from 'antd';

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
    render: (text) => <i style={{ fontStyle: 'normal'}}>{text ? `GHS ${text}` :
        <Tag color="volcano">Not stated</Tag>}</i>,
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
        <Tag color="volcano">Not stated</Tag>}</i>,
    dataType: {
      type: inputTypes.number,
    }
  },
];

export default columns;
