export interface DayEntry {
    id: string;
    date: string;
    description: string;
    responses?: { question_id: string; answer: string }[];
}
