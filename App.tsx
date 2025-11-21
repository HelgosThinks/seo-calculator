import React, { useState, useMemo, useCallback } from 'react';
import { Briefcase, CheckCircle2, ChevronRight, Euro, FileText, Layers, LayoutDashboard, RotateCcw, Zap } from 'lucide-react';
import { RAW_SERVICES_DATA, CATEGORY_GROUPS } from './data';
import { ServiceState, GlobalParams, PresetType, CategoryId } from './types';

const App: React.FC = () => {
  // --- State ---
  const [params, setParams] = useState<GlobalParams>({
    hourlyRate: 120,
    standardPages: 10,
    pillarPages: 2,
  });

  const [services, setServices] = useState<ServiceState[]>(() => 
    RAW_SERVICES_DATA.map(s => ({
      ...s,
      active: false,
      currentHours: s.defaultHours
    }))
  );

  // --- Logic ---

  const updateParam = (key: keyof GlobalParams, value: number) => {
    setParams(prev => ({ ...prev, [key]: Math.max(0, value) }));
  };

  const toggleService = (id: string) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const updateHours = (id: string, hours: number) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, currentHours: Math.max(0, hours) } : s));
  };

  const applyPreset = (preset: PresetType | 'clear') => {
    setServices(prev => prev.map(s => {
      if (preset === 'clear') {
        return { ...s, active: false, currentHours: s.defaultHours };
      }
      
      const shouldBeActive = s.presets.includes(preset);
      return {
        ...s,
        active: shouldBeActive,
        currentHours: s.defaultHours // Reset hours on preset change
      };
    }));
  };

  // --- Calculation ---

  const calculateCost = useCallback((service: ServiceState) => {
    if (!service.active) return 0;
    
    const isPerPage = CATEGORY_GROUPS.find(g => g.id === service.category)?.calculationMethod === 'per-page';
    
    let multiplier = 1;
    if (isPerPage) {
      // Logic: Standard Pages + (Pillar Pages * 1.5)
      multiplier = params.standardPages + (params.pillarPages * 1.5);
    }

    return service.currentHours * multiplier * params.hourlyRate;
  }, [params]);

  const totals = useMemo(() => {
    let initialTotal = 0;
    let monthlyTotal = 0;
    let initialHours = 0;
    let monthlyHours = 0;

    services.forEach(s => {
      if (!s.active) return;
      const cost = calculateCost(s);
      const categoryType = CATEGORY_GROUPS.find(g => g.id === s.category)?.type;

      // Calculate raw hours for summary (accounting for multipliers)
      const isPerPage = CATEGORY_GROUPS.find(g => g.id === s.category)?.calculationMethod === 'per-page';
      const multiplier = isPerPage ? (params.standardPages + (params.pillarPages * 1.5)) : 1;
      const totalHoursForService = s.currentHours * multiplier;

      if (categoryType === 'one-time') {
        initialTotal += cost;
        initialHours += totalHoursForService;
      } else {
        monthlyTotal += cost;
        monthlyHours += totalHoursForService;
      }
    });

    return { initialTotal, monthlyTotal, initialHours, monthlyHours };
  }, [services, calculateCost, params]);


  // --- Formatters ---
  const formatCurrency = (val: number) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(val);
  const formatNumber = (val: number) => new Intl.NumberFormat('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 1 }).format(val);

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans text-slate-700 bg-slate-50">
      
      {/* --- Sidebar: Settings --- */}
      <aside className="w-full md:w-80 bg-white border-r border-slate-200 flex-shrink-0 z-20 shadow-sm flex flex-col h-auto md:h-screen sticky top-0">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-2 text-slate-900 font-bold text-xl">
            <LayoutDashboard className="w-6 h-6 text-accent" />
            <span>SEO Configurator</span>
          </div>
          <p className="text-xs text-slate-400">Professional Estimate Tool</p>
        </div>

        <div className="p-6 space-y-8 overflow-y-auto flex-1">
          
          {/* Parameter Group */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-slate-400" />
              Basis-Parameter
            </h3>
            
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500">Stundensatz (€)</label>
              <div className="relative">
                <Euro className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input 
                  type="number" 
                  value={params.hourlyRate}
                  onChange={(e) => updateParam('hourlyRate', parseFloat(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all text-sm font-semibold text-slate-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500">Std. Seiten</label>
                <input 
                  type="number" 
                  value={params.standardPages}
                  onChange={(e) => updateParam('standardPages', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all text-sm font-semibold text-slate-700"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500">Pillar Pages</label>
                <input 
                  type="number" 
                  value={params.pillarPages}
                  onChange={(e) => updateParam('pillarPages', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all text-sm font-semibold text-slate-700"
                />
              </div>
            </div>
            
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs text-blue-700 leading-relaxed">
                <span className="font-bold">Hinweis:</span> Pillar Pages werden in der Berechnung mit dem Faktor <span className="font-bold">1.5x</span> gewichtet, um den höheren Aufwand abzubilden.
              </p>
            </div>
          </div>

        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Bar: Presets */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Leistungskonfiguration</h2>
            <p className="text-sm text-slate-500">Wählen Sie ein Paket oder stellen Sie individuell zusammen.</p>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
            <button onClick={() => applyPreset('essential')} className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-white hover:shadow-sm hover:text-accent transition-all text-slate-600">
              Essential
            </button>
            <button onClick={() => applyPreset('advanced')} className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-white hover:shadow-sm hover:text-accent transition-all text-slate-600">
              Advanced
            </button>
            <button onClick={() => applyPreset('premium')} className="px-4 py-2 text-sm font-medium rounded-lg bg-white shadow-sm text-accent ring-1 ring-black/5 transition-all">
              Premium
            </button>
            <div className="w-px h-6 bg-slate-300 mx-1"></div>
            <button onClick={() => applyPreset('clear')} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Alles zurücksetzen">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Services List */}
        <div className="flex-1 overflow-y-auto p-6 pb-40 scroll-smooth">
          <div className="max-w-5xl mx-auto space-y-8">
            
            {CATEGORY_GROUPS.map((group) => {
              const groupServices = services.filter(s => s.category === group.id);
              if (groupServices.length === 0) return null;

              return (
                <section key={group.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {group.type === 'one-time' ? <Briefcase className="w-4 h-4 text-slate-400" /> : <RotateCcw className="w-4 h-4 text-slate-400" />}
                      <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wide">{group.label}</h3>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${group.type === 'one-time' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {group.type === 'one-time' ? 'Einmalig' : 'Monatlich'}
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {groupServices.map((service) => (
                      <div 
                        key={service.id} 
                        className={`group flex flex-col sm:flex-row sm:items-center p-4 gap-4 transition-colors ${service.active ? 'bg-slate-50/50' : 'hover:bg-slate-50'}`}
                      >
                        {/* Checkbox & Name */}
                        <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => toggleService(service.id)}>
                          <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${service.active ? 'bg-accent border-accent text-white' : 'border-slate-300 bg-white text-transparent group-hover:border-accent'}`}>
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className={`text-sm font-semibold ${service.active ? 'text-slate-900' : 'text-slate-600'}`}>{service.name}</h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-slate-400">
                                {group.calculationMethod === 'per-page' ? 'Aufwand pro Seite' : 'Globaler Aufwand'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Controls & Price */}
                        <div className={`flex items-center gap-6 transition-opacity duration-200 ${service.active ? 'opacity-100' : 'opacity-40 pointer-events-none grayscale'}`}>
                          
                          {/* Hours Input */}
                          <div className="flex items-center bg-white border border-slate-200 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-accent">
                            <input 
                              type="number"
                              step="0.1"
                              min="0"
                              value={service.currentHours}
                              onChange={(e) => updateHours(service.id, parseFloat(e.target.value))}
                              className="w-16 p-2 text-right text-sm font-mono text-slate-700 outline-none bg-transparent"
                            />
                            <span className="pr-3 pl-1 text-xs text-slate-400 font-medium">Std.</span>
                          </div>

                          {/* Calculation Details (Visual Helper) */}
                          <div className="hidden lg:flex flex-col items-end text-xs text-slate-400 min-w-[100px]">
                            {group.calculationMethod === 'per-page' && (
                              <span>x {params.standardPages + (params.pillarPages * 1.5)} (Faktor)</span>
                            )}
                            <span>x {params.hourlyRate}€/h</span>
                          </div>

                          {/* Final Price */}
                          <div className="text-right min-w-[120px]">
                            <div className="text-base font-bold text-slate-900 font-mono">
                              {formatCurrency(calculateCost(service))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>

        {/* Sticky Footer: Summary */}
        <footer className="bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] p-6 sticky bottom-0 z-30">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
              
              {/* Hours Summary */}
              <div className="flex gap-8 text-sm text-slate-500 hidden md:flex">
                <div>
                  <span className="block text-xs uppercase tracking-wider font-semibold text-slate-400">Projekt-Aufwand</span>
                  <div className="flex items-baseline gap-1">
                    <Layers className="w-4 h-4 text-blue-500" />
                    <span className="font-medium text-slate-700">{formatNumber(totals.initialHours)} Std.</span>
                  </div>
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-wider font-semibold text-slate-400">Monatl. Aufwand</span>
                  <div className="flex items-baseline gap-1">
                    <RotateCcw className="w-4 h-4 text-emerald-500" />
                    <span className="font-medium text-slate-700">{formatNumber(totals.monthlyHours)} Std.</span>
                  </div>
                </div>
              </div>

              {/* Price Totals */}
              <div className="flex flex-1 w-full md:w-auto gap-4 md:gap-12 justify-between md:justify-end">
                
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Setup / Einmalig</span>
                  <div className="text-2xl md:text-3xl font-bold text-slate-900 font-mono tracking-tight">
                    {formatCurrency(totals.initialTotal)}
                  </div>
                  <div className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded mt-1">
                    Projektstart
                  </div>
                </div>

                <div className="w-px bg-slate-200 self-stretch mx-2 hidden md:block"></div>

                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Betreuung / Monatlich</span>
                  <div className="text-2xl md:text-3xl font-bold text-emerald-600 font-mono tracking-tight">
                    {formatCurrency(totals.monthlyTotal)}
                  </div>
                  <div className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mt-1">
                    Wiederkehrend
                  </div>
                </div>

              </div>

              <button 
                className="hidden md:flex bg-slate-900 text-white p-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg items-center justify-center"
                title="Angebot exportieren (Demo)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

            </div>
          </div>
        </footer>

      </main>
    </div>
  );
};

export default App;