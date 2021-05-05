import React from 'react';
import './index.scss';
// import noDataImg from '../../Assets/nodata.png';
import Figure from 'react-bootstrap/Figure';

const NoData = () => {
  return (
    <div className="nodataBox">
      <Figure className="nodata-imgBox">
        <Figure.Caption>目前還沒有資料</Figure.Caption>
      </Figure>
    </div>
  );
};

export default NoData;
