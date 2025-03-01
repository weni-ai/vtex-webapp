import { SetupError } from './pages/agent/SettingUpError';
import { AgentBuilder } from './pages/agent/AgentBuilder';
import { useDispatch } from 'react-redux';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { setUser } from './store/userSlice';
import { useEffect } from 'react';
import { getUserFromLocalStorage } from './services/user.service';
import { AgentDetails } from './pages/agent/Details';
import { Setup } from './pages/Setup';
import { Dashboard } from './pages/Dashboard';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const user = getUserFromLocalStorage();
    if (user) {
      dispatch(setUser(user));
    }
  }, [dispatch]);
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Setup />}></Route>
        <Route path='/agent-details' element={<AgentDetails />}></Route>
        <Route path='/agent-builder' element={<AgentBuilder />}></Route>
        <Route path='/setup-error' element={<SetupError />}></Route>
        <Route path='/dash' element={<Dashboard />}></Route>
      </Routes>
    </Router>
  )
}

export default App
