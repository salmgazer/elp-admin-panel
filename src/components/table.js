import React, {Component} from 'react';
import Api from '../services/Api.js'
import { Table, Input, InputNumber, Popconfirm, Form , Drawer, Button} from 'antd';

function onChange(pagination, filters, sorter, extra) {
    console.log('params', pagination, filters, sorter, extra);
}
const fields = new Api('products').index().then((res) => {
    return res.data.data;
});
console.log(fields);

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

const EditableContext = React.createContext();

class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableName: 'products',
            visible : false,
            productName : '',
            drawerSource : '',
            dataSource: [],
            editingKey: '',
        };

        this.showDrawer = (text , e) => {
            //console.log(text);
            this.setState({
                visible: true,
                productName : text
            });
            console.log(this.productName);

            new Api(this.state.tableName).findOne(this.state.productName).then((res) => {
                //this.setState({drawerSource : res.data.data });
                console.log(res.data.data);
            });
        };

        this.onClose = () => {
            this.setState({
                visible: false,
            });
        };

        this.columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                filters: this.filterData(this.state.dataSource)(i => i.name),
                /*// specify the condition of filtering result
                // here is that finding the name started with `value`
                onFilter: (value, record) => record.name.indexOf(value) === 0,
                sorter: (a, b) => a.name.length - b.name.length,
                sortDirections: ['descend'],*/
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
                key: 'manufacturerId',
                editable: true,
            },
            {
                title: 'Brand',
                dataIndex: 'brandId',
                key: 'brandId',
                editable: true,
            },
            {
                title: 'Categories',
                dataIndex: 'productCategoryId',
                key: 'productCategoryId',
                editable: true,
            },
            {
                title: 'Product group',
                dataIndex: 'productGroupId',
                key: 'productGroupId',
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

    componentDidMount() {
        new Api(this.state.tableName).index().then((res) => {
            this.setState({dataSource : res.data.data });
        });
    }

    filterData = data => formatter => data.map( item => ({
        text: formatter(item),
        value: formatter(item),
    }));


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

    getData = async () => {
        await new Api(this.state.tableName).index().then((res) => {
            this.setState({dataSource : res.data.data });
        });
    };

    deleteBrand(index){
        new Api(this.state.tableName).delete(index).then((res) => {
            this.setState({dataSource : res.data.data });
            window.location.reload(false);
        });
    }

    edit(key) {
        this.setState({ editingKey: key });
    }

    /*onChange(pagination, filters, sorter, extra) {
        console.log('params', pagination, filters, sorter, extra);
    }*/

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

        return (
            <div>
            <Drawer
                title={this.state.productName}
                placement="right"
                closable={false}
                onClose={this.onClose}
                visible={this.state.visible}
            >
            <p>{this.state.productName}</p>


            </Drawer>
                {console.log(this.state.dataSource)}
            <EditableContext.Provider value={this.props.form}>
                <Table
                    components={components}
                    dataSource={this.state.dataSource}
                    columns={columns}
                    rowClassName="editable-row"
                    /*pagination={{
                        onChange: this.cancel,
                    }}
                    onChange={onChange}*/
                />
            </EditableContext.Provider>
            </div>
        );
    }
}

const EditableFormTable = Form.create()(EditableTable);

export default EditableFormTable;