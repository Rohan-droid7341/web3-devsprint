"use client";

import React, { useState } from "react";
import { Modal } from "./Modal";
import { getGistContent } from "@/app/admin/actions";
import { ExternalLink, Loader2, FileText, Link as LinkIcon } from "lucide-react";

interface TaskViewProps {
  levelTitle: string;
  gistUrl: string;
}

export const TaskView: React.FC<TaskViewProps> = ({ levelTitle, gistUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpen = async () => {
    setIsOpen(true);
    if (!content) {
      setIsLoading(true);
      const fetchedContent = await getGistContent(gistUrl);
      setContent(fetchedContent);
      setIsLoading(false);
    }
  };

  const isUrl = (text: string) => {
    try {
      new URL(text.trim());
      return true;
    } catch (_) {
      return false;
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-primary" size={48} />
          <p className="text-gray-500 uppercase tracking-widest font-black text-xs">Decrypting Arena Data...</p>
        </div>
      );
    }

    if (!content) return null;

    const trimmedContent = content.trim();
    const isSingleUrl = isUrl(trimmedContent);

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-3 text-primary mb-2">
          {isSingleUrl ? <LinkIcon size={20} /> : <FileText size={20} />}
          <span className="uppercase font-black tracking-widest text-xs">
            {isSingleUrl ? 'External Access Node' : 'Decrypted Task Protocol'}
          </span>
        </div>

        <div className="bg-white/5 p-10 rounded-2xl border border-white/5 relative group">
          {isSingleUrl ? (
            <div className="flex flex-col items-center gap-6 py-4">
              <p className="text-gray-400 text-center italic">The task resource is located outside the arena's perimeter.</p>
              <a 
                href={trimmedContent} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="gold-button !px-12 flex items-center gap-3"
              >
                ACCESS EXTERNAL RESOURCE <ExternalLink size={18} />
              </a>
            </div>
          ) : (
            <pre className="text-white text-xl font-medium leading-relaxed whitespace-pre-wrap font-mono selection:bg-primary selection:text-black">
              {trimmedContent}
            </pre>
          )}
        </div>
        
        <p className="text-gray-600 text-xs text-center uppercase tracking-[0.2em] pt-4">
          Strictly Confidential &bull; Physical Presence Verification Required
        </p>
      </div>
    );
  };

  return (
    <>
      <button 
        onClick={handleOpen}
        className="gold-button !py-3 !px-8 text-sm flex items-center gap-2 group active:scale-95 transition-transform"
      >
        DISCOVER TASK <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
      </button>

      <Modal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        title={`${levelTitle} Task`}
      >
        {renderContent()}
      </Modal>
    </>
  );
};
