export type HttpResponse<T> = {
  status: string;
  message?: string;
  data?: T;
};

export class BaseController {
  constructor() {}

  protected responseError(message: string): HttpResponse<undefined> {
    return {
      status: 'fail',
      message,
    };
  }

  protected responseSuccess<T>(
    message: string | null = null,
    data: T | null = null,
  ): HttpResponse<T> {
    const response: HttpResponse<T> = {
      status: 'success',
    };
    response['status'] = 'success';
    if (message) response['message'] = message;
    if (data) response['data'] = data;

    return response;
  }
}
