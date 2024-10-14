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
    price: string;
    core_count: string;
    core_clock: string;
    boost_clock: string;
    microarchitecture: string;
    tdp: string;
    graphics: string;
  };

  interface PageClickEvent {
    selected: number;
  }

  const [data, setData] = useState<TableRow[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const rowsPerPage = 100; // Define how many rows per page
  const [sortConfig, setSortConfig] = useState<{ key: keyof TableRow; direction: 'ascending' | 'descending' } | null>(null);

  useEffect(() => {
    fetchData();
  }, [page, sortConfig]); // Fetch data when page or sort changes

  const fetchData = async () => {
    // Fetch total row count to calculate total pages
    const { count, error: countError } = await supabase
      .from('cpu')
      .select('*', { count: 'exact', head: true });

    if (countError || count === null) {
      console.error('Error fetching row count:', countError);
      return;
    }

    const totalPages = Math.ceil(count / rowsPerPage);
    setTotalPages(totalPages);

    // Fetch paginated data
    const { data: rows, error } = await supabase
      .from('cpu') // Ensure this table name is correct
      .select('*')
      .range(page * rowsPerPage, (page + 1) * rowsPerPage - 1); // Correct range for pagination

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      const sortedData = sortData(rows || []); // Sort data if it exists
      setData(sortedData); // Set empty array if rows is null
    }
  };

  const sortData = (rows: TableRow[]) => {
    if (!sortConfig) return rows;

    const { key, direction } = sortConfig;
    return [...rows].sort((a, b) => {
      if (key === 'price' || key === 'core_count' || key === 'core_clock' || key === 'boost_clock' || key === 'tdp') {
        return direction === 'ascending'
          ? parseFloat(a[key]) - parseFloat(b[key])
          : parseFloat(b[key]) - parseFloat(a[key]);
      } else {
        return direction === 'ascending'
          ? a[key].localeCompare(b[key])
          : b[key].localeCompare(a[key]);
      }
    });
  };

  const handleSort = (key: keyof TableRow) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handlePageClick = (event: PageClickEvent) => {
    setPage(event.selected);
  };

  const handleRowClick = (row: TableRow) => {
    // Handle the row click, you can navigate to another page or perform an action
    console.log('Row clicked:', row);
  };

  const hasData = Array.isArray(data) && data.length > 0;

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
                <th onClick={() => handleSort('name')} style={{ flex: '1 1 15%', padding: '10px', textAlign: 'center', color: 'white', cursor: 'pointer' }}>Name</th>
                <th onClick={() => handleSort('price')} style={{ flex: '1 1 15%', padding: '10px', textAlign: 'center', color: 'white', cursor: 'pointer' }}>Price</th>
                <th onClick={() => handleSort('core_count')} style={{ flex: '1 1 10%', padding: '10px', textAlign: 'center', color: 'white', cursor: 'pointer' }}>Core Count</th>
                <th onClick={() => handleSort('core_clock')} style={{ flex: '1 1 10%', padding: '10px', textAlign: 'center', color: 'white', cursor: 'pointer' }}>Core Clock</th>
                <th onClick={() => handleSort('boost_clock')} style={{ flex: '1 1 10%', padding: '10px', textAlign: 'center', color: 'white', cursor: 'pointer' }}>Boost Clock</th>
                <th onClick={() => handleSort('microarchitecture')} style={{ flex: '1 1 15%', padding: '10px', textAlign: 'center', color: 'white', cursor: 'pointer' }}>Microarchitecture</th>
                <th onClick={() => handleSort('tdp')} style={{ flex: '1 1 10%', padding: '10px', textAlign: 'center', color: 'white', cursor: 'pointer' }}>TDP</th>
                <th onClick={() => handleSort('graphics')} style={{ flex: '1 1 10%', padding: '10px', textAlign: 'center', color: 'white', cursor: 'pointer' }}>Graphics</th>
              </tr>
            </thead>
            <tbody>
              {hasData ? (
                data.map((row) => (
                  <tr key={row.id}>
                    <td colSpan={8}>
                      <button
                        onClick={() => handleRowClick(row)}
                        style={{
                          width: '100%',
                          background: 'none',
                          border: 'none',
                          padding: '10px',
                          cursor: 'pointer',
                          outline: 'none',
                          transition: 'background 0.3s',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center', // Center content vertically
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#2a2a2a'; // Change background on hover
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'none'; // Revert background on mouse leave
                        }}
                      >
                        <span style={{ flex: '1 1 15%', padding: '10px', textAlign: 'center' }}>{row.name}</span>
                        <span style={{ flex: '1 1 15%', padding: '10px', textAlign: 'center' }}>{row.price}</span>
                        <span style={{ flex: '1 1 10%', padding: '10px', textAlign: 'center' }}>{row.core_count}</span>
                        <span style={{ flex: '1 1 10%', padding: '10px', textAlign: 'center' }}>{row.core_clock}</span>
                        <span style={{ flex: '1 1 10%', padding: '10px', textAlign: 'center' }}>{row.boost_clock}</span>
                        <span style={{ flex: '1 1 15%', padding: '10px', textAlign: 'center' }}>{row.microarchitecture}</span>
                        <span style={{ flex: '1 1 10%', padding: '10px', textAlign: 'center' }}>{row.tdp}</span>
                        <span style={{ flex: '1 1 10%', padding: '10px', textAlign: 'center' }}>{row.graphics}</span>
                      </button>
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
              activeClassName={'active'}
              pageClassName={'pagination-item'}
              previousClassName={'pagination-item'}
              nextClassName={'pagination-item'}
              breakClassName={'pagination-item'}
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
        .pagination-item {
          margin: 0 5px; /* Space between items */
        }
        .active {
          font-weight: bold; /* Style for active page */
        }
      `}</style>
    </section>
  );
}
