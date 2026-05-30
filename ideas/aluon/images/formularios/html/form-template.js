const setRect = (el, rect, base) => {
  const { w, h } = base;
  el.style.left = `${(rect.x / w) * 100}%`;
  el.style.top = `${(rect.y / h) * 100}%`;
  el.style.width = `${(rect.w / w) * 100}%`;
  el.style.height = `${(rect.h / h) * 100}%`;
};

const byId = (id) => {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element #${id}`);
  return el;
};

export const mountTemplate = ({ baseWidth, baseHeight, rects, data }) => {
  const base = { w: baseWidth, h: baseHeight };
  Object.entries(rects).forEach(([id, rect]) => {
    setRect(byId(id), rect, base);
  });

  Object.entries(data ?? {}).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (typeof value === "boolean") {
      el.classList.toggle("checked", value);
      return;
    }
    el.textContent = value == null ? "" : String(value);
  });
};

