import type { VariableType, RealDataType, ComplexDataType } from "./sim/readOutput";


export interface Variable {
  name: string;
  type: VariableType;
  data: RealDataType[number] | ComplexDataType[number];
}