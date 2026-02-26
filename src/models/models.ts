type SwStatus = 'idle' | 'running' | 'paused';

export enum StopwatchStatus {
  IDLE = 'idle',
  RUNNING = 'running',
  PAUSED = 'paused'
}

export interface IStopwatch {
  id: number;
  elapsedTime: number; // in milliseconds
  status: SwStatus;
}