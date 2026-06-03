import React from 'react';

type CustomerManagementEmptyStateProps = {
  onAdd: () => void;
  filtered?: boolean;
};

const CustomerManagementEmptyState: React.FC<CustomerManagementEmptyStateProps> = ({ onAdd, filtered }) => (
  <tr>
    <td colSpan={10}>
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#9ca3af' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div className="text-center">
          <p className="font-bold text-sm" style={{ color: '#374151' }}>
            {filtered ? 'No se encontraron clientes' : 'No hay clientes'}
          </p>
          <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>
            {filtered ? 'Prueba con otro término de búsqueda.' : 'Añade tu primer cliente para empezar.'}
          </p>
        </div>
        <button onClick={onAdd} className="btn-primary text-sm px-4 py-2">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Añadir cliente
        </button>
      </div>
    </td>
  </tr>
);

export default CustomerManagementEmptyState;
