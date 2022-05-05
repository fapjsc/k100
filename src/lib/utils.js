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

  switch (host) {
    case host === "88u.asia":
      return "TWD";

    case host === "jp88.asia":
      return "JPY";

    default:
      return "CNY";
  }
};
