import { isComplex, ResultArrayType, SimArray } from "./sim/simulationArray";


const netList = `Basic RLC circuit 
.include modelcard.CMOS90

r vdd 2 100.0
l vdd 2 1
c vdd 2 0.01
m1 2 1 0 0 N90 W=100.0u L=0.09u
vdd vdd 0 1.8

vin 1 0 0 pulse (0 1.8 0 0.1 0.1 15 30)
.tran 0.1 50

.end


`;
export const runSimulation = async () => {
  const nProcess = 1;

  const sim = new SimArray();
  await sim.init(nProcess);
  sim.progressCallback = (progress: number) => { };
  sim.setNetList(netList);
  const resultArray = await sim.runSim();
  console.log("runSimulation ->", resultArray);



}