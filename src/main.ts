import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import logger from './common/logger/winston-logger';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const morgan = require('morgan');
import { PaginationInterceptor } from './common/interceptors/pagination.interceptor';

import { MetricsService } from './metrics/metrics.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'https://nice-school-fe.vercel.app','http://localhost:3002'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Security middlewares (require at runtime to avoid compile-time module resolution errors)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const helmet = require('helmet');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const compression = require('compression');
  app.use(helmet());
  app.use(compression());

  // Request logging
  app.use(morgan('combined', { stream: { write: (msg: string) => logger.info(msg.trim()) } }));

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global interceptors
  app.useGlobalInterceptors(new PaginationInterceptor());

  // Simple in-memory rate limiter for auth endpoints
  const rateMap = new Map<string, { count: number; firstRequestAt: number }>();
  const LIMIT = 10; // per window
  const WINDOW_MS = 60 * 1000; // 1 minute

  app.use('/api/auth', (req: any, res: any, next: any) => {
    try {
      const ip = req.ip || req.connection?.remoteAddress || 'unknown';
      const entry = rateMap.get(ip) || { count: 0, firstRequestAt: Date.now() };
      if (Date.now() - entry.firstRequestAt > WINDOW_MS) {
        entry.count = 0;
        entry.firstRequestAt = Date.now();
      }
      entry.count++;
      rateMap.set(ip, entry);
      if (entry.count > LIMIT) {
        res.status(429).json({ statusCode: 429, error: 'Too Many Requests', message: 'Rate limit exceeded' });
        return;
      }
      next();
    } catch (err) {
      next();
    }
  });

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Nice School API')
    .setDescription('School Management System API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Global prefix
  app.setGlobalPrefix('api');

  // Metrics endpoint (use http adapter)
  const metricsService = app.get(MetricsService);
  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get('/metrics', async (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.end(await metricsService.getMetrics());
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);

  // Welcome message
  console.log(`
  ======================================================
    Nice School API is running on port ${port}
    
    Swagger documentation: http://localhost:${port}/api
    Health check: http://localhost:${port}/api/health
    
    Environment: ${process.env.NODE_ENV || 'development'}
  ======================================================
  `);
}
bootstrap();