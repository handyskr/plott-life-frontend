import { ActionError, defineAction } from 'astro:actions';

const { API_URL } = import.meta.env;

export const createPayment = defineAction({
  accept: 'json',
  handler: async (input, context) => {
    const accessToken = await context.session?.get('accessToken');
    const res = await fetch(`${API_URL}/v1/contract/${input.id}/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      throw new ActionError({
        code: ActionError.statusToCode(res.status),
      });
    }

    const json = await res.json();

    return json;
  },
});
