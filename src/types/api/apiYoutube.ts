export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total?: number;
}
