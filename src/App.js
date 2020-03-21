import React from 'react';
import {
Switch,
Route,
} from "react-router-dom";
import paths from "./utilities/paths";
import './App.scss';


import ViewProducts from './screens/classification/ViewProducts'
import ViewBrands from './screens/classification/ViewBrands'
import ViewCategory from './screens/classification/ViewCategory'
import ViewGroups from './screens/classification/ViewGroups'
import ViewManufacturers from './screens/classification/ViewManufacturers'
import ViewSegments from './screens/classification/ViewSegment'
import ImportProducts from './screens/classification/ImportProducts'
import CopyProducts from './screens/classification/CopyProducts'
import AssignProducts from './screens/classification/AssignProductStoretype'
import Brands from "./screens/classification/addbrand";
import Category from "./screens/classification/addcategory";
import AddProducts from "./screens/classification/AddProducts";
import Groups from "./screens/classification/addgroup";
import Manufacturers from "./screens/classification/addmanufacturer";
import Companies from "./screens/companies/companies";
import Branches from "./screens/companies/branches";
import BusinessCategories from "./screens/companies/businessCategories";




function App() {
  return (
    <div className="App">
      <Switch>
        <Route path={paths.viewBrands} exact component={ViewBrands} />
        <Route path={paths.viewProducts} exact component={ViewProducts} />
        <Route path={paths.viewCategories} exact component={ViewCategory} />
        <Route path={paths.viewGroups} exact component={ViewGroups} />
        <Route path={paths.viewManufacturers} exact component={ViewManufacturers} />
        <Route path={paths.viewSegment} exact component={ViewSegments} />
        <Route path={paths.importProducts} exact component={ImportProducts} />
        <Route path={paths.copyProducts} exact component={CopyProducts} />
        <Route path={paths.addBrands} exact component={Brands} />
          <Route path={paths.addGroups} exact component={Groups} />
          <Route path={paths.addCategory} exact component={Category} />
          <Route path={paths.addManufacturers} exact component={Manufacturers} />
        <Route path={paths.addProducts} exact component={AddProducts} />
          <Route path={paths.companies} exact component={Companies} />
          <Route path={paths.branches} exact component={Branches} />
          <Route path={paths.businessCategories} exact component={BusinessCategories} />
      </Switch>
    </div>
  );
}

export default App;
