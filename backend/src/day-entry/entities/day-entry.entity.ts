import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('day_entries')
export class DayEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date', name: 'entry_date' }) // Database column name
  entryDate: Date; // Property name in TypeScript

  @Column({ type: 'simple-json' })
  responses: {
    reflection_text: string;
    answers: string[];
  }[];

  @CreateDateColumn({ name: 'created_at' }) // Database column name
  createdAt: Date; // Property name in TypeScript

  @UpdateDateColumn({ name: 'updated_at' }) // Database column name
  updatedAt: Date; // Property name in TypeScript
}
