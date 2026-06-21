import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
}

@Injectable({ providedIn: 'root' })
export class HttpService {
  private baseUrl = environment.apiUrl; // e.g. http://localhost:3000/api (dev) or your Render URL (prod)

  constructor(private http: HttpClient) {}

  // ── Private helpers ──────────────────────────────────────────

  private buildUrl(path: string): string {
    return `${this.baseUrl}${path}`;
  }

  private buildOptions(options?: RequestOptions): {
    headers?: HttpHeaders;
    params?: HttpParams;
  } {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let params = new HttpParams();

    if (options?.headers) {
      Object.entries(options.headers).forEach(([k, v]) => {
        headers = headers.set(k, v);
      });
    }

    if (options?.params) {
      Object.entries(options.params).forEach(([k, v]) => {
        params = params.set(k, String(v));
      });
    }

    return { headers, params };
  }

  // ── Public HTTP methods ───────────────────────────────────────

  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return firstValueFrom(
      this.http.get<T>(this.buildUrl(path), this.buildOptions(options))
    );
  }

  post<T>(path: string, body: unknown, options?: RequestOptions): Promise<T> {
    return firstValueFrom(
      this.http.post<T>(this.buildUrl(path), body, this.buildOptions(options))
    );
  }

  put<T>(path: string, body: unknown, options?: RequestOptions): Promise<T> {
    return firstValueFrom(
      this.http.put<T>(this.buildUrl(path), body, this.buildOptions(options))
    );
  }

  patch<T>(path: string, body: unknown, options?: RequestOptions): Promise<T> {
    return firstValueFrom(
      this.http.patch<T>(this.buildUrl(path), body, this.buildOptions(options))
    );
  }

  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return firstValueFrom(
      this.http.delete<T>(this.buildUrl(path), this.buildOptions(options))
    );
  }
}