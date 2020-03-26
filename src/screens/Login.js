import React, { Fragment} from "react";
import {Button, PageHeader} from 'antd';

import { useAuth0 } from "../react-auth0-spa";
import paths from "../utilities/paths";
import { withRouter } from 'react-router-dom';

const Login = (props) => {
  const {history} = props;
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  if(isAuthenticated) history.push(paths.products);
  return (
    <Fragment>
      {!isAuthenticated && (
        <div>
          <h2>El-Parah Admin Panel</h2>
          <Button
            id="qsLoginBtn"
            type='primary'
            onClick={() => loginWithRedirect({})}
          >
            Login
          </Button>
        </div>
      )}
    </Fragment>
  );
};

export default withRouter(Login);
