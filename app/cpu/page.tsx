"use client"; // Ensures this is a client component

import { createClient } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

export default function CPUTable() {
  const supabaseUrl = "https://ogsbootxscuhnzosbkuy.supabase.co";
  const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nc2Jvb3R4c2N1aG56b3Nia3V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg0MzMwNjUsImV4cCI6MjA0NDAwOTA2NX0.41OqYzDjnCgcdPK4lo2--AGOSW3mVGw23khghZUxDw0"; // Replace with your actual anon key

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

  const [data, setData] = useState<TableRow[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const rowsPerPage = 50;
  const [sortConfig, setSortConfig] = useState<{ key: keyof TableRow; direction: 'ascending' | 'descending' } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState<TableRow | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    const { data: rows, count, error } = await supabase
      .from('cpu')
      .select('*', { count: 'exact' });

    if (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
      return;
    }

    const filteredRows = rows?.filter(row => 
      !isNaN(parseFloat(row.price)) && 
      !isNaN(parseInt(row.core_count)) && 
      !isNaN(parseInt(row.tdp))
    ) || [];

    const totalRowCount = count ?? 0;
    setData(filteredRows);
    setTotalPages(Math.ceil(totalRowCount / rowsPerPage));
    setLoading(false);
  };

  const handlePageClick = (event: { selected: number }) => {
    setPage(event.selected);
  };

  const handleSort = (key: keyof TableRow) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }

    setSortConfig({ key, direction });
    setPage(0);
    sortData(key, direction);
  };

  const sortData = (key: keyof TableRow, direction: 'ascending' | 'descending') => {
    const sorted = [...data].sort((a, b) => {
      let aValue: number | null;
      let bValue: number | null;

      if (key === 'price') {
        aValue = parseFloat(a[key] as string);
        bValue = parseFloat(b[key] as string);
      } else if (key === 'core_clock') {
        aValue = parseFloat(a[key] as string);
        bValue = parseFloat(b[key] as string);
      } else if (key === 'boost_clock') {
        aValue = isNaN(parseFloat(a[key] as string)) ? null : parseFloat(a[key] as string);
        bValue = isNaN(parseFloat(b[key] as string)) ? null : parseFloat(b[key] as string);
      } else {
        aValue = parseInt(a[key] as string);
        bValue = parseInt(b[key] as string);
      }

      // Place NaN (null) values at the end
      if (aValue === null) return 1;
      if (bValue === null) return -1;

      return direction === 'ascending' ? aValue - bValue : bValue - aValue;
    });

    setData(sorted);
    setTotalPages(Math.ceil(sorted.length / rowsPerPage));
  };

  const paginatedData = React.useMemo(() => {
    const start = page * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }, [data, page, rowsPerPage]);

  const handleRowClick = (row: TableRow) => {
    setSelectedRow(row);
    console.log('Selected row:', row); // Replace with your desired action
  };

  return (
    <section className="bg-black">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
            Select CPU
          </p>
        </div>

        <div>
          <table style={{ border: '1px solid black', width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ display: 'flex', textAlign: 'left', backgroundColor: '#2a2a2a' }}>
                {['name', 'price', 'core_count', 'core_clock', 'boost_clock', 'microarchitecture', 'tdp', 'graphics'].map((key) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key as keyof TableRow)}
                    style={{ flex: '1 1 10%', padding: '10px', textAlign: 'center', color: 'white', cursor: 'pointer' }}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ padding: '10px', textAlign: 'center', color: 'white' }}>
                    Loading...
                  </td>
                </tr>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((row) => (
                  <tr key={row.id}>
                    <td colSpan={8} style={{ padding: '0' }}>
                      <button
                        onClick={() => handleRowClick(row)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          height: '50px',
                          backgroundColor: selectedRow?.id === row.id ? '#3b3b3b' : '#1a1a1a',
                          color: 'white',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '10px',
                          textAlign: 'center',
                          borderBottom: '1px solid #444',
                          transition: 'background-color 0.3s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2b2b2b'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selectedRow?.id === row.id ? '#3b3b3b' : '#1a1a1a'}
                      >
                        <div style={{ flex: '1 1 10%' }}>{row.name}</div>
                        <div style={{ flex: '1 1 10%' }}>{parseFloat(row.price).toFixed(2)}</div>
                        <div style={{ flex: '1 1 10%' }}>{row.core_count}</div>
                        <div style={{ flex: '1 1 10%' }}>{parseFloat(row.core_clock).toFixed(1)}</div>
                        <div style={{ flex: '1 1 10%' }}>{isNaN(parseFloat(row.boost_clock)) ? 'N/A' : parseFloat(row.boost_clock).toFixed(1)}</div>
                        <div style={{ flex: '1 1 10%' }}>{row.microarchitecture}</div>
                        <div style={{ flex: '1 1 10%' }}>{row.tdp}</div>
                        <div style={{ flex: '1 1 10%' }}>{row.graphics}</div>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} style={{ padding: '10px', textAlign: 'center', color: 'white' }}>
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-6">
          <ReactPaginate
            breakLabel="..."
            nextLabel="Next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={2}
            pageCount={totalPages}
            previousLabel="< Previous"
            renderOnZeroPageCount={null}
            className="flex items-center"
            activeClassName="bg-blue-500 text-white"
            previousClassName="mx-2 px-4 py-2 border rounded-md cursor-pointer bg-gray-700 text-white hover:bg-gray-600"
            nextClassName="mx-2 px-4 py-2 border rounded-md cursor-pointer bg-gray-700 text-white hover:bg-gray-600"
            pageClassName="mx-1"
            pageLinkClassName="px-4 py-2 border rounded-md cursor-pointer bg-gray-800 text-white hover:bg-gray-700"
            forcePage={page}
          />
        </div>
      </div>
    </section>
  );
}
