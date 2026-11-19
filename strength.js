function bindStrengthLog(state, {isoDate, uid, saveData, esc}) {
  const dialog = document.querySelector('#strengthDialog');
  const form = document.querySelector('#strengthForm');
  const rows = document.querySelector('#strengthSets');
  const status = document.querySelector('#strengthStatus');
  const entries = () => state.data.strengthEntries || [];

  function addSet() {
    const row = document.createElement('fieldset');
    row.innerHTML = `<legend>Set ${rows.children.length + 1}</legend>
      <div class="form-grid">
        <label>Herhalingen<input name="reps" type="number" inputmode="numeric" min="1" required></label>
        <label>Extra gewicht (kg)<input name="weight" type="number" inputmode="decimal" min="0" step="any" placeholder="Lichaamsgewicht"></label>
      </div>
      <button type="button" class="small-button">Verwijder set</button>`;
    row.querySelector('button').onclick = () => {
      if (rows.children.length === 1) return;
      row.remove();
      Array.from(rows.children).forEach((item, index) => {
        item.querySelector('legend').textContent = `Set ${index + 1}`;
      });
    };
    rows.append(row);
  }

  function renderHistory() {
    const query = form.elements.exercise.value.trim().toLowerCase();
    const records = entries().filter(entry => Array.isArray(entry?.sets) && typeof entry.exercise === 'string');
    document.querySelector('#strengthExercises').innerHTML =
      [...new Set(records.map(entry => entry.exercise))].map(name => `<option value="${esc(name)}"></option>`).join('');
    document.querySelector('#strengthHistory').innerHTML = records
      .filter(entry => entry.exercise.toLowerCase().includes(query))
      .reverse().sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 20)
      .map(entry => `<p><strong>${esc(entry.exercise)}</strong> · ${esc(entry.date)}<br>
        ${entry.sets.map(set => `${esc(set.reps)} reps · ${set.weight ? esc(set.weight) + ' kg' : 'lichaamsgewicht'}`).join(' / ')}</p>`)
      .join('') || '<p class="muted">Geen eerdere sets gevonden.</p>';
  }

  document.querySelector('#openStrengthLog').onclick = () => {
    form.elements.date.value ||= isoDate();
    if (!rows.children.length) addSet();
    renderHistory();
    dialog.showModal();
  };
  document.querySelector('#addStrengthSet').onclick = addSet;
  form.elements.exercise.oninput = renderHistory;
  form.onsubmit = async event => {
    event.preventDefault();
    const data = new FormData(form);
    const exercise = data.get('exercise').trim();
    if (!exercise) {
      status.textContent = 'Vul een oefening in.';
      return;
    }
    const weights = data.getAll('weight');
    const sets = data.getAll('reps').map((reps, index) => ({
      reps: Number(reps),
      weight: Number(weights[index]),
    }));
    const previous = entries();
    const submit = form.querySelector('button[type="submit"], button:not([type])');
    submit.disabled = true;
    state.data.strengthEntries = [...previous, {id: uid('strength'), exercise, date: data.get('date'), sets}];
    try {
      await saveData();
      rows.replaceChildren();
      addSet();
      form.elements.exercise.value = '';
      renderHistory();
      status.textContent = `${sets.length} set(s) opgeslagen voor ${exercise}.`;
    } catch {
      state.data.strengthEntries = previous;
      status.textContent = 'Opslaan mislukt. Probeer het opnieuw.';
    } finally {
      submit.disabled = false;
    }
  };
}
