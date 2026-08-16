import { useStore, calculatePerformance } from './dataStore';
import { computeStudentInsights, computeClassInsights, computeInstitutionInsights } from '@/lib/ai/rules';

export function useAIService() {
  const store = useStore();

  const getStudentInsights = () => computeStudentInsights(store.student);
  
  const getClassInsights = () => computeClassInsights(store.roster);

  const getInstitutionInsights = () => computeInstitutionInsights(store.roster);

  return {
    getStudentInsights,
    getClassInsights,
    getInstitutionInsights,
  };
}
