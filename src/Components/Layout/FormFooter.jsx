const FormFooter = () => {
  return (
    <div>
      <hr className="mt_mb" />
      <ul className="txt_12_grey">
        <li>本平台目前只提供USDT交易，其他數字貨幣交易將不予受理</li>
        <br />
        <li>本平台錢包地址充值或轉出，都是經由 USDT區塊鏈系統網絡確認。</li>
        <br />
        <li>本平台錢包地址可以重複充值或轉出；如因系統更新，我們會通過網站或口訊通知。</li>
        <br />
        <li>請勿向錢包地址充值任何非USDT資産，否則資産將不可找回。</li>
        <br />
        <li>最小充值金額：100USDT，小于最小金額的充值將不會上賬且無法退回。</li>
        <br />
        <li>請務必確認電腦及浏覽器安全，防止信息被篡改或泄露。</li>
        <br />
        <li>如有其他問題或要求提出爭議，可透過網頁上的客服對話窗聯絡我們。</li>
      </ul>
    </div>
  );
};

export default FormFooter;
