import type { CatalogDoorProduct, CatalogModel, CatalogVariant } from '../BudgetWizard.types';

type Props = {
  model: CatalogModel;
  product: CatalogDoorProduct;
  variant: CatalogVariant;
  color: string;
  primerRequired: boolean;
  widthMm: number;
  heightMm: number;
  floorClearanceMm: number;
  larguero: boolean;
  marcoSuperior: boolean;
  bisagras: boolean;
  porteroAutomatico: boolean;
  customerName: string;
  deliveryAddressLabel: string;
  submitting: boolean;
  onBack: () => void;
  onFinalize: () => void;
};

const yesNo = (value: boolean) => (value ? 'Sí' : 'No');

export const BudgetWizardSummaryStep = ({
  model,
  product,
  variant,
  color,
  primerRequired,
  widthMm,
  heightMm,
  floorClearanceMm,
  larguero,
  marcoSuperior,
  bisagras,
  porteroAutomatico,
  customerName,
  deliveryAddressLabel,
  submitting,
  onBack,
  onFinalize,
}: Props) => (
  <section className="grid gap-6">
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div>
        <h2 className="text-sm font-black uppercase" style={{ color: '#0d1117' }}>Resumen</h2>
        <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>Revisa la configuración antes de finalizar.</p>
      </div>
      <button className="btn-ghost" onClick={onBack}>Volver</button>
    </div>

    <div className="rounded-2xl p-6 grid gap-3 text-xs" style={{ background: '#ffffff', border: '1px solid #e8eaed' }}>
      <div><strong>Cliente:</strong> {customerName}</div>
      <div><strong>Entrega:</strong> {deliveryAddressLabel}</div>
      <div className="h-px my-2" style={{ background: '#e8eaed' }} />

      <div><strong>Modelo:</strong> {model.modelo}</div>
      <div><strong>Producto:</strong> {product.producto}</div>
      <div><strong>Apertura:</strong> {variant.variante}</div>
      <div><strong>Color:</strong> {color}</div>
      <div><strong>Imprimación:</strong> {yesNo(primerRequired)}</div>
      <div className="h-px my-2" style={{ background: '#e8eaed' }} />

      <div><strong>Anchura total:</strong> {widthMm} mm</div>
      <div><strong>Altura total:</strong> {heightMm} mm</div>
      <div><strong>Holgura suelo:</strong> {floorClearanceMm} mm</div>
      <div><strong>Larguero:</strong> {yesNo(larguero)}</div>
      <div><strong>Marco superior:</strong> {yesNo(marcoSuperior)}</div>
      <div><strong>Bisagras:</strong> {yesNo(bisagras)}</div>
      <div><strong>Portero automático:</strong> {yesNo(porteroAutomatico)}</div>
    </div>

    <div className="flex gap-2">
      <button className="btn-primary" disabled={submitting} onClick={onFinalize}>
        {submitting ? 'Generando…' : 'Finalizar presupuesto'}
      </button>
      <button className="btn-ghost" type="button" onClick={() => window.print()}>Imprimir</button>
    </div>
  </section>
);

