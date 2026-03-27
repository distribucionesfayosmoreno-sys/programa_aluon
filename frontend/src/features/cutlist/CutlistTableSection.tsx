import type { CutlistResponse, DoorType } from './models';
import type { FormOverlays } from './CutlistPage.types';
import { FORM_TEMPLATES, IMAGE_CATALOG } from './cutlistConstants';
import { resolveLateralImage, resolveSectionalImage } from './cutlistUtils';

type CutlistTableSectionProps = {
  cutlist: CutlistResponse | null;
  selectedDoorType: DoorType | null;
  formOverlays: FormOverlays;
};

export const CutlistTableSection = ({ cutlist, selectedDoorType, formOverlays }: CutlistTableSectionProps) => (
  <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_26px_rgba(15,23,42,0.06)]">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-black text-slate-900">Desglose de piezas</h2>
        <p className="text-xs text-slate-500">Salida directa del calculador de producción.</p>
      </div>
      {cutlist && (
        <div className="text-xs font-bold uppercase tracking-widest text-slate-400">{cutlist.items.length} filas</div>
      )}
    </div>
    {cutlist && selectedDoorType && (
      <div className="mt-6 rounded-2xl border border-slate-300 p-4">
        <div className="relative w-full max-w-[720px] mx-auto">
          <img src={FORM_TEMPLATES[selectedDoorType]} alt="Formulario" className="w-full h-auto" />
          {formOverlays.overlays.map((overlay, index) => (
            <div
              key={`overlay-${index}`}
              className="absolute text-[10px] text-slate-800"
              style={{
                left: `${overlay.x}%`,
                top: `${overlay.y}%`,
                transform: overlay.align === 'center' ? 'translate(-50%, -50%)' : 'translate(0, -50%)',
                fontSize: overlay.size ? `${overlay.size}px` : undefined,
                whiteSpace: 'nowrap',
              }}
            >
              {overlay.text}
            </div>
          ))}
          {formOverlays.checks.map((check, index) => (
            check.checked ? (
              <div
                key={`check-${index}`}
                className="absolute text-[10px] font-bold text-slate-900"
                style={{ left: `${check.x}%`, top: `${check.y}%`, transform: 'translate(-50%, -50%)' }}
              >
                X
              </div>
            ) : null
          ))}
        </div>
      </div>
    )}
    <div className="mt-5 overflow-x-auto">
      <div className="mb-3 text-sm font-black uppercase text-slate-900">DESGLOSE</div>
      <div className="mb-4 text-xs text-slate-500">Aluminio soldado</div>
      <table className="w-full text-sm border border-slate-300 border-collapse">
        <thead className="text-xs uppercase tracking-wider text-slate-500 border-b border-slate-300">
          <tr>
            <th className="py-3 px-3 text-left border border-slate-300">Img Seccional</th>
            <th className="py-3 px-3 text-left border border-slate-300">Descripción</th>
            <th className="py-3 px-3 text-left border border-slate-300">Img Lateral</th>
            <th className="py-3 px-3 text-center border border-slate-300">Unidades</th>
            <th className="py-3 px-3 text-center border border-slate-300">Medida corte</th>
          </tr>
        </thead>
        <tbody>
          {cutlist?.items.map((item, index) => (
            <tr key={`${item.description}-${index}`} className="border-b border-slate-300">
              <td className="py-4 px-3 border border-slate-300">
                {(() => {
                  const key = resolveSectionalImage(item.description);
                  return key ? (
                    <img src={IMAGE_CATALOG[key]} alt="" className="h-20 w-auto object-contain mx-auto" />
                  ) : (
                    <div className="h-20" />
                  );
                })()}
              </td>
              <td className="py-4 px-3 text-slate-900 font-semibold border border-slate-300">{item.description}</td>
              <td className="py-4 px-3 border border-slate-300">
                {(() => {
                  const key = resolveLateralImage(item.description);
                  return key ? (
                    <img src={IMAGE_CATALOG[key]} alt="" className="h-12 w-auto object-contain mx-auto" />
                  ) : (
                    <div className="h-12" />
                  );
                })()}
              </td>
              <td className="py-4 px-3 text-center text-slate-700 border border-slate-300">{item.units}x</td>
              <td className="py-4 px-3 text-center text-slate-700 border border-slate-300">{item.cutMeasure}</td>
            </tr>
          ))}
          {!cutlist && (
            <tr>
              <td colSpan={5} className="py-8 text-center text-xs text-slate-400">
                Aún no hay datos para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </section>
);
