// Get Header
const getHeaders = () => {
  const token = localStorage.getItem('token');

  if (!token) return;
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('login_session', token);

  return headers;
};

export const getAgentAcc = async () => {
  const headers = getHeaders();
  const getAccApi = `/j/GetAgentAcc.aspx`;

  const response = await fetch(getAccApi, {
    headers,
  });

  const data = await response.json();

  console.log(data);

  if (!response.ok) throw new Error(data.msg || 'Could not get agent acc');
  if (data.code !== 200) throw new Error(data.mag || 'Fetch acc data error');

  return data.data;
};

export const setAgentAcc = async accData => {
  const headers = getHeaders();
  const setAccAPi = `/j/SetAgentAcc.aspx`;

  try {
    const response = await fetch(setAccAPi, {
      method: 'POST',
      headers,
      body: JSON.stringify(accData),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.msg || 'Could not edit acc');

    if (data.code !== 200) throw new Error(data.msg || 'Edit acc data fail.');

    return data.data;
  } catch (error) {
    console.log(error);
    throw new Error('*訪問伺服器時發生錯誤');
  }
};
