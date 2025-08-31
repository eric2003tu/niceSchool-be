import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PaginationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (!Array.isArray(data)) return data;
        const req = context.switchToHttp().getRequest();
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const total = data.length;
        const start = (page - 1) * limit;
        const end = start + limit;
        return {
          meta: { page, limit, total },
          data: data.slice(start, end),
        };
      }),
    );
  }
}
