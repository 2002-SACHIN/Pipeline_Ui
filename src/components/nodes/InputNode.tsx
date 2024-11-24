import { Handle, Position } from 'reactflow';
import { Database } from 'lucide-react';

export const InputNode = ({ data }: { data: any }) => {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-3 shadow-lg min-w-[200px]">
      <div className="flex items-center gap-2 mb-3">
        <Database className="w-5 h-5 text-gray-700" />
        <div className="font-medium text-gray-900">Input Node</div>
      </div>
      <div className="mb-3">
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter input text..."
          rows={3}
          value={data.inputText || ''}
          onChange={(e) => data.onChange?.('inputText', e.target.value)}
        />
      </div>
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
    </div>
  );
};