export type Category = 'birthday' | 'anniversary';

export type RemindOffset = 1 | 3 | 7;

export interface Anniversary {
  id: string;
  user_id: string;
  title: string;
  category: Category;
  date: string; // ISO date string (YYYY-MM-DD)
  remind_offset: RemindOffset;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  created_at: string;
}

export interface AnniversaryWithDays extends Anniversary {
  days_until: number;
}
