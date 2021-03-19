import React from 'react';

const UploadForm = () => {
    return (
        <div>
            <div className="upload_doc">
                <div className="i_dl" />
                <span />
                上傳單據
            </div>
            <button className="easy-btn mw400 pt_20">已完成付款</button>
            <a className="cancel_btn" href="/">
                取消訂單
            </a>
            <hr className="mt_mb" />
            <p className="txt_12_grey">
                信息為幣商的指定收款賬戶，請務必按照規則操作，網銀轉賬到賬戶。
            </p>
        </div>
    );
};

export default UploadForm;
