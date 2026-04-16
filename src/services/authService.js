import { ENDPOINTS } from "../api/apiConfig";

// LOGIN
export const loginUser = async (loginData) => {
  const response = await fetch(ENDPOINTS.login, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login Failed");
  }

  return data;
};