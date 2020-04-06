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
  notification
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import './GenericTable.scss';
import ShowEditCreateForm from '../ShowEditCreateForm/ShowEditCreateForm';
import actionTypes from '../../config/actionTypes';
import {withRouter} from 'react-router-dom';
import inputTypes from "../../config/inputTypes";
import XLSX from 'xlsx';

const {Title} = Typography;

class GenericTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.initialState;

    this.showEditDrawer = this.showEditDrawer.bind(this);
    this.closeCreateOrEditDrawer = this.closeCreateOrEditDrawer.bind(this);
    this.addNewRow = this.addNewRow.bind(this);
    this.replaceRow = this.replaceRow.bind(this);
    this.fetchAndsetDataSource = this.fetchAndsetDataSource.bind(this);
    this.routeOrShowRender = this.routeOrShowRender.bind(this);
    this.handleFileChosen = this.handleFileChosen.bind(this);
  }

  showEditDrawer = (record) => {
    this.setState({
      openCreateOrEditForm: true,
      recordToEdit: record,
      parentRecordId: record && record.parentId ?
        this.state.dataSource.find(item => item[this.props.resource.primaryKeyName] === record.parentId).id : null
    });
  };

  closeCreateOrEditDrawer = () => {
    this.setState({
      openCreateOrEditForm: false,
      recordToEdit: null,
      parentRecordId: null,
    });
  };

  addNewRow = (row) => {
    const newDatasource = [row].concat(this.state.dataSource);
    this.setState({
      dataSource: newDatasource
    });
  };

  replaceRow = (id, newRow) => {
    let newDatasource = this.state.dataSource.filter(row => row[this.props.resource.primaryKeyName] !== id);
    newDatasource = [newRow].concat(newDatasource);
    this.setState({
      dataSource: newDatasource
    });
  };

  removeRow = (itemId) => {
    const {resource} = this.props;
    this.setState({
      dataSource: this.state.dataSource.filter(row => row[resource.primaryKeyName] !== itemId)
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

  fetchAndsetDataSource(contentType) {
    const {searchValue} = this.state;
    const options = {};
    if (searchValue && searchValue.length > 0) {
      options.searchConfig = {
        search: searchValue
      }
    }

    if (contentType) {
      options.contentType = contentType;
    }
    new Api(this.props.resource, {}, options).index().then((res) => {
      if (!contentType) {
        this.setState({dataSource: res.data[this.state.tableName]});
      } else {
        const element = document.createElement('a');
        // <a href="data:application/octet-stream,field1%2Cfield2%0Afoo%2Cbar%0Agoo%2Cgai%0A">CSV Octet</a>
        element.setAttribute('href',
          `data:text/csv;charset=utf-8,${encodeURI(res.data)}`);
        console.log(res.data);
        element.setAttribute('download', `${this.props.resource.resource}-${new Date().toString().split('GMT')[0]}`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        element.remove();
      }
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
      dataSource: [],
      editRecord: false,
      recordToEdit: null,
      parentRecordId: null,
      openCreateOrEditForm: false,
      searchValue: '',
      routes: []
    }
  }

  componentDidMount() {
    const {recordToEdit} = this.state;

    this.addPathToRoute(recordToEdit)
    this.fetchAndsetDataSource();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.tableName !== this.props.resource.resource) {
      this.setState(this.initialState);
      this.fetchAndsetDataSource();
    }
  }

  async deleteItem(itemId){
    const deleted = await new Api(this.props.resource).delete(itemId);
    if (deleted.status === 200) {
      this.removeRow(itemId);
    }
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
    const {columns, resource} = this.props;
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
            console.log(column);
            return notification.error({
              message: 'File is invalid',
              description:
                `The file ${file.name} must have the column ${column.dataIndex}`,
            });
          }
        }

        const updatedDataSource = this.state.dataSource;

        const allFailedRows = [];
        for (const row of rows) {
          const newBrand = await new Api(resource).create(row);
          if (newBrand && newBrand.data) {
            updatedDataSource.push(newBrand.data);
          } else {
            allFailedRows.push(row);
          }
        }

        this.setState({
          dataSource: updatedDataSource
        });

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
    const {columns, resource, history} = this.props;
    const resourceName = resource.resource;
    const resourceDisplayName = resource.displayName || resourceName;


    let updatedColumns = Object.assign([], columns);
    const mainColumn = updatedColumns.find(column => column.mainColumn === true);
    const parentColumn =  updatedColumns.find(column => column.dataIndex === 'parentId');

    if (parentColumn && this.state.dataSource) {
      parentColumn.render = (text, record) => {
        if (record.parentId) {
          console.log(record.parentId);
          const parentRecord = this.state.dataSource.find(item => item[resource.primaryKeyName] === record.parentId);
          console.log(parentRecord);
          console.log("=================");
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
            record[updatedColumn.dataIndex] === null ? ''
              :
            <Tag
              style={{
                color: '#007462',
                cursor: 'pointer',
                fontSize: '15px',
                paddingBottom: '3px',
                paddingTop: '3px',
              }}>
              {record[updatedColumn.resourceKey].name}
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
        required: true,
        render: (text) => <i style={{ fontStyle: 'normal'}}>{new Date(text * 1000).toString().split('GMT')[0]}</i>,
        dataType: {
          type: inputTypes.date,
        }});
    }

    if (resource.showUpdatedAt) {
      updatedColumns.push({
        title: 'Updated At',
        dataIndex: 'updated_at',
        required: true,
        render: (text) => <i style={{ fontStyle: 'normal'}}>{new Date(text * 1000).toString().split('GMT')[0]}</i>,
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
      render: (text, record) => {
        const { editingKey } = this.state;
        return (
          <Row gutter={2}>
            <Col span={12}>
              <Button
                shape={"circle"}
                style={{
                  backgroundColor: '#FFF8E8',
                  borderColor: '#FFF8E8',
                  boxShadow: '0 2px 4px 0 grey'
                }}
                onClick={async () => {
                  const freshRecord = await new Api(resource).findOne(record[resource.primaryKeyName]);
                  this.setState({
                    formAction: actionTypes.edit
                  });
                  this.showEditDrawer(freshRecord.data)
                }}
              >
                <EditOutlined disabled={editingKey !== ''} style={{color: '#2F4858'}}/>
              </Button>
            </Col>
            <Col span={12}>
              <Popconfirm title={`Are you sure you want to delete ${record[resource.mainColumnName]}?`} onConfirm={() => this.deleteItem(record[resource.primaryKeyName])}>
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
            </Col>
          </Row>
        );
      }
    });

    return (
      <div>
        <ShowEditCreateForm
          onClose={this.closeCreateOrEditDrawer}
          editRecord={this.state.openCreateOrEditForm}
          columns={columns}
          resource={resource}
          record={this.state.recordToEdit}
          records={this.state.dataSource}
          parentRecordId={this.state.parentRecordId}
          action={this.state.formAction}
          addNewRow={this.addNewRow}
          replaceRow={this.replaceRow}
        />
        <Row>
          <Col className="gutter-row" span={9}>
            <Title className='table-title' level={2}>
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
          <Col style={{ textAlign: 'right', float: 'right', marginRight: '40px' }} span={6}>
            <input
              accept=".xls,.xlsx"
              id="file-import-button"
              type="file"
              style={{display: 'none'}}
              onChange={e => this.handleFileChosen(e)}
            />
            <Button
              htmlType="submit"
              className="btn-appearance"
              type="primary"
              icon="upload"
              onClick={async () => await triggerFileImportButton()}
              style={{marginRight: '10px', }}
            >
              Import
            </Button>
            <Button
              htmlType="submit"
              className="btn-appearance"
              type="primary"
              icon="download"
              onClick={async () => await this.fetchAndsetDataSource('text/csv')}
              style={{marginRight: '10px', }}
            >
              Export
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
            <Col className="gutter-row" span={6}>
              <div className="gutter-box search-bar-area">
                <Input.Search
                  size="large"
                  placeholder="Search"
                  onChange={e => {
                    this.setState({
                      searchValue: e.target.value
                    });
                  }}
                  onSearch={ async value => {
                    await this.fetchAndsetDataSource();
                  }}

                  onPressEnter={ async e => {
                    await this.fetchAndsetDataSource();
                  }}

                  onPaste={async e => {
                    await this.fetchAndsetDataSource();
                  }}
                />
              </div>
            </Col>
          </Form>
        </Row>
          <Table
            dataSource={this.state.dataSource}
            columns={updatedColumns.filter(col => col.dataIndex !== resource.primaryKeyName)}
            rowClassName="editable-row"
            rowKey={resource.primaryKeyName}
            pagination={{
              position: "bottom",
              size: '4'
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

export default Form.create()(withRouter(GenericTable));
