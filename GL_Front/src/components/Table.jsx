import React from 'react';
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

export const Table = ({
  columns,
  data,
  onEdit,
  onDelete,
  onRowClick,
  loading = false,
  pagination = null,
  onPageChange = null,
  responsive = true
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-gray-100 border-b-2 border-gray-300">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-sm font-semibold text-gray-700"
                style={{ width: col.width }}
              >
                {col.label}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-24">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="px-4 py-8 text-center text-gray-500">
                Chargement...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="px-4 py-8 text-center text-gray-500">
                Aucune donnée
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={idx}
                onClick={() => onRowClick?.(row)}
                className={`border-b border-gray-200 hover:bg-gray-50 transition ${onRowClick ? 'cursor-pointer' : ''}`}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-sm text-gray-700">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      {onEdit && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onEdit(row); }}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-xs font-medium"
                        >
                          Éditer
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onDelete(row); }}
                          className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-xs font-medium"
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {pagination && onPageChange && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Page {pagination.currentPage + 1} sur {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(0)}
              disabled={pagination.currentPage === 0}
              className="p-2 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
            >
              <FiChevronsLeft />
            </button>
            <button
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 0}
              className="p-2 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
            >
              <FiChevronLeft />
            </button>
            <button
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages - 1}
              className="p-2 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
            >
              <FiChevronRight />
            </button>
            <button
              onClick={() => onPageChange(pagination.totalPages - 1)}
              disabled={pagination.currentPage >= pagination.totalPages - 1}
              className="p-2 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
            >
              <FiChevronsRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
