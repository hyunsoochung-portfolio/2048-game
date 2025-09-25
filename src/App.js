import React from 'react';
import './App.css'; // App 전역 스타일을 사용할 경우 유지
import Game from './components/Game'; // Game 컴포넌트 불러오기

function App() {
  return (
    <div className="App">
      <Game />
    </div>
  );
}

export default App;