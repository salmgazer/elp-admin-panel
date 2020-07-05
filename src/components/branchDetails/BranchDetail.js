import React from 'react';
import {
  Col,
  Row,
  Divider,
  Collapse,
  Typography,
  Tabs,
  Spin,
  Skeleton,
  Card, Tag,
} from 'antd';
import {RightOutlined} from "@ant-design/icons";
import pluralize from "pluralize";
import resource from "../../config/resources/branches";
import productsResource from "../../config/resources/products";
import productColumns from "../../config/columns/products";
import customerColumns from "../../config/columns/customers";
import salesColumns from "../../config/columns/sales";
import usersColumns from "../../config/columns/users";
import productStocksColumns from "../../config/columns/productStocks";
import customerResource from "../../config/resources/customers";
import salesResource from "../../config/resources/sales";
import usersResource from "../../config/resources/users";
import productStocksResource from "../../config/resources/productStocks";
import allResources from "../../config/resources"
import Api from "../../services/Api";
import GenericTable from "../GenericTable/GenericTable";

const { Panel } = Collapse;
const {Title} = Typography;
const { TabPane } = Tabs;

const isMobile = window.innerWidth < 1000;

class BranchDetail extends React.Component {
  constructor(props) {
    super(props);

    let newState = this.initialState;
    if (!this.state || !this.state.routes) {
      newState = {...newState, ...{routes: []}};
    }

    console.log(props);
    this.state = newState;
  }

  get initialState() {
    return {
      tableName: resource.resource,
      editRecord: false,
      recordToEdit: null,
      parentRecordId: null,
      openCreateOrEditForm: false,
      searchValue: '',
      formAction: '',
      branchDetails: null,
      products: null,
      customers: null,
      sales: null,
      employees: null,
      product_stocks: null,
      routes: []
    }
  }

  componentDidMount() {
    const branchDetailUrl = `${window.location.hash.replace("#", '').replace('/details', '')}`;
    const branchUrlComponents = branchDetailUrl.split('/');
    if (!this.state.branchDetails) {
      new Api(resource, {}, {url: branchDetailUrl}).findOne(branchUrlComponents[branchUrlComponents.length - 1])
        .then(branchDetails => {
          this.setState({branchDetails: branchDetails.data});
        });
    }
  }

  async loadData(resourceName) {
    if (resourceName !== 'branch') {
      const url = `${window.location.hash.replace("#", '').replace('details', resourceName)}`;
      const resourceResponse = await new Api(resource, {}, {url}).index();
      const newState = {};
      newState[resourceName] = resourceResponse.data[resourceName];
      this.setState(newState);
    }
  }

  render() {
    const {branchDetails, products, customers, sales, employees, product_stocks} = this.state;
    return (
      <div>
        <Row className="title-row">
          <Col className="gutter-row" span={6}>
            <Title className={isMobile ? 'table-title-mobile' : 'table-title'}>
              Branch: <b style={{color: 'black'}}>{ branchDetails ? branchDetails.name : '' }</b>
            </Title>
          </Col>
        </Row>
        <Divider className={'table-hr'} />
        <div
          style={{
            marginLeft: '40px',
            marginRight: '40px'
          }}
        >
            <Row gutter={2} style={{marginBottom: '30px'}}>
              {
                this.state.routes.map(
                  route =>
                    <Col key={route.path} span={5}>
                      <Collapse
                        bordered={false}
                        className={'breadcrumb'}
                      >
                        <Panel
                          header={route.resource.displayName}
                          key="1"
                          className={'breadcrumb-panel'}
                        >
                          {
                            route.columns.filter(col => col.dataIndex !== route.resource.primaryKeyName || col.userBasedPrimaryKey).map(col =>
                              <Row key={col.dataIndex} gutter={4} style={{marginBottom: '10px', marginLeft: '20px'}}>
                                <Col span={8} style={{fontWeight: 'bolder'}}>{pluralize.singular(col.title)}</Col>
                                <Col span={16} style={{fontWeight: 'normal'}}>{
                                  // route.record[col.dataIndex]
                                  col.isForeignEntity ?
                                    route.record[col.resourceKey] ? route.record[col.resourceKey][allResources
                                      .find(r => r.resource === col.resource).mainColumnName] : ''
                                    : route.record[col.dataIndex]
                                }</Col>
                              </Row>
                            )
                          }
                          <Row gutter={2}>
                            <a href={route.path} className={'breadcrumb-link'}>
                              Go to <RightOutlined />
                            </a>
                          </Row>
                        </Panel>
                      </Collapse>
                    </Col>
                )
              }
            </Row>
        </div>
        <Tabs defaultActiveKey="1" onTabClick={async(key, event) => await this.loadData(key)}>
          <TabPane tab="Branch Details" key="branch">
            {
              branchDetails ?
                <div>
                  <Card
                    hoverable
                    style={{ width: 600, margin: '0 auto' }}
                  >
                    <Row gutter={16} style={{marginBottom: '20px'}}>
                      <Col span={8}><b>ID</b></Col>
                      <Col span={16}>
                        <Tag
                          style={{
                            color: '#007462',
                            cursor: 'pointer',
                            fontSize: '15px',
                            paddingBottom: '3px',
                            paddingTop: '3px',
                          }}>
                          {branchDetails.id}
                        </Tag>
                      </Col>
                    </Row>
                    <Row gutter={16} style={{marginBottom: '20px'}}>
                      <Col span={8}><b>Name</b></Col>
                      <Col span={16}>
                        <Tag
                          style={{
                            color: '#007462',
                            cursor: 'pointer',
                            fontSize: '15px',
                            paddingBottom: '3px',
                            paddingTop: '3px',
                          }}>
                          {branchDetails.name}
                        </Tag>
                      </Col>
                    </Row>
                    <Row gutter={16} style={{marginBottom: '20px'}}>
                      <Col span={8}><b>Location</b></Col>
                      <Col span={16}>
                        <Tag
                          style={{
                            color: '#007462',
                            cursor: 'pointer',
                            fontSize: '15px',
                            paddingBottom: '3px',
                            paddingTop: '3px',
                          }}>
                          {branchDetails.location}
                        </Tag>
                      </Col>
                    </Row>
                    <Row gutter={16} style={{marginBottom: '20px'}}>
                      <Col span={8}><b>GPS</b></Col>
                      <Col span={16}>
                        <Tag
                          style={{
                            color: '#007462',
                            cursor: 'pointer',
                            fontSize: '15px',
                            paddingBottom: '3px',
                            paddingTop: '3px',
                          }}>
                          {branchDetails.gps}
                        </Tag>
                      </Col>
                    </Row>
                    <Row gutter={16} style={{marginBottom: '20px'}}>
                      <Col span={8}><b>Phone</b></Col>
                      <Col span={16}>
                        <Tag
                          style={{
                            color: '#007462',
                            cursor: 'pointer',
                            fontSize: '15px',
                            paddingBottom: '3px',
                            paddingTop: '3px',
                          }}>
                          {branchDetails.phone}
                        </Tag>
                      </Col>
                    </Row>
                    <Row gutter={16} style={{marginBottom: '20px'}}>
                      <Col span={8}><b>WhatsApp Phone</b></Col>
                      <Col span={16}>
                        <Tag
                          style={{
                            color: '#007462',
                            cursor: 'pointer',
                            fontSize: '15px',
                            paddingBottom: '3px',
                            paddingTop: '3px',
                          }}>
                          {branchDetails.phone}
                        </Tag>
                      </Col>
                    </Row>
                    <Row gutter={16}  style={{marginBottom: '20px'}}>
                      <Col span={8}><b>Business Type</b></Col>
                      <Col span={16}>
                        <Tag
                          style={{
                            color: '#007462',
                            cursor: 'pointer',
                            fontSize: '15px',
                            paddingBottom: '3px',
                            paddingTop: '3px',
                          }}>
                          {branchDetails.type}
                        </Tag>
                      </Col>
                    </Row>
                    <Row gutter={16} style={{marginBottom: '20px'}}>
                      <Col span={8}><b>Created At</b></Col>
                      <Col span={16}>
                        <Tag
                          style={{
                            color: '#007462',
                            cursor: 'pointer',
                            fontSize: '15px',
                            paddingBottom: '3px',
                            paddingTop: '3px',
                          }}>
                          {new Date(branchDetails.created_at * 1000).toDateString().split('GMT')[0]}
                        </Tag>
                      </Col>
                    </Row>
                    <Row gutter={16} style={{marginBottom: '20px'}}>
                      <Col span={8}><b>Updated At</b></Col>
                      <Col span={16}>
                        <Tag
                          style={{
                            color: '#007462',
                            cursor: 'pointer',
                            fontSize: '15px',
                            paddingBottom: '3px',
                            paddingTop: '3px',
                          }}>
                          {new Date(branchDetails.updated_at * 1000).toDateString().split('GMT')[0]}
                        </Tag>
                      </Col>
                    </Row>
                  </Card>
                </div>
                : <Skeleton active />
            }
          </TabPane>
          <TabPane tab="Products" key="products">
            {
              products ?
                <GenericTable resource={productsResource} columns={productColumns} values={products || []} />
              : <Spin size="large" />
            }
          </TabPane>
          <TabPane tab="Stocks" key="product_stocks">
            {
              product_stocks ?
                <GenericTable resource={productStocksResource} columns={productStocksColumns} values={product_stocks || []} />
                : <Spin size="large" />
            }
          </TabPane>
          <TabPane tab="Customers" key="customers">
            {
              customers ?
                <GenericTable resource={customerResource} columns={customerColumns} values={customers || []} />
              : <Spin size="large" />
            }
          </TabPane>
          <TabPane tab="Sales" key="sales">
            {
              sales ?
                <GenericTable
                  resource={salesResource}
                  columns={salesColumns}
                  values={sales || []}
                />
                : <Spin size="large" />
            }
          </TabPane>
          <TabPane tab="Employees" key="employees">
            {
              employees ?
                <GenericTable resource={usersResource} columns={usersColumns} values={employees || []} />
                : <Spin size="large" />
            }
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default BranchDetail;
