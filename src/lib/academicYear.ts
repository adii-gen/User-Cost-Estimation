
"use client"


import { useState, useEffect } from 'react';

export interface AcademicYear {
  id: string;
  academicYear: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useAcademicYears() {
  const [academicYears, setAcademicYears] = useState<string[]>([]);
  const [academicYearIds, setAcademicYearIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAcademicYears = async () => {
      try {
        const response = await fetch('/api/academicYear');
        if (!response.ok) {
          throw new Error('Failed to fetch academic years');
        }
        const data: AcademicYear[] = await response.json();
        
        // Sort academic years and extract the year strings and IDs
        const sortedData = data.sort((a, b) => 
          (b.academicYear).localeCompare(a.academicYear)
        );

        const sortedYears = sortedData.map(year => year.academicYear);
        const sortedIds = sortedData.map(year => year.id);

        setAcademicYears(sortedYears);
        setAcademicYearIds(sortedIds);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        setIsLoading(false);
      }
    };

    fetchAcademicYears();
  }, []);

  return { 
    academicYears, academicYearIds, isLoading, error 
  };
}