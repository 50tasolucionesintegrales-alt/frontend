export default function normalizeErrors(raw: any): { errors: string[] } {
  if (!Array.isArray(raw.errors)) {
    return { errors: ['Error desconocido'] };
  }

  const messages = raw.errors.map((e:any) => {
    if (typeof e === 'string') return e;
    if (typeof e?.message === 'string') return e.message;
    return 'Error inesperado';
  });

  return { errors: messages };
}
