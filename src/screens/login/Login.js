import React, { Fragment} from "react";
import {Button, Row, Col, Typography} from 'antd';
import './login.scss';
import { useAuth0 } from "../../react-auth0-spa";
import paths from "../../utilities/paths";
import { withRouter } from 'react-router-dom';
import Logo from '../../assets/img/el-parah.png';


const { Title } = Typography;

const Login = (props) => {
  const {history} = props;
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  if(isAuthenticated) history.push(paths.users);
  return (
    <Fragment>
      {!isAuthenticated && (
        <Row id="login-card">
          <Col span={24} id="logo-area">
            <img id="logo" className="img-responsive" src={Logo} alt={'Elparah Logo'}/>
          </Col>
          <Col span={24}>
            <Title id="home-page-title">Admin Panel</Title>
            <Button
              id="qsLoginBtn"
              onClick={() => loginWithRedirect({})}
            >
              Login
            </Button>
          </Col>
        </Row>
      )}
    </Fragment>
  );
};

export default withRouter(Login);
