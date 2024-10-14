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
  const [sortConfig, setSortConfig] = useState<{ key: keyof TableRow; direction: 'ascending' | 'descending' } | null>(null);
  const rowsPerPage = 100; // Define how many rows per page

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    const { count, error: countError } = await supabase
      .from('cpu')
      .select('*', { count: 'exact', head: true });

    if (countError || count === null) {
      console.error('Error fetching row count:', countError);
      return;
    }

    const totalPages = Math.ceil(count / rowsPerPage);
    setTotalPages(totalPages);

    const { data: rows, error } = await supabase
      .from('cpu')
      .select('*')
      .range(page * rowsPerPage, (page + 1) * rowsPerPage - 1);

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      setData(rows || []);
    }
  };

  const handlePageClick = (event: PageClickEvent) => {
    setPage(event.selected);
  };

  const handleRowClick = (row: TableRow) => {
    console.log('Row clicked:', row);
  };

  const requestSort = (key: keyof TableRow) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = () => {
    if (sortConfig !== null) {
      const { key, direction } = sortConfig;
      return [...data].sort((a, b) => {
        if (typeof a[key] === 'string' && typeof b[key] === 'string') {
          return direction === 'ascending' ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key]);
        }
        return direction === 'ascending' ? (a[key] as number) - (b[key] as number) : (b[key] as number) - (a[key] as number);
      });
    }
    return data;
  };

  const formattedPrice = (price: string) => {
    return parseFloat(price).toFixed(2);
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
                sortedData().map((row) => (
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
                          alignItems: 'center',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#2a2a2a'; // Change background on hover
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'none'; // Revert background on mouse leave
                        }}
                      >
                        <span style={{ flex: '1 1 15%', padding: '10px', textAlign: 'center' }}>{row.name}</span>
                        <span style={{ flex: '1 1 15%', padding: '10px', textAlign: 'center' }}>
                          {formattedPrice(row.price)} {/* Format price here */}
                        </span>
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
    </section>
  );
}
