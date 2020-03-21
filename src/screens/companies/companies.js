import React from 'react';
import Sidebar from '../../components/sidebar.js';
import EditableFormTable from "../../components/companies/companies";



function Companies() {
    return (
        <div>
            <Sidebar >
                <EditableFormTable/>
            </Sidebar>
        </div>
    );
}

export default Companies;