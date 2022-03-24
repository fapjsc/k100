import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";

// items = [
//     { token: "1234", Date: "test", UsdtAmt: 1234, D1: "1.22", D2: "1" },
//     { token: "1234", Date: "test", UsdtAmt: 1234, D1: "1.22", D2: "2" },
//     { token: "1234", Date: "test", UsdtAmt: 1234, D1: "1.22", D2: "3" },
//     { token: "1234", Date: "test", UsdtAmt: 1234, D1: "1.22", D2: "4" },
//     { token: "1234", Date: "test", UsdtAmt: 1234, D1: "1.22", D2: "5" },
//     { token: "1234", Date: "test", UsdtAmt: 1234, D1: "1.22", D2: "6" },
//     { token: "1234", Date: "test", UsdtAmt: 1234, D1: "1.22", D2: "7" },
//     { token: "1234", Date: "test", UsdtAmt: 1234, D1: "1.22", D2: "8" },
//     { token: "1234", Date: "test", UsdtAmt: 1234, D1: "1.22", D2: "9" },
//     { token: "1234", Date: "test", UsdtAmt: 1234, D1: "1.22", D2: "10" },
//     { token: "1234", Date: "test", UsdtAmt: 1234, D1: "1.22", D2: "11" },
//     { token: "1234", Date: "test", UsdtAmt: 1234, D1: "1.22", D2: "12" },
//     { token: "1234", Date: "test", UsdtAmt: 1234, D1: "1.22", D2: "13" },
//     { token: "1234", Date: "test", UsdtAmt: 1234, D1: "1.22", D2: "14" },
//     { token: "1234", Date: "test", UsdtAmt: 1234, D1: "1.22", D2: "15" },
//     { token: "1234", Date: "test", UsdtAmt: 1234, D1: "1.22", D2: "16" },
//     { token: "1234", Date: "test", UsdtAmt: 1234, D1: "1.22", D2: "17" },
//     { token: "1234", Date: "test", UsdtAmt: 1234, D1: "1.22", D2: "18" },
//     { token: "1234", Date: "test", UsdtAmt: 1234, D1: "1.22", D2: "19" },
//   ];

const ExpiredItem = ({ itemsPerPage, items, setCurrentItems }) => {
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);

  const handlePageClick = (event) => {
    const newOffset = (event?.selected * itemsPerPage) % items.length;
    setItemOffset(newOffset);
  };

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(items?.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(items?.length / itemsPerPage));
    // eslint-disable-next-line
  }, [itemOffset, itemsPerPage, items]);
  return (
    <ReactPaginate
      nextLabel=">"
      previousLabel="<"
      onPageChange={handlePageClick}
      pageRangeDisplayed={1}
      marginPagesDisplayed={2}
      pageCount={pageCount}
      containerClassName="pagination"
      pageClassName="page-item"
      breakClassName="page-item"
      previousClassName="page-item"
      nextClassName="page-item"
      pageLinkClassName="page-link"
      previousLinkClassName="page-link"
      nextLinkClassName="page-link"
      breakLinkClassName="page-link"
      breakLabel="..."
      activeClassName="active"
      renderOnZeroPageCount={null}
    />
  );
};

export default ExpiredItem;
