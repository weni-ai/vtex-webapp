import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../../store/userSlice';
import { fetchUserData } from '../../services/user.service';
export interface userSetupProps {
    user_email?: string,
    vtex_account?: string,
    project_name?: string,
    organization_name?: string
}

export function useUserSetup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initializeUser = async (payload: userSetupProps) => {
    try {
      const userData = await fetchUserData(payload);
      console.log('Dados do usuário:', userData);
      dispatch(setUser(userData));
      navigate('/dash');
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    }
  };

  return { initializeUser };
}
