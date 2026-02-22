import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useActiveContext } from '@/hooks/useScope';
import { MarketingService } from '@/services/marketing.service';
import type { TemplateDto } from '@/types/marketing';
import { ArrowLeft, LayoutTemplate, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Spinner } from '../components/MarketingShared';

export function TemplateEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { companyId } = useActiveContext();
  const isNew = id === 'new';

  const [edited, setEdited] = useState<TemplateDto>({ code: '', name: '', subject: '', bodyHtml: '', active: true });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew && companyId) {
      MarketingService.getTemplate(companyId, Number(id)).then(res => {
        setEdited(res);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [id, companyId, isNew]);

  const handleSave = async () => {
    if (!companyId) return;
    setSaving(true);
    try {
      if (isNew) {
        await MarketingService.createTemplate(companyId, edited);
      } else {
        await MarketingService.updateTemplate(companyId, edited.id!, edited);
      }
      navigate('..');
    } catch (e: any) {
      alert('Error: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] min-h-[600px] animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('..')} className="w-8 h-8 flex items-center justify-center rounded-lg border transition-colors hover:bg-black/5 dark:hover:bg-white/5" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
             <ArrowLeft size={16} />
          </button>
          <h2 className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>
            {isNew ? 'Create New Template' : 'Editing: ' + edited.name}
          </h2>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 size={16} className="animate-spin mr-2" />} Save Template
        </Button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        {/* Editor */}
        <Card className="w-full lg:w-1/2 flex flex-col overflow-hidden">
          <div className="p-5 flex flex-col space-y-5 h-full overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-2 gap-4 flex-shrink-0">
              <div>
                <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Internal Name</label>
                <input type="text" value={edited.name} onChange={e => setEdited({...edited, name: e.target.value})} className="w-full rounded-lg px-3 py-2 outline-none text-sm border focus:border-[var(--accent)]" style={{ backgroundColor: 'var(--surface-alt)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Unique Code</label>
                <input type="text" value={edited.code} onChange={e => setEdited({...edited, code: e.target.value})} className="w-full rounded-lg px-3 py-2 outline-none font-mono text-sm uppercase border focus:border-[var(--accent)]" style={{ backgroundColor: 'var(--surface-alt)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
              </div>
            </div>
            <div className="flex-shrink-0">
              <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Email Subject</label>
              <input type="text" value={edited.subject} onChange={e => setEdited({...edited, subject: e.target.value})} className="w-full rounded-lg px-3 py-2 outline-none text-sm border focus:border-[var(--accent)]" style={{ backgroundColor: 'var(--surface-alt)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            </div>
            <div className="flex-1 flex flex-col min-h-[300px]">
              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>HTML Source (Liquid Syntax)</label>
              <textarea value={edited.bodyHtml} onChange={e => setEdited({...edited, bodyHtml: e.target.value})} className="w-full flex-1 rounded-xl p-4 font-mono text-sm outline-none resize-none shadow-inner border focus:border-[var(--accent)]" style={{ backgroundColor: 'var(--surface-alt)', color: 'var(--text-primary)', borderColor: 'var(--border)' }} spellCheck="false" />
            </div>
          </div>
        </Card>

        {/* Preview */}
        <Card className="w-full lg:w-1/2 flex flex-col overflow-hidden" style={{ backgroundColor: 'var(--surface-hover)' }}>
          <div className="p-4 border-b text-xs font-bold uppercase tracking-wider" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>Live Preview</div>
          <div className="flex-1 bg-white overflow-hidden relative">
            {edited.bodyHtml ? (
               <iframe title="preview" className="w-full h-full border-0" srcDoc={edited.bodyHtml} />
            ) : (
              <div className="flex h-full items-center justify-center text-center">
                <div><LayoutTemplate size={48} className="mx-auto opacity-20 mb-3 text-gray-500" /><p className="text-sm font-medium text-gray-500">Start typing HTML to see preview</p></div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
