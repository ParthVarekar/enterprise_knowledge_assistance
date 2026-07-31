export interface DLPMatch {
  type: 'CREDIT_CARD' | 'SSN' | 'API_KEY' | 'EMAIL' | 'PHONE';
  value: string;
  index: number;
}

export class DLPFilter {
  private static CREDIT_CARD_REGEX = /\b(?:\d[ -]*?){13,16}\b/g;
  private static SSN_REGEX = /\b\d{3}-\d{2}-\d{4}\b/g;
  private static API_KEY_REGEX = /\b(?:AKIA[0-9A-Z]{16}|sk-[a-zA-Z0-9]{32,64}|ghp_[a-zA-Z0-9]{36})\b/g;
  private static EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
  private static PHONE_REGEX = /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;

  public static sanitize(text: string): { sanitizedText: string; redactedMatchesCount: number } {
    let sanitized = text;
    let count = 0;

    sanitized = sanitized.replace(this.CREDIT_CARD_REGEX, (match) => {
      count++;
      return '[REDACTED_CREDIT_CARD]';
    });

    sanitized = sanitized.replace(this.SSN_REGEX, (match) => {
      count++;
      return '[REDACTED_SSN]';
    });

    sanitized = sanitized.replace(this.API_KEY_REGEX, (match) => {
      count++;
      return '[REDACTED_API_KEY]';
    });

    sanitized = sanitized.replace(this.EMAIL_REGEX, (match) => {
      count++;
      return '[REDACTED_EMAIL]';
    });

    return { sanitizedText: sanitized, redactedMatchesCount: count };
  }
}
