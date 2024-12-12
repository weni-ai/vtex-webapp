import { SettingUp } from './pages/SettingUp';
import { AgentBuilder } from './pages/AgentBuilder';
import { Channels } from './pages/setup/Channels';
import { Dashboard } from './pages/Dashboard';
import { Provider } from 'react-redux';

import store from './store/user.store';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {

  return (
    <Provider store={store}>
      <Router>
      <Routes>
      <Route path='/' element={<SettingUp />}></Route>
      <Route path='/agent-builder' element={<AgentBuilder />}></Route>
      <Route path='/channels' element={<Channels />}></Route>
      <Route path='/dash' element={<Dashboard />}></Route>
      </Routes>
      </Router>
    </Provider>
  )
}

export default App
