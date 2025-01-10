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
    <LoadingPage title={t('setup.title')} description={t('setup.description')} color='#157BF4'/>
  );
}
