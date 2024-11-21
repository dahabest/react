import { Fragment, useState } from "react";

let guest = 0;

function Cup() {
  // Bad: changing a preexisting variable!
  guest = guest + 1;
  return <h2>Tea cup for guest #{guest}</h2>;
}

export function PreexistingVar() {
  const [key, setKey] = useState(0);

  return (
    <Fragment key={key}>
      <div>
        <h1>Not Pure Function {key}</h1>
        <button onClick={() => setKey(key + 1)}>Render</button>
      </div>
      <Cup />
      <Cup />
      <Cup />
    </Fragment>
  );
}

/**
* Result:
    Tea cup for guest #2
    Tea cup for guest #4
    Tea cup for guest #6
 */
