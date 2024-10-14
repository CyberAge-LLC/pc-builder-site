"use client"; // Marking this component as a client component

import React, { useEffect, useState } from 'react';

// Define the type for your CPU data
interface CpuData {
  name: string;
  price: number;
  core_count: number;
  clock_speed: number;
  tdp: number;
  architecture: string;
  cache: number;
  graphics: string;
}

const CpuTable: React.FC = () => {
  const [data, setData] = useState<CpuData[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof CpuData; direction: 'ascending' | 'descending' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      const SUPABASE_URL = 'https://your-supabase-url.supabase.co'; // Replace with your Supabase URL
      const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nc2Jvb3R4c2N1aG56b3Nia3V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg0MzMwNjUsImV4cCI6MjA0NDAwOTA2NX0.41OqYzDjnCgcdPK4lo2--AGOSW3mVGw23khghZUxDw0'; // Replace with your Supabase Anon key

      const response = await fetch(`${SUPABASE_URL}/rest/v1/cpus`, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
        },
      });

      if (!response.ok) {
        console.error('Error fetching data:', response.statusText);
        return;
      }

      const result = await response.json();
      setData(result);
    };

    fetchData();
  }, []);

  const handleSort = (key: keyof CpuData) => {
    let direction: 'ascending' | 'descending' = 'ascending';

    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }

    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to page 1 on sort
  };

  const sortedData = React.useMemo(() => {
    let sortableData = [...data];

    if (sortConfig) {
      sortableData.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
        } else if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'ascending' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        return 0; // Default return for unexpected types
      });
    }

    // Filter out rows with NaN values
    return sortableData.filter(row => 
      Object.values(row).every(value => value !== null && !isNaN(Number(value)))
    );
  }, [data, sortConfig]);

  // Calculate total pages
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  // Slice the sorted data for the current page
  const currentData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>Name</th>
            <th onClick={() => handleSort('price')}>Price</th>
            <th onClick={() => handleSort('core_count')}>Core Count</th>
            <th onClick={() => handleSort('clock_speed')}>Clock Speed</th>
            <th onClick={() => handleSort('tdp')}>TDP</th>
            <th onClick={() => handleSort('architecture')}>Architecture</th>
            <th onClick={() => handleSort('cache')}>Cache</th>
            <th onClick={() => handleSort('graphics')}>Graphics</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((row, index) => (
            <tr key={index}>
              <td>{row.name}</td>
              <td>${row.price.toFixed(2)}</td>
              <td>{row.core_count}</td>
              <td>{row.clock_speed} GHz</td>
              <td>{row.tdp} W</td>
              <td>{row.architecture}</td>
              <td>{row.cache} MB</td>
              <td>{row.graphics}</td>
            </tr>
          ))}
          {currentData.length === 0 && (
            <tr>
              <td colSpan={8}>No results found</td>
            </tr>
          )}
        </tbody>
      </table>
      
      <div>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            style={{ margin: '0 5px', backgroundColor: currentPage === index + 1 ? '#ccc' : 'white' }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CpuTable;
