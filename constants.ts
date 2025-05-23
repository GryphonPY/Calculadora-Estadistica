
import { CalculationMode, Formula, StatisticalConcept, SetOperationType, SubModeBasicProbability, CombinatoricsOperationType, SubModeSamplingDistribution, DataInputMethodType, FrequencyChartType, SubModeInference, SubModeConfidenceInterval, DescriptiveStatChartType, SimulatorDistributionType, DiscreteRVEntry } from './types';
import { ChartBarIcon } from './components/icons/ChartBarIcon'; 
import { ChartPieIcon } from './components/icons/ChartPieIcon'; 
import { BeakerIcon } from './components/icons/BeakerIcon';


export const DEFAULT_DESCRIPTIVE_INPUT = '10, 12, 15, 12, 18, 20, 15, 22, 12, 16, 19, 25';
export const DEFAULT_DESCRIPTIVE_SHOW_STEPS = false; // New default
export const DEFAULT_FREQUENCY_INPUT = '80, 82, 81, 78, 77, 82, 62, 67, 64, 63, 62, 62, 70, 71, 75, 73, 68, 69, 72, 79';
export const DEFAULT_BINOMIAL_N = '20';
export const DEFAULT_BINOMIAL_P = '0.3';
export const DEFAULT_BINOMIAL_X = '6'; 
export const DEFAULT_NORMAL_MEAN = '70';
export const DEFAULT_NORMAL_STD_DEV = '5';
export const DEFAULT_NORMAL_X1 = '65';
export const DEFAULT_NORMAL_X2 = '75';
export const DEFAULT_SELECTED_CONCEPT_ID = '';
export const DEFAULT_AI_TASK_QUERY = ''; 
export const DEFAULT_SET_INPUT_A = '1, 2, 3, 4, apple';
export const DEFAULT_SET_INPUT_B = '3, 4, 5, banana, apple';
export const DEFAULT_SET_OPERATION = SetOperationType.UNION;

export const DEFAULT_SUB_MODE_PROBABILITY = SubModeBasicProbability.COMBINATORICS;
export const DEFAULT_COMBINATORICS_N = '5';
export const DEFAULT_COMBINATORICS_R = '2';
export const DEFAULT_COMBINATORICS_OP = CombinatoricsOperationType.COMBINATIONS;
export const DEFAULT_PROB_BASIC_FAVORABLE = '3';
export const DEFAULT_PROB_BASIC_POSSIBLE = '10';
export const DEFAULT_PROB_COND_INTERSECTION_AB = '0.2';
export const DEFAULT_PROB_COND_PROB_B = '0.5';

export const DEFAULT_POISSON_LAMBDA = '5'; 
export const DEFAULT_POISSON_K = '3';    

export const DEFAULT_EXPONENTIAL_LAMBDA = '0.5'; 
export const DEFAULT_EXPONENTIAL_X = '2';     

export const DEFAULT_SUB_MODE_SAMPLING = SubModeSamplingDistribution.MEANS;
export const DEFAULT_POPULATION_MEAN = '100';
export const DEFAULT_POPULATION_STD_DEV = '15';
export const DEFAULT_SAMPLE_SIZE_MEANS = '30';
export const DEFAULT_SAMPLE_MEAN_XBAR = '105';
export const DEFAULT_POPULATION_PROPORTION = '0.6';
export const DEFAULT_SAMPLE_SIZE_PROPORTIONS = '50';
export const DEFAULT_SAMPLE_PROPORTION_PHAT = '0.65';

export const DEFAULT_DATA_INPUT_METHOD: DataInputMethodType = 'table'; 
export const DEFAULT_FREQUENCY_CHART_TYPE: FrequencyChartType = 'histogram'; 
export const DEFAULT_DESCRIPTIVE_STAT_CHART_TYPE: DescriptiveStatChartType = 'histogram'; // Only histogram remains

export const DEFAULT_SUB_MODE_INFERENCE = SubModeInference.CONFIDENCE_INTERVALS;
export const DEFAULT_SUB_MODE_CONFIDENCE_INTERVAL = SubModeConfidenceInterval.MEAN_SIGMA_KNOWN;
export const DEFAULT_CI_MEAN_SAMPLE_MEAN = '50';
export const DEFAULT_CI_MEAN_POPULATION_SIGMA = '5';
export const DEFAULT_CI_MEAN_SAMPLE_SIZE = '30';
export const DEFAULT_CI_CONFIDENCE_LEVEL = '95';

export const DEFAULT_SIMULATOR_DISTRIBUTION_TYPE = SimulatorDistributionType.UNIFORM;
export const DEFAULT_SIMULATOR_N_POINTS = '100';
export const DEFAULT_SIMULATOR_UNIFORM_MIN = '0';
export const DEFAULT_SIMULATOR_UNIFORM_MAX = '10';
export const DEFAULT_SIMULATOR_NORMAL_MEAN = '0';
export const DEFAULT_SIMULATOR_NORMAL_STD_DEV = '1';
export const DEFAULT_SIMULATOR_BINOMIAL_N = '10'; 
export const DEFAULT_SIMULATOR_BINOMIAL_P = '0.5'; 
export const DEFAULT_SIMULATOR_POISSON_LAMBDA = '3'; 

export const DEFAULT_DISCRETE_RV_INPUTS: DiscreteRVEntry[] = [
  { id: crypto.randomUUID(), x: '0', p: '0.1' },
  { id: crypto.randomUUID(), x: '1', p: '0.3' },
  { id: crypto.randomUUID(), x: '2', p: '0.4' },
  { id: crypto.randomUUID(), x: '3', p: '0.2' },
  { id: crypto.randomUUID(), x: '', p: '' },
];

export const DEFAULT_BAYES_PROB_A = '0.1';
export const DEFAULT_BAYES_PROB_B_GIVEN_A = '0.8';
export const DEFAULT_BAYES_PROB_B_GIVEN_NOT_A = '0.05';


export const CALCULATION_MODE_GROUPS = [
  {
    groupLabel: 'Asistencia y Aprendizaje con IA',
    options: [
      { value: CalculationMode.AI_TASK_ASSISTANT, label: 'Asistente IA para Tareas' },
      { value: CalculationMode.STATISTICAL_CONCEPTS, label: 'Conceptos Estadísticos (IA)' },
    ],
  },
  {
    groupLabel: 'Análisis Exploratorio y Descriptivo',
    options: [
      { value: CalculationMode.DESCRIPTIVE, label: 'Estadísticas Descriptivas' },
      { value: CalculationMode.FREQUENCY_DISTRIBUTION, label: 'Distribución de Frecuencias' },
    ],
  },
  {
    groupLabel: 'Probabilidad Fundamental y Distribuciones',
    options: [
      { value: CalculationMode.SET_OPERATIONS, label: 'Operaciones con Conjuntos' },
      { value: CalculationMode.BASIC_PROBABILITY_COMBINATORICS, label: 'Probabilidad y Combinatoria' },
      { value: CalculationMode.BAYES_THEOREM, label: 'Teorema de Bayes' },
      { value: CalculationMode.BINOMIAL, label: 'Distribución Binomial' },
      { value: CalculationMode.POISSON_DISTRIBUTION, label: 'Distribución de Poisson' },
      { value: CalculationMode.NORMAL, label: 'Distribución Normal' },
      { value: CalculationMode.EXPONENTIAL_DISTRIBUTION, label: 'Distribución Exponencial' },
      { value: CalculationMode.DISCRETE_RANDOM_VARIABLE, label: 'Análisis de Variable Aleatoria Discreta' },
      { value: CalculationMode.SAMPLING_DISTRIBUTIONS, label: 'Distribuciones Muestrales' },
    ],
  },
  {
    groupLabel: 'Inferencia Estadística',
    options: [
      { value: CalculationMode.INFERENCE, label: 'Intervalos de Confianza' }, 
    ],
  },
  {
    groupLabel: 'Herramientas y Simulación',
    options: [
      { value: CalculationMode.DATA_SIMULATOR, label: 'Simulador de Datos Aleatorios' },
    ],
  }
];

export const DEFAULT_SELECTED_CALCULATION_CATEGORY = CALCULATION_MODE_GROUPS[0].groupLabel; 
export const DEFAULT_CALCULATION_MODE = CALCULATION_MODE_GROUPS[0].options[0].value; 


export const DATA_INPUT_METHOD_OPTIONS: { value: DataInputMethodType; label: string; icon?: any }[] = [
  { value: 'table', label: 'Tabla Interactiva' },
  { value: 'text', label: 'Texto (Comas)' },
];

export const DESCRIPTIVE_STAT_CHART_TYPE_OPTIONS: { value: DescriptiveStatChartType; label: string; icon?: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { value: 'histogram', label: 'Histograma', icon: ChartBarIcon },
];

export const FREQUENCY_CHART_TYPE_OPTIONS: { value: FrequencyChartType; label: string; icon?: React.FC<React.SVGProps<SVGSVGElement>> }[] = [ 
  { value: 'histogram', label: 'Histograma y Polígono', icon: ChartBarIcon },
  { value: 'pie', label: 'Gráfico Circular', icon: ChartPieIcon },
];


export const SET_OPERATION_OPTIONS = [
  { value: SetOperationType.UNION, label: 'Unión (A ∪ B)' },
  { value: SetOperationType.INTERSECTION, label: 'Intersección (A ∩ B)' },
  { value: SetOperationType.DIFFERENCE_A_B, label: 'Diferencia (A - B)' },
  { value: SetOperationType.DIFFERENCE_B_A, label: 'Diferencia (B - A)' },
  { value: SetOperationType.SYMMETRIC_DIFFERENCE, label: 'Diferencia Simétrica (A Δ B)' },
];

export const SUB_MODE_PROBABILITY_OPTIONS = [
  { value: SubModeBasicProbability.COMBINATORICS, label: 'Combinatoria (nPr, nCr)' },
  { value: SubModeBasicProbability.BASIC_PROBABILITY, label: 'Probabilidad Básica' },
  { value: SubModeBasicProbability.CONDITIONAL_PROBABILITY, label: 'Probabilidad Condicional' },
];

export const COMBINATORICS_OPERATION_OPTIONS = [
  { value: CombinatoricsOperationType.PERMUTATIONS, label: 'Permutaciones (nPr)' },
  { value: CombinatoricsOperationType.COMBINATIONS, label: 'Combinaciones (nCr)' },
];

export const SUB_MODE_SAMPLING_DISTRIBUTION_OPTIONS = [
  { value: SubModeSamplingDistribution.MEANS, label: 'De Medias' },
  { value: SubModeSamplingDistribution.PROPORTIONS, label: 'De Proporciones' },
];

export const SUB_MODE_INFERENCE_OPTIONS = [
  { value: SubModeInference.CONFIDENCE_INTERVALS, label: 'Intervalos de Confianza' },
];

export const SUB_MODE_CONFIDENCE_INTERVAL_OPTIONS = [
  { value: SubModeConfidenceInterval.MEAN_SIGMA_KNOWN, label: 'Para la Media (σ Conocida)' },
];

export const CONFIDENCE_LEVEL_OPTIONS = [
  { value: '90', label: '90%' },
  { value: '95', label: '95%' },
  { value: '98', label: '98%' },
  { value: '99', label: '99%' },
];

export const SIMULATOR_DISTRIBUTION_OPTIONS = [ 
  { value: SimulatorDistributionType.UNIFORM, label: 'Uniforme (Continua)'},
  { value: SimulatorDistributionType.NORMAL, label: 'Normal (Gaussiana)'},
  { value: SimulatorDistributionType.BINOMIAL, label: 'Binomial (Discreta)'}, 
  { value: SimulatorDistributionType.POISSON, label: 'Poisson (Discreta)'}, 
];


export const STATISTICAL_CONCEPTS_TOPICS: StatisticalConcept[] = [
  { 
    id: 'stat_definition', 
    label: 'Definición de Estadística', 
    prompt: 'Explica el concepto de "Estadística" como disciplina. Describe brevemente sus principales ramas (descriptiva e inferencial). Dirige la explicación a un estudiante universitario, sé claro, conciso y usa un lenguaje accesible.' 
  },
  { 
    id: 'data_types', 
    label: 'Datos y Variables', 
    prompt: 'Explica qué son los "datos" y las "variables" en estadística. Describe la diferencia fundamental entre ellos y cómo se relacionan. Proporciona ejemplos sencillos. Dirige la explicación a un estudiante universitario.' 
  },
  { 
    id: 'qualitative_variables', 
    label: 'Variables Cualitativas', 
    prompt: 'Explica qué son las "variables cualitativas" (o categóricas) en estadística. Describe sus tipos (nominales y ordinales) con ejemplos claros para cada uno. Dirige la explicación a un estudiante universitario.' 
  },
  { 
    id: 'quantitative_variables', 
    label: 'Variables Cuantitativas', 
    prompt: 'Explica qué son las "variables cuantitativas" (o numéricas) en estadística. Describe sus tipos (discretas y continuas) con ejemplos claros para cada uno, destacando la diferencia en cómo se miden o cuentan. Dirige la explicación a un estudiante universitario.'
  },
  { 
    id: 'population', 
    label: 'Población en Estadística', 
    prompt: 'Define "población" en el contexto estadístico. Explica si siempre se refiere a personas y proporciona ejemplos de poblaciones finitas e infinitas. Dirige la explicación a un estudiante universitario de forma clara y concisa.' 
  },
  { 
    id: 'sample', 
    label: 'Muestra en Estadística', 
    prompt: 'Define "muestra" en el contexto estadístico. Explica por qué se utilizan muestras en lugar de poblaciones completas y la importancia de que una muestra sea representativa. Proporciona un ejemplo. Dirige la explicación a un estudiante universitario.' 
  },
  { 
    id: 'sampling', 
    label: 'Muestreo en Estadística', 
    prompt: 'Explica el concepto de "muestreo" en estadística. Describe brevemente su propósito y menciona al menos dos técnicas comunes de muestreo (ej. aleatorio simple, estratificado), explicando su idea básica. Dirige la explicación a un estudiante universitario.'
  },
];


export const HISTOGRAM_BUCKET_COUNT = 10;
export const NORMAL_PDF_POINTS_COUNT = 200;
export const POISSON_PMF_POINTS_COUNT_MAX = 40; 
export const EXPONENTIAL_PDF_POINTS_COUNT = 200;
export const SAMPLING_DISTRIBUTION_PDF_POINTS_COUNT = 200;

export const FORMULAS_COMBINATORICS_PERMUTATIONS: Formula[] = [ { label: "Permutaciones (nPr)", equation: "nPr = n! / (n-r)!" } ];
export const FORMULAS_COMBINATORICS_COMBINations: Formula[] = [ { label: "Combinaciones (nCr)", equation: "nCr = n! / (r! * (n-r)!)" } ];
export const FORMULAS_BASIC_PROBABILITY: Formula[] = [ { label: "Probabilidad Básica P(A)", equation: "P(A) = Casos Favorables / Casos Posibles" } ];
export const FORMULAS_CONDITIONAL_PROBABILITY: Formula[] = [ { label: "Probabilidad Condicional P(A|B)", equation: "P(A|B) = P(A ∩ B) / P(B)" } ];

export const FORMULAS_SAMPLING_MEANS: Formula[] = [
    { label: "Media de Medias Muestrales (μx̄)", equation: "μx̄ = μ" },
    { label: "Error Estándar de la Media (σx̄)", equation: "σx̄ = σ / √n" },
    { label: "Puntuación Z para x̄", equation: "Z = (x̄ - μ) / σx̄" },
    { label: "Teorema del Límite Central", equation: "Si n ≥ 30, la dist. muestral de x̄ se aproxima a Normal." },
];
export const FORMULAS_SAMPLING_PROPORTIONS: Formula[] = [
    { label: "Media de Proporciones Muestrales (μp̂)", equation: "μp̂ = p" },
    { label: "Error Estándar de la Proporción (σp̂)", equation: "σp̂ = √[p(1-p)/n]" },
    { label: "Puntuación Z para p̂", equation: "Z = (p̂ - p) / σp̂" },
    { label: "Condición de Aprox. Normal", equation: "np ≥ 10  y  n(1-p) ≥ 10" },
];

export const FORMULAS_CONFIDENCE_INTERVAL_MEAN_SIGMA_KNOWN: Formula[] = [
  { label: "Error Estándar (EE)", equation: "EE = σ / √n" },
  { label: "Margen de Error (ME)", equation: "ME = Z₍₁₋α/₂₎ * EE" }, 
  { label: "Intervalo de Confianza (IC)", equation: "IC = x̄ ± ME" },
  { label: "Límite Inferior (LI)", equation: "LI = x̄ - ME" },
  { label: "Límite Superior (LS)", equation: "LS = x̄ + ME" },
];

export const FORMULAS_DISCRETE_RV: Formula[] = [
  { label: "Valor Esperado E(X)", equation: "E(X) = Σ [x * P(X=x)]" },
  { label: "Varianza Var(X)", equation: "Var(X) = Σ [(x - E(X))² * P(X=x)]" },
  { label: "Varianza (Alternativa) Var(X)", equation: "Var(X) = E(X²) - [E(X)]²" },
  { label: "Desviación Estándar σ(X)", equation: "σ(X) = √Var(X)" },
];

export const FORMULAS_BAYES_THEOREM: Formula[] = [
  { label: "P(¬A)", equation: "1 - P(A)"},
  { label: "Ley de Probabilidad Total para P(B)", equation: "P(B) = P(B|A) * P(A) + P(B|¬A) * P(¬A)"},
  { label: "Teorema de Bayes para P(A|B)", equation: "P(A|B) = [P(B|A) * P(A)] / P(B)"},
];


export const FORMULAS: Record<string, Formula[]> = { 
  [CalculationMode.DESCRIPTIVE]: [
    { label: "Media (μ)", equation: "μ = Σx / N" },
    { label: "Varianza Muestral (s²)", equation: "s² = Σ(x - μ)² / (N - 1)" },
    { label: "Desv. Estándar Muestral (s)", equation: "s = √s²" },
    { label: "Q1", equation: "Percentil 25" },
    { label: "Mediana (Q2)", equation: "Percentil 50" },
    { label: "Q3", equation: "Percentil 75" },
    { label: "Rango Intercuartílico (IQR)", equation: "IQR = Q3 - Q1" },
  ],
  [CalculationMode.FREQUENCY_DISTRIBUTION]: [
    { label: "Número de Clases (Nc)", equation: "Nc ≈ 1 + 3.322 * log₁₀(N)" },
    { label: "Amplitud de Clase (A)", equation: "A ≈ R / Nc" },
  ],
  [CalculationMode.BINOMIAL]: [
    { label: "P(X=k)", equation: "C(n,k) * pᵏ * (1-p)ⁿ⁻ᵏ" },
    { label: "Media (μ)", equation: "μ = n * p" },
    { label: "Varianza (σ²)", equation: "σ² = n * p * (1-p)" },
  ],
  [CalculationMode.NORMAL]: [
    { label: "f(x)", equation: "(1/(σ√(2π))) * e^(-(x-μ)²/(2σ²))" },
    { label: "Z-score", equation: "Z = (x - μ) / σ" },
  ],
  [CalculationMode.POISSON_DISTRIBUTION]: [
    { label: "P(X=k)", equation: "(λᵏ * e⁻ˡ) / k!" },
    { label: "Media (μ)", equation: "μ = λ" },
    { label: "Varianza (σ²)", equation: "σ² = λ" },
  ],
  [CalculationMode.EXPONENTIAL_DISTRIBUTION]: [
    { label: "f(x)", equation: "λ * e^(-λx)  (para x ≥ 0)" },
    { label: "P(X ≤ x)", equation: "1 - e^(-λx)  (para x ≥ 0)" },
    { label: "Media (μ)", equation: "μ = 1/λ" },
    { label: "Varianza (σ²)", equation: "σ² = 1/λ²" },
  ],
  [CalculationMode.DISCRETE_RANDOM_VARIABLE]: FORMULAS_DISCRETE_RV,
  [CalculationMode.BAYES_THEOREM]: FORMULAS_BAYES_THEOREM,
  [CalculationMode.SAMPLING_DISTRIBUTIONS]: [], 
  [CalculationMode.STATISTICAL_CONCEPTS]: [],
  [CalculationMode.AI_TASK_ASSISTANT]: [], 
  [CalculationMode.SET_OPERATIONS]: [],
  [CalculationMode.BASIC_PROBABILITY_COMBINATORICS]: [], 
  [CalculationMode.DATA_SIMULATOR]: [], 
  [`${CalculationMode.INFERENCE}-${SubModeInference.CONFIDENCE_INTERVALS}-${SubModeConfidenceInterval.MEAN_SIGMA_KNOWN}`]: FORMULAS_CONFIDENCE_INTERVAL_MEAN_SIGMA_KNOWN,
};

export const PIE_CHART_COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', 
  '#82CA9D', '#FF7F50', '#FF69B4', '#40E0D0', '#DAA520',
  '#CD5C5C', '#BA55D3', '#7FFF00', '#6495ED', '#DC143C',
  '#FF6347', '#20B2AA', '#FFD700', '#ADFF2F', '#DB7093'
];
