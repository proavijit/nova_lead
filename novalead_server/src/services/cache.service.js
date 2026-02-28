const crypto = require('crypto');

const HASH_VERSION = 'v2';
const CACHE_TTL_DAYS = 30;

function normalizeString(value) {
  if (typeof value !== 'string') return '';
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function normalizeStringArray(values) {
  if (!Array.isArray(values)) return [];
  const unique = new Set();
  values.forEach((value) => {
    const normalized = normalizeString(value);
    if (normalized.length > 0) {
      unique.add(normalized);
    }
  });
  return Array.from(unique).sort((a, b) => a.localeCompare(b));
}

function buildCanonicalFilters(parsedFilters) {
  const source = parsedFilters && typeof parsedFilters === 'object' ? parsedFilters : {};
  const sourceFilters = source.filters && typeof source.filters === 'object' ? source.filters : {};
  const filterKeys = Object.keys(sourceFilters).sort((a, b) => a.localeCompare(b));

  const normalizedFilters = {};
  filterKeys.forEach((key) => {
    const filterNode = sourceFilters[key];
    const values = filterNode && Array.isArray(filterNode.values) ? filterNode.values : [];
    const normalizedValues = normalizeStringArray(values);
    if (normalizedValues.length > 0) {
      normalizedFilters[key] = { values: normalizedValues };
    }
  });

  return {
    mode: normalizeString(source.mode) || 'full',
    page_size: parseInt(source.page_size, 10) || parseInt(source.size, 10) || 10,
    page: parseInt(source.page, 10) || 1,
    filters: normalizedFilters
  };
}

function stableStringify(value) {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  }

  if (value && typeof value === 'object') {
    const keys = Object.keys(value).sort((a, b) => a.localeCompare(b));
    const serialized = keys.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`);
    return `{${serialized.join(',')}}`;
  }

  return JSON.stringify(value);
}

function computeFilterHash(canonicalFilters) {
  const canonicalJson = stableStringify(canonicalFilters);
  const versioned = `${HASH_VERSION}:${canonicalJson}`;
  const filterHash = crypto.createHash('sha256').update(versioned).digest('hex');
  return { filterHash, canonicalJson, hashVersion: HASH_VERSION };
}

function getCacheExpiryDate(base = new Date()) {
  const expiresAt = new Date(base);
  expiresAt.setDate(expiresAt.getDate() + CACHE_TTL_DAYS);
  return expiresAt.toISOString();
}

module.exports = {
  HASH_VERSION,
  CACHE_TTL_DAYS,
  buildCanonicalFilters,
  computeFilterHash,
  getCacheExpiryDate,
  normalizeString,
  normalizeStringArray
};
