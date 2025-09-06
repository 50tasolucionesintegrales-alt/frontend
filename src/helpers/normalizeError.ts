interface RawInput {
  errors: Array<string | { message?: string }>;
}

export default function normalizeErrors(raw: RawInput): { errors: string[] } {
  if (!Array.isArray(raw.errors)) {
    return { errors: ['Error desconocido'] };
  }

  interface RawError {
    message?: string;
  }

  const messages = raw.errors.map((e: string | RawError) => {
    if (typeof e === 'string') return e;
    if (typeof e?.message === 'string') return e.message;
    return 'Error inesperado';
  });

  return { errors: messages };
}
