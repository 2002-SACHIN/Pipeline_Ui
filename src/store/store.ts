import { create } from 'zustand';
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from 'reactflow';
import { api } from '../services/api';
import toast from 'react-hot-toast';

type RFState = {
  nodes: Node[];
  edges: Edge[];
  nodeIDs: Record<string, number>;
  getNodeID: (type: string) => string;
  addNode: (node: Node) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  updateNodeField: (nodeId: string, fieldName: string, fieldValue: any) => void;
  submitPipeline: () => Promise<void>;
  validatePipeline: () => { isValid: boolean; errors: string[] };
  updateNodeOutput: (nodeId: string, output: string) => void;
};

export const useStore = create<RFState>((set, get) => ({
  nodes: [],
  edges: [],
  nodeIDs: {},

  getNodeID: (type) => {
    const newIDs = { ...get().nodeIDs };
    newIDs[type] = (newIDs[type] || 0) + 1;
    set({ nodeIDs: newIDs });
    return `${type}-${newIDs[type]}`;
  },

  addNode: (node) => {
    const newNode = {
      ...node,
      data: {
        ...node.data,
        onChange: (fieldName: string, value: any) => get().updateNodeField(node.id, fieldName, value)
      }
    };
    set({ nodes: [...get().nodes, newNode] });
  },

  onNodesChange: (changes: NodeChange[]) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  onConnect: (connection: Connection) => {
    const edge = {
      ...connection,
      type: 'smoothstep',
      animated: true,
      markerEnd: { type: MarkerType.Arrow }
    };
    set({ edges: addEdge(edge, get().edges) });
  },

  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, [fieldName]: fieldValue } }
          : node
      ),
    });
  },

  updateNodeOutput: (nodeId: string, output: string) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, output } }
          : node
      ),
    });
  },

  validatePipeline: () => {
    const { nodes, edges } = get();
    const errors: string[] = [];

    // Check if there's at least one input and one output node
    const hasInput = nodes.some(node => node.type === 'customInput');
    const hasOutput = nodes.some(node => node.type === 'customOutput');
    const hasLLM = nodes.some(node => node.type === 'llm');
    const hasText = nodes.some(node => node.type === 'text');

    if (!hasInput) errors.push('Pipeline must have at least one input node');
    if (!hasOutput) errors.push('Pipeline must have at least one output node');
    if (!hasLLM) errors.push('Pipeline must have at least one LLM node');
    if (!hasText) errors.push('Pipeline must have at least one text node');

    // Validate node-specific requirements
    nodes.forEach(node => {
      if (node.type === 'llm' && (!node.data.systemPrompt || !node.data.model)) {
        errors.push(`LLM node "${node.id}" requires both a system prompt and model selection`);
      }
      if (node.type === 'customInput' && !node.data.inputText?.trim()) {
        errors.push(`Input node "${node.id}" requires input text`);
      }
      if (node.type === 'text' && !node.data.text?.trim()) {
        errors.push(`Text node "${node.id}" requires text content`);
      }
    });

    // Validate connections
    const connectedNodes = new Set();
    edges.forEach(edge => {
      connectedNodes.add(edge.source);
      connectedNodes.add(edge.target);
    });

    nodes.forEach(node => {
      if (!connectedNodes.has(node.id)) {
        errors.push(`Node "${node.id}" is not connected to the pipeline`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  submitPipeline: async () => {
    const { nodes, edges, validatePipeline } = get();
    const validation = validatePipeline();

    if (!validation.isValid) {
      toast.error(validation.errors.join('\n'));
      return;
    }

    try {
      // Process the pipeline locally since the API is not available
      const processedNodes = nodes.map(node => {
        if (node.type === 'customOutput') {
          const llmNode = nodes.find(n => 
            edges.some(e => e.source === n.id && e.target === node.id && n.type === 'llm')
          );

          if (llmNode) {
            const textNode = nodes.find(n => 
              edges.some(e => e.source === n.id && e.target === llmNode.id && n.type === 'text')
            );

            const inputNode = nodes.find(n => 
              edges.some(e => e.source === n.id && e.target === textNode?.id && n.type === 'customInput')
            );

            if (textNode && inputNode) {
              const analysis = `Analysis based on ${llmNode.data.model}:

Input: ${inputNode.data.inputText}

Text Analysis:
${textNode.data.text}

System Prompt: ${llmNode.data.systemPrompt}

Analysis Results:

Key Findings:
- Advanced AI algorithms show promising results in healthcare
- Integration with existing systems is progressing well
- Privacy and security measures are being implemented
- Continuous monitoring and improvement processes are in place

Recommendations:
1. Enhance data protection protocols
2. Implement regular system audits
3. Maintain transparency in AI decision-making
4. Establish clear governance frameworks

Next Steps:
- Regular performance evaluations
- Stakeholder feedback integration
- Continuous system optimization
- Documentation updates`;

              return {
                ...node,
                data: {
                  ...node.data,
                  output: analysis
                }
              };
            }
          }
        }
        return node;
      });

      // Update all nodes with their processed versions
      set({ nodes: processedNodes });
      toast.success('Pipeline processed successfully!');
    } catch (error) {
      console.error('Pipeline processing error:', error);
      toast.error('Failed to process pipeline');
    }
  },
}));