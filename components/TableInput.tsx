import React, { useState, useEffect, useRef } from 'react';
import { TableRowData } from '../types';
import { MinusCircleIcon } from './icons/MinusCircleIcon';

interface TableInputProps {
  value: string; // Comma-separated string
  onChange: (newValueString: string) => void;
  disabled?: boolean;
  dataLabel: string;
  placeholder?: string;
}

const MIN_ROWS = 5;

const parseDataString = (dataString: string): TableRowData[] => {
  const parsedValues = dataString
    .split(',')
    .map(s => s.trim())
    .filter(s => s !== ''); // Filter out empty strings that result from "1,,2" or leading/trailing commas

  const actualDataRows: TableRowData[] = parsedValues.map(val => ({ id: crypto.randomUUID(), value: val }));
  
  const numRowsToDisplay = Math.max(MIN_ROWS, actualDataRows.length);
  const finalRows: TableRowData[] = [];

  for (let i = 0; i < numRowsToDisplay; i++) {
    if (i < actualDataRows.length) {
      finalRows.push(actualDataRows[i]);
    } else {
      finalRows.push({ id: crypto.randomUUID(), value: '' });
    }
  }
  return finalRows;
};

const serializeRows = (rows: TableRowData[]): string => {
  return rows
    .map(row => row.value.trim())
    .filter(val => val !== '') // Only include non-empty values in the string
    .join(', ');
};

const TableInput: React.FC<TableInputProps> = ({ value, onChange, disabled, dataLabel, placeholder }) => {
  const [internalRows, _setInternalRows] = useState<TableRowData[]>(() => parseDataString(value));
  const internalRowsRef = useRef(internalRows);

  const setInternalRows = (rows: TableRowData[]) => {
    internalRowsRef.current = rows;
    _setInternalRows(rows);
  };
  
  useEffect(() => {
    const currentSerialized = serializeRows(internalRowsRef.current);
    if (value !== currentSerialized) {
      setInternalRows(parseDataString(value));
    }
  }, [value]);

  const handleAddRow = () => {
    const newRowId = crypto.randomUUID();
    const newRows = [...internalRows, { id: newRowId, value: '' }];
    setInternalRows(newRows);
    onChange(serializeRows(newRows));
    // Focus the new row's input in the next tick (after render)
    setTimeout(() => {
        document.getElementById(`input-cell-${newRowId}`)?.focus();
      }, 0);
  };

  const handleRemoveRow = (idToRemove: string) => {
    let newRows = internalRows.filter(row => row.id !== idToRemove);
    if (newRows.length < MIN_ROWS) {
        const diff = MIN_ROWS - newRows.length;
        for (let i = 0; i < diff; i++) {
            newRows.push({ id: crypto.randomUUID(), value: '' });
        }
    }
    setInternalRows(newRows);
    onChange(serializeRows(newRows));
  };

  const handleCellValueChange = (idToUpdate: string, newValue: string) => {
    const newRows = internalRows.map(row =>
      row.id === idToUpdate ? { ...row, value: newValue } : row
    );
    setInternalRows(newRows);
    onChange(serializeRows(newRows));
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, currentRowId: string) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const currentRowIndex = internalRows.findIndex(r => r.id === currentRowId);

      if (currentRowIndex === -1) return; 

      if (currentRowIndex < internalRows.length - 1) {
        const nextRowId = internalRows[currentRowIndex + 1].id;
        document.getElementById(`input-cell-${nextRowId}`)?.focus();
      } else {
        // It's the last row, add a new one and focus it
        const newRowId = crypto.randomUUID(); 
        const newRow = { id: newRowId, value: '' };
        const updatedRows = [...internalRows, newRow];
        
        setInternalRows(updatedRows); 
        onChange(serializeRows(updatedRows)); 

        setTimeout(() => {
          document.getElementById(`input-cell-${newRowId}`)?.focus();
        }, 0);
      }
    }
  };


  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-sky-300 mb-1">{dataLabel}</label>
      <div className="overflow-x-auto rounded-md border border-slate-600 custom-scrollbar">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-700/60 sticky top-0 z-10">
            <tr>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-sky-300 uppercase tracking-wider w-12">#</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-sky-300 uppercase tracking-wider">Valor</th>
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
                    step="any" // Allows decimal inputs
                    id={`input-cell-${row.id}`}
                    value={row.value}
                    onKeyDown={(e) => handleInputKeyDown(e, row.id)}
                    onChange={(e) => handleCellValueChange(row.id, e.target.value)}
                    placeholder={placeholder || "Ej: 12.3"}
                    disabled={disabled}
                    className="w-full p-2 bg-slate-700/50 border border-slate-600 text-slate-100 placeholder-slate-400 rounded-md shadow-sm focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    aria-label={`Valor Fila ${index + 1}`}
                  />
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-center">
                  <button
                    type="button"
                    onClick={() => handleRemoveRow(row.id)}
                    disabled={disabled}
                    className="text-red-400 hover:text-red-300 disabled:text-slate-500 disabled:cursor-not-allowed p-1 rounded-full hover:bg-red-500/20 transition-colors"
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
      <button
        type="button"
        onClick={handleAddRow}
        disabled={disabled}
        className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 disabled:bg-sky-800/50 disabled:text-sky-400/70 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg shadow-sm hover:shadow transition duration-150 ease-in-out flex items-center justify-center text-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-1.5">
          <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
        </svg>
        Añadir Fila
      </button>
    </div>
  );
};

export default TableInput;