// web/src/lib/types.ts
export interface Mood {
  id: number;
  type: string;
  notes?: string;
  date: string;
}

export interface Reflection {
  id: number;
  question: string;
  type: 'text' | 'yes_no' | 'number';
  answer?: string | boolean | number;
}

export interface Patient {
  id: number;
  name: string;
  email: string;
}

export interface Reflection {
  id: number;
  question: string;
  type: 'text' | 'yes_no' | 'number';
  answer?: string | boolean | number;
}
