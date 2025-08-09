import {
  Background,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import { AnimatedEdge } from './AnimatedEdge';

const edgeTypes = { animatedEdge: AnimatedEdge };

export function Flow() {
  const initialNodes = [
    {
      id: '1',
      position: { x: 50, y: 200 },
      data: { label: 'Service A' },
      type: 'default'
    },
    {
      id: '2',
      position: { x: 350, y: 200 },
      data: { label: 'Service B' },
      type: 'default'
    },
    {
      id: '3',
      position: { x: 250, y: 300 },
      data: { label: 'Service C' },
      type: 'default'
    }
  ];

  const initialEdges = [
    { id: 'e1-2', source: '1', target: '2', type: 'animatedEdge' },
    { id: 'e1-3', source: '1', target: '3', type: 'animatedEdge' },
    { id: 'e2-3', source: '2', target: '3', type: 'animatedEdge' }
  ];

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <ReactFlowProvider>
      <div style={{ width: '100%', height: '600px' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          edgeTypes={edgeTypes}
          fitView
        >
          <Background />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}
