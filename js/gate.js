// Grown-up check: a multiplication question kids 2-9 are unlikely to answer. Resolves true if answered right.
export function parentGate() {
  const dlg = document.getElementById('gate');
  const a = 6 + Math.floor(Math.random() * 4);
  const b = 6 + Math.floor(Math.random() * 4);
  dlg.querySelector('#gateQ').textContent = `What is ${a} × ${b}?`;
  const input = dlg.querySelector('#gateA');
  const err = dlg.querySelector('#gateErr');
  input.value = '';
  err.hidden = true;
  dlg.showModal();
  input.focus();
  return new Promise((resolve) => {
    const form = dlg.querySelector('form');
    const onSubmit = (e) => {
      e.preventDefault();
      if (e.submitter?.value === 'cancel') return finish(false);
      if (Number(input.value) === a * b) return finish(true);
      err.hidden = false;
      input.select();
    };
    const finish = (ok) => {
      form.removeEventListener('submit', onSubmit);
      dlg.removeEventListener('cancel', onCancel);
      dlg.close();
      resolve(ok);
    };
    const onCancel = () => finish(false);
    form.addEventListener('submit', onSubmit);
    dlg.addEventListener('cancel', onCancel);
  });
}
