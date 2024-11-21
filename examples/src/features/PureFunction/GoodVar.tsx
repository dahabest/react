import { useState } from "react";

function Cup({ guest }: { guest: number }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export function GoodVar() {
  const [key, setKey] = useState(0);
  return (
    <>
      <div>
        <h1>Pure Function {key}</h1>
        <button onClick={() => setKey(key + 1)}>Render</button>
      </div>
      <Cup guest={1} />
      <Cup guest={2} />
      <Cup guest={3} />
    </>
  );
}

/**
* Result:
    Tea cup for guest #2
    Tea cup for guest #4
    Tea cup for guest #6
 */
