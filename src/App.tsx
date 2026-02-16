import { useState } from "react";
import type { IStopwatch } from "./models/models";
import Stopwatch from "./components/Stopwatch";

function App() {
  const [stopwatches, setStopwatches] = useState<IStopwatch[]>([]);

  return (
    <main>
      <header className="header">
        <button onClick={() => setStopwatches(prev => [...prev, { id: Date.now(), elapsedTime: 0, status: 'idle' }])}>+ Add Stopwatch</button>
      </header>
      <section className="container">
        {stopwatches.length > 0 ? stopwatches.map((stopwatch) => (
          <Stopwatch
            key={stopwatch.id}
            stopwatch={stopwatch}
            setStopwatches={setStopwatches}
          />
        )) : <p>No stopwatches yet. Click the button above to add one!</p>}
      </section>
    </main>
  );
}

export default App;
