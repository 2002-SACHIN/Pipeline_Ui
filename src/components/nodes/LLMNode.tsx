import { Handle, Position } from 'reactflow';
import { MessageSquare } from 'lucide-react';

export const LLMNode = ({ data }: { data: any }) => {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-3 shadow-lg min-w-[200px]">
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="w-5 h-5 text-gray-700" />
        <div className="font-medium text-gray-900">LLM Node</div>
      </div>
      <div className="mb-3">
        <select
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={data.model || 'gpt-3.5-turbo'}
          onChange={(e) => data.onChange?.('model', e.target.value)}
        >
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          <option value="gpt-4">GPT-4</option>
        </select>
      </div>
      <div className="mb-3">
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter system prompt..."
          rows={3}
          value={data.systemPrompt || ''}
          onChange={(e) => data.onChange?.('systemPrompt', e.target.value)}
        />
      </div>
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
    </div>
  );
};