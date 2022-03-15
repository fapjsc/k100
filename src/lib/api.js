// Get Header
const getHeaders = () => {
  const token = localStorage.getItem("token");

  if (!token) return;
  let headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("login_session", token);

  return headers;
};

export const getAgentAcc = async () => {
  const headers = getHeaders();
  const getAccApi = `/j/GetAgentAcc.aspx`;

  const response = await fetch(getAccApi, {
    headers,
  });

  const data = await response.json();


  if (!response.ok) throw new Error(data.msg || "Could not get agent acc");
  if (data.code !== 200) throw new Error(data.mag || "Fetch acc data error");

  return data.data;
};

export const setAgentAcc = async (accData) => {
  const headers = getHeaders();
  const setAccAPi = `/j/SetAgentAcc.aspx`;

  try {
    const response = await fetch(setAccAPi, {
      method: "POST",
      headers,
      body: JSON.stringify(accData),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.msg || "Could not edit acc");

    if (data.code !== 200) throw new Error(data.msg || "Edit acc data fail.");

    return data.data;
  } catch (error) {
    // console.log(error);
    throw new Error(error);

  }
};

export const getAgentAccHistory = async (accData) => {
  const headers = getHeaders();
  const setAccAPi = `/j/GetAgentAccHistory.aspx`;

  try {
    const response = await fetch(setAccAPi, {
      method: "get",
      headers,
      body: JSON.stringify(accData),
    });


    const data = await response.json();

    if (!response.ok) throw new Error(data.msg || "Could not edit acc");

    if (data.code !== 200) throw new Error(data.msg || "Edit acc data fail.");


    return data.data;
  } catch (error) {
    // console.log(error);
    throw new Error(error);
  }
};

export const sendWebPushToken = async (deviceId) => {
  // console.log(deviceId);
  const token = localStorage.getItem("token");
  const headers = getHeaders(token);
  const sendDeviceIdUrl = `/j/SetDevice_Session.aspx`;

  try {
    const response = await fetch(sendDeviceIdUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({ DeviceID: deviceId }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.msg || "Could not send deviceId");

    if (data.code !== 200) throw new Error(data.msg || "Send deviceId fail");

    return data;
  } catch (error) {
    // console.log(error);
    throw new Error(error);
  }
};

export const confirmReceived = async ({orderToken, type}) => {
  // console.log(orderToken, type === 'sell');
  const headers = getHeaders();

  let url;

  if (type === "sell") {
    url = `/j/Req_Sell2.aspx`;
  } else {
    url = `/j/Req_BuyMatch2.aspx`;
  }

  // console.log(url)

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      Token: orderToken,
    }),
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.msg || "Could not fetch buy2");
  if (data.code !== 200) throw new Error(data.msg || "Fetch Fail");

  return data.data;
};

export const orderAppeal = async (orderToken) => {
  // console.log(orderToken);
  const headers = getHeaders();
  const appealUrl = `/j/Req_Appeal.aspx`;

  const response = await fetch(appealUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({
      Token: orderToken,
    }),
  });

  const data = await response.json();

  if (!response.ok) throw new Error("Fetch Fail");
  if (data.code !== 200) throw new Error("appeal fail");

  // console.log(data);
  return data.data;
};

export const cancelOrder = async (orderToken) => {
  const headers = getHeaders();
  const cancelApi = `/j/Req_CancelOrder.aspx`;
  const response = await fetch(cancelApi, {
    method: "POST",
    headers,
    body: JSON.stringify({
      Token: orderToken,
    }),
  });

  const data = await response.json();

  if (!response.ok) throw new Error("Fetch Fail");
  if (data.code !== 200) throw new Error("Cancel fail");

  return data.data;
};
