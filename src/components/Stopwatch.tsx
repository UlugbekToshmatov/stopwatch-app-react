import React, { useEffect, useRef } from 'react'
import { StopwatchStatus, type IStopwatch } from '../models/models'

interface StopwatchProps {
  stopwatch: IStopwatch;
  setStopwatches: React.Dispatch<React.SetStateAction<IStopwatch[]>>;
}

function Stopwatch({ stopwatch, setStopwatches }: StopwatchProps) {
  const intervalId = useRef<number | undefined>(undefined);


  console.count(`Rendering Stopwatch ID: ${stopwatch.id}, Status: ${stopwatch.status}`);

  useEffect(() => {
    console.count(`Current Stopwatch: ${stopwatch.id}, Status: ${stopwatch.status}`);

    if (stopwatch.status === StopwatchStatus.IDLE && intervalId.current) {
      console.count(`Clearing interval for Stopwatch ID: ${stopwatch.id}`);

      clearInterval(intervalId.current);  // Safe even if already cleared
      intervalId.current = undefined;
      setStopwatches(prev => prev.map(s => s.id === stopwatch.id ? { ...stopwatch } : s));
    } else if (stopwatch.status === StopwatchStatus.RUNNING) {
      const startTime = Date.now() - stopwatch.elapsedTime;
      intervalId.current = window.setInterval(() => {
        setStopwatches(prev => prev.map(s => s.id === stopwatch.id ? { ...s, elapsedTime: Date.now() - startTime } : s));
      }, 100);
    } else if (stopwatch.status === StopwatchStatus.PAUSED) {
      clearInterval(intervalId.current);
    }

    return () => {
      clearInterval(intervalId.current);  // Safe even if already cleared
    };
  }, [stopwatch.status]);

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
        {stopwatch.status === StopwatchStatus.IDLE &&
          intervalId.current === undefined && (
            <div className="start-button">
              <button
                onClick={() =>
                  setStopwatches(prev => prev.map(s => s.id === stopwatch.id ? { ...s, status: StopwatchStatus.RUNNING } : s))
                }
              >
                Start
              </button>
            </div>
          )}
        <div className="buttons">
          {stopwatch.status === StopwatchStatus.RUNNING && (
            <button
              className="pause-button"
              onClick={() =>
                setStopwatches(prev => prev.map(s => s.id === stopwatch.id ? { ...s, status: StopwatchStatus.PAUSED } : s))
              }
            >
              Pause
            </button>
          )}
          {stopwatch.status === StopwatchStatus.PAUSED && (
            <button
              className="resume-button"
              onClick={() =>
                setStopwatches(prev => prev.map(s => s.id === stopwatch.id ? { ...s, status: StopwatchStatus.RUNNING } : s))
              }
            >
              Resume
            </button>
          )}
          {(stopwatch.status === StopwatchStatus.RUNNING ||
            stopwatch.status === StopwatchStatus.PAUSED) && (
              <button
                className="clear-button"
                onClick={() => {
                  setStopwatches(prev => prev.map(s => s.id === stopwatch.id ? { ...s, status: StopwatchStatus.IDLE, elapsedTime: 0 } : s));
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

export default React.memo(Stopwatch);