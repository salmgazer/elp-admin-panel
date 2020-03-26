import React from 'react';
import EditableFormTable from "../../components/tableProduct";
import {useAuth0} from "../../react-auth0-spa";
import { withRouter } from 'react-router-dom';
import paths from "../../utilities/paths";

const Products = (props) => {
  const {history} = props;
  const { isAuthenticated, user} = useAuth0();
  console.log(user);
  // @todo, convert this line into a provider for all screens, expect Login
  if(!isAuthenticated) history.push(paths.login);
  return (
    <div>
      <EditableFormTable />
    </div>
  );
};

export default withRouter(Products);
