import React, { useState } from "react";
import PaginatedItems from "./PaginatedItems";
import { BsFillPersonCheckFill } from "react-icons/bs";

import styles from "./AccListMobile.module.scss";

const AccListMobile = ({ accHistoryData, onClickHandler }) => {
  const [currentItems, setCurrentItems] = useState(null);

  //   console.log(accHistoryData);

  return (
    <>
      <section className={styles.container}>
        {currentItems?.map((d) => (
          <div onClick={() => onClickHandler(d.H_id)} className={styles.item}>
            <div className={styles.name}>
              <BsFillPersonCheckFill />
              {d.P2}
            </div>
            <div className={styles.account}>{d.P1}</div>
            <div className={styles.bank}>{d.P3}</div>
            <div className={styles.city}>{d.P4}</div>
          </div>
        ))}
      </section>

      <PaginatedItems
        setCurrentItems={setCurrentItems}
        itemsPerPage={5}
        items={accHistoryData}
      />
    </>
  );
};

export default AccListMobile;
