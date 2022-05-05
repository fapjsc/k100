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

  switch (host) {
    case "88u":
      return "TWD";

    case "u88":
      return "TWD";

    case "jp88":
      return "JPY";

    default:
      return "CNY";
  }
};
