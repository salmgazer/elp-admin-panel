import React from 'react';
import Sidebar from '../../components/sidebar.js';
import Brand from "../../components/addbrand";
import Group from "../../components/addgroup";


function Groups() {
    return (
        <div>
            <Sidebar >
                <Group />
            </Sidebar>
        </div>
    );
}

export default Groups;