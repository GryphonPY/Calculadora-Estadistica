

import React from 'react';
import { ResponsiveContainer, BarChart, LineChart, AreaChart, Bar, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, PieChart, Pie, Cell } from 'recharts';
import { 
    CalculationResults, CalculationMode, DescriptiveStatsResults, BinomialResults, NormalResults, 
    FrequencyDistributionResults, ConceptualExplanationResults, SetOperationsResults, 
    BasicProbabilityCombinatoricsResults, SubModeBasicProbability, CombinatoricsOperationType,
    PoissonResults, ExponentialResults, SamplingDistributionResults, SamplingMeansResultsContent, SamplingProportionsResultsContent, SubModeSamplingDistribution, 
    AITaskAssistantResults, 
    ChartDataPoint, Formula, AppState, FrequencyDistributionResultsContent,
    ConfidenceIntervalResults, ConfidenceIntervalMeanSigmaKnownResultContent, 
    SubModeInference, SubModeConfidenceInterval, 
    DataSimulatorResults, 
    DescriptiveStatsResultsContent,
    DiscreteRVResults,
    DiscreteRVResultsContent,
    MeanCalculationSteps, MedianCalculationSteps, VarianceCalculationSteps, StdDevCalculationSteps, VarianceCalculationStepItem,
    BayesTheoremResults, BayesTheoremResultsContent,
    SimulatorDistributionType // Added for type checking
} from '../types';
import { 
    FORMULAS, SET_OPERATION_OPTIONS, 
    FORMULAS_COMBINATORICS_PERMUTATIONS, 
    FORMULAS_COMBINATORICS_COMBINations,
    FORMULAS_BASIC_PROBABILITY, FORMULAS_CONDITIONAL_PROBABILITY,
    COMBINATORICS_OPERATION_OPTIONS,
    FORMULAS_SAMPLING_MEANS, FORMULAS_SAMPLING_PROPORTIONS,
    PIE_CHART_COLORS,
    FORMULAS_CONFIDENCE_INTERVAL_MEAN_SIGMA_KNOWN,
    FORMULAS_DISCRETE_RV,
    FORMULAS_BAYES_THEOREM
} from '../constants';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { LineChartIcon } from './icons/LineChartIcon';
import { TableCellsIcon } from './icons/TableCellsIcon';
import { InformationCircleIcon } from './icons/InformationCircleIcon';
import { ViewfinderCircleIcon } from './icons/ViewfinderCircleIcon';
import { BeakerIcon } from './icons/BeakerIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { ClockIcon } from './icons/ClockIcon';
import { CubeTransparentIcon } from './icons/CubeTransparentIcon';
import { QuestionMarkCircleIcon } from './icons/QuestionMarkCircleIcon'; 
import { ChartPieIcon } from './icons/ChartPieIcon';
import { TargetIcon } from './icons/TargetIcon'; 
import { LightBulbIcon } from './icons/LightBulbIcon'; 
import { SigmaIcon } from './icons/SigmaIcon';
import { TableListIcon } from './icons/TableListIcon';
import { BrainIcon } from './icons/BrainIcon';

interface ResultsSectionProps {
  results: CalculationResults | null;
  error: string | null;
  isLoading: boolean;
  calculationMode: CalculationMode;
  appState: AppState; 
  onGetAIInterpretation: () => Promise<void>; 
  aiInterpretation: string | null; 
}

// Simple Markdown to HTML (bold and newlines)
const SimpleMarkdown: React.FC<{ text: string }> = ({ text }) => {
  const html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
    .replace(/\n/g, '<br />'); 
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

const StatItem: React.FC<{ label: string; value: string | number | undefined | React.ReactNode; unit?: string; isSet?: boolean }> = ({ label, value, unit, isSet }) => {
  if (value === undefined || value === null || (typeof value === 'number' && isNaN(value))) {
    return null;
  }
  let displayValue: React.ReactNode;
  if (isSet && Array.isArray(value)) {
    displayValue = `{${value.join(', ')}}`;
  } else if (typeof value === 'number' && !Number.isInteger(value)) {
    const isProbabilityOrZ = (
        label.toLowerCase().includes('prob') || 
        label.toLowerCase().includes('p(') || 
        label.toLowerCase().includes('z') ||
        (value >=0 && value <=1 && (label.toLowerCase().includes('p(a ∩ b)') || label.toLowerCase().includes('p(b)')) ) || 
        label.toLowerCase().includes('f(x)')
    );
    displayValue = value.toFixed(isProbabilityOrZ ? 6 : 4);
  } else {
    displayValue = String(value);
  }

  return (
    <div className="py-2 px-3 bg-slate-700/50 rounded-md shadow flex flex-col sm:flex-row justify-between sm:items-center text-sm sm:text-base">
      <span className="text-sky-300 mb-1 sm:mb-0">{label}:</span>
      <span className="font-semibold text-slate-100 text-left sm:text-right">
        {displayValue} {unit}
      </span>
    </div>
  );
};

const FormulaDisplay: React.FC<{ formulas: Formula[] }> = ({ formulas }) => {
  if (!formulas || formulas.length === 0) return null;
  return (
    <div className="mt-6 p-4 bg-slate-700/30 rounded-lg shadow">
      <h4 className="text-lg font-medium text-cyan-300 mb-3">Fórmulas Clave:</h4>
      <ul className="space-y-2">
        {formulas.map((formula, index) => (
          <li key={index} className="text-sm text-slate-200">
            <strong className="text-sky-300">{formula.label}:</strong> <code>{formula.equation}</code>
          </li>
        ))}
      </ul>
    </div>
  );
};

const CalculationStepDisplay: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mt-4 p-4 bg-slate-700/40 rounded-lg shadow">
        <h4 className="text-md font-semibold text-teal-300 mb-3">{title}</h4>
        <div className="space-y-2 text-sm text-slate-200">
            {children}
        </div>
    </div>
);


const ResultsSection: React.FC<ResultsSectionProps> = ({ results, error, isLoading, calculationMode, appState, onGetAIInterpretation, aiInterpretation }) => {
  
  const renderChart = () => {
    if (!results) {
      return null; 
    }

    // Modes that don't use the standard Recharts chart rendering path below
    if (
      results.type === CalculationMode.STATISTICAL_CONCEPTS ||
      results.type === CalculationMode.AI_TASK_ASSISTANT ||
      results.type === CalculationMode.SET_OPERATIONS ||
      results.type === CalculationMode.INFERENCE || 
      results.type === CalculationMode.BASIC_PROBABILITY_COMBINATORICS ||
      results.type === CalculationMode.DISCRETE_RANDOM_VARIABLE ||
      results.type === CalculationMode.BAYES_THEOREM
    ) {
      return null;
    }

    // Chart rendering for specific modes
    if (results.type === CalculationMode.DESCRIPTIVE) {
      const descData = (results as DescriptiveStatsResults).data;
      const chartData = descData.histogramData;
      if (!chartData || chartData.length === 0) return <p className="text-slate-400 text-center py-4">No hay datos para mostrar el histograma.</p>;
      const yAxisLabel = 'Frecuencia';
      const xAxisLabel = 'Intervalo';
      const fill = '#2DD4BF';
      return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
              <XAxis dataKey="name" label={{ value: xAxisLabel, position: 'insideBottom', offset: -5, fill: '#94A3B8' }} stroke="#94A3B8" />
              <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', fill: '#94A3B8' }} stroke="#94A3B8" allowDecimals={false} />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(45, 55, 72, 0.9)', border: '1px solid #718096', borderRadius: '0.5rem' }} labelStyle={{ color: '#E2E8F0' }} itemStyle={{ color: '#E2E8F0' }} />
              <Legend wrapperStyle={{ color: '#CBD5E1' }} />
              <Bar dataKey="value" name={yAxisLabel} fill={fill} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
      );
    }

    if (results.type === CalculationMode.FREQUENCY_DISTRIBUTION) {
      const freqResultsData = (results as FrequencyDistributionResults).data;
      if (appState.frequencyChartType === 'pie') {
          const pieData = freqResultsData.classes.map(cls => ({
              name: cls.intervalLabel,
              value: cls.absoluteFrequency,
              classMark: cls.classMark,
              intervalLabel: cls.intervalLabel
          }));
          const totalAbsoluteFrequency = pieData.reduce((sum, entry) => sum + entry.value, 0);

          if (!pieData || pieData.length === 0) {
              return <p className="text-slate-400 text-center py-4">No hay datos para mostrar el gráfico circular.</p>;
          }
          return (
            <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                    <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }) => {
                            const RADIAN = Math.PI / 180;
                            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                            const x = cx + (radius + 10) * Math.cos(-midAngle * RADIAN); 
                            const y = cy + (radius + 10) * Math.sin(-midAngle * RADIAN);
                            if (percent * 100 < 3) return null; 
                            return (
                                <text x={x} y={y} fill="#CBD5E1" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="10px">
                                    {`${(percent * 100).toFixed(0)}%`}
                                </text>
                            );
                        }}
                        outerRadius={110}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ backgroundColor: 'rgba(45, 55, 72, 0.9)', border: '1px solid #718096', borderRadius: '0.5rem' }}
                        labelStyle={{ color: '#E2E8F0' }}
                        itemStyle={{ color: '#E2E8F0' }}
                        formatter={(value: number, name: string, props: any) => {
                            const percentage = totalAbsoluteFrequency > 0 ? (value / totalAbsoluteFrequency * 100).toFixed(2) : 0;
                            const { payload } = props; 
                            return [`Valor: ${value} (${percentage}%)`, `Intervalo: ${payload.intervalLabel} (Marca: ${payload.classMark.toFixed(2)})`];
                        }}
                    />
                    <Legend 
                        wrapperStyle={{ color: '#CBD5E1', paddingTop: '15px', maxHeight: '60px', overflowY: 'auto' }} 
                        formatter={(value: any, entry: any) => <span style={{ color: '#CBD5E1', fontSize: '12px' }}>{String(entry.payload.name)}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
          );
      } else { // Histogram/Polygon for FreqDist
          const chartDataForComposed = freqResultsData.combinedChartData;
          if (!chartDataForComposed || chartDataForComposed.length === 0) {
              return <p className="text-slate-400 text-center py-4">No hay datos para mostrar el gráfico.</p>;
          }
          return ( 
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={chartDataForComposed} margin={{ top: 5, right: 20, left: 0, bottom: 35 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                <XAxis dataKey="name" stroke="#94A3B8" label={{ value: 'Marca de Clase / Intervalo', position: 'insideBottom', offset: -15, fill: '#94A3B8' }} angle={-20} textAnchor="end" height={60} interval={0}/>
                <YAxis yAxisId="left" stroke="#60A5FA" label={{ value: 'Frec. Absoluta (fi)', angle: -90, position: 'insideLeft', fill: '#60A5FA', dx: -10 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(45, 55, 72, 0.9)', border: '1px solid #718096', borderRadius: '0.5rem' }}
                  labelStyle={{ color: '#E2E8F0' }} itemStyle={{ color: '#E2E8F0' }}
                  formatter={(val: number, nameKey: string, props: any) => {
                    const payload = props.payload as ChartDataPoint; 
                    if (payload && payload.intervalLabel && nameKey === "Frec. Absoluta (Histograma)") {
                      if (payload.intervalLabel !== "Polygon Start" && payload.intervalLabel !== "Polygon End") {
                         return [`${val} (Intervalo: ${payload.intervalLabel})`, nameKey];
                      }
                    }
                    if (typeof val === 'number') return [val.toFixed(4), nameKey];
                    return [val, nameKey];
                  }}
                />
                <Legend 
                  wrapperStyle={{ 
                    color: '#CBD5E1', 
                    paddingTop: '20px', 
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '24px' 
                  }} 
                />
                <Bar yAxisId="left" dataKey="value" name="Frec. Absoluta (Histograma)" fill="#60A5FA" radius={[4, 4, 0, 0]} barSize={30} />
                <Line yAxisId="left" type="monotone" dataKey="polygonValue" name="Polígono de Frecuencias" stroke="#FACC15" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          );
      }
    }

    // Generic chart rendering for PMF/PDF type distributions
    let chartData: ChartDataPoint[] | undefined;
    let chartTypeInternal: 'bar' | 'area' = 'bar';
    let yAxisLabel = 'Frecuencia';
    let xAxisLabel = 'Valor';
    let dataKey = 'value';
    let fill = '#2DD4BF';
    let stroke = '#2DD4BF';

    switch (results.type) {
      case CalculationMode.BINOMIAL:
        chartData = (results as BinomialResults).data.pmfData;
        yAxisLabel = 'Probabilidad P(X=k)';
        xAxisLabel = 'Número de Éxitos (k)';
        fill = '#8B5CF6';
        break;
      case CalculationMode.NORMAL:
        chartData = (results as NormalResults).data.pdfData;
        chartTypeInternal = 'area';
        yAxisLabel = 'Densidad f(x)';
        xAxisLabel = 'X';
        stroke = '#EC4899'; 
        fill = '#EC4899';
        break;
      case CalculationMode.POISSON_DISTRIBUTION:
        chartData = (results as PoissonResults).data.pmfData;
        yAxisLabel = 'Probabilidad P(X=k)';
        xAxisLabel = 'Número de Ocurrencias (k)';
        fill = '#F59E0B';
        break;
      case CalculationMode.EXPONENTIAL_DISTRIBUTION:
        chartData = (results as ExponentialResults).data.pdfData;
        chartTypeInternal = 'area';
        yAxisLabel = 'Densidad f(x)';
        xAxisLabel = 'X';
        stroke = '#10B981'; 
        fill = '#10B981';
        break;
      case CalculationMode.SAMPLING_DISTRIBUTIONS:
        const samplingResults = results as SamplingDistributionResults;
        chartData = samplingResults.data.content.pdfData;
        chartTypeInternal = 'area';
        yAxisLabel = 'Densidad f(x)';
        xAxisLabel = samplingResults.data.subMode === SubModeSamplingDistribution.MEANS ? 'Media Muestral (x̄)' : 'Proporción Muestral (p̂)';
        stroke = '#38BDF8'; 
        fill = '#38BDF8';
        break;
      case CalculationMode.DATA_SIMULATOR:
        const simResults = (results as DataSimulatorResults);
        if (simResults.data.summaryStats?.histogramData) {
            chartData = simResults.data.summaryStats.histogramData;
            yAxisLabel = 'Frecuencia';
            xAxisLabel = 'Intervalo (Datos Simulados)';
            fill = '#A78BFA';
        } else {
            return <p className="text-slate-400 text-center py-4">No hay datos de histograma para la simulación.</p>;
        }
        break;
      default:
        return <p className="text-slate-400 text-center py-4">Tipo de gráfico no implementado para este modo.</p>;
    }

    if (!chartData || chartData.length === 0) return <p className="text-slate-400 text-center py-4">No hay datos para mostrar el gráfico.</p>;

    if (chartTypeInternal === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis dataKey="name" label={{ value: xAxisLabel, position: 'insideBottom', offset: -5, fill: '#94A3B8' }} stroke="#94A3B8" />
            <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', fill: '#94A3B8' }} stroke="#94A3B8" allowDecimals={calculationMode === CalculationMode.BINOMIAL || calculationMode === CalculationMode.POISSON_DISTRIBUTION} />
            <Tooltip contentStyle={{ backgroundColor: 'rgba(45, 55, 72, 0.9)', border: '1px solid #718096', borderRadius: '0.5rem' }} labelStyle={{ color: '#E2E8F0' }} itemStyle={{ color: '#E2E8F0' }} formatter={(value: number) => value.toFixed(5)} />
            <Legend wrapperStyle={{ color: '#CBD5E1' }} />
            <Bar dataKey={dataKey} name={yAxisLabel} fill={fill} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    } else if (chartTypeInternal === 'area') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis dataKey="name" type="number" domain={['dataMin', 'dataMax']} label={{ value: xAxisLabel, position: 'insideBottom', offset: -5, fill: '#94A3B8' }} stroke="#94A3B8" />
            <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', fill: '#94A3B8' }} stroke="#94A3B8" />
            <Tooltip contentStyle={{ backgroundColor: 'rgba(45, 55, 72, 0.9)', border: '1px solid #718096', borderRadius: '0.5rem' }} labelStyle={{ color: '#E2E8F0' }} itemStyle={{ color: '#E2E8F0' }} formatter={(value: number) => value.toFixed(5)} />
            <Legend wrapperStyle={{ color: '#CBD5E1' }} />
            <Area type="monotone" dataKey={dataKey} name={`PDF ${yAxisLabel}`} stroke={stroke} fill={fill} fillOpacity={0.3} activeDot={{ r: 6 }} />
          </AreaChart>
        </ResponsiveContainer>
      );
    }
    return null; 
  };


  const renderResultsContent = () => {
    if (!results) {
        const messages: Record<string, string> = { 
            [CalculationMode.AI_TASK_ASSISTANT]: 'Describe tu tarea o pregunta para la IA y presiona "Pedir Guía a IA".', 
            [CalculationMode.DESCRIPTIVE]: 'Ingrese datos y presione "Calcular" para ver los resultados.',
            [CalculationMode.FREQUENCY_DISTRIBUTION]: 'Ingrese datos y presione "Calcular" para ver los resultados.',
            [CalculationMode.BINOMIAL]: 'Ingrese n, p y opcionalmente x, luego presione "Calcular".',
            [CalculationMode.NORMAL]: 'Ingrese μ, σ y opcionalmente X1/X2, luego presione "Calcular".',
            [CalculationMode.POISSON_DISTRIBUTION]: 'Ingrese Lambda (λ) y opcionalmente k, luego presione "Calcular".',
            [CalculationMode.EXPONENTIAL_DISTRIBUTION]: 'Ingrese Tasa (λ) y opcionalmente X, luego presione "Calcular".',
            [CalculationMode.DISCRETE_RANDOM_VARIABLE]: 'Ingrese los valores de X y sus probabilidades P(X=x), luego presione "Calcular".',
            [CalculationMode.BAYES_THEOREM]: 'Ingrese P(A), P(B|A), y P(B|¬A), luego presione "Calcular".',
            [CalculationMode.SAMPLING_DISTRIBUTIONS]: 'Seleccione un tipo, ingrese los datos y presione "Calcular".',
            [CalculationMode.STATISTICAL_CONCEPTS]: 'Seleccione un concepto y presione "Obtener Explicación (IA)".',
            [CalculationMode.SET_OPERATIONS]: 'Ingrese los conjuntos y seleccione una operación, luego presione "Calcular".',
            [CalculationMode.BASIC_PROBABILITY_COMBINATORICS]: 'Seleccione un tipo de cálculo, ingrese los datos y presione "Calcular".',
            [CalculationMode.INFERENCE]: 'Seleccione un tipo de inferencia, ingrese los datos y presione "Calcular".',
            [CalculationMode.DATA_SIMULATOR]: 'Configure los parámetros de simulación y presione "Generar Datos".',
        };
        return <p className="text-slate-400 text-center py-4">{messages[calculationMode] || "Seleccione un modo y calcule."}</p>;
    }


    switch (results.type) {
      case CalculationMode.DESCRIPTIVE:
        const descData = (results as DescriptiveStatsResults).data;
        return (
          <>
            <div className="space-y-2">
              <StatItem label="Conteo" value={descData.count} />
              <StatItem label="Media" value={descData.mean} />
              <StatItem label="Mediana" value={descData.median} />
              <StatItem label="Moda" value={descData.mode.join(', ') || 'N/A'} />
              <StatItem label="Desviación Estándar" value={descData.stdDev} />
              <StatItem label="Varianza" value={descData.variance} />
              <StatItem label="Mínimo" value={descData.min} />
              <StatItem label="Máximo" value={descData.max} />
              <StatItem label="Rango" value={descData.range} />
              <StatItem label="Suma" value={descData.sum} />
              <StatItem label="Q1 (Percentil 25)" value={descData.q1} />
              <StatItem label="Q3 (Percentil 75)" value={descData.q3} />
              <StatItem label="IQR (Rango Intercuartílico)" value={descData.iqr} />
            </div>
            {appState.descriptiveShowSteps && (
              <div className="mt-6 pt-4 border-t border-slate-700">
                <h3 className="text-xl font-semibold text-sky-400 mb-4">Detalles del Cálculo (Paso a Paso):</h3>
                {descData.meanSteps && (
                  <CalculationStepDisplay title="Cálculo de la Media">
                    <p>Suma de todos los valores (Σx): {descData.meanSteps.sum}</p>
                    <p>Número total de valores (N): {descData.meanSteps.count}</p>
                    <p>Media (x̄) = Σx / N = {descData.meanSteps.sum} / {descData.meanSteps.count} = <strong>{descData.mean.toFixed(4)}</strong></p>
                  </CalculationStepDisplay>
                )}
                {descData.medianSteps && (
                  <CalculationStepDisplay title="Cálculo de la Mediana">
                    <p>Datos ordenados: {descData.medianSteps.sortedData.join(', ')}</p>
                    <p>Número de datos (N): {descData.medianSteps.count}</p>
                    {descData.medianSteps.isEven ? (
                      <>
                        <p>N es par. La mediana es el promedio de los dos valores centrales.</p>
                        <p>Valores centrales: {descData.medianSteps.middleIndices?.[0]} y {descData.medianSteps.middleIndices?.[1]}</p>
                        <p>Mediana = ({descData.medianSteps.middleIndices?.[0]} + {descData.medianSteps.middleIndices?.[1]}) / 2 = <strong>{descData.median.toFixed(4)}</strong></p>
                      </>
                    ) : (
                      <>
                        <p>N es impar. La mediana es el valor central.</p>
                        <p>Valor central: {descData.medianSteps.middleValue}</p>
                        <p>Mediana = <strong>{descData.median.toFixed(4)}</strong></p>
                      </>
                    )}
                  </CalculationStepDisplay>
                )}
                {descData.varianceSteps && (
                  <CalculationStepDisplay title="Cálculo de la Varianza Muestral (s²)">
                    <p>Media (x̄): {descData.varianceSteps.mean.toFixed(4)}</p>
                    <p>Número de datos (N): {descData.varianceSteps.count}</p>
                    <div className="overflow-x-auto mt-2 mb-2 max-h-60 custom-scrollbar">
                      <table className="min-w-full text-xs divide-y divide-slate-600 bg-slate-700/30 rounded">
                        <thead className="bg-slate-600/50">
                          <tr>
                            <th className="px-2 py-1 text-left">xᵢ</th>
                            <th className="px-2 py-1 text-left">xᵢ - x̄</th>
                            <th className="px-2 py-1 text-left">(xᵢ - x̄)²</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-600">
                          {descData.varianceSteps.items.map((item, index) => (
                            <tr key={index}>
                              <td className="px-2 py-1">{item.x}</td>
                              <td className="px-2 py-1">{item.deviation.toFixed(4)}</td>
                              <td className="px-2 py-1">{item.squaredDeviation.toFixed(4)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p>Suma de las desviaciones cuadradas (Σ(xᵢ - x̄)²): {descData.varianceSteps.sumSquaredDeviations.toFixed(4)}</p>
                    <p>Varianza (s²) = Σ(xᵢ - x̄)² / (N - 1) = {descData.varianceSteps.sumSquaredDeviations.toFixed(4)} / ({descData.varianceSteps.count} - 1)</p>
                    <p>Varianza (s²) = <strong>{descData.variance.toFixed(4)}</strong></p>
                  </CalculationStepDisplay>
                )}
                {descData.stdDevSteps && (
                  <CalculationStepDisplay title="Cálculo de la Desviación Estándar Muestral (s)">
                    <p>Varianza (s²): {descData.stdDevSteps.variance.toFixed(4)}</p>
                    <p>Desviación Estándar (s) = √s² = √{descData.stdDevSteps.variance.toFixed(4)} = <strong>{descData.stdDev.toFixed(4)}</strong></p>
                  </CalculationStepDisplay>
                )}
              </div>
            )}
          </>
        );
      case CalculationMode.FREQUENCY_DISTRIBUTION:
        const freqData = (results as FrequencyDistributionResults).data;
        return (
          <>
            <div className="space-y-2 mb-6">
              <StatItem label="Total de Datos (N)" value={freqData.n} />
              <StatItem label="Valor Mínimo (Vmin)" value={freqData.vMin} />
              <StatItem label="Valor Máximo (Vmax)" value={freqData.vMax} />
              <StatItem label="Rango" value={freqData.range} />
              <StatItem label="Número de Clases (Nc)" value={freqData.numClasses} />
              <StatItem label="Amplitud de Clase (A)" value={freqData.classWidth} />
            </div>
            <h4 className="text-lg font-medium text-teal-300 mb-3 flex items-center"><TableCellsIcon className="w-5 h-5 mr-2"/> Tabla de Distribución de Frecuencias</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-700 bg-slate-700/30 rounded-md shadow">
                <thead className="bg-slate-600/50">
                  <tr>
                    <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-sky-300 uppercase tracking-wider">Intervalo Clase</th>
                    <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-sky-300 uppercase tracking-wider">Marca (Xi)</th>
                    <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-sky-300 uppercase tracking-wider">Frec. Abs. (fi)</th>
                    <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-sky-300 uppercase tracking-wider">Frec. Rel. (fr)</th>
                    <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-sky-300 uppercase tracking-wider">Frec. Acum. (Fa)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {freqData.classes.map((cls, index) => (
                    <tr key={index} className="hover:bg-slate-700/50 transition-colors">
                      <td className="px-4 py-2.5 whitespace-nowrap text-sm text-slate-200">{cls.intervalLabel}</td>
                      <td className="px-4 py-2.5 whitespace-nowrap text-sm text-slate-200">{cls.classMark.toFixed(2)}</td>
                      <td className="px-4 py-2.5 whitespace-nowrap text-sm text-slate-200">{cls.absoluteFrequency}</td>
                      <td className="px-4 py-2.5 whitespace-nowrap text-sm text-slate-200">{cls.relativeFrequency.toFixed(4)}</td>
                      <td className="px-4 py-2.5 whitespace-nowrap text-sm text-slate-200">{cls.accumulatedFrequency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );
      case CalculationMode.BINOMIAL:
        const binomData = (results as BinomialResults).data;
        return (
          <div className="space-y-2">
            <StatItem label="Media (μ = np)" value={binomData.mean} />
            <StatItem label="Varianza (σ² = npq)" value={binomData.variance} />
            <StatItem label="Desviación Estándar (σ)" value={binomData.stdDev} />
            {binomData.exactProbability !== undefined && <StatItem label="P(X = x)" value={binomData.exactProbability} />}
            {binomData.lessThanOrEqualProbability !== undefined && <StatItem label="P(X ≤ x)" value={binomData.lessThanOrEqualProbability} />}
            {binomData.greaterThanOrEqualProbability !== undefined && <StatItem label="P(X ≥ x)" value={binomData.greaterThanOrEqualProbability} />}
          </div>
        );
      case CalculationMode.NORMAL:
        const normData = (results as NormalResults).data;
        return (
          <div className="space-y-2">
            {normData.zScoreX1 !== undefined && <StatItem label="Puntuación Z para X1" value={normData.zScoreX1} /> }
            {normData.probabilityLessThanX1 !== undefined && <StatItem label="P(X ≤ X1)" value={normData.probabilityLessThanX1} />}
            {normData.probabilityGreaterThanX1 !== undefined && <StatItem label="P(X ≥ X1)" value={normData.probabilityGreaterThanX1} />}
            {normData.probabilityBetweenX1X2 !== undefined && <StatItem label="P(X1 ≤ X ≤ X2)" value={normData.probabilityBetweenX1X2} />}
            {normData.probabilityLessThanX1 === undefined && normData.probabilityGreaterThanX1 === undefined && normData.probabilityBetweenX1X2 === undefined && (
                 <p className="text-slate-400 text-sm p-2 bg-slate-700/30 rounded-md">Proporcione X1 (y opcionalmente X2) para calcular probabilidades específicas.</p>
            )}
          </div>
        );
      case CalculationMode.POISSON_DISTRIBUTION:
        const poissonData = (results as PoissonResults).data;
        return (
          <div className="space-y-2">
            <StatItem label="Media (μ = λ)" value={poissonData.mean} />
            <StatItem label="Varianza (σ² = λ)" value={poissonData.variance} />
            <StatItem label="Desviación Estándar (σ = √λ)" value={poissonData.stdDev} />
            {poissonData.exactProbability !== undefined && <StatItem label="P(X = k)" value={poissonData.exactProbability} />}
            {poissonData.lessThanOrEqualProbability !== undefined && <StatItem label="P(X ≤ k)" value={poissonData.lessThanOrEqualProbability} />}
            {poissonData.greaterThanProbability !== undefined && <StatItem label="P(X > k)" value={poissonData.greaterThanProbability} />}
            {(poissonData.exactProbability === undefined && poissonData.lessThanOrEqualProbability === undefined && poissonData.greaterThanProbability === undefined) && 
                <p className="text-slate-400 text-sm p-2 bg-slate-700/30 rounded-md">Proporcione 'k' para calcular probabilidades específicas.</p>
            }
          </div>
        );
      case CalculationMode.EXPONENTIAL_DISTRIBUTION:
        const expData = (results as ExponentialResults).data;
        return (
          <div className="space-y-2">
            <StatItem label="Media (μ = 1/λ)" value={expData.mean} />
            <StatItem label="Varianza (σ² = 1/λ²)" value={expData.variance} />
            <StatItem label="Desviación Estándar (σ = 1/λ)" value={expData.stdDev} />
            {expData.fx !== undefined && <StatItem label="f(x) (Densidad en x)" value={expData.fx} />}
            {expData.probLessThanOrEqualX !== undefined && <StatItem label="P(X ≤ x)" value={expData.probLessThanOrEqualX} />}
            {expData.probGreaterThanX !== undefined && <StatItem label="P(X > x)" value={expData.probGreaterThanX} />}
            {(expData.fx === undefined && expData.probLessThanOrEqualX === undefined && expData.probGreaterThanX === undefined) && 
                <p className="text-slate-400 text-sm p-2 bg-slate-700/30 rounded-md">Proporcione 'X' para calcular f(x) y probabilidades específicas.</p>
            }
          </div>
        );
      case CalculationMode.DISCRETE_RANDOM_VARIABLE:
        const drvData = (results as DiscreteRVResults).data;
        return (
          <>
            <div className="space-y-2 mb-6">
              <StatItem label="Valor Esperado E(X)" value={drvData.mean} />
              <StatItem label="Varianza Var(X)" value={drvData.variance} />
              <StatItem label="Desviación Estándar σ(X)" value={drvData.stdDev} />
            </div>
            <h4 className="text-lg font-medium text-teal-300 mb-3 flex items-center">
              <TableListIcon className="w-5 h-5 mr-2" /> Resumen de la Distribución de Probabilidad Ingresada
            </h4>
            <div className="overflow-x-auto max-h-60 custom-scrollbar">
              <table className="min-w-full divide-y divide-slate-700 bg-slate-700/30 rounded-md shadow">
                <thead className="bg-slate-600/50 sticky top-0">
                  <tr>
                    <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-sky-300 uppercase tracking-wider">X (Valor)</th>
                    <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-sky-300 uppercase tracking-wider">P(X=x) (Probabilidad)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {drvData.summaryTable.map((row, index) => (
                    <tr key={index} className="hover:bg-slate-700/50 transition-colors">
                      <td className="px-4 py-2.5 whitespace-nowrap text-sm text-slate-200">{row.x}</td>
                      <td className="px-4 py-2.5 whitespace-nowrap text-sm text-slate-200">{row.p.toFixed(6)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );
      case CalculationMode.BAYES_THEOREM:
        const bayesData = (results as BayesTheoremResults).data;
        return (
          <div className="space-y-2">
            <StatItem label="P(A) (Entrada)" value={bayesData.probA} />
            <StatItem label="P(B|A) (Entrada)" value={bayesData.probBGivenA} />
            <StatItem label="P(B|¬A) (Entrada)" value={bayesData.probBGivenNotA} />
            <hr className="border-slate-700 my-2" />
            <StatItem label="P(¬A) (Calculado)" value={bayesData.probNotA} />
            <StatItem label="P(B) (Calculado por Ley de Prob. Total)" value={bayesData.probB} />
            <StatItem label="P(A|B) (Resultado - Teorema de Bayes)" value={bayesData.probAGivenB} />
          </div>
        );
      case CalculationMode.SAMPLING_DISTRIBUTIONS: 
        const samplingData = (results as SamplingDistributionResults).data;
        if (samplingData.subMode === SubModeSamplingDistribution.MEANS) {
          const meansContent = samplingData.content as SamplingMeansResultsContent;
          return (
            <div className="space-y-2">
              <StatItem label="Media de la Distribución Muestral (μx̄)" value={meansContent.distMean} />
              <StatItem label="Error Estándar (σx̄)" value={meansContent.stdError} />
              <StatItem label="Tamaño de Muestra (n)" value={meansContent.sampleSize} />
              {meansContent.isTLCApplied && <p className="text-sm text-sky-300 p-2 bg-sky-700/30 rounded-md">Nota: Dado n ≥ 30, se aplica el Teorema del Límite Central (TLC), y la distribución muestral de medias se aproxima a una distribución Normal.</p>}
              {!meansContent.isTLCApplied && meansContent.sampleSize < 30 && <p className="text-sm text-amber-400 p-2 bg-amber-700/30 rounded-md">Advertencia: n &lt; 30. La aproximación Normal es mejor si la población original es Normal o n es mayor.</p>}
              {meansContent.zScore !== undefined && <StatItem label="Puntuación Z para x̄" value={meansContent.zScore} />}
              {meansContent.probLessThanXBar !== undefined && <StatItem label={`P(X̄ ≤ ${meansContent.sampleMeanXBar})`} value={meansContent.probLessThanXBar} />}
              {meansContent.probGreaterThanXBar !== undefined && <StatItem label={`P(X̄ ≥ ${meansContent.sampleMeanXBar})`} value={meansContent.probGreaterThanXBar} />}
              {meansContent.sampleMeanXBar === undefined && <p className="text-slate-400 text-sm p-2 bg-slate-700/30 rounded-md">Proporcione 'x̄' para calcular probabilidades específicas.</p>}
            </div>
          );
        } else { 
          const propsContent = samplingData.content as SamplingProportionsResultsContent;
          return (
            <div className="space-y-2">
              <StatItem label="Media de la Distribución Muestral (μp̂)" value={propsContent.distMean} />
              <StatItem label="Error Estándar (σp̂)" value={propsContent.stdError} />
              <StatItem label="Tamaño de Muestra (n)" value={propsContent.sampleSize} />
              <p className={`text-sm p-2 rounded-md ${propsContent.meetsNormalApproximation ? 'bg-sky-700/30 text-sky-300' : 'bg-amber-700/30 text-amber-400'}`}>
                Condición de Aproximación Normal (np ≥ 10 y n(1-p) ≥ 10):
                np = {propsContent.npValue.toFixed(2)}, n(1-p) = {propsContent.n1pValue.toFixed(2)}.
                {propsContent.meetsNormalApproximation ? " Se cumple." : " No se cumple. La aproximación Normal puede no ser precisa."}
              </p>
              {propsContent.zScore !== undefined && propsContent.meetsNormalApproximation && <StatItem label="Puntuación Z para p̂" value={propsContent.zScore} />}
              {propsContent.probLessThanPHat !== undefined && propsContent.meetsNormalApproximation && <StatItem label={`P(P̂ ≤ ${propsContent.sampleProportionPHat})`} value={propsContent.probLessThanPHat} />}
              {propsContent.probGreaterThanPHat !== undefined && propsContent.meetsNormalApproximation && <StatItem label={`P(P̂ ≥ ${propsContent.sampleProportionPHat})`} value={propsContent.probGreaterThanPHat} />}
              {propsContent.sampleProportionPHat === undefined && <p className="text-slate-400 text-sm p-2 bg-slate-700/30 rounded-md">Proporcione 'p̂' para calcular probabilidades específicas.</p>}
            </div>
          );
        }
      case CalculationMode.STATISTICAL_CONCEPTS:
        const conceptData = (results as ConceptualExplanationResults).data;
        return (
          <div className="prose prose-sm sm:prose lg:prose-lg prose-invert max-w-none text-slate-200">
            <h3 className="text-xl font-medium text-teal-300 mb-3">{conceptData.topicLabel}</h3>
            <SimpleMarkdown text={conceptData.explanation} />
          </div>
        );
      case CalculationMode.AI_TASK_ASSISTANT: 
        const assistantData = (results as AITaskAssistantResults).data;
        return (
          <div className="prose prose-sm sm:prose lg:prose-lg prose-invert max-w-none text-slate-200">
            <div className="mb-4 p-3 bg-slate-700/40 rounded-md">
                <p className="text-sky-300 font-medium">Tu Pregunta:</p>
                <p className="italic text-slate-300">"{assistantData.userQuery}"</p>
            </div>
            <h3 className="text-xl font-medium text-teal-300 mb-3">Guía del Asistente IA:</h3>
            <SimpleMarkdown text={assistantData.guidance} />
          </div>
        );
      case CalculationMode.SET_OPERATIONS:
        const setData = (results as SetOperationsResults).data;
        const operationLabel = SET_OPERATION_OPTIONS.find(op => op.value === setData.operation)?.label || setData.operation;
        return (
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-medium text-teal-300 mb-2">Conjuntos de Entrada:</h4>
              <StatItem label="Conjunto A" value={setData.setA} isSet />
              <StatItem label="Conjunto B" value={setData.setB} isSet />
              <StatItem label="Operación" value={operationLabel} />
            </div>
            <div>
              <h4 className="text-lg font-medium text-teal-300 mb-2">Resultado de la Operación:</h4>
              <StatItem label={`Resultado (${operationLabel})`} value={setData.resultSet} isSet />
              <StatItem label={`Cardinalidad del Resultado |${operationLabel}|`} value={setData.countResultSet} />
            </div>
             <div>
              <h4 className="text-lg font-medium text-teal-300 mb-2">Componentes (Diagrama de Venn):</h4>
              <StatItem label="Solo en A (A - B)" value={setData.elementsOnlyInA} isSet />
              <StatItem label="Cardinalidad |A - B|" value={setData.countOnlyInA} />
              <StatItem label="Solo en B (B - A)" value={setData.elementsOnlyInB} isSet />
              <StatItem label="Cardinalidad |B - A|" value={setData.countOnlyInB} />
              <StatItem label="Intersección (A ∩ B)" value={setData.intersection} isSet />
              <StatItem label="Cardinalidad |A ∩ B|" value={setData.countIntersection} />
            </div>
          </div>
        );
      case CalculationMode.BASIC_PROBABILITY_COMBINATORICS:
        const probData = (results as BasicProbabilityCombinatoricsResults).data;
        const { subMode, inputs: probInputs, output: probOutput } = probData;

        if (subMode === SubModeBasicProbability.COMBINATORICS) {
          const { n, r, operationType, result } = probOutput as any; 
          const opLabel = COMBINATORICS_OPERATION_OPTIONS.find(opt => opt.value === operationType)?.label || operationType;
          return (
            <div className="space-y-2">
              <StatItem label="Tipo" value="Combinatoria" />
              <StatItem label="Operación" value={opLabel} />
              <StatItem label="n (Total de elementos)" value={n} />
              <StatItem label="r (Elementos a elegir/ordenar)" value={r} />
              <StatItem label={`Resultado (${opLabel})`} value={result} />
            </div>
          );
        } else if (subMode === SubModeBasicProbability.BASIC_PROBABILITY) {
          const { favorable, possible, probability } = probOutput as any; 
          return (
            <div className="space-y-2">
              <StatItem label="Tipo" value="Probabilidad Básica" />
              <StatItem label="Casos Favorables" value={favorable} />
              <StatItem label="Casos Posibles" value={possible} />
              <StatItem label="Probabilidad P(Evento)" value={probability} />
            </div>
          );
        } else if (subMode === SubModeBasicProbability.CONDITIONAL_PROBABILITY) {
          const { probIntersectionAB, probB, conditionalProbability } = probOutput as any; 
          return (
            <div className="space-y-2">
              <StatItem label="Tipo" value="Probabilidad Condicional" />
              <StatItem label="P(A ∩ B)" value={probIntersectionAB} />
              <StatItem label="P(B)" value={probB} />
              <StatItem label="Probabilidad Condicional P(A|B)" value={conditionalProbability} />
            </div>
          );
        }
        return <p className="text-slate-400">Resultados de probabilidad no disponibles.</p>;
      case CalculationMode.INFERENCE: 
        const inferenceResults = results as ConfidenceIntervalResults;
        if (inferenceResults.data.subModeInference === SubModeInference.CONFIDENCE_INTERVALS) {
          if (inferenceResults.data.subModeConfidenceInterval === SubModeConfidenceInterval.MEAN_SIGMA_KNOWN) {
            const ciData = inferenceResults.data.content as ConfidenceIntervalMeanSigmaKnownResultContent;
            return (
              <div className="space-y-2">
                <StatItem label="Media Muestral (x̄)" value={ciData.sampleMean} />
                <StatItem label="Desv. Estándar Poblacional (σ)" value={ciData.populationSigma} />
                <StatItem label="Tamaño de Muestra (n)" value={ciData.sampleSize} />
                <StatItem label="Nivel de Confianza" value={`${ciData.confidenceLevel}%`} />
                <StatItem label="Valor Crítico Z" value={ciData.zCritical} />
                <StatItem label="Error Estándar" value={ciData.standardError} />
                <StatItem label="Margen de Error" value={ciData.marginOfError} />
                <StatItem label="Límite Inferior del IC" value={ciData.lowerBound} />
                <StatItem label="Límite Superior del IC" value={ciData.upperBound} />
                <div className="mt-3 p-3 bg-sky-700/30 rounded-md text-sm text-sky-200">
                    <p className="font-medium">Interpretación:</p>
                    <p>{ciData.interpretation}</p>
                </div>
              </div>
            );
          }
        }
        return <p className="text-slate-400">Resultados de inferencia no disponibles para este submodo.</p>;
    case CalculationMode.DATA_SIMULATOR:
        const simResults = results as DataSimulatorResults;
        const summary = simResults.data.summaryStats;
        const params = simResults.data.parameters;
        let paramString = "";
        if (params.distributionType === SimulatorDistributionType.UNIFORM) {
            paramString = `Min: ${params.uniformMin}, Max: ${params.uniformMax}`;
        } else if (params.distributionType === SimulatorDistributionType.NORMAL) {
            paramString = `Media: ${params.normalMean}, Desv.Est.: ${params.normalStdDev}`;
        } else if (params.distributionType === SimulatorDistributionType.BINOMIAL) {
            paramString = `n: ${params.binomialN}, p: ${params.binomialP}`;
        } else if (params.distributionType === SimulatorDistributionType.POISSON) {
            paramString = `Lambda: ${params.poissonLambda}`;
        }

        return (
            <div className="space-y-2">
                <StatItem label="Tipo de Distribución Simulada" value={simResults.data.distributionType} />
                <StatItem label="Número de Puntos Generados" value={simResults.data.generatedData.length} />
                <StatItem label="Parámetros Usados" value={paramString} />
                {summary && (
                    <>
                        <h4 className="text-md font-medium text-teal-300 pt-3">Estadísticas Descriptivas de Datos Simulados:</h4>
                        <StatItem label="Media" value={summary.mean} />
                        <StatItem label="Mediana" value={summary.median} />
                        <StatItem label="Desv. Estándar" value={summary.stdDev} />
                        <StatItem label="Mínimo" value={summary.min} />
                        <StatItem label="Máximo" value={summary.max} />
                        <StatItem label="Q1" value={summary.q1} />
                        <StatItem label="Q3" value={summary.q3} />
                    </>
                )}
                 <details className="mt-2 text-xs">
                    <summary className="cursor-pointer text-sky-400 hover:text-sky-300">Mostrar primeros 100 datos generados</summary>
                    <div className="p-2 mt-1 bg-slate-700/40 rounded-md max-h-40 overflow-y-auto custom-scrollbar">
                        {simResults.data.generatedData.slice(0, 100).map(d => d.toFixed(4)).join(', ')}
                        {simResults.data.generatedData.length > 100 && "..."}
                    </div>
                </details>
            </div>
        );
      default:
        return <p className="text-slate-400">No hay resultados para mostrar.</p>;
    }
  };
  
  const getChartIcon = () => {
    if (calculationMode === CalculationMode.STATISTICAL_CONCEPTS) return <InformationCircleIcon className="w-6 h-6" />;
    if (calculationMode === CalculationMode.AI_TASK_ASSISTANT) return <QuestionMarkCircleIcon className="w-6 h-6" />; 
    if (calculationMode === CalculationMode.SET_OPERATIONS) return <ViewfinderCircleIcon className="w-6 h-6" />;
    if (calculationMode === CalculationMode.BASIC_PROBABILITY_COMBINATORICS) return <BeakerIcon className="w-6 h-6" />;
    if (calculationMode === CalculationMode.POISSON_DISTRIBUTION) return <SparklesIcon className="w-6 h-6" />;
    if (calculationMode === CalculationMode.EXPONENTIAL_DISTRIBUTION) return <ClockIcon className="w-6 h-6" />;
    if (calculationMode === CalculationMode.DISCRETE_RANDOM_VARIABLE) return <SigmaIcon className="w-6 h-6" />;
    if (calculationMode === CalculationMode.BAYES_THEOREM) return <BrainIcon className="w-6 h-6" />;
    if (calculationMode === CalculationMode.SAMPLING_DISTRIBUTIONS) return <CubeTransparentIcon className="w-6 h-6" />; 
    if (calculationMode === CalculationMode.INFERENCE) return <TargetIcon className="w-6 h-6" />; 
    if (calculationMode === CalculationMode.DATA_SIMULATOR) return <BeakerIcon className="w-6 h-6" />; 

    if (calculationMode === CalculationMode.DESCRIPTIVE) {
        return <ChartBarIcon className="w-6 h-6" />;
    }
    if (calculationMode === CalculationMode.FREQUENCY_DISTRIBUTION) {
        return appState.frequencyChartType === 'pie' ? <ChartPieIcon className="w-6 h-6" /> : <ChartBarIcon className="w-6 h-6" />;
    }
    
    if (results) {
        switch (results.type) {
          case CalculationMode.BINOMIAL: return <ChartBarIcon className="w-6 h-6" />;
          case CalculationMode.NORMAL: return <LineChartIcon className="w-6 h-6" />;
          default: return <ChartBarIcon className="w-6 h-6" />; 
        }
    }
    return <ChartBarIcon className="w-6 h-6" />; 
  };
  
  const getResultsTitle = () => {
    switch (calculationMode) {
      case CalculationMode.STATISTICAL_CONCEPTS: return 'Explicación del Concepto';
      case CalculationMode.AI_TASK_ASSISTANT: return 'Guía del Asistente IA'; 
      case CalculationMode.SET_OPERATIONS: return 'Resultados de Operaciones con Conjuntos';
      case CalculationMode.BASIC_PROBABILITY_COMBINATORICS: return 'Resultados de Probabilidad y Combinatoria';
      case CalculationMode.POISSON_DISTRIBUTION: return 'Resultados de Distribución de Poisson';
      case CalculationMode.EXPONENTIAL_DISTRIBUTION: return 'Resultados de Distribución Exponencial';
      case CalculationMode.DISCRETE_RANDOM_VARIABLE: return 'Resultados de Análisis de Variable Aleatoria Discreta';
      case CalculationMode.BAYES_THEOREM: return 'Resultados del Teorema de Bayes';
      case CalculationMode.SAMPLING_DISTRIBUTIONS: return 'Resultados de Distribuciones Muestrales';
      case CalculationMode.INFERENCE: 
        if (results && (results as ConfidenceIntervalResults).data.subModeInference === SubModeInference.CONFIDENCE_INTERVALS) {
            return 'Resultados del Intervalo de Confianza';
        }
        return 'Resultados de Inferencia Estadística';
      case CalculationMode.DATA_SIMULATOR: return 'Resultados de Simulación de Datos';
      default: return 'Resultados y Visualización';
    }
  }

  let formulasForDisplay: Formula[] = [];
  if (results) {
    const currentModeKey = calculationMode as string; 
    let subModeKey = '';

    if (results.type === CalculationMode.BASIC_PROBABILITY_COMBINATORICS) {
        const probResults = results as BasicProbabilityCombinatoricsResults;
        if (probResults.data.subMode === SubModeBasicProbability.COMBINATORICS) {
            const opType = probResults.data.inputs.combinatoricsOp;
            if (opType === CombinatoricsOperationType.PERMUTATIONS) formulasForDisplay = FORMULAS_COMBINATORICS_PERMUTATIONS;
            if (opType === CombinatoricsOperationType.COMBINATIONS) formulasForDisplay = FORMULAS_COMBINATORICS_COMBINations;
        } else if (probResults.data.subMode === SubModeBasicProbability.BASIC_PROBABILITY) {
            formulasForDisplay = FORMULAS_BASIC_PROBABILITY;
        } else if (probResults.data.subMode === SubModeBasicProbability.CONDITIONAL_PROBABILITY) {
            formulasForDisplay = FORMULAS_CONDITIONAL_PROBABILITY;
        }
    } else if (results.type === CalculationMode.SAMPLING_DISTRIBUTIONS) { 
        const samplingResults = results as SamplingDistributionResults;
        if (samplingResults.data.subMode === SubModeSamplingDistribution.MEANS) {
            formulasForDisplay = FORMULAS_SAMPLING_MEANS;
        } else { 
            formulasForDisplay = FORMULAS_SAMPLING_PROPORTIONS;
        }
    } else if (results.type === CalculationMode.INFERENCE) { 
        const inferenceRes = results as ConfidenceIntervalResults;
        if (inferenceRes.data.subModeInference === SubModeInference.CONFIDENCE_INTERVALS &&
            inferenceRes.data.subModeConfidenceInterval === SubModeConfidenceInterval.MEAN_SIGMA_KNOWN) {
            subModeKey = `${currentModeKey}-${SubModeInference.CONFIDENCE_INTERVALS}-${SubModeConfidenceInterval.MEAN_SIGMA_KNOWN}`;
            formulasForDisplay = FORMULAS[subModeKey] || [];
        }
    } else if (FORMULAS[currentModeKey] && Array.isArray(FORMULAS[currentModeKey])) {
        formulasForDisplay = FORMULAS[currentModeKey];
    }
  }
  
  const showFormulas = results && formulasForDisplay.length > 0 &&
    calculationMode !== CalculationMode.STATISTICAL_CONCEPTS &&
    calculationMode !== CalculationMode.AI_TASK_ASSISTANT &&
    calculationMode !== CalculationMode.DATA_SIMULATOR; 

  const canRequestAIInterpretation = results && (
        (results.type === CalculationMode.INFERENCE && (results as ConfidenceIntervalResults).data.subModeConfidenceInterval === SubModeConfidenceInterval.MEAN_SIGMA_KNOWN)
    );

  // Fix: Define showChart based on results and calculation mode
  const showChart = results &&
    results.type !== CalculationMode.STATISTICAL_CONCEPTS &&
    results.type !== CalculationMode.AI_TASK_ASSISTANT &&
    results.type !== CalculationMode.SET_OPERATIONS &&
    results.type !== CalculationMode.INFERENCE &&
    results.type !== CalculationMode.BASIC_PROBABILITY_COMBINATORICS &&
    results.type !== CalculationMode.DISCRETE_RANDOM_VARIABLE &&
    results.type !== CalculationMode.BAYES_THEOREM;


  return (
    <div className="bg-slate-800/70 backdrop-blur-md shadow-2xl rounded-xl p-6 md:p-8 h-full flex flex-col">
      <h2 className="text-2xl font-semibold text-sky-400 mb-3 border-b border-slate-700 pb-3 flex items-center space-x-2">
        {getChartIcon()}
        <span>{getResultsTitle()}</span>
      </h2>
      
      {isLoading && !aiInterpretation && ( 
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <svg className="animate-spin mx-auto h-12 w-12 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-lg text-slate-300">
              {calculationMode === CalculationMode.STATISTICAL_CONCEPTS || calculationMode === CalculationMode.AI_TASK_ASSISTANT ? 'Consultando IA...' : 'Calculando...'}
            </p>
          </div>
        </div>
      )}

      {!isLoading && error && (
        <div className="flex-grow flex items-center justify-center">
          <div className="bg-red-500/20 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative w-full max-w-md" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      )}

      {!isLoading && !error && (
         <div className="flex-grow flex flex-col space-y-6 overflow-y-auto pr-2 -mr-2 custom-scrollbar" style={{maxHeight: 'calc(100vh - 250px)'}}>
          <div className="numerical-results">
             { ![CalculationMode.STATISTICAL_CONCEPTS, CalculationMode.AI_TASK_ASSISTANT, CalculationMode.SET_OPERATIONS, CalculationMode.BASIC_PROBABILITY_COMBINATORICS, CalculationMode.POISSON_DISTRIBUTION, CalculationMode.EXPONENTIAL_DISTRIBUTION, CalculationMode.SAMPLING_DISTRIBUTIONS, CalculationMode.INFERENCE, CalculationMode.DATA_SIMULATOR, CalculationMode.DISCRETE_RANDOM_VARIABLE, CalculationMode.BAYES_THEOREM].includes(calculationMode) && results && (
                <h3 className="text-xl font-medium text-teal-300 mb-3">Resumen Estadístico</h3>
             )}
             { (calculationMode === CalculationMode.DATA_SIMULATOR && results) && (
                 <h3 className="text-xl font-medium text-teal-300 mb-3">Resumen de Datos Simulados</h3>
             )}
              { (calculationMode === CalculationMode.BAYES_THEOREM && results) && (
                 <h3 className="text-xl font-medium text-teal-300 mb-3">Cálculo del Teorema de Bayes</h3>
             )}
             { (calculationMode === CalculationMode.BASIC_PROBABILITY_COMBINATORICS && results) && (
                 <h3 className="text-xl font-medium text-teal-300 mb-3">Cálculo de Probabilidad/Combinatoria</h3>
             )}
             { (calculationMode === CalculationMode.POISSON_DISTRIBUTION && results) && (
                 <h3 className="text-xl font-medium text-teal-300 mb-3">Estadísticas de Poisson</h3>
             )}
             { (calculationMode === CalculationMode.EXPONENTIAL_DISTRIBUTION && results) && (
                 <h3 className="text-xl font-medium text-teal-300 mb-3">Estadísticas Exponenciales</h3>
             )}
              { (calculationMode === CalculationMode.SAMPLING_DISTRIBUTIONS && results) && (
                 <h3 className="text-xl font-medium text-teal-300 mb-3">
                    Resultados de Distribución Muestral de { (results as SamplingDistributionResults).data.subMode === SubModeSamplingDistribution.MEANS ? 'Medias' : 'Proporciones' }
                 </h3>
             )}
             { (calculationMode === CalculationMode.INFERENCE && results) && ( 
                 <h3 className="text-xl font-medium text-teal-300 mb-3">
                    Intervalo de Confianza para la Media (σ Conocida)
                 </h3>
             )}
             { (calculationMode === CalculationMode.DISCRETE_RANDOM_VARIABLE && results) && ( 
                 <h3 className="text-xl font-medium text-teal-300 mb-3">
                    Análisis de Variable Aleatoria Discreta
                 </h3>
             )}
            {renderResultsContent()}
          </div>
          {showChart && (
            <div className="chart-container mt-4 pt-4 border-t border-slate-700">
              <h3 className="text-xl font-medium text-teal-300 mb-3">Visualización de Datos</h3>
              {renderChart()}
            </div>
          )}
           {showFormulas && <FormulaDisplay formulas={formulasForDisplay} />}

            {canRequestAIInterpretation && (
                <div className="mt-6 pt-4 border-t border-slate-700">
                    <button
                        onClick={onGetAIInterpretation}
                        disabled={isLoading}
                        className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-700/50 text-slate-900 font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out transform hover:scale-102 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-75 flex items-center justify-center space-x-2 text-sm"
                    >
                        <LightBulbIcon className="w-5 h-5" />
                        <span>{isLoading && aiInterpretation === "Consultando IA para interpretación..." ? "Consultando IA..." : "Obtener Interpretación de IA"}</span>
                    </button>
                </div>
            )}

            {aiInterpretation && (
                <div className="mt-4 p-4 bg-slate-700/50 rounded-lg shadow">
                    <h4 className="text-lg font-medium text-amber-300 mb-2 flex items-center">
                        <SparklesIcon className="w-5 h-5 mr-2"/>
                        Interpretación de IA
                    </h4>
                    {isLoading && aiInterpretation === "Consultando IA para interpretación..." ? (
                         <div className="flex items-center justify-center py-3">
                            <svg className="animate-spin h-5 w-5 text-amber-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="text-slate-300">Consultando IA para interpretación...</span>
                        </div>
                    ) : (
                        <div className="prose prose-sm prose-invert max-w-none text-slate-200">
                             <SimpleMarkdown text={aiInterpretation} />
                        </div>
                    )}
                </div>
            )}

        </div>
      )}
    </div>
  );
};

export default ResultsSection;