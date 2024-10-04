import { isComplex, ResultArrayType, SimArray } from "./sim/simulationArray";

export const runSimulation = async (code: string) => {
  const nProcess = 2

  const sim = new SimArray();
  await sim.init(nProcess);
  sim.progressCallback = (progress: number) => { };
  sim.setNetList(code);
  const resultArray = await sim.runSim();
  console.log("runSimulation ->", resultArray);
  return resultArray;
}