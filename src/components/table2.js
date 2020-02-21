import React , {Component} from 'react';
import { Table, Badge, Menu, Dropdown, Icon } from 'antd';

const menu = (
    <Menu>
        <Menu.Item>Action 1</Menu.Item>
        <Menu.Item>Action 2</Menu.Item>
    </Menu>
);

function NestedTable() {
    const expandedRowRender = () => {
        const columns = [
            { title: 'Date', dataIndex: 'date', key: 'date' },
            { title: 'Name', dataIndex: 'name', key: 'name' },
            {
                title: 'Status',
                key: 'state',
                render: () => (
                    <span>
            <Badge status="success" />
            Finished
          </span>
                ),
            },
            { title: 'Upgrade Status', dataIndex: 'upgradeNum', key: 'upgradeNum' },
        ];

        const data = [];
        for (let i = 0; i < 1; ++i) {
            data.push({
                key: i,
                date: '2014-12-24 23:12:00',
                name: 'This is production name',
                upgradeNum: 'Upgraded: 56',
            });
        }
        return <Table columns={columns} dataSource={data} pagination={false} />;
    };

    const columns = [
        { title: 'STORE', dataIndex: 'store', key: 'store' },
        { title: 'INVOICE', dataIndex: 'inv', key: 'inv' },
        { title: 'TOTAL AMOUNT', dataIndex: 'totalamt', key: 'totalamt' },
        { title: 'DATE', dataIndex: 'date', key: 'date' },
        { title: 'TIMESTAMP', dataIndex: 'timestamp', key: 'timestamp' },

    ];

    const data = [];
    for (let i = 0; i < 1; ++i) {
        data.push({
            key: i,
            store: 'Freeky Enterprise',
            inv: 'inv15822577278',
            totalamt: '1234567',
            date: 10,
            timestamp: '10',
        });
    }

    return (
        <Table
            className="components-table-demo-nested"
            columns={columns}
            expandedRowRender={expandedRowRender}
            dataSource={data}
        />
    );
}

export default NestedTable;