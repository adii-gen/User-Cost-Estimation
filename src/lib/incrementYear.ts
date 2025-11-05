export function getNextAcademicYear(currentAcademicYear: string) {
    // Split the current academic year by the hyphen
    const [startYear, endYear] = currentAcademicYear.split("-").map(Number);
  
    // Increment the start year and end year
    const nextStartYear = startYear + 1;
    const nextEndYear = endYear + 1;
  
    // Format the next academic year as "YYYY-YY"
    return `${nextStartYear}-${nextEndYear.toString().slice(-2)}`;
  }