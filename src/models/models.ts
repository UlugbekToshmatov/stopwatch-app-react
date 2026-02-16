type SwStatus = 'idle' | 'running' | 'paused';

export interface IStopwatch {
  id: number;
  elapsedTime: number; // in milliseconds
  status: SwStatus;
}