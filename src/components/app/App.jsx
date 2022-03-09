import '../../stylesheets/App.css';
import Home from '../pages/Home'
import Navbar from '../navbar/Navbar';
import { Routes ,Route, BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Home/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
