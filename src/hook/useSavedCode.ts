import { useStorage } from "@vueuse/core"


const DEFUALT_CODE = `
Ring Oscillator

.include modelcard.CMOS90

m1 out1 vg1 0 0 N90 W=10.0u L=0.09u M=10
m2 out1 vg1 vdd vdd P90 W=10.0u L=0.09u M=10

m3 out2 out1 0 0 N90 W=10.0u L=0.09u M=10
m4 out2 out1 vdd vdd P90 W=10.0u L=0.09u M=10

m5 vg1 out2 0 0 N90 W=10.0u L=0.09u M=10
m6 vg1 out2 vdd vdd P90 W=10.0u L=0.09u M=10

c1 out1 0 0.1p
c2 out2 0 0.1p
c3 vg1 0 0.1p

vdd vdd 0 1.8

.tran  1p 2n

.end 
`.trim();

export const useSavedCode = () => {
  return useStorage('saved-code', DEFUALT_CODE);
}