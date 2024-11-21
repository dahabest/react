import { GoodVar } from "./GoodVar";
import { PreexistingVar } from "./PreexistingVar";

export function PureFunction() {
  const ex1 = (
    <>
      <PreexistingVar />
      <GoodVar />
    </>
  );

  return ex1;
}
