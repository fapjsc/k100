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

  // if (host.includes("88u.asia")) {
  //   return "TWD";
  // }

  // if (host.includes("jp88.asia")) {
  //   return "JPY";
  // }

  return "CNY";
};
