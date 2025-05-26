import { SetupError } from './pages/agent/SettingUpError';
import { AgentBuilder } from './pages/agent/AgentBuilder';
import { useDispatch, useSelector } from 'react-redux';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { setUser } from './store/userSlice';
import { useEffect } from 'react';
import { getUserFromLocalStorage } from './services/user.service';
import { AgentDetails } from './pages/agent/Details';
import { Setup } from './pages/Setup';
import { Dashboard } from './pages/Dashboard';
import { Grid, Spinner } from '@vtex/shoreline';
import { initialLoading } from './store/projectSlice';
import { TermsAndConditions } from './pages/TermsAndConditions';
import { Template } from './pages/template/Template';
import { AgentIndex } from './pages/agent/Index';

function App() {
  const dispatch = useDispatch();
  const isInitialLoading = useSelector(initialLoading);
  useEffect(() => {
    const user = getUserFromLocalStorage();
    if (user) {
      dispatch(setUser(user));
    }
  }, [dispatch]);

  return (
    <>
      {isInitialLoading ? (
        <Grid
          rows="1fr"
          style={{
            height: '100vh',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Spinner size={32} description="loading" style={{color: 'var(--sl-color-blue-10)'}} />
        </Grid>
      ) : (
        <Router>
          <Routes>
            <Route path='/' element={<Setup />}></Route>
            <Route path='/agent-details' element={<AgentDetails />}></Route>
            <Route path='/terms-and-conditions' element={<TermsAndConditions />}></Route>
            <Route path='/agent-builder' element={<AgentBuilder />}></Route>
            <Route path='/setup-error' element={<SetupError />}></Route>
            <Route path='/dash' element={<Dashboard />}></Route>
            <Route path='/agents/:assignedAgentUuid' element={<AgentIndex />}></Route>
            <Route path='/agents/:assignedAgentUuid/templates/create' element={<Template />}></Route>
            <Route path='/agents/templates/:templateUuid/edit' element={<Template />}></Route>
          </Routes>
        </Router>
      )}
    </>
  )
}

export default App
