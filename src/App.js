import React from 'react';
import {
Switch,
Route,
} from "react-router-dom";
import paths from "./utilities/paths";
import './App.scss';
import {Button, message} from 'antd';
import Sidebar from './components/sidebar.js';


import ViewProducts from './screens/ViewProducts'
import ViewBrands from './screens/ViewBrands'
import ViewCategory from './screens/ViewCategory'
import ViewGroups from './screens/ViewGroups'
import ViewManufacturers from './screens/ViewManufacturers'
import ViewSegments from './screens/ViewSegment'
import ImportProducts from './screens/ImportProducts'
import CopyProducts from './screens/CopyProducts'
import AssignProducts from './screens/AssignProductStoretype'


function App() {
  return (
    <div className="App">
      <Sidebar />
      <Switch>
        <Route path={paths.viewBrands} exact component={ViewBrands} />
        <Route path={paths.viewProducts} exact component={ViewProducts} />
        <Route path={paths.viewCategories} exact component={ViewCategory} />
        <Route path={paths.viewGroups} exact component={ViewGroups} />
        <Route path={paths.viewManufacturers} exact component={ViewManufacturers} />
        <Route path={paths.viewSegment} exact component={ViewSegments} />
        <Route path={paths.importProducts} exact component={ImportProducts} />
        <Route path={paths.copyProducts} exact component={CopyProducts} />
        <Route path={paths.assignProduct} exact component={AssignProducts} />
  
      </Switch>
    </div>
  );
}

export default App;
