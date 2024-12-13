// hooks/useUserSetup.ts
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../../store/userSlice';
import { fetchUserData } from '../../services/user.service';

export function useUserSetup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initializeUser = async () => {
    try {
      const userData = await fetchUserData();
      dispatch(setUser(userData));
      navigate('/dash');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return { initializeUser };
}
