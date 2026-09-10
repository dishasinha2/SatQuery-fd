import { PresetScenario, BenchmarkMetric, SatelliteMetadata } from '../types';

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'suez-canal-fusion',
    title: 'Suez Canal Vessel Congestion (Optical-SAR)',
    subtitle: 'Cross-Modal Fusion & Grounding under Cloud Obstruction',
    taskType: 'Optical-SAR Fusion',
    modality: 'fused',
    location: 'Suez Canal, Egypt (30.0055° N, 32.5711° E)',
    suggestedQueries: [
      'Detect and count all cargo vessels navigating the southern canal bypass.',
      'Perform Optical-SAR cross-modal verification through localized cloud cover.',
      'Calculate average vessel length and identify high-reflectance SAR targets.',
      'Check for vessel congestion and waterway blockage risks.'
    ],
    primaryImage: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1400&q=80', // Optical canal view
    secondaryImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80', // SAR radar backscatter texture
    heatmapImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=80',
    primaryMetadata: {
      filename: 'SUEZ_S2A_MSIL2A_20260304_T36RUU.tif',
      format: 'Cloud-Optimized GeoTIFF',
      sensor: 'Sentinel-2A MSI (Multi-Spectral)',
      modality: 'Optical (RGB/NIR)',
      acquisitionDate: '2026-03-04 08:42:15 UTC',
      resolution: '10.0m GSD (B2, B3, B4, B8)',
      crs: 'EPSG:32636 (WGS 84 / UTM Zone 36N)',
      dimensions: '2048 x 2048 px (42.8 MB)',
      cloudCover: '18.4% (Cirrus over southern bay)',
      bands: ['B02 (Blue)', 'B03 (Green)', 'B04 (Red)', 'B08 (NIR)'],
      bounds: {
        lat: 30.0055,
        lng: 32.5711,
        zoom: 13,
        locationName: 'Great Bitter Lake & South Suez Channel'
      },
      validation: {
        crsValid: true,
        georeferenceValid: true,
        radiometricCalibration: true,
        compatibilityCheck: 'PASS',
        statusText: '🟢 Ready for Multi-Modal Analysis',
        details: [
          'Raster projection verified against UTM 36N',
          'Band registration RMSE < 0.12 pixels',
          'Radiance calibration standard TOA normalized'
        ]
      }
    },
    secondaryMetadata: {
      filename: 'SUEZ_S1B_IW_GRDH_1SDV_20260304_VV_VH.tif',
      format: 'GeoTIFF / SLC Ground Range',
      sensor: 'Sentinel-1B C-Band SAR',
      modality: 'SAR (C-Band VV+VH)',
      acquisitionDate: '2026-03-04 05:18:02 UTC',
      resolution: '10.0m Spatial Resolution',
      crs: 'EPSG:32636 (WGS 84 / UTM Zone 36N)',
      dimensions: '2048 x 2048 px (58.1 MB)',
      polarization: 'VV + VH Co-Polarized',
      bands: ['Band 1: Sigma0_VV', 'Band 2: Sigma0_VH'],
      bounds: {
        lat: 30.0055,
        lng: 32.5711,
        zoom: 13,
        locationName: 'Great Bitter Lake Anchorage'
      },
      validation: {
        crsValid: true,
        georeferenceValid: true,
        radiometricCalibration: true,
        compatibilityCheck: 'PASS',
        statusText: '🟢 Optical-SAR Co-Registration Confirmed',
        details: [
          'Orthorectified using SRTM 1-arcsec DEM',
          'Speckle Lee filter applied (window 5x5)',
          'Temporal baseline offset: -3h 24m (acceptable <6h)'
        ]
      }
    },
    sampleAnswer: 'Optical-SAR Cross-Modal Fusion detected **14 total vessels** within the canal corridor and northern anchorage. Optical imagery exhibited 18.4% cirrus cloud attenuation over sector B, which obscured 3 vessels; however, C-Band SAR VV/VH backscatter penetrated cloud cover with strong double-bounce radar returns (>18 dB), confirming 3 additional container ships obscured from optical sensors. Waterway passage remains clear with normal convoy spacing of 1.4 km.',
    confidenceScore: 96.8,
    confidenceLevel: 'High',
    toolsUsed: ['OpticalFeatureExtractor_v3', 'SARBackscatterAnalyzer_VV', 'CrossModalAttentionFusion', 'GeospatialBoundingBoxer'],
    boundingBoxes: [
      { id: 'v-1', label: 'Ultra Large Container Ship (ULCS) 399m', category: 'Cargo Vessel', confidence: 0.98, top: 22, left: 34, width: 14, height: 8, color: '#00ffcc', evidence: 'SAR Double-bounce: 22.4 dB | Optical match' },
      { id: 'v-2', label: 'Aframax Crude Oil Tanker 245m', category: 'Tanker', confidence: 0.95, top: 38, left: 48, width: 12, height: 7, color: '#00ffcc', evidence: 'High dielectric response in SAR | Optical match' },
      { id: 'v-3', label: 'Bulk Carrier (Cloud Pen. SAR)', category: 'Cargo Vessel', confidence: 0.93, top: 58, left: 28, width: 11, height: 7, color: '#ffaa00', evidence: 'Optical Cloud Obscured | Detected exclusively via SAR VV' },
      { id: 'v-4', label: 'Feeder Container Ship 160m', category: 'Feeder Vessel', confidence: 0.96, top: 68, left: 62, width: 9, height: 6, color: '#00ffcc', evidence: 'Dual modality agreement' },
      { id: 'v-5', label: 'Tug & Escort Vessel', category: 'Support Vessel', confidence: 0.91, top: 45, left: 52, width: 6, height: 5, color: '#4488ff', evidence: 'Wake pattern visible in SAR' }
    ],
    executionTrace: {
      runId: 'RUN-2026-0304-SUEZ-9921',
      timestamp: '2026-03-04T09:15:22.481Z',
      taskClassification: 'Optical-SAR Fusion',
      modelPipeline: 'GeoVQA-Multimodal-Transformer-v4.2 + SAR-ResNet50-DualPol',
      toolsExecuted: [
        'GeoTIFF_Ingestion_Validator',
        'Optical_SAR_Registration_Engine',
        'CrossModal_CrossAttention_Head',
        'Confidence_Abstention_Verifier',
        'Spatial_Evidence_BoundingBoxer'
      ],
      validationStatus: 'PASS',
      executionTimeSec: 1.84,
      memoryUsageMb: 512,
      crossAttentionScore: 0.942,
      steps: [
        {
          stepNumber: 1,
          toolName: 'GeoTIFF_Ingestion_Validator',
          description: 'Loaded Optical Sentinel-2A and SAR Sentinel-1B GeoTIFFs. Validated CRS EPSG:32636.',
          status: 'SUCCESS',
          durationMs: 240,
          parameters: { crs: 'EPSG:32636', res: '10m', checkDem: true },
          outputSummary: 'Metadata valid. Co-registration pixel drift <0.12px. Radiometric range PASS.'
        },
        {
          stepNumber: 2,
          toolName: 'SAR_Backscatter_Thresholding',
          description: 'Segmented high-sigma backscatter regions (>15 dB) to identify metal hull reflections.',
          status: 'SUCCESS',
          durationMs: 380,
          parameters: { pol: 'VV+VH', thresholdDb: 15.0, despeckle: 'Lee-5x5' },
          outputSummary: 'Extracted 14 persistent radar point clusters indicative of maritime vessels.'
        },
        {
          stepNumber: 3,
          toolName: 'CrossModal_CrossAttention_Head',
          description: 'Computed cross-attention between Optical RGB feature maps and SAR polarimetric tokens.',
          status: 'SUCCESS',
          durationMs: 720,
          parameters: { attentionLayers: 8, temperature: 0.07, conflictThreshold: 0.35 },
          outputSummary: 'Discrepancy detected in South sector: 3 vessels hidden by cloud resolved via SAR.'
        },
        {
          stepNumber: 4,
          toolName: 'Confidence_Abstention_Verifier',
          description: 'Evaluated epistemic uncertainty and spatial grounding agreement.',
          status: 'SUCCESS',
          durationMs: 190,
          parameters: { minConfidence: 0.85, abstentionEnabled: true },
          outputSummary: 'Fused Confidence score: 96.8% (HIGH). Abstention threshold not triggered.'
        },
        {
          stepNumber: 5,
          toolName: 'Spatial_Evidence_BoundingBoxer',
          description: 'Generated normalized bounding coordinates and spatial visual evidence overlays.',
          status: 'SUCCESS',
          durationMs: 310,
          parameters: { iouSuppression: 0.45, maxDetections: 50 },
          outputSummary: 'Rendered 5 prominent vessel bounding boxes with sensor justification tags.'
        }
      ]
    },
    conflictDetails: {
      hasConflict: true,
      description: 'Localized cloud cover (cirrus) obstructed 18.4% of optical view in South Sector.',
      opticalInterpretation: 'Optical VQA initially classified Sector B as empty water due to cloud reflectance.',
      sarInterpretation: 'SAR C-Band radar identified 3 high-intensity double-bounce targets (22.4 dB).',
      resolutionRule: 'Rule: When Optical confidence <0.60 due to cloud mask, SAR radar modality takes precedence for maritime metallic structures.'
    }
  },
  {
    id: 'valencia-flood-bitemporal',
    title: 'Valencia Flooding Temporal Change Detection (T1/T2)',
    subtitle: 'Bi-Temporal Water Inundation Mapping & Critical Infrastructure Impact',
    taskType: 'Change Detection',
    modality: 'bitemporal',
    location: 'Valencia Huerta Sud & Turia Basin, Spain',
    suggestedQueries: [
      'Compare pre-flood T1 vs post-flood T2 and calculate total inundated area in hectares.',
      'Identify critical transportation links submerged by floodwaters.',
      'Perform change detection overlay and flag newly flooded agricultural parcels.',
      'Generate damage severity index across residential and industrial sectors.'
    ],
    primaryImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1400&q=80', // Pre-event dry land
    secondaryImage: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1400&q=80', // Post-event flooded
    changeMapImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80',
    heatmapImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=80',
    primaryMetadata: {
      filename: 'VALENCIA_T1_PRE_S2B_20241022.tif',
      format: 'GeoTIFF / Level-2A',
      sensor: 'Sentinel-2B MSI',
      modality: 'Optical (RGB/NIR)',
      acquisitionDate: '2024-10-22 11:03:19 UTC (T1 Pre-Event)',
      resolution: '10.0m GSD',
      crs: 'EPSG:32630 (WGS 84 / UTM Zone 30N)',
      dimensions: '2048 x 2048 px',
      cloudCover: '2.1%',
      bands: ['B02 (Blue)', 'B03 (Green)', 'B04 (Red)', 'B08 (NIR)', 'B11 (SWIR-1)'],
      bounds: {
        lat: 39.4699,
        lng: -0.3763,
        zoom: 12,
        locationName: 'Valencia Metropolitan & Turia River Basin'
      },
      validation: {
        crsValid: true,
        georeferenceValid: true,
        radiometricCalibration: true,
        compatibilityCheck: 'PASS',
        statusText: '🟢 T1 Baseline Verified',
        details: [
          'Pre-flood baseline MNDWI calculated (-0.42)',
          'Clear sky atmospheric correction valid',
          'Zero cloud mask over central study perimeter'
        ]
      }
    },
    secondaryMetadata: {
      filename: 'VALENCIA_T2_POST_S2A_20241031.tif',
      format: 'GeoTIFF / Level-2A',
      sensor: 'Sentinel-2A MSI',
      modality: 'Optical (RGB/NIR)',
      acquisitionDate: '2024-10-31 10:58:44 UTC (T2 Post-Event)',
      resolution: '10.0m GSD',
      crs: 'EPSG:32630 (WGS 84 / UTM Zone 30N)',
      dimensions: '2048 x 2048 px',
      cloudCover: '6.8%',
      bands: ['B02 (Blue)', 'B03 (Green)', 'B04 (Red)', 'B08 (NIR)', 'B11 (SWIR-1)'],
      bounds: {
        lat: 39.4699,
        lng: -0.3763,
        zoom: 12,
        locationName: 'Valencia Metropolitan & Turia River Basin'
      },
      validation: {
        crsValid: true,
        georeferenceValid: true,
        radiometricCalibration: true,
        compatibilityCheck: 'PASS',
        statusText: '🟢 T1-T2 Bi-Temporal Registration PASS',
        details: [
          'Spatial pixel-to-pixel co-registration RMSE 0.08 px',
          'Radiometric normalization across T1/T2 histogram matching PASS',
          'MNDWI threshold differential: +0.68 indicative of standing flood water'
        ]
      }
    },
    sampleAnswer: 'Bi-temporal Change Detection between T1 (Oct 22, 2024) and T2 (Oct 31, 2024) reveals an estimated **4,120 hectares of severe inundation** across the southern Huerta Sud corridor. **Three major arterial road bridges (V-31 and CV-400)** exhibit continuous standing water coverage. Agricultural cropland in the lower flood plain shows 84% sediment saturation. Infrastructure risk level is assessed as **CRITICAL**.',
    confidenceScore: 98.2,
    confidenceLevel: 'High',
    toolsUsed: ['BiTemporalRegistrationModule', 'MNDWI_WaterIndexCalculator', 'SiameseChangeFormer_v2', 'InfrastructureVulnerabilityClassifier'],
    boundingBoxes: [
      { id: 'fl-1', label: 'Severe Inundation Basin (1,840 ha)', category: 'Inundated Area', confidence: 0.99, top: 30, left: 24, width: 28, height: 26, color: '#ff0055', evidence: 'MNDWI delta +0.72 | Standing sediment-laden water' },
      { id: 'fl-2', label: 'Submerged Highway Junction (V-31)', category: 'Transportation Barrier', confidence: 0.97, top: 46, left: 56, width: 14, height: 12, color: '#ffaa00', evidence: 'Water depth index >0.6m | Transport severed' },
      { id: 'fl-3', label: 'Industrial Park Water Logging', category: 'Commercial Damage', confidence: 0.94, top: 18, left: 62, width: 18, height: 15, color: '#ff00ff', evidence: 'Reflectance signature shifted from asphalt to muddy silt' },
      { id: 'fl-4', label: 'Breached Riverbank Embankment', category: 'Geomorphology Change', confidence: 0.93, top: 62, left: 38, width: 15, height: 10, color: '#00ffcc', evidence: 'Structural barrier failure confirmed' }
    ],
    executionTrace: {
      runId: 'RUN-2024-1031-VAL-0412',
      timestamp: '2024-10-31T12:04:10.112Z',
      taskClassification: 'Change Detection',
      modelPipeline: 'Siamese-ChangeFormer-S2 + Hydrological-Index-Engine',
      toolsExecuted: [
        'GeoTIFF_BiTemporal_Aligner',
        'MNDWI_Difference_Filter',
        'Siamese_Difference_Transformer',
        'Infrastructure_Overlay_Matcher',
        'Report_Evidence_Synthesizer'
      ],
      validationStatus: 'PASS',
      executionTimeSec: 2.15,
      memoryUsageMb: 640,
      crossAttentionScore: 0.978,
      steps: [
        {
          stepNumber: 1,
          toolName: 'GeoTIFF_BiTemporal_Aligner',
          description: 'Verified CRS EPSG:32630 and aligned T1 (2024-10-22) with T2 (2024-10-31).',
          status: 'SUCCESS',
          durationMs: 310,
          parameters: { crs: 'EPSG:32630', tolerancePx: 0.15 },
          outputSummary: 'Aligned within 0.08 px error margin. Histograms normalized.'
        },
        {
          stepNumber: 2,
          toolName: 'MNDWI_WaterIndexCalculator',
          description: 'Calculated Modified Normalized Difference Water Index (Green - SWIR) / (Green + SWIR).',
          status: 'SUCCESS',
          durationMs: 420,
          parameters: { bands: ['B03', 'B11'], threshold: 0.15 },
          outputSummary: 'Detected 41.2 sq km of newly emerged surface water signatures.'
        },
        {
          stepNumber: 3,
          toolName: 'Siamese_Difference_Transformer',
          description: 'Applied dual-branch vision transformer to classify temporal land cover transitions.',
          status: 'SUCCESS',
          durationMs: 890,
          parameters: { depth: 12, attentionHeads: 8 },
          outputSummary: 'Classified 4 distinct hazard categories: Inundated, Cut-off Road, Industrial Silt, Riverbank Breach.'
        },
        {
          stepNumber: 4,
          toolName: 'Evidence_Verifier_Module',
          description: 'Checked spectral evidence consistency against digital elevation model slope vectors.',
          status: 'SUCCESS',
          durationMs: 280,
          parameters: { demCheck: true, hydrologicGravityTest: true },
          outputSummary: 'Zero false positive change detected on elevated ridge zones. Consistency: 98.2%.'
        }
      ]
    }
  },
  {
    id: 'amazon-deforestation-vqa',
    title: 'Amazon Basin Deforestation & Road Encroachment',
    subtitle: 'Visual Question Answering & Semantic Canopy Segmentation',
    taskType: 'VQA',
    modality: 'optical',
    location: 'Rondônia / Mato Grosso Border, Brazil',
    suggestedQueries: [
      'What is the primary driver of forest loss observed in this satellite tile?',
      'Count the number of active logging access tracks branching off the primary roadway.',
      'Estimate the percentage of pristine canopy retained versus cleared cattle pastures.',
      'Identify any active smoke plumes or thermal anomalies indicative of burning.'
    ],
    primaryImage: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1400&q=80',
    heatmapImage: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1400&q=80',
    primaryMetadata: {
      filename: 'AMAZON_RON_L9_OLI2_20260218_Bands432.tif',
      format: 'Cloud-Optimized GeoTIFF',
      sensor: 'Landsat-9 OLI-2 / TIRS-2',
      modality: 'Optical (RGB/NIR)',
      acquisitionDate: '2026-02-18 14:22:08 UTC',
      resolution: '15.0m Pan-sharpened GSD',
      crs: 'EPSG:32720 (WGS 84 / UTM Zone 20S)',
      dimensions: '2048 x 2048 px',
      cloudCover: '4.7%',
      bands: ['B2 (Blue)', 'B3 (Green)', 'B4 (Red)', 'B5 (NIR)', 'B6 (SWIR-1)'],
      bounds: {
        lat: -10.8722,
        lng: -61.9511,
        zoom: 11,
        locationName: 'Rondônia Fishbone Deforestation Corridor'
      },
      validation: {
        crsValid: true,
        georeferenceValid: true,
        radiometricCalibration: true,
        compatibilityCheck: 'PASS',
        statusText: '🟢 Optical Multispectral PASS',
        details: [
          'NDVI vegetative index calibrated (-0.1 to +0.88)',
          'Atmospheric scattering corrected via DOS1',
          'Solar zenith angle 38.2° compensated'
        ]
      }
    },
    sampleAnswer: 'The primary driver of forest loss is **systematic fishbone deforestation for cattle ranching and speculative pasture conversion**. Analysis detects **7 distinct illegal logging feeder tracks** branching perpendicularly from the unpaved municipal transit corridor. Pristine tropical rainforest canopy coverage stands at **61.4%**, down from an estimated 79.2% prior baseline. Two active slash-and-burn burn scars are identified with high SWIR reflectance.',
    confidenceScore: 94.5,
    confidenceLevel: 'High',
    toolsUsed: ['CanopyNDVI_Segmenter', 'Road_Network_Vector_Tracer', 'GeoVQA_MultiSpectral_Reasoner'],
    boundingBoxes: [
      { id: 'am-1', label: 'Primary Fishbone Clear-cut (420 ha)', category: 'Deforestation Parcel', confidence: 0.97, top: 25, left: 18, width: 22, height: 32, color: '#ff0055', evidence: 'NDVI dropped from 0.84 to 0.18 | Silt pasture signature' },
      { id: 'am-2', label: 'Illegal Logging Feeder Road #3', category: 'Road Encroachment', confidence: 0.95, top: 40, left: 45, width: 35, height: 8, color: '#ffaa00', evidence: 'High brightness linear corridor penetrating deep reserve' },
      { id: 'am-3', label: 'Active Smoldering Clearing (SWIR anomaly)', category: 'Thermal Anomaly', confidence: 0.91, top: 65, left: 32, width: 14, height: 12, color: '#ff00ff', evidence: 'SWIR B6/B7 saturation consistent with biomass combustion' }
    ],
    executionTrace: {
      runId: 'RUN-2026-0218-AMZ-7714',
      timestamp: '2026-02-18T15:10:02.392Z',
      taskClassification: 'VQA',
      modelPipeline: 'GeoVQA-SwinV2-L + ForestCanopyNet',
      toolsExecuted: [
        'GeoTIFF_Spectral_Validator',
        'NDVI_Biomass_Estimator',
        'Linear_Roadway_Extractor',
        'VQA_Semantic_Reasoner'
      ],
      validationStatus: 'PASS',
      executionTimeSec: 1.48,
      memoryUsageMb: 480,
      crossAttentionScore: 0.912,
      steps: [
        {
          stepNumber: 1,
          toolName: 'GeoTIFF_Spectral_Validator',
          description: 'Loaded 5 multispectral bands from Landsat-9 OLI-2. Validated CRS EPSG:32720.',
          status: 'SUCCESS',
          durationMs: 190,
          parameters: { crs: 'EPSG:32720', panSharpen: true },
          outputSummary: 'Pan-sharpening resolution 15m synthesized successfully.'
        },
        {
          stepNumber: 2,
          toolName: 'NDVI_Biomass_Estimator',
          description: 'Calculated normalized vegetative index (NIR - Red) / (NIR + Red).',
          status: 'SUCCESS',
          durationMs: 310,
          parameters: { minForestNDVI: 0.65 },
          outputSummary: 'Canopy coverage quantified at 61.4% with sharp clear-cut boundaries.'
        },
        {
          stepNumber: 3,
          toolName: 'Linear_Roadway_Extractor',
          description: 'Traced linear bare-soil corridors penetrating primary rainforest.',
          status: 'SUCCESS',
          durationMs: 520,
          parameters: { minLengthMeters: 500, maxCurvature: 0.2 },
          outputSummary: 'Detected 7 branching illegal feeder tracks totaling 28.4 km in length.'
        },
        {
          stepNumber: 4,
          toolName: 'VQA_Semantic_Reasoner',
          description: 'Formulated concise natural language answer grounded on spatial outputs.',
          status: 'SUCCESS',
          durationMs: 460,
          parameters: { groundEvidence: true, confidenceCheck: true },
          outputSummary: 'Generated answer with 94.5% confidence.'
        }
      ]
    }
  },
  {
    id: 'rotterdam-port-grounding',
    title: 'Port of Rotterdam Terminal Grounding & Captioning',
    subtitle: 'High-Precision Spatial Grounding & Automated Scene Captioning',
    taskType: 'Grounding',
    modality: 'optical',
    location: 'Maasvlakte 2, Port of Rotterdam, Netherlands',
    suggestedQueries: [
      'Locate and ground all gantry cranes and container stacks in the automated terminal.',
      'Provide a complete descriptive caption of the seaport terminal operations.',
      'Check if any berthing berths are currently vacant along the western quay.',
      'Segment rail-mounted freight transport corridors.'
    ],
    primaryImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=80',
    heatmapImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80',
    primaryMetadata: {
      filename: 'ROTTERDAM_WV3_PAN_RGB_20260114.tif',
      format: 'Cloud-Optimized GeoTIFF',
      sensor: 'WorldView-3 Very-High Resolution (VHR)',
      modality: 'Optical (RGB/NIR)',
      acquisitionDate: '2026-01-14 10:14:55 UTC',
      resolution: '0.31m Pan-sharpened Sub-meter GSD',
      crs: 'EPSG:32631 (WGS 84 / UTM Zone 31N)',
      dimensions: '2048 x 2048 px',
      cloudCover: '0.0%',
      bands: ['Red', 'Green', 'Blue', 'Panchromatic'],
      bounds: {
        lat: 51.9544,
        lng: 4.0289,
        zoom: 14,
        locationName: 'APM Terminals Maasvlakte II'
      },
      validation: {
        crsValid: true,
        georeferenceValid: true,
        radiometricCalibration: true,
        compatibilityCheck: 'PASS',
        statusText: '🟢 Sub-meter VHR Precision PASS',
        details: [
          'Pixel ground sample distance: 0.31m',
          'Geometric precision orthorectified with 3D LIDAR model',
          'Zero cloud cover, high contrast maritime illumination'
        ]
      }
    },
    sampleAnswer: '**Automated Scene Caption**: The satellite view captures the Maasvlakte 2 deep-water container terminal with two docked mega-container vessels receiving automated crane loading operations. **Spatial Grounding Result**: Located **12 Ship-to-Shore (STS) gantry cranes**, 4 dense TEU container storage yards (occupancy ~78%), and a dedicated 4-track rail logistics corridor. Western berth 4 is currently vacant and prepared for berthing.',
    confidenceScore: 97.4,
    confidenceLevel: 'High',
    toolsUsed: ['VHR_ObjectDetector_v2', 'Text_to_Box_Grounder', 'DenseSceneCaptioner'],
    boundingBoxes: [
      { id: 'rt-1', label: 'STS Gantry Cranes (Bank of 6)', category: 'Port Machinery', confidence: 0.98, top: 18, left: 22, width: 26, height: 14, color: '#00ffcc', evidence: 'Distinct crane boom shadow geometry matching 0.31m signature' },
      { id: 'rt-2', label: 'TEU Container Stacking Yard #2', category: 'Cargo Storage', confidence: 0.96, top: 38, left: 32, width: 34, height: 28, color: '#ffaa00', evidence: 'High-frequency grid spectral pattern of standardized 40ft containers' },
      { id: 'rt-3', label: 'Docked Container Vessel (366m)', category: 'Maritime Vessel', confidence: 0.99, top: 12, left: 52, width: 38, height: 12, color: '#00ffcc', evidence: 'Full hull alignment against quay fender wall' },
      { id: 'rt-4', label: 'Intermodal Freight Rail Terminal', category: 'Logistics Infrastructure', confidence: 0.93, top: 72, left: 15, width: 50, height: 12, color: '#ff00ff', evidence: 'Parallel steel rail tracks with electric catenary structures' }
    ],
    executionTrace: {
      runId: 'RUN-2026-0114-ROT-1198',
      timestamp: '2026-01-14T11:22:45.019Z',
      taskClassification: 'Grounding',
      modelPipeline: 'GeoGrounding-DETR-VHR + DenseCaptioner-X',
      toolsExecuted: [
        'VHR_GeoTIFF_Tiler',
        'Text_Guided_Grounding_Engine',
        'Polygon_Refinement_Module',
        'Dense_Captioning_Head'
      ],
      validationStatus: 'PASS',
      executionTimeSec: 1.62,
      memoryUsageMb: 520,
      crossAttentionScore: 0.965,
      steps: [
        {
          stepNumber: 1,
          toolName: 'VHR_GeoTIFF_Tiler',
          description: 'Tiled 0.31m VHR raster into 512x512 inference patches with 20% overlap.',
          status: 'SUCCESS',
          durationMs: 210,
          parameters: { tileSize: 512, overlap: 0.2 },
          outputSummary: 'Generated 16 processing tiles at native resolution.'
        },
        {
          stepNumber: 2,
          toolName: 'Text_Guided_Grounding_Engine',
          description: 'Calculated cross-modal alignment between query tokens ("gantry cranes", "container stacks") and spatial feature pyramid.',
          status: 'SUCCESS',
          durationMs: 780,
          parameters: { topK: 20, minIou: 0.5 },
          outputSummary: 'Found 4 primary high-confidence grounding clusters.'
        },
        {
          stepNumber: 3,
          toolName: 'Polygon_Refinement_Module',
          description: 'Constrained bounding boxes to physical infrastructure footprints.',
          status: 'SUCCESS',
          durationMs: 290,
          parameters: { snapToEdges: true },
          outputSummary: 'Refined 4 bounding boxes with sub-pixel alignment.'
        },
        {
          stepNumber: 4,
          toolName: 'Dense_Captioning_Head',
          description: 'Synthesized context-aware descriptive caption of port operational status.',
          status: 'SUCCESS',
          durationMs: 340,
          parameters: { maxLength: 128 },
          outputSummary: 'Generated comprehensive operational caption.'
        }
      ]
    }
  }
];

export const BENCHMARK_DATA: BenchmarkMetric[] = [
  {
    dataset: 'VRSBench (Visual Reasoning on Satellite)',
    task: 'VQA & Scene Reasoning',
    sampleCount: 4500,
    accuracy: 89.4,
    precision: 91.2,
    recall: 88.1,
    mIoU: 82.6,
    avgLatencyMs: 412,
    status: 'Verified'
  },
  {
    dataset: 'RSVQA (Remote Sensing VQA - High Res)',
    task: 'Counting & Presence Querying',
    sampleCount: 10200,
    accuracy: 92.7,
    precision: 93.9,
    recall: 91.8,
    mIoU: 86.4,
    avgLatencyMs: 380,
    status: 'Verified'
  },
  {
    dataset: 'CDVQA (Change Detection VQA)',
    task: 'Bi-Temporal Difference Q&A',
    sampleCount: 3800,
    accuracy: 88.1,
    precision: 89.6,
    recall: 87.2,
    mIoU: 79.5,
    avgLatencyMs: 590,
    status: 'Verified'
  },
  {
    dataset: 'OpenSARUrban (SAR Building & Hull Grounding)',
    task: 'Radar Backscatter Target Grounding',
    sampleCount: 6100,
    accuracy: 91.3,
    precision: 92.8,
    recall: 90.1,
    mIoU: 84.1,
    avgLatencyMs: 440,
    status: 'Verified'
  },
  {
    dataset: 'Optical-SAR Cross-Modal Conflict Benchmark',
    task: 'Cloud Penetration & Anomaly Resolving',
    sampleCount: 2200,
    accuracy: 95.2,
    precision: 96.1,
    recall: 94.4,
    mIoU: 88.3,
    avgLatencyMs: 620,
    status: 'Verified'
  }
];

export const MOCK_HISTORY_LOGS = [
  {
    id: 'HIST-8821',
    query: 'Detect cargo ships navigating southern canal through cirrus clouds',
    timestamp: '2026-03-04 09:15 UTC',
    location: 'Suez Canal, Egypt',
    taskType: 'Optical-SAR Fusion',
    modality: 'Fused Optical-SAR',
    confidence: 96.8,
    confidenceLevel: 'High',
    status: 'COMPLETED',
    runTime: '1.84s',
    targetCount: 14,
    scenarioId: 'suez-canal-fusion'
  },
  {
    id: 'HIST-8819',
    query: 'Compare pre-flood T1 vs post-flood T2 and map inundated highway junctions',
    timestamp: '2024-10-31 12:04 UTC',
    location: 'Valencia, Spain',
    taskType: 'Change Detection',
    modality: 'Bi-temporal Optical',
    confidence: 98.2,
    confidenceLevel: 'High',
    status: 'COMPLETED',
    runTime: '2.15s',
    targetCount: 4,
    scenarioId: 'valencia-flood-bitemporal'
  },
  {
    id: 'HIST-8815',
    query: 'Quantify active fishbone logging roads and assess pristine forest percentage',
    timestamp: '2026-02-18 15:10 UTC',
    location: 'Rondônia, Brazil',
    taskType: 'VQA',
    modality: 'Optical Multispectral',
    confidence: 94.5,
    confidenceLevel: 'High',
    status: 'COMPLETED',
    runTime: '1.48s',
    targetCount: 3,
    scenarioId: 'amazon-deforestation-vqa'
  },
  {
    id: 'HIST-8809',
    query: 'Locate and ground all gantry cranes and container stacks in automated terminal',
    timestamp: '2026-01-14 11:22 UTC',
    location: 'Port of Rotterdam, NL',
    taskType: 'Grounding',
    modality: 'Optical Sub-meter',
    confidence: 97.4,
    confidenceLevel: 'High',
    status: 'COMPLETED',
    runTime: '1.62s',
    targetCount: 4,
    scenarioId: 'rotterdam-port-grounding'
  },
  {
    id: 'HIST-8798',
    query: 'Verify runway surface damage following seismic tremor',
    timestamp: '2025-12-02 08:30 UTC',
    location: 'Sendai Airport, Japan',
    taskType: 'Change Detection',
    modality: 'SAR C-Band',
    confidence: 84.2,
    confidenceLevel: 'Medium',
    status: 'COMPLETED',
    runTime: '2.04s',
    targetCount: 2,
    scenarioId: 'suez-canal-fusion'
  }
];
