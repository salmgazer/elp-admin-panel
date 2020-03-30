import './ShowEditCreateForm.scss';
import React from 'react';
import { Drawer, Form, Button, Col, Row, Input } from 'antd';
import Api from '../../services/Api';
import inputTypes from '../../config/inputTypes';
import actionTypes from '../../config/actionTypes';

function ShowEditCreateForm(props) {
  const {editRecord, record, onClose, resource, columns, action, addNewRow, replaceRow} = props;
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

    const pickCorrectInput = (column) => {
      switch (column.dataType.type) {
        case inputTypes.string: {
          return stringInput(column);
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
        const showRow =
          <div>
            {columns[m] ?
              <Row gutter={16} style={{marginBottom: '10px'}}>
                <Col span={4} style={{fontSize: '18px', fontWeight: 'bold'}}>{columns[m].title}</Col>
                <Col span={12} style={{textAlign: 'left', fontSize: '18px'}}>{record[columns[m].dataIndex]}</Col>
              </Row> : ''}
          </div>;
        showFieldsRows.push(showRow);
      }
      return showFieldsRows;
    };

    return (
      <div>
        <Drawer
          title={`${action} ${resourceDisplayName}`}
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

            <Row>
              <Col span={24}>
                {
                  action === actionTypes.show ? '' :
                    <Button id={'save-btn'} block onClick={async () => {
                      const updatedRowObject = props.form.getFieldsValue(finalColumns.map(column => column.dataIndex));
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
