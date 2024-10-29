import type Parser from 'web-tree-sitter';
import _ from 'lodash';
import * as d3 from 'd3';
import { editor, Range } from 'monaco-editor';
import { Edit, SyntaxNode } from 'web-tree-sitter';
import { MaybeRefOrGetter, ref, shallowRef, toValue, watch, watchEffect } from 'vue';

export interface Device {
  nodeID: string;
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
  tree?: Parser.Tree;

  onDidChange?: (circuit: Circuit) => void;

  constructor(public parser: Parser, public model: editor.ITextModel) {
    this.devices = [];
    this.nets = [];
  }

  updateTree(code: string, changes?: editor.IModelContentChange[]) {
    if (!this.tree || !changes) {
      this.tree = this.parser.parse(code);
    } else {
      const tree = this.tree;
      changes.forEach(change => {
        tree.edit(buildEditFromChange(change, this.model))
      });
      this.tree = this.parser.parse(code, tree);
    }
    this.updateDevices(this.tree);

    // emit change event
    this.onDidChange?.(this);
  }

  updateDevices(tree: Parser.Tree) {
    const instanceLines = tree.rootNode.descendantsOfType('instance_line');
    this.devices = instanceLines.map(buildDevice);
    this.nets = _(this.devices).flatMap(device => device.nodes).uniq().map(node => ({ id: node })).value();
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
    R: d3.schemeTableau10[0],
    C: d3.schemeTableau10[1],
    L: d3.schemeTableau10[2],
    V: d3.schemeTableau10[3],
    Q: d3.schemeTableau10[4],
  }

}

const buildEditFromChange = (change: editor.IModelContentChange, model: editor.ITextModel): Edit => {
  const range = Range.lift(change.range);
  const start = model.getOffsetAt(range.getStartPosition());
  const end = model.getOffsetAt(range.getEndPosition());
  return {
    startIndex: start - 1,
    oldEndIndex: end - 1,
    newEndIndex: end - 1,
    startPosition: { row: range.startLineNumber - 1, column: range.startColumn - 1 },
    oldEndPosition: { row: range.endLineNumber - 1, column: range.endColumn - 1 },
    newEndPosition: { row: range.endLineNumber - 1, column: range.endColumn - 1 },
  }
}

const buildDevice = (node: SyntaxNode): Device => {
  const type = node.childForFieldName('device_type')!.text;
  const name = node.childForFieldName('device_name')!.text;
  const nodes = node.descendantsOfType('node').map(node => node.text)
  if (!type || !name) throw new Error('Invalid device');

  const device: Device = {
    nodeID: node.id.toString(),
    id: type + name,
    type: type,
    nodes: nodes,
    x: 0,
    y: 0,
  };
  return device;
}


interface UseCircuitOptions {
  parser: MaybeRefOrGetter<Parser | undefined>;
  code: MaybeRefOrGetter<string>;
}

export const useCircuit = (options: UseCircuitOptions) => {
  const circuit = shallowRef<Circuit | null>(null);
  const model = shallowRef<editor.ITextModel>();
  const editor = shallowRef<editor.IStandaloneCodeEditor>();

  // output
  const devices = ref<Device[]>([]);
  const renderCircuitChange = (c: Circuit) => {
    devices.value = c.devices;
  }

  // initialze circuit
  watch([circuit, model, options.parser], () => {
    const parser = toValue(options.parser)
    if (circuit.value) return; // already initialized
    if (!model.value || !parser) return; // wait for model and parser

    circuit.value = new Circuit(parser, model.value);
    circuit.value.onDidChange = renderCircuitChange;
  });

  // update circuit on didChangeModelContent event
  watch(() => editor.value, () => {
    if (!editor.value) return;

    editor.value.onDidChangeModelContent(changeEvent => {
      if (!circuit.value) return;
      circuit.value.updateTree(toValue(options.code), changeEvent.changes);
    });
  });

  // init tree from initial code
  const codeWatcher = watchEffect(() => {
    const code = toValue(options.code);
    if (!code || !circuit.value) return;
    circuit.value.updateTree(code);
    codeWatcher.stop();
  });

  return { circuit, devices, model, editor };
}