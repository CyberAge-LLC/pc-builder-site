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
  const rowsPerPage = 50; // Define how many rows per page
  const [sortConfig, setSortConfig] = useState<{ key: keyof TableRow; direction: 'ascending' | 'descending' } | null>(null);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    fetchData();
  }, [page, sortConfig]);

  const fetchData = async () => {
    setLoading(true); // Start loading
    // Fetch total row count to calculate total pages
    const { count, error: countError } = await supabase
      .from('cpu')
      .select('*', { count: 'exact', head: true });

    if (countError || count === null) {
      console.error('Error fetching row count:', countError);
      setLoading(false);
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
    setLoading(false); // Finished loading
  };

  const handlePageClick = (event: PageClickEvent) => {
    setPage(event.selected);
    await fetchData();
  };

  const handleSort = (key: keyof TableRow) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }

    setSortConfig({ key, direction });
    setPage(0); // Reset to page 0 when sorting
  };

  // Memoize sorted data
  const sortedData = React.useMemo(() => {
    let sortableData = [...data];

    if (sortConfig !== null) {
      const { key, direction } = sortConfig;

      sortableData.sort((a, b) => {
        let aValue: number | null = null;
        let bValue: number | null = null;

        if (key === 'price') {
          aValue = parseFloat(a[key]);
          bValue = parseFloat(b[key]);
        } else if (key === 'core_count' || key === 'tdp') {
          aValue = parseInt(a[key]);
          bValue = parseInt(b[key]);
        } else {
          aValue = a[key] as unknown as number;
          bValue = b[key] as unknown as number;
        }

        // Check if values are NaN, if so, omit them from sorting
        if (isNaN(aValue!) || isNaN(bValue!)) return 0;

        return direction === 'ascending' ? aValue - bValue : bValue - aValue;
      });
    }

    return sortableData;
  }, [data, sortConfig]);

  // Calculate paginated data
  const paginatedData = React.useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedData.slice(start, end);
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
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ padding: '10px', textAlign: 'center', color: 'white' }}>
                    Loading...
                  </td>
                </tr>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((row) => (
                  <tr key={row.id} style={{ display: 'flex', backgroundColor: '#1a1a1a', color: 'white', borderBottom: '1px solid #444' }}>
                    <td style={{ flex: '1 1 15%', padding: '10px', textAlign: 'center' }}>{row.name}</td>
                    <td style={{ flex: '1 1 15%', padding: '10px', textAlign: 'center' }}>{parseFloat(row.price).toFixed(2)}</td>
                    <td style={{ flex: '1 1 10%', padding: '10px', textAlign: 'center' }}>{row.core_count}</td>
                    <td style={{ flex: '1 1 10%', padding: '10px', textAlign: 'center' }}>{row.core_clock}</td>
                    <td style={{ flex: '1 1 10%', padding: '10px', textAlign: 'center' }}>{row.boost_clock}</td>
                    <td style={{ flex: '1 1 15%', padding: '10px', textAlign: 'center' }}>{row.microarchitecture}</td>
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

        {/* Pagination controls */}
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
