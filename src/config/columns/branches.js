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
    render: (text) => <i style={{ fontStyle: 'normal'}}>{new Date(text * 1).toDateString().split('GMT')[0]}</i>,
    dataType: {
      type: inputTypes.date,
    }
  }
];

export default columns;
