// Keyboard colouring: one shape in the picture is tabbable; arrow keys move between shapes,
// Enter/Space activates the focused one.
export function labelShapes(svg, targets, labelFor) {
  const all = [...svg.querySelectorAll('*')];
  targets.forEach((t, n) => {
    const el = all[t.k];
    el.tabIndex = n === 0 ? 0 : -1;
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', labelFor(t, n));
  });
}

export function bindShapeKeys(page, getTargets, onActivate) {
  page.addEventListener('keydown', (e) => {
    const svg = page.querySelector('svg.art');
    const all = [...svg.querySelectorAll('*')];
    const targets = getTargets();
    const at = targets.findIndex((t) => all[t.k] === e.target);
    if (at < 0) return;
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (step) {
      e.preventDefault();
      const next = all[targets[(at + step + targets.length) % targets.length].k];
      e.target.tabIndex = -1;
      next.tabIndex = 0;
      next.focus();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onActivate(e.target, targets[at]);
    }
  });
}
