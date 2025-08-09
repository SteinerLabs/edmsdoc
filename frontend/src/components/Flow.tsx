import { useEdgesState, useNodesState, Background, ReactFlow, ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import { AnimatedEdge } from './AnimatedEdge';

const edgeTypes = { animatedEdge: AnimatedEdge };

export function Flow() {
  const initialNodes = [
    { id: '1', position: { x: 50, y: 200 }, data: { label: 'Service A' }, type: 'default' },
    { id: '2', position: { x: 350, y: 200 }, data: { label: 'Service B' }, type: 'default' },
  ];

  const initialEdges = [
    { id: 'e1-2', source: '1', target: '2', type: 'animatedEdge', data: { eventName: 'Event 1'} },
  ];

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <ReactFlowProvider>
      <div style={{ width: '100%', height: '600px'}}>
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
