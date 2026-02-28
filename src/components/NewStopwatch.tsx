import React, { memo } from 'react'
import { StopwatchStatus, type IStopwatch, type SwStatus } from "../models/models";

interface NewStopwatchProps {
  stopwatchId: number;
  stopwatchStatus: SwStatus;
  stopwatchElapsedTime: number;
  setStopwatches: React.Dispatch<React.SetStateAction<IStopwatch[]>>;
}

function NewStopwatch({stopwatchId, stopwatchStatus, stopwatchElapsedTime, setStopwatches}: NewStopwatchProps) {
  console.count(`Rendering Stopwatch ID: ${stopwatchId}, Status: ${stopwatchStatus}`);

  return (
    <div className="stopwatch-card">
      <div className="delete-button">
        <button
          onClick={() =>
            setStopwatches((prev) => prev.filter((s) => s.id !== stopwatchId))
          }
        >
          X
        </button>
      </div>
      <div className="time-display">
        {new Date(stopwatchElapsedTime).toISOString().substr(11, 8)}
      </div>
      <div className="control-buttons">
        {stopwatchStatus === StopwatchStatus.IDLE && (
          <div className="start-button">
            <button
              onClick={() =>
                setStopwatches((prev) =>
                  prev.map((s) =>
                    s.id === stopwatchId
                      ? { ...s, status: StopwatchStatus.RUNNING }
                      : s,
                  ),
                )
              }
            >
              Start
            </button>
          </div>
        )}
        <div className="buttons">
          {stopwatchStatus === StopwatchStatus.RUNNING && (
            <button
              className="pause-button"
              onClick={() =>
                setStopwatches((prev) =>
                  prev.map((s) =>
                    s.id === stopwatchId
                      ? { ...s, status: StopwatchStatus.PAUSED }
                      : s,
                  ),
                )
              }
            >
              Pause
            </button>
          )}
          {stopwatchStatus === StopwatchStatus.PAUSED && (
            <button
              className="resume-button"
              onClick={() =>
                setStopwatches((prev) =>
                  prev.map((s) =>
                    s.id === stopwatchId
                      ? { ...s, status: StopwatchStatus.RUNNING }
                      : s,
                  ),
                )
              }
            >
              Resume
            </button>
          )}
          {(stopwatchStatus === StopwatchStatus.RUNNING ||
            stopwatchStatus === StopwatchStatus.PAUSED) && (
            <button
              className="clear-button"
              onClick={() => {
                setStopwatches((prev) =>
                  prev.map((s) =>
                    s.id === stopwatchId
                      ? { ...s, status: StopwatchStatus.IDLE, elapsedTime: 0 }
                      : s,
                  ),
                );
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

export default memo(NewStopwatch);