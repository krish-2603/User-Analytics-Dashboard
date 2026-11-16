// CSS Data & Appearance Service: Valid CSS File & Stylesheet Generation
// Handles column selection, custom header aliases, date filters, and CSS special character escaping

const AVAILABLE_COLUMNS = [
  { key: 'id', label: 'ID', defaultSelected: false, type: 'number' },
  { key: 'request_id', label: 'Request ID', defaultSelected: false, type: 'string' },
  { key: 'ip_address', label: 'IP Address', defaultSelected: true, type: 'string' },
  { key: 'country_name', label: 'Country', defaultSelected: true, type: 'string' },
  { key: 'country_code', label: 'Country Code', defaultSelected: false, type: 'string' },
  { key: 'city', label: 'City', defaultSelected: true, type: 'string' },
  { key: 'continent', label: 'Continent', defaultSelected: false, type: 'string' },
  { key: 'timestamp', label: 'Timestamp (UTC)', defaultSelected: true, type: 'datetime' },
  { key: 'browser', label: 'Browser', defaultSelected: true, type: 'string' },
  { key: 'os', label: 'Operating System', defaultSelected: true, type: 'string' },
  { key: 'device_type', label: 'Device Type', defaultSelected: false, type: 'string' },
  { key: 'page_visited', label: 'Page Visited', defaultSelected: true, type: 'string' },
  { key: 'referrer', label: 'Referrer URL', defaultSelected: false, type: 'string' },
  { key: 'status_code', label: 'HTTP Status', defaultSelected: true, type: 'number' },
  { key: 'response_time_ms', label: 'Response Time (ms)', defaultSelected: false, type: 'number' }
];

/**
 * Escapes special characters, double quotes, backslashes, and linebreaks for safe CSS string literals
 */
function escapeCssString(val) {
  if (val === null || val === undefined) return '';
  const str = String(val);
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\r?\n/g, ' ')
    .trim();
}

/**
 * Generate a valid CSS stylesheet file using the selected analytics data
 * Formats records as CSS variables and styling rules for dashboard data representation
 */
function generateCss(records, options = {}) {
  const {
    selectedColumns = ['ip_address', 'country_name', 'timestamp', 'browser', 'os', 'page_visited', 'status_code'],
    columnAliases = {},
    includeHeaders = true
  } = options;

  const activeColumns = selectedColumns.filter(colKey =>
    AVAILABLE_COLUMNS.some(c => c.key === colKey)
  );

  const headerLabels = activeColumns.map(colKey => {
    const def = AVAILABLE_COLUMNS.find(c => c.key === colKey);
    return columnAliases[colKey] && columnAliases[colKey].trim().length > 0
      ? columnAliases[colKey].trim()
      : (def ? def.label : colKey);
  });

  const lines = [
    '/**',
    ' * ==========================================================================',
    ' * Admin Dashboard – User Analytics CSS Dataset',
    ` * Generated: ${new Date().toISOString()}`,
    ` * Total Records: ${records.length}`,
    ' * Format: Valid CSS Stylesheet with Custom Properties & Data Rules',
    ' * ==========================================================================',
    ' */',
    '',
    ':root {',
    '  --analytics-title: "User Analytics Export";',
    `  --analytics-total-records: ${records.length};`,
    `  --analytics-columns-count: ${activeColumns.length};`,
    `  --analytics-exported-at: "${new Date().toISOString()}";`
  ];

  if (includeHeaders) {
    const escapedHeaders = headerLabels.map(h => escapeCssString(h)).join(', ');
    lines.push(`  --analytics-headers: "${escapedHeaders}";`);
  }

  lines.push('}', '');

  // Add styles for the analytics table rendering
  lines.push(
    '/* Analytics Data Table Styling */',
    '.analytics-table {',
    '  display: table;',
    '  width: 100%;',
    '  border-collapse: collapse;',
    '  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;',
    '}',
    '',
    '.analytics-header {',
    '  font-weight: 700;',
    '  background: #1e293b;',
    '  color: #94a3b8;',
    '  text-transform: uppercase;',
    '}',
    ''
  );

  // Add per-record CSS rules
  const previewRows = [];
  records.forEach((record, index) => {
    const selector = `.analytics-record[data-row="${index + 1}"]`;
    lines.push(`${selector} {`);

    const previewObj = {};
    activeColumns.forEach((colKey, i) => {
      const val = record[colKey] !== undefined ? record[colKey] : '';
      const safeVal = escapeCssString(val);
      const cssVarName = `--col-${colKey.replace(/_/g, '-')}`;
      lines.push(`  ${cssVarName}: "${safeVal}";`);
      previewObj[headerLabels[i]] = val;
    });

    lines.push('}', '');

    if (previewRows.length < 50) {
      previewRows.push(previewObj);
    }
  });

  const cssContent = lines.join('\n');

  return {
    cssContent,
    headerLabels,
    activeColumns,
    totalRows: records.length,
    previewRows,
    byteSize: Buffer.byteLength(cssContent, 'utf8')
  };
}

module.exports = {
  AVAILABLE_COLUMNS,
  escapeCssString,
  generateCss
};
