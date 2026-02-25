const explorium = require('../config/explorium');
const { AppError } = require('../utils/apiError');

async function searchProspects(filtersPayload) {
  try {
    const response = await explorium.post('/v1/prospects', filtersPayload);

    return {
      data: response.data?.data || [],
      total_results: response.data?.total_results || 0
    };
  } catch (err) {
    throw new AppError('Failed to fetch prospects from Explorium', 502);
  }
}

module.exports = { searchProspects };
