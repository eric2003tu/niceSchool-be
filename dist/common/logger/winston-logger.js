"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { createLogger, transports, format } = require('winston');
const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: format.combine(format.timestamp(), format.errors({ stack: true }), format.splat(), format.json()),
    transports: [
        new transports.Console({
            format: format.combine(format.colorize(), format.simple()),
        }),
    ],
});
exports.default = logger;
//# sourceMappingURL=winston-logger.js.map