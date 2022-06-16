// Get Header
export const getHeader = () => {
  const token = localStorage.getItem("token");

  if (!token) return;
  let headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("login_session", token);

  return headers;
};

export const locationMoneyPrefix = () => {
  // const host = window.location.host;s

  const host = process.env.REACT_APP_HOST_NAME;

  if (host === "88U") {
    return "TWD";
  }

  if (host === "JP88") {
    return "JPY";
  }

  return "CNY";
};

export const locationMoneyCalc = (value) => {
  const host = process.env.REACT_APP_HOST_NAME;

  if (host === "88U") {
    return value.toFixed(0);
  }

  if (host === "JP88") {
    return value.toFixed(0);
  }

  return value.toFixed(2);
};

// 換算千分位
export const thousandBitSeparator = (value) => {
  const host = process.env.REACT_APP_HOST_NAME;

  if (host === "88U") {
    return Number(parseFloat(value)).toLocaleString("en", {
      minimumFractionDigits: 0,
    });
  }

  if (host === "JP88") {
    return Number(parseFloat(value)).toLocaleString("en");
  }

  return Number(parseFloat(value)).toLocaleString("en", {
    minimumFractionDigits: 2,
  });
};

export const locationMoneyCalcWithThousand = (value) => {
  return thousandBitSeparator(locationMoneyCalc(value * 1));
};

export const usdtThousandBitSeparator = (value) => {
  return Number(Math.abs(parseFloat(value))).toLocaleString("en", {
    minimumFractionDigits: 2,
  });
};

export const usdtThousandBitSeparatorNonAbs = (value) => {
  return Number(parseFloat(value)).toLocaleString("en", {
    minimumFractionDigits: 2,
  });
};

// var money = "123456.789";
// console.log(
//   Number(
//     parseFloat(money).toFixed(3)
//   ).toLocaleString("en", {
//     minimumFractionDigits: 3
//   })
// );
