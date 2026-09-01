import type { ServiceCategory } from '@/types';

interface StatusStripProps {
  suggested: ServiceCategory | null;
  selected: ServiceCategory | null;
}

/**
 * Hace visible la distincion central del producto: azul para lo que propuso el
 * sistema, rojo para lo que el cliente confirmo.
 */
export function StatusStrip({ suggested, selected }: StatusStripProps) {
  if (!suggested && !selected) return null;
  return (
    <div className="status-strip">
      {suggested && (
        <div className="status-pill suggested">
          <span className="dot" />
          Sugerido:&nbsp;<b>{suggested.name}</b>
        </div>
      )}
      {selected && (
        <div className="status-pill selected">
          <span className="dot" />
          Seleccionado:&nbsp;<b>{selected.name}</b>
        </div>
      )}
    </div>
  );
}
