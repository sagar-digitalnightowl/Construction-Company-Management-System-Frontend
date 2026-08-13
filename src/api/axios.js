import axios from "axios";

const { VITE_API_URL } = import.meta.env;

const api = axios.create({
	baseURL: VITE_API_URL,
	withCredentials: true,
	timeout: 45000, // 45 seconds timeout
});

api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("accessToken");

		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		return config;
	},
	(error) => Promise.reject(error),
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
	failedQueue.forEach((prom) => {
		if (error) prom.reject(error);
		else prom.resolve(token);
	});
	failedQueue = [];
};

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		// 1. Handle Network Error / Disconnected Internet
		if (!navigator.onLine || error.message === "Network Error") {
			console.error("Network/Internet error!");
			error.response = {
				data: {
					message:
						"A network error occurred or the internet connection was lost. Please check your network settings and try again.",
				},
			};
			return Promise.reject(error);
		}

		// 2. Handle Timeout Error (45 seconds)
		if (
			error.code === "ECONNABORTED" &&
			error.message.includes("timeout")
		) {
			console.error("API request timed out!");
			error.response = {
				data: {
					message:
						"The request timed out after 45 seconds. The server took too long to respond. Please try again later.",
				},
			};
			return Promise.reject(error);
		}

		// 3. Handle Throttling / Rate Limit Error (Status 429)
		if (error?.response?.status === 429) {
			console.warn("Rate limit exceeded (Throttling)!");
			error.response = {
				data: {
					message:
						"You have made too many requests. Please wait a few minutes before trying again.",
				},
			};
			return Promise.reject(error);
		}

		// 4. Handle 401 Unauthorized & Refresh Token Logic
		if (error?.response?.status === 401 && !originalRequest._retry) {
			// Intercept Login Requests
			if (originalRequest.url.includes("/auth/login")) {
				const backendMessage = error.response.data?.message;

				// Only override the generic technical message. Let "Account not activated" pass through.
				if (backendMessage === "Invalid credentials") {
					error.response.data = {
						...error.response.data,
						message:
							"Incorrect email/phone or password. Please check your details and try again.",
					};
				}
				return Promise.reject(error);
			}

			// Reject immediately if the refresh token itself fails
			if (originalRequest.url.includes("/auth/refresh-token")) {
				return Promise.reject(error);
			}

			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then((token) => {
						originalRequest.headers.Authorization =
							"Bearer " + token;
						return api(originalRequest);
					})
					.catch((err) => Promise.reject(err));
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				const refreshToken = localStorage.getItem("refreshToken");

				const res = await axios.post(
					`${VITE_API_URL}/auth/refresh-token`,
					{ refreshToken: refreshToken || "" },
				);

				const newAccessToken = res.data.accessToken;

				localStorage.setItem("accessToken", newAccessToken);

				processQueue(null, newAccessToken);

				originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

				return api(originalRequest);
			} catch (err) {
				processQueue(err, null);
				return Promise.reject(err);
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(error);
	},
);

export default api;
