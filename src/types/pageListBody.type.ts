export interface pageListDataProps<T = any> {
  pageData: { page: number; limit: number };
  screenData: T;
}
