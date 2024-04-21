import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CityTable from './components/CityTable';
import WeatherPage from './components/WeatherPage';
import './output.css'
import FavouriteList from './components/FavouritesList';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CityTable />} />
        <Route path="/weather/" element={<WeatherPage />} />
        <Route path="/favourites/" element={<FavouriteList />} />
      </Routes>
    </Router>
  );
}

export default App;
