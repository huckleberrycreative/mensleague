import { useQuery } from '@tanstack/react-query';
import { coachesApi, CoachWithTeam, Coach } from '@/lib/api/coaches';

export interface TeamCoachData {
  teamId: string;
  teamName: string;
  coaches: Coach[];
}

export function useCoaches() {
  return useQuery({
    queryKey: ['coaches'],
    queryFn: () => coachesApi.getAll(),
  });
}

export function useCoachesByTeam() {
  return useQuery({
    queryKey: ['coaches-by-team'],
    queryFn: async (): Promise<TeamCoachData[]> => {
      const groupedMap = await coachesApi.getAllGroupedByTeam();
      
      // Convert Map to array for easier rendering
      const result: TeamCoachData[] = [];
      groupedMap.forEach((value, teamId) => {
        result.push({
          teamId,
          teamName: value.teamName,
          coaches: value.coaches
        });
      });
      
      // Sort by team name
      result.sort((a, b) => a.teamName.localeCompare(b.teamName));
      
      return result;
    },
  });
}
