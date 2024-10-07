import { isComplex, ResultArrayType, SimArray } from "./sim/simulationArray";

export const runSimulation = async (code: string) => {
  const nProcess = 1

  const sim = new SimArray();
  await sim.init(nProcess);
  sim.progressCallback = (_progress: number) => { };
  sim.setNetList(code);
  const resultArray = await sim.runSim();
  return resultArray;
}