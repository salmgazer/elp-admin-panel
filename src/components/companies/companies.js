import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import Api from '../../services/Api.js';
import {Table, Input, InputNumber, Popconfirm, Form, Row, Col, Button , Typography} from 'antd';
import paths from "../../utilities/paths";

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
            tableName: 'companies',
            dataSource, editingKey: ''
        };
        this.columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',

                editable: true,
            },
            {
                title: 'Description',
                dataIndex: 'description',
                key: 'description',

                editable: true,
            },
            {
                title: 'Business Category',
                dataIndex: 'businessCategoryId',
                key: 'businessCategoryId',

                editable: true,
            },
            {
                title: 'User',
                dataIndex: 'userId',
                key: 'userId',

                editable: true,
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
                        <a disabled={editingKey !== ''} onClick={() => this.edit(record.id)}>
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
                <Row gutter={8}>
                    <Col className="gutter-row" span={12}>
                        <Title level={4} style={{textAlign: 'left' , textTransform: 'Capitalize'}}>{this.state.tableName}</Title>
                    </Col>
                    <Col className="gutter-row" span={12} style={{textAlign: 'right'}}>
                        <Button
                            size="medium"
                            htmlType="submit"
                            className="login-form-button"
                            type="primary"
                            icon="save"
                            onClick={() => history.push(paths.addProducts)}
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
            </div>
        );
    }
}

const EditableFormTable = Form.create()(EditableTable);

export default EditableFormTable;