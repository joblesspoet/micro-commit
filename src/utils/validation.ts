// Types
export interface ValidationError {
  field: string;
  message: string;
  suggestion?: string;
}

export interface HabitValidationResult {
  isValid: boolean;
  error?: ValidationError;
}

// Helpers
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6 && /\d/.test(password);
};

export const validateDisplayName = (name: string): boolean => {
  const trimmed = name.trim();
  // 2-50 chars, letters, numbers, spaces only
  const validChars = /^[a-zA-Z0-9 ]+$/;
  return trimmed.length >= 2 && trimmed.length <= 50 && validChars.test(trimmed);
};

// Advanced Habit Validation
export const validateHabitName = (name: string): HabitValidationResult => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: { field: 'name', message: 'Please enter a habit name' } };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, error: { field: 'name', message: 'Habit name must be at least 2 characters' } };
  }
  
  if (name.length > 50) {
     return { isValid: false, error: { field: 'name', message: 'Habit name must be less than 50 characters' } };
  }

  // Ambitious Patterns Check
  const ambitiousPatterns = [
    { pattern: /(\d+)\s*(pushups?|push-ups?)/i, check: (num: number) => num > 2 },
    { pattern: /(\d+)\s*(squats?)/i, check: (num: number) => num > 2 },
    { pattern: /(\d+)\s*(situps?|sit-ups?)/i, check: (num: number) => num > 2 },
    { pattern: /(\d+)\s*(minutes?|mins?)/i, check: (num: number) => num > 2 },
    { pattern: /(\d+)\s*(pages?)/i, check: (num: number) => num > 1 },
    { pattern: /(\d+)\s*(chapters?)/i, check: (num: number) => num > 0 },
    { pattern: /(run|jog|running)\s*(\d+)?\s*(miles?|km|kilometers?)/i, check: () => true }, // Any running distance is ambitious for micro-habit
  ];

  for (const { pattern, check } of ambitiousPatterns) {
    const match = name.match(pattern);
    if (match) {
      const numStr = match[1];
      // For running regex, num might be in group 2 or not exist
      const num = parseInt(numStr || '999', 10);
      if (check(num)) {
        return { 
          isValid: false,
          error: { 
            field: 'name', 
            message: `⚠️ Whoa there, overachiever! That might be too much to start. Try starting smaller!`,
            suggestion: getSmallerSuggestion(name)
          } 
        };
      }
    }
  }

  return { isValid: true };
};

export const getSmallerSuggestion = (name: string): string => {
  if (name.match(/pushup/i)) return '2 pushups';
  if (name.match(/squat/i)) return '2 squats';
  if (name.match(/page/i)) return 'Read 1 page';
  if (name.match(/chapter/i)) return 'Read 1 page';
  if (name.match(/run|jog/i)) return 'Run 1 minute';
  return 'Try something that takes 2 minutes or less';
};

export const getSmartSuggestion = (input: string): string | null => {
  const suggestions: Record<string, string> = {
    'workout': 'Try "2 pushups" or "2 squats"',
    'exercise': 'Try "2 pushups" or "1 minute plank"',
    'gym': 'Try "2 pushups" at home instead',
    'read book': 'Try "Read 1 page"',
    'study': 'Try "Study 2 minutes"',
    'meditate': 'Try "1 minute meditation"',
    'relax': 'Try "1 minute deep breathing"',
    'write': 'Try "Write 1 sentence"',
    'journal': 'Try "Write 1 sentence in journal"',
  };
  
  const lowerInput = input.toLowerCase();
  for (const [keyword, suggestion] of Object.entries(suggestions)) {
    if (lowerInput.includes(keyword)) {
      return suggestion;
    }
  }
  return null;
};

export const validateDuration = (seconds: number): ValidationError | null => {
  if (!seconds || seconds <= 0) {
    return { field: 'duration', message: 'Please select a duration' };
  }
  
  if (seconds > 120) {
    return { 
      field: 'duration', 
      message: '⏱️ Maximum 2 minutes! Remember: ridiculously small = actually doable'
    };
  }
  
  return null;
};
