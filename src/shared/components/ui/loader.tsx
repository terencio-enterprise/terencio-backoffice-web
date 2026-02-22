import { Store } from "lucide-react";


interface LoaderProps {
  size?: number;
}

export const Loader = ({ size = 16 }: LoaderProps) => {
  const sizeClass = `w-${size} h-${size}`;
    return (
         <div className={`relative flex items-center justify-center rounded-2xl shadow-sm border ${sizeClass}`} style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="absolute inset-0 rounded-2xl animate-ping opacity-20" style={{ backgroundColor: 'var(--accent)' }}></div>
          <Store className={`w-${size} h-${size} relative z-10`} style={{ color: 'var(--accent)' }} />
        </div>
    );
};