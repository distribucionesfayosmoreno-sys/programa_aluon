import { useEffect, useMemo, useState } from 'react';
import type {
  CutlistRequest,
  CutlistResponse,
  DoorModel,
  DoorType,
  HingesSide,
  MountingType,
  OpeningSide,
  RailType,
} from './models';
import { generateCutlist } from '../../services/cutlistApi';
import { getCustomers } from '../../services/customersApi';
import type { CustomerSummary } from '../../services/customersApi';

const MODEL_OPTIONS: Array<{ value: DoorModel; label: string; image: string }> = [
  { value: 'PREMIUM', label: 'ALUON Premium', image: '/legacy/aluon/images/aluonPremium.jpg' },
  { value: 'CLASSIC', label: 'ALUON Classic', image: '/legacy/aluon/images/aluonClassic.jpg' },
  { value: 'INOX', label: 'ALUON Inox', image: '/legacy/aluon/images/aluonInox.jpg' },
  { value: 'VENECIANA', label: 'ALUON Veneciana', image: '/legacy/aluon/images/aluonVeneciana.jpg' },
];

const DOOR_TYPES: Array<{ value: DoorType; label: string }> = [
  { value: 'PEATONAL', label: 'Puerta peatonal' },
  { value: 'ABATIBLE_UNA', label: 'Puerta abatible una hoja' },
  { value: 'ABATIBLE_DOS', label: 'Puerta abatible dos hojas' },
  { value: 'CORREDERA', label: 'Puerta corredera' },
  { value: 'VALLA', label: 'Valla' },
];

const BOOLEAN_OPTIONS = [
  { value: 'true', label: 'Sí' },
  { value: 'false', label: 'No' },
];

type FormState = {
  customerId: string;
  budgetDate: string;
  model: '' | DoorModel;
  doorType: '' | DoorType;
  color: string;
  installerName: string;
  notes: string;
  widthMm: string;
  heightMm: string;
  groundClearanceMm: string;
  largueroMm: '' | '50' | '80';
  topFrame: '' | 'true' | 'false';
  hingesSide: '' | HingesSide;
  porterAutomatic: '' | 'true' | 'false';
  automationIncluded: '' | 'true' | 'false';
  automationReinforcement: '' | 'true' | 'false';
  openingSide: '' | OpeningSide;
  railType: '' | RailType;
  mountingType: '' | MountingType;
  tail: '' | 'true' | 'false';
};

const emptyForm: FormState = {
  customerId: '',
  budgetDate: '',
  model: '',
  doorType: '',
  color: '',
  installerName: '',
  notes: '',
  widthMm: '',
  heightMm: '',
  groundClearanceMm: '',
  largueroMm: '',
  topFrame: '',
  hingesSide: '',
  porterAutomatic: '',
  automationIncluded: '',
  automationReinforcement: '',
  openingSide: '',
  railType: '',
  mountingType: '',
  tail: '',
};

const parseBoolean = (value: '' | 'true' | 'false') => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return null;
};

const toNumber = (value: string) => {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const formatDate = (value?: string | null) => {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('es-ES');
};

const formatModel = (value?: DoorModel | null) => {
  if (!value) return '-';
  return MODEL_OPTIONS.find(option => option.value === value)?.label ?? value;
};

const formatDoorType = (value?: DoorType | null) => {
  if (!value) return '-';
  return DOOR_TYPES.find(option => option.value === value)?.label ?? value;
};

const formatMm = (value?: string | null) => {
  if (!value?.trim()) return '-';
  return `${value} mm`;
};

const formatYesNo = (value: boolean | null) => {
  if (value === null) return 'Sí [ ]  No [ ]';
  return value ? 'Sí [X]  No [ ]' : 'Sí [ ]  No [X]';
};

const formatSide = (value: string | null, leftLabel = 'Izq', rightLabel = 'Der') => {
  if (!value) return `${leftLabel} [ ]  ${rightLabel} [ ]`;
  return value === 'LEFT' ? `${leftLabel} [X]  ${rightLabel} [ ]` : `${leftLabel} [ ]  ${rightLabel} [X]`;
};

const CutlistPage = () => {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [customersError, setCustomersError] = useState('');
  const [cutlist, setCutlist] = useState<CutlistResponse | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [locked, setLocked] = useState(false);

  const selectedCustomer = useMemo(
    () => customers.find(customer => customer.id === form.customerId) ?? null,
    [customers, form.customerId]
  );

  const selectedModel = form.model || null;
  const selectedDoorType = form.doorType || null;

  const previewImage = useMemo(() => {
    const match = MODEL_OPTIONS.find(option => option.value === selectedModel);
    return match?.image ?? '/legacy/aluon/images/banner.jpg';
  }, [selectedModel]);

  const automationReinforcementLocked = form.automationIncluded === 'true';
  const automationIncludedValue = parseBoolean(form.automationIncluded);
  const automationReinforcementValue = parseBoolean(form.automationReinforcement);
  const porterAutomaticValue = parseBoolean(form.porterAutomatic);
  const topFrameValue = parseBoolean(form.topFrame);
  const tailValue = parseBoolean(form.tail);

  useEffect(() => {
    if (automationReinforcementLocked) {
      setForm(prev => ({ ...prev, automationReinforcement: 'true' }));
    }
  }, [automationReinforcementLocked]);

  useEffect(() => {
    let active = true;
    const loadCustomers = async () => {
      try {
        setCustomersLoading(true);
        const data = await getCustomers();
        if (!active) return;
        setCustomers(data);
        setCustomersError('');
      } catch (err) {
        if (!active) return;
        const message = err instanceof Error ? err.message : 'No se pudieron cargar los clientes.';
        setCustomersError(message);
      } finally {
        if (active) {
          setCustomersLoading(false);
        }
      }
    };
    loadCustomers();
    return () => {
      active = false;
    };
  }, []);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const requiredString = (value: string, label: string) => {
      if (!value.trim()) throw new Error(`El campo "${label}" es obligatorio.`);
    };

    const requiredSelect = (value: string, label: string) => {
      if (!value) throw new Error(`Selecciona una opción para "${label}".`);
    };

    const requiredNumber = (value: string, label: string, allowZero = false) => {
      const parsed = toNumber(value);
      if (parsed === null) throw new Error(`Introduce un valor válido para "${label}".`);
      if (!allowZero && parsed <= 0) throw new Error(`"${label}" debe ser mayor que 0.`);
      if (allowZero && parsed < 0) throw new Error(`"${label}" no puede ser negativo.`);
    };

    if (!form.customerId) {
      throw new Error('Selecciona un distribuidor (cliente).');
    }
    requiredString(form.budgetDate, 'Fecha');
    requiredSelect(form.model, 'Modelo');
    requiredSelect(form.doorType, 'Tipo de puerta');
    requiredString(form.color, 'Color');

    if (selectedDoorType === 'PEATONAL') {
      requiredNumber(form.heightMm, 'Altura total');
      requiredNumber(form.widthMm, 'Anchura total');
      requiredNumber(form.groundClearanceMm, 'Holgura con el suelo', true);
      requiredSelect(form.hingesSide, 'Bisagras');
      requiredSelect(form.porterAutomatic, 'Portero automático');
      requiredSelect(form.largueroMm, 'Larguero');
      requiredSelect(form.topFrame, 'Marco superior');
    }

    if (selectedDoorType === 'ABATIBLE_UNA' || selectedDoorType === 'ABATIBLE_DOS') {
      requiredNumber(form.heightMm, 'Altura total');
      requiredNumber(form.widthMm, 'Anchura total');
      requiredNumber(form.groundClearanceMm, 'Holgura con el suelo', true);
      requiredSelect(form.hingesSide, 'Bisagras');
      requiredSelect(form.automationIncluded, 'Automatización');
      requiredSelect(form.automationReinforcement, 'Refuerzo automatización');
      requiredSelect(form.largueroMm, 'Larguero');
      requiredSelect(form.topFrame, 'Marco superior');
    }

    if (selectedDoorType === 'CORREDERA') {
      requiredNumber(form.heightMm, 'Altura total');
      requiredNumber(form.widthMm, 'Anchura total');
      requiredSelect(form.openingSide, 'Apertura');
      requiredSelect(form.railType, 'Carril');
      requiredSelect(form.automationIncluded, 'Automatización');
      requiredSelect(form.automationReinforcement, 'Refuerzo automatización');
      requiredSelect(form.mountingType, 'Montaje');
      requiredSelect(form.tail, 'Cola');
    }

    if (selectedDoorType === 'VALLA') {
      requiredNumber(form.heightMm, 'Altura total');
      requiredNumber(form.widthMm, 'Anchura total');
    }
  };

  const buildRequest = (): CutlistRequest => {
    const width = toNumber(form.widthMm);
    const height = toNumber(form.heightMm);
    if (width === null || height === null) {
      throw new Error('Medidas incompletas.');
    }

    return {
      distributor: selectedCustomer?.nombreComercial ?? '',
      budgetNumber: null,
      budgetDate: form.budgetDate,
      color: form.color.trim(),
      installerName: form.installerName.trim() || undefined,
      doorType: form.doorType as DoorType,
      model: form.model as DoorModel,
      widthMm: Math.round(width),
      heightMm: Math.round(height),
      groundClearanceMm: toNumber(form.groundClearanceMm),
      largueroMm: form.largueroMm ? Number(form.largueroMm) : null,
      topFrame: parseBoolean(form.topFrame),
      hingesSide: form.hingesSide || null,
      porterAutomatic: parseBoolean(form.porterAutomatic),
      automationIncluded: parseBoolean(form.automationIncluded),
      automationReinforcement: parseBoolean(form.automationReinforcement),
      openingSide: form.openingSide || null,
      railType: form.railType || null,
      mountingType: form.mountingType || null,
      tail: parseBoolean(form.tail),
      notes: form.notes.trim() || null,
    };
  };

  const onSubmit = async () => {
    setError('');
    try {
      validate();
      const payload = buildRequest();
      setSubmitting(true);
      const response = await generateCutlist(payload);
      setCutlist(response);
      setLocked(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Revisa los datos del formulario.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetAll = () => {
    setForm(emptyForm);
    setCutlist(null);
    setLocked(false);
    setError('');
  };

  const handlePrint = () => {
    if (!cutlist) {
      setError('Genera el despiece antes de imprimir.');
      return;
    }
    window.print();
  };

  const exportPdf = async () => {
    if (!cutlist) {
      setError('Genera el despiece antes de exportar.');
      return;
    }
    try {
      const { jsPDF } = await import('jspdf');
      const autoTableModule = await import('jspdf-autotable');
      const autoTable = autoTableModule.default;
      const imageCatalog: Record<string, string> = {
        logo: '/legacy/aluon/images/logo.png',
        larguero50x80ConPestania: '/legacy/aluon/images/larguero50x80conPestania.jpg',
        marco1: '/legacy/aluon/images/marco1.jpg',
        marco2: '/legacy/aluon/images/marco2.jpg',
        marco2ConPestania: '/legacy/aluon/images/marco2conPestania.jpg',
        marco2ConPestaniaInox: '/legacy/aluon/images/marco2conPestaniaInox.jpg',
        marco3: '/legacy/aluon/images/marco3.jpg',
        marcoInox: '/legacy/aluon/images/marcoInox.jpg',
        corte45: '/legacy/aluon/images/corte45.jpg',
        corte45y90: '/legacy/aluon/images/corte45y90.jpg',
        corte90: '/legacy/aluon/images/corte90.jpg',
        lama200: '/legacy/aluon/images/lama.jpg',
        lama100: '/legacy/aluon/images/lama100.jpg',
        lamaAvion: '/legacy/aluon/images/lamaAvion.jpg',
        lamaInox: '/legacy/aluon/images/lamaInox200.jpg',
        perfilRuedas: '/legacy/aluon/images/perfilRuedasCorredera.jpg',
        posteCierreA: '/legacy/aluon/images/posteDeCierrePuertaCorrederaMontajeA.jpg',
        posteCierreB: '/legacy/aluon/images/posteDeCierrePuertaCorrederaMontajeB.jpg',
        tubo80x50: '/legacy/aluon/images/tubo80x50.jpg',
        tuboInox: '/legacy/aluon/images/tuboInoxidable.jpg',
        tuboRefuerzoMotor: '/legacy/aluon/images/tuboRefuerzoMotor.jpg',
        tuboRefuerzoMotorInox: '/legacy/aluon/images/tuboRefuerzoMotorInox.jpg',
      };

      const normalizeText = (value: string) => value.toLowerCase();

      const resolveSectionalImage = (description: string) => {
        const text = normalizeText(description);
        if (text.includes('refuerzo motor') && text.includes('inox')) return 'tuboRefuerzoMotorInox';
        if (text.includes('refuerzo motor')) return 'tuboRefuerzoMotor';
        if (text.includes('perfil ruedas')) return 'perfilRuedas';
        if (text.includes('poste de cierre') && (text.includes('montaje a') || text.includes('sin pestañas'))) return 'posteCierreA';
        if (text.includes('poste de cierre') && (text.includes('montaje b') || text.includes('con pestañas'))) return 'posteCierreB';
        if (text.includes('tubo inoxidable')) return 'tuboInox';
        if (text.includes('tubo 80x50') || text.includes('cola')) return 'tubo80x50';
        if (text.includes('lama 200x26')) return 'lamaInox';
        if (text.includes('lama 200x20')) return 'lama200';
        if (text.includes('lama 100x20')) return 'lama100';
        if (text.includes('lama 100 avión')) return 'lamaAvion';
        if (text.includes('larguero 50x50')) return 'marco1';
        if (text.includes('larguero 50x80') && text.includes('pestaña') && text.includes('inox')) return 'marco2ConPestaniaInox';
        if (text.includes('larguero 50x80') && text.includes('pestaña')) return 'larguero50x80ConPestania';
        if (text.includes('larguero 50x80')) return 'larguero50x80ConPestania';
        if (text.includes('marco') && (text.includes('troquelado') || text.includes('veneciana') || text.includes('50x50'))) return 'tuboRefuerzoMotorInox';
        if (text.includes('marco') && text.includes('80x50') && text.includes('pestaña') && text.includes('inox')) return 'marco2ConPestaniaInox';
        if (text.includes('marco') && text.includes('80x50') && text.includes('pestaña')) return 'marco2ConPestania';
        if (text.includes('marco') && text.includes('80x50') && text.includes('inox')) return 'marcoInox';
        if (text.includes('marco') && text.includes('80x50')) return 'marco2';
        if (text.includes('marco') && text.includes('50x50')) return 'marco1';
        return null;
      };

      const resolveLateralImage = (description: string) => {
        const text = normalizeText(description);
        if (text.includes('recto') && text.includes('inglete 45')) return 'corte45y90';
        if (text.includes('inglete 45')) return 'corte45';
        if (text.includes('corte recto') || text.includes('recto')) return 'corte90';
        return null;
      };

      const getImageFormat = (key: string) => {
        const path = imageCatalog[key];
        if (!path) return 'JPEG';
        return path.toLowerCase().endsWith('.png') ? 'PNG' : 'JPEG';
      };

      const loadImageAsDataUrl = async (path: string) => {
        const response = await fetch(path);
        if (!response.ok) {
          throw new Error(`No se pudo cargar la imagen: ${path}`);
        }
        const blob = await response.blob();
        return await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error(`No se pudo leer la imagen: ${path}`));
          reader.readAsDataURL(blob);
        });
      };

      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const marginX = 14;
      let cursorY = 16;

      const imageKeys = new Set<string>();
      imageKeys.add('logo');
      const rows = cutlist.items.map(item => {
        const seccional = resolveSectionalImage(item.description);
        const lateral = resolveLateralImage(item.description);
        if (seccional) imageKeys.add(seccional);
        if (lateral) imageKeys.add(lateral);
        return {
          imgSeccional: seccional ?? '',
          description: item.description,
          imgLateral: lateral ?? '',
          units: `${item.units}x`,
          cutMeasure: item.cutMeasure,
        };
      });

      const imageData: Record<string, string> = {};
      await Promise.all(
        Array.from(imageKeys).map(async key => {
          const path = imageCatalog[key];
          if (!path) return;
          imageData[key] = await loadImageAsDataUrl(path);
        })
      );

      const logo = imageData.logo;
      if (logo) {
        doc.addImage(logo, 'PNG', marginX, cursorY - 6, 22, 12);
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Despiece ALUON', marginX + 28, cursorY);
      cursorY += 8;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const metaRows = [
        `Distribuidor: ${selectedCustomer?.nombreComercial ?? '-'}`,
        `Presupuesto: ${cutlist.budgetNumber ?? '-'}`,
        `Fecha: ${formatDate(cutlist.budgetDate ?? form.budgetDate)}`,
        `Modelo: ${formatModel(cutlist.model ?? selectedModel)}`,
        `Tipo: ${formatDoorType(cutlist.doorType ?? selectedDoorType)}`,
        `Color: ${cutlist.color ?? form.color}`,
        `Acabado: ${formatDoorType(cutlist.doorType ?? selectedDoorType)}`,
      ];
      metaRows.forEach(row => {
        doc.text(row, marginX, cursorY);
        cursorY += 5;
      });
      if (selectedDoorType === 'PEATONAL') {
        const detailRows = [
          `Altura: ${formatMm(form.heightMm)}`,
          `Anchura: ${formatMm(form.widthMm)}`,
          `Holgura: ${formatMm(form.groundClearanceMm)}`,
          `Bisagras: ${formatSide(form.hingesSide || null)}`,
          `Portero automático: ${formatYesNo(porterAutomaticValue)}`,
          `Larguero: ${form.largueroMm ? `${form.largueroMm} mm` : '-'}`,
          `Marco superior: ${formatYesNo(topFrameValue)}`,
        ];
        detailRows.forEach(row => {
          doc.text(row, marginX, cursorY);
          cursorY += 5;
        });
      }
      if (selectedDoorType === 'ABATIBLE_UNA' || selectedDoorType === 'ABATIBLE_DOS') {
        const detailRows = [
          `Altura izq: ${formatMm(form.heightMm)}`,
          `Altura der: ${formatMm(form.heightMm)}`,
          `Anchura: ${formatMm(form.widthMm)}`,
          `Holgura: ${formatMm(form.groundClearanceMm)}`,
          `Bisagras: ${formatSide(form.hingesSide || null)}`,
          `Automatización: ${formatYesNo(automationIncludedValue)}`,
          `Refuerzo automatización: ${formatYesNo(automationReinforcementValue)}`,
          `Larguero: ${form.largueroMm ? `${form.largueroMm} mm` : '-'}`,
          `Marco superior: ${formatYesNo(topFrameValue)}`,
        ];
        detailRows.forEach(row => {
          doc.text(row, marginX, cursorY);
          cursorY += 5;
        });
      }
      if (selectedDoorType === 'CORREDERA') {
        const detailRows = [
          `Altura: ${formatMm(form.heightMm)}`,
          `Anchura izq: ${formatMm(form.widthMm)}`,
          `Anchura der: ${formatMm(form.widthMm)}`,
          `Apertura: ${formatSide(form.openingSide || null)}`,
          `Carril: 16 [${form.railType === 'CARRIL_16' ? 'X' : ' '}]  20 [${form.railType === 'CARRIL_20' ? 'X' : ' '}]`,
          `Montaje: A [${form.mountingType === 'A' ? 'X' : ' '}]  B [${form.mountingType === 'B' ? 'X' : ' '}]`,
          `Cola: ${formatYesNo(tailValue)}`,
          `Automatización: ${formatYesNo(automationIncludedValue)}`,
          `Refuerzo automatización: ${formatYesNo(automationReinforcementValue)}`,
        ];
        detailRows.forEach(row => {
          doc.text(row, marginX, cursorY);
          cursorY += 5;
        });
      }
      if (selectedDoorType === 'VALLA') {
        const detailRows = [
          `Altura: ${formatMm(form.heightMm)}`,
          `Anchura: ${formatMm(form.widthMm)}`,
        ];
        detailRows.forEach(row => {
          doc.text(row, marginX, cursorY);
          cursorY += 5;
        });
      }
      cursorY += 4;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('DESGLOSE', marginX, cursorY);
      cursorY += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('Aluminio soldado', marginX, cursorY);

      autoTable(doc, {
        startY: cursorY + 6,
        columns: [
          { header: 'Img Seccional', dataKey: 'imgSeccional' },
          { header: 'Descripción', dataKey: 'description' },
          { header: 'Img Lateral', dataKey: 'imgLateral' },
          { header: 'Unidades', dataKey: 'units' },
          { header: 'Medida corte', dataKey: 'cutMeasure' },
        ],
        body: rows,
        styles: { fontSize: 9, cellPadding: 2, minCellHeight: 14 },
        headStyles: { fillColor: [229, 83, 75] },
        columnStyles: {
          imgSeccional: { cellWidth: 18 },
          imgLateral: { cellWidth: 18 },
          units: { cellWidth: 16 },
          cutMeasure: { cellWidth: 28 },
        },
        margin: { left: marginX, right: marginX },
        didDrawCell: data => {
          if (data.section !== 'body') return;
          if (data.column.dataKey !== 'imgSeccional' && data.column.dataKey !== 'imgLateral') return;
          const key = String(data.cell.raw || '');
          const img = imageData[key];
          if (!img) return;
          const format = getImageFormat(key);
          const imgSize = 12;
          const x = data.cell.x + (data.cell.width - imgSize) / 2;
          const y = data.cell.y + (data.cell.height - imgSize) / 2;
          doc.addImage(img, format, x, y, imgSize, imgSize);
        },
      });

      doc.save(`despiece-${cutlist.id.slice(0, 8)}.pdf`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo exportar el PDF.';
      setError(message);
    }
  };

  const exportCsv = () => {
    if (!cutlist) {
      setError('Genera el despiece antes de exportar.');
      return;
    }
    const header = ['Descripcion', 'Unidades', 'Medida corte'];
    const rows = cutlist.items.map(item => ([
      item.description.replace(/"/g, '""'),
      String(item.units),
      item.cutMeasure.replace(/"/g, '""'),
    ]));
    const csv = [header, ...rows]
      .map(row => row.map(value => `"${value}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `despiece-${cutlist.id.slice(0, 8)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6 print-hide">
        <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 20% 20%, rgba(229,83,75,0.12), transparent 55%)' }} />
        <div className="relative z-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-8 p-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
              Despiece Inteligente
            </div>
            <h1 className="text-3xl font-black text-slate-900">Calculadora de Despiece ALUON</h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Moderniza el despiece con un flujo guiado, validaciones fuertes y conexión directa con Spring Boot.
              Los resultados se generan con la misma lógica del motor de producción.
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              {DOOR_TYPES.map(type => (
                <div
                  key={type.value}
                  className={`rounded-2xl border px-4 py-3 text-xs font-bold uppercase tracking-wider transition ${selectedDoorType === type.value ? 'border-transparent' : 'border-slate-200'}`}
                  style={selectedDoorType === type.value ? { background: 'var(--accent)', color: '#fff', boxShadow: '0 12px 30px var(--accent-shadow-light)' } : { background: '#fff', color: '#94a3b8' }}
                >
                  {type.label}
                </div>
              ))}
            </div>
          </div>
          <div className="relative rounded-3xl overflow-hidden shadow-[0_18px_45px_rgba(15,23,42,0.2)]">
            <img src={previewImage} alt="Vista previa" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-slate-900/10 to-transparent" />
            <div className="relative z-10 p-6 h-full flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.3em] text-white/70">Modelo Seleccionado</div>
                <div className="text-2xl font-black text-white mt-2">{formatModel(selectedModel)}</div>
              </div>
              <div className="rounded-2xl bg-white/15 backdrop-blur px-4 py-3 text-xs text-white">
                {selectedDoorType ? `Configuración activa: ${formatDoorType(selectedDoorType)}` : 'Selecciona un tipo de puerta para empezar.'}
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
        <div className="space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_26px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">Datos generales</h2>
                <p className="text-xs text-slate-500">Información base del presupuesto y acabado.</p>
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Paso 1</div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div>
                <label className="field-label">Distribuidor (cliente)</label>
                <select
                  className="field"
                  value={form.customerId}
                  onChange={event => updateField('customerId', event.target.value)}
                  disabled={locked || customersLoading}
                >
                  <option value="">
                    {customersLoading ? 'Cargando clientes...' : 'Selecciona un cliente'}
                  </option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.nombreComercial}
                    </option>
                  ))}
                </select>
                {customersError && (
                  <div className="mt-2 text-xs font-semibold text-rose-600">{customersError}</div>
                )}
              </div>
              <div>
                <label className="field-label">Nº Presupuesto</label>
                <div className="field bg-slate-50 text-slate-500">
                  Autogenerado al guardar
                </div>
              </div>
              <div>
                <label className="field-label">Fecha</label>
                <input
                  type="date"
                  className="field"
                  value={form.budgetDate}
                  onChange={event => updateField('budgetDate', event.target.value)}
                  disabled={locked}
                />
              </div>
              <div>
                <label className="field-label">Color</label>
                <input
                  className="field"
                  value={form.color}
                  onChange={event => updateField('color', event.target.value)}
                  disabled={locked}
                  placeholder="RAL / acabado"
                />
              </div>
              <div>
                <label className="field-label">Modelo</label>
                <select
                  className="field"
                  value={form.model}
                  onChange={event => updateField('model', event.target.value as FormState['model'])}
                  disabled={locked}
                >
                  <option value="">Selecciona un modelo</option>
                  {MODEL_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="field-label">Tipo de puerta</label>
                <select
                  className="field"
                  value={form.doorType}
                  onChange={event => updateField('doorType', event.target.value as FormState['doorType'])}
                  disabled={locked}
                >
                  <option value="">Selecciona un tipo</option>
                  {DOOR_TYPES.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="field-label">Nombre instalador (opcional)</label>
                <input
                  className="field"
                  value={form.installerName}
                  onChange={event => updateField('installerName', event.target.value)}
                  disabled={locked}
                  placeholder="Nombre de instalador"
                />
              </div>
              <div className="md:col-span-2">
                <label className="field-label">Observaciones</label>
                <textarea
                  className="field min-h-[96px]"
                  value={form.notes}
                  onChange={event => updateField('notes', event.target.value)}
                  disabled={locked}
                  placeholder="Notas adicionales"
                />
              </div>
            </div>
          </section>

          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 font-semibold">
              {error}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <button className="btn-primary" onClick={onSubmit} disabled={submitting}>
                {submitting ? 'Generando...' : 'Generar despiece'}
              </button>
              <button className="btn-ghost" onClick={handlePrint} disabled={!cutlist}>
                Imprimir
              </button>
              <button className="btn-ghost" onClick={exportPdf} disabled={!cutlist}>
                Exportar PDF
              </button>
              <button className="btn-ghost" onClick={exportCsv} disabled={!cutlist}>
                Exportar CSV
              </button>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <button className="btn-ghost" onClick={() => setLocked(false)} disabled={!locked}>
                Editar
              </button>
              <button className="btn-ghost" onClick={resetAll}>
                Reiniciar
              </button>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_26px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">Medidas y opciones</h2>
                <p className="text-xs text-slate-500">Completa los datos específicos del tipo seleccionado.</p>
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Paso 2</div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div>
                <label className="field-label">Altura total (mm)</label>
                <input
                  className="field"
                  value={form.heightMm}
                  onChange={event => updateField('heightMm', event.target.value)}
                  disabled={locked}
                  placeholder="Ej: 1800"
                />
              </div>
              <div>
                <label className="field-label">Anchura total (mm)</label>
                <input
                  className="field"
                  value={form.widthMm}
                  onChange={event => updateField('widthMm', event.target.value)}
                  disabled={locked}
                  placeholder="Ej: 1200"
                />
              </div>

              {(selectedDoorType === 'PEATONAL' || selectedDoorType === 'ABATIBLE_UNA' || selectedDoorType === 'ABATIBLE_DOS') && (
                <>
                  <div>
                    <label className="field-label">Holgura con el suelo (mm)</label>
                    <input
                      className="field"
                      value={form.groundClearanceMm}
                      onChange={event => updateField('groundClearanceMm', event.target.value)}
                      disabled={locked}
                      placeholder="Ej: 18"
                    />
                  </div>
                  <div>
                    <label className="field-label">Bisagras</label>
                    <select
                      className="field"
                      value={form.hingesSide}
                      onChange={event => updateField('hingesSide', event.target.value as FormState['hingesSide'])}
                      disabled={locked}
                    >
                      <option value="">Selecciona</option>
                      <option value="LEFT">Izquierda</option>
                      <option value="RIGHT">Derecha</option>
                    </select>
                  </div>
                </>
              )}

              {selectedDoorType === 'PEATONAL' && (
                <>
                  <div>
                    <label className="field-label">Portero automático</label>
                    <select
                      className="field"
                      value={form.porterAutomatic}
                      onChange={event => updateField('porterAutomatic', event.target.value as FormState['porterAutomatic'])}
                      disabled={locked}
                    >
                      <option value="">Selecciona</option>
                      {BOOLEAN_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="field-label">Larguero</label>
                    <select
                      className="field"
                      value={form.largueroMm}
                      onChange={event => updateField('largueroMm', event.target.value as FormState['largueroMm'])}
                      disabled={locked}
                    >
                      <option value="">Selecciona</option>
                      <option value="50">50mm</option>
                      <option value="80">80mm</option>
                    </select>
                  </div>
                  <div>
                    <label className="field-label">Marco superior</label>
                    <select
                      className="field"
                      value={form.topFrame}
                      onChange={event => updateField('topFrame', event.target.value as FormState['topFrame'])}
                      disabled={locked}
                    >
                      <option value="">Selecciona</option>
                      {BOOLEAN_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {(selectedDoorType === 'ABATIBLE_UNA' || selectedDoorType === 'ABATIBLE_DOS') && (
                <>
                  <div>
                    <label className="field-label">Incluir automatización</label>
                    <select
                      className="field"
                      value={form.automationIncluded}
                      onChange={event => updateField('automationIncluded', event.target.value as FormState['automationIncluded'])}
                      disabled={locked}
                    >
                      <option value="">Selecciona</option>
                      {BOOLEAN_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="field-label">Refuerzo automatización</label>
                    <select
                      className="field"
                      value={form.automationReinforcement}
                      onChange={event => updateField('automationReinforcement', event.target.value as FormState['automationReinforcement'])}
                      disabled={locked || automationReinforcementLocked}
                    >
                      <option value="">Selecciona</option>
                      {BOOLEAN_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="field-label">Larguero</label>
                    <select
                      className="field"
                      value={form.largueroMm}
                      onChange={event => updateField('largueroMm', event.target.value as FormState['largueroMm'])}
                      disabled={locked}
                    >
                      <option value="">Selecciona</option>
                      <option value="50">50mm</option>
                      <option value="80">80mm</option>
                    </select>
                  </div>
                  <div>
                    <label className="field-label">Marco superior</label>
                    <select
                      className="field"
                      value={form.topFrame}
                      onChange={event => updateField('topFrame', event.target.value as FormState['topFrame'])}
                      disabled={locked}
                    >
                      <option value="">Selecciona</option>
                      {BOOLEAN_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {selectedDoorType === 'CORREDERA' && (
                <>
                  <div>
                    <label className="field-label">Apertura</label>
                    <select
                      className="field"
                      value={form.openingSide}
                      onChange={event => updateField('openingSide', event.target.value as FormState['openingSide'])}
                      disabled={locked}
                    >
                      <option value="">Selecciona</option>
                      <option value="LEFT">Izquierda</option>
                      <option value="RIGHT">Derecha</option>
                    </select>
                  </div>
                  <div>
                    <label className="field-label">Carril</label>
                    <select
                      className="field"
                      value={form.railType}
                      onChange={event => updateField('railType', event.target.value as FormState['railType'])}
                      disabled={locked}
                    >
                      <option value="">Selecciona</option>
                      <option value="CARRIL_16">16mm</option>
                      <option value="CARRIL_20">20mm</option>
                    </select>
                  </div>
                  <div>
                    <label className="field-label">Incluir automatización</label>
                    <select
                      className="field"
                      value={form.automationIncluded}
                      onChange={event => updateField('automationIncluded', event.target.value as FormState['automationIncluded'])}
                      disabled={locked}
                    >
                      <option value="">Selecciona</option>
                      {BOOLEAN_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="field-label">Refuerzo automatización</label>
                    <select
                      className="field"
                      value={form.automationReinforcement}
                      onChange={event => updateField('automationReinforcement', event.target.value as FormState['automationReinforcement'])}
                      disabled={locked || automationReinforcementLocked}
                    >
                      <option value="">Selecciona</option>
                      {BOOLEAN_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="field-label">Montaje</label>
                    <select
                      className="field"
                      value={form.mountingType}
                      onChange={event => updateField('mountingType', event.target.value as FormState['mountingType'])}
                      disabled={locked}
                    >
                      <option value="">Selecciona</option>
                      <option value="A">Montaje A</option>
                      <option value="B">Montaje B</option>
                    </select>
                  </div>
                  <div>
                    <label className="field-label">Cola</label>
                    <select
                      className="field"
                      value={form.tail}
                      onChange={event => updateField('tail', event.target.value as FormState['tail'])}
                      disabled={locked}
                    >
                      <option value="">Selecciona</option>
                      {BOOLEAN_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>
            <div className="mt-4 text-xs text-slate-500">
              Nota: todas las medidas están en milímetros (mm).
            </div>
          </section>
        </aside>
      </div>

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
        {cutlist && (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-xs text-slate-700">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-slate-400">Distribuidor</div>
                <div className="font-semibold">{selectedCustomer?.nombreComercial ?? '-'}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-slate-400">Presupuesto</div>
                <div className="font-semibold">{cutlist.budgetNumber ?? '-'}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-slate-400">Fecha</div>
                <div className="font-semibold">{formatDate(cutlist.budgetDate ?? form.budgetDate)}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-slate-400">Modelo</div>
                <div className="font-semibold">{formatModel(cutlist.model ?? selectedModel)}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-slate-400">Acabado</div>
                <div className="font-semibold">{formatDoorType(cutlist.doorType ?? selectedDoorType)}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-slate-400">Color</div>
                <div className="font-semibold">{cutlist.color ?? form.color}</div>
              </div>
              <div className="md:col-span-3">
                <div className="text-[10px] uppercase tracking-widest text-slate-400">Instalador / Observaciones</div>
                <div className="font-semibold">
                  {form.installerName || form.notes ? `${form.installerName || '-'} · ${form.notes || '-'}` : '-'}
                </div>
              </div>
            </div>

            {selectedDoorType === 'PEATONAL' && (
              <div className="mt-4 grid md:grid-cols-3 gap-3">
                <div><span className="font-semibold">Altura:</span> {formatMm(form.heightMm)}</div>
                <div><span className="font-semibold">Anchura:</span> {formatMm(form.widthMm)}</div>
                <div><span className="font-semibold">Holgura:</span> {formatMm(form.groundClearanceMm)}</div>
                <div><span className="font-semibold">Bisagras:</span> {formatSide(form.hingesSide || null)}</div>
                <div><span className="font-semibold">Portero automático:</span> {formatYesNo(porterAutomaticValue)}</div>
                <div><span className="font-semibold">Larguero:</span> {form.largueroMm ? `${form.largueroMm} mm` : '-'}</div>
                <div><span className="font-semibold">Marco superior:</span> {formatYesNo(topFrameValue)}</div>
              </div>
            )}

            {(selectedDoorType === 'ABATIBLE_UNA' || selectedDoorType === 'ABATIBLE_DOS') && (
              <div className="mt-4 grid md:grid-cols-3 gap-3">
                <div><span className="font-semibold">Altura izq:</span> {formatMm(form.heightMm)}</div>
                <div><span className="font-semibold">Altura der:</span> {formatMm(form.heightMm)}</div>
                <div><span className="font-semibold">Anchura:</span> {formatMm(form.widthMm)}</div>
                <div><span className="font-semibold">Holgura:</span> {formatMm(form.groundClearanceMm)}</div>
                <div><span className="font-semibold">Bisagras:</span> {formatSide(form.hingesSide || null)}</div>
                <div><span className="font-semibold">Automatización:</span> {formatYesNo(automationIncludedValue)}</div>
                <div><span className="font-semibold">Refuerzo automatización:</span> {formatYesNo(automationReinforcementValue)}</div>
                <div><span className="font-semibold">Larguero:</span> {form.largueroMm ? `${form.largueroMm} mm` : '-'}</div>
                <div><span className="font-semibold">Marco superior:</span> {formatYesNo(topFrameValue)}</div>
              </div>
            )}

            {selectedDoorType === 'CORREDERA' && (
              <div className="mt-4 grid md:grid-cols-3 gap-3">
                <div><span className="font-semibold">Altura:</span> {formatMm(form.heightMm)}</div>
                <div><span className="font-semibold">Anchura izq:</span> {formatMm(form.widthMm)}</div>
                <div><span className="font-semibold">Anchura der:</span> {formatMm(form.widthMm)}</div>
                <div><span className="font-semibold">Apertura:</span> {formatSide(form.openingSide || null)}</div>
                <div><span className="font-semibold">Carril:</span> 16 [{form.railType === 'CARRIL_16' ? 'X' : ' '}] 20 [{form.railType === 'CARRIL_20' ? 'X' : ' '}]</div>
                <div><span className="font-semibold">Montaje:</span> A [{form.mountingType === 'A' ? 'X' : ' '}] B [{form.mountingType === 'B' ? 'X' : ' '}]</div>
                <div><span className="font-semibold">Cola:</span> {formatYesNo(tailValue)}</div>
                <div><span className="font-semibold">Automatización:</span> {formatYesNo(automationIncludedValue)}</div>
                <div><span className="font-semibold">Refuerzo automatización:</span> {formatYesNo(automationReinforcementValue)}</div>
              </div>
            )}

            {selectedDoorType === 'VALLA' && (
              <div className="mt-4 grid md:grid-cols-3 gap-3">
                <div><span className="font-semibold">Altura:</span> {formatMm(form.heightMm)}</div>
                <div><span className="font-semibold">Anchura:</span> {formatMm(form.widthMm)}</div>
              </div>
            )}
          </div>
        )}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-slate-400 border-b">
              <tr>
                <th className="py-3 text-left">Descripción</th>
                <th className="py-3 text-left">Unidades</th>
                <th className="py-3 text-left">Medida de corte</th>
              </tr>
            </thead>
            <tbody>
              {cutlist?.items.map((item, index) => (
                <tr key={`${item.description}-${index}`} className="border-b last:border-none">
                  <td className="py-3 text-slate-900 font-semibold">{item.description}</td>
                  <td className="py-3 text-slate-600">{item.units}</td>
                  <td className="py-3 text-slate-600">{item.cutMeasure}</td>
                </tr>
              ))}
              {!cutlist && (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-xs text-slate-400">
                    Aún no hay datos para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="print-only">
        <div className="print-header">
          <div className="print-title">Despiece ALUON</div>
          <div className="print-meta">
            <div><strong>Distribuidor:</strong> {selectedCustomer?.nombreComercial ?? '-'}</div>
            <div><strong>Presupuesto:</strong> {cutlist?.budgetNumber ?? '-'}</div>
            <div><strong>Fecha:</strong> {formatDate(cutlist?.budgetDate ?? form.budgetDate)}</div>
            <div><strong>Modelo:</strong> {formatModel(cutlist?.model ?? selectedModel)}</div>
            <div><strong>Tipo:</strong> {formatDoorType(cutlist?.doorType ?? selectedDoorType)}</div>
            <div><strong>Color:</strong> {cutlist?.color ?? form.color}</div>
            <div><strong>Acabado:</strong> {formatDoorType(cutlist?.doorType ?? selectedDoorType)}</div>
            <div><strong>Instalador:</strong> {form.installerName || '-'}</div>
            <div><strong>Observaciones:</strong> {form.notes || '-'}</div>
            {selectedDoorType === 'PEATONAL' && (
              <>
                <div><strong>Altura:</strong> {formatMm(form.heightMm)}</div>
                <div><strong>Anchura:</strong> {formatMm(form.widthMm)}</div>
                <div><strong>Holgura:</strong> {formatMm(form.groundClearanceMm)}</div>
                <div><strong>Bisagras:</strong> {formatSide(form.hingesSide || null)}</div>
                <div><strong>Portero automático:</strong> {formatYesNo(porterAutomaticValue)}</div>
                <div><strong>Larguero:</strong> {form.largueroMm ? `${form.largueroMm} mm` : '-'}</div>
                <div><strong>Marco superior:</strong> {formatYesNo(topFrameValue)}</div>
              </>
            )}
            {(selectedDoorType === 'ABATIBLE_UNA' || selectedDoorType === 'ABATIBLE_DOS') && (
              <>
                <div><strong>Altura izq:</strong> {formatMm(form.heightMm)}</div>
                <div><strong>Altura der:</strong> {formatMm(form.heightMm)}</div>
                <div><strong>Anchura:</strong> {formatMm(form.widthMm)}</div>
                <div><strong>Holgura:</strong> {formatMm(form.groundClearanceMm)}</div>
                <div><strong>Bisagras:</strong> {formatSide(form.hingesSide || null)}</div>
                <div><strong>Automatización:</strong> {formatYesNo(automationIncludedValue)}</div>
                <div><strong>Refuerzo automatización:</strong> {formatYesNo(automationReinforcementValue)}</div>
                <div><strong>Larguero:</strong> {form.largueroMm ? `${form.largueroMm} mm` : '-'}</div>
                <div><strong>Marco superior:</strong> {formatYesNo(topFrameValue)}</div>
              </>
            )}
            {selectedDoorType === 'CORREDERA' && (
              <>
                <div><strong>Altura:</strong> {formatMm(form.heightMm)}</div>
                <div><strong>Anchura izq:</strong> {formatMm(form.widthMm)}</div>
                <div><strong>Anchura der:</strong> {formatMm(form.widthMm)}</div>
                <div><strong>Apertura:</strong> {formatSide(form.openingSide || null)}</div>
                <div><strong>Carril:</strong> 16 [{form.railType === 'CARRIL_16' ? 'X' : ' '}] 20 [{form.railType === 'CARRIL_20' ? 'X' : ' '}]</div>
                <div><strong>Montaje:</strong> A [{form.mountingType === 'A' ? 'X' : ' '}] B [{form.mountingType === 'B' ? 'X' : ' '}]</div>
                <div><strong>Cola:</strong> {formatYesNo(tailValue)}</div>
                <div><strong>Automatización:</strong> {formatYesNo(automationIncludedValue)}</div>
                <div><strong>Refuerzo automatización:</strong> {formatYesNo(automationReinforcementValue)}</div>
              </>
            )}
            {selectedDoorType === 'VALLA' && (
              <>
                <div><strong>Altura:</strong> {formatMm(form.heightMm)}</div>
                <div><strong>Anchura:</strong> {formatMm(form.widthMm)}</div>
              </>
            )}
          </div>
        </div>
        <table className="print-table">
          <thead>
            <tr>
              <th>Descripción</th>
              <th>Unidades</th>
              <th>Medida corte</th>
            </tr>
          </thead>
          <tbody>
            {cutlist?.items.map((item, index) => (
              <tr key={`${item.description}-print-${index}`}>
                <td>{item.description}</td>
                <td>{item.units}</td>
                <td>{item.cutMeasure}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default CutlistPage;
