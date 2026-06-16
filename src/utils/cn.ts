type ClassValue = string | boolean | undefined | null | Record<string, boolean>;

export function cn(...classes: ClassValue[]): string {
  return classes.flat().filter(Boolean).map(c => {
    if (typeof c === 'object' && c !== null) {
      return Object.entries(c).filter(([, v]) => v).map(([k]) => k).join(' ');
    }
    return c as string;
  }).join(' ');
}
