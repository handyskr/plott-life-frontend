import { ActionError, defineAction } from 'astro:actions';
import { contractCancelData, contractData } from './schema.ts';

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

// MEMO: 아직 사용 안함
export const listContracts = defineAction({
  accept: 'json',
  handler: async (input, context) => {
    const accessToken = await context.session?.get('accessToken');
    const res = await fetch(`${API_URL}/v1/contract`, {
      method: 'GET',
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

export const cancelContract = defineAction({
  accept: 'json',
  input: contractCancelData,
  handler: async (input, context) => {
    const accessToken = await context.session?.get('accessToken');
    const res = await fetch(`${API_URL}/v1/contract:cancel/${input.id}`, {
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
