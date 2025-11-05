export const downloadCSVSample = () => {
    const headers = [
      'Phase', 'Roll Number', 'Enrollment Number', 
      'Student Name', 'Father Name', 
      'Father Mobile', 'Student Mobile', 
      'Father\'s email', 'Admission Year','AcademicYear'
    ];
  
    const sampleData = [
      'Phase 1,1,ENR12345,John Doe,Michael Doe,9876543210,9988776655,michael.doe@example.com,2024,2024-25'
    ];
  
    const csvContent = [
      headers.join(','),
      ...sampleData
    ].join('\n');
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", "student_registration_sample.csv");
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };