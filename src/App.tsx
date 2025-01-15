import { SettingUp } from './pages/SettingUp';
import { AgentBuilder } from './pages/AgentBuilder';
import { Channels } from './pages/setup/Channels';
import { Dashboard } from './pages/Dashboard';
import { useDispatch } from 'react-redux';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { setUser } from './store/userSlice';
import { useEffect } from 'react';
import { getUserFromLocalStorage } from './services/user.service';
import { ErrorPage } from './components/ErrorPage';
import { AgentDetails } from './pages/agent/Details';

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
      <Route path='/' element={<SettingUp/>}></Route>
      <Route path='/agent-details' element={<AgentDetails />}></Route>
      <Route path='/agent-builder' element={<AgentBuilder />}></Route>
      <Route path='/channels' element={<Channels />}></Route>
      <Route path='/dash' element={<Dashboard />}></Route>
      <Route path='/error' element={<ErrorPage title={'Something went wrong'} description={'Retry or check back later if the issue persists.'} color={'#F95D47'}  />}></Route>
      </Routes>
      </Router>
  )
}

export default App
