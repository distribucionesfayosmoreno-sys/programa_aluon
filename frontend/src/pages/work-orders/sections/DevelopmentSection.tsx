import { cardStyle, SectionTitle, uiColors } from '../components/ui';
import { DevelopmentActions } from './development/DevelopmentActions';
import { DevelopmentForm } from './development/DevelopmentForm';
import { CutlistPreview } from './development/CutlistPreview';
import { CutlistTable } from './development/CutlistTable';
import type { DevelopmentSectionProps } from './development/DevelopmentSection.types';

export const DevelopmentSection = ({
  status,
  form,
  needs,
  cutlist,
  actions,
}: DevelopmentSectionProps) => (
  <section
    id="cutlist-form"
    className="p-6 rounded-2xl"
    style={cardStyle}
  >
    <SectionTitle n="04" label="Desarrollo automático" />
    <DevelopmentActions status={status} actions={actions} />
    {!status.canGenerateCutlist && status.cutlistBlockingReasons.length > 0 && (
      <div className="mt-3 text-xs font-semibold" style={{ color: uiColors.dangerDark }}>
        <div className="uppercase tracking-widest text-[10px]" style={{ color: uiColors.dangerDark }}>
          Faltan datos para generar el despiece
        </div>
        {status.cutlistBlockingReasons.map(reason => (
          <div key={reason}>• {reason}</div>
        ))}
      </div>
    )}
    <DevelopmentForm form={form} needs={needs} status={status} actions={actions} />
    {status.cutlistError && (
      <p className="text-xs font-semibold mt-3" style={{ color: uiColors.danger }}>
        {status.cutlistError}
      </p>
    )}
    <CutlistPreview
      form={{ doorType: form.doorType, doorModel: form.doorModel, widthMm: form.widthMm, heightMm: form.heightMm }}
      cutlist={cutlist}
      status={{ cutlistLoading: status.cutlistLoading }}
      actions={{ onCutlistImageChange: actions.onCutlistImageChange }}
    />
    <CutlistTable
      cutlist={cutlist}
      actions={{ onCutlistHoverChange: actions.onCutlistHoverChange, onCutlistPinnedChange: actions.onCutlistPinnedChange }}
    />
  </section>
);
