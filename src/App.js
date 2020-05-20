import React from 'react';
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import paths from "./utilities/paths";
import './App.scss';
import { useAuth0 } from "./react-auth0-spa";
import NavBar from './components/navbar/NavBar';
import GenericTable from './components/GenericTable/GenericTable';
import resources from './config/resources';
import Loading from "./components/Loading";
import Login from "./screens/login/Login";
import allColumns from "./config/columns";
import BranchDetail from "./components/branchDetails/BranchDetail";

const {appName} = require('../package.json');

function NoMatch() {
  return (
    <div style={{backgroundColor: 'red'}}>
      <button type="primary" onClick={() => (window.location.href = "/")}>
        Back Home
      </button>
    </div>
  );
}


function setPageBackground(backgroundColor = "red") {
  document.body.style.backgroundImage = "none";
  document.body.style.backgroundColor = backgroundColor;
}

const App = () => {
  const { loading } = useAuth0();

  if (loading) {
    return <Loading />;
  }

  const setTitle = (title) => {
    document.title = title;
  };

  return (
    <div className="App">
      <div>
        <Router>
          <NavBar/>
          <Switch>
            <Route
              exact
              path={paths.login}
              render={() => {
                setPageBackground();
                setTitle(`Login | ${appName}`);
                return <Login />;
              }}
            />
            <Route
              exact
              path={'/'}
              render={() => {
                setTitle(`Login | ${appName}`);
                return <Login />;
              }}
            />
            <Route
              exact
              path={paths.branch_details}
              render={() => {
                setTitle(`Branch Details | ${appName}`);
                return <BranchDetail/>;
              }}
            />

            {
              resources.filter(r => r.isGeneric === true && r.isReady === true).map(resource => {
                const resourceName = resource.resource;
                return <Route
                  key={resourceName}
                  path={paths[resourceName]}
                  render={() => {
                    setTitle(`${ resource.displayName || resourceName} | ${appName}`);
                    setPageBackground("whitesmoke");
                    return <GenericTable resource={resource} columns={allColumns[resourceName]} />;
                  }}
                />
              })
            }
            <Route path="*">
              <NoMatch />
            </Route>
          </Switch>
        </Router>
      </div>
    </div>
  );
};


export default App;
