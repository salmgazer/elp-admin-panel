import { Menu } from 'antd';
import {
  UsergroupAddOutlined,
  SettingOutlined,
  LogoutOutlined,
  ProfileOutlined,
  UserOutlined
} from '@ant-design/icons';
import React, {useState} from "react";
import {useAuth0} from "../../react-auth0-spa";
import paths from "../../utilities/paths";
import { withRouter } from 'react-router-dom';
import './navbar.scss';



const { SubMenu } = Menu;

const NavBar = (props) => {
  const [current, setCurrent] = useState('mail');
  const { isAuthenticated, logout } = useAuth0();
  const {history} = props;

  const handleClick = e => {
    setCurrent(e.key);
  };

  return (
    <Menu id="navbar-area" onClick={handleClick} selectedKeys={[current]} mode="horizontal" style={{visibility: isAuthenticated ? 'visible' : 'hidden'}} >
      <Menu.Item key="mail" style={{fontSize: '20px'}} onClick={() => history.push(paths.accounts)} className='nav-item'>
        <UsergroupAddOutlined />
        Accounts
      </Menu.Item>
      <Menu.Item key="products" style={{fontSize: '20px'}} onClick={() => history.push(paths.products)} className='nav-item'>Products</Menu.Item>
      <SubMenu
        className='nav-item'
        title={
          <span className="submenu-title-wrapper" style={{fontSize: '20px'}}>
            <SettingOutlined />
            Product Metadata
          </span>
        }
      >
        <Menu.Item key="brands" className='nav-sub-item' onClick={() => history.push(paths.brands)}>Brands</Menu.Item>
        <Menu.Item key="manufacturers" className='nav-sub-item' onClick={() => history.push(paths.manufacturers)}>Manufacturers</Menu.Item>
        <Menu.Item key="product_categories" className='nav-sub-item' onClick={() => history.push(paths.productCategories)}>Product Categories</Menu.Item>
        <Menu.Item key="product_segments" className='nav-sub-item'>Product Segments</Menu.Item>
      </SubMenu>
      <SubMenu
        className='nav-item'
        title={
          <span className="submenu-title-wrapper">
            <UserOutlined/>
          </span>
        }
      >
        <Menu.Item key="profile" className='nav-sub-item'><ProfileOutlined />Profile</Menu.Item>
        <Menu.Item key="logout" className='nav-sub-item' onClick={() => logout({})}><LogoutOutlined />Logout</Menu.Item>
      </SubMenu>
    </Menu>
  );
}

export default withRouter(NavBar);


