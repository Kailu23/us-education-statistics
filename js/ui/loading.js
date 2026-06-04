export function hideLoading() {
    document.getElementById("loading").style.display = "none";
}

export function showError(e) {
    document.getElementById("loading").innerHTML = `
    <div class="error-msg">
      <h2>⚠ Greška pri učitavanju</h2>

      <p>Nije moguće učitati <code>states_all.csv</code>.
        Provjeri je li datoteka u istom direktoriju kao <code>index.html</code>
        i pokreni lokalni server:</p>
      <p>
        <code>python3 -m http.server 8080</code>
      </p>
      <p style="margin-top:8px;color:var(--accent3);font-size:12px">${e.message || e}</p>
    </div>
  `;
}
