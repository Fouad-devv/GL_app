// Format utilities

export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '0.00 MAD';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'MAD',
  }).format(amount);
};

export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('fr-FR').format(num);
};

export const formatPercent = (num) => {
  if (num === null || num === undefined) return '0%';
  return `${num.toFixed(1)}%`;
};

export const getStatusBadgeColor = (status) => {
  const colors = {
    'EN_SERVICE': 'bg-green-100 text-green-800',
    'EN_MAINTENANCE': 'bg-yellow-100 text-yellow-800',
    'HORS_SERVICE': 'bg-gray-100 text-gray-800',
    'EN_REPARATION': 'bg-red-100 text-red-800',
    'PLANIFIEE': 'bg-blue-100 text-blue-800',
    'EN_COURS': 'bg-yellow-100 text-yellow-800',
    'TERMINEE': 'bg-green-100 text-green-800',
    'ANNULEE': 'bg-gray-100 text-gray-800',
    'EN_RETARD': 'bg-red-100 text-red-800',
    'ACTIF': 'bg-green-100 text-green-800',
    'INACTIF': 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const getStatusLabel = (status) => {
  const labels = {
    'EN_SERVICE': 'En service',
    'EN_MAINTENANCE': 'En maintenance',
    'HORS_SERVICE': 'Hors service',
    'EN_REPARATION': 'En réparation',
    'PLANIFIEE': 'Planifiée',
    'EN_COURS': 'En cours',
    'TERMINEE': 'Terminée',
    'ANNULEE': 'Annulée',
    'EN_RETARD': 'En retard',
    'ACTIF': 'Actif',
    'INACTIF': 'Inactif',
  };
  return labels[status] || status;
};

/**
 * Downloads a file from an Axios response or a raw Blob.
 * Handles all three cases:
 *   - Full Axios response object  → uses response.data
 *   - Raw Blob                    → uses it directly
 *   - Anything else               → wraps in new Blob()
 */
export const downloadFile = (blobOrResponse, filename) => {
  let blob;

  if (blobOrResponse instanceof Blob) {
    // Raw Blob passed directly
    blob = blobOrResponse;
  } else if (blobOrResponse?.data instanceof Blob) {
    // Axios response object: { data: Blob, status: 200, ... }
    blob = blobOrResponse.data;
  } else if (blobOrResponse?.data) {
    // Axios response with non-Blob data (e.g. ArrayBuffer or string)
    blob = new Blob([blobOrResponse.data]);
  } else {
    // Fallback
    blob = new Blob([blobOrResponse ?? '']);
  }

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export const truncateText = (text, length = 50) => {
  if (!text) return '';
  if (text.length > length) {
    return text.substring(0, length) + '...';
  }
  return text;
};