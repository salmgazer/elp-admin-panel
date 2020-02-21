import React , {Component} from 'react';
import {Form, Icon, Input, Button, Row, Col, Typography, Layout, Breadcrumb, message} from 'antd';
import Api from "../services/Api";
const { Title } = Typography;
const { Header, Content, Footer, Sider } = Layout;

class Product extends Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {

                new Api('products').create(values).then((res) => {
                    message.success('Product : '+values+' has been successfully added!');
                });
                console.log('Received values of form: ', values);
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Content style={{ margin: '0 16px' , textAlign: 'left' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Classification</Breadcrumb.Item>
                    <Breadcrumb.Item>Brand</Breadcrumb.Item>
                </Breadcrumb>
            <Form onSubmit={this.handleSubmit} className="login-form">
                <Row gutter={8}>
                    <Col className="gutter-row" span={6}>
                        <div className="gutter-box">
                            <Form.Item label="Product Name">
                                {getFieldDecorator('pro_name', {
                                    rules: [{ required: false, message: 'Please input a value!' }],
                                })(
                                    <Input />,
                                )}
                            </Form.Item>
                        </div>
                    </Col>

                    <Col className="gutter-row" span={6}>
                        <div className="gutter-box">
                            <Form.Item label="Product Nickname">
                                {getFieldDecorator('descrip', {
                                    rules: [{ required: false, message: 'Please input a value!' }],
                                })(
                                    <Input />,
                                )}
                            </Form.Item>
                        </div>
                    </Col>

                    <Col className="gutter-row" span={6}>
                        <div className="gutter-box">
                            <Form.Item label="Cost Price">
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
                            <Form.Item label="Selling Price">
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
                            <Form.Item label="Weight">
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
                            <Form.Item label="Manufacturer">
                                {getFieldDecorator('manufact_id', {
                                    rules: [{ required: false, message: 'Please input a value!' }],
                                })(
                                    <Input />,
                                )}
                            </Form.Item>
                        </div>
                    </Col>

                    <Col className="gutter-row" span={6}>
                        <div className="gutter-box">
                            <Form.Item label="Category">
                                {getFieldDecorator('cat_id', {
                                    rules: [{ required: false, message: 'Please input a value!' }],
                                })(
                                    <Input />,
                                )}
                            </Form.Item>
                        </div>
                    </Col>

                    <Col className="gutter-row" span={6}>
                        <div className="gutter-box">
                            <Form.Item label="Brand Name">
                                {getFieldDecorator('brand_id', {
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
                            <Form.Item label="Group Name">
                                {getFieldDecorator('group_id', {
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
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Add Product
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Form>
            </Content>
        );
    }
}

const Products = Form.create({ name: 'normal_login' })(Product);

export default Products;