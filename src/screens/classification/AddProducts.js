import React from 'react';
import Sidebar from '../../components/sidebar.js';
import Products from "../../components/addproducts";


function AddProducts() {
    return (
        <div>
            <Sidebar >
                <Products />
            </Sidebar>
        </div>
    );
}

export default AddProducts;