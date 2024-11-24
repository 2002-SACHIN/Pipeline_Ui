import { Handle, Position } from 'reactflow';
import { ArrowRightCircle } from 'lucide-react';

export const OutputNode = ({ data }: { data: any }) => {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-3 shadow-lg min-w-[200px]">
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      <div className="flex items-center gap-2 mb-3">
        <ArrowRightCircle className="w-5 h-5 text-gray-700" />
        <div className="font-medium text-gray-900">Output Node</div>
      </div>
      <div className="p-2 bg-gray-50 rounded-md min-h-[100px] whitespace-pre-wrap">
        {data.output || 'Output will appear here...'}
      </div>
    </div>
  );
};