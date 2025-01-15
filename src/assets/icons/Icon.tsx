import manageSearchIcon from './manage_search.svg';
import neurologyIcon from './neurology.svg'
import volunteerActivismIcon from './volunteer_activism.svg'
import { Center } from '@vtex/shoreline';

const iconList = {
    manage_search: manageSearchIcon,
    neurology: neurologyIcon,
    volunteer_activism: volunteerActivismIcon
};

type IconKeys = keyof typeof iconList;

interface IconProps {
  icon: IconKeys;
}

const Icon = ({ icon }: IconProps) => {
  return (
    <Center>
      <img src={iconList[icon]} alt='' />
    </Center>
  );
};

export default Icon;
