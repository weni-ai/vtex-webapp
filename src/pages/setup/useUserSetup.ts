// hooks/useUserSetup.ts
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../../store/userSlice';
import { fetchUserData } from '../../services/user.service';
import axios from 'axios';

export function useUserSetup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initializeUser = async () => {
    try {
      const userData = await fetchUserData();
      console.log('userData: ', userData)
      if (userData) {
        dispatch(setUser(userData));
        const payload = {
          user_email: userData.user,
          organization_name: "Org VTEX",
          project_name: "Project VTEX",
          vtex_account: "org.vtex.com.br"
        }

        axios.post('https://vtex-io.apip.stg.cloud.weni.ai/create_user', payload).then(()=>  navigate('/dash'))
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return { initializeUser };
}
