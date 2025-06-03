declare module 'bcryptjs' {
  export function compare(
    data: string | Buffer,
    encrypted: string,
    callback: (err: Error | null, same: boolean) => void
  ): void;
  
  export function compare(
    data: string | Buffer,
    encrypted: string
  ): Promise<boolean>;
  
  export function hash(
    data: string | Buffer,
    saltOrRounds: number | string,
    callback: (err: Error | null, encrypted: string) => void
  ): void;
  
  export function hash(
    data: string | Buffer,
    saltOrRounds: number | string
  ): Promise<string>;
  
  export function genSalt(rounds: number): Promise<string>;
  export function genSalt(rounds: number, callback: (err: Error | null, salt: string) => void): void;
  export function genSalt(callback: (err: Error | null, salt: string) => void): void;
  
  export function getRounds(encrypted: string): number;
  export function getSalt(encrypted: string): string;
}
