import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Upload, Loader2, Target, Zap } from 'lucide-react';
import { clsx } from 'clsx';

export function PdfUploadModal({ onClose, onUpload, uploading, extracting, activePdfUrl }: any) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="w-full max-w-lg bg-[#0A0A0A] border border-white/5 rounded-[3rem] p-10 relative overflow-hidden shadow-2xl"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-mint/50 to-transparent" />

                <button onClick={onClose} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors">
                    <Plus className="w-6 h-6 rotate-45" />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className={clsx(
                        "w-20 h-20 rounded-[2rem] flex items-center justify-center mb-8 transition-all",
                        activePdfUrl ? "bg-accent-mint text-theme-dark shadow-2xl shadow-accent-mint/20" : "bg-white/5 text-text-muted"
                    )}>
                        <FileText className="w-10 h-10" />
                    </div>

                    <h3 className="text-xl font-black uppercase tracking-widest text-white mb-2">CV Asset Control</h3>
                    <p className="text-sm text-text-muted mb-10 max-w-[280px]">Synchronize your cloud portfolio with your latest professional documentation.</p>

                    <div className={clsx(
                        "w-full rounded-[2.5rem] border-2 border-dashed p-10 transition-all",
                        activePdfUrl ? "border-accent-mint/30 bg-accent-mint/[0.03]" : "border-white/10 bg-white/[0.01]"
                    )}>
                        <h5 className="text-[10px] font-black uppercase tracking-widest mb-8">
                            {activePdfUrl ? "Active Asset: Verified" : "System Awaiting Input"}
                        </h5>

                        <label className={clsx(
                            "px-10 py-4 bg-accent-mint text-theme-dark rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent-mint/10 inline-flex items-center gap-3",
                            (uploading || extracting) && "opacity-50 pointer-events-none"
                        )}>
                            <input type="file" className="hidden" accept=".pdf" onChange={onUpload} />
                            {uploading || extracting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <Upload className="w-4 h-4" />
                                    <span>Sync CV Asset</span>
                                </>
                            )}
                        </label>
                    </div>

                    {activePdfUrl && (
                        <div className="mt-8 flex items-center gap-2 text-accent-mint animate-pulse">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent-mint" />
                            <span className="text-[9px] font-black uppercase tracking-tighter">Live Connection Established</span>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

export function JDAdapterModal({ onClose, jobDescription, setJobDescription, onAdapt, isAdapting, adaptedData, onReset }: any) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md"
        >
            <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="w-full max-w-2xl bg-[#0A0A0A] border border-white/5 rounded-[3rem] p-10 relative overflow-hidden shadow-2xl"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-mint/50 to-transparent" />

                <button onClick={onClose} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors">
                    <Plus className="w-6 h-6 rotate-45" />
                </button>

                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-accent-mint/10 text-accent-mint flex items-center justify-center shadow-lg shadow-accent-mint/5 border border-accent-mint/10">
                            <Target className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black uppercase tracking-widest text-white">Smart JD Adaptation</h3>
                            <p className="text-[10px] text-text-muted font-bold uppercase tracking-[0.2em] mt-1">Optimize Assets for Specific Opportunities</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[9px] font-black uppercase text-white/30 ml-2">Job Description (Requirements & Stack)</label>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the Job Description here to trigger AI-driven adaptation..."
                            className="w-full bg-black/40 border border-white/5 rounded-3xl p-6 text-sm h-64 outline-none focus:border-accent-mint/30 transition-all text-white/80 placeholder:text-white/5 leading-relaxed"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={onAdapt}
                            disabled={isAdapting || !jobDescription.trim()}
                            className="flex-1 py-5 bg-accent-mint text-theme-dark rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-accent-mint/20 disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {isAdapting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                            {isAdapting ? "Optimizing Assets..." : "Execute Adaptation"}
                        </button>
                        
                        {adaptedData && (
                            <button
                                onClick={onReset}
                                className="px-8 py-5 bg-white/5 border border-white/10 text-white/40 rounded-2xl text-[11px] font-black uppercase hover:bg-white/10 transition-all"
                            >
                                Reset
                            </button>
                        )}
                    </div>

                    <p className="text-[8px] text-center text-white/20 uppercase tracking-[0.3em] font-bold">
                        Adaptive Mode creates a temporary layer over your CV for this session.
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}
