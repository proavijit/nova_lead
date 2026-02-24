function normalizeLead(raw) {
  const safeRaw = raw && typeof raw === 'object' ? raw : {};

  const fullName = safeRaw.full_name ?? null;
  const jobTitle = safeRaw.job_title ?? null;
  const linkedin = safeRaw.linkedin ?? null;

  const companyName = safeRaw.company_name ?? null;
  const companyLinkedin = safeRaw.company_linkedin ?? null;
  const companyWebsite = safeRaw.company_website ?? null;

  const normalizedLinkedin =
    typeof linkedin === 'string'
      ? linkedin.startsWith('http')
        ? linkedin
        : `https://${linkedin}`
      : null;

  const normalizedCompanyLinkedin =
    typeof companyLinkedin === 'string'
      ? companyLinkedin.startsWith('http')
        ? companyLinkedin
        : `https://${companyLinkedin}`
      : null;

  return {
    name: fullName,
    title: jobTitle,
    linkedin_url: normalizedLinkedin,
    company: {
      name: companyName,
      linkedin_url: normalizedCompanyLinkedin,
      website: companyWebsite
    }
  };
}

function normalizeAll(rawArray) {
  if (!Array.isArray(rawArray)) return [];
  return rawArray.map((item) => normalizeLead(item));
}

module.exports = { normalizeAll };
