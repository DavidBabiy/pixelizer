import * as log4js from 'log4js';


log4js.configure({
    appenders:{
        out: {
            type: 'stdout',
            layout: {
                type: process.env.NODE_ENV === 'local' ? 'colored' : 'pattern',
                pattern: '[%p] - %m',
            }
        }},
            categories: {
                default: {appenders: ['out'], level: process.env.LOG_LEVEL || 'debug'},
                pixelizer: {appenders: ['out'], level: process.env.LOG_LEVEL || 'debug'}
            } }

);

export const logger = log4js.getLogger('pixelizer');