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
import purchasesColumns from "../../config/columns/purchases";
import companyColumns from "../../config/columns/companies";
import branchColumns from "../../config/columns/branches";
import customerResource from "../../config/resources/customers";
import salesResource from "../../config/resources/sales";
import usersResource from "../../config/resources/users";
import productStocksResource from "../../config/resources/productStocks";
import purchasesResource from "../../config/resources/purchases";
import branchResource from "../../config/resources/branches";
import companyResource from "../../config/resources/companies";
import allResources from "../../config/resources";
import Api from "../../services/Api";
import GenericTable from "../GenericTable/GenericTable";
import BreadCrumbItem from '../BreadCrumbItem/BreadCrumbItem';
import BranchInfo from "./BranchInfo";

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
      stocks: null,
      company: null,
      routes: []
    }
  }

  componentDidMount() {
    const branchDetailUrl = `${window.location.hash.replace("#", '').replace('/details', '')}`;
    const branchUrlComponents = branchDetailUrl.split('/');

    const companyUrl = branchDetailUrl.split('/branches')[0];
    const companyId = companyUrl.split('/companies')[1];
    if (!this.state.company) {
      new Api(resource, {}, {url: companyUrl}).findOne()
        .then(companyDetails => {
          this.setState({company: companyDetails.data});
        });
    }
    
    if (!this.state.branchDetails) {
      new Api(resource, {}, {url: branchDetailUrl}).findOne(branchUrlComponents[branchUrlComponents.length - 1])
        .then(branchDetails => {
          this.setState({branchDetails: branchDetails.data});
        });
    }
  }

  async loadData(resourceName) {
    if (resourceName === 'purchases') {
      resourceName = 'product_stocks';
    }
    if (resourceName !== 'branch') {
      const url = `${window.location.hash.replace("#", '').replace('details', resourceName)}`;
      const resourceResponse = await new Api(resource, {}, {url}).index();
      const newState = {};
      newState[resourceName] = resourceResponse.data[resourceName];
      if (resourceName === 'product_stocks') {
        // update stock
        const stocks = [];
        for (let m = 0; m < resourceResponse.data[resourceName].length; m++) {
          const row = resourceResponse.data[resourceName][m];
          const existingStock = stocks.find(s => s.product === row.product);
          if (existingStock) {
            existingStock.quantity += row.quantity;
          } else {
            stocks.push({ product: row.product, quantity: row.quantity, sellingPrice: row.sellingPrice });
          }
      }
        this.setState({ stocks });
      }
      this.setState(newState);
    }
  }

  render() {
    const {company, branchDetails, products, customers, sales, employees, product_stocks, stocks} = this.state;
    return (
      <div>
        <Row className="title-row">
          <div style={{marginLeft: '20px'}}>
          { company ?
            <BreadCrumbItem record={company} columns={companyColumns} resource={companyResource} resourceName='companies' />
            : ''
          }
          { branchDetails ?
            <BreadCrumbItem record={branchDetails} columns={branchColumns} resource={branchResource} resourceName='branches' />
            : ''
          }
          </div>
        </Row>
        <Divider style={{marginTop: '20px'}} className={'table-hr'} />
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
                <BranchInfo  branchDetails={branchDetails}/>
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
          <TabPane tab="Purchases" key="purchases">
            {
              product_stocks ?
                <GenericTable resource={purchasesResource} columns={purchasesColumns} values={product_stocks || []} />
                : <Spin size="large" />
            }
          </TabPane>
          <TabPane tab="Stock" key="product_stocks">
            {
              stocks ?
                <GenericTable resource={productStocksResource} columns={productStocksColumns} values={stocks || []} />
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
