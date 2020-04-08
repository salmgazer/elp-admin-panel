import React from 'react';
import Api from '../../services/Api.js'
import {
  Table,
  Input,
  Popconfirm,
  Form,
  Button,
  Typography,
  Col,
  Row,
  PageHeader,
  Tag,
  Divider,
  message,
  notification,
  Card,
  Avatar,
  List
} from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import './GenericTable.scss';
import ShowEditCreateForm from '../ShowEditCreateForm/ShowEditCreateForm';
import actionTypes from '../../config/actionTypes';
import {withRouter} from 'react-router-dom';
import inputTypes from "../../config/inputTypes";
import XLSX from 'xlsx';
import { connect } from 'react-redux';
import actions from '../../state/actions';
import paths from "../../utilities/paths";

const {Title} = Typography;

const isMobile = window.innerWidth < 1000;

class GenericTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.initialState;

    this.showEditDrawer = this.showEditDrawer.bind(this);
    this.closeCreateOrEditDrawer = this.closeCreateOrEditDrawer.bind(this);
    this.downloadCSV = this.downloadCSV.bind(this);
    this.routeOrShowRender = this.routeOrShowRender.bind(this);
    this.handleFileChosen = this.handleFileChosen.bind(this);
    this.fetchIndexFromStore = this.fetchIndexFromStore.bind(this);
  }

  showEditDrawer = (record, formAction) => {
    this.setState({
      openCreateOrEditForm: true,
      recordToEdit: record,
      parentRecordId: record && record.parentId ?
        this.props[this.props.resource.resource]
          .find(item => item[this.props.resource.primaryKeyName] === record.parentId).id : null
    });
  };

  closeCreateOrEditDrawer = () => {
    this.setState({
      openCreateOrEditForm: false,
      recordToEdit: null,
      parentRecordId: null,
    });
  };

  save(form, id) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.dataSource];
      const index = newData.findIndex(item => id === item.id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ dataSource: newData, editingKey: '' });

        new Api(this.props.resource).update(id, row).then((res) => {
          this.setState({dataSource : res.data.data });
          window.location.reload(false);
        });

      } else {


        newData.push(row);
        this.setState({ dataSource: newData, editingKey: '' });

        new Api(this.props.resource).update(id, row).then((res) => {
          this.setState({dataSource : res.data.data });
          window.location.reload(false);
        });
      }
    });
  }

  downloadCSV() {
    const {searchValue} = this.state;
    const options = {};
    if (searchValue && searchValue.length > 0) {
      options.searchConfig = {
        search: searchValue
      }
    }

    new Api(this.props.resource, {}, {'Content-Type': 'text/csv'})
        .index().then((res) => {
      const element = document.createElement('a');
      element.setAttribute('href',
        `data:text/csv;charset=utf-8,${encodeURI(res.data)}`);
      element.setAttribute('download', `${this.props.resource.resource}-${new Date()
        .toString().split('GMT')[0]}`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      element.remove();
    });
  }

  addPathToRoute(record) {
    const {routes} = this.state;

    if (record) {
      const {resource} = this.props;
      const updatedRoutes = routes;
      updatedRoutes.push({
        path: resource.resource,
        breadcrumbName: `${resource.displayName}: ${resource.displayColumns.map(displayCol => record[displayCol]).join(" ")}`
      });
      this.setState({
        routes: updatedRoutes
      });
    }
  }

  get initialState() {
    return {
      tableName: this.props.resource.resource,
      editRecord: false,
      recordToEdit: null,
      parentRecordId: null,
      openCreateOrEditForm: false,
      searchValue: '',
      formAction: '',
      routes: []
    }
  }

  componentDidMount() {
    this.fetchIndexFromStore();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.tableName !== this.props.resource.resource) {
      this.fetchIndexFromStore();
    }
  }

  fetchIndexFromStore() {
    const { dispatch, resource } = this.props;
    const {searchValue} = this.state;
    const options = {};

    if (searchValue && searchValue.length > 0) {
      options.searchConfig = {
        search: searchValue
      }
    }

    dispatch(actions.index(resource, {}, options));
  }

  edit(key) {
    this.setState({ editingKey: key });
  }

  routeOrShowRender(resource, record) {
     const {history} = this.props;
     if (!resource.child) {
       this.setState({
         formAction: actionTypes.show
       });
       this.showEditDrawer(record);
     } else {
       // add next path to routes
       this.addPathToRoute(record);
       history.push(`${resource.resource}/${record[resource.primaryKeyName]}/${resource.child.resource}`);
     }
   }

  async handleFileChosen(e) {
    const {columns, resource, dispatch} = this.props;
    const file = e.target.files[0];
    if (!file) {
      return message.warning("Import was canceled");
    }
    if (file.name.indexOf('.xlsx') !== -1 || file.name.indexOf('.xls') !== -1 ) {
      notification.info({
        message: 'Importing data',
        description:
          `The file ${file.name} is being processed. Please remain calm until you are notified to proceed`,
      });

      const reader = new FileReader();
      reader.onload = async (evt) => {
        const data = evt.target.result;
        const workBook = XLSX.read(data, {type: 'binary'});
        const firstSheetName = workBook.SheetNames[0];
        const rows = XLSX.utils.sheet_to_json(workBook.Sheets[firstSheetName]);
        const headers = Object.keys(rows[0]);

        for (const column of columns.filter(col => col.dataIndex !== resource.primaryKeyName)) {
          const header = headers.find(h => h === column.dataIndex);
          if (!header) {
            return notification.error({
              message: 'File is invalid',
              description:
                `The file ${file.name} must have the column ${column.dataIndex}`,
            });
          }
        }

        const allFailedRows = [];
        for (const row of rows) {
          row.name = `${row.name}`;
          const newBrand = await new Api(resource).create(row);
          dispatch(actions.createOne(newBrand, resource, {}));
          if (!newBrand) {
            allFailedRows.push(row);
          }
        }

        this.fetchIndexFromStore();

        notification.success({
          message: 'Done!',
          description:
            `All ${rows.length} ${resource.resource} have been imported!`,
        });

        if (allFailedRows.length > 0) {
          const errorsString = allFailedRows.map(anError => anError[resource.mainColumnName]).join(', ');
          notification.error({
            message: `${allFailedRows} rows(s) failed`,
            description:
              `The following ${resource.resource} failed: ${errorsString}`,
          });
        }
      };

      reader.onerror = function(event) {
        notification.error({
          message: 'Error processing file',
          description:
            `The file ${file.name} could not be read! Code  ${event.target.error.code}`,
        });
      };

      reader.readAsBinaryString(file);
    } else {
      return message.error("File is not an Excel sheet");
    }
  };

  render() {
    const {columns, resource, dispatch} = this.props;
    const resourceName = resource.resource;
    const resourceDisplayName = resource.displayName || resourceName;
    let updatedColumns = Object.assign([], columns);
    const mainColumn = updatedColumns.find(column => column.mainColumn === true);
    const parentColumn =  updatedColumns.find(column => column.dataIndex === 'parentId');

    if (parentColumn && this.props[resourceName]) {
      parentColumn.render = (text, record) => {
        if (record.parentId) {
          const parentRecord = this.props[resourceName].find(item => item[resource.primaryKeyName] === record.parentId);

          return <Col
            onClick={() => {
              this.routeOrShowRender(resource, parentRecord);
            }}>
              <Tag
                style={{
                  color: '#007462',
                  cursor: 'pointer',
                  fontSize: '15px',
                  paddingBottom: '3px',
                  paddingTop: '3px',
                }}>
                {parentRecord[resource.mainColumnName]}
              </Tag>
            </Col>;
        }
        return '';
      }
    }


    updatedColumns.filter(col => col.isForeignEntity).forEach(updatedColumn => {
      updatedColumn.render = (text, record) =>
        <b style={{ cursor: 'pointer', fontWeight: 'normal'}}>
          {
            !record[updatedColumn.resourceKey] ? ''
              :
            <Tag
              style={{
                color: '#007462',
                cursor: 'pointer',
                fontSize: '15px',
                paddingBottom: '3px',
                paddingTop: '3px',
              }}>
              { record ? record[updatedColumn.resourceKey].name : ''}
            </Tag>
          }
        </b>
    });

    mainColumn.render = (text, record) =>
      <b
        style={{ cursor: 'pointer'}}
        onClick={() => {
        this.routeOrShowRender(resource, record);
      }}>{text}</b>;

    if (resource.showCreatedAt) {
      updatedColumns.push({
        title: 'Created At',
        dataIndex: 'created_at',
        isTableColumn: true,
        required: true,
        render: (text) => <i style={{ fontStyle: 'normal'}}>{new Date(text * 1000).toDateString().split('GMT')[0]}</i>,
        dataType: {
          type: inputTypes.date,
        }});
    }

    if (resource.showUpdatedAt) {
      updatedColumns.push({
        title: 'Updated At',
        dataIndex: 'updated_at',
        isTableColumn: true,
        required: true,
        render: (text) => <i style={{ fontStyle: 'normal'}}>{new Date(text * 1000).toDateString().split('GMT')[0]}</i>,
        dataType: {
          type: inputTypes.date,
        }});
    }

    const triggerFileImportButton = () => {
      document.getElementById('file-import-button').click();
    };


    updatedColumns.push({
      title: '',
      dataIndex: '',
      key: 'action',
      width: '150px',
      isTableColumn: (resource.canEdit || resource.canDelete),
      render: (text, record) => {
        const { editingKey } = this.state;
        return (
          <Row gutter={2}>
            {resource.canEdit ?
              <Col span={12}>
                <Button
                  shape={"circle"}
                  style={{
                    backgroundColor: '#FFF8E8',
                    borderColor: '#FFF8E8',
                    boxShadow: '0 2px 4px 0 grey'
                  }}

                  onClick={async () => {
                    this.setState({
                      formAction: actionTypes.edit
                    });

                    this.showEditDrawer(record);
                  }}
                >
                  <EditOutlined disabled={editingKey !== ''} style={{color: '#2F4858'}}/>
                </Button>
              </Col> : ''
            }
            {resource.canDelete ?
              <Col span={12}>
                <Popconfirm
                  title={`Are you sure you want to delete ${record[resource.mainColumnName]}?`}
                  onConfirm={() => dispatch(actions.deleteOne(record[resource.primaryKeyName], resource))}
                >
                  <Button
                    shape={"circle"}
                    style={{
                      borderColor: '#FFC1B4',
                      backgroundColor: '#FFC1B4',
                      boxShadow: '0 2px 4px 0 grey'
                    }}>
                    <DeleteOutlined style={{color: '#2F4858'}}/>
                  </Button>
                </Popconfirm>
              </Col> : ''
            }
          </Row>
        );
      }
    });

    const mobileCardActions = (item) => {
      const result = [<Button
        shape={"circle"}
        style={{
          backgroundColor: '#C3FCF2',
          borderColor: '#C3FCF2',
          boxShadow: '0 2px 4px 0 grey'
        }}

        onClick={async () => {
          this.setState({
            formAction: actionTypes.show
          });

          this.showEditDrawer(item);
        }}
      >
        <EyeOutlined style={{color: '#2F4858'}}/>
      </Button>];
      if (resource.canEdit) {
        result.push(<Button
          shape={"circle"}
          style={{
            backgroundColor: '#FFF8E8',
            borderColor: '#FFF8E8',
            boxShadow: '0 2px 4px 0 grey',
            display: resource.canEdit ? 'visible' : 'hidden'
          }}

          onClick={async () => {
            this.setState({
              formAction: actionTypes.edit
            });

            this.showEditDrawer(item);
          }}
        >
          <EditOutlined style={{color: '#2F4858'}}/>
        </Button>);
      }
      if (resource.canDelete) {
        result.push(<Popconfirm
          title={`Are you sure?`}
          onConfirm={() => dispatch(actions.deleteOne(item[resource.primaryKeyName], resource))}
        >
          <Button
            shape={"circle"}
            style={{
              borderColor: '#FFC1B4',
              backgroundColor: '#FFC1B4',
              boxShadow: '0 2px 4px 0 grey'
            }}>
            <DeleteOutlined style={{color: '#2F4858'}}/>
          </Button>
        </Popconfirm>);
      }
      return result;
    };

    return (
      <div>
        <ShowEditCreateForm
          onClose={this.closeCreateOrEditDrawer}
          editRecord={this.state.openCreateOrEditForm}
          columns={columns}
          resource={resource}
          record={this.state.recordToEdit}
          records={this.props[resourceName]}
          parentRecordId={this.state.parentRecordId}
          action={this.state.formAction}
          addNewRow={this.addNewRow}
          replaceRow={this.replaceRow}
        />
        <Row className="title-row">
          <Col className="gutter-row" span={9}>
            <Title className={isMobile ? 'table-title-mobile' : 'table-title'}>
              All {resourceDisplayName}
            </Title>
          </Col>
          <Col span={9}>
            {
              this.state.routes.length > 0 ?
                <PageHeader
                  onBack={() => null}
                  breadcrumb={{ routes: this.state.routes }}
                /> : ''
            }
          </Col>
          <Col style={{ textAlign: 'right', float: 'right', marginRight: isMobile ? '10px' : '20px' }} span={isMobile ? 8 : 6}>
            <input
              accept=".xls,.xlsx"
              id="file-import-button"
              type="file"
              style={{display: 'none'}}
              onChange={e => this.handleFileChosen(e)}
            />
            <Button
              htmlType="submit"
              className="btn-appearance export-import-btn"
              type="primary"
              icon="upload"
              onClick={async () => await triggerFileImportButton()}
              style={{marginRight: isMobile ? '20px' : '10px' }}
            >
              { !isMobile ? 'Import' : '' }
            </Button>
            <Button
              htmlType="submit"
              className="btn-appearance export-import-btn"
              type="primary"
              icon="download"
              onClick={async () => await this.downloadCSV('text/csv')}
              style={{marginRight: '10px', }}
            >
              { !isMobile ? 'Export' : '' }
            </Button>
          </Col>
        </Row>
        <Divider className={'table-hr'} />
        <div
          style={{
            marginLeft: '40px',
            marginRight: '40px'
          }}
        >
          <Row gutter={8}>
          <Form className="login-form">
            <Col className="gutter-row" span={ isMobile? 24 : 6}>
              <div className="gutter-box search-bar-area">
                <Input.Search
                  size="large"
                  placeholder="Search"
                  onChange={e => {
                    this.setState({
                      searchValue: e.target.value
                    });
                  }}
                  onSearch={ value => {
                    this.fetchIndexFromStore();
                  }}

                  onPressEnter={ e => {
                    this.fetchIndexFromStore();
                  }}

                  onPaste={ e => {
                    this.fetchIndexFromStore();
                  }}
                />
              </div>
            </Col>
          </Form>
        </Row>
          {
            isMobile ?
              <List
                itemLayout="vertical"
                size="large"
                pagination={{
                  pageSize: 5,
                }}
                dataSource={this.props[resourceName]}
                renderItem={item => (
                  <List.Item
                    key={item[resource.primaryKeyName]}
                  >
                    <Card
                      className={'card-item'}
                      actions={mobileCardActions(item)}
                    >
                      <Row onClick={() => this.routeOrShowRender(resource, item)}>
                        <Col span={8} style={{textAlign: 'left', color: '#AE735D', fontSize: '16px'}}>{mainColumn.title}</Col>
                        <Col span={16} style={{textAlign: 'right', fontSize: '16px'}}>{item[mainColumn.dataIndex]}</Col>
                      </Row>
                    </Card>
                  </List.Item>
                )}
              />
              :
              <Table
                dataSource={this.props[resourceName]}
                columns={updatedColumns.filter(col => col.isTableColumn)}
                rowClassName="editable-row"
                rowKey={resource.primaryKeyName}
                pagination={{
                  position: "bottom",
                  hideOnSinglePage: true,
                  size: 10
                }}
                onRow={(record, rowIndex) => {
                  return {
                    onClick: event => {}, // click row
                    onDoubleClick: event => {
                      this.routeOrShowRender(resource, record);
                    }, // double click row
                    onContextMenu: event => {}, // right button click row
                    onMouseEnter: event => {}, // mouse enter row
                    onMouseLeave: event => {}, // mouse leave row
                  };
                }}
                size={"small"}
              />
          }
        </div>
        <Button
          htmlType="submit"
          className="login-form-button"
          shape='circle'
          onClick={() => {
            this.setState({
              recordToEdit: null,
              formAction: actionTypes.create
            });
            this.showEditDrawer();
          }}
          id={"add-btn"}
        >
          +
        </Button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {
    brands,
    companies,
    branches,
    products,
    manufacturers,
    product_categories,
    business_categories,
    users,
    clients
  } = state;

  return {
    brands,
    companies,
    branches,
    products,
    manufacturers,
    product_categories,
    business_categories,
    users,
    clients,

  };
}

export default Form.create()(withRouter(connect(mapStateToProps)(GenericTable)));
