import './app.css';
import Home from './components/home/Home.js';
import Create from './components/create/Create.js';
import Schedule from './components/schedule/Schedule.js';

let adminID = 1;

function App() {
    return ( 
        <div className='App'>
            <Home adminID={adminID} />
        </div>
     );
}

export default App;