// src/utils/validationErrorHandler.js

export function parseValidationErrors(payload) {
  const result = {};

  // payload is the axios error response data
  // your backend shape: { fieldErrors: { phoneNumber: "..." }, error: "...", status: 400 }
  if (payload?.fieldErrors && typeof payload.fieldErrors === "object") {
    Object.entries(payload.fieldErrors).forEach(([key, msg]) => {
      result[key] = msg;
    });
  }

  // fallback general error
  if (!Object.keys(result).length) {
    result._general = payload?.error || payload?.message || "Something went wrong";
  }

  return result;
}

export function hasFieldErrors(parsed) {
  return Object.keys(parsed).some((k) => k !== "_general");
}