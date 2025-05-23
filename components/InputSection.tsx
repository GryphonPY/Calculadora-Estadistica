
import React from 'react';
import { AppState, CalculationMode, SetOperationType, SubModeBasicProbability, CombinatoricsOperationType, SubModeSamplingDistribution, DataInputMethodType, FrequencyChartType, SubModeInference, SubModeConfidenceInterval, DescriptiveStatChartType, SimulatorDistributionType, DiscreteRVEntry } from '../types';
import { 
  CALCULATION_MODE_GROUPS, 
  STATISTICAL_CONCEPTS_TOPICS, 
  DEFAULT_SELECTED_CONCEPT_ID, 
  SET_OPERATION_OPTIONS, 
  DEFAULT_SET_OPERATION,
  SUB_MODE_PROBABILITY_OPTIONS,
  DEFAULT_SUB_MODE_PROBABILITY,
  COMBINATORICS_OPERATION_OPTIONS,
  DEFAULT_COMBINATORICS_OP,
  SUB_MODE_SAMPLING_DISTRIBUTION_OPTIONS, 
  DEFAULT_SUB_MODE_SAMPLING,
  DEFAULT_AI_TASK_QUERY,
  DATA_INPUT_METHOD_OPTIONS,
  FREQUENCY_CHART_TYPE_OPTIONS,
  SUB_MODE_INFERENCE_OPTIONS, 
  DEFAULT_SUB_MODE_INFERENCE, 
  SUB_MODE_CONFIDENCE_INTERVAL_OPTIONS, 
  DEFAULT_SUB_MODE_CONFIDENCE_INTERVAL, 
  CONFIDENCE_LEVEL_OPTIONS, 
  DEFAULT_CI_CONFIDENCE_LEVEL,
  SIMULATOR_DISTRIBUTION_OPTIONS, 
  DEFAULT_SIMULATOR_DISTRIBUTION_TYPE,
  DEFAULT_SIMULATOR_BINOMIAL_N, 
  DEFAULT_SIMULATOR_BINOMIAL_P, 
  DEFAULT_SIMULATOR_POISSON_LAMBDA, 
  DEFAULT_BAYES_PROB_A,
  DEFAULT_BAYES_PROB_B_GIVEN_A,
  DEFAULT_BAYES_PROB_B_GIVEN_NOT_A
} from '../constants';
import { ArrowPathIcon } from './icons/ArrowPathIcon'; 
import { PlayIcon } from './icons/PlayIcon'; 
import TableInput from './TableInput';
import DiscreteRVInput from './DiscreteRVInput';
import { AcademicCapIcon } from './icons/AcademicCapIcon'; 
import { QuestionMarkCircleIcon } from './icons/QuestionMarkCircleIcon'; 
import { TableCellsIcon } from './icons/TableCellsIcon'; 
import { ListBulletIcon } from './icons/ListBulletIcon'; 
import { ChartPieIcon } from './icons/ChartPieIcon'; 
import { ChartBarIcon } from './icons/ChartBarIcon'; 
import { BeakerIcon } from './icons/BeakerIcon'; 
import { SigmaIcon } from './icons/SigmaIcon';
import { EyeIcon } from './icons/EyeIcon';
import { EyeSlashIcon } from './icons/EyeSlashIcon';
import { BrainIcon } from './icons/BrainIcon';

interface InputSectionProps {
  appState: AppState;
  onInputChange: (field: keyof AppState, value: string | SetOperationType | SubModeBasicProbability | CombinatoricsOperationType | SubModeSamplingDistribution | DataInputMethodType | FrequencyChartType | SubModeInference | SubModeConfidenceInterval | DescriptiveStatChartType | SimulatorDistributionType | boolean) => void;
  onDiscreteRVInputsChange: (newInputs: DiscreteRVEntry[]) => void;
  onCategoryChange: (categoryLabel: string) => void; // New prop for category change
  onModeChange: (mode: CalculationMode) => void; // This will handle tool/specific mode change
  onCalculate: () => void;
  onReset: () => void;
  isLoading: boolean;
}

const InputField: React.FC<{
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  tooltip?: string;
  disabled?: boolean;
  step?: string;
  min?: string;
  max?: string;
}> = ({ id, label, value, onChange, type = "text", placeholder, tooltip, disabled, step, min, max }) => (
  <div className="mb-4 relative">
    <label htmlFor={id} className="block text-sm font-medium text-sky-300 mb-1">
      {label}
      {tooltip && (
        <span className="ml-1 text-slate-400 cursor-help" title={tooltip}>
          (i)
        </span>
      )}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      step={step}
      min={min}
      max={max}
      className="w-full p-2.5 bg-slate-700/50 border border-slate-600 text-slate-100 placeholder-slate-400 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
    />
  </div>
);

const TextAreaField: React.FC<{
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  tooltip?: string;
  disabled?: boolean;
  rows?: number;
}> = ({ id, label, value, onChange, placeholder, tooltip, disabled, rows = 3 }) => (
  <div className="mb-4 relative">
    <label htmlFor={id} className="block text-sm font-medium text-sky-300 mb-1">
      {label}
      {tooltip && (
        <span className="ml-1 text-slate-400 cursor-help" title={tooltip}>
          (i)
        </span>
      )}
    </label>
    <textarea
      id={id}
      name={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      rows={rows}
      className="w-full p-2.5 bg-slate-700/50 border border-slate-600 text-slate-100 placeholder-slate-400 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-150 ease-in-out disabled:opacity-50 custom-scrollbar"
    />
  </div>
);


const SelectField: React.FC<{
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
  defaultOptionLabel?: string;
  defaultValue?: string;
}> = ({ id, label, value, onChange, options, disabled, defaultOptionLabel, defaultValue }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-sky-300 mb-1">
      {label}
    </label>
    <select
      id={id}
      name={id}
      value={value || defaultValue}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full p-3 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-150 ease-in-out disabled:opacity-50"
    >
      {defaultOptionLabel && <option value={defaultValue || ''} disabled={value !== (defaultValue || '') && defaultValue !== undefined}>{defaultOptionLabel}</option>}
      {options.map(option => (
        <option key={option.value} value={option.value} className="bg-slate-700 text-slate-100">
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const ToggleSwitch: React.FC<{
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  onIcon?: React.ReactNode;
  offIcon?: React.ReactNode;
}> = ({ id, label, checked, onChange, disabled, onIcon, offIcon }) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-sm font-medium text-sky-300 mb-2">
            {label}
        </label>
        <button
            type="button"
            id={id}
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            disabled={disabled}
            className={`
                relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-150 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500
                ${checked ? 'bg-sky-600' : 'bg-slate-600'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
        >
            <span className="sr-only">{label}</span>
            <span
                className={`
                    inline-block w-5 h-5 transform bg-white rounded-full transition-transform duration-150 ease-in-out
                    flex items-center justify-center
                    ${checked ? 'translate-x-6' : 'translate-x-0.5'}
                `}
            >
              {checked && onIcon ? onIcon : !checked && offIcon ? offIcon : null}
            </span>
        </button>
    </div>
);


const DataInputMethodToggle: React.FC<{
  currentMethod: DataInputMethodType;
  onChange: (method: DataInputMethodType) => void;
  disabled?: boolean;
}> = ({ currentMethod, onChange, disabled }) => (
  <div className="mb-4">
    <span className="block text-sm font-medium text-sky-300 mb-1">Método de Entrada de Datos</span>
    <div className="flex space-x-2 rounded-md bg-slate-700/50 p-1">
      {DATA_INPUT_METHOD_OPTIONS.map(option => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value as DataInputMethodType)}
          disabled={disabled}
          className={`
            flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-75
            flex items-center justify-center space-x-2
            ${currentMethod === option.value
              ? 'bg-sky-600 text-white shadow'
              : 'bg-transparent text-slate-300 hover:bg-slate-600/70'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          aria-pressed={currentMethod === option.value}
          aria-label={`Cambiar a método de entrada ${option.label}`}
        >
          {option.value === 'table' ? <TableCellsIcon className="w-4 h-4" /> : <ListBulletIcon className="w-4 h-4" />}
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  </div>
);

const ChartTypeToggle: React.FC<{
  label: string;
  currentType: FrequencyChartType; 
  onChange: (type: FrequencyChartType) => void;
  options: { value: FrequencyChartType; label: string; icon?: React.FC<React.SVGProps<SVGSVGElement>> }[];
  disabled?: boolean;
}> = ({ label, currentType, onChange, options, disabled }) => (
  <div className="mb-4">
    <span className="block text-sm font-medium text-sky-300 mb-1">{label}</span>
    <div className="flex space-x-2 rounded-md bg-slate-700/50 p-1">
      {options.map(option => {
        const IconComponent = option.icon;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            disabled={disabled}
            className={`
              flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-75
              flex items-center justify-center space-x-2
              ${currentType === option.value
                ? 'bg-sky-600 text-white shadow'
                : 'bg-transparent text-slate-300 hover:bg-slate-600/70'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            aria-pressed={currentType === option.value}
            aria-label={`Cambiar a tipo de gráfico ${option.label}`}
          >
            {IconComponent && <IconComponent className="w-4 h-4" />}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  </div>
);


const InputSection: React.FC<InputSectionProps> = ({
  appState,
  onInputChange,
  onDiscreteRVInputsChange,
  onCategoryChange,
  onModeChange,
  onCalculate,
  onReset,
  isLoading,
}) => {
  
  const getCalculateButtonTextAndIcon = () => {
    switch (appState.calculationMode) {
      case CalculationMode.STATISTICAL_CONCEPTS:
        return { text: 'Obtener Explicación (IA)', icon: <AcademicCapIcon className="w-5 h-5" /> };
      case CalculationMode.AI_TASK_ASSISTANT:
        return { text: 'Pedir Guía a IA', icon: <QuestionMarkCircleIcon className="w-5 h-5" /> };
      case CalculationMode.DATA_SIMULATOR:
        return { text: 'Generar Datos', icon: <BeakerIcon className="w-5 h-5" /> };
      case CalculationMode.DISCRETE_RANDOM_VARIABLE:
        return { text: 'Calcular E(X), Var(X)', icon: <SigmaIcon className="w-5 h-5" />};
      case CalculationMode.BAYES_THEOREM:
        return { text: 'Calcular P(A|B)', icon: <BrainIcon className="w-5 h-5" />};
      default:
        return { text: 'Calcular', icon: <PlayIcon className="w-5 h-5" /> };
    }
  };

  const { text: calculateButtonText, icon: calculateButtonIcon } = getCalculateButtonTextAndIcon();

  const selectedCategoryTools = CALCULATION_MODE_GROUPS.find(
    group => group.groupLabel === appState.selectedCalculationCategory
  )?.options || [];

  return (
    <div className="bg-slate-800/70 backdrop-blur-md shadow-2xl rounded-xl p-6 md:p-8 h-full flex flex-col">
      <h2 className="text-2xl font-semibold text-sky-400 mb-6 border-b border-slate-700 pb-3">Configuración</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
        <div className="mb-6">
          <label htmlFor="calculationCategory" className="block text-sm font-medium text-sky-300 mb-1">
            Categoría de Cálculo
          </label>
          <select
            id="calculationCategory"
            name="calculationCategory"
            value={appState.selectedCalculationCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            disabled={isLoading}
            className="w-full p-3 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
            aria-label="Seleccionar categoría de cálculo"
          >
            {CALCULATION_MODE_GROUPS.map(group => (
              <option key={group.groupLabel} value={group.groupLabel} className="bg-slate-700 text-slate-100">
                {group.groupLabel}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="calculationModeTool" className="block text-sm font-medium text-sky-300 mb-1">
            Herramienta Específica
          </label>
          <select
            id="calculationModeTool"
            name="calculationModeTool"
            value={appState.calculationMode}
            onChange={(e) => onModeChange(e.target.value as CalculationMode)}
            disabled={isLoading || selectedCategoryTools.length === 0}
            className="w-full p-3 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
            aria-label="Seleccionar herramienta específica de cálculo"
          >
            {selectedCategoryTools.map(option => (
              <option key={option.value} value={option.value} className="bg-slate-700 text-slate-100">
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>


      <div className="flex-grow overflow-y-auto pr-2 -mr-2 custom-scrollbar" style={{ maxHeight: 'calc(100vh - 420px)' }}>
        {(appState.calculationMode === CalculationMode.DESCRIPTIVE || appState.calculationMode === CalculationMode.FREQUENCY_DISTRIBUTION) && (
          <DataInputMethodToggle
            currentMethod={appState.dataInputMethod}
            onChange={(method) => onInputChange('dataInputMethod', method as DataInputMethodType)}
            disabled={isLoading}
          />
        )}
        
        {appState.calculationMode === CalculationMode.DESCRIPTIVE && (
          <ToggleSwitch
            id="descriptiveShowSteps"
            label="Mostrar Pasos de Cálculo (Paso a Paso)"
            checked={appState.descriptiveShowSteps}
            onChange={(checked) => onInputChange('descriptiveShowSteps', checked)}
            disabled={isLoading}
            onIcon={<EyeIcon className="w-3 h-3 text-sky-500" />}
            offIcon={<EyeSlashIcon className="w-3 h-3 text-slate-400" />}
          />
        )}

        {appState.calculationMode === CalculationMode.FREQUENCY_DISTRIBUTION && ( 
          <ChartTypeToggle
            label="Tipo de Gráfico de Frecuencias"
            currentType={appState.frequencyChartType}
            onChange={(type) => onInputChange('frequencyChartType', type as FrequencyChartType)}
            options={FREQUENCY_CHART_TYPE_OPTIONS}
            disabled={isLoading}
          />
        )}


        {appState.calculationMode === CalculationMode.DESCRIPTIVE && (
          appState.dataInputMethod === 'table' ? (
            <TableInput
              dataLabel="Datos para Estadísticas Descriptivas"
              value={appState.descriptiveInput}
              onChange={(val) => onInputChange('descriptiveInput', val)}
              disabled={isLoading}
              placeholder="Valor numérico"
            />
          ) : (
            <TextAreaField
              id="descriptiveInputText"
              label="Datos para Estadísticas Descriptivas (separados por coma)"
              value={appState.descriptiveInput}
              onChange={(val) => onInputChange('descriptiveInput', val)}
              placeholder="Ej: 10, 12.5, 15, 18.3"
              disabled={isLoading}
              rows={5}
            />
          )
        )}

        {appState.calculationMode === CalculationMode.FREQUENCY_DISTRIBUTION && (
           appState.dataInputMethod === 'table' ? (
            <TableInput
              dataLabel="Datos para Distribución de Frecuencias"
              value={appState.frequencyInput}
              onChange={(val) => onInputChange('frequencyInput', val)}
              disabled={isLoading}
              placeholder="Valor numérico"
            />
          ) : (
            <TextAreaField
              id="frequencyInputText"
              label="Datos para Distribución de Frecuencias (separados por coma)"
              value={appState.frequencyInput}
              onChange={(val) => onInputChange('frequencyInput', val)}
              placeholder="Ej: 80, 82.1, 75, 63.5"
              disabled={isLoading}
              rows={5}
            />
          )
        )}

        {appState.calculationMode === CalculationMode.BINOMIAL && (
          <>
            <InputField
              id="binomialN"
              label="Número de Ensayos (n)"
              type="number"
              value={appState.binomialN}
              onChange={(val) => onInputChange('binomialN', val)}
              placeholder="Ej: 10"
              disabled={isLoading}
              min="0"
            />
            <InputField
              id="binomialP"
              label="Probabilidad de Éxito (p)"
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={appState.binomialP}
              onChange={(val) => onInputChange('binomialP', val)}
              placeholder="Ej: 0.5 (debe estar entre 0 y 1)"
              disabled={isLoading}
            />
            <InputField
              id="binomialX"
              label="Número de Éxitos (x) (opcional)"
              type="number"
              value={appState.binomialX}
              onChange={(val) => onInputChange('binomialX', val)}
              placeholder="Ej: 3 (para P(X=x), P(X≤x), P(X≥x))"
              tooltip="Dejar en blanco si no se calcula para una x específica."
              disabled={isLoading}
              min="0"
            />
          </>
        )}

        {appState.calculationMode === CalculationMode.NORMAL && (
          <>
            <InputField
              id="normalMean"
              label="Media (μ)"
              type="number"
              step="any"
              value={appState.normalMean}
              onChange={(val) => onInputChange('normalMean', val)}
              placeholder="Ej: 0"
              disabled={isLoading}
            />
            <InputField
              id="normalStdDev"
              label="Desviación Estándar (σ)"
              type="number"
              step="any"
              min="0.00001" 
              value={appState.normalStdDev}
              onChange={(val) => onInputChange('normalStdDev', val)}
              placeholder="Ej: 1 (debe ser > 0)"
              disabled={isLoading}
            />
            <InputField
              id="normalX1"
              label="Valor X1 (opcional)"
              type="number"
              step="any"
              value={appState.normalX1}
              onChange={(val) => onInputChange('normalX1', val)}
              placeholder="Ej: -1 (para P(X≤X1) o P(X1≤X≤X2))"
              tooltip="Para P(X≤X1) o inicio de rango para P(X1≤X≤X2)."
              disabled={isLoading}
            />
            <InputField
              id="normalX2"
              label="Valor X2 (opcional)"
              type="number"
              step="any"
              value={appState.normalX2}
              onChange={(val) => onInputChange('normalX2', val)}
              placeholder="Ej: 1 (para P(X1≤X≤X2))"
              tooltip="Fin de rango para P(X1≤X≤X2). Requiere X1."
              disabled={isLoading}
            />
          </>
        )}

        {appState.calculationMode === CalculationMode.POISSON_DISTRIBUTION && (
          <>
            <InputField
              id="poissonLambda"
              label="Tasa Promedio de Eventos (λ Lambda)"
              type="number"
              step="any"
              min="0.00001" 
              value={appState.poissonLambda}
              onChange={(val) => onInputChange('poissonLambda', val)}
              placeholder="Ej: 5 (debe ser > 0)"
              disabled={isLoading}
            />
            <InputField
              id="poissonK"
              label="Número de Ocurrencias (k) (opcional)"
              type="number"
              min="0" 
              value={appState.poissonK}
              onChange={(val) => onInputChange('poissonK', val)}
              placeholder="Ej: 3 (entero no negativo)"
              tooltip="Dejar en blanco si no se calcula para una k específica."
              disabled={isLoading}
            />
          </>
        )}

        {appState.calculationMode === CalculationMode.EXPONENTIAL_DISTRIBUTION && (
          <>
            <InputField
              id="exponentialLambda"
              label="Tasa (λ Lambda)"
              type="number"
              step="any"
              min="0.00001" 
              value={appState.exponentialLambda}
              onChange={(val) => onInputChange('exponentialLambda', val)}
              placeholder="Ej: 0.5 (debe ser > 0)"
              tooltip="Parámetro de tasa de la distribución exponencial."
              disabled={isLoading}
            />
            <InputField
              id="exponentialX"
              label="Valor X (opcional)"
              type="number"
              step="any"
              min="0" 
              value={appState.exponentialX}
              onChange={(val) => onInputChange('exponentialX', val)}
              placeholder="Ej: 2 (para f(x), P(X≤x), P(X>x))"
              tooltip="Dejar en blanco si no se calcula para un valor x específico."
              disabled={isLoading}
            />
          </>
        )}

        {appState.calculationMode === CalculationMode.DISCRETE_RANDOM_VARIABLE && (
          <DiscreteRVInput
            rows={appState.discreteRVInputs}
            onChange={onDiscreteRVInputsChange}
            disabled={isLoading}
          />
        )}

        {appState.calculationMode === CalculationMode.BAYES_THEOREM && (
          <>
            <InputField
              id="bayesProbA"
              label="Probabilidad de A, P(A)"
              type="number"
              step="0.001" min="0" max="1"
              value={appState.bayesProbA}
              onChange={(val) => onInputChange('bayesProbA', val)}
              placeholder="Ej: 0.1 (entre 0 y 1)"
              disabled={isLoading}
              tooltip="Probabilidad previa del evento A."
            />
            <InputField
              id="bayesProbBGivenA"
              label="Probabilidad de B dado A, P(B|A)"
              type="number"
              step="0.001" min="0" max="1"
              value={appState.bayesProbBGivenA}
              onChange={(val) => onInputChange('bayesProbBGivenA', val)}
              placeholder="Ej: 0.8 (entre 0 y 1)"
              disabled={isLoading}
              tooltip="Probabilidad de que B ocurra si A ha ocurrido."
            />
            <InputField
              id="bayesProbBGivenNotA"
              label="Probabilidad de B dado NO A, P(B|¬A)"
              type="number"
              step="0.001" min="0" max="1"
              value={appState.bayesProbBGivenNotA}
              onChange={(val) => onInputChange('bayesProbBGivenNotA', val)}
              placeholder="Ej: 0.05 (entre 0 y 1)"
              disabled={isLoading}
              tooltip="Probabilidad de que B ocurra si A NO ha ocurrido."
            />
          </>
        )}

        {appState.calculationMode === CalculationMode.SAMPLING_DISTRIBUTIONS && (
          <>
            <SelectField
              id="selectedSubModeSampling"
              label="Tipo de Distribución Muestral"
              value={appState.selectedSubModeSampling}
              onChange={(val) => onInputChange('selectedSubModeSampling', val as SubModeSamplingDistribution)}
              options={SUB_MODE_SAMPLING_DISTRIBUTION_OPTIONS}
              disabled={isLoading}
              defaultValue={DEFAULT_SUB_MODE_SAMPLING}
            />

            {appState.selectedSubModeSampling === SubModeSamplingDistribution.MEANS && (
              <>
                <InputField
                  id="populationMean"
                  label="Media Poblacional (μ)"
                  type="number"
                  step="any"
                  value={appState.populationMean}
                  onChange={(val) => onInputChange('populationMean', val)}
                  placeholder="Ej: 100"
                  disabled={isLoading}
                />
                <InputField
                  id="populationStdDev"
                  label="Desviación Estándar Poblacional (σ)"
                  type="number"
                  step="any"
                  min="0.00001"
                  value={appState.populationStdDev}
                  onChange={(val) => onInputChange('populationStdDev', val)}
                  placeholder="Ej: 15 (debe ser > 0)"
                  disabled={isLoading}
                />
                <InputField
                  id="sampleSizeMeans"
                  label="Tamaño de Muestra (n)"
                  type="number"
                  min="1"
                  value={appState.sampleSizeMeans}
                  onChange={(val) => onInputChange('sampleSizeMeans', val)}
                  placeholder="Ej: 30 (entero > 0)"
                  disabled={isLoading}
                />
                <InputField
                  id="sampleMeanXBar"
                  label="Media Muestral (x̄) (opcional)"
                  type="number"
                  step="any"
                  value={appState.sampleMeanXBar}
                  onChange={(val) => onInputChange('sampleMeanXBar', val)}
                  placeholder="Ej: 105 (para calcular P(X̄ ≤ x̄))"
                  tooltip="Dejar en blanco si no se calcula probabilidad para una x̄ específica."
                  disabled={isLoading}
                />
              </>
            )}

            {appState.selectedSubModeSampling === SubModeSamplingDistribution.PROPORTIONS && (
              <>
                <InputField
                  id="populationProportion"
                  label="Proporción Poblacional (p)"
                  type="number"
                  step="0.001"
                  min="0"
                  max="1"
                  value={appState.populationProportion}
                  onChange={(val) => onInputChange('populationProportion', val)}
                  placeholder="Ej: 0.6 (entre 0 y 1)"
                  disabled={isLoading}
                />
                <InputField
                  id="sampleSizeProportions"
                  label="Tamaño de Muestra (n)"
                  type="number"
                  min="1"
                  value={appState.sampleSizeProportions}
                  onChange={(val) => onInputChange('sampleSizeProportions', val)}
                  placeholder="Ej: 50 (entero > 0)"
                  disabled={isLoading}
                />
                <InputField
                  id="sampleProportionPHat"
                  label="Proporción Muestral (p̂) (opcional)"
                  type="number"
                  step="0.001"
                  min="0"
                  max="1"
                  value={appState.sampleProportionPHat}
                  onChange={(val) => onInputChange('sampleProportionPHat', val)}
                  placeholder="Ej: 0.65 (para P(P̂ ≤ p̂))"
                  tooltip="Dejar en blanco si no se calcula probabilidad para una p̂ específica."
                  disabled={isLoading}
                />
              </>
            )}
          </>
        )}
        
        {appState.calculationMode === CalculationMode.INFERENCE && ( 
          <>
            <SelectField
              id="selectedSubModeInference"
              label="Tipo de Inferencia"
              value={appState.selectedSubModeInference}
              onChange={(val) => onInputChange('selectedSubModeInference', val as SubModeInference)}
              options={SUB_MODE_INFERENCE_OPTIONS}
              disabled={isLoading}
              defaultValue={DEFAULT_SUB_MODE_INFERENCE}
            />

            {appState.selectedSubModeInference === SubModeInference.CONFIDENCE_INTERVALS && (
              <>
                <SelectField
                  id="selectedSubModeConfidenceInterval"
                  label="Tipo de Intervalo de Confianza"
                  value={appState.selectedSubModeConfidenceInterval}
                  onChange={(val) => onInputChange('selectedSubModeConfidenceInterval', val as SubModeConfidenceInterval)}
                  options={SUB_MODE_CONFIDENCE_INTERVAL_OPTIONS}
                  disabled={isLoading}
                  defaultValue={DEFAULT_SUB_MODE_CONFIDENCE_INTERVAL}
                />

                {appState.selectedSubModeConfidenceInterval === SubModeConfidenceInterval.MEAN_SIGMA_KNOWN && (
                  <>
                    <InputField
                      id="ciMeanSampleMean"
                      label="Media Muestral (x̄)"
                      type="number"
                      step="any"
                      value={appState.ciMeanSampleMean}
                      onChange={(val) => onInputChange('ciMeanSampleMean', val)}
                      placeholder="Ej: 50"
                      disabled={isLoading}
                    />
                    <InputField
                      id="ciMeanPopulationSigma"
                      label="Desviación Estándar Poblacional (σ)"
                      type="number"
                      step="any"
                      min="0.00001"
                      value={appState.ciMeanPopulationSigma}
                      onChange={(val) => onInputChange('ciMeanPopulationSigma', val)}
                      placeholder="Ej: 5 (debe ser > 0)"
                      disabled={isLoading}
                    />
                    <InputField
                      id="ciMeanSampleSize"
                      label="Tamaño de Muestra (n)"
                      type="number"
                      min="1"
                      value={appState.ciMeanSampleSize}
                      onChange={(val) => onInputChange('ciMeanSampleSize', val)}
                      placeholder="Ej: 30 (entero > 0)"
                      disabled={isLoading}
                    />
                    <SelectField
                      id="ciMeanConfidenceLevel"
                      label="Nivel de Confianza"
                      value={appState.ciMeanConfidenceLevel}
                      onChange={(val) => onInputChange('ciMeanConfidenceLevel', val)}
                      options={CONFIDENCE_LEVEL_OPTIONS}
                      disabled={isLoading}
                      defaultValue={DEFAULT_CI_CONFIDENCE_LEVEL}
                    />
                  </>
                )}
              </>
            )}
          </>
        )}
        
        {appState.calculationMode === CalculationMode.DATA_SIMULATOR && ( 
          <>
            <SelectField
              id="simulatorDistributionType"
              label="Tipo de Distribución a Simular"
              value={appState.simulatorDistributionType}
              onChange={(val) => onInputChange('simulatorDistributionType', val as SimulatorDistributionType)}
              options={SIMULATOR_DISTRIBUTION_OPTIONS}
              disabled={isLoading}
              defaultValue={DEFAULT_SIMULATOR_DISTRIBUTION_TYPE}
            />
             <InputField
              id="simulatorNPoints"
              label="Número de Puntos a Generar"
              type="number"
              min="1"
              max="10000"
              value={appState.simulatorNPoints}
              onChange={(val) => onInputChange('simulatorNPoints', val)}
              placeholder="Ej: 100"
              disabled={isLoading}
            />
            {appState.simulatorDistributionType === SimulatorDistributionType.UNIFORM && (
              <>
                <InputField
                  id="simulatorUniformMin"
                  label="Mínimo (a)"
                  type="number"
                  step="any"
                  value={appState.simulatorUniformMin}
                  onChange={(val) => onInputChange('simulatorUniformMin', val)}
                  placeholder="Ej: 0"
                  disabled={isLoading}
                />
                <InputField
                  id="simulatorUniformMax"
                  label="Máximo (b)"
                  type="number"
                  step="any"
                  value={appState.simulatorUniformMax}
                  onChange={(val) => onInputChange('simulatorUniformMax', val)}
                  placeholder="Ej: 10"
                  disabled={isLoading}
                />
              </>
            )}
            {appState.simulatorDistributionType === SimulatorDistributionType.NORMAL && (
              <>
                <InputField
                  id="simulatorNormalMean"
                  label="Media (μ)"
                  type="number"
                  step="any"
                  value={appState.simulatorNormalMean}
                  onChange={(val) => onInputChange('simulatorNormalMean', val)}
                  placeholder="Ej: 0"
                  disabled={isLoading}
                />
                <InputField
                  id="simulatorNormalStdDev"
                  label="Desviación Estándar (σ)"
                  type="number"
                  step="any"
                  min="0.00001"
                  value={appState.simulatorNormalStdDev}
                  onChange={(val) => onInputChange('simulatorNormalStdDev', val)}
                  placeholder="Ej: 1 (debe ser > 0)"
                  disabled={isLoading}
                />
              </>
            )}
            {appState.simulatorDistributionType === SimulatorDistributionType.BINOMIAL && (
              <>
                <InputField
                  id="simulatorBinomialN"
                  label="Número de Ensayos (n)"
                  type="number"
                  min="1"
                  value={appState.simulatorBinomialN}
                  onChange={(val) => onInputChange('simulatorBinomialN', val)}
                  placeholder={DEFAULT_SIMULATOR_BINOMIAL_N}
                  disabled={isLoading}
                />
                <InputField
                  id="simulatorBinomialP"
                  label="Probabilidad de Éxito (p)"
                  type="number"
                  step="0.01" min="0" max="1"
                  value={appState.simulatorBinomialP}
                  onChange={(val) => onInputChange('simulatorBinomialP', val)}
                  placeholder={DEFAULT_SIMULATOR_BINOMIAL_P}
                  disabled={isLoading}
                />
              </>
            )}
            {appState.simulatorDistributionType === SimulatorDistributionType.POISSON && (
              <InputField
                id="simulatorPoissonLambda"
                label="Tasa Promedio (λ Lambda)"
                type="number"
                step="any" min="0.00001"
                value={appState.simulatorPoissonLambda}
                onChange={(val) => onInputChange('simulatorPoissonLambda', val)}
                placeholder={DEFAULT_SIMULATOR_POISSON_LAMBDA}
                disabled={isLoading}
              />
            )}
          </>
        )}


        {appState.calculationMode === CalculationMode.STATISTICAL_CONCEPTS && (
          <SelectField
            id="selectedConceptId"
            label="Seleccione un Concepto Estadístico"
            value={appState.selectedConceptId}
            onChange={(val) => onInputChange('selectedConceptId', val)}
            options={STATISTICAL_CONCEPTS_TOPICS.map(c => ({ value: c.id, label: c.label }))}
            disabled={isLoading}
            defaultOptionLabel="-- Elija un concepto --"
            defaultValue={DEFAULT_SELECTED_CONCEPT_ID}
          />
        )}

        {appState.calculationMode === CalculationMode.AI_TASK_ASSISTANT && ( 
          <TextAreaField
            id="aiTaskQuery"
            label="¿En qué tarea necesitas ayuda de la calculadora?"
            value={appState.aiTaskQuery}
            onChange={(val) => onInputChange('aiTaskQuery', val)}
            placeholder="Ej: Quiero calcular la media de unos datos, ¿cómo lo hago? o ¿Cómo calculo la probabilidad de obtener 3 caras en 5 lanzamientos de moneda?"
            disabled={isLoading}
            rows={5}
            tooltip="Describe tu problema o pregunta, y la IA te guiará al modo correcto y te dirá qué datos ingresar."
          />
        )}


        {appState.calculationMode === CalculationMode.SET_OPERATIONS && (
          <>
            <TextAreaField
              id="setInputA"
              label="Conjunto A (elementos separados por coma)"
              value={appState.setInputA}
              onChange={(val) => onInputChange('setInputA', val)}
              placeholder="Ej: a, b, c, 1, 2"
              disabled={isLoading}
              rows={3}
            />
            <TextAreaField
              id="setInputB"
              label="Conjunto B (elementos separados por coma)"
              value={appState.setInputB}
              onChange={(val) => onInputChange('setInputB', val)}
              placeholder="Ej: b, c, d, 2, 3"
              disabled={isLoading}
              rows={3}
            />
            <SelectField
              id="selectedSetOperation"
              label="Operación de Conjuntos"
              value={appState.selectedSetOperation}
              onChange={(val) => onInputChange('selectedSetOperation', val as SetOperationType)}
              options={SET_OPERATION_OPTIONS}
              disabled={isLoading}
              defaultValue={DEFAULT_SET_OPERATION}
            />
          </>
        )}

        {appState.calculationMode === CalculationMode.BASIC_PROBABILITY_COMBINATORICS && (
          <>
            <SelectField
              id="selectedSubModeProbability"
              label="Tipo de Cálculo"
              value={appState.selectedSubModeProbability}
              onChange={(val) => onInputChange('selectedSubModeProbability', val as SubModeBasicProbability)}
              options={SUB_MODE_PROBABILITY_OPTIONS}
              disabled={isLoading}
              defaultValue={DEFAULT_SUB_MODE_PROBABILITY}
            />

            {appState.selectedSubModeProbability === SubModeBasicProbability.COMBINATORICS && (
              <>
                <InputField
                  id="combinatoricsN"
                  label="Número Total de Elementos (n)"
                  type="number"
                  min="0"
                  value={appState.combinatoricsN}
                  onChange={(val) => onInputChange('combinatoricsN', val)}
                  placeholder="Ej: 5"
                  disabled={isLoading}
                />
                <InputField
                  id="combinatoricsR"
                  label="Número de Elementos a Elegir/Ordenar (r)"
                  type="number"
                  min="0"
                  value={appState.combinatoricsR}
                  onChange={(val) => onInputChange('combinatoricsR', val)}
                  placeholder="Ej: 2"
                  disabled={isLoading}
                />
                <SelectField
                  id="selectedCombinatoricsOp"
                  label="Operación de Combinatoria"
                  value={appState.selectedCombinatoricsOp}
                  onChange={(val) => onInputChange('selectedCombinatoricsOp', val as CombinatoricsOperationType)}
                  options={COMBINATORICS_OPERATION_OPTIONS}
                  disabled={isLoading}
                  defaultValue={DEFAULT_COMBINATORICS_OP}
                />
              </>
            )}

            {appState.selectedSubModeProbability === SubModeBasicProbability.BASIC_PROBABILITY && (
              <>
                <InputField
                  id="probBasicFavorable"
                  label="Número de Casos Favorables"
                  type="number"
                  min="0"
                  value={appState.probBasicFavorable}
                  onChange={(val) => onInputChange('probBasicFavorable', val)}
                  placeholder="Ej: 3"
                  disabled={isLoading}
                />
                <InputField
                  id="probBasicPossible"
                  label="Número de Casos Posibles Totales"
                  type="number"
                  min="1" 
                  value={appState.probBasicPossible}
                  onChange={(val) => onInputChange('probBasicPossible', val)}
                  placeholder="Ej: 10"
                  disabled={isLoading}
                />
              </>
            )}

            {appState.selectedSubModeProbability === SubModeBasicProbability.CONDITIONAL_PROBABILITY && (
              <>
                <InputField
                  id="probCondIntersectionAB"
                  label="Probabilidad de Intersección P(A ∩ B)"
                  type="number"
                  step="0.001"
                  min="0"
                  max="1"
                  value={appState.probCondIntersectionAB}
                  onChange={(val) => onInputChange('probCondIntersectionAB', val)}
                  placeholder="Ej: 0.2 (entre 0 y 1)"
                  disabled={isLoading}
                />
                <InputField
                  id="probCondProbB"
                  label="Probabilidad del Evento Condicionante P(B)"
                  type="number"
                  step="0.001"
                  min="0.000000001" 
                  max="1"
                  value={appState.probCondProbB}
                  onChange={(val) => onInputChange('probCondProbB', val)}
                  placeholder="Ej: 0.5 (entre >0 y 1)"
                  disabled={isLoading}
                />
              </>
            )}
          </>
        )}
      </div>

      <div className="mt-auto pt-6 border-t border-slate-700 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <button
          onClick={onCalculate}
          disabled={isLoading || 
                     (appState.calculationMode === CalculationMode.STATISTICAL_CONCEPTS && !appState.selectedConceptId) ||
                     (appState.calculationMode === CalculationMode.AI_TASK_ASSISTANT && !appState.aiTaskQuery.trim())
                   }
          className="flex-1 w-full sm:w-auto bg-sky-600 hover:bg-sky-700 disabled:bg-sky-800 disabled:text-sky-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-75 flex items-center justify-center space-x-2"
          aria-live="polite"
        >
          {isLoading && !([CalculationMode.AI_TASK_ASSISTANT, CalculationMode.STATISTICAL_CONCEPTS, CalculationMode.DATA_SIMULATOR, CalculationMode.DISCRETE_RANDOM_VARIABLE, CalculationMode.BAYES_THEOREM].includes(appState.calculationMode)) ? ( 
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            calculateButtonIcon
          )}
          <span>{isLoading && !([CalculationMode.AI_TASK_ASSISTANT, CalculationMode.STATISTICAL_CONCEPTS, CalculationMode.DATA_SIMULATOR, CalculationMode.DISCRETE_RANDOM_VARIABLE, CalculationMode.BAYES_THEOREM].includes(appState.calculationMode)) ? 'Procesando...' : calculateButtonText}</span>
        </button>
        <button
          onClick={onReset}
          disabled={isLoading}
          className="flex-1 w-full sm:w-auto bg-slate-600 hover:bg-slate-700 disabled:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-75 flex items-center justify-center space-x-2"
        >
          <ArrowPathIcon className="w-5 h-5" />
          <span>Reiniciar Entradas</span>
        </button>
      </div>
    </div>
  );
};

export default InputSection;
