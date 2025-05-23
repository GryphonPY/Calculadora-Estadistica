
import React, { useState, useEffect, useMemo } from 'react';
import { DiscreteRVEntry } from '../types';
import { MinusCircleIcon } from './icons/MinusCircleIcon';
import { PlusCircleIcon } from './icons/PlusCircleIcon';

interface DiscreteRVInputProps {
  rows: DiscreteRVEntry[];
  onChange: (newRows: DiscreteRVEntry[]) => void;
  disabled?: boolean;
}

const MIN_ROWS_DRV = 3;

const DiscreteRVInput: React.FC<DiscreteRVInputProps> = ({ rows, onChange, disabled }) => {
  
  const ensureMinRows = (currentRows: DiscreteRVEntry[]): DiscreteRVEntry[] => {
    const newRows = [...currentRows];
    while (newRows.length < MIN_ROWS_DRV) {
      newRows.push({ id: crypto.randomUUID(), x: '', p: '' });
    }
    return newRows;
  };

  const [internalRows, setInternalRows] = useState<DiscreteRVEntry[]>(() => ensureMinRows(rows));

  useEffect(() => {
    // Sync when the prop `rows` change from AppState (e.g., on mode change or reset)
    setInternalRows(ensureMinRows(rows));
  }, [rows]);

  const handleAddRow = () => {
    const newId = crypto.randomUUID();
    const newRows = [...internalRows, { id: newId, x: '', p: '' }];
    setInternalRows(newRows);
    onChange(newRows);
    setTimeout(() => document.getElementById(`drv-x-${newId}`)?.focus(), 0);
  };

  const handleRemoveRow = (idToRemove: string) => {
    let updatedRows = internalRows.filter(row => row.id !== idToRemove);
    updatedRows = ensureMinRows(updatedRows);
    setInternalRows(updatedRows);
    onChange(updatedRows);
  };

  const handleInputChange = (id: string, field: 'x' | 'p', value: string) => {
    const updatedRows = internalRows.map(row =>
      row.id === id ? { ...row, [field]: value } : row
    );
    setInternalRows(updatedRows);
    onChange(updatedRows);
  };

  const sumOfProbabilities = useMemo(() => {
    return internalRows.reduce((sum, row) => {
      const prob = parseFloat(row.p);
      return sum + (isNaN(prob) || prob < 0 ? 0 : prob);
    }, 0);
  }, [internalRows]);

  const probabilitiesSumValid = Math.abs(sumOfProbabilities - 1) < 1e-9 || sumOfProbabilities === 0; // Allow 0 if all empty


  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-sky-300 mb-1">
        Distribución de Probabilidad de X (P(X=x))
      </label>
      <div className="overflow-x-auto rounded-md border border-slate-600 custom-scrollbar">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-700/60 sticky top-0 z-10">
            <tr>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-sky-300 uppercase tracking-wider w-12">#</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-sky-300 uppercase tracking-wider">Valor X</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-sky-300 uppercase tracking-wider">P(X=x)</th>
              <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-sky-300 uppercase tracking-wider w-20">Acción</th>
            </tr>
          </thead>
          <tbody className="bg-slate-800 divide-y divide-slate-700">
            {internalRows.map((row, index) => (
              <tr key={row.id}>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-slate-400">{index + 1}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <input
                    type="number"
                    step="any"
                    id={`drv-x-${row.id}`}
                    value={row.x}
                    onChange={(e) => handleInputChange(row.id, 'x', e.target.value)}
                    placeholder="Ej: 0"
                    disabled={disabled}
                    className="w-full p-2 bg-slate-700/50 border border-slate-600 text-slate-100 placeholder-slate-400 rounded-md shadow-sm focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                    aria-label={`Valor X Fila ${index + 1}`}
                  />
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <input
                    type="number"
                    step="any"
                    min="0"
                    max="1"
                    id={`drv-p-${row.id}`}
                    value={row.p}
                    onChange={(e) => handleInputChange(row.id, 'p', e.target.value)}
                    placeholder="Ej: 0.25"
                    disabled={disabled}
                    className={`w-full p-2 bg-slate-700/50 border text-slate-100 placeholder-slate-400 rounded-md shadow-sm focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-colors ${parseFloat(row.p) < 0 ? 'border-red-500' : 'border-slate-600'}`}
                    aria-label={`Probabilidad P(X=x) Fila ${index + 1}`}
                  />
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-center">
                  <button
                    type="button"
                    onClick={() => handleRemoveRow(row.id)}
                    disabled={disabled}
                    className="text-red-400 hover:text-red-300 disabled:text-slate-500 p-1 rounded-full hover:bg-red-500/20"
                    aria-label={`Eliminar Fila ${index + 1}`}
                  >
                    <MinusCircleIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-2">
        <button
          type="button"
          onClick={handleAddRow}
          disabled={disabled}
          className="bg-sky-600 hover:bg-sky-700 disabled:bg-sky-800/50 text-white font-medium py-2 px-4 rounded-lg shadow-sm text-sm flex items-center"
        >
          <PlusCircleIcon className="w-5 h-5 mr-1.5" />
          Añadir Fila
        </button>
        <div className={`text-sm px-3 py-1.5 rounded-md ${probabilitiesSumValid ? 'text-green-300 bg-green-700/30' : 'text-red-300 bg-red-700/30'}`}>
          Suma P(X=x): <strong>{sumOfProbabilities.toFixed(4)}</strong>
          {!probabilitiesSumValid && sumOfProbabilities !== 0 && " (debe ser 1)"}
        </div>
      </div>
    </div>
  );
};

export default DiscreteRVInput;
