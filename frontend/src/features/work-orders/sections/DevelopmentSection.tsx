import { cardStyle, SectionTitle, uiColors } from '../components/ui';
import { DevelopmentActionsBar } from './development/DevelopmentActions';
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
  catalogModelOptions,
  highlightDevelopment,
  highlightCutlist,
  onAdvanceStep,
  canAdvanceStep,
  nextStepLabel,
  advanceHint,
}: DevelopmentSectionProps) => (
  <section
    id="cutlist-form"
    className="p-6 rounded-2xl"
    style={cardStyle}
  >
    <SectionTitle n="04" label="Desarrollo automático" />
    <DevelopmentActionsBar
      status={status}
      actions={actions}
      highlightDevelopment={highlightDevelopment}
      highlightCutlist={highlightCutlist}
    />
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
    <DevelopmentForm form={form} needs={needs} status={status} actions={actions} modelOptions={catalogModelOptions} />
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
    {onAdvanceStep && (
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="btn-primary"
          onClick={onAdvanceStep}
          disabled={!canAdvanceStep}
          style={{ opacity: canAdvanceStep ? 1 : 0.5, cursor: canAdvanceStep ? 'pointer' : 'not-allowed' }}
          title={advanceHint || undefined}
        >
          <span className="text-base">➡️</span>
          Avanzar etapa{nextStepLabel ? ` · ${nextStepLabel}` : ''}
        </button>
        {advanceHint && (
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: uiColors.textGhost }}>
            {advanceHint}
          </span>
        )}
      </div>
    )}
  </section>
);
