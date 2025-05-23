
export enum CalculationMode {
  AI_TASK_ASSISTANT = 'Asistente IA para Tareas', 
  STATISTICAL_CONCEPTS = 'Conceptos Estadísticos (IA)',
  DESCRIPTIVE = 'Estadísticas Descriptivas',
  FREQUENCY_DISTRIBUTION = 'Distribución de Frecuencias',
  SET_OPERATIONS = 'Operaciones con Conjuntos',
  BASIC_PROBABILITY_COMBINATORICS = 'Probabilidad y Combinatoria',
  BINOMIAL = 'Distribución Binomial',
  POISSON_DISTRIBUTION = 'Distribución de Poisson',
  NORMAL = 'Distribución Normal',
  EXPONENTIAL_DISTRIBUTION = 'Distribución Exponencial',
  SAMPLING_DISTRIBUTIONS = 'Distribuciones Muestrales',
  INFERENCE = 'Inferencia Estadística',
  DATA_SIMULATOR = 'Simulador de Datos Aleatorios', 
  DISCRETE_RANDOM_VARIABLE = 'Análisis de Variable Aleatoria Discreta',
  BAYES_THEOREM = 'Teorema de Bayes',
}

export enum SetOperationType {
  UNION = 'UNION',
  INTERSECTION = 'INTERSECTION',
  DIFFERENCE_A_B = 'DIFFERENCE_A_B', 
  DIFFERENCE_B_A = 'DIFFERENCE_B_A', 
  SYMMETRIC_DIFFERENCE = 'SYMMETRIC_DIFFERENCE', 
}

export enum SubModeBasicProbability {
  COMBINATORICS = 'COMBINATORICS',
  BASIC_PROBABILITY = 'BASIC_PROBABILITY',
  CONDITIONAL_PROBABILITY = 'CONDITIONAL_PROBABILITY',
}

export enum CombinatoricsOperationType {
  PERMUTATIONS = 'PERMUTATIONS', 
  COMBINATIONS = 'COMBINATIONS', 
}

export enum SubModeSamplingDistribution {
  MEANS = 'MEANS',
  PROPORTIONS = 'PROPORTIONS',
}

export enum SubModeInference {
  CONFIDENCE_INTERVALS = 'CONFIDENCE_INTERVALS',
  // HYPOTHESIS_TESTING = 'HYPOTHESIS_TESTING', 
}

export enum SubModeConfidenceInterval {
  MEAN_SIGMA_KNOWN = 'MEAN_SIGMA_KNOWN',
  // MEAN_SIGMA_UNKNOWN = 'MEAN_SIGMA_UNKNOWN', 
  // PROPORTION = 'PROPORTION', 
}

export type DataInputMethodType = 'table' | 'text';
export type FrequencyChartType = 'histogram' | 'pie'; 
export type DescriptiveStatChartType = 'histogram'; // Removed 'boxplot'


export enum SimulatorDistributionType { 
  UNIFORM = 'UNIFORM',
  NORMAL = 'NORMAL',
  BINOMIAL = 'BINOMIAL', 
  POISSON = 'POISSON', 
}

export interface DiscreteRVEntry {
  id: string;
  x: string; // Value of the random variable
  p: string; // Probability of that value
}

export interface BayesTheoremInput {
  probA: number;
  probBGivenA: number;
  probBGivenNotA: number;
}

export interface AppState {
  selectedCalculationCategory: string; // New state for the main category
  calculationMode: CalculationMode;
  descriptiveInput: string;
  descriptiveShowSteps: boolean; // New state for showing steps
  binomialN: string;
  binomialP: string;
  binomialX: string;
  normalMean: string;
  normalStdDev: string;
  normalX1: string;
  normalX2: string;
  frequencyInput: string;
  selectedConceptId: string;
  setInputA: string;
  setInputB: string;
  selectedSetOperation: SetOperationType;
  
  selectedSubModeProbability: SubModeBasicProbability;
  combinatoricsN: string;
  combinatoricsR: string;
  selectedCombinatoricsOp: CombinatoricsOperationType;
  probBasicFavorable: string;
  probBasicPossible: string;
  probCondIntersectionAB: string;
  probCondProbB: string;

  poissonLambda: string;
  poissonK: string;

  exponentialLambda: string;
  exponentialX: string;

  selectedSubModeSampling: SubModeSamplingDistribution;
  populationMean: string; 
  populationStdDev: string; 
  sampleSizeMeans: string; 
  sampleMeanXBar: string; 
  populationProportion: string; 
  sampleSizeProportions: string; 
  sampleProportionPHat: string; 

  aiTaskQuery: string; 

  dataInputMethod: DataInputMethodType;
  frequencyChartType: FrequencyChartType; 
  descriptiveStatChartType: DescriptiveStatChartType; 

  selectedSubModeInference: SubModeInference;
  selectedSubModeConfidenceInterval: SubModeConfidenceInterval;
  ciMeanSampleMean: string;       
  ciMeanPopulationSigma: string;  
  ciMeanSampleSize: string;       
  ciMeanConfidenceLevel: string;  

  simulatorDistributionType: SimulatorDistributionType;
  simulatorNPoints: string;
  simulatorUniformMin: string;
  simulatorUniformMax: string;
  simulatorNormalMean: string;
  simulatorNormalStdDev: string;
  simulatorBinomialN: string; // New for Binomial
  simulatorBinomialP: string; // New for Binomial
  simulatorPoissonLambda: string; // New for Poisson
  
  discreteRVInputs: DiscreteRVEntry[];

  bayesProbA: string;
  bayesProbBGivenA: string;
  bayesProbBGivenNotA: string;

  aiInterpretation: string | null; 

  results: CalculationResults | null;
  error: string | null;
  isLoading: boolean;
}

export interface DescriptiveStatsInput {
  numbers: number[];
  includeSteps?: boolean; // Optional flag
}

// Step-by-step calculation details
export interface MeanCalculationSteps {
  sum: number;
  count: number;
  equation: string; 
}

export interface MedianCalculationSteps {
  sortedData: number[];
  count: number;
  isEven: boolean;
  middleIndices?: [number, number]; 
  middleValue?: number;          
  calculatedMedian?: number;     
}

export interface VarianceCalculationStepItem {
  x: number;
  deviation: number; 
  squaredDeviation: number; 
}

export interface VarianceCalculationSteps {
  mean: number;
  items: VarianceCalculationStepItem[];
  sumSquaredDeviations: number;
  count: number;
  equation: string; 
}

export interface StdDevCalculationSteps {
  variance: number;
  equation: string; 
}


export interface DescriptiveStatsResultsContent {
  mean: number;
  median: number;
  mode: number[];
  variance: number;
  stdDev: number;
  count: number;
  min: number;
  max: number;
  range: number;
  sum: number;
  q1: number;
  q3: number;
  iqr: number;
  histogramData: ChartDataPoint[];
  meanSteps?: MeanCalculationSteps;
  medianSteps?: MedianCalculationSteps;
  varianceSteps?: VarianceCalculationSteps;
  stdDevSteps?: StdDevCalculationSteps;
}

export interface DescriptiveStatsResults {
  type: CalculationMode.DESCRIPTIVE;
  data: DescriptiveStatsResultsContent;
}

export interface BinomialInput {
  n: number;
  p: number;
  x?: number;
}

export interface BinomialResultsContent {
  mean: number;
  variance: number;
  stdDev: number;
  pmfData: ChartDataPoint[]; 
  exactProbability?: number; 
  lessThanOrEqualProbability?: number; 
  greaterThanOrEqualProbability?: number; 
}
export interface BinomialResults {
  type: CalculationMode.BINOMIAL;
  data: BinomialResultsContent;
}

export interface NormalInput {
  mean: number;
  stdDev: number;
  x1?: number;
  x2?: number;
}

export interface NormalResultsContent {
  pdfData: ChartDataPoint[];
  probabilityLessThanX1?: number;
  probabilityGreaterThanX1?: number;
  probabilityBetweenX1X2?: number;
  zScoreX1?: number;
}

export interface NormalResults {
  type: CalculationMode.NORMAL;
  data: NormalResultsContent;
}

export interface FrequencyDistributionInput {
    numbers: number[];
}

export interface FrequencyDistributionClass {
    intervalLabel: string; 
    classMark: number;     
    absoluteFrequency: number;
    relativeFrequency: number;
    accumulatedFrequency: number;
}

export interface FrequencyDistributionResultsContent {
    vMin: number;
    vMax: number;
    range: number;
    n: number; 
    numClasses: number;
    classWidth: number;
    classes: FrequencyDistributionClass[];
    combinedChartData: ChartDataPoint[]; 
}

export interface FrequencyDistributionResults {
    type: CalculationMode.FREQUENCY_DISTRIBUTION;
    data: FrequencyDistributionResultsContent;
}

export interface StatisticalConcept {
  id: string;
  label: string;
  prompt: string; 
}

export interface ConceptualExplanationResultContent {
  topicLabel: string;
  explanation: string;
}

export interface ConceptualExplanationResults {
  type: CalculationMode.STATISTICAL_CONCEPTS;
  data: ConceptualExplanationResultContent;
}

export interface AITaskAssistantResultContent {
  userQuery: string;
  guidance: string;
}

export interface AITaskAssistantResults {
  type: CalculationMode.AI_TASK_ASSISTANT;
  data: AITaskAssistantResultContent;
}


export interface SetOperationsInput {
  setA: string[];
  setB: string[];
  operation: SetOperationType;
}

export interface SetOperationsResultsContent {
  operation: SetOperationType;
  setA: string[];
  setB: string[];
  resultSet: string[];
  elementsOnlyInA: string[];
  elementsOnlyInB: string[];
  intersection: string[];
  countA: number;
  countB: number;
  countResultSet: number;
  countOnlyInA: number;
  countOnlyInB: number;
  countIntersection: number;
}

export interface SetOperationsResults {
  type: CalculationMode.SET_OPERATIONS;
  data: SetOperationsResultsContent;
}

export interface CombinatoricsInputData {
  n: number;
  r: number;
  operation: CombinatoricsOperationType;
}
export interface CombinatoricsResultData {
  n: number;
  r: number;
  operationType: CombinatoricsOperationType;
  result: number;
}

export interface BasicProbabilityInputData {
  favorable: number;
  possible: number;
}
export interface BasicProbabilityResultData {
  favorable: number;
  possible: number;
  probability: number;
}

export interface ConditionalProbabilityInputData {
  probIntersectionAB: number;
  probB: number;
}
export interface ConditionalProbabilityResultData {
  probIntersectionAB: number;
  probB: number;
  conditionalProbability: number;
}

export interface BasicProbabilityCombinatoricsResultsData {
  subMode: SubModeBasicProbability;
  inputs: { 
    n?: number;
    r?: number;
    combinatoricsOp?: CombinatoricsOperationType;
    favorable?: number;
    possible?: number;
    probIntersectionAB?: number;
    probB?: number;
  };
  output: CombinatoricsResultData | BasicProbabilityResultData | ConditionalProbabilityResultData;
}

export interface BasicProbabilityCombinatoricsResults {
  type: CalculationMode.BASIC_PROBABILITY_COMBINATORICS;
  data: BasicProbabilityCombinatoricsResultsData;
}

export interface PoissonInput {
  lambda: number;
  k?: number; 
}

export interface PoissonResultsContent {
  mean: number;       
  variance: number;   
  stdDev: number;     
  pmfData: ChartDataPoint[]; 
  exactProbability?: number; 
  lessThanOrEqualProbability?: number; 
  greaterThanProbability?: number; 
}

export interface PoissonResults {
  type: CalculationMode.POISSON_DISTRIBUTION;
  data: PoissonResultsContent;
}

export interface ExponentialInput {
  lambda: number; 
  x?: number;    
}

export interface ExponentialResultsContent {
  mean: number;       
  variance: number;   
  stdDev: number;     
  pdfData: ChartDataPoint[]; 
  fx?: number;        
  probLessThanOrEqualX?: number; 
  probGreaterThanX?: number;    
}

export interface ExponentialResults {
  type: CalculationMode.EXPONENTIAL_DISTRIBUTION;
  data: ExponentialResultsContent;
}

export interface SamplingMeansInput {
  populationMean: number;
  populationStdDev: number;
  sampleSize: number;
  sampleMeanXBar?: number; 
}

export interface SamplingMeansResultsContent {
  distMean: number; 
  stdError: number; 
  sampleSize: number;
  populationMean: number;
  populationStdDev: number;
  sampleMeanXBar?: number;
  zScore?: number;
  probLessThanXBar?: number;
  probGreaterThanXBar?: number;
  isTLCApplied: boolean; 
  pdfData: ChartDataPoint[];
}

export interface SamplingProportionsInput {
  populationProportion: number; 
  sampleSize: number; 
  sampleProportionPHat?: number; 
}

export interface SamplingProportionsResultsContent {
  distMean: number; 
  stdError: number; 
  sampleSize: number;
  populationProportion: number;
  sampleProportionPHat?: number;
  zScore?: number;
  probLessThanPHat?: number;
  probGreaterThanPHat?: number;
  meetsNormalApproximation: boolean; 
  npValue: number;
  n1pValue: number;
  pdfData: ChartDataPoint[];
}

export interface SamplingDistributionResultsData {
  subMode: SubModeSamplingDistribution;
  content: SamplingMeansResultsContent | SamplingProportionsResultsContent;
}

export interface SamplingDistributionResults {
  type: CalculationMode.SAMPLING_DISTRIBUTIONS;
  data: SamplingDistributionResultsData;
}

export interface ConfidenceIntervalMeanSigmaKnownInput {
  sampleMean: number;
  populationSigma: number;
  sampleSize: number;
  confidenceLevel: number; 
}

export interface ConfidenceIntervalMeanSigmaKnownResultContent {
  sampleMean: number;
  populationSigma: number;
  sampleSize: number;
  confidenceLevel: number;
  zCritical: number;
  standardError: number;
  marginOfError: number;
  lowerBound: number;
  upperBound: number;
  interpretation: string;
}

export interface ConfidenceIntervalResultsData {
  subModeInference: SubModeInference;
  subModeConfidenceInterval: SubModeConfidenceInterval;
  content: ConfidenceIntervalMeanSigmaKnownResultContent; 
}

export interface ConfidenceIntervalResults {
  type: CalculationMode.INFERENCE;
  data: ConfidenceIntervalResultsData;
}

export interface DataSimulatorInput {
  distributionType: SimulatorDistributionType;
  nPoints: number;
  uniformMin?: number;
  uniformMax?: number;
  normalMean?: number;
  normalStdDev?: number;
  binomialN?: number; // New for Binomial
  binomialP?: number; // New for Binomial
  poissonLambda?: number; // New for Poisson
}

export interface DataSimulatorResultContent {
  distributionType: SimulatorDistributionType;
  parameters: DataSimulatorInput; 
  generatedData: number[];
  summaryStats?: DescriptiveStatsResultsContent; 
}

export interface DataSimulatorResults {
  type: CalculationMode.DATA_SIMULATOR;
  data: DataSimulatorResultContent;
}

export interface DiscreteRVResultsContent {
  mean: number; // E(X)
  variance: number; // Var(X)
  stdDev: number; // σ(X)
  summaryTable: Array<{ x: number; p: number }>;
}

export interface DiscreteRVResults {
  type: CalculationMode.DISCRETE_RANDOM_VARIABLE;
  data: DiscreteRVResultsContent;
}

export interface BayesTheoremResultsContent {
  probA: number;
  probBGivenA: number;
  probBGivenNotA: number;
  probNotA: number;
  probB: number;
  probAGivenB: number;
}

export interface BayesTheoremResults {
  type: CalculationMode.BAYES_THEOREM;
  data: BayesTheoremResultsContent;
}


export type CalculationResults = 
  | DescriptiveStatsResults 
  | BinomialResults 
  | NormalResults 
  | FrequencyDistributionResults
  | ConceptualExplanationResults
  | SetOperationsResults
  | BasicProbabilityCombinatoricsResults
  | PoissonResults
  | ExponentialResults
  | SamplingDistributionResults
  | AITaskAssistantResults
  | ConfidenceIntervalResults
  | DataSimulatorResults
  | DiscreteRVResults
  | BayesTheoremResults; 

export type ChartDataPoint = {
  name: string | number; 
  value: number;         
  polygonValue?: number;  
  intervalLabel?: string; 
  classMark?: string | number; 
  [key: string]: any;    
};


export interface Formula {
  label: string;
  equation: string;
}

export type TableRowData = {
  id: string;
  value: string;
};
