"use client";

import React, { useState } from "react";
import { Modal } from "./Modal";
import { getGistContent } from "@/app/admin/actions";
import { ExternalLink, Loader2, FileText, Link as LinkIcon } from "lucide-react";
import { McqQuiz } from "./McqQuiz";

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
    } catch {
      return false;
    }
  };

  const renderContent = () => {
    if (levelTitle === "The Genesis") {
      return <McqQuiz />;
    }

    if (isLoading) {
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem 0", gap: "1rem" }}>
          <Loader2 className="animate-spin" size={48} style={{ color: "var(--primary)" }} />
          <p style={{ color: "#666", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 900, fontSize: "0.75rem" }}>Decrypting Arena Data...</p>
        </div>
      );
    }

    if (!content) return null;

    const trimmedContent = content.trim();
    const isSingleUrl = isUrl(trimmedContent);

    return (
      <div>
        {/* Label */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--primary)", marginBottom: "1.5rem" }}>
          {isSingleUrl ? <LinkIcon size={20} /> : <FileText size={20} />}
          <span style={{ textTransform: "uppercase", fontWeight: 900, letterSpacing: "0.15em", fontSize: "0.75rem" }}>
            {isSingleUrl ? "External Access Link" : "Decrypted Task Protocol"}
          </span>
        </div>

        {/* Content box */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          padding: "2rem",
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.05)",
        }}>
          {isSingleUrl ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", padding: "1rem 0" }}>
              <p style={{ color: "#888", textAlign: "center", fontStyle: "italic" }}>The task resource is located outside the arena.</p>
              <a
                href={trimmedContent}
                target="_blank"
                rel="noopener noreferrer"
                className="gold-button"
                style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem" }}
              >
                ACCESS EXTERNAL RESOURCE <ExternalLink size={18} />
              </a>
            </div>
          ) : (
            <pre style={{
              color: "#fff",
              fontSize: "1.15rem",
              fontWeight: 500,
              lineHeight: 1.8,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              fontFamily: "'Outfit', monospace",
            }}>
              {trimmedContent}
            </pre>
          )}
        </div>

        <p style={{
          color: "#444",
          fontSize: "0.7rem",
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          marginTop: "2rem",
        }}>
          Strictly Confidential &bull; Physical Presence Verification Required
        </p>
      </div>
    );
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="gold-button"
        style={{ fontSize: "0.75rem", padding: "0.5rem 1.5rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
      >
        DISCOVER TASK <ExternalLink size={18} />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={`${levelTitle} — Task`}
      >
        {renderContent()}
      </Modal>
    </>
  );
};
