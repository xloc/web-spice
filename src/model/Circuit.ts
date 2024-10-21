import type Parser from 'web-tree-sitter';
import _ from 'lodash';
import * as d3 from 'd3';

export interface Device {
  id: string;
  type: string;

  x: number;
  y: number;
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
        nodes: nodes,
        x: 0,
        y: 0,
        // rotation: Number(instanceLine.childForFieldName('rotation')!.text),
      };
      return device;
    });
    circuit.nets = _(circuit.devices).flatMap(device => device.nodes).uniq().map(node => ({ id: node })).value();

    return circuit;
  }

  getLinks(): [number, number][] {
    const nodeToDeviceIndex = new Map<string, number[]>();
    this.devices.forEach((device, index) => {
      device.nodes.forEach(node => {
        if (!nodeToDeviceIndex.has(node))
          nodeToDeviceIndex.set(node, []);
        nodeToDeviceIndex.get(node)!.push(index);
      });
    });

    const links: [number, number][] = [];
    this.nets.forEach(net => {
      const deviceIndices = nodeToDeviceIndex.get(net.id);
      if (!deviceIndices || deviceIndices.length < 2) return;
      for (let i = 0; i < deviceIndices.length; i++)
        for (let j = i + 1; j < deviceIndices.length; j++)
          links.push([deviceIndices[i], deviceIndices[j]]);
    });
    return links;
  }

  static colorMap: Record<string, string> = {
    'R': d3.schemeTableau10[0],
    C: d3.schemeTableau10[1],
    'L': d3.schemeTableau10[2],
    V: d3.schemeTableau10[3],
    Q: d3.schemeTableau10[4],
  }

}