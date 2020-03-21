import React from 'react';
import Sidebar from '../../components/sidebar.js';
import EditableFormTable from "../../components/companies/branches";



function Branches() {
    return (
        <div>
            <Sidebar >
                <EditableFormTable/>
            </Sidebar>
        </div>
    );
}

export default Branches;