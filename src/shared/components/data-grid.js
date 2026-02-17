// =============================================================================
// DATA GRID — Table component builder
// Version: 1.0.0 | Last Updated: 2026-02-16
// =============================================================================

/**
 * Creates a data grid (HTML table) element.
 * @param {Object} options
 * @param {string[]} options.columns - Column headers
 * @param {Array<Record<string, string>>} options.rows - Row data objects
 * @param {string} [options.className] - Additional CSS classes for wrapper
 * @returns {HTMLElement} A card element containing the table
 */
export function createDataGrid({ columns, rows, className = "" } = {}) {
  const wrapper = document.createElement("div");
  wrapper.className = `card ${className}`.trim();

  let html = '<table class="table"><thead><tr>';

  for (const col of columns) {
    html += `<th>${col}</th>`;
  }
  html += "</tr></thead><tbody>";

  for (const row of rows) {
    html += "<tr>";
    for (const col of columns) {
      const key =
        col.toLowerCase().replace(/\s+/g, "_") ||
        Object.keys(row)[columns.indexOf(col)];
      const value = row[key] ?? row[col] ?? row[col.toLowerCase()] ?? "";
      html += `<td>${value}</td>`;
    }
    html += "</tr>";
  }

  html += "</tbody></table>";
  wrapper.innerHTML = html;
  return wrapper;
}

/**
 * Creates a data grid with a section header.
 * @param {Object} options
 * @param {string} options.title - Section title
 * @param {string[]} options.columns
 * @param {Array<Record<string, string>>} options.rows
 * @returns {HTMLElement}
 */
export function createDataGridSection({ title, columns, rows } = {}) {
  const wrapper = document.createElement("div");
  wrapper.className = "card";
  wrapper.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">${title}</h2>
    </div>
  `;

  let tableHtml = '<table class="table"><thead><tr>';
  for (const col of columns) {
    tableHtml += `<th>${col}</th>`;
  }
  tableHtml += "</tr></thead><tbody>";

  for (const row of rows) {
    tableHtml += "<tr>";
    for (const col of columns) {
      const key = col.toLowerCase().replace(/\s+/g, "_");
      const value = row[key] ?? row[col] ?? row[col.toLowerCase()] ?? "";
      tableHtml += `<td>${value}</td>`;
    }
    tableHtml += "</tr>";
  }

  tableHtml += "</tbody></table>";
  wrapper.insertAdjacentHTML("beforeend", tableHtml);
  return wrapper;
}
