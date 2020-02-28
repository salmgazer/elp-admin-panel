import React, {Component} from 'react';
import Api from '../services/Api.js'
import {Typography, Breadcrumb, Table, Input, InputNumber, Popconfirm, Form, Button, Row, Col} from 'antd';
import {withRouter} from 'react-router-dom';
import ProductDetails from "./productDetails";
import paths from "../utilities/paths";

 const {Title} = Typography;

const dataSource = [];

const data = async function fields(){
    await new Api('products').index().then((res) => {
        localStorage.setItem('products' , JSON.stringify(res.data.data)) ;
    });
};
data();

const EditableContext = React.createContext();

class EditableCell extends Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`,
                },
              ],
              initialValue: record[dataIndex],
            })(this.getInput())}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

const filterData = data => formatter => data.map( item => ({
    text: formatter(item),
    value: formatter(item)
}));

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
       tableName: 'products',
        drawerSource : '',
        productId : '',
       dataSource: JSON.parse(localStorage.getItem('products')),
        editingKey: '',
        searchText: '',
        searchedColumn: ''
      };

      this.showDrawer = (text , e) => {
          //console.log(text);
          this.setState({
              visible: true,
              productId : text
          });


      };

      this.onClose = () => {
          this.setState({
              visible: false,
          });

      };


      this.getColumnSearchProps = dataIndex => ({
          filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
              <div style={{ padding: 8 }}>
                  <Input
                      ref={node => {
                          this.searchInput = node;
                      }}
                      placeholder={`Search ${dataIndex}`}
                      value={selectedKeys[0]}
                      onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                      onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                      style={{ width: 188, marginBottom: 8, display: 'block' }}
                  />
                  <Button
                      type="primary"
                      onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                      icon={''}
                      size="small"
                      style={{ width: 90, marginRight: 8 }}
                  >
                      Search
                  </Button>
                  <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                      Reset
                  </Button>
              </div>
          ),

          onFilter: (value, record) =>
              record[dataIndex]
                  .toString()
                  .toLowerCase()
                  .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
              if (visible) {
                  setTimeout(() => this.searchInput.select());
              }
          },
      });

      this.handleSearch = (selectedKeys, confirm, dataIndex) => {
          confirm();
          this.setState({
              searchText: selectedKeys[0],
              searchedColumn: dataIndex,
          });
      };

      this.handleReset = clearFilters => {
          clearFilters();
          this.setState({ searchText: '' });
      };


    this.columns = [
        /*{
            title: 'Name',
            dataIndex: 'name',
            filters: filterData(this.state.dataSource)(i => i.name),
            sorter: (a, b) => a.name.length - b.name.length,
            render: text => <a onClick={this.showDrawer.bind(this,text)}>{text}</a>,
            editable: true,
        },*/
        {
            title: 'Image',
            dataIndex: '',
            render: (text, record) =>
                <a onClick={this.showDrawer.bind(this,record)}>
                    <img src={'https://elparah.store/admin/upload/no_image.png'} width={40} height={40} style={{borderRadius: '100%'}}></img>
                </a>

        },
        {
            title: 'Name',
            dataIndex: 'name',
            render: (text, record) =>
                <a onClick={this.showDrawer.bind(this,record)}>{record.name}</a>,
            editable: true,
            ...this.getColumnSearchProps('name'),

        },
      {
        title: 'Cost Price',
        dataIndex: 'costPrice',
        key: 'costPrice',
        editable: true,
      },
      {
        title: 'Selling Price',
        dataIndex: 'sellingPrice',
        key: 'sellingPrice',
        editable: true,
      },
      {
        title: 'Weight',
        dataIndex: 'weight',
        key: 'weight',
        editable: true,
      },
      {
        title: 'Manufacturers',
        dataIndex: 'manufacturerId',
        key: 'manufacturers',
        editable: true,
        ...this.getColumnSearchProps('manufacturerId'),
      },
      {
        title: 'Brand',
        dataIndex: 'brandId',
        key: 'brand',
        editable: true,
        ...this.getColumnSearchProps('brandId'),
      },
      {
        title: 'Categories',
        dataIndex: 'productCategoryId',
        key: 'categories',
        editable: true,
        ...this.getColumnSearchProps('productCategoryId'),

      },
      {
        title: 'Product group',
        dataIndex: 'productGroupId',
        key: 'productGroup',
        editable: true,
        ...this.getColumnSearchProps('productGroupId'),
      },
      {
        title: 'Edit',
        dataIndex: 'edit',
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <a
                    onClick={() => this.save(form, record.id)}
                    style={{ marginRight: 8 }}
                  >
                    Save
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.id)}>
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : (
            <a disabled={editingKey !== ''} onClick={() => this.edit(record.id)}  style={{ background: '#18acff' , padding: '5px 15px 5px 15px ' , width: '120px' , color: '#ffff' , borderRadius: '3px' }}>
              Edit
            </a>
          );
        },
      },
      {
        title: 'Delete',
        dataIndex: '',
        key: 'action',
        render: (text, record) =>
        this.state.dataSource.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => this.deleteBrand(record.id)}>
            <a>Delete</a>
          </Popconfirm>
        ) : null,
      },
    ];

    function onChange(pagination, filters, sorter, extra)
      {
          console.log('params', pagination, filters, sorter, extra);
    }
  }

  isEditing = record => record.id === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
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

        new Api(this.state.tableName).update(id, row).then((res) => {
          this.setState({dataSource : res.data.data });
          window.location.reload(false);
       });

      } else {

        
        newData.push(row);
        this.setState({ dataSource: newData, editingKey: '' });

        new Api(this.state.tableName).update(id, row).then((res) => {
          this.setState({dataSource : res.data.data });
          window.location.reload(false);
       });
      }
    });
  }
    componentDidMount() {
      new Api(this.state.tableName).index().then((res) => {
      this.setState({dataSource : res.data.data });
    });
  
  }
  
  deleteBrand(index){
    new Api(this.state.tableName).delete(index).then((res) => {
      this.setState({dataSource : res.data.data });
      window.location.reload(false);
    });
  }

  edit(key) {
    this.setState({ editingKey: key });
  }

  render() {
    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
    const { getFieldDecorator } = this.props.form;
    const {history} = this.props;
    return (
       <div>
          <content style={{ textAlign: 'left' }}>
            <Row gutter={8}>
              <Col className="gutter-row" span={12}>
                  <Title level={4}>View Products</Title>
              </Col>
              <Col className="gutter-row" span={12}>
                  <Button
                      size="medium"
                      htmlType="submit"
                      className="login-form-button"
                      type="primary"
                      icon="save"
                      onClick={() => history.push(paths.addProducts)}
                  >
                      Add Product
                  </Button>
                  {'   '}
                  <Button
                      size="medium"
                      htmlType="submit"
                      className="login-form-button"
                      type="primary"
                      icon="save"
                      onClick={this.enterIconLoading}
                  >
                      Import Products
                  </Button>
                  {'   '}
                  <Button
                      size="medium"
                      htmlType="submit"
                      className="login-form-button"
                      type="primary"
                      icon="save"
                      onClick={this.enterIconLoading}
                  >
                      Export Products
                  </Button>
              </Col>
            </Row>
               <hr />
              <Form className="login-form">
                  <Row gutter={8}>
                      <Col className="gutter-row" span={16}>



                      </Col>

                      <Col className="gutter-row" span={8}>
                          <div className="gutter-box">
                              <br />
                              <Input.Search size="large" placeholder="Search" enterButton />
                              <br /><br />
                          </div>
                      </Col>
                  </Row>
              </Form>


      <ProductDetails productId={this.state.productId} visible={this.state.visible} onClose={this.onClose}/>
      <EditableContext.Provider value={this.props.form}>
        <Table
          components={components}
          dataSource={this.state.dataSource}
          columns={columns}
          rowClassName="editable-row"
          /*pagination={{
            onChange: this.cancel,
          }}*/
          onChange={this.onChange}
        />
      </EditableContext.Provider>
          </content>
       </div>
    );
  }
}

const EditableFormTable = Form.create()(EditableTable);

export default withRouter(EditableFormTable);