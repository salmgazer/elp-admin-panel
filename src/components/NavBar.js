import { Menu } from 'antd';
import {
  UsergroupAddOutlined,
  SettingOutlined,
  LogoutOutlined,
  ProfileOutlined,
  UserOutlined
} from '@ant-design/icons';
import React, {useState} from "react";
import {useAuth0} from "../react-auth0-spa";


const { SubMenu } = Menu;

const NavBar = (props) => {
  const [current, setCurrent] = useState('mail');
  const { isAuthenticated } = useAuth0();

  const handleClick = e => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  return (
    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal" style={{marginBottom: '50px', visibility: isAuthenticated ? 'visible' : 'hidden'}} >
      <Menu.Item key="mail" style={{fontSize: '20px'}}>
        <UsergroupAddOutlined />
        Accounts
      </Menu.Item>
      <Menu.Item key="setting:1" style={{fontSize: '20px'}}>Products</Menu.Item>
      <SubMenu
        title={
          <span className="submenu-title-wrapper" style={{fontSize: '20px'}}>
            <SettingOutlined />
            Product Metadata
          </span>
        }
      >
        <Menu.Item key="setting:2">Brands</Menu.Item>
        <Menu.Item key="setting:3">Manufacturers</Menu.Item>
        <Menu.Item key="setting:4">Product Categories</Menu.Item>
        <Menu.Item key="setting:5">Product Segments</Menu.Item>
      </SubMenu>
      <SubMenu
        title={
          <span className="submenu-title-wrapper">
            <UserOutlined/>
          </span>
        }
      >
        <Menu.Item key="setting:6"><ProfileOutlined />Profile</Menu.Item>
        <Menu.Item key="setting:7"><LogoutOutlined />Logout</Menu.Item>
      </SubMenu>
    </Menu>
  );
}

export default NavBar;


