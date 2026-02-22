import { ArrowLeft, SearchX } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

export function NotFoundPage({
  message = "notFound.title",
  description = "notFound.description",
  backToDashboard = "notFound.backToDashboard",
  goBack = "notFound.goBack",
  backToHome = true
}: {
  message?: string;
  description?: string;
  backToDashboard?: string;
  goBack?: string;
  backToHome?: boolean;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex items-center justify-center p-4 bg-[var(--background)]">
      <div 
        className="text-center p-8 sm:p-12 rounded-3xl border shadow-xl max-w-md w-full animate-in zoom-in-95 duration-500" 
        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: 'var(--surface-hover)' }}>
          <SearchX className="w-10 h-10" style={{ color: 'var(--text-tertiary)' }} />
        </div>
        
        <h1 className="text-5xl font-extrabold mb-3 tracking-tight" style={{ color: 'var(--text-primary)' }}>404</h1>
        <p className="font-semibold text-xl mb-3" style={{ color: 'var(--text-primary)' }}>{t(message)}</p>
        <p className="text-sm mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {t(description)}
        </p>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all hover:opacity-90 active:scale-95 border" 
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          >
            {t(goBack)}
          </button>
          {backToHome && (
            <Link 
              to="/" 
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all hover:opacity-90 active:scale-95" 
              style={{ backgroundColor: 'var(--accent)', color: ' var(--text-inverse)' }}
            >
              <ArrowLeft className="w-4 h-4" /> {t(backToDashboard)}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}