import capitalize from 'capitalize';
import pluralize from 'pluralize';
import React, {useEffect} from 'react';
import { connect } from 'react-redux';
import {Drawer, Form, Button, Col, Row, Input, Select, Card, Tag, Tabs, InputNumber, DatePicker} from 'antd';
import './ShowEditCreateForm.scss';
import inputTypes from '../../config/inputTypes';
import actionTypes from '../../config/actionTypes';
import resources from '../../config/resources';
import actions from "../../state/actions";
import mapStateToProps from '../common/mapStateToProps';

const { Option } = Select;
const { TabPane } = Tabs;

const isMobile = window.innerWidth < 1000;

const ShowEditCreateForm = (props)  => {
  const {editRecord, record, onClose, dispatch, resource, columns, action, parentRecordId, records} = props;
  const {getFieldDecorator} = props.form;
  const resourceName = resource.resource;
  const resourceDisplayName = resource.displayName || resourceName;
  let finalColumns = columns.filter(col => col.dataType.type !== inputTypes.picture);
  finalColumns = action === actionTypes.create ? columns.filter(col => col.dataIndex !== resource.primaryKeyName
    || col.userBasedPrimaryKey) : columns;
  if ([actionTypes.edit, actionTypes.show].includes(action)) {
    finalColumns = [actionTypes.edit, actionTypes.show].includes(action) ?
      columns.filter(col => !col.cannotShow) : columns;
  }

  useEffect(() => {
    if (['edit', 'create'].includes(action)) {
      for (const column of columns.filter(col => col.isForeignEntity)) {
        const colResource = resources.find(r => r.resource === column.resource);
        if (props[colResource.resource].length === 0) {
          fetchIndexFromStore(colResource);
        }
        if (column.dataType.type === inputTypes.dynamicMultiWithChildren) {
          if (column.resourceConfig && props[column.resourceConfig.resource] &&
            props[column.resourceConfig.resource].length === 0) {
            fetchIndexFromStore(column.resourceConfig); // fetching flavour etc
          }
          if (column.childResourceConfig && (!props[column.childResourceConfig.resource] ||
            props[column.childResourceConfig.resource].length === 0)) {
            fetchIndexFromStore(column.childResourceConfig, '/product_segment_entries/all');
          }
        }
      }
    }
  });

  const fetchIndexFromStore = (resourceConfig, url) => {
    dispatch(actions.index(resourceConfig, {}, {url}));
  };

  /**
   * @param column
   * @returns {*}
   */
  const stringInput = (column) => <Col span={isMobile ? 24 : 12}>
      <Form.Item
        name={column.dataIndex}
        label={column.title}
        rules={[{ required: column.required || false, message: `Please enter ${column.title}` }]}
      >
        {getFieldDecorator(column.dataIndex, {
          initialValue: record ? record[column.dataIndex] : '',
          rules: [{ required: column.required || false, message: `Please enter ${column.title} of ${resourceDisplayName}` }],
        })(
          <Input disabled={column.dataType.primaryKey === true && !column.userBasedPrimaryKey}
                 placeholder={`Please enter ${resourceDisplayName} ${column.title}`} />
        )}
      </Form.Item>
    </Col>;

  /**
   * @param column
   * @returns {*}
   */
  const numberInput = (column) => <Col span={isMobile ? 24 : 12}>
      <Form.Item
        name={column.dataIndex}
        label={column.title}
        rules={[{ required: column.required || false, message: `Please enter ${pluralize.singular(column.title)}` }]}
      >
        {getFieldDecorator(column.dataIndex, {
          initialValue: record ? record[column.dataIndex] : 0,
          rules: [{ required: column.required || false, message: `Please enter ${column.title} of ${pluralize.singular(resourceDisplayName)}` }],
        })(
          <InputNumber min={0} style={{ width: '300px'}}  disabled={column.dataType.primaryKey === true && !column.userBasedPrimaryKey} placeholder={`${column.title} of ${pluralize.singular(resourceDisplayName)}`} />
        )}
      </Form.Item>
    </Col>;


  /**
   * @param column
   * @returns {*}
   */
  const dateInput = (column) => <Col span={isMobile ? 24 : 12}>
      <Form.Item
        name={column.dataIndex}
        label={column.title}
        rules={[{ required: column.required || false, message: `Please enter ${pluralize.singular(column.title)}` }]}
      >
        {getFieldDecorator(column.dataIndex, {
          rules: [{ required: column.required || false, message: `Please enter ${column.title} of ${pluralize.singular(resourceDisplayName)}` }],
        })(
          <DatePicker style={{ width: '300px'}}
                      disabled={column.dataType.primaryKey === true && !column.userBasedPrimaryKey}
                      placeholder={`${column.title} of ${pluralize.singular(resourceDisplayName)}`}
          />
        )}
      </Form.Item>
    </Col>;

  /**
   * @param column
   * @param values
   * @param type can be array of strings or array of objects(resources)
   * @returns {*}
   */
  const selectInput = (column, entries, mode) => {
    let values = entries;

    if (column.isForeignEntity) {
      const relatedResource = resources.find(r => r.resource === column.resource);
      values = props[relatedResource.resource] || [];
      return selectInputComponent(column, values, mode);
    }

    return selectInputComponent(column, values, mode);
  };

  const selectInputComponent = (column, values, mode = '', hideTitle=false, formItemName, displayName, initialValue) =>
    <Col span={isMobile ? 24 : 12}>
      <Form.Item
        name={formItemName || column.dataIndex}
        label={hideTitle ? '' : column.title}
        rules={[{ required: true, message: `Please select ${column.title}` }]}
      >
        {getFieldDecorator(formItemName || column.dataIndex, {
          initialValue: initialValue || (!record ? null : mode === 'multiple' ?
            column.dataType.type === inputTypes.dynamicMultiWithChildren ?
              values.map(item => item.id) : record[column.resource].map(item => item.id) : record[column.dataIndex]),
          // initialValue: mode === 'multiple' ? record[column.resource] : record[column.dataIndex] || null,
          rules: [
            { required: column.dataType.type === inputTypes.dynamicMultiWithChildren ? false : column.required,
              message: `Please enter ${column.title} of ${ displayName || resourceDisplayName}`
            }],
        })(
          <Select
            disabled={column.cannotEdit}
            style={{ width: column.dataType.type === inputTypes.dynamicMultiWithChildren ? 650 : 328 }}
            showSearch
            mode={mode}
            placeholder={`Please select ${ displayName || column.title}`}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {
              (column.dataType.values || (column.dataIndex === 'parentId' ? values.filter(val => !val.parentId && (record ? val.id !== record.id : true)) : column.showChildrenOnly ? values.filter(val => val.parentId)  : values)).map(value =>
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

  /**
   * @param column
   * @param values
   * @param type can be array of strings or array of objects(resources)
   * @returns {*}
   */
  const dynamicMultiSelectWithSelectInput = (column, entries) => {

    if (record) {
      const primaryResource = props[column.primaryResourceConfig.resource]
        .find(primaryItem => primaryItem[column.primaryResourceConfig.primaryKeyName]
          === record[column.primaryResourceConfig.foreignKeyName]);

      if (primaryResource) {
        const parentResourceValues = primaryResource[column.resourceConfig.resource];
        return (
          <Col span={24}>
            <b style={{ color: '#86610C', fontSize: '18px'}}>{column.title}</b>
            <Row>
              <Tabs defaultActiveKey="1">
                {
                  parentResourceValues.map(parentResourceValue => {
                    const childResourceValues = props[column.childResourceConfig.resource]
                      .filter(val => val[column.resourceConfig.foreignKeyName] === parentResourceValue[column.resourceConfig.primaryKeyName]);
                    let initialValue = childResourceValues.find(item => record.productSegmentEntryIds.includes(item.id));
                    if (initialValue) {
                      initialValue = initialValue.id;
                    }
                    if (childResourceValues) {
                      return <TabPane
                          tab={parentResourceValue[column.resourceConfig.mainColumnName]}
                          key={parentResourceValue[column.resourceConfig.primaryKeyName]}
                        >
                          {
                            selectInputComponent(
                              column,
                              childResourceValues,
                              null,
                              true,
                              parentResourceValue[column.childResourceConfig.mainColumnName],
                              parentResourceValue[column.childResourceConfig.mainColumnName],
                              initialValue
                            )
                          }
                        </TabPane>
                    }
                    return '';
                  })
                }
              </Tabs>
            </Row>
          </Col>
        );
      }
    }
    return '';
  };

  const pickCorrectInput = (column) => {
    switch (column.dataType.type) {
      case inputTypes.string: {
        return stringInput(column);
      }
      case inputTypes.dynamicMultiWithChildren: {
        return dynamicMultiSelectWithSelectInput(column, props[resourceName]);
        // return selectInput(column, props[resourceName], 'multiple');
      }
      case inputTypes.multi: {
        return selectInput(column, props[resourceName]);
      }
      case inputTypes.multipleValues: {
        return selectInput(column, props[resourceName], 'multiple');
      }
      case inputTypes.number: {
        return numberInput(column);
      }
      case inputTypes.date: {
        return dateInput(column);
      }
      default: {
        return stringInput(column)
      }
    }
  };

  const renderInputs = (parsedColumns) => {
    const allInputRows = [];
    const cols = parsedColumns.filter(col => col.dataType.type !== inputTypes.picture);
    for (let m = 0; m < cols.length; m += 2) {
      const inputsRows = isMobile ? [
          <Row gutter={16} key={m}>
            {cols[m] ? pickCorrectInput(cols[m]) : ''}
          </Row>,
          <Row>
            {cols[m+1] ? pickCorrectInput(cols[m+1]) : ''}
          </Row>
        ] :
        [<Row gutter={16} key={m}>
          {cols[m] ? pickCorrectInput(cols[m]) : ''}
          {cols[m+1] ? pickCorrectInput(cols[m+1]) : ''}
        </Row>];
      inputsRows.forEach(inputRow => allInputRows.push(inputRow));
      // allInputRows.push(inputsRow);
    }
    return allInputRows;
  };

  const renderShowFields = (allColumns) => {
    const showFieldsRows = [];
    const columns = allColumns.filter(col => ![inputTypes.multipleValues, inputTypes.dynamicMultiWithChildren, inputTypes.picture].includes(col.dataType.type));
    for (let m = 0; m < columns.length; m++) {
      const showRow = record === null ? null :
        <div key={columns[m].dataIndex}>
          {columns[m] ?
            <Card size={"small"} style={{marginBottom: '5px'}}>
              <Row>
                <Col span={isMobile ? 24 : 7} style={{fontSize: '18px', color: '#00834E', fontWeight: 400}}>{columns[m].title}</Col>
                <Col span={isMobile ? 24 : 14} style={{textAlign: 'left', fontSize: '18px', marginLeft: '20px'}}>{
                  columns[m].dataIndex === 'parentId' && record[columns[m].dataIndex] ?
                    <div
                      style={{
                        color: '#007462',
                        fontSize: '18px',
                        paddingBottom: '3px',
                        paddingTop: '3px',
                      }}>
                      {record.parent[resource.mainColumnName]}
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
          marginBottom: '5px'
        }}
      >
        {child[resource.mainColumnName]}
      </Tag>
    );

    return (
      <Card size={"small"} style={{marginBottom: '5px'}}>
        <Row>
          <Col span={8} style={{fontSize: '18px', fontWeight: 'bold', color: '#00834E'}}>Children</Col>
          <Col span={16} style={{textAlign: 'left', fontSize: '18px'}}>
            { childrenComponents.map(childComponent => childComponent) }
          </Col>
        </Row>
      </Card>
    );
  };

  const renderDynamicMultiParents = () => {
    if (!record) {
      return '';
    }

    const dynamicMultiParentColumns = columns.filter(col => col.dataType.type === inputTypes.dynamicMultiWithChildren);
    if (dynamicMultiParentColumns.length > 0) {
      return dynamicMultiParentColumns.map(col => {

        if (record[col.childResourceConfig.resource].length === 0) return '';

        return (
          <Card size={"small"} style={{marginBottom: '5px'}} key={col.dataIndex}>
            <Row>
              <Col span={8} style={{fontSize: '18px', fontWeight: 'bold', color: '#00834E'}}>{col.resourceConfig.displayName}</Col>
              <Col span={16} style={{textAlign: 'left', fontSize: '18px'}}>
                {
                  record[col.childResourceConfig.resource].map(item =>
                    <Tag
                      key={item.id}
                      style={{
                        color: '#007462',
                        cursor: 'pointer',
                        fontSize: '15px',
                        paddingBottom: '3px',
                        paddingTop: '3px',
                        marginBottom: '5px'
                      }}
                    >
                      {item.name}
                    </Tag>
                  )
                }
              </Col>
            </Row>
          </Card>
        );
      });
    }
  };

  /*
  const renderDynamicMultiParents = () => {
    if (!record) {
      return '';
    }

    const dynamicMultiParentColumns = columns.filter(col => col.dataType.type === inputTypes.dynamicMultiWithChildren);
    if (dynamicMultiParentColumns.length > 0) {
      return dynamicMultiParentColumns.map(col => {
        let items = [];
        if (props[col.primaryResourceConfig.resource]) {
          const primaryRecord = props[col.primaryResourceConfig.resource].find(item => item[col.primaryResourceConfig.primaryKeyName]
            === record[col.primaryResourceConfig.foreignKeyName]);
          if (primaryRecord) {
            items = primaryRecord[col.resourceConfig.resource];
          }
        }

        if (items.length === 0) return '';

        return (
          <Card size={"small"} style={{marginBottom: '5px'}} key={col.dataIndex}>
            <Row>
              <Col span={8} style={{fontSize: '18px', fontWeight: 'bold', color: '#00834E'}}>{col.resourceConfig.displayName}</Col>
              <Col span={16} style={{textAlign: 'left', fontSize: '18px'}}>
                {
                  items.map(item =>
                    <Tag
                      key={item.id}
                      style={{
                        color: '#007462',
                        cursor: 'pointer',
                        fontSize: '15px',
                        paddingBottom: '3px',
                        paddingTop: '3px',
                        marginBottom: '5px'
                      }}
                    >
                      {item.name}
                    </Tag>
                  )
                }
              </Col>
            </Row>
          </Card>
        );
      });
    }
  };
  */

  const renderHasMany = () => {
    if (!record) {
      return '';
    }

    if (resource.hasMany.length < 1) {
      return '';
    }

    return resource.hasMany.map(field =>
      <Card key={field} size={"small"} style={{marginBottom: '5px'}}>
        <Row>
          <Col span={8}
               style={{fontSize: '18px', fontWeight: 'bold', color: '#00834E'}}>{resources.find(r => r.resource === field).displayName}</Col>
          <Col span={16} style={{textAlign: 'left', fontSize: '18px'}}>
            {record[field].map(entry =>
              <Tag
                key={entry[resources.find(r => r.resource === field).primaryKeyName]}
                style={{
                  color: '#007462',
                  cursor: 'pointer',
                  fontSize: '15px',
                  paddingBottom: '3px',
                  paddingTop: '3px',
                }}
              >
                {entry[resources.find(r => r.resource === field).mainColumnName]}
              </Tag>
            )}
          </Col>
        </Row>
      </Card>
    );
  };

  const removeNulls = (item) => {
    Object.keys(item).forEach(itemKey => {
      if (item[itemKey] === null) {
        delete item[itemKey];
      }
    });
  };

  return (
    <div className="drawer">
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
            action === actionTypes.show ? renderShowFields(finalColumns) : ''
          }
          {
            action === actionTypes.edit && record && !record.parentId ?  renderInputs(finalColumns.filter(col => !col.notAccessibleToParent)).map(inputsRow => inputsRow) : ''
          }
          {
            action === actionTypes.edit && record && record.parentId ?  renderInputs(finalColumns.filter(col => col)).map(inputsRow => inputsRow) : ''
          }
          {
            action === actionTypes.create ?  renderInputs(finalColumns.filter(col => !col.notAccessibleToParent)).map(inputsRow => inputsRow) : ''
          }
          {
            action === actionTypes.show && columns.find(col => col.dataType.type === inputTypes.dynamicMultiWithChildren) ? renderDynamicMultiParents() : ''
          }
          {
            action === actionTypes.show && resource.hasParent ? renderChildren() : ''
          }
          {
            action === actionTypes.show && resource.hasMany && record ? renderHasMany() : ''
          }
          <Row>
            <Col span={24}>
              {
                action === actionTypes.show ? '' :
                  <Button id={'save-btn'} block onClick={async () => {
                    await props.form.validateFields();
                    const formFields = finalColumns.map(column => column.dataIndex);
                    if (resourceName === 'products') {
                      // rethink and make this generic
                      const productCategory = props.product_categories.find(pc => pc.id === record.productCategoryId);
                      if (productCategory && productCategory.product_segments) {
                        productCategory.product_segments.forEach(item => {
                          formFields.push(item.name);
                        });
                      }
                    }
                    const updatedRowObject = props.form.getFieldsValue(formFields);

                    // merge segments into productSegmentEntriesId
                    if (resourceName === 'products') {
                      const productSegmentEntryIds = [];
                      const productCategory = props.product_categories.find(pc => pc.id === record.productCategoryId);
                      if (productCategory && productCategory.product_segments) {
                        productCategory.product_segments.forEach(item => {
                          productSegmentEntryIds.push(updatedRowObject[item.name]);
                          delete updatedRowObject[item.name];
                        });
                      }
                      updatedRowObject.productSegmentEntryIds = productSegmentEntryIds;
                    }
                    delete updatedRowObject.productSegmentIds;

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
