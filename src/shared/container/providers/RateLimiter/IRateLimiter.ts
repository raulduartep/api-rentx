interface IRateLimiter {
  verify(ip: string): Promise<void>;
}

export { IRateLimiter };
