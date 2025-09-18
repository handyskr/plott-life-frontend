import { ActionError, defineAction } from 'astro:actions';
import { contractData } from './schema.ts';

const { API_URL } = import.meta.env;

export const createContract = defineAction({
  accept: 'json',
  input: contractData,
  handler: async (input, context) => {
    const accessToken = await context.session?.get('accessToken');
    const res = await fetch(`${API_URL}/v1/contract`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      throw new ActionError({
        code: ActionError.statusToCode(res.status),
      });
    }

    return {};
  },
});
