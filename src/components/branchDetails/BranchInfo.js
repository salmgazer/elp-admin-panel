import React from "react";

import {
    Col,
    Row,
    Card,
    Tag,
    Switch
} from 'antd';

const dateFormat = require('dateformat');

const BranchInfo = ({branchDetails}) => {
    return (
        <Card
            hoverable
            style={{ width: 600, margin: '0 auto' }}
        >
        <Row gutter={16} style={{marginBottom: '20px'}}>
            <Col span={8}><b>ID</b></Col>
            <Col span={16}>
            <Tag
                style={{
                color: '#007462',
                cursor: 'pointer',
                fontSize: '15px',
                paddingBottom: '3px',
                paddingTop: '3px',
                }}>
                {branchDetails.id}
            </Tag>
            </Col>
        </Row>
        <Row gutter={16} style={{marginBottom: '20px'}}>
            <Col span={8}><b>Name</b></Col>
            <Col span={16}>
            <Tag
                style={{
                color: '#007462',
                cursor: 'pointer',
                fontSize: '15px',
                paddingBottom: '3px',
                paddingTop: '3px',
                }}>
                {branchDetails.name}
            </Tag>
            </Col>
        </Row>
        <Row gutter={16} style={{marginBottom: '20px'}}>
            <Col span={8}><b>Location</b></Col>
            <Col span={16}>
            <Tag
                style={{
                color: '#007462',
                cursor: 'pointer',
                fontSize: '15px',
                paddingBottom: '3px',
                paddingTop: '3px',
                }}>
                {branchDetails.location}
            </Tag>
            </Col>
        </Row>
        <Row gutter={16} style={{marginBottom: '20px'}}>
            <Col span={8}><b>GPS</b></Col>
            <Col span={16}>
            <Tag
                style={{
                color: '#007462',
                cursor: 'pointer',
                fontSize: '15px',
                paddingBottom: '3px',
                paddingTop: '3px',
                }}>
                {branchDetails.gps}
            </Tag>
            </Col>
        </Row>
        <Row gutter={16} style={{marginBottom: '20px'}}>
            <Col span={8}><b>Phone</b></Col>
            <Col span={16}>
            <Tag
                style={{
                color: '#007462',
                cursor: 'pointer',
                fontSize: '15px',
                paddingBottom: '3px',
                paddingTop: '3px',
                }}>
                {branchDetails.phone}
            </Tag>
            </Col>
        </Row>
        <Row gutter={16} style={{marginBottom: '20px'}}>
            <Col span={8}><b>WhatsApp Phone</b></Col>
            <Col span={16}>
            <Tag
                style={{
                color: '#007462',
                cursor: 'pointer',
                fontSize: '15px',
                paddingBottom: '3px',
                paddingTop: '3px',
                }}>
                {branchDetails.phone}
            </Tag>
            </Col>
        </Row>
        <Row gutter={16}  style={{marginBottom: '20px'}}>
            <Col span={8}><b>Business Type</b></Col>
            <Col span={16}>
            <Tag
                style={{
                color: '#007462',
                cursor: 'pointer',
                fontSize: '15px',
                paddingBottom: '3px',
                paddingTop: '3px',
                }}>
                {branchDetails.type}
            </Tag>
            </Col>
        </Row>
        <Row gutter={16} style={{marginBottom: '20px'}}>
            <Col span={8}><b>Start Date</b></Col>
            <Col span={16}>
            <Tag
                style={{
                color: '#007462',
                cursor: 'pointer',
                fontSize: '15px',
                paddingBottom: '3px',
                paddingTop: '3px',
                }}>
                {branchDetails.startDate ? dateFormat(new Date(branchDetails.startDate), "ddd, mmm dS, yyyy") : ''}
            </Tag>
            </Col>
        </Row>
        <Row gutter={16} style={{marginBottom: '20px'}}>
            <Col span={8}><b>Aggregate Sale</b></Col>
            <Col span={16}>
                <Switch disabled defaultChecked={branchDetails.aggregateSales} />,
            </Col>
        </Row>
        <Row gutter={16} style={{marginBottom: '20px'}}>
            <Col span={8}><b>Checkout Sale</b></Col>
            <Col span={16}>
                <Switch disabled defaultChecked={branchDetails.checkoutSales} />,
            </Col>
        </Row>
        <Row gutter={16} style={{marginBottom: '20px'}}>
            <Col span={8}><b>Created At</b></Col>
            <Col span={16}>
            <Tag
                style={{
                color: '#007462',
                cursor: 'pointer',
                fontSize: '15px',
                paddingBottom: '3px',
                paddingTop: '3px',
                }}>
                {dateFormat(new Date(branchDetails.created_at), "ddd, mmm dS, yyyy, h:MM:ss TT")}
            </Tag>
            </Col>
        </Row>
        <Row gutter={16} style={{marginBottom: '20px'}}>
            <Col span={8}><b>Updated At</b></Col>
            <Col span={16}>
            <Tag
                style={{
                color: '#007462',
                cursor: 'pointer',
                fontSize: '15px',
                paddingBottom: '3px',
                paddingTop: '3px',
                }}>
                {dateFormat(new Date(branchDetails.updated_at), "ddd, mmm dS, yyyy, h:MM:ss TT")}
            </Tag>
            </Col>
        </Row>
    </Card>
    )
}

export default BranchInfo;