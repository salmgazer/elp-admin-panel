import './ShowEditCreateForm.scss';
import React, {useEffect} from 'react';
import {Drawer, Form, Button, Col, Row, Input, Select, Card, Tag} from 'antd';
import capitalize from 'capitalize';
import inputTypes from '../../config/inputTypes';
import actionTypes from '../../config/actionTypes';
import resources from '../../config/resources';
import { connect } from 'react-redux';
import actions from "../../state/actions";
import mapStateToProps from '../common/mapStateToProps';

const { Option } = Select;

const isMobile = window.innerWidth < 1000;

const ShowEditCreateForm = (props)  => {
  const {editRecord, record, onClose, dispatch, resource, columns, action, parentRecordId, records} = props;
  const {getFieldDecorator} = props.form;
  const resourceName = resource.resource;
  const resourceDisplayName = resource.displayName || resourceName;
  let finalColumns = action === actionTypes.create ? columns.filter(col => col.dataIndex !== resource.primaryKeyName || col.userBasedPrimaryKey) : columns;
  if ([actionTypes.edit, actionTypes.show].includes(action)) {
    finalColumns = [actionTypes.edit, actionTypes.show].includes(action) ? columns.filter(col => !col.cannotShow) : columns;
  }

  useEffect(() => {
    if (['edit', 'create'].includes(action)) {
      for (const column of columns.filter(col => col.isForeignEntity)) {
        const colResource = resources.find(r => r.resource === column.resource);
        if (props[colResource.resource].length === 0) {
          fetchIndexFromStore(colResource);
        }
      }
    }
  });

  const fetchIndexFromStore = (resourceConfig) => {
    dispatch(actions.index(resourceConfig));
  };

  /**
   * @param column
   * @returns {*}
   */
  const stringInput = (column) => {
    return <Col span={isMobile ? 24 : 12}>
      <Form.Item
        name={column.dataIndex}
        label={column.title}
        rules={[{ required: column.required, message: `Please enter ${column.title}` }]}
      >
        {getFieldDecorator(column.dataIndex, {
          initialValue: record ? record[column.dataIndex] : '',
          rules: [{ required: true, message: `Please enter ${column.title} of ${resourceDisplayName}` }],
        })(
          <Input disabled={column.dataType.primaryKey === true && !column.userBasedPrimaryKey} placeholder={`Please enter ${resourceDisplayName} ${column.title}`} />
        )}
      </Form.Item>
    </Col>
  };

  /**
   * @param column
   * @param values
   * @param type can be array of strings or array of objects(resources)
   * @returns {*}
   */
  const selectInput = (column, entries, type) => {
    let values = entries;

    if (column.isForeignEntity) {
      const relatedResource = resources.find(r => r.resource === column.resource);
      values = props[relatedResource.resource] || [];
      return selectInputComponent(column, values);
    }

    return selectInputComponent(column, values);
  };

  const selectInputComponent = (column, values) => <Col span={isMobile ? 24 : 12}>
    <Form.Item
      name={column.dataIndex}
      label={column.title}
      rules={[{ required: true, message: `Please select ${column.title}` }]}
    >
      {getFieldDecorator(column.dataIndex, {
        initialValue: record ? record[column.dataIndex] : null,
        rules: [{ required: true, message: `Please enter ${column.title} of ${resourceDisplayName}` }],
      })(
        <Select
          style={{ width: 328 }}
          showSearch
          placeholder={`Please select ${column.title}`}
          onSearch={(val) => console.log(val)}
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {
            (column.dataType.values || values).map(value =>
              <Option
                key={typeof value === 'string' ? value : value.id}
                value={typeof value === 'string' ? value : value.id}>
                { typeof value === 'string' ? capitalize(value) : capitalize(value.name)}
              </Option>)
          }
        </Select>
      )}
    </Form.Item>
  </Col>;

  const pickCorrectInput = (column) => {
    switch (column.dataType.type) {
      case inputTypes.string: {
        return stringInput(column);
      }
      case inputTypes.multi: {
        return selectInput(column, props[resourceName]);
      }
      default: {
        return stringInput(column)
      }
    }
  };

  const renderInputs = (columns) => {
    const allInputRows = [];
    for (let m = 0; m < columns.length; m += 2) {
      const inputsRows = isMobile ? [
          <Row gutter={16} key={m}>
            {columns[m] ? pickCorrectInput(columns[m]) : ''}
          </Row>,
          <Row>
            {columns[m+1] ? pickCorrectInput(columns[m+1]) : ''}
          </Row>
        ] :
        [<Row gutter={16} key={m}>
          {columns[m] ? pickCorrectInput(columns[m]) : ''}
          {columns[m+1] ? pickCorrectInput(columns[m+1]) : ''}
        </Row>];
      inputsRows.forEach(inputRow => allInputRows.push(inputRow));
      // allInputRows.push(inputsRow);
    }
    return allInputRows;
  };

  const renderShowFields = (columns) => {
    const showFieldsRows = [];
    for (let m = 0; m < columns.length; m++) {
      const showRow = record === null ? null :
        <div key={columns[m].dataIndex}>
          {columns[m] ?
            <Card size={"small"} style={{marginBottom: '5px'}}>
              <Row>
                <Col span={isMobile ? 24 : 7} style={{fontSize: '18px', color: '#00834E', fontWeight: 400}}>{columns[m].title}</Col>
                <Col span={isMobile ? 24 : 14} style={{textAlign: 'left', fontSize: '18px'}}>{
                  columns[m].dataIndex === 'parentId' && record[columns[m].dataIndex] ?
                    <div
                      style={{
                        color: '#007462',
                        fontSize: '18px',
                        paddingBottom: '3px',
                        paddingTop: '3px',
                      }}>
                      {records.find(r => r[resource.primaryKeyName] === parentRecordId).name}
                    </div>
                    :
                    columns[m].isForeignEntity && record[columns[m].resourceKey] ? record[columns[m].resourceKey].name : record[columns[m].dataIndex]
                }</Col>
              </Row>
            </Card>
            : ''}
        </div>;
      if (showRow) {
        showFieldsRows.push(showRow);
      }
    }
    return showFieldsRows;
  };

  const renderChildren = () => {
    if (!record) {
      return '';
    }
    const children = records.filter(r => r.parentId === record[resource.primaryKeyName]);

    if (children.length < 1) {
      return '';
    }
    const childrenComponents = children.map(child =>
      <Tag
        key={child[resource.primaryKeyName]}
        style={{
          color: '#007462',
          cursor: 'pointer',
          fontSize: '15px',
          paddingBottom: '3px',
          paddingTop: '3px',
        }}
      >
        {child[resource.mainColumnName]}
      </Tag>
    );

    return (
      <Card size={"small"} style={{marginBottom: '5px'}}>
        <Row>
          <Col span={4} style={{fontSize: '18px', fontWeight: 'bold', color: '#00834E'}}>Children</Col>
          <Col span={20} style={{textAlign: 'left', fontSize: '18px'}}>
            { childrenComponents.map(childComponent => childComponent) }
          </Col>
        </Row>
      </Card>
    )
  };

  const removeNulls = (item) => {
    Object.keys(item).forEach(itemKey => {
      if (item[itemKey] === null) {
        delete item[itemKey];
      }
    });
  };

  return (
    <div>
      <Drawer
        title={`${capitalize(action || '')} ${resourceDisplayName}`}
        width={ isMobile ? 400 : 720}
        onClose={onClose}
        visible={editRecord}
        bodyStyle={{ paddingBottom: 80}}
        style={{overflow: 'scroll'}}
      >
        <Form layout="vertical" style={{ overflow: 'auto' }} hideRequiredMark>
          {
            action === actionTypes.show ? renderShowFields(finalColumns) : renderInputs(finalColumns).map(inputsRow => inputsRow)
          }
          {
            action === actionTypes.show && resource.hasParent ? renderChildren() : ''
          }
          <Row>
            <Col span={24}>
              {
                action === actionTypes.show ? '' :
                  <Button id={'save-btn'} block onClick={async () => {
                    await props.form.validateFields();
                    console.log(await props.form.validateFields());
                    const updatedRowObject = props.form.getFieldsValue(finalColumns.map(column => column.dataIndex));
                    removeNulls(updatedRowObject);
                    if (action === actionTypes.edit) {
                      const identifierValue = updatedRowObject[resource.primaryKeyName];
                      dispatch(actions.updateOne(identifierValue, updatedRowObject, resource));
                    } else if (action === actionTypes.create) {
                      dispatch(actions.createOne(updatedRowObject, resource));
                    }
                    props.form.resetFields();
                    onClose();
                  }}>
                    {action === actionTypes.create ? 'Create' : 'Save'}
                  </Button>
              }
            </Col>
          </Row>
        </Form>

      </Drawer>
    </div>
  );
};



export default Form.create()(connect(mapStateToProps)(ShowEditCreateForm));
