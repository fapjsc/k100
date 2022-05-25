import React, { useState, useEffect } from "react";
import PaginatedItems from "./PaginatedItems";
import { BsFillPersonCheckFill } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";

import styles from "./AccListMobile.module.scss";

import Button from "react-bootstrap/Button";
import useHttp from "../../../hooks/useHttp";

import { delAgentAcc } from "../../../lib/api";

const AccListMobile = ({ accHistoryData, onClickHandler, getAccHistory }) => {
  const [currentItems, setCurrentItems] = useState(null);

  const { data: currentAccData } = useSelector((state) => state.currentAcc);

  const {
    sendRequest: delAcc,
    data: delAccData,
    status: delAccStatus,
    error: delAccError,
  } = useHttp(delAgentAcc);

  //   console.log(accHistoryData);
  const dispatch = useDispatch();

  const deleteHandler = (id) => {
    delAcc(id);
  };

  useEffect(() => {
    console.log(delAccData);
    if (delAccStatus === "pending") return;

    if (delAccError) {
      alert(delAccError);
      return;
    }

    if (delAccData) {
      dispatch(getAccHistory());
    }
  }, [delAccStatus, delAccError, delAccData, dispatch]);

  return (
    <>
      <section className={styles.container}>
        {currentItems?.map((d) => (
          <div
            key={d.H_id}
            onClick={() => onClickHandler(d.H_id)}
            className={styles.item}
          >
            <div className={styles.name}>
              <BsFillPersonCheckFill />
              {d.P2}
            </div>
            <div className={styles.account}>{d.P1}</div>
            <div className={styles.bank}>{d.P3}</div>
            <div className={styles.city}>{d.P4}</div>
            {process.env.REACT_APP_HOST_NAME === "88U" &&
              currentAccData.P1 !== d.P1 &&
              currentAccData.P2 !== d.P2 &&
              currentAccData.P3 !== d.P3 && (
                <Button
                  variant="primary"
                  disabled={delAccStatus === "pending"}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteHandler(d.H_id);
                  }}
                >
                  {delAccStatus === "pending" ? (
                    <span style={{ fontSize: "5px", color: "white" }}>
                      loading...
                    </span>
                  ) : (
                    "DEL"
                  )}
                </Button>
              )}

            {process.env.REACT_APP_HOST_NAME === "K100U" &&
              currentAccData.P1 !== d.P1 &&
              currentAccData.P2 !== d.P2 &&
              currentAccData.P3 !== d.P3 &&
              currentAccData.P4 !== d.P4 && (
                <Button
                  variant="primary"
                  disabled={delAccStatus === "pending"}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteHandler(d.H_id);
                  }}
                >
                  {delAccStatus === "pending" ? (
                    <span style={{ fontSize: "5px", color: "white" }}>
                      loading...
                    </span>
                  ) : (
                    "DEL"
                  )}
                </Button>
              )}
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
