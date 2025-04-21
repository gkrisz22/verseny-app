export interface ActionResponse<T> {
  success: boolean;
  message: string;
  inputs?: T;
  errors?: {
    [K in keyof T]?: string[];
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
} 
