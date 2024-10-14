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
    id: number;
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
  }, [page, sortConfig]);

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

    // Fetch data
    const { data: rows, error } = await supabase
      .from('cpu')
      .select('*')
      .range(page * rowsPerPage, (page + 1) * rowsPerPage - 1);

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      // Filter out rows with NaN values
      const filteredRows = rows?.filter(row => 
        !isNaN(parseFloat(row.price)) && 
        !isNaN(parseInt(row.core_count)) && 
        !isNaN(parseInt(row.tdp))
      ) || [];

      setData(filteredRows);
    }
  };

  const handlePageClick = (event: PageClickEvent) => {
    setPage(event.selected);
  };

  const handleSort = (key: keyof TableRow) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }

    setSortConfig({ key, direction });
    setPage(0); // Reset to page 0 when sorting
  };

  const sortedData = React.useMemo(() => {
    if (sortConfig !== null) {
      const { key, direction } = sortConfig;

      return [...data].sort((a, b) => {
        const aValue = key === 'price' ? parseFloat(a[key]) : 
                        key === 'core_count' || key === 'tdp' ? parseInt(a[key]) : 
                        a[key];

        const bValue = key === 'price' ? parseFloat(b[key]) : 
                        key === 'core_count' || key === 'tdp' ? parseInt(b[key]) : 
                        b[key];

        if (isNaN(aValue) || isNaN(bValue)) return 0;

        return direction === 'ascending' ? aValue - bValue : bValue - aValue;
      });
    }
    return data;
  }, [data, sortConfig]);

  const hasData = sortedData.length > 0;

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
                sortedData.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((row) => (
                  <tr key={row.id}>
                    <td colSpan={8}>
                      <button
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
                          alignItems: 'center',
                        }}
                      >
                        <span style={{ flex: '1 1 15%', padding: '10px', textAlign: 'center' }}>{row.name}</span>
                        <span style={{ flex: '1 1 15%', padding: '10px', textAlign: 'center' }}>{parseFloat(row.price).toFixed(2)}</span>
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
              forcePage={page}
              containerClassName={'pagination'}
              activeClassName={'active'}
              pageClassName={'pagination-item'}
              previousClassName={'pagination-item'}
              nextClassName={'pagination-item'}
              breakClassName={'pagination-item'}
            />
          </div>

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
              margin: 0 5px;
              padding: 10px 15px;
              border: 1px solid #ccc;
              border-radius: 4px;
              cursor: pointer;
              background-color: #f4f4f4;
              transition: background-color 0.3s ease, border 0.3s ease;
            }

            .pagination-item:hover {
              background-color: #2a2a2a;
              color: white;
              border: 1px solid #2a2a2a;
            }

            .active {
              background-color: #2a2a2a;
              color: white;
              font-weight: bold;
              border: 1px solid #2a2a2a;
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}
