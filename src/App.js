import React, { Component } from 'react';
import Dropzone from "react-dropzone";
import Papa from "papaparse";
import generateOfx from "./ofx";
import './App.css';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ofx: "",
            errors: [],
            done: false
        };
    }

    handleDrop = (files) => {
        Papa.parse(files[0], {
            header: true,
            delimiter: ";",
            complete: (results) => {
                const ofx = generateOfx(results.data);
                this.setState({
                    ofx: ofx,
                    errors: results.errors
                });

                const link = document.createElement('a');
                link.download = 'download.ofx';
                const blob = new Blob([ofx], {type: 'text/plain'});
                link.href = window.URL.createObjectURL(blob);
                link.click();
            },
        });
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <h1>Boursorama CSV to YNAB OFX converter</h1>
                </div>

                <Dropzone onDrop={this.handleDrop} className="dropzone" activeClassName="dropzone-active">
                    <div>Drop your CSV file here to convert it!</div>
                </Dropzone>

                <div className="errors">
                    {this.state.errors.map(error => <p key={error.row + error.code}>
                        Warning: error line {error.row} [{error.code}]: {error.message}
                    </p>)}
                </div>

                <pre className="ofx-preview">
                    {this.state.ofx || "No results yet"}
                </pre>
            </div>
        );
    }
}

export default App;
