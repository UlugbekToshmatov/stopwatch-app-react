import { useState, useEffect, useRef } from 'react'
import { StopwatchStatus, type IStopwatch } from './models/models';
import NewStopwatch from './components/NewStopwatch';

export default function NewApp() {
  const [stopwatches, setStopwatches] = useState<IStopwatch[]>([]);
  const intervalId = useRef<number | undefined>(undefined);

  useEffect(() => {
    console.count(`Current number of running stopwatches: ${stopwatches.filter(sw => sw.status === StopwatchStatus.RUNNING).length}`);
    console.count(`Interval ID before: ${intervalId.current}`);

    if (stopwatches.filter(sw => sw.status === StopwatchStatus.RUNNING).length > 0) {
      intervalId.current = setInterval(() => {
        setStopwatches((prev) =>
          prev.map((sw) =>
            sw.status === StopwatchStatus.RUNNING
              ? { ...sw, elapsedTime: sw.elapsedTime + 100 }
              : sw,
          ),
        );
      }, 100);
    } else {
      clearInterval(intervalId.current);
      intervalId.current = undefined;
    }

    console.count(`Interval ID after: ${intervalId.current}`);

    return () => {
      clearInterval(intervalId.current);
      intervalId.current = undefined;
    };
  }, [stopwatches.filter(sw => sw.status === StopwatchStatus.RUNNING).length]);

  return (
    <main>
      <header className="header">
        <button
          onClick={() =>
            setStopwatches((prev) => [
              ...prev,
              { id: Date.now(), elapsedTime: 0, status: StopwatchStatus.IDLE },
            ])
          }
        >
          + Add Stopwatch
        </button>
      </header>
      <section className="container">
        {stopwatches.length > 0 ? (
          stopwatches.map((stopwatch) => (
            <NewStopwatch
              key={stopwatch.id}
              stopwatchId={stopwatch.id}
              stopwatchStatus={stopwatch.status}
              stopwatchElapsedTime={stopwatch.elapsedTime}
              setStopwatches={setStopwatches}
            />
          ))
        ) : (
          <p>No stopwatches yet. Click the button above to add one!</p>
        )}
      </section>
    </main>
  );
}
