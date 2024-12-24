import mockedGif from './agentdemo.gif';

const AgentDemoGif = () => {
  return (
    <div>
      <img src={mockedGif} alt="Mocked GIF"  style={{ height:'500px' }} />
    </div>
  );
};

export default AgentDemoGif;
