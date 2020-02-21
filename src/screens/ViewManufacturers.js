import React from 'react';
import Sidebar from '../components/sidebar.js';
import Table from '../components/tableManufacturers';

function Manufacturer() {
  return (
    <div>
      <Sidebar >
          <Table />
      </Sidebar>
    </div>
  );
}

export default Manufacturer;
