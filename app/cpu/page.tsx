'use client';

import { createClient } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

export default function CPUTable() {
  const supabaseUrl = "https://ogsbootxscuhnzosbkuy.supabase.co";
  const supabaseAnonKey = "YOUR_ANON_KEY"; // Replace with your actual anon key

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
    setPage(0); // Reset to page 0 when sorting
    sortData(key, direction); // Sort the data immediately
  };

  const sortData = (key: keyof TableRow, direction: 'ascending' | 'descending') => {
    const sorted = [...data].sort((a, b) => {
      let aValue: number;
      let bValue: number;

      if (key === 'price') {
        aValue = parseFloat(a[key] as string);
        bValue = parseFloat(b[key] as string);
      } else {
        aValue = parseInt(a[key] as string);
        bValue = parseInt(b[key] as string);
      }

      if (isNaN(aValue) || isNaN(bValue)) return 0;

      return direction === 'ascending' ? aValue - bValue : bValue - aValue;
    });

    setData(sorted);
    setTotalPages(Math.ceil(sorted.length / rowsPerPage)); // Update total pages based on sorted data
  };

  const handleSelect = (row: TableRow) => {
    // Handle the select action here (e.g., show a modal, log the selected item, etc.)
    console.log('Selected row:', row);
  };

  const paginatedData = React.useMemo(() => {
    const start = page * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }, [data, page, rowsPerPage]);

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
                <th style={{ flex: '1 1 10%', padding: '10px', textAlign: 'center', color: 'white' }}>Select</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} style={{ padding: '10px', textAlign: 'center', color: 'white' }}>
                    Loading...
                  </td>
                </tr>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((row) => (
                  <tr key={row.id} style={{ display: 'flex', backgroundColor: '#1a1a1a', color: 'white', borderBottom: '1px solid #444' }}>
                    <td style={{ flex: '1 1 10%', padding: '10px', textAlign: 'center' }}>{row.name}</td>
                    <td style={{ flex: '1 1 10%', padding: '10px', textAlign: 'center' }}>{parseFloat(row.price).toFixed(2)}</td>
                    <td style={{ flex: '1 1 10%', padding: '10px', textAlign: 'center' }}>{row.core_count}</td>
                    <td style={{ flex: '1 1 10%', padding: '10px', textAlign: 'center' }}>{row.core_clock}</td>
                    <td style={{ flex: '1 1 10%', padding: '10px', textAlign: 'center' }}>{row.boost_clock}</td>
                    <td style={{ flex: '1 1 10%', padding: '10px', textAlign: 'center' }}>{row.microarchitecture}</td>
                    <td style={{ flex: '1 1 10%', padding: '10px', textAlign: 'center' }}>{row.tdp}</td>
                    <td style={{ flex: '1 1 10%', padding: '10px', textAlign: 'center' }}>{row.graphics}</td>
                    <td style={{ flex: '1 1 10%', padding: '10px', textAlign: 'center' }}>
                      <button 
                        onClick={() => handleSelect(row)} 
                        style={{ padding: '5px 10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} style={{ padding: '10px', textAlign: 'center', color: 'white' }}>
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
            forcePage={page} // Ensure the pagination component reflects the current page state
          />
        </div>
      </div>
    </section>
  );
}
