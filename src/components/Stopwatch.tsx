import React, { useEffect } from 'react'
import type { IStopwatch } from '../models/models'

interface StopwatchProps {
  stopwatch: IStopwatch;
  setStopwatches: React.Dispatch<React.SetStateAction<IStopwatch[]>>;
}

export default function Stopwatch({ stopwatch, setStopwatches }: StopwatchProps) {
  const [currentStopwatch, setCurrentStopwatch] = React.useState(stopwatch);
  const [intervalId, setIntervalId] = React.useState<number | null>(null);
  const [cleared, setCleared] = React.useState(false);

  useEffect(() => {
    let interval: number | null = null;

    if (currentStopwatch.status === 'idle' && intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
      setStopwatches(prev => prev.map(s => s.id === currentStopwatch.id ? { ...currentStopwatch } : s));
    } else if (currentStopwatch.status === 'idle' && cleared) {
      setStopwatches(prev => prev.map(s => s.id === currentStopwatch.id ? { ...currentStopwatch } : s));
      setCleared(false);
    } else if (currentStopwatch.status === 'running') {
      const startTime = Date.now() - currentStopwatch.elapsedTime;
      interval = window.setInterval(() => {
        setCurrentStopwatch(prev => ({ ...prev, elapsedTime: Date.now() - startTime }));
        setStopwatches(prev => prev.map(s => s.id === currentStopwatch.id ? { ...s, elapsedTime: Date.now() - startTime } : s));
      }, 100);
      setIntervalId(interval);
    } else if (currentStopwatch.status === 'paused' && intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [currentStopwatch.status]);

  return (
    <div className="stopwatch-card">
      <div className="delete-button">
        <button
          onClick={() =>
            setStopwatches((prev) => prev.filter((s) => s.id !== stopwatch.id))
          }
        >
          X
        </button>
      </div>
      <div className="time-display">
        {new Date(stopwatch.elapsedTime).toISOString().substr(11, 8)}
      </div>
      <div className="control-buttons">
        {currentStopwatch.status === "idle" && intervalId === null && (
          <div className="start-button">
            <button
              onClick={() =>
                setCurrentStopwatch((prev) => ({ ...prev, status: "running" }))
              }
            >
              Start
            </button>
          </div>
        )}
        {currentStopwatch.status === "running" && (
          <div className="buttons">
            <button
              className='pause-button'
              onClick={() =>
                setCurrentStopwatch((prev) => ({ ...prev, status: "paused" }))
              }
            >
              Pause
            </button>
            <button
              className='clear-button'
              onClick={() => {
                setCurrentStopwatch((prev) => ({ ...prev, status: "idle", elapsedTime: 0 }));
              }}
            >
              Clear
            </button>
          </div>
        )}
        {currentStopwatch.status === "paused" && (
          <div className="buttons">
            <button
              className='resume-button'
              onClick={() =>
                setCurrentStopwatch((prev) => ({ ...prev, status: "running" }))
              }
            >
              Resume
            </button>
            <button
              className='clear-button'
              onClick={() => {
                setCurrentStopwatch((prev) => ({ ...prev, status: "idle", elapsedTime: 0 }));
                setCleared(true);
              }}
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
