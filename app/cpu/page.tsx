'use client';

import LogoCloud from '@/components/ui/LogoCloud';
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch all data from the database
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

    setData(filteredRows);
    setTotalPages(Math.ceil(count / rowsPerPage));
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
  };

  const sortedData = React.useMemo(() => {
    let sortableData = [...data];

    if (sortConfig) {
      const { key, direction } = sortConfig;

      sortableData.sort((a, b) => {
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
    }

    return sortableData;
  }, [data, sortConfig]);

  const paginatedData = React.useMemo(() => {
    const start = page * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

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
                  <tr key={row.id} style={{ display: 'flex', backgroundColor: '#1a1a1a', color: 'white', borderBottom: '1px solid #444' }}>
                    <td style={{ flex: '1 1 10%', padding: '10px', textAlign: 'center' }}>{row.name}</td>
                    <td style={{ flex: '1 1 10%', padding: '10px', textAlign: 'center' }}>{parseFloat(row.price).toFixed(2)}</td>
                    <td style={{ flex: '1 1 10%', padding: '10px', textAlign: 'center' }}>{row.core_count}</td>
                    <td style={{ flex: '1 1 10%', padding: '10px', textAlign: 'center' }}>{row.core_clock}</td>
                    <td style={{ flex: '1 1 10%', padding: '10px', textAlign: 'center' }}>{row.boost_clock}</td>
                    <td style={{ flex: '1 1 10%', padding: '10px', textAlign: 'center' }}>{row.microarchitecture}</td>
                    <td style={{ flex: '1 1 10%', padding: '10px', textAlign: 'center' }}>{row.tdp}</td>
                    <td style={{ flex: '1 1 10%', padding: '10px', textAlign: 'center' }}>{row.graphics}</td>
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
          />
        </div>
      </div>
    </section>
  );
}
