import React from 'react';
import Sidebar from '../components/sidebar.js';
import Table from '../components/tableCategories';

function Category() {
  return (
    <div>
      <Sidebar >
          <Table />
      </Sidebar>
    </div>
  );
}

export default Category;
