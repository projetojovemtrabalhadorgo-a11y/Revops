import React from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownReportProps {
  content: string;
}

export default function MarkdownReport({ content }: MarkdownReportProps) {
  return (
    <div className="bg-[#0f0f0f] border border-white/10 rounded-lg p-5 shadow-inner max-h-[600px] overflow-y-auto" id="markdown-report-container">
      <div className="text-slate-200 text-xs leading-relaxed space-y-3
        [&>h1]:text-base [&>h1]:font-display [&>h1]:font-bold [&>h1]:text-white [&>h1]:border-b [&>h1]:border-white/10 [&>h1]:pb-2 [&>h1]:mt-5 [&>h1]:mb-3 [&>h1]:uppercase [&>h1]:tracking-wide
        [&>h2]:text-xs [&>h2]:font-display [&>h2]:font-bold [&>h2]:text-orange-500 [&>h2]:mt-4 [&>h2]:mb-2 [&>h2]:flex [&>h2]:items-center [&>h2]:gap-1.5 [&>h2]:uppercase [&>h2]:tracking-wider
        [&>h3]:text-[11px] [&>h3]:font-bold [&>h3]:text-slate-300 [&>h3]:mt-3 [&>h3]:mb-1
        [&>p]:text-slate-300 [&>p]:my-2 [&>p]:leading-relaxed
        [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:my-2.5 [&>ul]:space-y-1 [&>ul_li]:text-slate-300
        [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:my-2.5 [&>ol]:space-y-1 [&>ol_li]:text-slate-300
        [&>table]:w-full [&>table]:border-collapse [&>table]:my-3 [&>table]:border [&>table]:border-white/10 [&>table]:rounded [&>table]:overflow-hidden
        [&>table_thead]:bg-[#050505] [&>table_th]:text-slate-300 [&>table_th]:font-semibold [&>table_th]:text-[10px] [&>table_th]:p-2 [&>table_th]:border-b [&>table_th]:border-white/10 [&>table_th]:text-left [&>table_th]:uppercase [&>table_th]:tracking-wider
        [&>table_tr]:border-b [&>table_tr]:border-white/5 [&>table_tr:hover]:bg-white/5
        [&>table_td]:p-2 [&>table_td]:text-slate-300 [&>table_td]:text-[11px] [&>table_td]:font-mono
        [&_strong]:text-orange-400 [&_strong]:font-semibold
        [&_code]:bg-[#050505] [&_code]:text-amber-400 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-[10px]
        [&_blockquote]:border-l-2 [&_blockquote]:border-orange-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-400 [&_blockquote]:my-3"
      >
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
