import { THROTTLER_LIMIT, THROTTLER_SKIP, THROTTLER_TTL } from './throttler.constants';

function setThrottlerMetadata(target: any, limit: number, ttl: number): void {
  Reflect.defineMetadata(THROTTLER_TTL, ttl, target);
  Reflect.defineMetadata(THROTTLER_LIMIT, limit, target);
}

/**
 * Adds metadata to the target which will be handled by the ThrottlerGuard to
 * handle incoming requests based on the given metadata.
 * @usage @Throttle(2, 10)
 * @publicApi
 */
export const Throttle = (limit = 20, ttl = 60): MethodDecorator & ClassDecorator => {
  return (
    target: any,
    propertyKey?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ) => {
    if (descriptor) {
      setThrottlerMetadata(descriptor.value, limit, ttl);
      return descriptor;
    }
    setThrottlerMetadata(target, limit, ttl);
    return target;
  };
};

/**
 * Adds metadata to the target which will be handled by the ThrottlerGuard
 * whether or not to skip throttling for this context.
 * @usage @SkipThrottle()
 * @usage @SkipThrottle(false)
 * @publicApi
 */
export const SkipThrottle = (skip = true): MethodDecorator & ClassDecorator => {
  return (
    target: any,
    propertyKey?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ) => {
    if (descriptor) {
      Reflect.defineMetadata(THROTTLER_SKIP, skip, descriptor.value);
      return descriptor;
    }
    Reflect.defineMetadata(THROTTLER_SKIP, skip, target);
    return target;
  };
};
