// Get Header
export const getHeader = () => {
  const token = localStorage.getItem("token");

  if (!token) return;
  let headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("login_session", token);

  return headers;
};

