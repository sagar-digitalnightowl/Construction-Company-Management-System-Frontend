// src/pages/stockManager/stockHelpers.js

import { STOCK_ITEM_CATEGORIES } from "@/data/stockConstants";

// Lists come back either as an array or wrapped in an object; accept both
export const pickList = (data, key = "items") => {
	if (Array.isArray(data)) return data;
	if (!data) return [];
	return data[key] || data.items || data.records || [];
};

export const categoryLabel = (value) => STOCK_ITEM_CATEGORIES.find((c) => c.value === value)?.label || value;

export const formatMoney = (value) => `₹${Math.round(Number(value) || 0).toLocaleString("en-IN")}`;

export const formatQty = (value) => Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });

// Keep only digits and one decimal point (typed or pasted)
export const sanitizeNumeric = (value) => {
	const cleaned = value.replace(/[^0-9.]/g, "");
	const [whole, ...decimals] = cleaned.split(".");
	return decimals.length ? `${whole}.${decimals.join("")}` : whole;
};

// Local calendar date as YYYY-MM-DD
export const todayKey = () => {
	const d = new Date();
	const pad = (n) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const dateKey = (value) => (value ? String(value).split("T")[0] : "");
