"use client"; // Ensures this is a client component

import { createClient } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

export default function GPUTable() {
  const supabaseUrl = "https://ogsbootxscuhnzosbkuy.supabase.co";
  const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nc2Jvb3R4c2N1aG56b3Nia3V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg0MzMwNjUsImV4cCI6MjA0NDAwOTA2NX0.41OqYzDjnCgcdPK4lo2--AGOSW3mVGw23khghZUxDw0"; // Replace with your actual anon key

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  type TableRow = {
    id: number;
    name: string;
    price: string;
    chipset: string;
    memory: string;
    core_clock: string;
    boost_clock: string;
    color: string;
    length: string;
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

  // Fetch data and set total pages based on the row count
  const fetchData = async () => {
    setLoading(true);

    const { data: rows, count, error } = await supabase
      .from('video-card') // Update with the correct table name in Supabase
      .select('*', { count: 'exact' });

    if (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
      return;
    }

    // Filter out rows where price is NaN or 0.00
    const filteredRows = rows?.filter(row => 
      !isNaN(parseFloat(row.price)) && 
      parseFloat(row.price) !== 0
    ) || [];

    const totalRowCount = filteredRows.length;
    setData(filteredRows);
    setTotalPages(Math.ceil(totalRowCount / rowsPerPage)); // Calculate total pages based on filtered data
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
    setPage(0); // Reset to first page when sorting
    sortData(key, direction); // Sort data based on selected key and direction
  };

  const sortData = (key: keyof TableRow, direction: 'ascending' | 'descending') => {
    const sorted = [...data].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      // If the key is numeric (price, core_clock, boost_clock, length), sort numerically
      if (key === 'price' || key === 'core_clock' || key === 'boost_clock' || key === 'length') {
        aValue = parseFloat(a[key]);
        bValue = parseFloat(b[key]);
      } else {
        // Sort strings using localeCompare for string fields
        aValue = a[key] as string;
        bValue = b[key] as string;
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'ascending' ? aValue - bValue : bValue - aValue;
      } else {
        return direction === 'ascending'
          ? (aValue as string).localeCompare(bValue as string)
          : (bValue as string).localeCompare(aValue as string);
      }
    });

    setData(sorted);
    setTotalPages(Math.ceil(sorted.length / rowsPerPage)); // Recalculate total pages based on sorted data length
  };

  // Memoize paginated data to avoid recalculating on every render
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
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Select GPU
          </h1>
        </div>

        <div>
          <table style={{ border: '1px solid black', width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ display: 'flex', textAlign: 'left', backgroundColor: '#2a2a2a' }}>
                {['name', 'price', 'chipset', 'memory', 'core_clock', 'boost_clock', 'color', 'length'].map((key) => (
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
                        <div style={{ flex: '1 1 10%' }}>{row.chipset}</div>
                        <div style={{ flex: '1 1 10%' }}>{row.memory}</div>
                        <div style={{ flex: '1 1 10%' }}>{parseFloat(row.core_clock).toFixed(1)}</div>
                        <div style={{ flex: '1 1 10%' }}>{parseFloat(row.boost_clock).toFixed(1)}</div>
                        <div style={{ flex: '1 1 10%' }}>{row.color}</div>
                        <div style={{ flex: '1 1 10%' }}>{row.length}</div>
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
