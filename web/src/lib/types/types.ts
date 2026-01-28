// web/src/lib/types.ts
export interface Mood {
  type: string;
  notes?: string;
  date: string;
}

export interface Reflection {
  id?: number;
  question: string;
  type: 'TEXT' | 'BOOLEAN' | 'NUMBER';
  answer?: string | boolean | number;
}

export interface Patient {
  name: string;
  email: string;
}
