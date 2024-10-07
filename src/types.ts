import type { VariableType, RealDataType } from "./sim/readOutput";


export interface Variable {
  name: string;
  type: VariableType;
  color?: string;
  data: RealDataType[number];
  // data: RealDataType[number] | ComplexDataType[number];
}