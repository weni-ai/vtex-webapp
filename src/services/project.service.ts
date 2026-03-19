import { getProjectDetail } from '../api/project/requests';
import store from '../store/provider.store';
import { setProjectDetail } from '../store/projectSlice';

export async function loadProjectDetail(): Promise<void> {
  try {
    const projectDetail = await getProjectDetail();
    store.dispatch(setProjectDetail(projectDetail));
  } catch (error) {
    console.error('Failed to load project detail:', error);
  }
}
