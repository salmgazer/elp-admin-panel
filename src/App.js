import React from 'react';
import './App.scss';
import {Button, message} from 'antd';


const info = () => {
  message.success('We are building with antd');
};

function App() {
  return (
    <div className="App">
      <Button type='primary' onClick={info}>Click me</Button>
    </div>
  );
}

export default App;
