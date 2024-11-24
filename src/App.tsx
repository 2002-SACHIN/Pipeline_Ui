import { PipelineToolbar } from './components/PipelineToolbar';
import { PipelineUI } from './components/PipelineUI';
import { SubmitButton } from './components/SubmitButton';

function App() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-3">
          <h1 className="text-xl font-semibold text-gray-900">Pipeline Builder</h1>
        </div>
      </header>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <PipelineToolbar />
        <div className="flex-1 overflow-hidden">
          <PipelineUI />
        </div>
        <div className="p-4 border-t border-gray-200 bg-white">
          <SubmitButton />
        </div>
      </div>
    </div>
  );
}

export default App;