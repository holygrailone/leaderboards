import './App.css';
import { render } from 'react-dom';
import React, {Component, useState, useEffect} from 'react';
import SortableTable from 'react-sortable-table';

import axios from 'axios';

import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';


class Table extends Component {
    constructor(props) {
      super(props);
      this.state = { data: [] };
    }
    
  
    componentDidMount() {
        axios.get('https://api.holygrail.one/legends.json', {
            headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        })
        .then(res => {
            var newlegends = res.data.sort((a, b) => b.level - a.level);      
            this.setState({ data: newlegends });
        });
    }

    
  
    render() {
      var newdata = this.state.data;     

      return (
          <>
        <div className="table-wrapper">
        <table className="sortable" align="center">
          <thead>
            <tr>
              <th>Legend #</th>
              <th>Generation</th>
              <th>Level</th>
              <th>XP</th>
              <th>Name</th>
              <th>Title</th>
              <th>Gold</th>
              <th>Knowledge</th>
              <th>Minted</th>
              <th>Banned</th>
              <th>Owner</th>
            </tr>
          </thead>
          <tbody>
            {newdata.map(function(legend, index) {
              return (
                <tr key={index} data-item={legend}>
                    <td data-label="Legend #">{legend.legendid}</td>
                    <td data-label="Gen">{legend.gen}</td>
                    <td data-label="Level">{legend.level}</td>
                    <td data-label="XP">{legend.xp}</td>
                    <td data-label="Name">{legend.name}</td>
                    <td data-label="Title">{legend.title}</td>
                    <td data-label="Gold">{legend.gold}</td>
                    <td data-label="Knowledge">{legend.knowledge}</td>
                    <td data-label="Minted">{new Date(legend.minted*1000).toLocaleDateString("en-US").toString()}</td>
                    <td data-label="Banned">{legend.banned.toString()}</td>
                    <td data-label="Owner"><Jazzicon diameter={32} seed={jsNumberForAddress(legend.address)} /><br />{legend.address.substring(0, 15)+'...'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
        <div style={{fontSize: "14px", margin: "0 auto", marginBottom: "25px"}} align="center"><a href="https://swap.holygrail.one" target="_blank">Swap</a> | <a href="https://twitter.com/holygrailone" target="_blank">Twitter</a> | <a href="https://discord.gg/a5EkZtB9Fx" target="_blank">Discord</a> | <a href="https://medium.com/@holygrailone" target="_blank">Medium</a> | <a href="https://t.me/holygrailone" target="_blank">TG</a> | <a href="https://github.com/holygrailone" target="_blank">Github</a> | <a href="https://vote.holygrail.one" target="_blank">Vote</a> | <a href="https://rugdoc.io/project/holygrail/" target="_blank">Rugdoc</a></div>
        </>
      );
    }
  }
  
  export default Table;