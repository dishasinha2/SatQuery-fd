import React, { useState } from 'react';
import { BENCHMARK_DATA } from '../data/mockData';
import { BenchmarkMetric, PageMode } from '../types';
import {
  BarChart2,
  Play,
  CheckCircle2,
  RefreshCw,
  Cpu,
  Trophy,
  Zap,
  Layers,
  ArrowRight
} from 'lucide-react';

interface BenchmarkPageProps {
  onNavigate: (page: PageMode) => void;
}

export const BenchmarkPage: React.FC<BenchmarkPageProps> = ({ onNavigate }) => {
  const [benchmarks, setBenchmarks] = useState<BenchmarkMetric[]>(BENCHMARK_DATA);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [activeBenchmarkDataset, setActiveBenchmarkDataset] = useState<string>('');

  const runBenchmarkSuite = () => {
    setIsRunning(true);
    setProgress(0);

    const datasets = benchmarks.map((b) => b.dataset);
    let currentIdx = 0;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 12;
        if (next >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          setActiveBenchmarkDataset('');
          return 100;
        }
        currentIdx = Math.floor((next / 100) * datasets.length);
        setActiveBenchmarkDataset(datasets[Math.min(currentIdx, datasets.length - 1)]);
        return next;
      });
    }, 280);
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-transparent text-slate-100 p-4 sm:p-6 lg:p-8 font-mono">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-cyan-950/40">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs uppercase tracking-wider mb-1">
              <BarChart2 className="w-4 h-4 text-blue-400 animate-pulse" />
              <span>Automated Standardized Testing Suite</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Earth Observation AI Benchmark Evaluation
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
              Rigorous empirical evaluation against VRSBench, RSVQA (Remote Sensing VQA), and CDVQA (Change Detection).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={runBenchmarkSuite}
              disabled={isRunning}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] ${
                isRunning
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-black cursor-pointer'
              }`}
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Benchmarking ({progress}%)...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Automated Suite</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Progress Bar when Running */}
        {isRunning && (
          <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/40 space-y-2 animate-pulse">
            <div className="flex justify-between text-xs">
              <span className="text-cyan-300 font-bold">
                Evaluating: {activeBenchmarkDataset}
              </span>
              <span className="text-amber-400 font-bold">{progress}% Complete</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Highlight Scorecards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Mean Benchmark Accuracy</div>
              <div className="text-3xl font-extrabold text-cyan-400 mt-1">91.3%</div>
              <div className="text-[10px] text-emerald-400 mt-0.5">+14.2% over optical baseline</div>
            </div>
            <Trophy className="w-8 h-8 text-amber-400 opacity-70" />
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Optical-SAR Cloud Invariance</div>
              <div className="text-3xl font-extrabold text-fuchsia-400 mt-1">95.2%</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Penetrates cirrus &amp; stratus</div>
            </div>
            <Zap className="w-8 h-8 text-fuchsia-400 opacity-70" />
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Average Latency per Tile</div>
              <div className="text-3xl font-extrabold text-teal-300 mt-1">488 ms</div>
              <div className="text-[10px] text-slate-400 mt-0.5">GPU-accelerated inference</div>
            </div>
            <Cpu className="w-8 h-8 text-teal-300 opacity-70" />
          </div>
        </div>

        {/* Comprehensive Benchmark Table */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center">
            <span className="font-bold text-xs text-white">Evaluation Datasets &amp; Validation Scores</span>
            <span className="text-[10px] text-slate-500">Samples Evaluated: 26,800</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 text-[11px]">
                <tr>
                  <th className="p-3 font-semibold">Dataset Name</th>
                  <th className="p-3 font-semibold">Task Archetype</th>
                  <th className="p-3 font-semibold">Samples</th>
                  <th className="p-3 font-semibold text-cyan-300">Accuracy</th>
                  <th className="p-3 font-semibold">Precision</th>
                  <th className="p-3 font-semibold">Recall</th>
                  <th className="p-3 font-semibold">mIoU</th>
                  <th className="p-3 font-semibold">Latency</th>
                  <th className="p-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {benchmarks.map((bm, i) => (
                  <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-bold text-white whitespace-nowrap">{bm.dataset}</td>
                    <td className="p-3 text-slate-400">{bm.task}</td>
                    <td className="p-3 font-mono">{bm.sampleCount.toLocaleString()}</td>
                    <td className="p-3 font-bold text-cyan-400">{bm.accuracy}%</td>
                    <td className="p-3 text-slate-300">{bm.precision}%</td>
                    <td className="p-3 text-slate-300">{bm.recall}%</td>
                    <td className="p-3 text-emerald-400 font-bold">{bm.mIoU ? `${bm.mIoU}%` : 'N/A'}</td>
                    <td className="p-3 text-amber-300 font-mono">{bm.avgLatencyMs} ms</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">
                        {bm.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
