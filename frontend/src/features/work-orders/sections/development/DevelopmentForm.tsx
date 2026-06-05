import { DOOR_TYPES } from '../../constants';
import type { CutlistDoorModel, CutlistDoorType, CutlistMountingType, CutlistRailType, HingesSide, OpeningSide } from '../../models';
import { Field, FieldLabel, uiColors } from '../../components/ui';
import type { CatalogModelOption } from '../../utils/catalogModels';
import type { DevelopmentActions as DevelopmentActionsType, DevelopmentForm as DevelopmentFormType, DevelopmentNeeds, DevelopmentStatus } from './DevelopmentSection.types';

type DevelopmentFormProps = {
  form: DevelopmentFormType;
  needs: DevelopmentNeeds;
  status: DevelopmentStatus;
  modelOptions: CatalogModelOption[];
  actions: Pick<
    DevelopmentActionsType,
    | 'onDistributorChange'
    | 'onBudgetNumberChange'
    | 'onBudgetDateChange'
    | 'onColorChange'
    | 'onInstallerNameChange'
    | 'onHasUnevennessChange'
    | 'onHeightLeftChange'
    | 'onHeightRightChange'
    | 'onWidthLeftChange'
    | 'onWidthRightChange'
    | 'onDoorTypeChange'
    | 'onDoorModelChange'
    | 'onWidthChange'
    | 'onHeightChange'
    | 'onGroundClearanceChange'
    | 'onLargueroChange'
    | 'onTopFrameChange'
    | 'onHingesSideChange'
    | 'onPorterAutomaticChange'
    | 'onAutomationIncludedChange'
    | 'onAutomationChange'
    | 'onOpeningSideChange'
    | 'onRailTypeChange'
    | 'onMountingTypeChange'
    | 'onTailChange'
  >;
};

export const DevelopmentForm = ({ form, needs, status, actions, modelOptions }: DevelopmentFormProps) => (
  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
    <div>
      <FieldLabel>Distribuidor</FieldLabel>
      <Field value={form.distributor} onChange={e => actions.onDistributorChange(e.target.value)} />
      {!status.canGenerateCutlist && !form.distributor.trim() && (
        <div className="text-[10px] font-semibold mt-1" style={{ color: uiColors.dangerDark }}>
          Campo obligatorio.
        </div>
      )}
    </div>
    <div>
      <FieldLabel>Nº Presupuesto</FieldLabel>
      <Field value={form.budgetNumber} onChange={e => actions.onBudgetNumberChange(e.target.value)} />
      {!status.canGenerateCutlist && !form.budgetNumber.trim() && (
        <div className="text-[10px] font-semibold mt-1" style={{ color: uiColors.dangerDark }}>
          Campo obligatorio.
        </div>
      )}
    </div>
    <div>
      <FieldLabel>Fecha</FieldLabel>
      <Field type="date" value={form.budgetDate} onChange={e => actions.onBudgetDateChange(e.target.value)} />
      {!status.canGenerateCutlist && !form.budgetDate.trim() && (
        <div className="text-[10px] font-semibold mt-1" style={{ color: uiColors.dangerDark }}>
          Campo obligatorio.
        </div>
      )}
    </div>
    <div>
      <FieldLabel>Color</FieldLabel>
      <Field value={form.color} onChange={e => actions.onColorChange(e.target.value)} />
      {!status.canGenerateCutlist && !form.color.trim() && (
        <div className="text-[10px] font-semibold mt-1" style={{ color: uiColors.dangerDark }}>
          Campo obligatorio.
        </div>
      )}
    </div>
    <div>
      <FieldLabel>Nombre instalador</FieldLabel>
      <Field value={form.installerName} onChange={e => actions.onInstallerNameChange(e.target.value)} />
    </div>
    <div>
      <FieldLabel>Tipo de puerta</FieldLabel>
      <select
        className="field"
        value={form.doorType}
        onChange={e => actions.onDoorTypeChange(e.target.value as CutlistDoorType)}
      >
        {DOOR_TYPES.map(type => (
          <option key={type.id} value={type.id}>{type.label}</option>
        ))}
      </select>
    </div>
    <div>
      <FieldLabel>Modelo (despiece)</FieldLabel>
      <select
        className="field"
        value={form.doorModel}
        onChange={e => actions.onDoorModelChange(e.target.value as CutlistDoorModel)}
      >
        {modelOptions.map(model => (
          <option key={model.id} value={model.id}>{model.label}</option>
        ))}
      </select>
    </div>
    <div>
      <FieldLabel>Anchura total (mm)</FieldLabel>
      <Field
        type="number"
        min={0}
        value={form.widthMm}
        onChange={e => actions.onWidthChange(Number(e.target.value || 0))}
      />
      {!status.canGenerateCutlist && form.widthMm <= 0 && (
        <div className="text-[10px] font-semibold mt-1" style={{ color: uiColors.dangerDark }}>
          Introduce una anchura válida.
        </div>
      )}
    </div>
    <div className="flex items-center gap-2 pt-8">
      <input
        type="checkbox"
        id="hasUnevenness"
        className="w-4 h-4"
        checked={form.hasUnevenness}
        onChange={e => actions.onHasUnevennessChange(e.target.checked)}
      />
      <label htmlFor="hasUnevenness" className="text-sm font-semibold" style={{ color: uiColors.textMuted }}>
        ¿Hueco con desnivel (falsa escuadra)?
      </label>
    </div>
    {!form.hasUnevenness && (
      <div>
        <FieldLabel>Altura total (mm)</FieldLabel>
        <Field
          type="number"
          min={0}
          value={form.heightMm}
          onChange={e => actions.onHeightChange(Number(e.target.value || 0))}
        />
        {!status.canGenerateCutlist && form.heightMm <= 0 && (
          <div className="text-[10px] font-semibold mt-1" style={{ color: uiColors.dangerDark }}>
            Introduce una altura válida.
          </div>
        )}
      </div>
    )}
    {needs.needsLeftRightHeights && (
      <>
        <div>
          <FieldLabel>Altura izquierda (mm)</FieldLabel>
          <Field
            type="number"
            min={0}
            value={form.heightLeftMm ?? ''}
            onChange={e => actions.onHeightLeftChange(e.target.value === '' ? null : Number(e.target.value))}
          />
          {!status.canGenerateCutlist && (form.heightLeftMm === null || form.heightLeftMm <= 0) && (
            <div className="text-[10px] font-semibold mt-1" style={{ color: uiColors.dangerDark }}>
              Altura izquierda requerida.
            </div>
          )}
        </div>
        <div>
          <FieldLabel>Altura derecha (mm)</FieldLabel>
          <Field
            type="number"
            min={0}
            value={form.heightRightMm ?? ''}
            onChange={e => actions.onHeightRightChange(e.target.value === '' ? null : Number(e.target.value))}
          />
          {!status.canGenerateCutlist && (form.heightRightMm === null || form.heightRightMm <= 0) && (
            <div className="text-[10px] font-semibold mt-1" style={{ color: uiColors.dangerDark }}>
              Altura derecha requerida.
            </div>
          )}
        </div>
      </>
    )}
    {needs.needsGroundClearance && (
      <div>
        <FieldLabel>Holgura suelo (mm)</FieldLabel>
        <Field
          type="number"
          min={0}
          value={form.groundClearanceMm}
          onChange={e => actions.onGroundClearanceChange(Number(e.target.value || 0))}
        />
      </div>
    )}
    {needs.needsLarguero && (
      <div>
        <FieldLabel>Larguero</FieldLabel>
        <select
          className="field"
          value={String(form.largueroMm)}
          onChange={e => actions.onLargueroChange(Number(e.target.value) as 50 | 80)}
        >
          <option value="50">50 mm</option>
          <option value="80">80 mm</option>
        </select>
      </div>
    )}
    {needs.needsTopFrame && (
      <div>
        <FieldLabel>Marco superior</FieldLabel>
        <select
          className="field"
          value={form.topFrame ? 'yes' : 'no'}
          onChange={e => actions.onTopFrameChange(e.target.value === 'yes')}
        >
          <option value="yes">Sí</option>
          <option value="no">No</option>
        </select>
      </div>
    )}
    {needs.needsHingesSide && (
      <div>
        <FieldLabel>Bisagras</FieldLabel>
        <select
          className="field"
          value={form.hingesSide}
          onChange={e => actions.onHingesSideChange(e.target.value as HingesSide)}
        >
          <option value="LEFT">Izquierda</option>
          <option value="RIGHT">Derecha</option>
        </select>
      </div>
    )}
    {needs.needsPorterAutomatic && (
      <div>
        <FieldLabel>Portero automático</FieldLabel>
        <select
          className="field"
          value={form.porterAutomatic ? 'yes' : 'no'}
          onChange={e => actions.onPorterAutomaticChange(e.target.value === 'yes')}
        >
          <option value="yes">Sí</option>
          <option value="no">No</option>
        </select>
      </div>
    )}
    {needs.needsAutomation && (
      <div>
        <FieldLabel>Incluir automatización</FieldLabel>
        <select
          className="field"
          value={form.automationIncluded ? 'yes' : 'no'}
          onChange={e => actions.onAutomationIncludedChange(e.target.value === 'yes')}
        >
          <option value="yes">Sí</option>
          <option value="no">No</option>
        </select>
      </div>
    )}
    {needs.needsAutomation && (
      <div>
        <FieldLabel>Refuerzo automatización</FieldLabel>
        <select
          className="field"
          value={form.automationReinforcement ? 'yes' : 'no'}
          onChange={e => actions.onAutomationChange(e.target.value === 'yes')}
          disabled={!form.automationIncluded}
        >
          <option value="yes">Sí</option>
          <option value="no">No</option>
        </select>
      </div>
    )}
    {needs.needsOpeningSide && (
      <div>
        <FieldLabel>{form.doorType === 'CORREDERA' ? 'Apertura' : 'Primera hoja apertura'}</FieldLabel>
        <select
          className="field"
          value={form.openingSide}
          onChange={e => actions.onOpeningSideChange(e.target.value as OpeningSide)}
        >
          <option value="LEFT">Izquierda</option>
          <option value="RIGHT">Derecha</option>
        </select>
      </div>
    )}
    {needs.needsLeftRightWidths && (
      <>
        <div>
          <FieldLabel>Anchura izquierda (mm)</FieldLabel>
          <Field
            type="number"
            min={0}
            value={form.widthLeftMm ?? ''}
            onChange={e => actions.onWidthLeftChange(e.target.value === '' ? null : Number(e.target.value))}
          />
          {!status.canGenerateCutlist && (form.widthLeftMm === null || form.widthLeftMm <= 0) && (
            <div className="text-[10px] font-semibold mt-1" style={{ color: uiColors.dangerDark }}>
              Anchura izquierda requerida.
            </div>
          )}
        </div>
        <div>
          <FieldLabel>Anchura derecha (mm)</FieldLabel>
          <Field
            type="number"
            min={0}
            value={form.widthRightMm ?? ''}
            onChange={e => actions.onWidthRightChange(e.target.value === '' ? null : Number(e.target.value))}
          />
          {!status.canGenerateCutlist && (form.widthRightMm === null || form.widthRightMm <= 0) && (
            <div className="text-[10px] font-semibold mt-1" style={{ color: uiColors.dangerDark }}>
              Anchura derecha requerida.
            </div>
          )}
        </div>
      </>
    )}
    {needs.needsRail && (
      <div>
        <FieldLabel>Carril</FieldLabel>
        <select
          className="field"
          value={form.railType}
          onChange={e => actions.onRailTypeChange(e.target.value as CutlistRailType)}
        >
          <option value="CARRIL_16">Carril 16</option>
          <option value="CARRIL_20">Carril 20</option>
        </select>
      </div>
    )}
    {needs.needsMounting && (
      <div>
        <FieldLabel>Montaje</FieldLabel>
        <select
          className="field"
          value={form.mountingType}
          onChange={e => actions.onMountingTypeChange(e.target.value as CutlistMountingType)}
        >
          <option value="A">Montaje A</option>
          <option value="B">Montaje B</option>
        </select>
      </div>
    )}
    {needs.needsTail && (
      <div>
        <FieldLabel>Cola</FieldLabel>
        <select
          className="field"
          value={form.tail ? 'yes' : 'no'}
          onChange={e => actions.onTailChange(e.target.value === 'yes')}
        >
          <option value="yes">Sí</option>
          <option value="no">No</option>
        </select>
      </div>
    )}
  </div>
);
