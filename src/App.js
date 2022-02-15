import './App.css';
import { render } from 'react-dom';
import React,{useState,useEffect}  from 'react';
import SortableTable from 'react-sortable-table';

import Table from './Table.js';

function App() {

  return (
    <div className="App">
      <header style={{marginTop: '55px'}}>
        <img src="https://holygrail.one/holygrailonegame.png" alt="Holy Grail" className="logo" />
        <h1>
          Leaderboards
        </h1>
        <p>These Holy Grail Leaderboards refresh statistics every ~30 minutes.</p>
        <br />
      </header>
      <Table />
      <div className="App-body">      
      </div>
    </div>
  );
}

export default App;
