import React from 'react';
import './App.scss';
import {Button, message} from 'antd';
import Sidebar from './components/sidebar.js';


const info = () => {
  message.success('We are building with antd');
};

function App() {
  return (
    <div className="App">
      <Sidebar />
    </div>
  );
}

export default App;
