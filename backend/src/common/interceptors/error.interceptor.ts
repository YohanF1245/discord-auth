import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  private readonly logger = new Logger('ErrorInterceptor');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(error => {
        this.logger.error('Error details:', {
          name: error.name,
          message: error.message,
          code: error.code,
          status: error.status,
          stack: error.stack,
        });

        if (error.response) {
          this.logger.error('Error response:', error.response);
        }

        return throwError(() => error);
      }),
    );
  }
} 