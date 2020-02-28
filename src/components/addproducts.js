import React , {Component} from 'react';
import {Form, Icon, Input, Button, Row, Col, Typography, Layout, Breadcrumb, message , Select} from 'antd';
import Api from "../services/Api";
import axios from "axios";
const { Title } = Typography;
const { Header, Content, Footer, Sider } = Layout;
const { Option } = Select;

class Product extends Component {
    state = {
        tableName : 'products',
        brands : '',
        manufacturers : '' ,
        categories : '' ,
        groups : '',
        loading: false,
        iconLoading: false,

    };

    enterIconLoading = () => {
        this.setState({ iconLoading: true });
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {

                new Api('products').create(values).then((res) => {
                    message.success('Product has been successfully added!');

                    window.location.href = './';
                });



                console.log('Received values of form: ', values);
            }
        });
    };

    componentDidMount() {
        new Api('brands').index().then((res) => {
            this.setState({brands : res.data.data });
            //console.log(res.data.data);
        });

        new Api('product_groups').index().then((res) => {
            this.setState({groups : res.data.data });
            //console.log(res.data.data);
        });

        new Api('product_categories').index().then((res) => {
            this.setState({categories : res.data.data });
            //console.log(res.data.data);
        });

        new Api('manufacturers').index().then((res) => {
            this.setState({manufacturers : res.data.data });
            //console.log(res.data.data);
        });


    };

    render() {
        const [...brands] = this.state.brands;
        const [...groups] = this.state.groups;
        const [...categories] = this.state.categories;
        const [...manufacturers] = this.state.manufacturers;
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
            <Content style={{ margin: '0 16px' , textAlign: 'left' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Classification</Breadcrumb.Item>
                    <Breadcrumb.Item>Products</Breadcrumb.Item>
                </Breadcrumb>
                <Title level={4}>Add Product</Title><br />
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <Row gutter={8}>
                        <Col className="gutter-row" span={6}>
                            <div className="gutter-box">
                                <Form.Item label="Product Name" hasFeedback>
                                    {getFieldDecorator('name', {
                                        rules: [{ required: true, message: 'Please input a value!' }],
                                    })(
                                        <Input />,
                                    )}
                                </Form.Item>
                            </div>
                        </Col>

                        <Col className="gutter-row" span={6}>
                            <div className="gutter-box">
                                <Form.Item label="Product Nickname" hasFeedback>
                                    {getFieldDecorator('description', {
                                        rules: [{ required: false, message: 'Please input a value!' }],
                                    })(
                                        <Input />,
                                    )}
                                </Form.Item>
                            </div>
                        </Col>

                        <Col className="gutter-row" span={6}>
                            <div className="gutter-box">
                                <Form.Item label="Cost Price" hasFeedback>
                                    {getFieldDecorator('costPrice', {
                                        rules: [{ required: false, message: 'Please input a value!' }],
                                    })(
                                        <Input />,
                                    )}
                                </Form.Item>
                            </div>
                        </Col>

                        <Col className="gutter-row" span={6}>
                            <div className="gutter-box">
                                <Form.Item label="Selling Price" hasFeedback>
                                    {getFieldDecorator('sellingPrice', {
                                        rules: [{ required: false, message: 'Please input a value!' }],
                                    })(
                                        <Input />,
                                    )}
                                </Form.Item>
                            </div>
                        </Col>
                    </Row>
                    <Row gutter={8}>
                        <Col className="gutter-row" span={6}>
                            <div className="gutter-box">
                                <Form.Item label="Weight" hasFeedback>
                                    {getFieldDecorator('weight', {
                                        rules: [{ required: false, message: 'Please input a value!' }],
                                    })(
                                        <Input />,
                                    )}
                                </Form.Item>
                            </div>
                        </Col>

                        <Col className="gutter-row" span={6}>
                            <div className="gutter-box">
                                <Form.Item label="Manufacturer" hasFeedback>
                                    {getFieldDecorator('manufacturerId', {
                                        rules: [{ required: true, message: 'Please select a manufacturer!' }],
                                    })(
                                        <Select showSearch defaultValue="0" filterOption={(input, option) =>option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>

                                            {manufacturers.map(manufacturer => <Option value={manufacturer.id}>{manufacturer.name}</Option>)}

                                        </Select>,
                                    )}
                                </Form.Item>
                            </div>
                        </Col>

                        <Col className="gutter-row" span={6}>
                            <div className="gutter-box">
                                <Form.Item label="Category" hasFeedback>
                                    {getFieldDecorator('productCategoryId', {
                                        rules: [{ required: true, message: 'Please select a category!' }],
                                    })(
                                        <Select showSearch defaultValue="0" filterOption={(input, option) =>option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>

                                            {categories.map(category => <Option value={category.id}>{category.name}</Option>)}

                                        </Select>,
                                    )}
                                </Form.Item>
                            </div>
                        </Col>

                        <Col className="gutter-row" span={6}>
                            <div className="gutter-box">
                                <Form.Item label="Brand Name" hasFeedback>
                                    {getFieldDecorator('brandId', {
                                        rules: [{ required: true, message: 'Please select a brand!' }],
                                    })(
                                        <Select showSearch defaultValue="0" filterOption={(input, option) =>option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>

                                            {brands.map(brand => <Option value={brand.id}>{brand.name}</Option>)}

                                        </Select>,
                                    )}
                                </Form.Item>
                            </div>
                        </Col>
                    </Row>
                    <Row gutter={8}>
                        <Col className="gutter-row" span={6}>
                            <div className="gutter-box">
                                <Form.Item label="Group Name" hasFeedback>
                                    {getFieldDecorator('productGroupId', {
                                        rules: [{ required: true, message: 'Please select a group!' }],
                                    })(
                                        <Select showSearch defaultValue="0" filterOption={(input, option) =>option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>

                                            {groups.map(group => <Option value={group.id}>{group.name}</Option>)}

                                        </Select>,
                                    )}
                                </Form.Item>
                            </div>
                        </Col>

                        <Col className="gutter-row" span={6}>
                            <div className="gutter-box">
                                <Form.Item label="Barcode" hasFeedback>
                                    {getFieldDecorator('barcode', {
                                        rules: [{ required: false, message: 'Please input a value!' }],
                                    })(
                                        <Input />,
                                    )}
                                </Form.Item>
                            </div>
                        </Col>

                    </Row>
                    <Row gutter={8}>
                        <Col className="gutter-row" span={6}>
                            <div className="gutter-box">
                                <Button
                                    size="large"
                                    htmlType="submit"
                                    className="login-form-button"
                                    type="primary"
                                    icon="save"
                                    loading={this.state.iconLoading}
                                    onClick={this.enterIconLoading}
                                >
                                    Add Product
                                </Button>

                            </div>
                        </Col>
                    </Row>
                </Form>
            </Content>
            </div>
        );
    }
}

const Products = Form.create({ name: 'normal_login' })(Product);

export default Products;