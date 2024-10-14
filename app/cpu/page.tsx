'use client';

import LogoCloud from '@/components/ui/LogoCloud';
import cn from 'classnames';
import { createClient } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

const supabaseUrl = "https://ogsbootxscuhnzosbkuy.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nc2Jvb3R4c2N1aG56b3Nia3V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg0MzMwNjUsImV4cCI6MjA0NDAwOTA2NX0.41OqYzDjnCgcdPK4lo2--AGOSW3mVGw23khghZUxDw0";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function CPUTable() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const rowsPerPage = 10; // Define how many rows per page

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    // Fetch total row count to calculate total pages
    const { count } = await supabase
      .from('cpu')
      .select('*', { count: 'exact', head: true });

    const totalPages = Math.ceil(count / rowsPerPage);
    setTotalPages(totalPages);

    // Fetch paginated data
    const { data: rows, error } = await supabase
      .from('my_table')
      .select('*')
      .range(page * rowsPerPage, (page + 1) * rowsPerPage - 1);

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      setData(rows);
    }
  };

  const handlePageClick = (event) => {
    setPage(event.selected);
  };

  return (
    <section className="bg-black">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
            CPU
          </p>
        </div>
        <LogoCloud />
      </div>
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
            {data.map((row, index) => (
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
            ))}
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
    </section>
  );
}

export default function CPU() {
  return (
  );
}