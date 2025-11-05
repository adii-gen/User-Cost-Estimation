import { useState, useRef } from 'react';
import Papa from 'papaparse';

const CSVBulkUpload = ({ onUploadComplete } :any) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef :any = useRef(null);

  // Map CSV data to the database schema
  const transformData = (data :any) => {
    return data.map((item : any )=> {
      // Determine the type based on the CSV 'type' field
      let locationType = 'OTHER';
      if (item.type === 'small_airport' || item.type === 'medium_airport' || item.type === 'large_airport') {
        locationType = 'AIRPORT';
      } else if (item.type === 'heliport') {
        locationType = 'HELIPORT';
      } else if (item.municipality) {
        locationType = 'CITY';
      }

      // Use IATA code if available, otherwise use ICAO or local code
      const code = item.iata_code || item.icao_code || item.local_code || item.ident || '';

      return {
        name: item.name || '',
        code: code,
        country: item.iso_country || '',
        type: locationType,
        // Let the server handle the timestamps
      };
    });
  };

  const validateData = (data :any) => {
    const errors:any = [];
    data.forEach((item:any, index:any) => {
      if (!item.name) {
        errors.push(`Row ${index + 1}: Missing name`);
      }
      if (!item.iata_code && !item.icao_code && !item.local_code && !item.ident) {
        errors.push(`Row ${index + 1}: Missing code identifier`);
      }
      if (!item.iso_country) {
        errors.push(`Row ${index + 1}: Missing country`);
      }
    });
    return errors;
  };

  const handleFileChange = (e:any) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError(null);
    setSuccessMessage('');
  };

  const processFile = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setError(null);
    setSuccessMessage('');

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results :any) => {
        try {
          console.log("CSV data sample:", results.data.slice(0, 2));
          
          const validationErrors = validateData(results.data);
          if (validationErrors.length > 0) {
            setError(`Validation failed: ${validationErrors.slice(0, 3).join('; ')}${validationErrors.length > 3 ? ` and ${validationErrors.length - 3} more errors` : ''}`);
            setIsLoading(false);
            return;
          }

          const transformedData = transformData(results.data);
          console.log("Transformed data sample:", transformedData.slice(0, 2));
          
          const totalItems = transformedData.length;
          
          // Process in batches of 50 to avoid overloading the server
          const batchSize = 50;
          let processedItems = 0;
          
          try {
            for (let i = 0; i < transformedData.length; i += batchSize) {
              const batch = transformedData.slice(i, i + batchSize);
              
              // Make API request to our bulk endpoint
              const response = await fetch('/api/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(batch)
              });
              
              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to upload data');
              }
              
              processedItems += batch.length;
              setProgress(Math.round((processedItems / totalItems) * 100));
            }
            
            setSuccessMessage(`Successfully processed ${processedItems} locations`);
            if (onUploadComplete) {
              onUploadComplete(processedItems);
            }
          } catch (error) {
            console.error('API request failed:', error);
            setError('Upload failed: ');
          }
        } catch (error) {
          console.error('Processing failed:', error);
          setError('Failed to process file: ');
        } finally {
          setIsLoading(false);
        }
      },
      error: (error :any) => {
        console.error('CSV parsing error:', error);
        setError('Failed to parse CSV: ' + error.message);
        setIsLoading(false);
      }
    });
  };

  const resetForm = () => {
    setFile(null);
    setError(null);
    setProgress(0);
    setSuccessMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Bulk Upload Locations</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          CSV File
        </label>
        <input
          type="file"
          ref={fileInputRef}
          accept=".csv"
          onChange={handleFileChange}
          className="w-full border border-gray-300 rounded p-2"
          disabled={isLoading}
        />
        {file && (
          <p className="mt-1 text-sm text-gray-500">
            Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
          </p>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-800 rounded">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-300 text-green-800 rounded">
          {successMessage}
        </div>
      )}

      {isLoading && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="mt-1 text-sm text-gray-600 text-center">
            {progress}% Complete
          </p>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={processFile}
          disabled={!file || isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading ? 'Processing...' : 'Upload and Process'}
        </button>
        
        <button
          onClick={resetForm}
          disabled={isLoading}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 disabled:bg-gray-100"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default CSVBulkUpload;