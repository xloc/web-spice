import type Parser from 'web-tree-sitter';
import _ from 'lodash';

export interface Device {
  id: string;
  type: string;

  // x: number;
  // y: number;
  // rotation: number;

  nodes: string[];
}

export interface Net {
  id: string;
}

export class Circuit {
  devices: Device[];
  nets: Net[];

  constructor() {
    this.devices = [];
    this.nets = [];
  }

  static fromTree(tree: Parser.Tree): Circuit {
    const circuit = new Circuit();

    const instanceLines = tree.rootNode.descendantsOfType('instance_line');
    circuit.devices = instanceLines.map(instanceLine => {
      const type = instanceLine.childForFieldName('device_type')!.text;
      const name = instanceLine.childForFieldName('device_name')!.text;
      const nodes = instanceLine.descendantsOfType('node').map(node => node.text)

      if (!type || !name) throw new Error('Invalid device');


      const device: Device = {
        id: type + name,
        type: type,
        nodes: nodes
        // type: instanceLine.childForFieldName('device')!.text,
        // x: Number(instanceLine.childForFieldName('x')!.text),
        // y: Number(instanceLine.childForFieldName('y')!.text),
        // rotation: Number(instanceLine.childForFieldName('rotation')!.text),
      };

      return device;
    });

    circuit.nets = _(circuit.devices).flatMap(device => device.nodes).uniq().map(node => ({ id: node })).value();

    return circuit;
  }

}