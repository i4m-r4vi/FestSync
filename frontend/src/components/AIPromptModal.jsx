import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles, X, RefreshCw, Check } from 'lucide-react';

export default function AIPromptModal({ isOpen, onClose, onSubmit, initialPrompt = "", isGenerating, onGenerate }) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [generatedDescription, setGeneratedDescription] = useState("");
  const [view, setView] = useState('prompting');

  useEffect(() => {
    if (isOpen) {
      setPrompt(initialPrompt);
      setView('prompting');
      setGeneratedDescription("");
    }
  }, [isOpen, initialPrompt]);
  
  useEffect(() => {
    if (isGenerating === false && generatedDescription) {
      setView('reviewing');
    }
  }, [isGenerating, generatedDescription]);


  const handleGenerateClick = () => {
    onGenerate(prompt, (result) => {
        setGeneratedDescription(result);
    });
  };

  const handleConfirm = () => {
    onSubmit(generatedDescription);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100] p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-card border border-border rounded-xl shadow-xl p-6 w-full max-w-lg"
              >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <Sparkles className="text-primary"/>
                        Generate Description with AI
                    </h3>
                    <button onClick={handleClose} className="p-1 rounded-full hover:bg-secondary">
                        <X size={20} className="text-muted-foreground"/>
                    </button>
                </div>

                {view === 'prompting' && (
                  <>
                    <p className="text-muted-foreground mb-4">
                        Enter a prompt for the AI to generate a compelling event description. You can include keywords, tone, and key details.
                    </p>

                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g., A fun and interactive workshop for beginners in React..."
                      className="w-full bg-input text-foreground border-border border p-3 rounded-lg min-h-[120px] focus:ring-2 focus:ring-ring transition"
                    />
                  </>
                )}

                {isGenerating && (
                    <div className="min-h-[120px] flex flex-col items-center justify-center bg-input/50 rounded-lg">
                        <Loader2 className="animate-spin text-primary" size={24}/>
                        <p className="text-muted-foreground mt-2">Generating description...</p>
                    </div>
                )}

                {view === 'reviewing' && !isGenerating && (
                    <textarea
                      value={generatedDescription}
                      onChange={(e) => setGeneratedDescription(e.target.value)}
                      className="w-full bg-input text-foreground border-border border p-3 rounded-lg min-h-[120px] focus:ring-2 focus:ring-ring transition"
                    />
                )}

                <div className="flex justify-end gap-4 mt-6">
                    {view === 'prompting' && (
                        <>
                            <button
                                onClick={handleClose}
                                className="bg-secondary text-secondary-foreground px-5 py-2 rounded-lg hover:bg-border transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleGenerateClick}
                                disabled={isGenerating || !prompt}
                                className="bg-primary text-primary-foreground px-5 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-colors"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18}/>
                                        Generating...
                                    </>
                                ) : "Generate"}
                            </button>
                        </>
                    )}
                    {view === 'reviewing' && !isGenerating && (
                         <>
                            <button
                                onClick={() => setView('prompting')}
                                className="bg-secondary text-secondary-foreground px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-border disabled:opacity-50 transition-colors"
                            >
                                Edit Prompt
                            </button>
                             <button
                                onClick={handleConfirm}
                                className="bg-primary text-primary-foreground px-5 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-colors"
                            >
                                <Check size={18}/>
                                Use this Description
                            </button>
                        </>
                    )}
                </div>
              </motion.div>
            </div>
        )}
    </AnimatePresence>
  );
}
