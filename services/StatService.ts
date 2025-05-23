
import { 
    DescriptiveStatsResults, DescriptiveStatsResultsContent, 
    BinomialInput, BinomialResults, BinomialResultsContent, 
    NormalInput, NormalResults, NormalResultsContent, 
    FrequencyDistributionResults, FrequencyDistributionResultsContent, FrequencyDistributionClass,
    SetOperationsInput, SetOperationsResults, SetOperationsResultsContent, SetOperationType,
    PoissonInput, PoissonResults, PoissonResultsContent,
    ExponentialInput, ExponentialResults, ExponentialResultsContent,
    SamplingMeansInput, SamplingMeansResultsContent, 
    SamplingProportionsInput, SamplingProportionsResultsContent, 
    CalculationMode, ChartDataPoint,
    ConfidenceIntervalMeanSigmaKnownInput, ConfidenceIntervalMeanSigmaKnownResultContent, 
    DataSimulatorInput, SimulatorDistributionType,
    DiscreteRVResultsContent,
    MeanCalculationSteps, MedianCalculationSteps, VarianceCalculationSteps, StdDevCalculationSteps, VarianceCalculationStepItem,
    BayesTheoremInput, BayesTheoremResultsContent
} from '../types';
import { HISTOGRAM_BUCKET_COUNT, NORMAL_PDF_POINTS_COUNT, POISSON_PMF_POINTS_COUNT_MAX, EXPONENTIAL_PDF_POINTS_COUNT, SAMPLING_DISTRIBUTION_PDF_POINTS_COUNT } from '../constants';

export class StatService {

  private static mean(data: number[]): number {
    if (data.length === 0) return NaN;
    return data.reduce((acc, val) => acc + val, 0) / data.length;
  }

  private static median(data: number[]): number {
    if (data.length === 0) return NaN;
    const sorted = [...data].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  private static mode(data: number[]): number[] {
    if (data.length === 0) return [];
    const frequency: { [key: number]: number } = {};
    let maxFreq = 0;
    data.forEach(item => {
      frequency[item] = (frequency[item] || 0) + 1;
      if (frequency[item] > maxFreq) {
        maxFreq = frequency[item];
      }
    });
    if (maxFreq === 1 && data.length > 1 && new Set(data).size === data.length) return []; 
    return Object.keys(frequency).filter(key => frequency[Number(key)] === maxFreq).map(Number).sort((a,b) => a-b);
  }

  private static variance(data: number[], meanValue: number): number {
    if (data.length < 2) return NaN; 
    return data.reduce((acc, val) => acc + Math.pow(val - meanValue, 2), 0) / (data.length -1); 
  }

  private static stdDev(varianceValue: number): number {
    return Math.sqrt(varianceValue);
  }

  private static percentile(data: number[], p: number): number {
    if (data.length === 0 || p < 0 || p > 100) return NaN;
    const sorted = [...data].sort((a, b) => a - b);
    const index = (p / 100) * (sorted.length - 1);
    if (Number.isInteger(index)) {
      return sorted[index];
    }
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    if (lower === upper) return sorted[lower]; 
    if (sorted[upper] === undefined || sorted[lower] === undefined) return sorted[lower]; 
    return sorted[lower] + (index - lower) * (sorted[upper] - sorted[lower]);
  }

  public static calculateDescriptiveStats(numbers: number[], includeSteps: boolean = false): DescriptiveStatsResults {
    if (numbers.length === 0) {
        throw new Error("Los datos de entrada están vacíos. Por favor, proporcione números para el cálculo.");
    }
    const count = numbers.length;
    const sum = numbers.reduce((acc, val) => acc + val, 0);
    const meanVal = this.mean(numbers);
    const medianVal = this.median(numbers);
    const modeVal = this.mode(numbers);
    const varianceVal = this.variance(numbers, meanVal);
    const stdDevVal = this.stdDev(varianceVal);
    const sortedNumbers = [...numbers].sort((a,b) => a-b);
    const minVal = sortedNumbers[0];
    const maxVal = sortedNumbers[count - 1];
    const rangeVal = maxVal - minVal;
    const q1 = this.percentile(numbers, 25);
    const q3 = this.percentile(numbers, 75);
    const iqr = q3 - q1;

    let meanSteps: MeanCalculationSteps | undefined;
    let medianSteps: MedianCalculationSteps | undefined;
    let varianceSteps: VarianceCalculationSteps | undefined;
    let stdDevSteps: StdDevCalculationSteps | undefined;

    if (includeSteps) {
      meanSteps = { sum, count, equation: "Σx / N" };

      const sortedDataForMedian = [...numbers].sort((a, b) => a - b);
      const medianN = sortedDataForMedian.length;
      const isEven = medianN % 2 === 0;
      medianSteps = { sortedData: sortedDataForMedian, count: medianN, isEven };
      if (isEven) {
          const mid1 = medianN / 2 - 1;
          const mid2 = medianN / 2;
          medianSteps.middleIndices = [sortedDataForMedian[mid1], sortedDataForMedian[mid2]];
          medianSteps.calculatedMedian = (sortedDataForMedian[mid1] + sortedDataForMedian[mid2]) / 2;
      } else {
          medianSteps.middleValue = sortedDataForMedian[Math.floor(medianN / 2)];
      }

      if (count >= 2) {
        const varianceItems: VarianceCalculationStepItem[] = numbers.map(x => {
          const deviation = x - meanVal;
          return { x, deviation, squaredDeviation: Math.pow(deviation, 2) };
        });
        const sumSquaredDeviations = varianceItems.reduce((acc, item) => acc + item.squaredDeviation, 0);
        varianceSteps = {
          mean: meanVal,
          items: varianceItems,
          sumSquaredDeviations,
          count,
          equation: "Σ(x - x̄)² / (N - 1)",
        };
        stdDevSteps = { variance: varianceVal, equation: "√s²" };
      }
    }


    const histogramData: ChartDataPoint[] = [];
    if (count > 0 && !isNaN(minVal) && !isNaN(maxVal) && minVal !== maxVal) {
        const numBuckets = Math.min(HISTOGRAM_BUCKET_COUNT, count); 
        const bucketSize = Math.max(0.1, rangeVal / numBuckets); 
        const buckets: number[] = Array(numBuckets).fill(0);
        
        for (const num of numbers) {
            let bucketIndex = Math.floor((num - minVal) / bucketSize);
            if (num === maxVal) bucketIndex = numBuckets - 1; 
            bucketIndex = Math.max(0, Math.min(bucketIndex, numBuckets - 1));
            buckets[bucketIndex]++;
        }
        
        for (let i = 0; i < numBuckets; i++) {
            const bucketStart = minVal + i * bucketSize;
            const bucketEnd = bucketStart + bucketSize;
            histogramData.push({
                name: `${bucketStart.toFixed(1)}-${bucketEnd.toFixed(1)}`,
                value: buckets[i]
            });
        }
    } else if (count > 0 && (!isNaN(minVal) && minVal === maxVal)) { 
        histogramData.push({ name: `${minVal}`, value: count });
    }
    
    const resultsContent: DescriptiveStatsResultsContent = {
      count, mean: meanVal, median: medianVal, mode: modeVal, variance: varianceVal, stdDev: stdDevVal,
      min: minVal, max: maxVal, range: rangeVal, sum, q1, q3, iqr, histogramData,
      meanSteps, medianSteps, varianceSteps, stdDevSteps,
    };
    return { type: CalculationMode.DESCRIPTIVE, data: resultsContent };
  }

  private static factorial(n: number): number {
    if (n < 0) return NaN; 
    if (n > 170) return Infinity; 
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  }

  public static calculateCombinations(n: number, k: number): number {
    if (k < 0 || k > n) return 0;
    if (k === 0 || k === n) return 1;
    if (k > n / 2) k = n - k; 
    
    if (n > 30) { 
        const logFactorial = (num: number) => {
            let sum = 0;
            for (let i = 1; i <= num; i++) {
                sum += Math.log(i);
            }
            return sum;
        };
        const logResult = logFactorial(n) - logFactorial(k) - logFactorial(n - k);
        return Math.round(Math.exp(logResult));
    }

    let res = 1;
    for (let i = 1; i <= k; i++) {
        res = res * (n - i + 1) / i;
    }
    return res;
  }

  private static binomialPMF(k: number, n: number, p: number): number {
    if (p < 0 || p > 1) return NaN;
    return this.calculateCombinations(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
  }

  public static calculateBinomialDistribution(input: BinomialInput): BinomialResults {
    const { n, p, x } = input;
    const meanVal = n * p;
    const varianceVal = n * p * (1 - p);
    const stdDevVal = Math.sqrt(varianceVal);

    const pmfData: ChartDataPoint[] = [];
    const maxKForChart = Math.min(n, 50); 
    for (let k_val = 0; k_val <= maxKForChart; k_val++) {
      pmfData.push({ name: k_val, value: this.binomialPMF(k_val, n, p) });
    }
     if (n > maxKForChart && n <= 1000) { 
        pmfData.push({ name: `...${n}`, value: 0 }); 
    }


    let exactProbability: number | undefined;
    let lessThanOrEqualProbability: number | undefined;
    let greaterThanOrEqualProbability: number | undefined;

    if (x !== undefined && x >= 0 && x <= n) { 
      exactProbability = this.binomialPMF(x, n, p);
      lessThanOrEqualProbability = 0;
      for (let k_val = 0; k_val <= x; k_val++) {
        lessThanOrEqualProbability += this.binomialPMF(k_val, n, p);
      }
      greaterThanOrEqualProbability = 0;
      for (let k_val = x; k_val <= n; k_val++) {
        greaterThanOrEqualProbability += this.binomialPMF(k_val, n, p);
      }
    }
    
    const resultsContent: BinomialResultsContent = {
        mean: meanVal, variance: varianceVal, stdDev: stdDevVal, pmfData,
        exactProbability, lessThanOrEqualProbability, greaterThanOrEqualProbability
    };
    return { type: CalculationMode.BINOMIAL, data: resultsContent };
  }

  private static normalPDF(x: number, mean: number, stdDev: number): number {
    if (stdDev <= 0) return NaN;
    return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
  }
  
  private static standardNormalCDF(x: number): number {
    const p = 0.2316419;
    const b1 = 0.319381530;
    const b2 = -0.356563782;
    const b3 = 1.781477937;
    const b4 = -1.821255978;
    const b5 = 1.330274429;

    const t = 1 / (1 + p * Math.abs(x));
    const pdf_val = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x); 
    
    let cdf = 1 - pdf_val * (b1*t + b2*Math.pow(t,2) + b3*Math.pow(t,3) + b4*Math.pow(t,4) + b5*Math.pow(t,5));

    if (x < 0) {
      return 1 - cdf;
    }
    return cdf;
  }

  private static normalCDF(x: number, mean: number, stdDev: number): number {
    if (stdDev <= 0) return NaN;
    const z = (x - mean) / stdDev;
    return this.standardNormalCDF(z);
  }


  public static calculateNormalDistribution(input: NormalInput): NormalResults {
    const { mean, stdDev, x1, x2 } = input;

    const pdfData: ChartDataPoint[] = [];
    const range = stdDev * 8; 
    const minX = mean - range / 2;
    const step = range / (NORMAL_PDF_POINTS_COUNT -1);
    for (let i = 0; i < NORMAL_PDF_POINTS_COUNT; i++) {
      const currentX = minX + i * step;
      pdfData.push({ name: currentX, value: this.normalPDF(currentX, mean, stdDev) });
    }

    let probabilityLessThanX1: number | undefined;
    let probabilityGreaterThanX1: number | undefined;
    let probabilityBetweenX1X2: number | undefined;
    let zScoreX1: number | undefined;

    if (x1 !== undefined) {
      zScoreX1 = (x1 - mean) / stdDev;
      probabilityLessThanX1 = this.normalCDF(x1, mean, stdDev);
      probabilityGreaterThanX1 = 1 - probabilityLessThanX1;

      if (x2 !== undefined) {
        if (x1 > x2) throw new Error("X1 debe ser menor o igual a X2 para probabilidad de rango.");
        const cdfX2 = this.normalCDF(x2, mean, stdDev);
        probabilityBetweenX1X2 = cdfX2 - probabilityLessThanX1;
      }
    }
    
    const resultsContent: NormalResultsContent = {
        pdfData, probabilityLessThanX1, probabilityGreaterThanX1, probabilityBetweenX1X2, zScoreX1
    };
    return { type: CalculationMode.NORMAL, data: resultsContent };
  }

  public static calculateFrequencyDistribution(numbers: number[]): FrequencyDistributionResults {
    const n = numbers.length;
    if (n === 0) {
        throw new Error("Los datos de entrada están vacíos. Por favor, proporcione números.");
    }

    const sortedNumbers = [...numbers].sort((a, b) => a - b);
    const vMin = sortedNumbers[0];
    const vMax = sortedNumbers[n - 1];
    const rangeVal = vMax - vMin;

    let numClassesCalc: number;
    let classWidthVal: number;
    const classes: FrequencyDistributionClass[] = [];
    const combinedChartData: ChartDataPoint[] = [];

    if (rangeVal === 0) { 
        numClassesCalc = 1;
        classWidthVal = 0; 
        const classMark = vMin;
        classes.push({
            intervalLabel: `${vMin}`, classMark, absoluteFrequency: n,
            relativeFrequency: 1, accumulatedFrequency: n
        });
        combinedChartData.push({ name: classMark.toFixed(1), value: n, polygonValue: n, intervalLabel: `${vMin}` });

    } else { 
        numClassesCalc = Math.round(1 + 3.322 * Math.log10(n));
        numClassesCalc = Math.max(1, numClassesCalc); 
        
        classWidthVal = rangeVal / numClassesCalc;
        if (classWidthVal === 0 && rangeVal > 0) classWidthVal = rangeVal; 
        else if (classWidthVal < 0.1 && rangeVal > 0) classWidthVal = Math.max(0.1, Math.ceil(rangeVal / numClassesCalc)); 
        else classWidthVal = Math.ceil(classWidthVal);
        classWidthVal = Math.max(1, classWidthVal); 
        
        numClassesCalc = Math.ceil(rangeVal / classWidthVal);
        numClassesCalc = Math.max(1, numClassesCalc);

        let accumulatedFrequency = 0;
        
        for (let i = 0; i < numClassesCalc; i++) {
            const lowerBound = vMin + i * classWidthVal;
            const upperBound = (i === numClassesCalc - 1) ? vMax : (vMin + (i + 1) * classWidthVal);
            const classMark = (lowerBound + upperBound) / 2;
            const intervalLabel = `${lowerBound.toFixed(1)} - ${ (i === numClassesCalc - 1) ? vMax.toFixed(1) : ('<' + (vMin + (i + 1) * classWidthVal).toFixed(1))}`;
            
            let absoluteFrequency: number;
             if (i === numClassesCalc - 1) { 
                absoluteFrequency = sortedNumbers.filter(num => num >= lowerBound && num <= vMax).length;
            } else {
                absoluteFrequency = sortedNumbers.filter(num => num >= lowerBound && num < (vMin + (i + 1) * classWidthVal)).length;
            }
            
            const relativeFrequency = absoluteFrequency / n;
            accumulatedFrequency += absoluteFrequency;

            classes.push({
                intervalLabel, classMark, absoluteFrequency,
                relativeFrequency, accumulatedFrequency
            });
            combinedChartData.push({
                name: classMark.toFixed(1), value: absoluteFrequency,
                polygonValue: absoluteFrequency, intervalLabel: intervalLabel
            });
        }
    }

    const resultsContent: FrequencyDistributionResultsContent = {
        vMin, vMax, range: rangeVal, n, numClasses: numClassesCalc, classWidth: classWidthVal, classes, combinedChartData
    };
    return { type: CalculationMode.FREQUENCY_DISTRIBUTION, data: resultsContent };
  }


  private static set_parseElements(elements: string[]): Set<string> {
    return new Set(elements.map(e => e.trim()).filter(e => e !== ''));
  }

  private static set_union(setA: Set<string>, setB: Set<string>): Set<string> {
    return new Set([...setA, ...setB]);
  }

  private static set_intersection(setA: Set<string>, setB: Set<string>): Set<string> {
    return new Set([...setA].filter(element => setB.has(element)));
  }

  private static set_difference(setA: Set<string>, setB: Set<string>): Set<string> { 
    return new Set([...setA].filter(element => !setB.has(element)));
  }

  private static set_symmetricDifference(setA: Set<string>, setB: Set<string>): Set<string> { 
    const diffAB = this.set_difference(setA, setB);
    const diffBA = this.set_difference(setB, setA);
    return this.set_union(diffAB, diffBA);
  }

  private static sortSetElements(set: Set<string>): string[] {
    return Array.from(set).sort((a, b) => {
      const numA = parseFloat(a);
      const numB = parseFloat(b);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      if (!isNaN(numA)) return -1; 
      if (!isNaN(numB)) return 1;  
      return a.localeCompare(b); 
    });
  }

  public static calculateSetOperation(input: SetOperationsInput): SetOperationsResults {
    const setA_internal = this.set_parseElements(input.setA);
    const setB_internal = this.set_parseElements(input.setB);
    let resultSet_internal: Set<string>;

    switch (input.operation) {
      case SetOperationType.UNION:
        resultSet_internal = this.set_union(setA_internal, setB_internal);
        break;
      case SetOperationType.INTERSECTION:
        resultSet_internal = this.set_intersection(setA_internal, setB_internal);
        break;
      case SetOperationType.DIFFERENCE_A_B:
        resultSet_internal = this.set_difference(setA_internal, setB_internal);
        break;
      case SetOperationType.DIFFERENCE_B_A:
        resultSet_internal = this.set_difference(setB_internal, setA_internal);
        break;
      case SetOperationType.SYMMETRIC_DIFFERENCE:
        resultSet_internal = this.set_symmetricDifference(setA_internal, setB_internal);
        break;
      default:
        throw new Error("Operación de conjunto no válida.");
    }

    const elementsOnlyInA_internal = this.set_difference(setA_internal, setB_internal);
    const elementsOnlyInB_internal = this.set_difference(setB_internal, setA_internal);
    const intersection_internal = this.set_intersection(setA_internal, setB_internal);

    const data: SetOperationsResultsContent = {
      operation: input.operation,
      setA: this.sortSetElements(setA_internal),
      setB: this.sortSetElements(setB_internal),
      resultSet: this.sortSetElements(resultSet_internal),
      elementsOnlyInA: this.sortSetElements(elementsOnlyInA_internal),
      elementsOnlyInB: this.sortSetElements(elementsOnlyInB_internal),
      intersection: this.sortSetElements(intersection_internal),
      countA: setA_internal.size,
      countB: setB_internal.size,
      countResultSet: resultSet_internal.size,
      countOnlyInA: elementsOnlyInA_internal.size,
      countOnlyInB: elementsOnlyInB_internal.size,
      countIntersection: intersection_internal.size,
    };

    return { type: CalculationMode.SET_OPERATIONS, data };
  }

  public static calculatePermutations(n: number, r: number): number {
    if (r < 0 || r > n) return 0;
    if (n > 170 && r < n - 170) { 
        let res = 1;
        for (let i = 0; i < r; i++) {
            res *= (n - i);
            if (res === Infinity) break;
        }
        return res;
    }
    const num = this.factorial(n);
    const den = this.factorial(n - r);
    if (den === 0 && num !== 0) return Infinity; 
    if (den === 0 && num === 0) return 1; 
    return num / den;
  }

  public static calculateBasicProbability(favorable: number, possible: number): number {
    if (possible === 0) return NaN; 
    return favorable / possible;
  }

  public static calculateConditionalProbability(probIntersectionAB: number, probB: number): number {
    if (probB === 0) return NaN; 
    return probIntersectionAB / probB;
  }

  private static poissonPMF(k_val: number, lambda: number): number {
    if (lambda < 0 || k_val < 0 || !Number.isInteger(k_val)) return NaN;
    const numerator = Math.pow(lambda, k_val) * Math.exp(-lambda);
    const denominator = this.factorial(k_val);
    if (denominator === 0 && numerator === 0) return 1;
    if (denominator === 0) return Infinity;
    return numerator / denominator;
  }

  public static calculatePoissonDistribution(input: PoissonInput): PoissonResults {
    const { lambda, k } = input;

    const meanVal = lambda;
    const varianceVal = lambda;
    const stdDevVal = Math.sqrt(lambda);

    const pmfData: ChartDataPoint[] = [];
    let maxKForChart = Math.ceil(lambda + 5 * stdDevVal);
    maxKForChart = Math.min(maxKForChart, POISSON_PMF_POINTS_COUNT_MAX -1 );
    maxKForChart = Math.max(0, maxKForChart);

    for (let i = 0; i <= maxKForChart; i++) {
      pmfData.push({ name: i, value: this.poissonPMF(i, lambda) });
    }
     if (maxKForChart < 30 && lambda > maxKForChart ) { 
        const lastProb = this.poissonPMF(maxKForChart + 1, lambda);
        if (lastProb > 1e-6) {
             pmfData.push({ name: `...`, value: 0 });
        }
    }

    let exactProbability: number | undefined;
    let lessThanOrEqualProbability: number | undefined;
    let greaterThanProbability: number | undefined;

    if (k !== undefined && k >= 0 && Number.isInteger(k)) {
      exactProbability = this.poissonPMF(k, lambda);
      
      lessThanOrEqualProbability = 0;
      for (let i = 0; i <= k; i++) {
        lessThanOrEqualProbability += this.poissonPMF(i, lambda);
      }
      lessThanOrEqualProbability = Math.min(1, lessThanOrEqualProbability);

      greaterThanProbability = 1 - lessThanOrEqualProbability;
      greaterThanProbability = Math.max(0, greaterThanProbability);
    }
    
    const resultsContent: PoissonResultsContent = {
        mean: meanVal, variance: varianceVal, stdDev: stdDevVal, pmfData,
        exactProbability, lessThanOrEqualProbability, greaterThanProbability
    };
    return { type: CalculationMode.POISSON_DISTRIBUTION, data: resultsContent };
  }

  public static calculateExponentialDistribution(input: ExponentialInput): ExponentialResults {
    const { lambda, x } = input;

    if (lambda <= 0) throw new Error("Tasa (λ) debe ser positiva.");

    const meanVal = 1 / lambda;
    const varianceVal = 1 / (lambda * lambda);
    const stdDevVal = 1 / lambda;

    const pdfData: ChartDataPoint[] = [];
    const maxXForChart = Math.max(x !== undefined ? x * 1.5 : 0, 7 / lambda); 
    const step = maxXForChart / (EXPONENTIAL_PDF_POINTS_COUNT - 1);

    for (let i = 0; i < EXPONENTIAL_PDF_POINTS_COUNT; i++) {
      const currentX = i * step;
      const pdfValue = lambda * Math.exp(-lambda * currentX);
      pdfData.push({ name: currentX, value: pdfValue });
    }
    
    let fx_val: number | undefined;
    let probLessThanOrEqualX_val: number | undefined;
    let probGreaterThanX_val: number | undefined;

    if (x !== undefined && x >= 0) {
      fx_val = lambda * Math.exp(-lambda * x);
      probLessThanOrEqualX_val = 1 - Math.exp(-lambda * x);
      probGreaterThanX_val = Math.exp(-lambda * x);
    }

    const resultsContent: ExponentialResultsContent = {
      mean: meanVal,
      variance: varianceVal,
      stdDev: stdDevVal,
      pdfData,
      fx: fx_val,
      probLessThanOrEqualX: probLessThanOrEqualX_val,
      probGreaterThanX: probGreaterThanX_val,
    };

    return { type: CalculationMode.EXPONENTIAL_DISTRIBUTION, data: resultsContent };
  }

  public static calculateSamplingDistributionMeans(input: SamplingMeansInput): SamplingMeansResultsContent {
    const { populationMean, populationStdDev, sampleSize, sampleMeanXBar } = input;

    if (populationStdDev <= 0) throw new Error("Desviación estándar poblacional (σ) debe ser positiva.");
    if (sampleSize <= 0) throw new Error("Tamaño de muestra (n) debe ser un entero positivo.");

    const distMean = populationMean; 
    const stdError = populationStdDev / Math.sqrt(sampleSize); 
    const isTLCApplied = sampleSize >= 30;

    const pdfData: ChartDataPoint[] = [];
    const range = stdError * 8; 
    const minX = distMean - range / 2;
    const step = range / (SAMPLING_DISTRIBUTION_PDF_POINTS_COUNT - 1);
    for (let i = 0; i < SAMPLING_DISTRIBUTION_PDF_POINTS_COUNT; i++) {
      const currentX = minX + i * step;
      pdfData.push({ name: currentX, value: this.normalPDF(currentX, distMean, stdError) });
    }
    
    let zScore: number | undefined;
    let probLessThanXBar: number | undefined;
    let probGreaterThanXBar: number | undefined;

    if (sampleMeanXBar !== undefined && stdError > 0) {
      zScore = (sampleMeanXBar - distMean) / stdError;
      probLessThanXBar = this.normalCDF(sampleMeanXBar, distMean, stdError);
      probGreaterThanXBar = 1 - probLessThanXBar;
    }

    return {
      distMean,
      stdError,
      sampleSize,
      populationMean,
      populationStdDev,
      sampleMeanXBar,
      zScore,
      probLessThanXBar,
      probGreaterThanXBar,
      isTLCApplied,
      pdfData,
    };
  }

  public static calculateSamplingDistributionProportions(input: SamplingProportionsInput): SamplingProportionsResultsContent {
    const { populationProportion, sampleSize, sampleProportionPHat } = input;

    if (populationProportion < 0 || populationProportion > 1) throw new Error("Proporción poblacional (p) debe estar entre 0 y 1.");
    if (sampleSize <= 0) throw new Error("Tamaño de muestra (n) debe ser un entero positivo.");
    if (populationProportion === 0 || populationProportion === 1) throw new Error("Proporción poblacional (p) no puede ser 0 o 1 para aproximación normal.");


    const distMean = populationProportion; 
    const stdError = Math.sqrt((populationProportion * (1 - populationProportion)) / sampleSize); 
    
    const npValue = sampleSize * populationProportion;
    const n1pValue = sampleSize * (1 - populationProportion);
    const meetsNormalApproximation = npValue >= 10 && n1pValue >= 10;

    const pdfData: ChartDataPoint[] = [];
    if (stdError > 0) { 
        const range = stdError * 8; 
        const minP = Math.max(0, distMean - range / 2); 
        const maxP = Math.min(1, distMean + range / 2);
        const step = (maxP - minP) / (SAMPLING_DISTRIBUTION_PDF_POINTS_COUNT - 1); 
        
        if (step > 0) { 
            for (let i = 0; i < SAMPLING_DISTRIBUTION_PDF_POINTS_COUNT; i++) {
                const currentP = minP + i * step;
                pdfData.push({ name: currentP, value: this.normalPDF(currentP, distMean, stdError) });
            }
        } else { 
             pdfData.push({ name: minP, value: this.normalPDF(minP, distMean, stdError) });
        }
    }


    let zScore: number | undefined;
    let probLessThanPHat: number | undefined;
    let probGreaterThanPHat: number | undefined;

    if (sampleProportionPHat !== undefined && meetsNormalApproximation && stdError > 0) {
      zScore = (sampleProportionPHat - distMean) / stdError;
      probLessThanPHat = this.normalCDF(sampleProportionPHat, distMean, stdError);
      probGreaterThanPHat = 1 - probLessThanPHat;
    }

    return {
      distMean,
      stdError,
      sampleSize,
      populationProportion,
      sampleProportionPHat,
      zScore,
      probLessThanPHat,
      probGreaterThanPHat,
      meetsNormalApproximation,
      npValue,
      n1pValue,
      pdfData,
    };
  }

  public static calculateConfidenceIntervalMeanSigmaKnown(input: ConfidenceIntervalMeanSigmaKnownInput): ConfidenceIntervalMeanSigmaKnownResultContent {
    const { sampleMean, populationSigma, sampleSize, confidenceLevel } = input;

    if (populationSigma <= 0) throw new Error("Desviación estándar poblacional (σ) debe ser positiva.");
    if (sampleSize <= 0) throw new Error("Tamaño de muestra (n) debe ser entero positivo.");

    let zCritical: number;
    switch (confidenceLevel) {
      case 90: zCritical = 1.645; break;
      case 95: zCritical = 1.960; break;
      case 98: zCritical = 2.326; break;
      case 99: zCritical = 2.576; break;
      default: throw new Error("Nivel de confianza no soportado. Use 90, 95, 98, o 99.");
    }

    const standardError = populationSigma / Math.sqrt(sampleSize);
    const marginOfError = zCritical * standardError;
    const lowerBound = sampleMean - marginOfError;
    const upperBound = sampleMean + marginOfError;

    const interpretation = `Con un ${confidenceLevel}% de confianza, se estima que la verdadera media poblacional (μ) se encuentra entre ${lowerBound.toFixed(4)} y ${upperBound.toFixed(4)}.`;

    return {
      sampleMean,
      populationSigma,
      sampleSize,
      confidenceLevel,
      zCritical,
      standardError,
      marginOfError,
      lowerBound,
      upperBound,
      interpretation,
    };
  }

  public static generateRandomData(input: DataSimulatorInput): { generatedData: number[]; parameters: DataSimulatorInput } {
    const generatedData: number[] = [];
    const { distributionType, nPoints } = input;

    if (nPoints <= 0) {
      return { generatedData, parameters: input };
    }

    switch (distributionType) {
      case SimulatorDistributionType.UNIFORM:
        const min = input.uniformMin ?? 0;
        const max = input.uniformMax ?? 1;
        if (min > max) {
          throw new Error("Distribución Uniforme: Mínimo debe ser menor o igual que Máximo.");
        }
        for (let i = 0; i < nPoints; i++) {
          if (min === max) { 
            generatedData.push(min);
          } else {
            generatedData.push(Math.random() * (max - min) + min);
          }
        }
        break;
      case SimulatorDistributionType.NORMAL:
        const mean = input.normalMean ?? 0;
        const stdDev = input.normalStdDev ?? 1;
        if (stdDev <= 0) {
            throw new Error("Distribución Normal: Desviación estándar debe ser positiva.");
        }
        for (let i = 0; i < nPoints; i++) {
          let u1, u2;
          do {
            u1 = Math.random();
          } while (u1 === 0); 
          u2 = Math.random();
          
          const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
          generatedData.push(mean + stdDev * z0);
        }
        break;
      case SimulatorDistributionType.BINOMIAL:
        const n = input.binomialN ?? 10;
        const p = input.binomialP ?? 0.5;
        if (n <= 0 || !Number.isInteger(n)) throw new Error("Número de ensayos (n) debe ser un entero positivo.");
        if (p < 0 || p > 1) throw new Error("Probabilidad de éxito (p) debe estar entre 0 y 1.");
        for (let i = 0; i < nPoints; i++) {
            let successes = 0;
            for (let j = 0; j < n; j++) {
                if (Math.random() < p) {
                    successes++;
                }
            }
            generatedData.push(successes);
        }
        break;
      case SimulatorDistributionType.POISSON:
        const lambda = input.poissonLambda ?? 1;
        if (lambda <= 0) throw new Error("Tasa Lambda (λ) debe ser positiva.");
        for (let i = 0; i < nPoints; i++) {
            let k_poisson = 0;
            let prod = 1;
            const limit = Math.exp(-lambda);
            do {
                prod *= Math.random();
                if (prod > limit) { // Check before incrementing k_poisson
                    k_poisson++;
                }
            } while (prod > limit);
            generatedData.push(k_poisson);
        }
        break;
      default:
        // This attempts to satisfy TypeScript's exhaustiveness check for the switch
        const exhaustiveCheck: never = distributionType;
        throw new Error(`Simulación para el tipo de distribución '${exhaustiveCheck}' no implementada.`);
    }
    return { generatedData, parameters: input };
  }

  public static calculateDiscreteRVAnalysis(inputs: Array<{ x: number; p: number }>): DiscreteRVResultsContent {
    if (!inputs || inputs.length === 0) {
      throw new Error("No se proporcionaron datos para el análisis de la variable aleatoria discreta.");
    }

    const sumOfProbabilities = inputs.reduce((sum, row) => sum + row.p, 0);
    if (Math.abs(sumOfProbabilities - 1) > 1e-9) { 
      throw new Error(`La suma de las probabilidades P(X=x) debe ser 1 (actualmente es ${sumOfProbabilities.toFixed(6)}).`);
    }
    
    if (inputs.some(row => row.p < 0)) {
        throw new Error("Todas las probabilidades P(X=x) deben ser no negativas.");
    }

    let expectedValue = 0;
    for (const row of inputs) {
      expectedValue += row.x * row.p;
    }

    let variance = 0;
    for (const row of inputs) {
      variance += Math.pow(row.x - expectedValue, 2) * row.p;
    }

    const stdDev = Math.sqrt(variance);

    return {
      mean: expectedValue,
      variance,
      stdDev,
      summaryTable: inputs.map(row => ({ x: row.x, p: row.p })) 
    };
  }

  public static calculateBayesTheorem(input: BayesTheoremInput): BayesTheoremResultsContent {
    const { probA, probBGivenA, probBGivenNotA } = input;

    if (probA < 0 || probA > 1) throw new Error("P(A) debe estar entre 0 y 1.");
    if (probBGivenA < 0 || probBGivenA > 1) throw new Error("P(B|A) debe estar entre 0 y 1.");
    if (probBGivenNotA < 0 || probBGivenNotA > 1) throw new Error("P(B|¬A) debe estar entre 0 y 1.");

    const probNotA = 1 - probA;
    const probB = (probBGivenA * probA) + (probBGivenNotA * probNotA);

    if (probB === 0) {
      const numerator = probBGivenA * probA;
      if (numerator === 0) {
        return { probA, probBGivenA, probBGivenNotA, probNotA, probB, probAGivenB: 0 };
      }
    }
    
    const probAGivenB = probB === 0 ? NaN : (probBGivenA * probA) / probB; // Handle division by zero

    return {
      probA,
      probBGivenA,
      probBGivenNotA,
      probNotA,
      probB,
      probAGivenB,
    };
  }
}
