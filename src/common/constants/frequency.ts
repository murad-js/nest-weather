export const Frequency = {
  HOURLY: 'hourly',
  DAILY: 'daily',
} as const;

export type Frequency = (typeof Frequency)[keyof typeof Frequency];
