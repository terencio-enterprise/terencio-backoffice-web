import { Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface ComingSoonViewProps {
  module: string;
}

export function ComingSoonView({ module }: ComingSoonViewProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 animate-in fade-in slide-in-from-bottom-4">
      <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--surface-alt)' }}>
        <Settings className="w-10 h-10 animate-spin-slow" style={{ color: 'var(--text-tertiary)' }} />
      </div>
      <div>
        <h2 className="text-xl font-bold">{t('comingSoon.title')}</h2>
        <p className="max-w-sm mx-auto mt-2" style={{ color: 'var(--text-secondary)' }}>
          {t('comingSoon.message', { module })}
        </p>
      </div>
      <button 
        onClick={() => navigate("/dashboard")}
        className="font-medium hover:underline cursor-pointer"
        style={{ color: 'var(--accent)' }}
      >
        {t('comingSoon.returnToDashboard')}
      </button>
    </div>
  );
}
