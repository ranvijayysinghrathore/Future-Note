import crypto from 'crypto';

export function generateDeleteToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function generateUnsubscribeToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function generateResponseToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function generateCryptoSecret(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}
