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
  const host = window.location.host;

  console.log(host);

  if (host.includes("88u.asia")) {
    return "TWD";
  }

  if (host.includes("jp88.asia")) {
    return "JPY";
  }

  return "CNY";
};
