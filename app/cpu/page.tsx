'use client';

import LogoCloud from '@/components/ui/LogoCloud';
import { createClient } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

export default function CPUTable() {
  const supabaseUrl = "https://ogsbootxscuhnzosbkuy.supabase.co";
  const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nc2Jvb3R4c2N1aG56b3Nia3V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg0MzMwNjUsImV4cCI6MjA0NDAwOTA2NX0.41OqYzDjnCgcdPK4lo2--AGOSW3mVGw23khghZUxDw0"; // Use your actual anon key

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  type TableRow = {
    id: number; // Add id to match your table schema
    name: string;
    price: string; // Assume price is stored as a string
    core_count: string; // Assume core_count is stored as a string but represents an integer
    core_clock: string; // Assume core_clock is stored as a string but represents a float
    boost_clock: string; // Assume boost_clock is stored as a string but represents a float
    microarchitecture: string;
    tdp: string; // Assume tdp is stored as a string but represents an integer
    graphics: string;
  };

  interface PageClickEvent {
    selected: number;
  }

  const [data, setData] = useState<TableRow[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortConfig, setSortConfig] = useState<{ key: keyof TableRow; direction: 'ascending' | 'descending' } | null>(null);
  const rowsPerPage = 100; // Set to 100 rows per page

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: rows, error } = await supabase
      .from('cpu')
      .select('*');

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      setData(rows || []);
      setTotalPages(Math.ceil((rows || []).length / rowsPerPage)); // Calculate total pages based on the full dataset
    }
  };

  const handlePageClick = (event: PageClickEvent) => {
    setPage(event.selected);
  };

  const requestSort = (key: keyof TableRow) => {
    let direction: 'ascending' | 'descending' = 'ascending';

    // Determine the direction based on the current sort configuration
    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
    }

    // Update sort configuration and reset to first page
    setSortConfig({ key, direction });
    setPage(0); // Reset to the first page on sort
  };

  const sortedData = () => {
    // Filter out rows with NaN values
    const filteredData = data.filter(row => {
      const price = parseFloat(row.price);
      const coreCount = parseInt(row.core_count, 10);
      const tdp = parseInt(row.tdp, 10);

      return !isNaN(price) && !isNaN(coreCount) && !isNaN(tdp);
    });

    if (sortConfig !== null) {
      const { key, direction } = sortConfig;
      const sorted = [...filteredData].sort((a, b) => {
        let aValue: number | string = a[key];
        let bValue: number | string = b[key];

        // Parse values based on the type of the column
        if (key === 'price') {
          aValue = parseFloat(aValue as string);
          bValue = parseFloat(bValue as string);
        } else if (key === 'core_count' || key === 'tdp') {
          aValue = parseInt(aValue as string, 10);
          bValue = parseInt(bValue as string, 10);
        } else {
          aValue = aValue as string; // Keep as string for other fields
          bValue = bValue as string;
        }

        // Sort based on direction
        if (direction === 'ascending') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
      setTotalPages(Math.ceil(sorted.length / rowsPerPage)); // Update total pages after sorting and filtering
      return sorted; // Return sorted data if sorting is applied
    }
    
    setTotalPages(Math.ceil(filteredData.length / rowsPerPage)); // Update total pages based on filtered data
    return filteredData; // Return filtered data if no sorting is applied
  };

  const formattedPrice = (price: string) => {
    const parsedPrice = parseFloat(price);
    return !isNaN(parsedPrice) ? parsedPrice.toFixed(2) : '0.00'; // Ensure two decimal places for prices
  };

  const hasData = Array.isArray(data) && data.length > 0;

  // Get current rows for pagination
  const currentRows = () => {
    const sortedAndFilteredData = sortedData();
    const startIndex = page * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, sortedAndFilteredData.length); // Prevent empty pages
    return sortedAndFilteredData.slice(startIndex, endIndex);
  };

  return (
    <section className="bg-black">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
            CPU
          </p>
        </div>

        <LogoCloud />

        <div>
          <table style={{ border: '1px solid black', width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ display: 'flex', textAlign: 'left', backgroundColor: '#2a2a2a' }}>
                <th
                  onClick={() => requestSort('name')}
                  style={{ flex: '1 1 15%', padding: '10px', textAlign: 'center', color: 'white', cursor: 'pointer' }}
                >
                  Name
                </th>
                <th
                  onClick={() => requestSort('price')}
                  style={{ flex: '1 1 15%', padding: '10px', textAlign: 'center', color: 'white', cursor: 'pointer' }}
                >
                  Price
                </th>
                <th
                  onClick={() => requestSort('core_count')}
                  style={{ flex: '1 1 10%', padding: '10px', textAlign: 'center', color: 'white', cursor: 'pointer' }}
                >
                  Core Count
                </th>
                <th
                  onClick={() => requestSort('core_clock')}
                  style={{ flex: '1 1 10%', padding: '10px', textAlign: 'center', color: 'white', cursor: 'pointer' }}
                >
                  Core Clock
                </th>
                <th
                  onClick={() => requestSort('boost_clock')}
                  style={{ flex: '1 1 10%', padding: '10px', textAlign: 'center', color: 'white', cursor: 'pointer' }}
                >
                  Boost Clock
                </th>
                <th
                  onClick={() => requestSort('microarchitecture')}
                  style={{ flex: '1 1 15%', padding: '10px', textAlign: 'center', color: 'white', cursor: 'pointer' }}
                >
                  Microarchitecture
                </th>
                <th
                  onClick={() => requestSort('tdp')}
                  style={{ flex: '1 1 10%', padding: '10px', textAlign: 'center', color: 'white', cursor: 'pointer' }}
                >
                  TDP
                </th>
                <th
                  onClick={() => requestSort('graphics')}
                  style={{ flex: '1 1 10%', padding: '10px', textAlign: 'center', color: 'white', cursor: 'pointer' }}
                >
                  Graphics
                </th>
              </tr>
            </thead>
            <tbody>
              {hasData ? (
                currentRows().map((row) => (
                  <tr key={row.id}>
                    <td colSpan={8}>
                      <div
                        style={{
                          width: '100%',
                          background: 'none',
                          padding: '0',
                          color: 'white',
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#444'; // Highlight background on hover
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'none'; // Revert background on leave
                        }}
                      >
                        <span style={{ flex: '1 1 15%', padding: '10px', textAlign: 'center' }}>{row.name}</span>
                        <span style={{ flex: '1 1 15%', padding: '10px', textAlign: 'center' }}>
                          {formattedPrice(row.price)}
                        </span>
                        <span style={{ flex: '1 1 10%', padding: '10px', textAlign: 'center' }}>{row.core_count}</span>
                        <span style={{ flex: '1 1 10%', padding: '10px', textAlign: 'center' }}>{row.core_clock}</span>
                        <span style={{ flex: '1 1 10%', padding: '10px', textAlign: 'center' }}>{row.boost_clock}</span>
                        <span style={{ flex: '1 1 15%', padding: '10px', textAlign: 'center' }}>{row.microarchitecture}</span>
                        <span style={{ flex: '1 1 10%', padding: '10px', textAlign: 'center' }}>{row.tdp}</span>
                        <span style={{ flex: '1 1 10%', padding: '10px', textAlign: 'center' }}>{row.graphics}</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Component */}
          <div className="pagination-container">
            <ReactPaginate
              previousLabel={'Previous'}
              nextLabel={'Next'}
              breakLabel={'...'}
              pageCount={totalPages}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName={'pagination'}
              pageClassName={'pagination-page'}
              pageLinkClassName={'pagination-link'}
              previousClassName={'pagination-previous'}
              nextClassName={'pagination-next'}
              activeClassName={'pagination-active'}
              disabledClassName={'pagination-disabled'}
            />
          </div>
        </div>
      </div>

      {/* Styles for Pagination */}
      <style jsx>{`
        .pagination-container {
          display: flex;
          justify-content: center;
          margin-top: 20px; /* Space above pagination */
        }
        .pagination {
          display: flex;
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .pagination-page {
          margin: 0 5px; /* Space between items */
          padding: 10px 15px;
          border: 1px solid #666;
          border-radius: 5px;
          background-color: #333;
          color: white;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .pagination-page:hover {
          background-color: #444;
        }
        .pagination-active {
          background-color: #444; /* Active page style */
          font-weight: bold;
        }
        .pagination-disabled {
          opacity: 0.5; /* Style for disabled items */
          pointer-events: none; /* Disable interaction */
        }
      `}</style>
    </section>
  );
}
