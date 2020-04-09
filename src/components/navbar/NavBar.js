import { Menu, Avatar } from 'antd';
import {LogoutOutlined, ProfileOutlined} from '@ant-design/icons';
import React, {useState} from "react";
import {useAuth0} from "../../react-auth0-spa";
import paths from "../../utilities/paths";
import { withRouter } from 'react-router-dom';
import './navbar.scss';
// import resources from '../../config/resources';
import LocalInfo from "../../services/LocalInfo";



const { SubMenu } = Menu;

const NavBar = (props) => {
  const [current, setCurrent] = useState('accounts');
  const { isAuthenticated, logout } = useAuth0();
  const {history} = props;

  const handleClick = e => {
    setCurrent(e.key);
  };

  const routeTo = (path) => {
    history.push(path);
  };

  if (!isAuthenticated && window.location.hash !== '#/') {
    logout();
  }

  /*
  if (window.location.hash !== '#/' && current !== window.location.hash.replace('#/', '').split('/')[0]) {
    setCurrent(window.location.replace('#/', '').split('/')[0]);
  }
  */

  /*
  const currentPathElements = window.location.hash.replace("#",'').split('/');
  const resourceNames = resources.map(r => r.resource);
  for (let m = currentPathElements.length - 1; m >= 0; m--) {
    const existingPathElement = resourceNames.find(rn => rn === currentPathElements[m])
    if (existingPathElement) {
      console.log(existingPathElement);
      setCurrent(existingPathElement);
      break;
    }
  }
  */

  return (
    <Menu id="navbar-area" onClick={handleClick} selectedKeys={[current]} mode="horizontal" style={{visibility: isAuthenticated ? 'visible' : 'hidden'}} >
      <Menu.Item key="users" style={{fontSize: '20px'}} onClick={() => routeTo(paths.users)} className='nav-item'>
        Accounts
      </Menu.Item>
      <Menu.Item key="products" style={{fontSize: '20px'}} onClick={() => routeTo(paths.products)} className='nav-item'>Products</Menu.Item>
      <SubMenu
        className='nav-item'
        title={
          <span className="submenu-title-wrapper" style={{fontSize: '20px'}}>
            Product Metadata
          </span>
        }
      >
        <Menu.Item key="brands" className='nav-sub-item' onClick={() => routeTo(paths.brands)}>Brands</Menu.Item>
        <Menu.Item key="manufacturers" className='nav-sub-item' onClick={() => routeTo(paths.manufacturers)}>Manufacturers</Menu.Item>
        <Menu.Item key="product_categories" className='nav-sub-item' onClick={() => routeTo(paths.product_categories)}>Product Categories</Menu.Item>
        <Menu.Item key="product_segments" className='nav-sub-item' onClick={() => routeTo(paths.product_segments)}>Product Segments</Menu.Item>
      </SubMenu>
      <SubMenu
        className='nav-item'
        title={
          <span className="submenu-title-wrapper" style={{fontSize: '20px'}}>
            Others
          </span>
        }
      >
        <Menu.Item key="business_category" className='nav-sub-item' onClick={() => routeTo(paths.business_categories)}>Business Categories</Menu.Item>
        <Menu.Item key="customers" className='nav-sub-item' onClick={() => routeTo(paths.customers)}>Customers</Menu.Item>
      </SubMenu>
      <SubMenu
        className='nav-item'
        title={
          <span className="submenu-title-wrapper" style={{fontSize: '30px'}}>
            <Avatar size={"large"} src={LocalInfo.userPicture} />
          </span>
        }
      >
        <Menu.Item key="profile" className='nav-sub-item'><ProfileOutlined />Profile</Menu.Item>
        <Menu.Item key="logout" className='nav-sub-item' onClick={() => logout({})}><LogoutOutlined />Logout</Menu.Item>
      </SubMenu>
    </Menu>
  );
};

export default withRouter(NavBar);


