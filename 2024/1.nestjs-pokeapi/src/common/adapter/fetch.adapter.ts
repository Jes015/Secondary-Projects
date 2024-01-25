import { Injectable } from '@nestjs/common';
import { HttpAdapter } from '../interfaces/http-adapter';

@Injectable()
export class FetchAdapter implements HttpAdapter {
  private fetchAdapted = fetch;

  async get<T>(url: string): Promise<T> {
    const response = await this.fetchAdapted(url);
    const data = (await response.json()) as T;

    return data;
  }
}
