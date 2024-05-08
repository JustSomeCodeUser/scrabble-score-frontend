import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ScrabbleBoard from './components/ScrabbleBoard';
import './App.css';

function App() {
  return (
      <div className="App">
        <header className="App-header">
          <h1>Scrabble Score Calculator</h1>
        </header>
        <div className="container mt-4">
          <ScrabbleBoard />
        </div>
      </div>
  );
}

export default App;
