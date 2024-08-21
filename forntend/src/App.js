import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AgGridTableWip from './component/Wip/AgGridTableWip';
import CreateExcel from './component/Wip/CreateExcel'
import CreateFrom from './component/Wip/CreateFrom';
function App() {
  return (
    <Router>
      <Routes >
        <Route path='wip/' element={<AgGridTableWip />}/>
          

        <Route path='wip/CreateExcel' element={<CreateExcel/>}/>
          
        <Route path='wip/CreateFrom' element={<CreateFrom/>}/>
          
      </Routes >


    </Router>
  );
};


export default App;
