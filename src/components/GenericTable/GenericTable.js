import React from 'react';
import Api from '../../services/Api.js'
import {Table, Input, Popconfirm, Form, Button, Typography, Col, Row, PageHeader} from 'antd';
import {
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import './GenericTable.scss';
import ShowEditCreateForm from '../ShowEditCreateForm/ShowEditCreateForm';
import actionTypes from '../../config/actionTypes';
import {withRouter} from 'react-router-dom';


const {Title} = Typography;

class GenericTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableName: props.resource.resource,
      dataSource: props.dataSource,
      editRecord: false,
      recordToEdit: null,
      openCreateOrEditForm: false,
      routes: []
    };
    this.showEditDrawer = this.showEditDrawer.bind(this);
    this.closeCreateOrEditDrawer = this.closeCreateOrEditDrawer.bind(this);
    this.addNewRow = this.addNewRow.bind(this);
    this.replaceRow = this.replaceRow.bind(this);
    this.fetchAndsetDataSource = this.fetchAndsetDataSource.bind(this);
  }

  showEditDrawer = (record) => {
    this.setState({
      openCreateOrEditForm: true,
      recordToEdit: record
    });
  };

  closeCreateOrEditDrawer = () => {
    this.setState({
      openCreateOrEditForm: false,
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

  fetchAndsetDataSource() {
    new Api(this.props.resource).index().then((res) => {
      this.setState({dataSource : res.data[this.state.tableName]});
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

  componentDidMount() {
    const {recordToEdit} = this.state;

    this.addPathToRoute(recordToEdit)
    this.fetchAndsetDataSource();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.tableName !== this.props.resource.resource) {
      this.setState({
        tableName: this.props.resource.resource,
        dataSource: [],
        editRecord: false,
        recordToEdit: null,
        openCreateOrEditForm: false,
      });
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

  render() {
    const {columns, resource, history} = this.props;
    const resourceName = resource.resource;
    const resourceDisplayName = resource.displayName || resourceName;

    console.log("!!!!!!!!!!!!!!!!");
    console.log(resourceName);
    console.log("!!!!!!!!!!!!!!!!");

    let updatedColumns = Object.assign([], columns);
    const mainColumn = updatedColumns.find(column => column.mainColumn === true);
    mainColumn.render = (text, record) =>
      <b
        style={{ cursor: 'pointer'}}
        onClick={() => {
        if (!resource.child) {
          this.setState({
            formAction: actionTypes.show
          });
          this.showEditDrawer(record);
        } else {
          // add next path to routes
          this.addPathToRoute(record);
          history.push(`${resourceName}/${record[resource.primaryKeyName]}/${resource.child.resource}`);

          // render to next path
        }
      }}>{text}</b>;

    updatedColumns.push({
      title: 'Action',
      dataIndex: '',
      key: 'action',
      width: '100px',
      render: (text, record) => {
        const { editingKey } = this.state;
        return (
          <Row gutter={2}>
            <Col span={12}>
              <Button shape={"circle"} style={{backgroundColor: '#FFF8E8', borderColor: '#FFF8E8',  boxShadow: '0 2px 4px 0 grey'}}
                  onClick={async () => {
                    const freshRecord = await new Api(resource).findOne(record[resource.primaryKeyName]);
                    this.setState({
                      formAction: actionTypes.edit
                    });
                    this.showEditDrawer(freshRecord.data)
                  }}>
                <EditOutlined disabled={editingKey !== ''} style={{color: '#2F4858'}}/>
              </Button>
            </Col>
            <Col span={12}>
              <Popconfirm title="Sure to delete?" onConfirm={() => this.deleteItem(record[resource.primaryKeyName])}>
                <Button shape={"circle"} style={{borderColor: '#FFC1B4', backgroundColor: '#FFC1B4', boxShadow: '0 2px 4px 0 grey'}}>
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
          action={this.state.formAction}
          addNewRow={this.addNewRow}
          replaceRow={this.replaceRow}
        />
        <Row>
          <Col className="gutter-row" span={6}>
            <Title
              className='table-title'
              level={2}
              style={{
                marginLeft: '20px',
                textAlign: 'left',
                fontWeight: '600'
              }}>
              All {resourceDisplayName}
            </Title>
          </Col>
          <Col span={10}>
            {
              this.state.routes.length > 0 ?
                <PageHeader
                  onBack={() => null}
                  breadcrumb={{ routes: this.state.routes }}
                /> : ''
            }
          </Col>
          <Col style={{float: 'right' }} span={8}>
            <Button
              htmlType="submit"
              className="login-form-button btn-appearance"
              type="primary"
              icon="save"
              onClick={this.enterIconLoading}
              style={{marginRight: '10px'}}
            >
              Import {resourceDisplayName}
            </Button>
            <Button
              htmlType="submit"
              className="login-form-button btn-appearance"
              type="primary"
              icon="save"
              onClick={this.enterIconLoading}
              style={{marginRight: '10px', }}
            >
              Export {resourceDisplayName}
            </Button>
          </Col>
        </Row>
        <hr className='table-hr'/>
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
                <Input.Search size="large" placeholder="Search" />
              </div>
            </Col>
          </Form>
        </Row>
          <Table
            dataSource={this.state.dataSource}
            columns={updatedColumns}
            rowClassName="editable-row"
            rowKey={resource.primaryKeyName}
            pagination={{
              position: "bottom",
              size: '4'
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
