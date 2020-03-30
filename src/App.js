import React from 'react';
import paths from "./utilities/paths";
import './App.scss';
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { useAuth0 } from "./react-auth0-spa";
import NavBar from './components/navbar/NavBar';
import GenericTable from './components/GenericTable/GenericTable';
import resources from './config/resources';
import Loading from "./components/Loading";
import Login from "./screens/login/Login";
import allColumns from "./config/columns";

function NoMatch() {
  return (
    <div style={{backgroundColor: 'red'}}>
      <button type="primary" onClick={() => (window.location.href = "/")}>
        Back Home
      </button>
    </div>
  );
}


function setPageBackground(backgroundColor = "rgb(242, 236, 227)") {
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

  const appName = require('../package.json').name;


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
            {
              resources.filter(r => r.isGeneric === true && r.isReady === true).map(resource => {
                const resourceName = resource.resource;
                return <Route
                  key={resourceName}
                  exact
                  path={paths[resourceName]}
                  render={() => {
                    setTitle(`${resourceName} | ${appName}`);
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
