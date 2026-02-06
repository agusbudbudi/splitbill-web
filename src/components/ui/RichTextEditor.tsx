"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import "react-quill-new/dist/quill.snow.css";

// Dynamic import to avoid SSR issues with Quill
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <div className="h-40 bg-muted/20 animate-pulse rounded-md" />,
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  className,
}: RichTextEditorProps) {
  const modules = useMemo(
    () => ({
      toolbar: [
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "clean"],
      ],
    }),
    [],
  );

  return (
    <div className={`rich-text-editor ${className}`}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder}
        className="bg-background text-foreground rounded-md"
      />
      <style jsx global>{`
        :global(.rich-text-editor .ql-toolbar) {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          border: 1px solid hsl(var(--primary) / 0.1) !important;
          background-color: hsl(var(--muted) / 0.3) !important;
        }
        :global(.rich-text-editor .ql-container) {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          border: 1px solid hsl(var(--primary) / 0.1) !important;
          border-top: none !important;
          font-family: inherit !important;
          font-size: 0.875rem !important;
          background-color: hsl(var(--background)) !important;
          color: hsl(var(--foreground)) !important;
        }
        .ql-editor {
          min-height: 100px;
        }
        .ql-editor.ql-blank::before {
          font-style: normal;
          color: hsl(var(--muted-foreground));
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
}
