import { useThemeMode } from '@hooks/useThemeMode'

export function SiteLogo() {
  const { mode } = useThemeMode();

  return (
    <div className="flex items-center gap-2">
      {mode === 'semantic' ? <span className="latty latty-box text-teal-500"></span> : <span className="latty latty-boxes text-blue-500"></span>}
      <span className="text-lg font-bold">{mode === 'semantic' ? 'Semantic' : 'UI8Kit'}</span>
    </div>
  );
}