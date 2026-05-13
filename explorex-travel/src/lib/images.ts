const hasUrlScheme = (value: string) => /^[a-z][a-z\d+\-.]*:/i.test(value);

export const resolveImageSrc = (value: string | null | undefined) => {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith("/") || hasUrlScheme(trimmed)) {
    return trimmed;
  }

  return `/${trimmed}`;
};
