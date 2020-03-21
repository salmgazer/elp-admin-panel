import React from 'react';
import Sidebar from '../../components/sidebar.js';
import EditableFormTable from "../../components/companies/businessCategories";



function BusinessCategories() {
    return (
        <div>
            <Sidebar >
                <EditableFormTable/>
            </Sidebar>
        </div>
    );
}

export default BusinessCategories;