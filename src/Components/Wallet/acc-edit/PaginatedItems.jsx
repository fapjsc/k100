import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";

const PaginatedItems = ({ itemsPerPage, items, setCurrentItems }) => {
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    setItemOffset(newOffset);
  };

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(items.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(items.length / itemsPerPage));
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

export default PaginatedItems;
