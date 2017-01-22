import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Boursorama CSV to OFX converter</h1>
        </div>
        <p className="App-intro">
          Drop your CSV file here to convert it!
        </p>
      </div>
    );
  }
}

export default App;
