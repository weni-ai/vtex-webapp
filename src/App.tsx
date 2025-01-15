import { SetupError } from './pages/agent/SettingUpError';
import { AgentBuilder } from './pages/agent/AgentBuilder';
import { useDispatch } from 'react-redux';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { setUser } from './store/userSlice';
import { useEffect } from 'react';
import { getUserFromLocalStorage } from './services/user.service';
import { AgentDetails } from './pages/agent/Details';
import { AgentBuilderSkeleton } from './pages/agent/AgentBuilderSkeleton';

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
        <Route path='/' element={<AgentDetails />}></Route>
        <Route path='/agent-builder' element={<AgentBuilder />}></Route>
        <Route path='/agent-builder-skeleton' element={<AgentBuilderSkeleton />}></Route>
        <Route path='/setup-error' element={<SetupError />}></Route>
      </Routes>
    </Router>
  )
}

export default App
