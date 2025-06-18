// types.ts
export interface User {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string; // In a real app, never store plain text passwords
}
