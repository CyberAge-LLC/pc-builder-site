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
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);
  const rowsPerPage = 100; // Display 100 rows per page

  useEffect(() => {
    fetchData();
  }, [page, sortConfig]);

  const fetchData = async () => {
    const { data: fetchedData, error } = await supabase
      .from('cpu')
      .select('*');

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      const filteredData = (fetchedData || []).filter((row) => {
        // Remove rows with NaN in critical columns
        return (
          !isNaN(parseFloat(row.price)) &&
          !isNaN(parseFloat(row.core_count)) &&
          !isNaN(parseFloat(row.core_clock)) &&
          !isNaN(parseFloat(row.boost_clock)) &&
          !isNaN(parseFloat(row.tdp))
        );
      });

      if (sortConfig) {
        const sortedData = [...filteredData].sort((a, b) => {
          const aValue = sortConfig.key === 'price' || sortConfig.key === 'core_clock' || sortConfig.key === 'boost_clock' || sortConfig.key === 'tdp'
            ? parseFloat(a[sortConfig.key])
            : parseInt(a[sortConfig.key], 10);

          const bValue = sortConfig.key === 'price' || sortConfig.key === 'core_clock' || sortConfig.key === 'boost_clock' || sortConfig.key === 'tdp'
            ? parseFloat(b[sortConfig.key])
            : parseInt(b[sortConfig.key], 10);

          if (sortConfig.direction === 'ascending') {
            return aValue - bValue;
          } else {
            return bValue - aValue;
          }
        });
        setData(sortedData);
      } else {
        setData(filteredData);
      }

      setTotalPages(Math.ceil(filteredData.length / rowsPerPage));
    }
  };

  const handlePageClick = (event: PageClickEvent) => {
    setPage(event.selected);
  };

  const handleSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    // Toggle the direction if the same key is clicked
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }

    // Set the new sort configuration and reset to the first page (page 0)
    setSortConfig({ key, direction });
    setPage(0);  // Reset to the first page when a sort button is clicked
  };

  useEffect(() => {
    fetchData();
  }, [page, sortConfig]); // Ensure sorting resets and applies when sortConfig changes

  const hasData = Array.isArray(data) && data.length > 0;

  const paginatedData = data.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

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
                {['name', 'price', 'core_count', 'core_clock', 'boost_clock', 'microarchitecture', 'tdp', 'graphics'].map((column) => (
                  <th
                    key={column}
                    style={{ flex: '1 1 15%', padding: '10px', textAlign: 'center', color: 'white', cursor: 'pointer' }}
                    onClick={() => handleSort(column)}
                  >
                    {column.charAt(0).toUpperCase() + column.slice(1)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hasData ? (
                paginatedData.map((row) => (
                  <tr key={row.id}>
                    <td colSpan={8}>
                      <button
                        style={{
                          width: '100%',
                          background: 'none',
                          border: 'none',
                          padding: '10px',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#2a2a2a';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'none';
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
          gap: 5px;
        }
        .pagination-item {
          padding: 10px;
          border: 1px solid #ccc;
          cursor: pointer;
          background-color: #333;
          color: white;
        }
        .pagination-item.active {
          background-color: #007bff;
          color: white;
        }
      `}</style>
    </section>
  );
}
