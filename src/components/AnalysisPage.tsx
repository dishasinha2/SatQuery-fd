import React, { useState, useRef } from 'react';
import { PageMode } from '../types';
import { Sidebar } from './Sidebar';
import { useTheme } from '../context/ThemeContext';
import { useSidebar } from '../context/SidebarContext';
import {
  ArrowUp,
  Moon,
  Sun,
  Plus,
  Minus,
  Maximize2,
  Send,
  ChevronUp,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Eye,
  Layers,
  Menu
} from 'lucide-react';

interface AnalysisPageProps {
  currentPage: PageMode;
  onNavigate: (page: PageMode) => void;
  preloadedFile?: File | null;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  confidence?: string;
  groundedFindings?: string[];
}

export const AnalysisPage: React.FC<AnalysisPageProps> = ({
  currentPage,
  onNavigate,
  preloadedFile
}) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { openMobile } = useSidebar();
  const [selectedModality, setSelectedModality] = useState<'Single Image' | 'Bi-Temporal' | 'Optical-SAR'>('Single Image');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [validationStatus, setValidationStatus] = useState<string>('AWAITING INPUT');
  const [isDragging, setIsDragging] = useState(false);

  // Viewer Zoom & Pan
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI Assistant Chat
  const [queryInput, setQueryInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);

  // Execution Trace Drawer
  const [isTraceExpanded, setIsTraceExpanded] = useState<boolean>(false);

  // Prompt suggestions from reference image
  const suggestionChips = [
    'What is visible in this image?',
    'What changed between these two images?',
    'Identify the main objects in this scene.',
    'Compare optical and SAR evidence.'
  ];

  const handleFileUpload = (file: File) => {
    setImageFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setValidationStatus('VERIFIED (PASS)');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleClear = () => {
    setUploadedImage(null);
    setImageFileName(null);
    setValidationStatus('AWAITING INPUT');
    setMessages([]);
    setZoomLevel(1);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleValidate = () => {
    if (!uploadedImage) {
      setValidationStatus('NO FILE LOADED');
      return;
    }
    setIsValidating(true);
    setValidationStatus('ANALYZING METADATA...');
    setTimeout(() => {
      setIsValidating(false);
      setValidationStatus('VERIFIED (PASS)');
    }, 600);
  };

  const handleSendPrompt = (promptText?: string) => {
    const textToSend = promptText || queryInput;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setQueryInput('');
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      let answer = '';
      let confidence = '96.4%';
      let findings: string[] = [];

      if (!uploadedImage) {
        answer = 'No remote sensing imagery is currently loaded in the viewer. Please drag-and-drop a GeoTIFF, TIFF, or high-resolution satellite scene in the Input Imagery panel to ground this analysis.';
        confidence = 'N/A';
      } else if (textToSend.includes('visible')) {
        answer = 'The satellite scene displays a coastal port zone with active commercial navigation lanes. Key observations include deep-water berths, breakwater barriers, and container stacking infrastructure.';
        findings = ['12 Surface Vessels identified', 'Gantry Cranes grounded', 'Water body reflectance normalized'];
      } else if (textToSend.includes('changed')) {
        answer = 'Bi-temporal comparison indicates water surface expansion (+18.4%) across the lower tidal basin and newly developed cargo transit infrastructure along the northern perimeter.';
        findings = ['Sub-pixel registration: 0.18px error', 'MNDWI index difference detected', 'No false positives detected in SAR backscatter'];
      } else if (textToSend.includes('main objects')) {
        answer = 'Target identification extracted cargo container freighters, gantry cranes, rail freight terminals, and perimeter storage yards with high grounding certainty.';
        findings = ['Maritime vessels: High confidence', 'Infrastructure classification: Verified'];
      } else {
        answer = 'Evidence fusion evaluated both optical reflectance and radar penetration. C-band microwave backscatter confirmed solid metal hull reflections, penetrating cloud obstruction.';
        findings = ['Optical confidence: 94.2%', 'SAR cross-attention alignment: 98.1%'];
      }

      const asstMsg: Message = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidence,
        groundedFindings: findings
      };

      setMessages((prev) => [...prev, asstMsg]);
    }, 900);
  };

  return (
    <div
      className={`h-screen w-full flex bg-transparent overflow-hidden select-none font-sans transition-colors ${
        isDarkMode ? 'text-slate-100' : 'text-slate-900'
      }`}
    >
      {/* Left Sidebar */}
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />

      {/* Main Analysis Workspace */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-transparent">
        {/* Top Header matching Reference Image 3 */}
        <header
          className={`h-16 px-4 sm:px-8 border-b flex items-center justify-between flex-shrink-0 backdrop-blur-xl transition-colors ${
            isDarkMode
              ? 'border-slate-700/35 bg-[#081223]/55 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)]'
              : 'border-slate-200/80 bg-white/75 text-slate-950 shadow-xs'
          }`}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={openMobile}
              className={`md:hidden p-2 rounded-xl border transition-colors cursor-pointer ${
                isDarkMode
                  ? 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:text-white'
                  : 'bg-white border-slate-200 text-slate-700 hover:text-black shadow-xs'
              }`}
              aria-label="Open navigation menu"
              title="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1
                className={`text-xl sm:text-2xl font-bold tracking-tight leading-tight ${
                  isDarkMode ? 'text-white' : 'text-slate-950'
                }`}
              >
                Analyze
              </h1>
              <p
                className={`text-xs font-mono mt-0.5 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Remote-sensing analysis workstation
              </p>
            </div>
          </div>

          {/* Theme Toggle Pill on the right */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={`w-11 h-6 rounded-full border p-0.5 flex items-center transition-colors relative cursor-pointer ${
                isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-300'
              }`}
              title="Toggle Theme"
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform ${
                  isDarkMode
                    ? 'translate-x-5 text-cyan-400 bg-slate-900 border border-slate-600'
                    : 'translate-x-0 text-amber-500 bg-white border border-slate-300 shadow-xs'
                }`}
              >
                {isDarkMode ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
              </div>
            </button>
          </div>
        </header>

        {/* 3-Panel Split Workspace */}
        <div className="flex-1 flex overflow-hidden p-4 sm:p-5 gap-4">
          {/* ========================================================= */}
          {/* PANEL 1: INPUT IMAGERY (Left Column)                      */}
          {/* ========================================================= */}
          <section
            className={`w-72 xl:w-80 rounded-2xl border p-4 sm:p-5 flex flex-col justify-between backdrop-blur-xl overflow-y-auto transition-all ${
              isDarkMode
                ? 'bg-[#081223]/55 border-slate-700/35 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.35)]'
                : 'bg-white/75 border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.05)]'
            }`}
          >
            <div className="space-y-4">
              <div
                className={`text-[11px] font-mono tracking-wider uppercase font-semibold ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                INPUT IMAGERY
              </div>

              {/* Modality Selector Tabs */}
              <div className="flex flex-col gap-1.5 font-mono text-xs">
                {(['Single Image', 'Bi-Temporal', 'Optical-SAR'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSelectedModality(mode)}
                    className={`w-full text-left px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      selectedModality === mode
                        ? isDarkMode
                          ? 'bg-slate-800/70 border border-slate-700 text-white font-semibold shadow-xs'
                          : 'bg-slate-100 border border-slate-300 text-slate-950 font-semibold shadow-xs'
                        : isDarkMode
                        ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border border-transparent'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              {/* Drag & Drop Remote Sensing Imagery Upload Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[160px] ${
                  isDragging
                    ? isDarkMode
                      ? 'border-cyan-400 bg-cyan-950/30'
                      : 'border-cyan-600 bg-cyan-50'
                    : isDarkMode
                    ? 'border-slate-700/80 hover:border-cyan-500/50 bg-slate-950/40 hover:bg-slate-950/70'
                    : 'border-slate-300 hover:border-cyan-600 bg-slate-50/70 hover:bg-white shadow-inner'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".tif,.tiff,.geotiff,.png,.jpg,.jpeg"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />

                <ArrowUp className={`w-5 h-5 mb-2.5 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />

                <div
                  className={`font-bold text-[11px] font-mono tracking-wide uppercase mb-1 ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  DROP REMOTE SENSING IMAGERY HERE
                </div>

                <div
                  className={`text-[10px] font-mono mb-2 ${
                    isDarkMode ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  GeoTIFF &bull; TIFF &bull; PNG &bull; JPG &bull; JPEG
                </div>

                <div
                  className={`text-[11px] hover:underline font-mono ${
                    isDarkMode ? 'text-cyan-400' : 'text-cyan-700'
                  }`}
                >
                  or browse files
                </div>

                {imageFileName && (
                  <div className="mt-2 text-[10px] text-emerald-500 font-mono truncate max-w-[200px]">
                    ✓ {imageFileName}
                  </div>
                )}
              </div>

              {/* Validation Status Row */}
              <div
                className={`flex items-center justify-between text-[11px] font-mono border-t pt-3 ${
                  isDarkMode ? 'border-slate-800/70' : 'border-slate-200'
                }`}
              >
                <span className={isDarkMode ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}>
                  VALIDATION
                </span>
                <span
                  className={`font-semibold ${
                    validationStatus.includes('PASS')
                      ? isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                      : validationStatus.includes('ANALYZING')
                      ? isDarkMode ? 'text-cyan-400 animate-pulse' : 'text-cyan-600 animate-pulse'
                      : isDarkMode ? 'text-amber-400' : 'text-amber-600'
                  }`}
                >
                  {validationStatus}
                </span>
              </div>
            </div>

            {/* Clear & Validate Action Buttons */}
            <div
              className={`flex items-center gap-2 pt-4 border-t ${
                isDarkMode ? 'border-slate-800/80' : 'border-slate-200'
              }`}
            >
              <button
                onClick={handleClear}
                className={`flex-1 py-1.5 rounded-full border font-mono text-xs transition-all cursor-pointer ${
                  isDarkMode
                    ? 'border-slate-700 hover:border-slate-600 bg-slate-950/60 hover:bg-slate-900 text-slate-300 hover:text-white'
                    : 'border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 shadow-xs'
                }`}
              >
                Clear
              </button>

              <button
                onClick={handleValidate}
                disabled={isValidating}
                className={`flex-1 py-1.5 rounded-full border font-mono text-xs font-semibold transition-all cursor-pointer ${
                  isDarkMode
                    ? 'border-cyan-500/50 hover:border-cyan-400 bg-cyan-950/30 hover:bg-cyan-950/60 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                    : 'border-slate-900 hover:bg-black bg-slate-900 text-white shadow-xs'
                }`}
              >
                {isValidating ? 'Validating...' : 'Validate'}
              </button>
            </div>
          </section>

          {/* ========================================================= */}
          {/* PANEL 2: IMAGE VIEWER (Center Column)                     */}
          {/* ========================================================= */}
          <section
            className={`flex-1 rounded-2xl border p-4 sm:p-5 flex flex-col justify-between backdrop-blur-xl relative overflow-hidden transition-all ${
              isDarkMode
                ? 'bg-[#081223]/50 border-slate-700/35 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.35)]'
                : 'bg-white/75 border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.05)]'
            }`}
          >
            {/* Viewer Header */}
            <div
              className={`flex items-center justify-between border-b pb-3 z-20 ${
                isDarkMode ? 'border-slate-800/70' : 'border-slate-200'
              }`}
            >
              <div>
                <div
                  className={`text-[11px] font-mono tracking-wider uppercase font-semibold ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  IMAGE VIEWER
                </div>
                <div
                  className={`text-[10px] font-mono mt-0.5 ${
                    isDarkMode ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  SATELLITE IMAGERY
                </div>
              </div>

              {uploadedImage && (
                <div
                  className={`flex items-center gap-2 text-xs font-mono ${
                    isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                      isDarkMode ? 'bg-emerald-400' : 'bg-emerald-600'
                    }`}
                  />
                  <span>Scene Loaded</span>
                </div>
              )}
            </div>

            {/* Canvas Area */}
            <div
              className={`flex-1 relative flex items-center justify-center overflow-hidden my-3 rounded-xl border transition-colors ${
                isDarkMode
                  ? 'bg-slate-950/50 border-slate-900'
                  : 'bg-slate-100/60 border-slate-200'
              }`}
            >
              {uploadedImage ? (
                <div
                  className="w-full h-full flex items-center justify-center overflow-hidden transition-transform duration-200"
                  style={{ transform: `scale(${zoomLevel})` }}
                >
                  <img
                    src={uploadedImage}
                    alt="Loaded Satellite Imagery"
                    className="max-w-full max-h-full object-contain rounded"
                  />
                </div>
              ) : (
                /* Empty State matching Reference Image 3 */
                <div className="flex flex-col items-center justify-center text-center p-6 select-none">
                  {/* Glowing blue dot inside circular ring */}
                  <div
                    className={`w-10 h-10 rounded-full border flex items-center justify-center mb-3.5 ${
                      isDarkMode
                        ? 'border-cyan-500/30 shadow-[0_0_16px_rgba(6,182,212,0.25)]'
                        : 'border-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.15)] bg-cyan-50/50'
                    }`}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        isDarkMode
                          ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.9)] animate-pulse'
                          : 'bg-cyan-600 animate-pulse'
                      }`}
                    />
                  </div>

                  <h3
                    className={`text-sm font-bold tracking-wide font-mono mb-1 ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    IMAGE VIEWER
                  </h3>

                  <p
                    className={`text-xs max-w-xs leading-relaxed ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    Upload imagery to begin analysis.
                  </p>
                </div>
              )}

              {/* Floating Bottom-Right Zoom Bar matching Reference Image 3 */}
              <div
                className={`absolute bottom-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-lg border backdrop-blur-xl text-xs font-mono shadow-md ${
                  isDarkMode
                    ? 'bg-[#081223]/70 border-slate-700/40 text-slate-200'
                    : 'bg-white/85 border-slate-300 text-slate-800'
                }`}
              >
                <button
                  onClick={() => setZoomLevel((z) => Math.min(3, z + 0.25))}
                  className={`p-1 transition-colors cursor-pointer ${
                    isDarkMode ? 'hover:text-white' : 'hover:text-black'
                  }`}
                  title="Zoom In"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.25))}
                  className={`p-1 transition-colors cursor-pointer ${
                    isDarkMode ? 'hover:text-white' : 'hover:text-black'
                  }`}
                  title="Zoom Out"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <div
                  className={`w-px h-3 mx-0.5 ${
                    isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
                  }`}
                />
                <button
                  onClick={() => setZoomLevel(1)}
                  className={`px-1 text-[11px] transition-colors cursor-pointer ${
                    isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-black'
                  }`}
                >
                  Fit
                </button>
                <button
                  onClick={() => setZoomLevel(2)}
                  className={`px-1 text-[11px] transition-colors cursor-pointer ${
                    isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-black'
                  }`}
                >
                  Full
                </button>
              </div>
            </div>

            <div />
          </section>

          {/* ========================================================= */}
          {/* PANEL 3: AI ASSISTANT (Right Column)                      */}
          {/* ========================================================= */}
          <section
            className={`w-80 xl:w-96 rounded-2xl border p-4 sm:p-5 flex flex-col justify-between backdrop-blur-xl transition-all ${
              isDarkMode
                ? 'bg-[#081223]/55 border-slate-700/35 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.35)]'
                : 'bg-white/75 border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.05)]'
            }`}
          >
            {/* Header with Blue Status Dot */}
            <div
              className={`flex items-center justify-between border-b pb-3 ${
                isDarkMode ? 'border-slate-800/70' : 'border-slate-200'
              }`}
            >
              <div
                className={`text-[11px] font-mono tracking-wider uppercase font-semibold ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                AI ASSISTANT
              </div>
              <span
                className={`w-2 h-2 rounded-full animate-pulse ${
                  isDarkMode
                    ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                    : 'bg-cyan-600'
                }`}
              />
            </div>

            {/* Conversation / Suggestion Area */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3 font-mono text-xs">
              {/* Suggestion Chips from Reference Image */}
              {messages.length === 0 && (
                <div className="space-y-2.5">
                  <div className="flex flex-col gap-2">
                    {suggestionChips.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendPrompt(chip)}
                        className={`w-full text-left px-3 py-2 rounded-lg border text-xs transition-all cursor-pointer font-sans ${
                          isDarkMode
                            ? 'bg-slate-950/60 hover:bg-slate-850/80 border-slate-800/80 hover:border-cyan-500/40 text-slate-300'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800 hover:border-cyan-500 shadow-xs'
                        }`}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>

                  {/* Informational Subtitle verbatim from reference */}
                  <p
                    className={`text-xs leading-relaxed font-sans pt-2 ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    Ask a question about your uploaded imagery. Results are grounded in returned evidence.
                  </p>
                </div>
              )}

              {/* Message Feed */}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`text-[10px] mb-1 ${
                      isDarkMode ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    {msg.sender === 'user' ? 'Analyst' : 'SatQuery Vision AI'} &bull; {msg.timestamp}
                  </div>

                  <div
                    className={`p-3 rounded-xl max-w-[92%] leading-relaxed ${
                      msg.sender === 'user'
                        ? isDarkMode
                          ? 'bg-cyan-950/70 border border-cyan-800/50 text-cyan-200'
                          : 'bg-cyan-100/90 border border-cyan-300 text-cyan-950 font-medium'
                        : isDarkMode
                        ? 'bg-slate-950/80 border border-slate-800 text-slate-200'
                        : 'bg-slate-100 border border-slate-200 text-slate-900'
                    }`}
                  >
                    <p className="font-sans text-xs">{msg.text}</p>

                    {msg.groundedFindings && msg.groundedFindings.length > 0 && (
                      <div
                        className={`mt-2.5 pt-2 border-t space-y-1 ${
                          isDarkMode ? 'border-slate-800/70' : 'border-slate-300/60'
                        }`}
                      >
                        <div
                          className={`text-[10px] font-bold ${
                            isDarkMode ? 'text-cyan-400' : 'text-cyan-700'
                          }`}
                        >
                          Grounded Findings:
                        </div>
                        {msg.groundedFindings.map((f, i) => (
                          <div
                            key={i}
                            className={`text-[11px] flex items-center gap-1.5 ${
                              isDarkMode ? 'text-slate-400' : 'text-slate-600'
                            }`}
                          >
                            <span
                              className={`w-1 h-1 rounded-full ${
                                isDarkMode ? 'bg-emerald-400' : 'bg-emerald-600'
                              }`}
                            />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isProcessing && (
                <div
                  className={`flex items-center gap-2 text-xs animate-pulse p-2 ${
                    isDarkMode ? 'text-cyan-400' : 'text-cyan-700'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isDarkMode ? 'bg-cyan-400' : 'bg-cyan-700'
                    }`}
                  />
                  <span>Routing to multimodal vision encoder...</span>
                </div>
              )}
            </div>

            {/* Chat Input Bar matching reference */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendPrompt();
              }}
              className={`pt-3 border-t flex items-center gap-2 ${
                isDarkMode ? 'border-slate-800/70' : 'border-slate-200'
              }`}
            >
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Ask about this imagery..."
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none transition-colors ${
                  isDarkMode
                    ? 'bg-slate-950/90 border border-slate-700/80 text-white placeholder-slate-500 focus:border-cyan-400'
                    : 'bg-white border border-slate-300 text-slate-950 placeholder-slate-400 focus:border-cyan-600 shadow-inner'
                }`}
              />
              <button
                type="submit"
                disabled={!queryInput.trim() || isProcessing}
                className={`px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-all ${
                  queryInput.trim() && !isProcessing
                    ? isDarkMode
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_12px_rgba(37,99,235,0.4)] cursor-pointer'
                      : 'bg-slate-900 hover:bg-black text-white shadow-xs cursor-pointer'
                    : isDarkMode
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Send
              </button>
            </form>
          </section>
        </div>

        {/* ========================================================= */}
        {/* BOTTOM: EXECUTION TRACE DRAWER (Matching Reference Image 3)*/}
        {/* ========================================================= */}
        <footer
          className={`w-full border-t font-mono text-xs z-30 transition-colors ${
            isDarkMode
              ? 'bg-[#060b16]/90 border-slate-800/80 text-slate-300'
              : 'bg-white/95 border-slate-200/90 text-slate-700 shadow-sm'
          }`}
        >
          <button
            onClick={() => setIsTraceExpanded(!isTraceExpanded)}
            className={`w-full h-9 px-6 flex items-center justify-between transition-colors cursor-pointer select-none ${
              isDarkMode
                ? 'text-slate-300 hover:text-white'
                : 'text-slate-700 hover:text-black'
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] font-bold tracking-wider ${
                  isDarkMode ? 'text-slate-200' : 'text-slate-900'
                }`}
              >
                EXECUTION TRACE
              </span>
            </div>
            <div className={isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-black'}>
              {isTraceExpanded ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
          </button>

          {/* Expanded Drawer Details */}
          {isTraceExpanded && (
            <div
              className={`px-6 py-4 border-t grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono ${
                isDarkMode
                  ? 'border-slate-800/70 text-slate-400 bg-slate-950/60'
                  : 'border-slate-200 text-slate-600 bg-slate-50/80'
              }`}
            >
              <div>
                <span className={isDarkMode ? 'text-slate-500 text-[10px]' : 'text-slate-400 text-[10px]'}>
                  PIPELINE STATUS
                </span>
                <div
                  className={`font-semibold mt-0.5 ${
                    isDarkMode ? 'text-white' : 'text-slate-950'
                  }`}
                >
                  Dual-Stream Cross-Modal Engine
                </div>
                <div
                  className={`text-[11px] mt-0.5 ${
                    isDarkMode ? 'text-emerald-400' : 'text-emerald-600 font-medium'
                  }`}
                >
                  Verified Local Runtime
                </div>
              </div>
              <div>
                <span className={isDarkMode ? 'text-slate-500 text-[10px]' : 'text-slate-400 text-[10px]'}>
                  COORDINATE REFERENCE
                </span>
                <div
                  className={`font-semibold mt-0.5 ${
                    isDarkMode ? 'text-white' : 'text-slate-950'
                  }`}
                >
                  EPSG:4326 (WGS84) Geodetic
                </div>
                <div
                  className={`text-[11px] mt-0.5 ${
                    isDarkMode ? 'text-cyan-400' : 'text-cyan-700 font-medium'
                  }`}
                >
                  Sub-pixel Alignment Ready
                </div>
              </div>
              <div>
                <span className={isDarkMode ? 'text-slate-500 text-[10px]' : 'text-slate-400 text-[10px]'}>
                  ABSTENTION THRESHOLD
                </span>
                <div
                  className={`font-semibold mt-0.5 ${
                    isDarkMode ? 'text-white' : 'text-slate-950'
                  }`}
                >
                  0.75 Epistemic Confidence
                </div>
                <div
                  className={`text-[11px] mt-0.5 ${
                    isDarkMode ? 'text-amber-400' : 'text-amber-600 font-medium'
                  }`}
                >
                  Abstention Policy Active
                </div>
              </div>
            </div>
          )}
        </footer>
      </div>
    </div>
  );
};
