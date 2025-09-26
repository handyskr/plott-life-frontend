import { ActionError, defineAction } from 'astro:actions';
import {contractCancelData, contractData, contractIdData} from './schema.ts';

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

    const text = await res.text();
    let body: any = null;

    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      body = text;
    }

    if (!res.ok) {
      let message: string | undefined = undefined;

      if (body && typeof body === 'object' && 'detail' in body) {
        message = body.detail ?? null;
      }

      throw new ActionError({
        code: ActionError.statusToCode(res.status),
        message,
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
    });

    if (!res.ok) {
      throw new ActionError({
        code: ActionError.statusToCode(res.status),
      });
    }

    return res;
  },
});

export const cancelContract = defineAction({
  accept: 'json',
  input: contractCancelData,
  handler: async (input, context) => {
    const accessToken = await context.session?.get('accessToken');
    const res = await fetch(`${API_URL}/v1/contract/${input.id}:cancel`, {
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

export const moveOutContract = defineAction({
  accept: 'json',
  input: contractIdData,
  handler: async (input, context) => {
    const accessToken = await context.session?.get('accessToken');
    const res = await fetch(`${API_URL}/v1/contract/${input.id}:move-out`, {
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
