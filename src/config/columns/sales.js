import inputTypes from "../inputTypes";
import React from "react";
import { Button, Drawer, Table } from 'antd';
import Component from '@reactions/component';
import {
  InfoCircleFilled
} from '@ant-design/icons';

const saleEntriesColumns = [
  {
    title: 'Product',
    dataIndex: 'productId',
    key: 'productId',
    render: (text, record) => <b>{record.product.name}</b>
  },
  {
    title: 'Selling Price',
    dataIndex: 'sellingPrice',
    key: 'sellingPrice',
    render: (text, record) => <i>GHS {text}</i>
  },
  {
    title: 'Cost Price',
    dataIndex: 'costPrice',
    key: 'costPrice',
    render: (text, record) => <i>GHS {text}</i>
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
  },
  {
    title: 'Discount',
    dataIndex: 'discount',
    key: 'discount',
  },
  {
    title: 'Total Cost Price',
    key: 'totalCP',
    render: (text, record) => <i>GHS {record.quantity * record.costPrice}</i>
  },
  {
    title: 'Total Selling Price',
    key: 'totalSP',
    render: (text, record) => <i>GHS {record.quantity * record.sellingPrice}</i>
  },
  {
    title: 'Total Profit',
    key: 'totalP',
    render: (text, record) => <i style={{color: 'green'}}>GHS {(record.quantity * record.sellingPrice) - (record.quantity * record.costPrice)}</i>
  },
]
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
    title: 'Action',
    dataIndex: 'saleEntries',
    isTableColumn: true,
    render: (text, record) => <Component initialState={{ open: false }}>
      {({ setState, state }) => (
        <div>
          <InfoCircleFilled
            style={{
              fontSize: '20px',
              color: 'grey'
            }}
            onClick={() =>
              setState(state => ({ open: true }))
            } />
          <Drawer
            title={`${record.type}   -   ${record.customer.firstName}   -   ${new Date(record.created_at * 1).toDateString().split('GMT')[0]}`}
            width={1000}
            closable={true}
            onClose={() =>
              setState(state => ({ open: false }))}
            visible={state.open}
          >
            <Table
              columns={saleEntriesColumns}
              dataSource={record.saleEntries}
            />
          </Drawer>
        </div>
      )}
    </Component>
    ,
    dataType: {
      type: inputTypes.string,
    }
  },
  {
    title: 'Total',
    dataIndex: '',
    isTableColumn: true,
    render: (text, record) => <b style={{ color: 'green' }}>GHS {
      record.saleEntries.reduce((total, se) => {
        return total + (se.quantity * se.sellingPrice)
      }, 0)
    }</b>,
    dataType: {
      type: inputTypes.string,
    }
  },
  {
    title: 'Payment',
    dataIndex: 'paymentType',
    required: true,
    isTableColumn: true,
    mainColumn: true,
    dataType: {
      type: inputTypes.string,
    }
  },
  {
    title: 'Date',
    dataIndex: 'salesDate',
    required: true,
    isTableColumn: true,
    render: (text) => <i style={{ fontStyle: 'normal'}}>{new Date(text * 1000).toDateString().split('GMT')[0]}</i>,
    dataType: {
      type: inputTypes.date,
    }
  },
  {
    title: 'Sale/Invoice',
    dataIndex: 'type',
    required: true,
    isTableColumn: true,
    render: (text) => <i style={{ fontStyle: 'normal' }}>{text}</i>,
    dataType: {
      type: inputTypes.string,
    }
  },
  {
    title: 'Discount',
    dataIndex: 'discount',
    required: true,
    isTableColumn: true,
    render: (text) => <i style={{ fontStyle: 'normal'}}>{text ? `GHS ${text}` :
      <i style={{color: 'red', fontStyle: 'normal'}}>No Discount</i>}</i>,
    dataType: {
      type: inputTypes.string,
    }
  },
  {
    title: 'Customer',
    dataIndex: 'customer',
    required: true,
    isTableColumn: true,
    render: (text, record) => <i style={{ fontStyle: 'normal'}}>{record.customer.firstName} {record.customer.otherNames}</i>,
    dataType: {
      type: inputTypes.multi,
    }
  },
];

export default columns;
