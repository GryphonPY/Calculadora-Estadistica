
import React, { useState, useCallback, useEffect } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { 
  CalculationMode, AppState, CalculationResults, SetOperationType, 
  SubModeBasicProbability, CombinatoricsOperationType, 
  SubModeSamplingDistribution, DataInputMethodType, FrequencyChartType, 
  SubModeInference, SubModeConfidenceInterval, 
  ConfidenceIntervalMeanSigmaKnownInput,
  DescriptiveStatChartType, 
  SimulatorDistributionType, DataSimulatorInput, 
  ConfidenceIntervalResults, 
  DescriptiveStatsResults,
  DiscreteRVEntry,
  DiscreteRVResults,
  BayesTheoremInput
} from './types';
import { 
  CALCULATION_MODE_GROUPS, 
  DEFAULT_SELECTED_CALCULATION_CATEGORY, // New
  DEFAULT_CALCULATION_MODE, // Updated
  DEFAULT_DESCRIPTIVE_INPUT, 
  DEFAULT_DESCRIPTIVE_SHOW_STEPS,
  DEFAULT_FREQUENCY_INPUT, 
  DEFAULT_BINOMIAL_N, 
  DEFAULT_BINOMIAL_P, 
  DEFAULT_BINOMIAL_X, 
  DEFAULT_NORMAL_MEAN, 
  DEFAULT_NORMAL_STD_DEV, 
  DEFAULT_NORMAL_X1, 
  DEFAULT_NORMAL_X2,
  DEFAULT_SELECTED_CONCEPT_ID,
  STATISTICAL_CONCEPTS_TOPICS,
  DEFAULT_SET_INPUT_A,
  DEFAULT_SET_INPUT_B,
  DEFAULT_SET_OPERATION,
  DEFAULT_SUB_MODE_PROBABILITY,
  DEFAULT_COMBINATORICS_N,
  DEFAULT_COMBINATORICS_R,
  DEFAULT_COMBINATORICS_OP,
  DEFAULT_PROB_BASIC_FAVORABLE,
  DEFAULT_PROB_BASIC_POSSIBLE,
  DEFAULT_PROB_COND_INTERSECTION_AB,
  DEFAULT_PROB_COND_PROB_B,
  DEFAULT_POISSON_LAMBDA,
  DEFAULT_POISSON_K,
  DEFAULT_EXPONENTIAL_LAMBDA,
  DEFAULT_EXPONENTIAL_X,
  DEFAULT_SUB_MODE_SAMPLING, 
  DEFAULT_POPULATION_MEAN, 
  DEFAULT_POPULATION_STD_DEV, 
  DEFAULT_SAMPLE_SIZE_MEANS, 
  DEFAULT_SAMPLE_MEAN_XBAR, 
  DEFAULT_POPULATION_PROPORTION, 
  DEFAULT_SAMPLE_SIZE_PROPORTIONS, 
  DEFAULT_SAMPLE_PROPORTION_PHAT,
  DEFAULT_AI_TASK_QUERY,
  DEFAULT_DATA_INPUT_METHOD,
  DEFAULT_FREQUENCY_CHART_TYPE,
  DEFAULT_SUB_MODE_INFERENCE, 
  DEFAULT_SUB_MODE_CONFIDENCE_INTERVAL, 
  DEFAULT_CI_MEAN_SAMPLE_MEAN, 
  DEFAULT_CI_MEAN_POPULATION_SIGMA, 
  DEFAULT_CI_MEAN_SAMPLE_SIZE, 
  DEFAULT_CI_CONFIDENCE_LEVEL,
  DEFAULT_DESCRIPTIVE_STAT_CHART_TYPE, 
  DEFAULT_SIMULATOR_DISTRIBUTION_TYPE, 
  DEFAULT_SIMULATOR_N_POINTS, 
  DEFAULT_SIMULATOR_UNIFORM_MIN, 
  DEFAULT_SIMULATOR_UNIFORM_MAX, 
  DEFAULT_SIMULATOR_NORMAL_MEAN, 
  DEFAULT_SIMULATOR_NORMAL_STD_DEV,
  DEFAULT_SIMULATOR_BINOMIAL_N, 
  DEFAULT_SIMULATOR_BINOMIAL_P, 
  DEFAULT_SIMULATOR_POISSON_LAMBDA, 
  DEFAULT_DISCRETE_RV_INPUTS,
  DEFAULT_BAYES_PROB_A,
  DEFAULT_BAYES_PROB_B_GIVEN_A,
  DEFAULT_BAYES_PROB_B_GIVEN_NOT_A
} from './constants';
import InputSection from './components/InputSection';
import ResultsSection from './components/ResultsSection';
import { StatService } from './services/StatService';
import { CalculatorIcon } from './components/icons/CalculatorIcon';

// Initialize Gemini AI Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
const GEMINI_MODEL = 'gemini-2.5-flash-preview-04-17';

export const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    selectedCalculationCategory: DEFAULT_SELECTED_CALCULATION_CATEGORY,
    calculationMode: DEFAULT_CALCULATION_MODE, 
    descriptiveInput: DEFAULT_DESCRIPTIVE_INPUT,
    descriptiveShowSteps: DEFAULT_DESCRIPTIVE_SHOW_STEPS,
    frequencyInput: DEFAULT_FREQUENCY_INPUT,
    binomialN: DEFAULT_BINOMIAL_N,
    binomialP: DEFAULT_BINOMIAL_P,
    binomialX: DEFAULT_BINOMIAL_X,
    normalMean: DEFAULT_NORMAL_MEAN,
    normalStdDev: DEFAULT_NORMAL_STD_DEV,
    normalX1: DEFAULT_NORMAL_X1,
    normalX2: DEFAULT_NORMAL_X2,
    selectedConceptId: DEFAULT_SELECTED_CONCEPT_ID,
    aiTaskQuery: DEFAULT_AI_TASK_QUERY, 
    setInputA: DEFAULT_SET_INPUT_A,
    setInputB: DEFAULT_SET_INPUT_B,
    selectedSetOperation: DEFAULT_SET_OPERATION,
    selectedSubModeProbability: DEFAULT_SUB_MODE_PROBABILITY,
    combinatoricsN: DEFAULT_COMBINATORICS_N,
    combinatoricsR: DEFAULT_COMBINATORICS_R,
    selectedCombinatoricsOp: DEFAULT_COMBINATORICS_OP,
    probBasicFavorable: DEFAULT_PROB_BASIC_FAVORABLE,
    probBasicPossible: DEFAULT_PROB_BASIC_POSSIBLE,
    probCondIntersectionAB: DEFAULT_PROB_COND_INTERSECTION_AB,
    probCondProbB: DEFAULT_PROB_COND_PROB_B,
    poissonLambda: DEFAULT_POISSON_LAMBDA,
    poissonK: DEFAULT_POISSON_K,
    exponentialLambda: DEFAULT_EXPONENTIAL_LAMBDA,
    exponentialX: DEFAULT_EXPONENTIAL_X,
    selectedSubModeSampling: DEFAULT_SUB_MODE_SAMPLING,
    populationMean: DEFAULT_POPULATION_MEAN,
    populationStdDev: DEFAULT_POPULATION_STD_DEV,
    sampleSizeMeans: DEFAULT_SAMPLE_SIZE_MEANS,
    sampleMeanXBar: DEFAULT_SAMPLE_MEAN_XBAR,
    populationProportion: DEFAULT_POPULATION_PROPORTION,
    sampleSizeProportions: DEFAULT_SAMPLE_SIZE_PROPORTIONS,
    sampleProportionPHat: DEFAULT_SAMPLE_PROPORTION_PHAT,
    dataInputMethod: DEFAULT_DATA_INPUT_METHOD,
    frequencyChartType: DEFAULT_FREQUENCY_CHART_TYPE,
    descriptiveStatChartType: DEFAULT_DESCRIPTIVE_STAT_CHART_TYPE,
    
    selectedSubModeInference: DEFAULT_SUB_MODE_INFERENCE,
    selectedSubModeConfidenceInterval: DEFAULT_SUB_MODE_CONFIDENCE_INTERVAL,
    ciMeanSampleMean: DEFAULT_CI_MEAN_SAMPLE_MEAN,
    ciMeanPopulationSigma: DEFAULT_CI_MEAN_POPULATION_SIGMA,
    ciMeanSampleSize: DEFAULT_CI_MEAN_SAMPLE_SIZE,
    ciMeanConfidenceLevel: DEFAULT_CI_CONFIDENCE_LEVEL,

    simulatorDistributionType: DEFAULT_SIMULATOR_DISTRIBUTION_TYPE,
    simulatorNPoints: DEFAULT_SIMULATOR_N_POINTS,
    simulatorUniformMin: DEFAULT_SIMULATOR_UNIFORM_MIN,
    simulatorUniformMax: DEFAULT_SIMULATOR_UNIFORM_MAX,
    simulatorNormalMean: DEFAULT_SIMULATOR_NORMAL_MEAN,
    simulatorNormalStdDev: DEFAULT_SIMULATOR_NORMAL_STD_DEV,
    simulatorBinomialN: DEFAULT_SIMULATOR_BINOMIAL_N, 
    simulatorBinomialP: DEFAULT_SIMULATOR_BINOMIAL_P, 
    simulatorPoissonLambda: DEFAULT_SIMULATOR_POISSON_LAMBDA, 

    discreteRVInputs: DEFAULT_DISCRETE_RV_INPUTS,

    bayesProbA: DEFAULT_BAYES_PROB_A,
    bayesProbBGivenA: DEFAULT_BAYES_PROB_B_GIVEN_A,
    bayesProbBGivenNotA: DEFAULT_BAYES_PROB_B_GIVEN_NOT_A,

    aiInterpretation: null, 
    results: null,
    error: null,
    isLoading: false,
  });

  const handleDiscreteRVInputsChange = useCallback((newInputs: DiscreteRVEntry[]) => {
    setAppState(prev => ({ ...prev, discreteRVInputs: newInputs, error: null, results: null, aiInterpretation: null }));
  }, []);

  const handleInputChange = useCallback((field: keyof AppState, value: string | SetOperationType | SubModeBasicProbability | CombinatoricsOperationType | SubModeSamplingDistribution | DataInputMethodType | FrequencyChartType | SubModeInference | SubModeConfidenceInterval | DescriptiveStatChartType | SimulatorDistributionType | boolean) => {
    setAppState(prev => ({ ...prev, [field]: value, error: null, results: prev.calculationMode === CalculationMode.AI_TASK_ASSISTANT || prev.calculationMode === CalculationMode.STATISTICAL_CONCEPTS ? prev.results : null, aiInterpretation: null }));
  }, []);
  
  const resetSpecificInputsForMode = (mode: CalculationMode, currentAppState: AppState): Partial<AppState> => {
    const newInputs: Partial<AppState> = { results: null, error: null, aiInterpretation: null };
      switch(mode) {
        case CalculationMode.DESCRIPTIVE:
          return { ...newInputs, descriptiveInput: DEFAULT_DESCRIPTIVE_INPUT, dataInputMethod: DEFAULT_DATA_INPUT_METHOD, descriptiveStatChartType: DEFAULT_DESCRIPTIVE_STAT_CHART_TYPE, descriptiveShowSteps: DEFAULT_DESCRIPTIVE_SHOW_STEPS };
        case CalculationMode.FREQUENCY_DISTRIBUTION:
          return { ...newInputs, frequencyInput: DEFAULT_FREQUENCY_INPUT, dataInputMethod: DEFAULT_DATA_INPUT_METHOD, frequencyChartType: DEFAULT_FREQUENCY_CHART_TYPE };
        case CalculationMode.BINOMIAL:
          return { ...newInputs, binomialN: DEFAULT_BINOMIAL_N, binomialP: DEFAULT_BINOMIAL_P, binomialX: DEFAULT_BINOMIAL_X };
        case CalculationMode.NORMAL:
          return { ...newInputs, normalMean: DEFAULT_NORMAL_MEAN, normalStdDev: DEFAULT_NORMAL_STD_DEV, normalX1: DEFAULT_NORMAL_X1, normalX2: DEFAULT_NORMAL_X2 };
        case CalculationMode.STATISTICAL_CONCEPTS:
          return { ...newInputs, selectedConceptId: DEFAULT_SELECTED_CONCEPT_ID };
        case CalculationMode.AI_TASK_ASSISTANT: 
          return { ...newInputs, aiTaskQuery: DEFAULT_AI_TASK_QUERY };
        case CalculationMode.SET_OPERATIONS:
          return { ...newInputs, setInputA: DEFAULT_SET_INPUT_A, setInputB: DEFAULT_SET_INPUT_B, selectedSetOperation: DEFAULT_SET_OPERATION };
        case CalculationMode.BASIC_PROBABILITY_COMBINATORICS:
          return {
            ...newInputs,
            selectedSubModeProbability: DEFAULT_SUB_MODE_PROBABILITY,
            combinatoricsN: DEFAULT_COMBINATORICS_N,
            combinatoricsR: DEFAULT_COMBINATORICS_R,
            selectedCombinatoricsOp: DEFAULT_COMBINATORICS_OP,
            probBasicFavorable: DEFAULT_PROB_BASIC_FAVORABLE,
            probBasicPossible: DEFAULT_PROB_BASIC_POSSIBLE,
            probCondIntersectionAB: DEFAULT_PROB_COND_INTERSECTION_AB,
            probCondProbB: DEFAULT_PROB_COND_PROB_B,
          };
        case CalculationMode.POISSON_DISTRIBUTION:
          return { ...newInputs, poissonLambda: DEFAULT_POISSON_LAMBDA, poissonK: DEFAULT_POISSON_K };
        case CalculationMode.EXPONENTIAL_DISTRIBUTION:
          return { ...newInputs, exponentialLambda: DEFAULT_EXPONENTIAL_LAMBDA, exponentialX: DEFAULT_EXPONENTIAL_X };
        case CalculationMode.SAMPLING_DISTRIBUTIONS: 
          return {
            ...newInputs,
            selectedSubModeSampling: DEFAULT_SUB_MODE_SAMPLING,
            populationMean: DEFAULT_POPULATION_MEAN,
            populationStdDev: DEFAULT_POPULATION_STD_DEV,
            sampleSizeMeans: DEFAULT_SAMPLE_SIZE_MEANS,
            sampleMeanXBar: DEFAULT_SAMPLE_MEAN_XBAR,
            populationProportion: DEFAULT_POPULATION_PROPORTION,
            sampleSizeProportions: DEFAULT_SAMPLE_SIZE_PROPORTIONS,
            sampleProportionPHat: DEFAULT_SAMPLE_PROPORTION_PHAT,
          };
        case CalculationMode.INFERENCE: 
          return {
            ...newInputs,
            selectedSubModeInference: DEFAULT_SUB_MODE_INFERENCE,
            selectedSubModeConfidenceInterval: DEFAULT_SUB_MODE_CONFIDENCE_INTERVAL,
            ciMeanSampleMean: DEFAULT_CI_MEAN_SAMPLE_MEAN,
            ciMeanPopulationSigma: DEFAULT_CI_MEAN_POPULATION_SIGMA,
            ciMeanSampleSize: DEFAULT_CI_MEAN_SAMPLE_SIZE,
            ciMeanConfidenceLevel: DEFAULT_CI_CONFIDENCE_LEVEL,
          };
        case CalculationMode.DATA_SIMULATOR: 
          return {
            ...newInputs,
            simulatorDistributionType: DEFAULT_SIMULATOR_DISTRIBUTION_TYPE,
            simulatorNPoints: DEFAULT_SIMULATOR_N_POINTS,
            simulatorUniformMin: DEFAULT_SIMULATOR_UNIFORM_MIN,
            simulatorUniformMax: DEFAULT_SIMULATOR_UNIFORM_MAX,
            simulatorNormalMean: DEFAULT_SIMULATOR_NORMAL_MEAN,
            simulatorNormalStdDev: DEFAULT_SIMULATOR_NORMAL_STD_DEV,
            simulatorBinomialN: DEFAULT_SIMULATOR_BINOMIAL_N, 
            simulatorBinomialP: DEFAULT_SIMULATOR_BINOMIAL_P, 
            simulatorPoissonLambda: DEFAULT_SIMULATOR_POISSON_LAMBDA, 
          };
        case CalculationMode.DISCRETE_RANDOM_VARIABLE:
          return { ...newInputs, discreteRVInputs: DEFAULT_DISCRETE_RV_INPUTS };
        case CalculationMode.BAYES_THEOREM:
          return { ...newInputs, bayesProbA: DEFAULT_BAYES_PROB_A, bayesProbBGivenA: DEFAULT_BAYES_PROB_B_GIVEN_A, bayesProbBGivenNotA: DEFAULT_BAYES_PROB_B_GIVEN_NOT_A };
      }
      return newInputs; // Should not be reached if all modes are covered
  };

  const handleCategoryChange = useCallback((categoryLabel: string) => {
    const category = CALCULATION_MODE_GROUPS.find(g => g.groupLabel === categoryLabel);
    if (category && category.options.length > 0) {
      const firstModeInNewCategory = category.options[0].value;
      setAppState(prev => ({
        ...prev,
        selectedCalculationCategory: categoryLabel,
        calculationMode: firstModeInNewCategory,
        ...resetSpecificInputsForMode(firstModeInNewCategory, prev)
      }));
    }
  }, []);

  const handleModeChange = useCallback((mode: CalculationMode) => { // This now handles the specific tool/mode change
    setAppState(prev => ({ 
      ...prev, 
      calculationMode: mode, 
      ...resetSpecificInputsForMode(mode, prev)
    }));
  }, []);
  
  const resetInputs = useCallback(() => {
    setAppState(prev => ({
       ...prev, 
       ...resetSpecificInputsForMode(prev.calculationMode, prev) 
      }));
  }, []);

  const getAITaskAssistantSystemPrompt = () => {
    return `
Eres un 'Asistente de Tareas para la Calculadora Estadística'. Tu ÚNICA función es ayudar a los usuarios a entender qué modo de la calculadora deben usar para SU tarea específica y qué datos principales necesitan ingresar.

La calculadora tiene los siguientes GRUPOS DE MODOS y opciones específicas:

1.  **Análisis Exploratorio y Descriptivo**:
    *   'Estadísticas Descriptivas': Para calcular media, mediana, moda, varianza, desviación estándar, Q1, Q3, IQR, etc., de un conjunto de números. Muestra un histograma y opcionalmente los pasos de cálculo. Necesita: una lista de números.
    *   'Distribución de Frecuencias': Para agrupar datos en clases, calcular frecuencias (absoluta, relativa, acumulada), marcas de clase, y ver un histograma/polígono o gráfico circular. Necesita: una lista de números.

2.  **Probabilidad Fundamental y Distribuciones**:
    *   'Operaciones con Conjuntos': Para unión, intersección, diferencia, etc., entre dos conjuntos. Necesita: dos listas de elementos para los conjuntos A y B.
    *   'Probabilidad y Combinatoria':
        *   'Combinatoria': Para permutaciones (nPr) o combinaciones (nCr). Necesita: n (total) y r (a elegir/ordenar).
        *   'Probabilidad Básica': P(A) = Casos Favorables / Casos Posibles. Necesita: casos favorables y casos posibles.
        *   'Probabilidad Condicional': P(A|B) = P(A ∩ B) / P(B). Necesita: P(A ∩ B) y P(B).
    *   'Teorema de Bayes': Para calcular P(A|B) usando P(A), P(B|A) y P(B|¬A). Necesita: P(A), P(B|A), P(B|¬A).
    *   'Distribución Binomial': Para 'n' ensayos independientes, probabilidad 'p' de éxito. Necesita: n, p. Opcional: x (número de éxitos).
    *   'Distribución de Poisson': Para 'k' eventos en un intervalo, tasa promedio 'λ'. Necesita: λ. Opcional: k.
    *   'Distribución Normal': Para probabilidades o Z-scores dada μ y σ. Necesita: μ, σ. Opcional: X1 o X1 y X2.
    *   'Distribución Exponencial': Para tiempo entre eventos (proceso Poisson), tasa 'λ'. Necesita: λ. Opcional: X.
    *   'Análisis de Variable Aleatoria Discreta': Para calcular Valor Esperado E(X), Varianza Var(X) y Desv. Estándar σ(X) de una variable aleatoria discreta. Necesita: una lista de pares (valor de X, Probabilidad P(X=x)).

3.  **Inferencia Estadística**:
    *   'Distribuciones Muestrales':
        *   'De Medias': Para distribución de medias muestrales. Necesita: μ poblacional, σ poblacional, n (tamaño muestra). Opcional: x̄ (media muestral).
        *   'De Proporciones': Para distribución de proporciones muestrales. Necesita: p poblacional, n (tamaño muestra). Opcional: p̂ (proporción muestral).
    *   'Intervalos de Confianza -> Para la Media (σ Conocida)': Para estimar μ cuando σ poblacional es conocida. Necesita: x̄ (media muestral), σ poblacional, n (tamaño muestra), nivel de confianza.

4.  **Herramientas y Simulación**:
    *   'Simulador de Datos Aleatorios': Para generar N datos de distribuciones específicas (Uniforme, Normal, Binomial, Poisson). Necesita: tipo de distribución, N puntos, y parámetros de la distribución (ej. min/max para Uniforme; media/desv.est. para Normal; n/p para Binomial; lambda para Poisson).

5.  **Asistencia y Aprendizaje con IA**:
    *   'Asistente IA para Tareas': ESTE ES TU MODO ACTUAL. Úsalo para guiar al usuario a otros modos.
    *   'Conceptos Estadísticos (IA)': Solo para explicaciones generales de terminología. NO lo sugieras para realizar cálculos o simulaciones.

Instrucciones Adicionales para ti (el Asistente):
1.  Responde SIEMPRE en español.
2.  Sé breve y directo. Primero recomienda el grupo de modo, luego el modo específico (y sub-modo si aplica, ej. "Inferencia Estadística -> Intervalos de Confianza -> Para la Media (σ Conocida)"), luego menciona los datos principales.
3.  Si la tarea es compleja, sugiere el modo más relevante para la parte principal.
4.  NO intentes realizar los cálculos tú mismo. Tu objetivo es guiar DENTRO de la calculadora.
5.  Si el usuario pregunta por un concepto, indícale que use 'Asistencia y Aprendizaje con IA -> Conceptos Estadísticos (IA)'.
6.  Si quiere "analizar datos" o "ver tendencia", 'Análisis Exploratorio y Descriptivo -> Estadísticas Descriptivas' o 'Análisis Exploratorio y Descriptivo -> Distribución de Frecuencias' son buenos puntos de partida.
7.  No preguntes por datos que la calculadora no usa para el modo sugerido.
Ejemplo para "Quiero saber la media de 10, 20, 30":
"Usa el modo **'Análisis Exploratorio y Descriptivo -> Estadísticas Descriptivas'**. Ingresa '10, 20, 30'."

Ejemplo para "¿Probabilidad de 3 seises en 10 lanzamientos de dado?":
"Usa **'Probabilidad Fundamental y Distribuciones -> Distribución Binomial'**. Necesitas:
*   n (ensayos): 10
*   p (prob. éxito): 1/6 (aprox 0.1667)
*   x (éxitos deseados): 3"
    `;
  };

  const performCalculation = async () => {
    setAppState(prev => ({ ...prev, isLoading: true, results: null, error: null, aiInterpretation: null }));
    try {
      let calcResults: CalculationResults | null = null;
      const {
        calculationMode, descriptiveInput, descriptiveShowSteps, frequencyInput, binomialN, binomialP, binomialX,
        normalMean, normalStdDev, normalX1, normalX2, selectedConceptId, aiTaskQuery,
        setInputA, setInputB, selectedSetOperation, selectedSubModeProbability,
        combinatoricsN, combinatoricsR, selectedCombinatoricsOp, probBasicFavorable,
        probBasicPossible, probCondIntersectionAB, probCondProbB, poissonLambda, poissonK,
        exponentialLambda, exponentialX, selectedSubModeSampling, populationMean,
        populationStdDev, sampleSizeMeans, sampleMeanXBar, populationProportion,
        sampleSizeProportions, sampleProportionPHat, dataInputMethod,
        selectedSubModeInference, selectedSubModeConfidenceInterval, 
        ciMeanSampleMean, ciMeanPopulationSigma, ciMeanSampleSize, ciMeanConfidenceLevel,
        simulatorDistributionType, simulatorNPoints, 
        simulatorUniformMin, simulatorUniformMax,
        simulatorNormalMean, simulatorNormalStdDev,
        simulatorBinomialN, simulatorBinomialP, simulatorPoissonLambda, 
        discreteRVInputs,
        bayesProbA, bayesProbBGivenA, bayesProbBGivenNotA
      } = appState;

      const parseNumbers = (input: string): number[] => {
        if (!input || typeof input !== 'string') return [];
        return input.split(',')
          .map(s => parseFloat(s.trim()))
          .filter(n => !isNaN(n));
      };
      
      const parseSetElements = (input: string): string[] => {
        if (!input || typeof input !== 'string') return [];
        return input.split(',').map(s => s.trim()).filter(s => s !== '');
      }

      switch (calculationMode) {
        case CalculationMode.DESCRIPTIVE:
          const descNumbers = parseNumbers(descriptiveInput);
          if (descNumbers.length === 0 && descriptiveInput.trim() !== "") throw new Error("Entrada de datos descriptivos no válida. Asegúrese de que sean números separados por comas.");
          calcResults = StatService.calculateDescriptiveStats(descNumbers, descriptiveShowSteps);
          break;
        case CalculationMode.FREQUENCY_DISTRIBUTION:
          const freqNumbers = parseNumbers(frequencyInput);
          if (freqNumbers.length === 0 && frequencyInput.trim() !== "") throw new Error("Entrada de datos de frecuencia no válida. Asegúrese de que sean números separados por comas.");
          calcResults = StatService.calculateFrequencyDistribution(freqNumbers);
          break;
        case CalculationMode.BINOMIAL:
          const bn = parseInt(binomialN);
          const bp = parseFloat(binomialP);
          const bx = binomialX.trim() === '' ? undefined : parseInt(binomialX);
          if (isNaN(bn) || bn < 0) throw new Error("Número de ensayos (n) debe ser un entero no negativo.");
          if (isNaN(bp) || bp < 0 || bp > 1) throw new Error("Probabilidad de éxito (p) debe estar entre 0 y 1.");
          if (bx !== undefined && (isNaN(bx) || bx < 0 || bx > bn)) throw new Error("Número de éxitos (x) debe ser un entero entre 0 y n.");
          calcResults = StatService.calculateBinomialDistribution({ n: bn, p: bp, x: bx });
          break;
        case CalculationMode.NORMAL:
          const nm = parseFloat(normalMean);
          const nsd = parseFloat(normalStdDev);
          const nx1 = normalX1.trim() === '' ? undefined : parseFloat(normalX1);
          const nx2 = normalX2.trim() === '' ? undefined : parseFloat(normalX2);
          if (isNaN(nm)) throw new Error("Media (μ) debe ser un número.");
          if (isNaN(nsd) || nsd <= 0) throw new Error("Desviación estándar (σ) debe ser un número positivo.");
          if (nx1 !== undefined && isNaN(nx1)) throw new Error("Valor X1 debe ser un número o estar vacío.");
          if (nx2 !== undefined && isNaN(nx2)) throw new Error("Valor X2 debe ser un número o estar vacío.");
          if (nx1 !== undefined && nx2 !== undefined && nx1 > nx2) throw new Error("X1 debe ser menor o igual a X2.");
          calcResults = StatService.calculateNormalDistribution({ mean: nm, stdDev: nsd, x1: nx1, x2: nx2 });
          break;
        case CalculationMode.STATISTICAL_CONCEPTS:
          if (!selectedConceptId) throw new Error("Por favor, seleccione un concepto estadístico.");
          const concept = STATISTICAL_CONCEPTS_TOPICS.find(c => c.id === selectedConceptId);
          if (!concept) throw new Error("Concepto no encontrado.");
          
          const geminiResponseConcept = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: concept.prompt,
          });
          const explanation = geminiResponseConcept.text;
          calcResults = { type: CalculationMode.STATISTICAL_CONCEPTS, data: { topicLabel: concept.label, explanation } };
          break;
        case CalculationMode.AI_TASK_ASSISTANT:
          if (!aiTaskQuery.trim()) throw new Error("Por favor, ingrese su pregunta o tarea para el asistente IA.");
          
          const systemPrompt = getAITaskAssistantSystemPrompt();
          const geminiResponseTask = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: aiTaskQuery,
            config: { systemInstruction: systemPrompt }
          });
          const guidance = geminiResponseTask.text;
          calcResults = { type: CalculationMode.AI_TASK_ASSISTANT, data: { userQuery: aiTaskQuery, guidance } };
          break;
        case CalculationMode.SET_OPERATIONS:
          const setA_arr = parseSetElements(setInputA);
          const setB_arr = parseSetElements(setInputB);
          if (setA_arr.length === 0 && setInputA.trim() !== "") throw new Error("Entrada para Conjunto A no válida.");
          if (setB_arr.length === 0 && setInputB.trim() !== "") throw new Error("Entrada para Conjunto B no válida.");
          calcResults = StatService.calculateSetOperation({ setA: setA_arr, setB: setB_arr, operation: selectedSetOperation });
          break;
        case CalculationMode.BASIC_PROBABILITY_COMBINATORICS:
          let probOutput: any;
          let probInputs: any = { subMode: selectedSubModeProbability };
          if (selectedSubModeProbability === SubModeBasicProbability.COMBINATORICS) {
            const cn = parseInt(combinatoricsN);
            const cr = parseInt(combinatoricsR);
            if (isNaN(cn) || cn < 0) throw new Error("N (total) debe ser un entero no negativo.");
            if (isNaN(cr) || cr < 0) throw new Error("R (a elegir) debe ser un entero no negativo.");
            if (cr > cn && selectedCombinatoricsOp === CombinatoricsOperationType.COMBINATIONS) throw new Error("R no puede ser mayor que N para combinaciones.");
            if (cr > cn && selectedCombinatoricsOp === CombinatoricsOperationType.PERMUTATIONS) throw new Error("R no puede ser mayor que N para permutaciones.");

            const resultVal = selectedCombinatoricsOp === CombinatoricsOperationType.COMBINATIONS
              ? StatService.calculateCombinations(cn, cr)
              : StatService.calculatePermutations(cn, cr);
            probOutput = { n: cn, r: cr, operationType: selectedCombinatoricsOp, result: resultVal };
            probInputs = { ...probInputs, n: cn, r: cr, combinatoricsOp: selectedCombinatoricsOp };
          } else if (selectedSubModeProbability === SubModeBasicProbability.BASIC_PROBABILITY) {
            const fav = parseInt(probBasicFavorable);
            const poss = parseInt(probBasicPossible);
            if (isNaN(fav) || fav < 0) throw new Error("Casos favorables debe ser un entero no negativo.");
            if (isNaN(poss) || poss <= 0) throw new Error("Casos posibles debe ser un entero positivo.");
            if (fav > poss) throw new Error("Casos favorables no puede ser mayor que casos posibles.");
            probOutput = { favorable: fav, possible: poss, probability: StatService.calculateBasicProbability(fav, poss) };
            probInputs = { ...probInputs, favorable: fav, possible: poss };
          } else { // CONDITIONAL_PROBABILITY
            const interAB = parseFloat(probCondIntersectionAB);
            const pB = parseFloat(probCondProbB);
            if (isNaN(interAB) || interAB < 0 || interAB > 1) throw new Error("P(A ∩ B) debe ser una probabilidad entre 0 y 1.");
            if (isNaN(pB) || pB <= 0 || pB > 1) throw new Error("P(B) debe ser una probabilidad entre >0 y 1.");
            if (interAB > pB) throw new Error("P(A ∩ B) no puede ser mayor que P(B).");
            probOutput = { probIntersectionAB: interAB, probB: pB, conditionalProbability: StatService.calculateConditionalProbability(interAB, pB) };
            probInputs = { ...probInputs, probIntersectionAB: interAB, probB: pB };
          }
          calcResults = { type: CalculationMode.BASIC_PROBABILITY_COMBINATORICS, data: { subMode: selectedSubModeProbability, inputs: probInputs, output: probOutput }};
          break;
        case CalculationMode.POISSON_DISTRIBUTION:
          const pl = parseFloat(poissonLambda);
          const pk = poissonK.trim() === '' ? undefined : parseInt(poissonK);
          if (isNaN(pl) || pl <= 0) throw new Error("Tasa Lambda (λ) debe ser un número positivo.");
          if (pk !== undefined && (isNaN(pk) || pk < 0 || !Number.isInteger(pk))) throw new Error("Número de ocurrencias (k) debe ser un entero no negativo.");
          calcResults = StatService.calculatePoissonDistribution({ lambda: pl, k: pk });
          break;
        case CalculationMode.EXPONENTIAL_DISTRIBUTION:
          const el = parseFloat(exponentialLambda);
          const ex = exponentialX.trim() === '' ? undefined : parseFloat(exponentialX);
          if (isNaN(el) || el <= 0) throw new Error("Tasa Lambda (λ) debe ser un número positivo.");
          if (ex !== undefined && (isNaN(ex) || ex < 0)) throw new Error("Valor X debe ser un número no negativo.");
          calcResults = StatService.calculateExponentialDistribution({ lambda: el, x: ex });
          break;
        case CalculationMode.SAMPLING_DISTRIBUTIONS:
          let samplingContent;
          if (selectedSubModeSampling === SubModeSamplingDistribution.MEANS) {
            const popM = parseFloat(populationMean);
            const popSD = parseFloat(populationStdDev);
            const sSizeM = parseInt(sampleSizeMeans);
            const sMeanX = sampleMeanXBar.trim() === '' ? undefined : parseFloat(sampleMeanXBar);
            if(isNaN(popM)) throw new Error("Media poblacional (μ) debe ser un número.");
            if(isNaN(popSD) || popSD <= 0) throw new Error("Desv. estándar poblacional (σ) debe ser positiva.");
            if(isNaN(sSizeM) || sSizeM <= 0) throw new Error("Tamaño de muestra (n) debe ser entero positivo.");
            if(sMeanX !== undefined && isNaN(sMeanX)) throw new Error("Media muestral (x̄) debe ser un número o estar vacía.");
            samplingContent = StatService.calculateSamplingDistributionMeans({ populationMean: popM, populationStdDev: popSD, sampleSize: sSizeM, sampleMeanXBar: sMeanX });
          } else { // PROPORTIONS
            const popP = parseFloat(populationProportion);
            const sSizeP = parseInt(sampleSizeProportions);
            const sPropPH = sampleProportionPHat.trim() === '' ? undefined : parseFloat(sampleProportionPHat);
            if(isNaN(popP) || popP < 0 || popP > 1) throw new Error("Proporción poblacional (p) debe estar entre 0 y 1.");
            if(popP === 0 || popP === 1) throw new Error("Proporción poblacional (p) no puede ser 0 o 1 para aproximación normal.");
            if(isNaN(sSizeP) || sSizeP <= 0) throw new Error("Tamaño de muestra (n) debe ser entero positivo.");
            if(sPropPH !== undefined && (isNaN(sPropPH) || sPropPH < 0 || sPropPH > 1)) throw new Error("Proporción muestral (p̂) debe estar entre 0 y 1 o estar vacía.");
            samplingContent = StatService.calculateSamplingDistributionProportions({ populationProportion: popP, sampleSize: sSizeP, sampleProportionPHat: sPropPH });
          }
          calcResults = { type: CalculationMode.SAMPLING_DISTRIBUTIONS, data: { subMode: selectedSubModeSampling, content: samplingContent }};
          break;
        case CalculationMode.INFERENCE: 
          if (selectedSubModeInference === SubModeInference.CONFIDENCE_INTERVALS) {
            if (selectedSubModeConfidenceInterval === SubModeConfidenceInterval.MEAN_SIGMA_KNOWN) {
              const sMean = parseFloat(ciMeanSampleMean);
              const popSigma = parseFloat(ciMeanPopulationSigma);
              const sSize = parseInt(ciMeanSampleSize);
              const confLvl = parseInt(ciMeanConfidenceLevel);

              if (isNaN(sMean)) throw new Error("Media muestral (x̄) debe ser un número.");
              if (isNaN(popSigma) || popSigma <= 0) throw new Error("Desviación estándar poblacional (σ) debe ser positiva.");
              if (isNaN(sSize) || sSize <= 0) throw new Error("Tamaño de muestra (n) debe ser entero positivo.");
              if (isNaN(confLvl) || ![90, 95, 98, 99].includes(confLvl)) throw new Error("Nivel de confianza debe ser 90, 95, 98 o 99.");
              
              const ciInput: ConfidenceIntervalMeanSigmaKnownInput = { sampleMean: sMean, populationSigma: popSigma, sampleSize: sSize, confidenceLevel: confLvl };
              const ciContent = StatService.calculateConfidenceIntervalMeanSigmaKnown(ciInput);
              calcResults = { 
                type: CalculationMode.INFERENCE, 
                data: { 
                  subModeInference: selectedSubModeInference, 
                  subModeConfidenceInterval: selectedSubModeConfidenceInterval, 
                  content: ciContent 
                }
              };
            } else {
              throw new Error("Submodo de intervalo de confianza no implementado.");
            }
          } else {
            throw new Error("Submodo de inferencia no implementado.");
          }
          break;
        case CalculationMode.DATA_SIMULATOR: 
          const nSimPoints = parseInt(simulatorNPoints);
          if(isNaN(nSimPoints) || nSimPoints <=0 || nSimPoints > 10000) throw new Error("Número de puntos a simular debe ser un entero positivo (máx 10000).");

          let simInput: DataSimulatorInput = { distributionType: simulatorDistributionType, nPoints: nSimPoints };
          if (simulatorDistributionType === SimulatorDistributionType.UNIFORM) {
            const min = parseFloat(simulatorUniformMin);
            const max = parseFloat(simulatorUniformMax);
            if(isNaN(min) || isNaN(max)) throw new Error("Mínimo y Máximo para Uniforme deben ser números.");
            if(min > max) throw new Error("Mínimo debe ser menor o igual que Máximo para Uniforme.");
            simInput = { ...simInput, uniformMin: min, uniformMax: max };
          } else if (simulatorDistributionType === SimulatorDistributionType.NORMAL) {
            const mean = parseFloat(simulatorNormalMean);
            const stdDev = parseFloat(simulatorNormalStdDev);
            if(isNaN(mean)) throw new Error("Media para Normal debe ser un número.");
            if(isNaN(stdDev) || stdDev <=0) throw new Error("Desv. Estándar para Normal debe ser un número positivo.");
            simInput = { ...simInput, normalMean: mean, normalStdDev: stdDev };
          } else if (simulatorDistributionType === SimulatorDistributionType.BINOMIAL) {
            const n = parseInt(simulatorBinomialN);
            const p = parseFloat(simulatorBinomialP);
            if (isNaN(n) || n <= 0) throw new Error("Número de ensayos (n) para Binomial debe ser un entero positivo.");
            if (isNaN(p) || p < 0 || p > 1) throw new Error("Probabilidad de éxito (p) para Binomial debe estar entre 0 y 1.");
            simInput = { ...simInput, binomialN: n, binomialP: p };
          } else if (simulatorDistributionType === SimulatorDistributionType.POISSON) {
            const lambdaSim = parseFloat(simulatorPoissonLambda);
            if (isNaN(lambdaSim) || lambdaSim <= 0) throw new Error("Tasa Lambda (λ) para Poisson debe ser un número positivo.");
            simInput = { ...simInput, poissonLambda: lambdaSim };
          } else {
             throw new Error(`Simulación para el tipo de distribución '${simulatorDistributionType}' no implementada.`);
          }
          const simData = StatService.generateRandomData(simInput);
          const descStatsForSimData = StatService.calculateDescriptiveStats(simData.generatedData, false); // Don't show steps for simulator's own stats

          calcResults = { 
            type: CalculationMode.DATA_SIMULATOR, 
            data: {
              distributionType: simulatorDistributionType,
              parameters: simInput,
              generatedData: simData.generatedData,
              summaryStats: descStatsForSimData.data 
            }
          };
          break;
        case CalculationMode.DISCRETE_RANDOM_VARIABLE:
          const parsedRVInputs = discreteRVInputs
            .map(row => ({ x: parseFloat(row.x), p: parseFloat(row.p) }))
            .filter(row => !isNaN(row.x) && !isNaN(row.p) && row.p >= 0); 
          
          if (parsedRVInputs.length === 0) {
            throw new Error("No se proporcionaron valores válidos para X y P(X=x).");
          }
          
          const sumOfProbabilities = parsedRVInputs.reduce((sum, row) => sum + row.p, 0);
          if (Math.abs(sumOfProbabilities - 1) > 1e-9) { 
            throw new Error(`La suma de las probabilidades P(X=x) debe ser 1 (actualmente es ${sumOfProbabilities.toFixed(6)}).`);
          }
          
          const rvAnalysisContent = StatService.calculateDiscreteRVAnalysis(parsedRVInputs);
          calcResults = {
            type: CalculationMode.DISCRETE_RANDOM_VARIABLE,
            data: rvAnalysisContent
          };
          break;
        case CalculationMode.BAYES_THEOREM:
          const pA = parseFloat(bayesProbA);
          const pBGivenA = parseFloat(bayesProbBGivenA);
          const pBGivenNotA = parseFloat(bayesProbBGivenNotA);

          if (isNaN(pA) || pA < 0 || pA > 1) throw new Error("P(A) debe ser una probabilidad entre 0 y 1.");
          if (isNaN(pBGivenA) || pBGivenA < 0 || pBGivenA > 1) throw new Error("P(B|A) debe ser una probabilidad entre 0 y 1.");
          if (isNaN(pBGivenNotA) || pBGivenNotA < 0 || pBGivenNotA > 1) throw new Error("P(B|¬A) debe ser una probabilidad entre 0 y 1.");
          
          const bayesInput: BayesTheoremInput = { probA: pA, probBGivenA: pBGivenA, probBGivenNotA: pBGivenNotA };
          const bayesContent = StatService.calculateBayesTheorem(bayesInput);
          calcResults = { type: CalculationMode.BAYES_THEOREM, data: bayesContent };
          break;
        default:
          throw new Error("Modo de cálculo no implementado.");
      }
      setAppState(prev => ({ ...prev, results: calcResults, error: null }));
    } catch (e: any) {
      console.error("Calculation error:", e);
      setAppState(prev => ({ ...prev, error: e.message || "Ocurrió un error desconocido." }));
    } finally {
      setAppState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleGetAIInterpretation = async () => {
    if (!appState.results) return;
    setAppState(prev => ({ ...prev, isLoading: true, error: null, aiInterpretation: "Consultando IA para interpretación..." }));

    let contextForAI = "";
    let resultsForAI: any = {};

    if (appState.calculationMode === CalculationMode.INFERENCE && appState.results.type === CalculationMode.INFERENCE) {
        const inferenceResults = appState.results as ConfidenceIntervalResults;
        if (inferenceResults.data.subModeConfidenceInterval === SubModeConfidenceInterval.MEAN_SIGMA_KNOWN) {
            contextForAI = `Se calculó un intervalo de confianza para la media poblacional (μ), asumiendo que la desviación estándar poblacional (σ) es conocida.`;
            const content = inferenceResults.data.content;
            resultsForAI = {
                media_muestral_x_barra: content.sampleMean,
                sigma_poblacional: content.populationSigma,
                tamano_muestra_n: content.sampleSize,
                nivel_confianza_porcentaje: content.confidenceLevel,
                valor_critico_Z: content.zCritical,
                error_estandar: content.standardError,
                margen_de_error: content.marginOfError,
                limite_inferior_IC: content.lowerBound,
                limite_superior_IC: content.upperBound,
                interpretacion_basica_generada: content.interpretation
            };
        }
    } 
     
    if (!contextForAI) {
        setAppState(prev => ({ ...prev, isLoading: false, aiInterpretation: "La interpretación IA no está disponible para este tipo de resultado." }));
        return;
    }
    
    const interpretationPrompt = `
Eres un tutor de estadística experto y amigable. Un estudiante ha realizado un cálculo en la aplicación y ha obtenido los siguientes resultados.
Contexto del cálculo: ${contextForAI}
Resultados obtenidos (valores numéricos):
${JSON.stringify(resultsForAI, null, 2)}

Por favor, proporciona una interpretación CLARA y CONCISA de estos resultados en español.
Explica qué significan los valores más importantes en términos prácticos para alguien que está aprendiendo estadística.
Si hay una 'interpretacion_basica_generada', puedes usarla como base pero elabora sobre ella si es posible, añadiendo más profundidad o explicando los componentes clave.
Mantén la explicación enfocada en la comprensión conceptual y la aplicación, no solo en repetir los números.
Evita jerga excesivamente técnica a menos que la expliques. Sé alentador.
NO incluyas los datos originales en tu respuesta, solo la interpretación de los resultados calculados.
Formatea tu respuesta usando saltos de línea para párrafos y **asteriscos para texto en negrita** donde sea apropiado para enfatizar.
`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: interpretationPrompt,
        });
        setAppState(prev => ({ ...prev, isLoading: false, aiInterpretation: response.text }));
    } catch (e: any) {
        console.error("AI interpretation error:", e);
        setAppState(prev => ({ ...prev, isLoading: false, error: "Error al obtener interpretación de IA.", aiInterpretation: null }));
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 text-slate-100 flex flex-col p-4 sm:p-6 lg:p-8 antialiased">
      <header className="mb-8 text-center">
        <div className="flex items-center justify-center mb-2">
            <CalculatorIcon className="w-10 h-10 text-sky-400 mr-3" />
            <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-teal-300">
                Calculadora Estadística Avanzada
            </h1>
        </div>
        <p className="text-sm text-slate-400">Una herramienta completa para análisis estadístico, probabilidad y visualización de datos.</p>
      </header>

      <main className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8">
        <section aria-labelledby="input-section-title">
          <h2 id="input-section-title" className="sr-only">Sección de Entradas</h2>
          <InputSection
            appState={appState}
            onInputChange={handleInputChange}
            onDiscreteRVInputsChange={handleDiscreteRVInputsChange}
            onCategoryChange={handleCategoryChange} // New handler
            onModeChange={handleModeChange} // This now handles specific tool change
            onCalculate={performCalculation}
            onReset={resetInputs}
            isLoading={appState.isLoading}
          />
        </section>
        <section aria-labelledby="results-section-title">
          <h2 id="results-section-title" className="sr-only">Sección de Resultados</h2>
          <ResultsSection
            results={appState.results}
            error={appState.error}
            isLoading={appState.isLoading}
            calculationMode={appState.calculationMode}
            appState={appState}
            onGetAIInterpretation={handleGetAIInterpretation}
            aiInterpretation={appState.aiInterpretation}
          />
        </section>
      </main>

      <footer className="mt-12 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} Calculadora Estadística Avanzada. Todos los derechos reservados.</p>
        <p>Desarrollado con fines educativos y de demostración.</p>
      </footer>
    </div>
  );
};
