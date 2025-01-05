async function refreshAccessToken() {
  try {
    const response = await fetch("/auth/refresh-token", {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      console.error("Failed to refresh access token");
      throw new Error("Unable to refresh access token");
    }

    console.log("Access token refreshed successfully");
  } catch (error) {
    console.error("Error during token refresh:", error.message);
    window.location.href = "/login";
  }
}

setInterval(() => {
  refreshAccessToken();
}, 60 * 60 * 1000);
