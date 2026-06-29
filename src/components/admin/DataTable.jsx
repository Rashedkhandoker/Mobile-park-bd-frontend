'use client';
import { useState } from 'react';
import { RiSearchLine, RiAddLine, RiEditLine, RiDeleteBin6Line } from 'react-icons/ri';

export default function DataTable({ columns, data, searchKey, onAdd, onEdit, onDelete, addLabel = 'Add New' }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = search && searchKey
    ? data.filter(row => String(row[searchKey] || '').toLowerCase().includes(search.toLowerCase()))
    : data;

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const hasActions = onEdit || onDelete;

  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        {searchKey && (
          <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 320 }}>
            <RiSearchLine style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#a0aec0' }} />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search..."
              style={{
                width: '100%', paddingLeft: 36, paddingRight: 12, height: 38,
                border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.875rem',
                outline: 'none', color: '#1a202c',
              }}
            />
          </div>
        )}
        <span style={{ fontSize: '0.8rem', color: '#718096', flex: 1 }}>
          {filtered.length} records
        </span>
        {onAdd && (
          <button
            onClick={onAdd}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', background: '#6366f1', color: '#fff',
              border: 'none', borderRadius: 8, cursor: 'pointer',
              fontSize: '0.875rem', fontWeight: 600,
            }}
          >
            <RiAddLine size={16} /> {addLabel}
          </button>
        )}
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#f7fafc', borderBottom: '1px solid #e2e8f0' }}>
              {columns.map(col => (
                <th key={col.key} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#4a5568', whiteSpace: 'nowrap' }}>
                  {col.label}
                </th>
              ))}
              {hasActions && (
                <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#4a5568', whiteSpace: 'nowrap' }}>
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><td colSpan={columns.length + (hasActions ? 1 : 0)} style={{ padding: 32, textAlign: 'center', color: '#a0aec0' }}>No data found</td></tr>
            ) : paginated.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                {columns.map(col => (
                  <td key={col.key} style={{ padding: '12px 16px', color: '#2d3748', verticalAlign: 'middle' }}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {hasActions && (
                  <td style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        style={{
                          background: '#eef2ff', color: '#6366f1', border: 'none',
                          borderRadius: 6, padding: '6px 10px', cursor: 'pointer',
                          marginRight: 6, fontSize: '0.8rem',
                        }}
                        title="Edit"
                      >
                        <RiEditLine size={14} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        style={{
                          background: '#fff5f5', color: '#e53e3e', border: 'none',
                          borderRadius: 6, padding: '6px 10px', cursor: 'pointer',
                          fontSize: '0.8rem',
                        }}
                        title="Delete"
                      >
                        <RiDeleteBin6Line size={14} />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div style={{ padding: '12px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              style={{
                width: 32, height: 32, border: '1px solid',
                borderColor: p === page ? '#6366f1' : '#e2e8f0',
                borderRadius: 6, cursor: 'pointer', fontSize: '0.8rem',
                background: p === page ? '#6366f1' : '#fff',
                color: p === page ? '#fff' : '#4a5568',
              }}
            >{p}</button>
          ))}
        </div>
      )}
    </div>
  );
}
