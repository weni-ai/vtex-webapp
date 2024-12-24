import { useCallback, useEffect, useRef } from 'react';
import { useUserSetup } from './setup/useUserSetup';
import { LoadingPage } from '../components/LoadingPage';


export function SettingUp() {
  const { initializeUser } = useUserSetup();
  const isInitialized = useRef(false);

  const memoizedInitializeUser = useCallback(() => {
    initializeUser();
  }, [initializeUser]);

  useEffect(() => {
    if (!isInitialized.current) {
      memoizedInitializeUser();
      isInitialized.current = true;
    }
  }, [memoizedInitializeUser]);

  return (
    <LoadingPage title="Setting up your App" description="Getting everything ready for you! We're finalizing the initial setup to ensure a smooth
    experience." color='#157BF4'/>
  );
}
