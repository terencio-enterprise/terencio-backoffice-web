import { useScope } from "@/hooks/useScope";
import { cn } from "@/lib/utils";
import type { StoreDto } from "@/types/models";
import { Building2, ChevronDown, MapPin } from "lucide-react";
import { useState } from "react";

export function StoreSwitcher() {
  const { activeCompany, activeStore, switchStore } = useScope();
  const [isOpen, setIsOpen] = useState(false);

  if (!activeCompany) return null;

  const handleStoreSelect = (store: StoreDto) => {
    switchStore(store);
    setIsOpen(false);
  };

  const handleCompanyLevel = () => {
    switchStore(null);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Store Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm noSelect"
        style={{ 
          backgroundColor: activeStore ? 'var(--success-light)' : 'var(--surface-hover)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: activeStore ? 'var(--success)' : 'var(--border)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = activeStore ? 'var(--success)' : 'var(--surface-alt)';
          if (activeStore) {
            e.currentTarget.style.color = 'var(--text-inverse)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = activeStore ? 'var(--success-light)' : 'var(--surface-hover)';
          if (activeStore) {
            e.currentTarget.style.color = '';
          }
        }}
      >
        {activeStore ? (
          <>
            <MapPin className="w-4 h-4" style={{ color: 'var(--success)' }} />
            <span className="font-medium" style={{ color: 'var(--success)' }}>{activeStore.name}</span>
          </>
        ) : (
          <>
            <Building2 className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
            <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>All Stores</span>
          </>
        )}
        <ChevronDown 
          className={cn("w-3 h-3 transition-transform", isOpen && "rotate-180")} 
          style={{ color: activeStore ? 'var(--success)' : 'var(--text-tertiary)' }} 
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Content */}
          <div 
            className="absolute right-0 mt-2 w-64 rounded-lg shadow-lg border z-50 max-h-96 overflow-y-auto"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            {/* Company-level option */}
            <button
              onClick={handleCompanyLevel}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors border-b"
              style={!activeStore ? { backgroundColor: 'var(--accent-light)', borderColor: 'var(--border-light)' } : { borderColor: 'var(--border-light)' }}
              onMouseEnter={(e) => {
                if (activeStore) {
                  e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeStore) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <Building2 
                className="w-4 h-4 flex-shrink-0" 
                style={{ color: !activeStore ? 'var(--accent)' : 'var(--text-secondary)' }} 
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Company Level</p>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>View all stores</p>
              </div>
              {!activeStore && (
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--accent)' }} />
              )}
            </button>

            {/* Store List */}
            <div className="py-1">
              {activeCompany.stores.map(store => {
                const isActive = activeStore?.id === store.id;
                
                return (
                  <button
                    key={store.id}
                    onClick={() => handleStoreSelect(store)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                    style={isActive ? { backgroundColor: 'var(--success-light)' } : {}}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <MapPin 
                      className="w-4 h-4 flex-shrink-0" 
                      style={{ color: isActive ? 'var(--success)' : 'var(--text-secondary)' }} 
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{store.name}</p>
                      <p className="text-xs truncate" style={{ color: 'var(--text-tertiary)' }}>/{store.slug}</p>
                    </div>
                    {isActive && (
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--success)' }} />
                    )}
                  </button>
                );
              })}

              {activeCompany.stores.length === 0 && (
                <div className="px-4 py-6 text-center" style={{ color: 'var(--text-tertiary)' }}>
                  <MapPin className="w-6 h-6 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">No stores available</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
