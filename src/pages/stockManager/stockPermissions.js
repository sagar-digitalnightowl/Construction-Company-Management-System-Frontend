// src/pages/stockManager/stockPermissions.js
// Permission matrix for the site stock module (Frontend Integration Notes v2.3, section 9).
// The backend enforces the same rules; these checks only decide what the UI shows.

const OWN_ENTRY_ROLES = ["site_manager", "site_engineer", "project_manager"];
const MANAGER_ROLES = ["admin", "director", "hr_manager", "finance_executive", "project_manager"];
const VERIFY_ROLES = ["admin", "hr_manager", "finance_executive", "project_manager"];
const REORDER_SET_ROLES = ["admin", "hr_manager", "finance_executive", "project_manager"];
const REORDER_DELETE_ROLES = ["admin", "project_manager"];
const CONSUMPTION_CREATE_ROLES = ["site_manager", "site_engineer", "project_manager", "admin", "finance_executive"];
// These roles can edit or delete any consumption record, verified ones included
const CONSUMPTION_MANAGE_ANY_ROLES = ["admin", "finance_executive", "project_manager"];

const normalize = (role) => (role || "").toLowerCase();

export const currentUserId = (current) => current?._id ?? current?.id;

// Reports and consumptions carry the reporter as reportedBy or consumedBy (object or id)
const ownerIdOf = (record) => {
	const owner = record?.reportedBy ?? record?.consumedBy;
	return owner?._id ?? owner;
};

const isOwner = (userId, record) => Boolean(userId) && ownerIdOf(record) === userId;

export const isSiteRole = (role) => OWN_ENTRY_ROLES.includes(normalize(role));

export const rolePerms = (role) => {
	const r = normalize(role);
	return {
		isAdmin: r === "admin",
		canAddStock: ["site_manager", "site_engineer", "project_manager", "admin"].includes(r),
		canAddConsumption: CONSUMPTION_CREATE_ROLES.includes(r),
		canViewManage: MANAGER_ROLES.includes(r),
		canVerify: VERIFY_ROLES.includes(r),
		canSetReorder: REORDER_SET_ROLES.includes(r),
		canDeleteReorder: REORDER_DELETE_ROLES.includes(r),
	};
};

// Stock report: owner can edit while it is not verified (rejected entries can be corrected and resubmitted)
export const canEditStock = (role, userId, report) =>
	OWN_ENTRY_ROLES.includes(normalize(role)) && isOwner(userId, report) && report.verificationStatus !== "verified";

// Admin can delete anything; the owner can delete their own entry while it is not verified
export const canDeleteStock = (role, userId, report) => {
	const r = normalize(role);
	if (r === "admin") return true;
	return OWN_ENTRY_ROLES.includes(r) && isOwner(userId, report) && report.verificationStatus !== "verified";
};

// Admin, finance and PM edit any consumption; site roles edit their own while it is not verified
export const canEditConsumption = (role, userId, record) => {
	const r = normalize(role);
	if (CONSUMPTION_MANAGE_ANY_ROLES.includes(r)) return true;
	return OWN_ENTRY_ROLES.includes(r) && isOwner(userId, record) && record.verificationStatus !== "verified";
};

// Same rule as edit: admin, finance and PM delete any record; site roles delete their own unverified ones
export const canDeleteConsumption = (role, userId, record) => {
	const r = normalize(role);
	if (CONSUMPTION_MANAGE_ANY_ROLES.includes(r)) return true;
	return OWN_ENTRY_ROLES.includes(r) && isOwner(userId, record) && record.verificationStatus !== "verified";
};
