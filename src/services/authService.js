import { ENDPOINTS } from "../api/apiConfig";

// 🔐 LOGIN
export const loginUser = async (loginData) => {
  const response = await fetch(ENDPOINTS.login, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });

  if (!response.ok) {
    throw new Error("Login Failed");
  }

  const data = await response.json();

  // 🔥 STORE TOKEN (VERY IMPORTANT)
  if (data.token) {
    localStorage.setItem("token", data.token);
  } else {
    console.warn("⚠️ No token received from backend");
  }

  return data;
};

// 📝 REGISTER
export const registerUser = async (registerData) => {
  const response = await fetch(ENDPOINTS.register, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registerData),
  });

  if (!response.ok) {
    throw new Error("Registration Failed");
  }

  return response.json();
};

