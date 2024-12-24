import { SettingUp } from './pages/SettingUp';
import { AgentBuilder } from './pages/AgentBuilder';
import { Channels } from './pages/setup/Channels';
import { Dashboard } from './pages/Dashboard';
import { useDispatch } from 'react-redux';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { setUser } from './store/userSlice';
import { useEffect } from 'react';
import { getUserFromLocalStorage } from './services/user.service';

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
      <Route path='/' element={<SettingUp title="Setting up your App" description="Getting everything ready for you! We're finalizing the initial setup to ensure a smooth
            experience." color='#157BF4'/>}></Route>
      <Route path='/agent-builder' element={<AgentBuilder />}></Route>
      <Route path='/channels' element={<Channels />}></Route>
      <Route path='/dash' element={<Dashboard />}></Route>
      </Routes>
      </Router>
  )
}

export default App
