export type PageMode = 
  | 'landing' 
  | 'dashboard' 
  | 'analysis' 
  | 'history' 
  | 'reports' 
  | 'benchmark' 
  | 'settings' 
  | 'space3d' 
  | 'login' 
  | 'signup';

export type TaskType = 
  | 'VQA' 
  | 'Change Detection' 
  | 'Captioning' 
  | 'Grounding' 
  | 'Optical-SAR Fusion';

export type ModalityType = 'optical' | 'sar' | 'bitemporal' | 'fused';

export type ConfidenceLevel = 'High' | 'Medium' | 'Low' | 'Cannot answer';

export interface BoundingBox {
  id: string;
  label: string;
  category: string;
  confidence: number;
  // Normalized 0 to 100 percentage coordinates [top, left, width, height]
  top: number;
  left: number;
  width: number;
  height: number;
  color?: string;
  evidence?: string;
}

export interface SatelliteMetadata {
  filename: string;
  format: string; // 'GeoTIFF' | 'Cloud-Optimized GeoTIFF' | 'NITF'
  sensor: string; // 'Sentinel-2 MSI' | 'Sentinel-1 C-SAR' | 'WorldView-3' | 'Landsat-9'
  modality: 'Optical (RGB/NIR)' | 'SAR (C-Band VV+VH)' | 'Bi-temporal Optical' | 'Fused Optical-SAR';
  acquisitionDate: string;
  resolution: string; // e.g. '0.5m GSD' or '10m GSD'
  crs: string; // 'EPSG:4326 (WGS84)' | 'EPSG:32631 (UTM 31N)'
  dimensions: string; // '2048 x 2048 px'
  cloudCover?: string; // '1.2%'
  polarization?: string; // 'VV + VH'
  bands?: string[];
  bounds: {
    lat: number;
    lng: number;
    zoom: number;
    locationName: string;
  };
  validation: {
    crsValid: boolean;
    georeferenceValid: boolean;
    radiometricCalibration: boolean;
    compatibilityCheck: 'PASS' | 'FAIL' | 'WARNING';
    statusText: string;
    details: string[];
  };
}

export interface ExecutionTraceStep {
  stepNumber: number;
  toolName: string;
  description: string;
  status: 'SUCCESS' | 'RUNNING' | 'SKIPPED' | 'FAILED';
  durationMs: number;
  parameters: Record<string, string | number | boolean | string[]>;
  outputSummary: string;
}

export interface ExecutionTrace {
  runId: string;
  timestamp: string;
  taskClassification: TaskType;
  modelPipeline: string;
  toolsExecuted: string[];
  validationStatus: 'PASS' | 'FAIL';
  executionTimeSec: number;
  steps: ExecutionTraceStep[];
  memoryUsageMb: number;
  crossAttentionScore: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: string;
  content: string;
  taskType?: TaskType;
  confidenceScore?: number;
  confidenceLevel?: ConfidenceLevel;
  toolsUsed?: string[];
  runId?: string;
  visualEvidenceUrl?: string;
  boundingBoxes?: BoundingBox[];
  opticalSarAnalysis?: {
    opticalAnswer: string;
    opticalConfidence: number;
    sarAnswer: string;
    sarConfidence: number;
    fusedAnswer: string;
    fusedConfidence: number;
    conflictDetected: boolean;
    conflictReason?: string;
  };
}

export interface PresetScenario {
  id: string;
  title: string;
  subtitle: string;
  taskType: TaskType;
  modality: ModalityType;
  location: string;
  suggestedQueries: string[];
  primaryImage: string;
  secondaryImage?: string; // T2 or SAR
  changeMapImage?: string;
  heatmapImage?: string;
  primaryMetadata: SatelliteMetadata;
  secondaryMetadata?: SatelliteMetadata;
  sampleAnswer: string;
  confidenceScore: number;
  confidenceLevel: ConfidenceLevel;
  toolsUsed: string[];
  boundingBoxes: BoundingBox[];
  executionTrace: ExecutionTrace;
  conflictDetails?: {
    hasConflict: boolean;
    description: string;
    opticalInterpretation: string;
    sarInterpretation: string;
    resolutionRule: string;
  };
}

export interface BenchmarkMetric {
  dataset: string;
  task: string;
  sampleCount: number;
  accuracy: number;
  precision: number;
  recall: number;
  mIoU?: number;
  avgLatencyMs: number;
  status: 'Verified' | 'Benchmarking' | 'Pending';
}
