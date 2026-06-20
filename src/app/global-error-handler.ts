import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    console.error('Unhandled exception caught by GlobalErrorHandler:', error);

    // TODO: send the error to a logging backend or monitoring service
    // example: logService.logError(error);
  }
}
