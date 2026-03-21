import { resolveCutlistItemImages } from '../../cutlistItemImages';
import { uiColors } from '../../components/ui';
import type { DevelopmentActions, DevelopmentCutlist } from './DevelopmentSection.types';

type CutlistTableProps = {
  cutlist: DevelopmentCutlist;
  actions: Pick<DevelopmentActions, 'onCutlistHoverChange' | 'onCutlistPinnedChange'>;
};

export const CutlistTable = ({ cutlist, actions }: CutlistTableProps) => {
  const result = cutlist.cutlistResult;
  if (!result) return null;

  return (
    <div className="mt-6" id="cutlist-table">
      <div className="text-xs font-black uppercase tracking-widest" style={{ color: uiColors.textGhost }}>
        Resultado despiece
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-xs" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', color: uiColors.textMuted }}>
              <th className="text-left px-3 py-2" style={{ border: `1px solid ${uiColors.borderLight}` }}>Img seccional</th>
              <th className="text-left px-3 py-2" style={{ border: `1px solid ${uiColors.borderLight}` }}>Descripción</th>
              <th className="text-left px-3 py-2" style={{ border: `1px solid ${uiColors.borderLight}` }}>Img lateral</th>
              <th className="text-left px-3 py-2" style={{ border: `1px solid ${uiColors.borderLight}` }}>Unidades</th>
              <th className="text-left px-3 py-2" style={{ border: `1px solid ${uiColors.borderLight}` }}>Medida corte</th>
            </tr>
          </thead>
          <tbody>
            {result.items.map((item, idx) => {
              const { seccional, lateral } = resolveCutlistItemImages(item.description);
              return (
                <tr
                  key={`${result.id}-${idx}`}
                  onMouseEnter={() => actions.onCutlistHoverChange(idx)}
                  onMouseLeave={() => actions.onCutlistHoverChange(null)}
                  onClick={() => actions.onCutlistPinnedChange(cutlist.cutlistPinnedIndex === idx ? null : idx)}
                  style={{
                    background: cutlist.activeCutlistIndex === idx ? 'rgba(229,83,75,0.08)' : '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  <td className="px-3 py-2" style={{ border: `1px solid ${uiColors.borderLight}` }}>
                    <img src={seccional.src} alt={seccional.alt} className="w-10 h-10 object-cover rounded-md border" style={{ borderColor: uiColors.borderLight }} />
                  </td>
                  <td className="px-3 py-2" style={{ border: `1px solid ${uiColors.borderLight}` }}>
                    <div className="flex items-center gap-2">
                      <span>{item.description}</span>
                      {cutlist.activeCutlistIndex === idx && (
                        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: uiColors.accent }}>
                          Activa
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2" style={{ border: `1px solid ${uiColors.borderLight}` }}>
                    <img src={lateral.src} alt={lateral.alt} className="w-10 h-10 object-cover rounded-md border" style={{ borderColor: uiColors.borderLight }} />
                  </td>
                  <td className="px-3 py-2" style={{ border: `1px solid ${uiColors.borderLight}` }}>{item.units}x</td>
                  <td className="px-3 py-2" style={{ border: `1px solid ${uiColors.borderLight}` }}>{item.cutMeasure}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
