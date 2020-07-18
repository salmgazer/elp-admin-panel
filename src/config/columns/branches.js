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
    title: 'Name',
    dataIndex: 'name',
    required: true,
    mainColumn: true,
    isTableColumn: true,
    dataType: {
      type: inputTypes.string,
    }
  },
  {
    title: 'Start Date',
    dataIndex: 'startDate',
    isTableColumn: true,
    required: true,
    render: (text) => <i style={{ fontStyle: 'normal'}}>{text ? new Date(text).toDateString() : 
      <Tag color="volcano">Not stated</Tag>}</i>,
    dataType: {
      type: inputTypes.date,
    }
  }
];

export default columns;
