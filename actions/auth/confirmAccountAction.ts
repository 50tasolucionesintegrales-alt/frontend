'use server';

import normalizeErrors from '@/src/helpers/normalizeError';
import { errorSchema, successSchema, TokenSchema } from '@/src/schemas';

type ActionStateType = {
  errors: string[];
  success: string;
};

export async function confirmAccount(token: string, prevState: ActionStateType) {
  const confirmToken = TokenSchema.safeParse(token);
  if (!confirmToken.success) {
    return {
      errors: confirmToken.error.issues.map((issue) => issue.message),
      success: '',
    };
  }

  const url = `${process.env.NEXT_PUBLIC_API_URL}/users/confirm-account`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: confirmToken.data }),
  });

  const json = await res.json();

  if (!res.ok) {
    return {
      ...normalizeErrors(json),
      success: '',
    };
  }

  const { message } = successSchema.parse(json);

  return {
    errors: [],
    success: message,
  };
}
