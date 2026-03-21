import { StatusPill } from '../../components/ui';
import type { DevelopmentActions as DevelopmentActionsType, DevelopmentStatus } from './DevelopmentSection.types';

type DevelopmentActionsProps = {
  status: DevelopmentStatus;
  actions: Pick<DevelopmentActionsType, 'onGenerateDevelopment' | 'onGenerateCutlist' | 'onPrintForm'>;
};

export const DevelopmentActionsBar = ({ status, actions }: DevelopmentActionsProps) => (
  <div className="flex flex-wrap items-center gap-3">
    <button
      type="button"
      className="btn-primary"
      onClick={actions.onGenerateDevelopment}
      disabled={!status.canGenerateDevelopment}
      style={{ opacity: status.canGenerateDevelopment ? 1 : 0.5, cursor: status.canGenerateDevelopment ? 'pointer' : 'not-allowed' }}
    >
      Generar desarrollo
    </button>
    <button
      type="button"
      className="btn-primary"
      onClick={actions.onGenerateCutlist}
      disabled={!status.canGenerateCutlist || status.cutlistLoading}
      style={{ opacity: status.canGenerateCutlist && !status.cutlistLoading ? 1 : 0.5, cursor: status.canGenerateCutlist && !status.cutlistLoading ? 'pointer' : 'not-allowed' }}
    >
      {status.cutlistLoading ? 'Generando...' : 'Generar despiece'}
    </button>
    <button
      type="button"
      className="btn-ghost"
      onClick={actions.onPrintForm}
      disabled={!status.canGenerateCutlist}
      style={{ opacity: status.canGenerateCutlist ? 1 : 0.5, cursor: status.canGenerateCutlist ? 'pointer' : 'not-allowed' }}
    >
      Imprimir
    </button>
    <StatusPill label="Desarrollo generado" ok={status.developmentGenerated} />
    <StatusPill label="Despiece generado" ok={status.cutlistGenerated} />
  </div>
);
