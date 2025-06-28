import "jsr:@std/dotenv/load";

export function GetVar(name: string, fallback?: string): string {
  const value = Deno.env.get(name);

  if (!value && fallback !== undefined) {
    return fallback;
  } else if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}
