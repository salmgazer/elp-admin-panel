import React from 'react';
import Sidebar from '../../components/sidebar.js';
import Categories from "../../components/addcategory";


function Category() {
    return (
        <div>
            <Sidebar >
                <Categories/>
            </Sidebar>
        </div>
    );
}

export default Category;