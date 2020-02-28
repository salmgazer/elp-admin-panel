import React , {Component} from 'react';
import {Form, Icon, Input, Button, Row, Col, Typography, Layout, Breadcrumb, message} from 'antd';
import Api from "../services/Api";
const { Title } = Typography;
const { Header, Content, Footer, Sider } = Layout;

class addCategory extends Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {

                new Api('product_categories').create(values).then((res) => {
                    message.success('Category : '+JSON.stringify(values.name)+' has been successfully added!');
                });
                console.log('Received values of form: ', JSON.stringify(values));
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Content style={{ margin: '0 16px' , textAlign: 'left' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Classification</Breadcrumb.Item>
                    <Breadcrumb.Item>Category</Breadcrumb.Item>
                </Breadcrumb>
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <Row gutter={8}>
                        <Col className="gutter-row" span={12}>
                            <div className="gutter-box">
                                <Form.Item label="Category Name">
                                    {getFieldDecorator('name', {
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
                                    Add Category
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </Content>
        );
    }
}

const Categories = Form.create({ name: 'normal_login' })(addCategory);

export default Categories;