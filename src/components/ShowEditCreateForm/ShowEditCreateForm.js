import './ShowEditCreateForm.scss';
import React from 'react';
import {Drawer, Form, Button, Col, Row, Input, Select, Card, Tag} from 'antd';
import capitalize from 'capitalize';
import Api from '../../services/Api';
import inputTypes from '../../config/inputTypes';
import actionTypes from '../../config/actionTypes';

const { Option } = Select;


function ShowEditCreateForm(props) {
  const {editRecord, record, onClose, resource, columns, action, addNewRow, replaceRow, parentRecordId, records} = props;
  const {getFieldDecorator} = props.form;
  const resourceName = resource.resource;
  const resourceDisplayName = resource.displayName || resourceName;
  const finalColumns = action === actionTypes.create ? columns.filter(col => col.dataIndex !== resource.primaryKeyName) : columns;

  const stringInput = (column) => {
    return <Col span={12}>
      <Form.Item
        name={column.dataIndex}
        label={column.title}
        rules={[{ required: column.required, message: `Please enter ${column.title}` }]}
      >
        {getFieldDecorator(column.dataIndex, {
          initialValue: record ? record[column.dataIndex] : '',
          rules: [{ required: true, message: `Please enter ${column.title} of ${resourceDisplayName}` }],
        })(
          <Input disabled={column.dataType.primaryKey === true} placeholder={`Please enter ${resourceDisplayName} ${column.title}`} />
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
  const selectInput = (column, values, type) => {
    return <Col span={12}>
      <Form.Item
        name={column.dataIndex}
        label={column.title}
        rules={[{ required: true, message: `Please select ${column.title}` }]}
      >
        {getFieldDecorator(column.dataIndex, {
          initialValue: record ? record[column.dataIndex] : null,
          rules: [{ required: true, message: `Please enter ${column.title} of ${resourceDisplayName}` }],
        })(
          <Select placeholder={`Please select ${column.title}`}>
            {
              (column.dataType.values || values).map(value =>
                <Option
                  value={typeof value === 'string' ? value : value.id}>
                  { typeof value === 'string' ? capitalize(value) : capitalize(value.name)}
                </Option>)
            }
          </Select>
        )}
      </Form.Item>
    </Col>
  };

    const pickCorrectInput = (column) => {
      switch (column.dataType.type) {
        case inputTypes.string: {
          return stringInput(column);
        }
        case inputTypes.multi: {
          return selectInput(column, records);
        }
        default: {
          return stringInput(column)
        }
      }
    };

    const renderInputs = (columns) => {
      const allInputRows = [];
      for (let m = 0; m < columns.length; m += 2) {
        const inputsRow =
          <Row gutter={16} key={m}>
            {columns[m] ? pickCorrectInput(columns[m]) : ''}
            {columns[m+1] ? pickCorrectInput(columns[m+1]) : ''}
          </Row>;
        allInputRows.push(inputsRow);
      }
      return allInputRows;
    };

    const renderShowFields = (columns) => {
      const showFieldsRows = [];
      for (let m = 0; m < columns.length; m++) {
        const showRow = record === null ? null :
          <div>
            {columns[m] ?
              <Card size={"small"} style={{marginBottom: '5px'}}>
                <Row>
                  <Col span={8} style={{fontSize: '18px', color: '#00834E', fontWeight: 400}}>{columns[m].title}</Col>
                  <Col span={16} style={{textAlign: 'left', fontSize: '18px'}}>{
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
      console.log(records);
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
          width={720}
          onClose={onClose}
          visible={editRecord}
          bodyStyle={{ paddingBottom: 80 }}
          footer={
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <Button
                onClick={onClose}
                style={{ marginRight: 8 }}
              >
                Cancel
              </Button>
              <Button onClick={onClose} type="primary">
                Submit
              </Button>
            </div>
          }
        >
          <Form layout="vertical" hideRequiredMark>
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
                      const updatedRowObject = props.form.getFieldsValue(finalColumns.map(column => column.dataIndex));
                      removeNulls(updatedRowObject);
                      if (action === actionTypes.edit) {
                        const identifierValue = updatedRowObject[resource.primaryKeyName];
                        const updatedRow = await new Api(resource).update(identifierValue, updatedRowObject);
                        replaceRow(identifierValue, updatedRow.data);
                      } else if (action === actionTypes.create) {
                        const newRow = await new Api(resource).create(updatedRowObject);
                        addNewRow(newRow.data);
                      }
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
}

export default Form.create()(ShowEditCreateForm);
