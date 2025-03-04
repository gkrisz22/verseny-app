export interface ActionResponse<T> {
  success: boolean;
  message: string;
  inputs?: T;
  errors?: {
    [K in keyof T]?: string[];
  };
}
