import React from 'react';
import Sidebar from '../../components/sidebar.js';
import Table from '../../components/tableProduct.js';
import EditableFormTable from "../../components/tableProduct";

function Products() {
  return (
    <div>
      <Sidebar >
          <EditableFormTable />
      </Sidebar>
    </div>
  );
}

export default Products;
