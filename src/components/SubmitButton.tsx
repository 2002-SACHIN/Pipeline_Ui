import { useState } from 'react';
import { useStore } from '../store/store';
import toast, { Toaster } from 'react-hot-toast';

export const SubmitButton = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitPipeline = useStore((state: any) => state.submitPipeline);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitPipeline();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-lg 
          hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
          focus:ring-offset-2 transition-colors disabled:opacity-50 
          disabled:cursor-not-allowed disabled:hover:bg-blue-600"
      >
        {isSubmitting ? 'Processing...' : 'Submit Pipeline'}
      </button>
      <Toaster position="bottom-right" />
    </>
  );
};