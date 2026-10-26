// Small self-contained UI behaviours.

// Two-tap confirm: first tap arms the button ("Tap again…"), a second tap within 3s runs the action.
export function confirmTwice(btn, armedText, action) {
  const lbl = btn.querySelector('.lbl');
  const idle = lbl.textContent;
  let timer = 0;
  const disarm = () => {
    clearTimeout(timer);
    btn.classList.remove('armed');
    lbl.textContent = idle;
  };
  return () => {
    if (!btn.classList.contains('armed')) {
      btn.classList.add('armed');
      lbl.textContent = armedText;
      timer = setTimeout(disarm, 3000);
      return;
    }
    disarm();
    action();
  };
}

// Second-confirmation dialog for big destructive actions. Resolves true only on the "yes" button.
export function askConfirm(dialog, message) {
  dialog.querySelector('.confirm-msg').textContent = message;
  dialog.returnValue = '';
  dialog.showModal();
  return new Promise((resolve) => {
    dialog.addEventListener('close', () => resolve(dialog.returnValue === 'yes'), { once: true });
  });
}

// Print button opens a "my colours / blank page" chooser, then the browser's print dialog.
export function setupPrint(button, dialog) {
  button.addEventListener('click', () => { dialog.returnValue = ''; dialog.showModal(); });
  dialog.addEventListener('close', () => {
    const choice = dialog.returnValue;
    if (choice !== 'colors' && choice !== 'blank') return;
    document.body.classList.toggle('print-blank', choice === 'blank');
    setTimeout(() => window.print(), 50);
  });
  addEventListener('afterprint', () => document.body.classList.remove('print-blank'));
}

// Page turn: the sheet rotates around the spine (left edge), darkening as it goes.
export function flipSheet(sheet, forward, ms) {
  const open = { transform: 'rotateY(0deg)', filter: 'brightness(1)' };
  const mid = { transform: 'rotateY(-90deg)', filter: 'brightness(.82)' };
  const shut = { transform: 'rotateY(-180deg)', filter: 'brightness(.7)' };
  return sheet.animate(forward ? [open, mid, shut] : [shut, mid, open],
    { duration: ms, easing: 'cubic-bezier(.45,.05,.35,1)' }).finished;
}
