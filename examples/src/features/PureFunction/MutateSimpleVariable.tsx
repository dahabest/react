function Cup({ guest }: { guest: number }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export function MutateSimpleVariable() {
  let cups = [];
  for (let i = 1; i <= 10; i++) {
    cups.push(<Cup key={i} guest={i} />);
  }
  return cups;
}
