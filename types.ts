export type PresetType = 'essential' | 'advanced' | 'premium';

export type CategoryId = 
  | 'init_global' 
  | 'init_offpage_global' 
  | 'init_single' 
  | 'run_global' 
  | 'run_single' 
  | 'run_offpage_global';

export interface ServiceData {
  id: string;
  name: string;
  category: CategoryId;
  defaultHours: number;
  presets: PresetType[];
}

export interface ServiceState extends ServiceData {
  active: boolean;
  currentHours: number;
}

export interface GlobalParams {
  hourlyRate: number;
  standardPages: number;
  pillarPages: number;
}

export interface CategoryGroup {
  id: CategoryId;
  label: string;
  type: 'one-time' | 'monthly';
  calculationMethod: 'global' | 'per-page';
}