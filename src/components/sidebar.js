import React , {Component} from 'react';
import { Layout, Menu, Breadcrumb, Icon , Typography} from 'antd';
import '../assets/css/sidebar.scss';
import Create from "./create";
import Products from "./product"
import EditableFormTable from "./table";
import NestedTable from "./table2";

const { Title } = Typography;
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;



class Sidebar extends Component {
    state = {
        collapsed: false,
    };

    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
    };

    render() {
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
                    <div className="logo" />
                    <Title level={3} style={{ color: '#ffff' , paddingTop : '5px'}}>EL-PARAH</Title>
                    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" style={{ textAlign: 'left'}}>
                        <SubMenu
                            key="sub1"
                            title={
                                <span>
                  <Icon type="pie-chart" />
                  <span>Classification</span>
                </span>
                            }
                        >
                            <Menu.Item key="1">Add Product</Menu.Item>
                            <Menu.Item key="2">Add product Bar Code</Menu.Item>
                            <Menu.Item key="3">View products</Menu.Item>
                            <Menu.Item key="4">Add group</Menu.Item>
                            <Menu.Item key="4">View groups</Menu.Item>
                            <Menu.Item key="5">Add manufacturer</Menu.Item>
                            <Menu.Item key="6">View manufacturers</Menu.Item>
                            <Menu.Item key="7">Add brand</Menu.Item>
                            <Menu.Item key="8">View brand</Menu.Item>
                            <Menu.Item key="9">Add category</Menu.Item>
                            <Menu.Item key="10">View category</Menu.Item>
                            <Menu.Item key="11">Add segment</Menu.Item>
                            <Menu.Item key="12">View segment</Menu.Item>
                            <Menu.Item key="13">Copy products</Menu.Item>
                            <Menu.Item key="14">Add products into store</Menu.Item>
                            <Menu.Item key="15">Import products</Menu.Item>
                            <Menu.Item key="16">Assign product to storetype</Menu.Item>


                        </SubMenu>

                        <SubMenu
                            key="sub2"
                            title={
                                <span>
                  <Icon type="file" />
                  <span>Images</span>
                </span>
                            }
                        >
                            <Menu.Item key="17">View product images</Menu.Item>
                            <Menu.Item key="18">Add images</Menu.Item>
                            <Menu.Item key="19">Remove images</Menu.Item>
                        </SubMenu>

                        <SubMenu
                            key="sub3"
                            title={
                                <span>
                  <Icon type="desktop" />
                  <span>Warehouse</span>
                </span>
                            }
                        >
                            <Menu.Item key="6">Warehouse products</Menu.Item>
                            <Menu.Item key="8">Delete warehouse quantity</Menu.Item>
                            <Menu.Item key="8">Warehouse stock movement</Menu.Item>
                        </SubMenu>

                        <SubMenu
                            key="sub4"
                            title={
                                <span>
                  <Icon type="file" />
                  <span>Store Management</span>
                </span>
                            }
                        >
                            <Menu.Item key="6">Add store</Menu.Item>
                            <Menu.Item key="8">Add branch</Menu.Item>
                            <Menu.Item key="8">View stores</Menu.Item>
                            <Menu.Item key="6">Add store type</Menu.Item>
                            <Menu.Item key="8">View store type</Menu.Item>
                            <Menu.Item key="8">Reset store</Menu.Item>
                            <Menu.Item key="6">Clean store</Menu.Item>
                            <Menu.Item key="8">Store members</Menu.Item>
                            <Menu.Item key="8">Add employees</Menu.Item>
                            <Menu.Item key="8">View employees</Menu.Item>
                            <Menu.Item key="8">Stores map</Menu.Item>
                        </SubMenu>

                        <SubMenu
                            key="sub5"
                            title={
                                <span>
                  <Icon type="team" />
                  <span>View</span>
                </span>
                            }
                        >
                            <Menu.Item key="sales">Transaction sales</Menu.Item>
                            <Menu.Item key="sales2">Transaction sales 2</Menu.Item>
                            <Menu.Item key="daily_sales">Daily sales</Menu.Item>
                            <Menu.Item key="edit_sales">Edit sales date</Menu.Item>
                            <Menu.Item key="del_sales">Delete sales</Menu.Item>
                            <Menu.Item key="deleted_sales">Deleted sales</Menu.Item>
                            <Menu.Item key="purchases">Transaction purchases</Menu.Item>
                            <Menu.Item key="purchases2">Transaction purchases 2</Menu.Item>
                            <Menu.Item key="daily_purchases">Daily purchases</Menu.Item>
                            <Menu.Item key="edit_purchases">Edit purchases date</Menu.Item>
                            <Menu.Item key="del_purchases">Delete purchases</Menu.Item>
                            <Menu.Item key="deleted_purchases">Deleted purchases</Menu.Item>
                            <Menu.Item key="pro_quantity">Product quantity in store</Menu.Item>
                            <Menu.Item key="store_value">Total value in store</Menu.Item>
                        </SubMenu>

                        <SubMenu
                            key="sub6"
                            title={
                                <span>
                  <Icon type="file" />
                  <span>Reports</span>
                </span>
                            }
                        >
                            <Menu.Item key="6">Sales</Menu.Item>
                            <Menu.Item key="6">Purchases</Menu.Item>
                            <Menu.Item key="6">Invoice list</Menu.Item>
                            <Menu.Item key="6">Audit list</Menu.Item>
                            <Menu.Item key="6">Sales list</Menu.Item>
                            <Menu.Item key="6">Purchases list</Menu.Item>
                            <Menu.Item key="6">Stock progress</Menu.Item>
                            <Menu.Item key="6">Stock value</Menu.Item>
                            <Menu.Item key="6">Store report</Menu.Item>
                            <Menu.Item key="6">Audit report</Menu.Item>
                        </SubMenu>

                        <SubMenu
                            key="sub7"
                            title={
                                <span>
                  <Icon type="file" />
                  <span>Payments</span>
                </span>
                            }
                        >
                            <Menu.Item key="6">Make payment</Menu.Item>
                            <Menu.Item key="6">View payments</Menu.Item>
                        </SubMenu>

                        <SubMenu
                            key="sub8"
                            title={
                                <span>
                  <Icon type="team" />
                  <span>User Activity</span>
                </span>
                            }
                        >
                            <Menu.Item key="6">Dashboard</Menu.Item>
                            <Menu.Item key="6">User login / Out</Menu.Item>
                            <Menu.Item key="6">User activity (Admin)</Menu.Item>
                            <Menu.Item key="6">User activity (Store)</Menu.Item>
                            <Menu.Item key="6">Users</Menu.Item>
                            <Menu.Item key="6">Admins</Menu.Item>
                        </SubMenu>

                    </Menu>
                </Sider>
                <Layout>
                    <Header style={{ background: '#fff', padding: 0 }} />
                    <Content style={{ margin: '0 16px' , textAlign: 'left' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item>Classification</Breadcrumb.Item>
                            <Breadcrumb.Item>Brand</Breadcrumb.Item>
                        </Breadcrumb>
                        <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                            <Create/>

                        </div>

                        <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                            <Products />

                        </div>

                        <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                            <NestedTable/>

                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Elparah ©2018</Footer>
                </Layout>
            </Layout>
        );
    }
};

export default Sidebar;