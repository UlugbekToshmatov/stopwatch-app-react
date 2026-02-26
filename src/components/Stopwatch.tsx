import React, { useEffect, useRef, useState } from 'react'
import { StopwatchStatus, type IStopwatch } from '../models/models'

interface StopwatchProps {
  stopwatch: IStopwatch;
  setStopwatches: React.Dispatch<React.SetStateAction<IStopwatch[]>>;
}

export default function Stopwatch({ stopwatch, setStopwatches }: StopwatchProps) {
  const [currentStopwatch, setCurrentStopwatch] = useState(stopwatch);
  const intervalId = useRef<number | undefined>(undefined);

  useEffect(() => {
    console.count(`Current Stopwatch: ${currentStopwatch.id}, Status: ${currentStopwatch.status}`);

    if (currentStopwatch.status === StopwatchStatus.IDLE && intervalId.current) {
      console.count(`Clearing interval for Stopwatch ID: ${currentStopwatch.id}`);

      clearInterval(intervalId.current);  // Safe even if already cleared
      intervalId.current = undefined;
      setStopwatches(prev => prev.map(s => s.id === currentStopwatch.id ? { ...currentStopwatch } : s));
    } else if (currentStopwatch.status === StopwatchStatus.RUNNING) {
      const startTime = Date.now() - currentStopwatch.elapsedTime;
      intervalId.current = window.setInterval(() => {
        setCurrentStopwatch(prev => ({ ...prev, elapsedTime: Date.now() - startTime }));
        setStopwatches(prev => prev.map(s => s.id === currentStopwatch.id ? { ...currentStopwatch, elapsedTime: Date.now() - startTime } : s));
      }, 100);
    } else if (currentStopwatch.status === StopwatchStatus.PAUSED) {
      clearInterval(intervalId.current);
    }

    return () => {
      clearInterval(intervalId.current);  // Safe even if already cleared
    };
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
        {currentStopwatch.status === StopwatchStatus.IDLE &&
          intervalId.current === undefined && (
            <div className="start-button">
              <button
                onClick={() =>
                  setCurrentStopwatch((prev) => ({
                    ...prev,
                    status: StopwatchStatus.RUNNING,
                  }))
                }
              >
                Start
              </button>
            </div>
          )}
        <div className="buttons">
          {currentStopwatch.status === StopwatchStatus.RUNNING && (
            <button
              className="pause-button"
              onClick={() =>
                setCurrentStopwatch((prev) => ({ ...prev, status: StopwatchStatus.PAUSED }))
              }
            >
              Pause
            </button>
          )}
          {currentStopwatch.status === StopwatchStatus.PAUSED && (
            <button
              className="resume-button"
              onClick={() =>
                setCurrentStopwatch((prev) => ({ ...prev, status: StopwatchStatus.RUNNING }))
              }
            >
              Resume
            </button>
          )}
          {(currentStopwatch.status === StopwatchStatus.RUNNING ||
            currentStopwatch.status === StopwatchStatus.PAUSED) && (
              <button
                className="clear-button"
                onClick={() => {
                  setCurrentStopwatch((prev) => ({
                    ...prev,
                    status: StopwatchStatus.IDLE,
                    elapsedTime: 0,
                  }));
                }}
              >
                Clear
              </button>
            )}
        </div>
      </div>
    </div>
  );
}
