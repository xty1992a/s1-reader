export interface ResultOk<T> {
  success: true;
  data: T;
  message: string;
  origin: any
}

export interface ResultFail {
  success: false;
  data: any;
  message: string;
  origin: any
}

export type Result<T> = ResultOk<T> | ResultFail;

export interface Option {
  method: "POST" | "GET";
  data?: Record<string, any> | string;
  params?: Record<string, any>;
  headers?: Record<string, any>;
}

export interface Config {
  loading: boolean;
  toast: boolean;
  isSuccess: (res: any) => boolean;
  fmtData: (data: any) => any;
  message: (data: any) => string;
}
