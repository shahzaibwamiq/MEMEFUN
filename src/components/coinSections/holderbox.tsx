import { shortenAddress } from "@/utils/AddressShortner";
import { HoldersAttributes } from "@/utils/Interfaces/CoinInterfaces";
import { useState } from "react";

export interface holderProp{
    Loading: boolean,
    holders: HoldersAttributes[],
    error: boolean,
    safePage: number,
    totalPages: number,
    totalHolders: number,
    onPageChange: (page: number) => void;
}

export default function HolderBox(props: holderProp) {
  const [currentPage, setCurrentPage] = useState(props.safePage || 1);
  const itemsPerPage = 5;
  const totalPages = props.totalPages;

    const setPage = (page: number) => {
        setCurrentPage(page);
        props.onPageChange(page);
    };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
          <a
            href="#"
            className="page-link"
            onClick={(e) => {
              e.preventDefault();
              setPage(i);
            }}
          >
            {i}
          </a>
        </li>
      );
    }
    return pageNumbers;
  };

  return (
    <>
      <div className="holder_box">
        <h5>Holders: {props.Loading ? ("Loading...") : (props.totalHolders)}</h5>
        <ul>
          {props.Loading ? (
            <li className="text-center w-full">Loading holders...</li>
          ) : props.error ? (
            <li className="text-center text-red-500 w-full">Failed to load holders.</li>
          ) : props.holders.length === 0 ? (
            <li className="text-center text-gray-400 w-full">No holders found.</li>
          ) : (
            props.holders.map((holder, index) => (
              <li key={index + 2}>
                <span>
                  <span>{(index + 1) + ((currentPage - 1) * itemsPerPage)}</span>{shortenAddress(holder?.user?.address ?? "Holder")}
                </span>
                <span>{(holder?.qty ?? 0)}%</span>
              </li>
            ))
          )}
        </ul>
        {/* <!-- Pagination --> */}
        {props.holders.length > 0 && props.totalPages > 1 && (
          <nav className={'w-100'}>
            <ul className="pagination justify-content-center">
              {currentPage > 1 && (
                <li className={'page-item'}>
                  <a
                    href="#"
                    className="page-link"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(currentPage - 1);
                    }}
                  >
                    <i className="fa-solid fa-angles-left"></i>
                  </a>
                </li>
              )}
              {renderPageNumbers()}
              {currentPage < totalPages && (
                <li className={'page-item'}>
                  <a
                    href="#"
                    className="page-link"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(currentPage + 1);
                    }}
                  >
                    <i className="fa-solid fa-angles-right"></i>
                  </a>
                </li>
              )}
            </ul>
          </nav>
        )}
      </div>
    </>
  )
}