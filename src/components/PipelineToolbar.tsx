import { DraggableNode } from './DraggableNode';
import { MessageSquare, Database, ArrowRightCircle, Type } from 'lucide-react';

export const PipelineToolbar = () => {
  const nodes = [
    { type: 'customInput', label: 'Input', icon: Database },
    { type: 'llm', label: 'LLM', icon: MessageSquare },
    { type: 'customOutput', label: 'Output', icon: ArrowRightCircle },
    { type: 'text', label: 'Text', icon: Type }
  ];

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex flex-wrap gap-4">
        {nodes.map((node) => (
          <DraggableNode 
            key={node.type}
            type={node.type}
            label={node.label}
            Icon={node.icon}
          />
        ))}
      </div>
    </div>
  );
};