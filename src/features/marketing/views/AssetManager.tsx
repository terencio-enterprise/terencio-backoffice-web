import { Copy, Plus, Search, Calendar } from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "../components/MarketingShared";

export function AssetManager() {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  const MOCK_ASSETS = [
    { id: '1', filename: 'logo-main.png', contentType: 'image/png', size: '45 KB', uploadedAt: new Date(Date.now() - 86400000).toISOString(), publicUrl: 'https://placehold.co/400x100?text=Logo' },
    { id: '2', filename: 'summer-banner.jpg', contentType: 'image/jpeg', size: '240 KB', uploadedAt: new Date(Date.now() - 5 * 86400000).toISOString(), publicUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=300&fit=crop' },
    { id: '3', filename: 'bf-promo.gif', contentType: 'image/gif', size: '1.2 MB', uploadedAt: new Date(Date.now() - 15 * 86400000).toISOString(), publicUrl: 'https://placehold.co/400x400?text=GIF' },
    { id: '4', filename: 'product-shot-1.jpg', contentType: 'image/jpeg', size: '850 KB', uploadedAt: new Date(Date.now() - 40 * 86400000).toISOString(), publicUrl: 'https://placehold.co/400x400?text=Product+1' },
    { id: '5', filename: 'newsletter-header.png', contentType: 'image/png', size: '120 KB', uploadedAt: new Date(Date.now() - 120 * 86400000).toISOString(), publicUrl: 'https://placehold.co/800x200?text=Newsletter' },
  ];

  const filteredAssets = useMemo(() => {
    return MOCK_ASSETS.filter(a => {
      const matchesSearch = a.filename.toLowerCase().includes(search.toLowerCase());
      let matchesDate = true;
      const daysAgo = (Date.now() - new Date(a.uploadedAt).getTime()) / (1000 * 3600 * 24);
      
      if (dateFilter === '7d') matchesDate = daysAgo <= 7;
      if (dateFilter === '30d') matchesDate = daysAgo <= 30;
      if (dateFilter === '90d') matchesDate = daysAgo <= 90;
      
      return matchesSearch && matchesDate;
    });
  }, [search, dateFilter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>S3 Asset Manager</h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Manage images and files for your templates</p>
        </div>
        <Button>
          <Plus size={16} className="mr-2" /> Upload File
        </Button>
      </div>
      
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
          <input 
            type="text" 
            placeholder="Search assets by filename..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg outline-none border transition-colors focus:border-[var(--accent)]"
            style={{ backgroundColor: 'var(--surface-alt)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ backgroundColor: 'var(--surface-alt)', borderColor: 'var(--border)' }}>
            <Calendar className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
            <select 
              value={dateFilter} 
              onChange={(e) => setDateFilter(e.target.value)}
              className="text-sm outline-none bg-transparent cursor-pointer"
              style={{ color: 'var(--text-primary)' }}
            >
              <option value="all">All Time</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
        </div>
      </div>
      
      {filteredAssets.length === 0 ? (
        <EmptyState message="No assets found." subtext="Try changing your search or filters." />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {filteredAssets.map(asset => (
            <Card key={asset.id} className="group overflow-hidden flex flex-col transition-all hover:shadow-md hover:border-[var(--accent)] border-2 border-transparent bg-[var(--surface)]">
              <div className="h-32 flex items-center justify-center relative overflow-hidden border-b" style={{ backgroundColor: 'var(--surface-alt)', borderColor: 'var(--border)' }}>
                <img src={asset.publicUrl} alt={asset.filename} className="object-cover w-full h-full" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <button onClick={() => { navigator.clipboard.writeText(asset.publicUrl); alert('Copied!'); }} className="bg-white text-black px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 hover:scale-105 transition-transform shadow-sm cursor-pointer">
                    <Copy size={14} /> <span>Copy URL</span>
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-bold truncate mb-1" style={{ color: 'var(--text-primary)' }}>{asset.filename}</p>
                <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  <span>{asset.size}</span>
                  <span>{new Date(asset.uploadedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}