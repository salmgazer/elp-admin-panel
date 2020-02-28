import React from 'react';
import Sidebar from '../../components/sidebar.js';
import Manufacturer from "../../components/addmanufacturer";


function Manufacturers() {
    return (
        <div>
            <Sidebar >
                <Manufacturer/>
            </Sidebar>
        </div>
    );
}

export default Manufacturers;