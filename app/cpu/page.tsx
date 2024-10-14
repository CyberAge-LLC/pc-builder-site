'use client';

import LogoCloud from '@/components/ui/LogoCloud';
import { createClient } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

export default function CPUTable() {
  const supabaseUrl = "https://ogsbootxscuhnzosbkuy.supabase.co";
  const supabaseAnonKey = "YOUR_ANON_KEY"; // Replace with your actual anon key

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  type TableRow = {
    col1: string;
    col2: string;
    col3: string;
    col4: string;
    col5: string;
    col6: string;
    col7: string;
    col8: string;
  };

  interface PageClickEvent {
    selected: number;
  }

  const [data, setData] = useState<TableRow[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const rowsPerPage = 10; // Define how many rows per page

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    // Fetch total row count to calculate total pages
    const { count, error: countError } = await supabase
      .from('cpu') // Ensure this table name is correct
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
      setData(rows || []); // Set empty array if rows is null
    }
  };

  const handlePageClick = (event: PageClickEvent) => {
    setPage(event.selected);
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
          <table border="1" width="100%">
            <thead>
              <tr>
                <th>Column 1</th>
                <th>Column 2</th>
                <th>Column 3</th>
                <th>Column 4</th>
                <th>Column 5</th>
                <th>Column 6</th>
                <th>Column 7</th>
                <th>Column 8</th>
              </tr>
            </thead>
            <tbody>
              {hasData ? (
                data.map((row, index) => (
                  <tr key={index}>
                    <td>{row.col1}</td>
                    <td>{row.col2}</td>
                    <td>{row.col3}</td>
                    <td>{row.col4}</td>
                    <td>{row.col5}</td>
                    <td>{row.col6}</td>
                    <td>{row.col7}</td>
                    <td>{row.col8}</td>
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
          />
        </div>
      </div>
    </section>
  );
}
