import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useMarketingTemplates } from '@/hooks/useMarketing';
import { useActiveContext } from '@/hooks/useScope';
import { MarketingService } from '@/services/marketing.service';
import { ArrowLeft, Loader2, Play } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function CampaignLauncher() {
  const navigate = useNavigate();
  const { companyId } = useActiveContext();
  const { data: templates } = useMarketingTemplates(companyId);
  
  const [name, setName] = useState('');
  const [templateId, setTemplateId] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!name || !templateId) {
      setError('Please provide a name and select a template.');
      return;
    }
    setLoading(true);
    try {
      const res = await MarketingService.createDraft(companyId!, {
        name, templateId, audienceFilter: { tags: [], minSpent: 0, customerType: 'ALL' }
      });
      navigate(`../${res.id}`); // Navigate back to the created campaign details
    } catch (err: any) {
      setError(err.message || 'Error creating campaign draft');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6 animate-in slide-in-from-bottom-4 duration-300">
      <button onClick={() => navigate('..')} className="text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-4">
        <ArrowLeft size={16} /> Back to Campaigns
      </button>
      <h1 className="text-2xl font-bold text-gray-900">Create Campaign Draft</h1>
      
      {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

      <Card className="p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Campaign Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border rounded-lg p-2.5 outline-none transition-all focus:border-[var(--accent)]" style={{ backgroundColor: 'var(--surface-alt)', borderColor: 'var(--border)' }} placeholder="e.g. Summer Sale 2026" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Select Template</label>
          <select value={templateId} onChange={e => setTemplateId(Number(e.target.value))} className="w-full border rounded-lg p-2.5 outline-none transition-all focus:border-[var(--accent)]" style={{ backgroundColor: 'var(--surface-alt)', borderColor: 'var(--border)' }}>
            <option value={0}>-- Choose a template --</option>
            {templates.filter(t => t.active).map(t => (
              <option key={t.id} value={t.id}>{t.name} ({t.code})</option>
            ))}
          </select>
        </div>
        <div className="pt-4 flex justify-end">
          <Button onClick={handleCreate} disabled={loading}>
            {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : <Play size={16} fill="currentColor" className="mr-2" />}
            {loading ? 'Creating...' : 'Create Draft'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
