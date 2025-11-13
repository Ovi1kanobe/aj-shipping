export default class PocketBaseError extends Error {
  url: string;
  status: number;
  response: {
    code: number;
    message: string;
    data: any;
  };
  isAbort: boolean;
  originalError: any;

  constructor(
    url: string,
    status: number,
    response: { code: number; message: string; data: any },
    isAbort: boolean,
    originalError: any
  ) {
    super(response.message);
    this.name = 'PocketBaseError';
    this.url = url;
    this.status = status;
    this.response = response;
    this.isAbort = isAbort;
    this.originalError = originalError;
  }
}