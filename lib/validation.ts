import { z } from 'zod';

// Profanity word list (basic - can be expanded)
const PROFANITY_LIST = [
  'fuck', 'shit', 'damn', 'bitch', 'ass', 'bastard', 'crap',
  'hell', 'piss', 'dick', 'cock', 'pussy', 'whore', 'slut'
];

// PII patterns
const PHONE_PATTERN = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
const SSN_PATTERN = /\b\d{3}-\d{2}-\d{4}\b/g;
const CREDIT_CARD_PATTERN = /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g;
const EMAIL_IN_TEXT_PATTERN = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

export function sanitizeText(text: string): string {
  // Remove HTML tags
  let sanitized = text.replace(/<[^>]*>/g, '');
  
  // Remove script tags and content
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  // Normalize whitespace
  sanitized = sanitized.replace(/\s+/g, ' ');
  
  return sanitized;
}

export function containsProfanity(text: string): boolean {
  const lowerText = text.toLowerCase();
  return PROFANITY_LIST.some(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(lowerText);
  });
}

export function containsPII(text: string): boolean {
  // Check for phone numbers
  if (PHONE_PATTERN.test(text)) return true;
  
  // Check for SSN
  if (SSN_PATTERN.test(text)) return true;
  
  // Check for credit card numbers
  if (CREDIT_CARD_PATTERN.test(text)) return true;
  
  // Check for email addresses in text
  if (EMAIL_IN_TEXT_PATTERN.test(text)) return true;
  
  return false;
}

export function validateEmail(email: string): boolean {
  const emailSchema = z.string().email();
  return emailSchema.safeParse(email).success;
}

export const goalSubmissionSchema = z.object({
  goalText: z.string()
    .min(10, 'Goal must be at least 10 characters')
    .max(500, 'Goal must be less than 500 characters'),
  email: z.string()
    .email('Invalid email address')
    .max(100, 'Email too long'),
  userName: z.string()
    .min(1, 'Name is required')
    .max(50, 'Name too long')
    .default('Anonymous'),
  category: z.enum(['CAREER', 'HEALTH', 'FINANCE', 'RELATIONSHIPS', 'LEARNING', 'OTHER']).optional().default('OTHER'),
});

export type GoalSubmission = z.infer<typeof goalSubmissionSchema>;
