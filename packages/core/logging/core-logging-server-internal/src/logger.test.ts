/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { LogLevel, Appender } from '@kbn/logging';
import { LoggingConfig } from './logging_config';
import { BaseLogger } from './logger';

const context = LoggingConfig.getLoggerContext(['context', 'parent', 'child']);
let appenderMocks: Appender[];
let logger: BaseLogger;
const factory = {
  get: jest.fn().mockImplementation(() => logger),
};

const timestamp = new Date(2012, 1, 1);
beforeEach(() => {
  jest.spyOn<any, any>(global, 'Date').mockImplementation(() => timestamp);

  appenderMocks = [{ append: jest.fn() }, { append: jest.fn() }];
  logger = new BaseLogger(context, LogLevel.All, appenderMocks, factory);
});

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

test('`trace()` correctly forms `LogRecord` and passes it to all appenders.', () => {
  logger.trace('message-1');
  for (const appenderMock of appenderMocks) {
    expect(appenderMock.append).toHaveBeenCalledTimes(1);
    expect(appenderMock.append).toHaveBeenCalledWith({
      context,
      error: undefined,
      level: LogLevel.Trace,
      message: 'message-1',
      meta: undefined,
      timestamp,
      pid: expect.any(Number),
    });
  }

  // @ts-expect-error ECS custom meta
  logger.trace('message-2', { trace: true });
  for (const appenderMock of appenderMocks) {
    expect(appenderMock.append).toHaveBeenCalledTimes(2);
    expect(appenderMock.append).toHaveBeenCalledWith({
      context,
      error: undefined,
      level: LogLevel.Trace,
      message: 'message-2',
      meta: { trace: true },
      timestamp,
      pid: expect.any(Number),
    });
  }
});

test('`debug()` correctly forms `LogRecord` and passes it to all appenders.', () => {
  logger.debug('message-1');
  for (const appenderMock of appenderMocks) {
    expect(appenderMock.append).toHaveBeenCalledTimes(1);
    expect(appenderMock.append).toHaveBeenCalledWith({
      context,
      error: undefined,
      level: LogLevel.Debug,
      message: 'message-1',
      meta: undefined,
      timestamp,
      pid: expect.any(Number),
    });
  }

  // @ts-expect-error ECS custom meta
  logger.debug('message-2', { debug: true });
  for (const appenderMock of appenderMocks) {
    expect(appenderMock.append).toHaveBeenCalledTimes(2);
    expect(appenderMock.append).toHaveBeenCalledWith({
      context,
      error: undefined,
      level: LogLevel.Debug,
      message: 'message-2',
      meta: { debug: true },
      timestamp,
      pid: expect.any(Number),
    });
  }
});

test('`info()` correctly forms `LogRecord` and passes it to all appenders.', () => {
  logger.info('message-1');
  for (const appenderMock of appenderMocks) {
    expect(appenderMock.append).toHaveBeenCalledTimes(1);
    expect(appenderMock.append).toHaveBeenCalledWith({
      context,
      error: undefined,
      level: LogLevel.Info,
      message: 'message-1',
      meta: undefined,
      timestamp,
      pid: expect.any(Number),
    });
  }

  // @ts-expect-error ECS custom meta
  logger.info('message-2', { info: true });
  for (const appenderMock of appenderMocks) {
    expect(appenderMock.append).toHaveBeenCalledTimes(2);
    expect(appenderMock.append).toHaveBeenCalledWith({
      context,
      error: undefined,
      level: LogLevel.Info,
      message: 'message-2',
      meta: { info: true },
      timestamp,
      pid: expect.any(Number),
    });
  }
});

test('`warn()` correctly forms `LogRecord` and passes it to all appenders.', () => {
  logger.warn('message-1');
  for (const appenderMock of appenderMocks) {
    expect(appenderMock.append).toHaveBeenCalledTimes(1);
    expect(appenderMock.append).toHaveBeenCalledWith({
      context,
      error: undefined,
      level: LogLevel.Warn,
      message: 'message-1',
      meta: undefined,
      timestamp,
      pid: expect.any(Number),
    });
  }

  const error = new Error('message-2');
  logger.warn(error);
  for (const appenderMock of appenderMocks) {
    expect(appenderMock.append).toHaveBeenCalledTimes(2);
    expect(appenderMock.append).toHaveBeenCalledWith({
      context,
      error,
      level: LogLevel.Warn,
      message: 'message-2',
      meta: undefined,
      timestamp,
      pid: expect.any(Number),
    });
  }

  // @ts-expect-error ECS custom meta
  logger.warn('message-3', { warn: true });
  for (const appenderMock of appenderMocks) {
    expect(appenderMock.append).toHaveBeenCalledTimes(3);
    expect(appenderMock.append).toHaveBeenCalledWith({
      context,
      error: undefined,
      level: LogLevel.Warn,
      message: 'message-3',
      meta: { warn: true },
      timestamp,
      pid: expect.any(Number),
    });
  }
});

test('`error()` correctly forms `LogRecord` and passes it to all appenders.', () => {
  logger.error('message-1');
  for (const appenderMock of appenderMocks) {
    expect(appenderMock.append).toHaveBeenCalledTimes(1);
    expect(appenderMock.append).toHaveBeenCalledWith({
      context,
      error: undefined,
      level: LogLevel.Error,
      message: 'message-1',
      meta: undefined,
      timestamp,
      pid: expect.any(Number),
    });
  }

  const error = new Error('message-2');
  logger.error(error);
  for (const appenderMock of appenderMocks) {
    expect(appenderMock.append).toHaveBeenCalledTimes(2);
    expect(appenderMock.append).toHaveBeenCalledWith({
      context,
      error,
      level: LogLevel.Error,
      message: 'message-2',
      meta: undefined,
      timestamp,
      pid: expect.any(Number),
    });
  }

  // @ts-expect-error ECS custom meta
  logger.error('message-3', { error: true });
  for (const appenderMock of appenderMocks) {
    expect(appenderMock.append).toHaveBeenCalledTimes(3);
    expect(appenderMock.append).toHaveBeenCalledWith({
      context,
      error: undefined,
      level: LogLevel.Error,
      message: 'message-3',
      meta: { error: true },
      timestamp,
      pid: expect.any(Number),
    });
  }
});

test('`fatal()` correctly forms `LogRecord` and passes it to all appenders.', () => {
  logger.fatal('message-1');
  for (const appenderMock of appenderMocks) {
    expect(appenderMock.append).toHaveBeenCalledTimes(1);
    expect(appenderMock.append).toHaveBeenCalledWith({
      context,
      error: undefined,
      level: LogLevel.Fatal,
      message: 'message-1',
      meta: undefined,
      timestamp,
      pid: expect.any(Number),
    });
  }

  const error = new Error('message-2');
  logger.fatal(error);
  for (const appenderMock of appenderMocks) {
    expect(appenderMock.append).toHaveBeenCalledTimes(2);
    expect(appenderMock.append).toHaveBeenCalledWith({
      context,
      error,
      level: LogLevel.Fatal,
      message: 'message-2',
      meta: undefined,
      timestamp,
      pid: expect.any(Number),
    });
  }

  // @ts-expect-error ECS custom meta
  logger.fatal('message-3', { fatal: true });
  for (const appenderMock of appenderMocks) {
    expect(appenderMock.append).toHaveBeenCalledTimes(3);
    expect(appenderMock.append).toHaveBeenCalledWith({
      context,
      error: undefined,
      level: LogLevel.Fatal,
      message: 'message-3',
      meta: { fatal: true },
      timestamp,
      pid: expect.any(Number),
    });
  }
});

test('`log()` just passes the record to all appenders.', () => {
  const record = {
    context,
    level: LogLevel.Info,
    message: 'message-1',
    timestamp,
    pid: 5355,
  };

  logger.log(record);

  for (const appenderMock of appenderMocks) {
    expect(appenderMock.append).toHaveBeenCalledTimes(1);
    expect(appenderMock.append).toHaveBeenCalledWith(record);
  }
});

test('`get()` calls the logger factory with proper context and return the result', () => {
  logger.get('sub', 'context');
  expect(factory.get).toHaveBeenCalledTimes(1);
  expect(factory.get).toHaveBeenCalledWith(context, 'sub', 'context');

  factory.get.mockClear();
  factory.get.mockImplementation(() => 'some-logger');

  const childLogger = logger.get('other', 'sub');
  expect(factory.get).toHaveBeenCalledTimes(1);
  expect(factory.get).toHaveBeenCalledWith(context, 'other', 'sub');
  expect(childLogger).toEqual('some-logger');
});

test('logger with `Off` level does not pass any records to appenders.', () => {
  const turnedOffLogger = new BaseLogger(context, LogLevel.Off, appenderMocks, factory);
  turnedOffLogger.trace('trace-message');
  turnedOffLogger.debug('debug-message');
  turnedOffLogger.info('info-message');
  turnedOffLogger.warn('warn-message');
  turnedOffLogger.error('error-message');
  turnedOffLogger.fatal('fatal-message');

  for (const appenderMock of appenderMocks) {
    expect(appenderMock.append).not.toHaveBeenCalled();
  }
});

test('logger with `All` level passes all records to appenders.', () => {
  const catchAllLogger = new BaseLogger(context, LogLevel.All, appenderMocks, factory);

  catchAllLogger.trace('trace-message');
  for (const appenderMock of appenderMocks) {
    expect(appenderMock.append).toHaveBeenCalledTimes(1);
    expect(appenderMock.append).toHaveBeenCalledWith({
      context,
      level: LogLevel.Trace,
      message: 'trace-message',
      timestamp,
      pid: expect.any(Number),
    });
  }

  catchAllLogger.debug('debug-message');
  for (const appenderMock of appenderMocks) {
    expect(appenderMock.append).toHaveBeenCalledTimes(2);
    expect(appenderMock.append).toHaveBeenCalledWith({
      context,
      level: LogLevel.Debug,
      message: 'debug-message',
      timestamp,
      pid: expect.any(Number),
    });
  }

  catchAllLogger.info('info-message');
  for (const appenderMock of appenderMocks) {
    expect(appenderMock.append).toHaveBeenCalledTimes(3);
    expect(appenderMock.append).toHaveBeenCalledWith({
      context,
      level: LogLevel.Info,
      message: 'info-message',
      timestamp,
      pid: expect.any(Number),
    });
  }

  catchAllLogger.warn('warn-message');
  for (const appenderMock of appenderMocks) {
    expect(appenderMock.append).toHaveBeenCalledTimes(4);
    expect(appenderMock.append).toHaveBeenCalledWith({
      context,
      level: LogLevel.Warn,
      message: 'warn-message',
      timestamp,
      pid: expect.any(Number),
    });
  }

  catchAllLogger.error('error-message');
  for (const appenderMock of appenderMocks) {
    expect(appenderMock.append).toHaveBeenCalledTimes(5);
    expect(appenderMock.append).toHaveBeenCalledWith({
      context,
      level: LogLevel.Error,
      message: 'error-message',
      timestamp,
      pid: expect.any(Number),
    });
  }

  catchAllLogger.fatal('fatal-message');
  for (const appenderMock of appenderMocks) {
    expect(appenderMock.append).toHaveBeenCalledTimes(6);
    expect(appenderMock.append).toHaveBeenCalledWith({
      context,
      level: LogLevel.Fatal,
      message: 'fatal-message',
      timestamp,
      pid: expect.any(Number),
    });
  }
});

test('passes log record to appenders only if log level is supported.', () => {
  const warnLogger = new BaseLogger(context, LogLevel.Warn, appenderMocks, factory);

  warnLogger.trace('trace-message');
  warnLogger.debug('debug-message');
  warnLogger.info('info-message');

  for (const appenderMock of appenderMocks) {
    expect(appenderMock.append).not.toHaveBeenCalled();
  }

  warnLogger.warn('warn-message');
  for (const appenderMock of appenderMocks) {
    expect(appenderMock.append).toHaveBeenCalledTimes(1);
    expect(appenderMock.append).toHaveBeenCalledWith({
      context,
      level: LogLevel.Warn,
      message: 'warn-message',
      timestamp,
      pid: expect.any(Number),
    });
  }

  warnLogger.error('error-message');
  for (const appenderMock of appenderMocks) {
    expect(appenderMock.append).toHaveBeenCalledTimes(2);
    expect(appenderMock.append).toHaveBeenCalledWith({
      context,
      level: LogLevel.Error,
      message: 'error-message',
      timestamp,
      pid: expect.any(Number),
    });
  }

  warnLogger.fatal('fatal-message');
  for (const appenderMock of appenderMocks) {
    expect(appenderMock.append).toHaveBeenCalledTimes(3);
    expect(appenderMock.append).toHaveBeenCalledWith({
      context,
      level: LogLevel.Fatal,
      message: 'fatal-message',
      timestamp,
      pid: expect.any(Number),
    });
  }
});

describe('isLevelEnabled', () => {
  const orderedLogLevels = [
    LogLevel.Fatal,
    LogLevel.Error,
    LogLevel.Warn,
    LogLevel.Info,
    LogLevel.Debug,
    LogLevel.Trace,
    LogLevel.All,
  ];

  for (const logLevel of orderedLogLevels) {
    it(`returns the correct value for a '${logLevel.id}' level logger`, () => {
      const levelLogger = new BaseLogger(context, logLevel, appenderMocks, factory);
      for (const level of orderedLogLevels) {
        const levelEnabled = logLevel.supports(level);
        expect(levelLogger.isLevelEnabled(level.id)).toEqual(levelEnabled);
      }
    });
  }
});
