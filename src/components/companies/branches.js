import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import Api from '../../services/Api.js';
import {
    Modal,
    Table,
    Input,
    InputNumber,
    Popconfirm,
    Form,
    Row,
    Col,
    Button,
    Typography,
    message,
    Tooltip,
    Select
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import paths from "../../utilities/paths";

const { Option } = Select;
const {Title} = Typography;
const dataSource = [];

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

class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableName: 'branches',
            companies: '',
            users: '',
            dataSource, editingKey: '',
            modal2Visible: false,
        };



        this.columns = [
            {
                title: 'Branch name',
                dataIndex: 'name',
                key: 'name',

                editable: true,
            },
            {
                title: 'Company',
                dataIndex: 'companyId',
                key: 'community',

            },
            {
                title: 'Community',
                dataIndex: 'community',
                key: 'community',

                editable: true,
            },
            {
                title: 'GPS',
                dataIndex: 'gps',
                key: 'gps',

                editable: true,
            },
            {
                title: 'Phone',
                dataIndex: 'phone',
                key: 'phone',

                editable: true,
            },
            {
                title: 'Owner',
                dataIndex: 'ownerId',
                key: 'owner',

            },
            {
                title: 'Edit',
                dataIndex: 'edit',
                width: 110,
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
                        <div>
                            <Button disabled={editingKey !== ''} onClick={() => this.edit(record.id)} type="primary" shape="circle" icon="edit" /><br />Edit
                        </div>
                    );
                },
            },
            {
                title: 'Delete',
                dataIndex: '',
                key: 'action',
                width: 80,
                render: (text, record) =>
                    this.state.dataSource.length >= 1 ? (
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.deleteBrand(record.id)}>
                            <Button type="primary" shape="circle" icon="delete" style={{background:"#ff4d4f",color:"#ffff",borderColor:"#ff4d4f"}} /><br />Delete
                        </Popconfirm>
                    ) : null,
            },
        ];
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', JSON.stringify(values));
                var createRecord = new Api(this.state.tableName).create(values);
                console.log(createRecord)


                message.success('Branch : '+JSON.stringify(values.name)+' has been successfully added!');


            }
        });

        new Api(this.state.tableName).index().then((res) => {
            this.setState({dataSource : res.data.data });
        });
    };

    setModal2Visible(modal2Visible){
        this.setState({ modal2Visible });

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
                    window.location.reload(true);
                });

            } else {


                newData.push(row);
                this.setState({ dataSource: newData, editingKey: '' });

                new Api(this.state.tableName).update(id, row).then((res) => {
                    this.setState({dataSource : res.data.data });
                    window.location.reload(true);
                });
            }
        });
    }
    componentDidMount() {
        new Api(this.state.tableName).index().then((res) => {
            this.setState({dataSource : res.data.data });
        });

        new Api('users').index().then((res) => {
            this.setState({users : res.data.data });
            //console.log(res.data.data);
        });

        new Api('companies').index().then((res) => {
            this.setState({companies : res.data.data });
            //console.log(res.data.data);
        });

    }

    componentDidUpdate() {
        new Api(this.state.tableName).index().then((res) => {
            this.setState({dataSource : res.data.data });
        });

    }

    deleteBrand(index){
        new Api(this.state.tableName).delete(index).then((res) => {
            this.setState({dataSource : res.data.data });
            //window.location.reload(false);
        });
    }

    edit(key) {
        this.setState({ editingKey: key });
    }

    render() {
        const [...companies] = this.state.companies;
        const [...users] = this.state.users;
        const { getFieldDecorator } = this.props.form;
        const {history} = this.props;
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

        return (
            <div>
                <Row gutter={8}>
                    <Col className="gutter-row" span={12}>
                        <Title level={4} style={{textAlign: 'left',textTransform: 'capitalize'}}>{this.state.tableName}</Title>
                    </Col>
                    <Col className="gutter-row" span={12} style={{textAlign: 'right'}}>
                        <Button
                            size="medium"
                            htmlType="submit"
                            className="login-form-button"
                            type="primary"
                            shape="round"
                            icon="plus"
                            onClick={() => this.setModal2Visible(true)}
                        >
                            Add New
                        </Button>
                        {/*{'   '}
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
                        </Button>*/}
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
                <EditableContext.Provider value={this.props.form}>
                    <Table
                        components={components}
                        dataSource={this.state.dataSource}
                        columns={columns}
                        rowClassName="editable-row"
                        pagination={{
                            onChange: this.cancel,
                        }}
                    />
                </EditableContext.Provider>

                <Modal
                    title="Add Branch"
                    centered
                    visible={this.state.modal2Visible}
                    onOk={() => this.setModal2Visible(false)}
                    onCancel={() => this.setModal2Visible(false)}
                    footer={null}
                >
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Row gutter={8}>
                            <Col className="gutter-row" span={24} style={{textAlign:'center'}}>
                                <div className="gutter-box">
                                    <Form.Item label="Company" style={{marginBottom:"0px"}}>
                                        {getFieldDecorator('companyId', {
                                            rules: [{ required: false, message: 'Please input a value!' }],
                                        })(

                                            <Select showSearch defaultValue="0" filterOption={(input, option) =>option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>

                                                {companies.map(company => <Option value={company.id}>{company.name}</Option>)}

                                            </Select>,
                                        )}
                                    </Form.Item>
                                </div>
                            </Col>

                            <Col className="gutter-row" span={24} style={{textAlign:'center'}}>
                                <div className="gutter-box">
                                    <Form.Item label="Branch Name" style={{marginBottom:"0px"}}>
                                        {getFieldDecorator('name', {
                                            rules: [{ required: false, message: 'Please input a value!' }],
                                        })(
                                            <Input allowClear />,
                                        )}
                                    </Form.Item>
                                </div>
                            </Col>

                            <Col className="gutter-row" span={24} style={{textAlign:'center'}}>
                                <div className="gutter-box">
                                    <Form.Item label="Owner" style={{marginBottom:"0px"}}>
                                        {getFieldDecorator('ownerId', {
                                            rules: [{ required: false, message: 'Please input a value!' }],
                                        })(
                                            <Select showSearch defaultValue="0" filterOption={(input, option) =>option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>

                                                {users.map(user => <Option value={user.userId}>{user.firstName}  {user.otherNames}</Option>)}

                                            </Select>,
                                        )}
                                    </Form.Item>
                                </div>
                            </Col>

                            <Col className="gutter-row" span={24} style={{textAlign:'center'}}>
                                <div className="gutter-box">
                                    <Form.Item label="Address" style={{marginBottom:"0px"}}>
                                        {getFieldDecorator('address', {
                                            rules: [{ required: false, message: 'Please input a value!' }],
                                        })(
                                            <Input allowClear />,
                                        )}
                                    </Form.Item>
                                </div>
                            </Col>

                            <Col className="gutter-row" span={24} style={{textAlign:'center'}}>
                                <div className="gutter-box">
                                    <Form.Item label="Community" style={{marginBottom:"0px"}}>
                                        {getFieldDecorator('community', {
                                            rules: [{ required: false, message: 'Please input a value!' }],
                                        })(
                                            <Input allowClear />,
                                        )}
                                    </Form.Item>
                                </div>
                            </Col>

                            <Col className="gutter-row" span={24} style={{textAlign:'center'}}>
                                <div className="gutter-box">
                                    <Form.Item label="GPS" style={{marginBottom:"0px"}}>
                                        {getFieldDecorator('gps', {
                                            rules: [{ required: false, message: 'Please input a value!' }],
                                        })(
                                            <Input allowClear />,
                                        )}
                                    </Form.Item>
                                </div>
                            </Col>

                            <Col className="gutter-row" span={24} style={{textAlign:'center'}}>
                                <div className="gutter-box">
                                    <Form.Item label="Phone" style={{marginBottom:"0px"}}>
                                        {getFieldDecorator('phone', {
                                            rules: [{ required: false, message: 'Please input a value!' }],
                                        })(
                                            <Input allowClear />,
                                        )}
                                    </Form.Item>
                                </div>
                            </Col>

                            <Col className="gutter-row" span={24} style={{textAlign:'center'}}>
                                <div className="gutter-box">
                                    <Form.Item label="Whatsapp Phone">
                                        {getFieldDecorator('whatsAppPhone', {
                                            rules: [{ required: false, message: 'Please input a value!' }],
                                        })(
                                            <Input allowClear />,
                                        )}
                                    </Form.Item>
                                </div>
                            </Col>
                        </Row>

                        <Row gutter={8}>
                            <Col className="gutter-row" span={24}>
                                <div className="gutter-box" style={{textAlign:'center'}}>
                                    <Button type="primary" htmlType="submit" className="login-form-button" shape="round" icon="save" size="large">
                                        Save
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </div>
        );
    }
}

const EditableFormTable = Form.create()(EditableTable);

export default withRouter(EditableFormTable);