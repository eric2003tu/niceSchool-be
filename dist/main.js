"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const all_exceptions_filter_1 = require("./common/filters/all-exceptions.filter");
const winston_logger_1 = require("./common/logger/winston-logger");
const morgan = require('morgan');
const pagination_interceptor_1 = require("./common/interceptors/pagination.interceptor");
const metrics_service_1 = require("./metrics/metrics.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: ['http://localhost:3000', 'https://nice-school-fe.vercel.app', 'http://localhost:3002'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const helmet = require('helmet');
    const compression = require('compression');
    app.use(helmet());
    app.use(compression());
    app.use(morgan('combined', { stream: { write: (msg) => winston_logger_1.default.info(msg.trim()) } }));
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter());
    app.useGlobalInterceptors(new pagination_interceptor_1.PaginationInterceptor());
    const rateMap = new Map();
    const LIMIT = 10;
    const WINDOW_MS = 60 * 1000;
    app.use('/api/auth', (req, res, next) => {
        var _a;
        try {
            const ip = req.ip || ((_a = req.connection) === null || _a === void 0 ? void 0 : _a.remoteAddress) || 'unknown';
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
        }
        catch (err) {
            next();
        }
    });
    app.setGlobalPrefix('api');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Nice School API')
        .setDescription('School Management System API')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    const metricsService = app.get(metrics_service_1.MetricsService);
    const httpAdapter = app.getHttpAdapter();
    httpAdapter.get('/metrics', async (req, res) => {
        res.setHeader('Content-Type', 'text/plain');
        res.end(await metricsService.getMetrics());
    });
    const port = process.env.PORT || 3001;
    await app.listen(port);
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
//# sourceMappingURL=main.js.map