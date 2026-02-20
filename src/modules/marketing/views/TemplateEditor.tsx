import { ArrowLeft, LayoutTemplate, Loader2 } from "lucide-react";
import { useState } from "react";
import type { TemplateDto } from "@/types/marketing";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function TemplateEditor({ template, onSave, onCancel }: { template: TemplateDto, onSave: (t: TemplateDto) => void, onCancel: () => void }) {
  const [edited, setEdited] = useState<TemplateDto>(template);
  const [isSaving, setIsSaving] = useState(false);

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] min-h-[600px] animate-in slide-in-from-bottom-4 duration-300">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <button onClick={onCancel} className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--surface)'}>
             <ArrowLeft size={16} />
          </button>
          <div>
            <h2 className="font-bold text-xl tracking-tight" style={{ color: 'var(--text-primary)' }}>{edited.id ? `Editing Template: ${edited.name}` : 'Create New Template'}</h2>
          </div>
        </div>
        <Button 
          onClick={async () => { setIsSaving(true); await onSave(edited); setIsSaving(false); }} 
          disabled={isSaving}
        >
          {isSaving && <Loader2 size={16} className="animate-spin mr-2" />}
          {isSaving ? 'Saving...' : 'Save Template'}
        </Button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        {/* LEFT PANEL */}
        <Card className="w-full lg:w-1/2 flex flex-col overflow-hidden">
          <div className="p-5 flex flex-col space-y-5 h-full overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-2 gap-4 flex-shrink-0">
              <div>
                <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Internal Name</label>
                <input type="text" value={edited.name} onChange={e => setEdited({...edited, name: e.target.value})} className="w-full rounded-lg px-3 py-2 outline-none text-sm transition-all border focus:border-[var(--accent)]" style={{ backgroundColor: 'var(--surface-alt)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} placeholder="e.g. Black Friday" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Unique Code</label>
                <input type="text" value={edited.code} onChange={e => setEdited({...edited, code: e.target.value})} className="w-full rounded-lg px-3 py-2 outline-none font-mono text-sm transition-all uppercase border focus:border-[var(--accent)]" style={{ backgroundColor: 'var(--surface-alt)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} placeholder="PROMO_01" />
              </div>
            </div>

            <div className="flex-shrink-0">
              <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Email Subject</label>
              <input type="text" value={edited.subject} onChange={e => setEdited({...edited, subject: e.target.value})} className="w-full rounded-lg px-3 py-2 outline-none text-sm transition-all border focus:border-[var(--accent)]" style={{ backgroundColor: 'var(--surface-alt)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} placeholder="e.g. Don't miss out, {{name}}!" />
            </div>

            <div className="flex-1 flex flex-col min-h-[300px]">
              <div className="flex justify-between items-center mb-2 flex-shrink-0">
                <label className="block text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>HTML Source</label>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border" style={{ backgroundColor: 'var(--info-bg)', color: 'var(--info-text)', borderColor: 'var(--info)' }}>Liquid Syntax</span>
              </div>
              <textarea 
                value={edited.bodyHtml} 
                onChange={e => setEdited({...edited, bodyHtml: e.target.value})}
                className="w-full flex-1 rounded-xl p-4 font-mono text-sm outline-none resize-none leading-relaxed shadow-inner border focus:border-[var(--accent)]"
                style={{ backgroundColor: 'var(--surface-alt)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
                spellCheck="false"
                placeholder="<html>...</html>"
              />
            </div>
          </div>
        </Card>

        {/* RIGHT PANEL: Live Preview */}
        <Card className="w-full lg:w-1/2 flex flex-col overflow-hidden" style={{ backgroundColor: 'var(--surface-hover)' }}>
          <div className="p-4 border-b flex justify-between items-center bg-white dark:bg-black" style={{ borderColor: 'var(--border)' }}>
             <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Live Preview</span>
          </div>
          <div className="flex-1 p-0 overflow-hidden relative bg-white">
            {edited.bodyHtml ? (
               <iframe 
                 title="preview"
                 className="w-full h-full border-0"
                 srcDoc={edited.bodyHtml}
               />
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center space-y-3">
                  <LayoutTemplate size={48} className="mx-auto opacity-20" style={{ color: 'var(--text-secondary)' }} />
                  <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Start typing HTML to see preview</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}