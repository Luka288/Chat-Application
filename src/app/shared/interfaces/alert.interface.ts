export interface AlertData {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning'; // Literal types ალერტისთვის
  display: boolean;
}
