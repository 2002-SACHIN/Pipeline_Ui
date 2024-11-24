import { LucideIcon } from 'lucide-react';

interface DraggableNodeProps {
  type: string;
  label: string;
  Icon: LucideIcon;
}

export const DraggableNode = ({ type, label, Icon }: DraggableNodeProps) => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    const appData = { nodeType };
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing min-w-[100px]"
      onDragStart={(event) => onDragStart(event, type)}
      draggable
    >
      <Icon className="w-6 h-6 mb-1 text-gray-700" />
      <span className="text-sm font-medium text-gray-900">{label}</span>
    </div>
  );
};