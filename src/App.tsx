import { SettingUp } from './pages/SettingUp';
import { AgentBuilder } from './pages/AgentBuilder';
import { Channels } from './pages/setup/Channels';
import { Dashboard } from './pages/Dashboard';

function App() {
  return (
    <>
      <SettingUp />
      <AgentBuilder />
      <Channels />
      <Dashboard />
    </>
  )
}

export default App
