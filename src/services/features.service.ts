import { VTEXFetch } from "../utils/VTEXFetch";

export async function integrateAvailableFeatures(projectUUID: string, token: string) {
    const data = {
        projectUUID
    }
    await VTEXFetch(`/_v/integrate-available-features?token=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).then((response) => {
        console.log('Feature integrated', response)
      }).catch((error) => {
        console.error('Error:', error);
      });
}