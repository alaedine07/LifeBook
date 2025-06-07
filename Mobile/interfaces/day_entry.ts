export interface DayEntry {
  id?: string;
  entryDate: string;
  description: string;
  responses: {
    reflection_text: string;
    answers: string[];
  }[];
}
