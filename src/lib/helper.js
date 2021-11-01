export const _setAgentAccDataFormat = data => {
  console.log(data);
  data = {
    P1: data.account,
    P2: data.name,
    P3: data.bank,
    P4: data.city,
  };

  return data;
};
