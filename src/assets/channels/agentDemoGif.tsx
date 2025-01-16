import mockedGif from './agentdemo.gif';
import { Text, Center } from '@vtex/shoreline';

const AgentDemoGif = () => {
  return (
    <Center>
      <img src={mockedGif} alt="Mocked GIF"  style={{ height:'500px' }} />
      <Text variant="body" color="$color-gray-5">{t('agent.details.example.description')}</Text>
    </Center>
  );
};

export default AgentDemoGif;
