import { useTranslation } from "react-i18next";
import { Loader } from "./loader";

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingScreen({ message = "common.loading", fullScreen = true }: LoadingScreenProps) {
  const { t } = useTranslation();
  return (
    <div 
      className={`flex items-center justify-center bg-[var(--background)] ${fullScreen ? 'h-screen w-full' : 'h-full w-full p-8'}`}
    >
      <div className="flex flex-col items-center gap-4 animate-in fade-in duration-500">
       <Loader />
        <p className="text-sm font-medium tracking-wide animate-pulse" style={{ color: 'var(--text-secondary)' }}>
          {t(message)}
        </p>
      </div>
    </div>
  );
}