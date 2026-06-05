export const documentPrintBaseCss = `
  :root { --ink: #111827; --muted: #6b7280; --border: #e5e7eb; --bg: #ffffff; --soft: #f9fafb; }
  * { box-sizing: border-box; }
  body { font-family: Arial, sans-serif; color: var(--ink); margin: 0; background: #fff; }
  .page {
    position: relative;
    width: 210mm;
    min-height: 297mm;
    padding: 16mm 14mm;
    margin: 0 auto;
    background: var(--bg);
    display: flex;
    flex-direction: column;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  .watermark {
    position: absolute;
    inset: 0;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    opacity: 1;
    pointer-events: none;
  }
  .content { position: relative; z-index: 1; flex: 1 1 auto; }
  .page-footer { position: relative; z-index: 1; margin-top: auto; }
  .row { display: flex; justify-content: space-between; gap: 18px; }
  .small { font-size: 11px; color: var(--muted); line-height: 1.35; }
  .title { font-weight: 900; letter-spacing: 0.14em; text-transform: uppercase; }
  .doc-pill {
    display: inline-block;
    padding: 8px 12px;
    font-weight: 900;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: var(--soft);
  }
  .meta { margin-top: 10px; display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; }
  .meta strong { font-size: 12px; }
  .box {
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 10px 12px;
    background: #fff;
  }
  .table { width: 100%; border-collapse: collapse; margin-top: 14px; font-size: 11px; }
  .table th, .table td { border: 1px solid var(--border); padding: 7px 8px; vertical-align: top; }
  .table th { background: var(--soft); color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; font-size: 10px; font-weight: 900; }
  .right { text-align: right; }
  .totals { margin-top: 14px; display: flex; justify-content: flex-end; }
  .totals table { border-collapse: collapse; font-size: 11px; min-width: 280px; }
  .totals td { border: 1px solid var(--border); padding: 8px 10px; }
  .totals tr:first-child td { background: var(--soft); color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; font-size: 10px; font-weight: 900; }
  .note { margin-top: 14px; }
  .footer { margin-top: 18px; display: flex; justify-content: space-between; gap: 24px; }
  .sig { height: 54px; border: 1px dashed var(--border); border-radius: 12px; margin-top: 8px; }
  @page { size: A4; margin: 0; }
  @media print {
    body { margin: 0; }
    .page { box-shadow: none; }
  }
`;

