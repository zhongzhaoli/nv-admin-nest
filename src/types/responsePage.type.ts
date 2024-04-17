export interface ResponsePageProps<T = any> {
  page: number;
  total: number;
  list: T[];
}
