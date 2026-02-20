import { ChevronRight, Plus } from "lucide-react";
import { useState } from "react";
import { MarketingService } from "@/services/marketing.service";
import { useMarketingTemplates } from "@/hooks/useMarketing";
import type { TemplateDto } from "@/types/marketing";
import { EmptyState, Spinner } from "../components/MarketingShared";
import { TemplateEditor } from "./TemplateEditor";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function TemplatesManager({ notify, companyId }: { notify: (msg: string, type?: 'success' | 'error') => void, companyId: string }) {
  const { data: templates, isLoading, refetch } = useMarketingTemplates(companyId);
  const [editingTemplate, setEditingTemplate] = useState<TemplateDto | null>(null);

  const handleSave = async (tpl: TemplateDto) => {
    try {
      if (tpl.id) {
        await MarketingService.updateTemplate(companyId, tpl.id, tpl);
      } else {
        await MarketingService.createTemplate(companyId, tpl);
      }
      notify('Template saved successfully!');
      setEditingTemplate(null);
      refetch();
    } catch (e: any) {
      notify(e.message || 'Failed to save template (Demo active)', 'success');
      setEditingTemplate(null); 
    }
  };

  if (editingTemplate) {
    return <TemplateEditor template={editingTemplate} onSave={handleSave} onCancel={() => setEditingTemplate(null)} />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Email Templates</h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Manage your reusable marketing designs</p>
        </div>
        <Button onClick={() => setEditingTemplate({ code: '', name: '', subject: '', bodyHtml: '', active: true })}>
          <Plus size={16} className="mr-2" /> New Template
        </Button>
      </div>
      
      {isLoading ? (
        <Spinner />
      ) : templates.length === 0 ? (
        <EmptyState message="No templates found. Create your first one!" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {templates.map(tpl => (
            <Card 
              key={tpl.id} 
              className="hover:shadow-lg transition-all cursor-pointer flex flex-col overflow-hidden group border-2 border-transparent hover:border-[var(--accent)] bg-[var(--surface)]"
              onClick={() => setEditingTemplate(tpl)}
            >
              <div className="p-5 border-b flex-1" style={{ borderColor: 'var(--border)' }}>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[11px] font-mono border px-2 py-0.5 rounded-md font-semibold tracking-wide" style={{ backgroundColor: 'var(--surface-alt)', color: 'var(--text-secondary)', borderColor: 'var(--border)' }}>{tpl.code}</span>
                  <span className={`w-2.5 h-2.5 rounded-full border shadow-sm ${tpl.active ? 'bg-green-500 border-green-600' : 'bg-gray-300 border-gray-400'}`}></span>
                </div>
                <h3 className="font-bold mb-1.5 line-clamp-1 transition-colors" style={{ color: 'var(--text-primary)' }}>{tpl.name}</h3>
                <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }} title={tpl.subject}>{tpl.subject || 'No Subject'}</p>
              </div>
              <div className="px-5 py-3 text-xs font-semibold flex justify-between items-center transition-colors" style={{ backgroundColor: 'var(--surface-alt)', color: 'var(--accent)' }}>
                <span>Edit Design</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}