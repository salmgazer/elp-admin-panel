import React from 'react';
import {
    Col,
    Row,
    Collapse,
  } from 'antd';
  import allResources from "../../config/resources";
  import capitalize from "capitalize";
  import pluralize from 'pluralize';

  const { Panel } = Collapse;

const BreadCrumbItem = (props) => {
    const {record, resourceName, columns, path, resource} = props;

    return (
        <Col key={path} span={10}>
            <Collapse
                bordered={false}
                className={'breadcrumb'}
            >
                <Panel
                header={`${capitalize(pluralize.singular(resourceName))}: ${record[resource.mainColumnName]}`}
                key="1"
                className={'breadcrumb-panel'}
                >
                {
                    columns.filter(col => col.dataIndex !== resource.primaryKeyName || col.userBasedPrimaryKey).map(col =>
                    <Row key={col.dataIndex} gutter={4} style={{marginBottom: '10px', marginLeft: '20px'}}>
                        <Col span={8} style={{fontWeight: 'bolder'}}>{pluralize.singular(col.title)}</Col>
                        <Col span={16} style={{fontWeight: 'normal'}}>{
                        // route.record[col.dataIndex]
                        col.isForeignEntity ?
                        record[col.resourceKey] ? record[col.resourceKey][allResources
                            .find(r => r.resource === col.resource).mainColumnName] : ''
                        : record[col.dataIndex]
                        }</Col>
                    </Row>
                    )
                }
                { path ?
                    <Row gutter={2}>
                        <a href={route.path} className={'breadcrumb-link'}>
                        Go to <RightOutlined />
                        </a>
                    </Row> : ''
                }
                </Panel>
            </Collapse>
        </Col>
    );
}

export default BreadCrumbItem;