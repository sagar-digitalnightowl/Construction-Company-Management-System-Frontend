// src/data/stockConstants.js

export const STOCK_ITEM_CATEGORIES = [
	{ value: "cement", label: "Cement" },
	{ value: "rod", label: "Rod (TMT Bars / Rebar)" },
	{ value: "steel", label: "Steel" },
	{ value: "sand", label: "Sand" },
	{ value: "aggregate", label: "Aggregate (Bajri)" },
	{ value: "bricks", label: "Bricks" },
	{ value: "blocks", label: "Blocks" },
	{ value: "painter", label: "Painter (Paint Materials)" },
	{ value: "electrical", label: "Electrical" },
	{ value: "plumbing", label: "Plumbing" },
	{ value: "tiles", label: "Tiles" },
	{ value: "wood", label: "Wood" },
	{ value: "glass", label: "Glass" },
	{ value: "labour", label: "Labour (Cost Line Item)" },
	{ value: "fuel", label: "Fuel" },
	{ value: "water", label: "Water" },
	{ value: "hardware", label: "Hardware" },
	{ value: "scaffolding", label: "Scaffolding" },
	{ value: "shuttering", label: "Shuttering" },
	{ value: "other", label: "Other (Custom Item)" },
];

export const STOCK_UNITS = [
	{ value: "packet", label: "Packet" },
	{ value: "packets", label: "Packets" },
	{ value: "number", label: "Number" },
	{ value: "numbers", label: "Numbers" },
	{ value: "nos", label: "Nos" },
	{ value: "kilo", label: "Kilo" },
	{ value: "kg", label: "KG" },
	{ value: "bag", label: "Bag" },
	{ value: "bags", label: "Bags" },
	{ value: "ton", label: "Ton" },
	{ value: "tons", label: "Tons" },
	{ value: "liter", label: "Liter" },
	{ value: "liters", label: "Liters" },
	{ value: "cubic-meter", label: "Cubic Meter" },
	{ value: "cubic-meters", label: "Cubic Meters" },
	{ value: "sq-feet", label: "Sq Feet" },
	{ value: "sq-meter", label: "Sq Meter" },
	{ value: "roll", label: "Roll" },
	{ value: "rolls", label: "Rolls" },
	{ value: "box", label: "Box" },
	{ value: "boxes", label: "Boxes" },
	{ value: "drum", label: "Drum" },
	{ value: "bundle", label: "Bundle" },
	{ value: "bundles", label: "Bundles" },
	{ value: "piece", label: "Piece" },
	{ value: "pieces", label: "Pieces" },
	{ value: "set", label: "Set" },
	{ value: "trip", label: "Trip (Labour / Vehicle)" },
	{ value: "trips", label: "Trips (Labour / Vehicle)" },
	{ value: "other", label: "Other" },
];

// Work types for consumption records (v2.3, 12 values)
export const CONSUMPTION_WORK_TYPES = [
	{ value: "foundation", label: "Foundation" },
	{ value: "structure", label: "Structure" },
	{ value: "brickwork", label: "Brickwork" },
	{ value: "plaster", label: "Plaster" },
	{ value: "flooring", label: "Flooring" },
	{ value: "electrical", label: "Electrical" },
	{ value: "plumbing", label: "Plumbing" },
	{ value: "painting", label: "Painting" },
	{ value: "finishing", label: "Finishing" },
	{ value: "waterproofing", label: "Waterproofing" },
	{ value: "excavation", label: "Excavation" },
	{ value: "other", label: "Other" },
];

export const workTypeLabel = (value) => CONSUMPTION_WORK_TYPES.find((w) => w.value === value)?.label || value || "—";

// Older consumption records were saved without a tower or floor (the server reports them as "Unknown" or "(...)")
export const displayTower = (name) => (!name || name === "Unknown" ? "Tower not recorded" : name);
export const displayFloor = (floor) => (!floor || String(floor).startsWith("(") ? "No floor" : `Floor ${floor}`);

export const VERIFICATION_STATUS = {
	PENDING: "pending",
	VERIFIED: "verified",
	REJECTED: "rejected",
};

export const VERIFICATION_STATUS_LABELS = {
	pending: "Pending",
	verified: "Verified",
	rejected: "Rejected",
};

export const VERIFICATION_STATUS_COLORS = {
	pending: "warning",
	verified: "success",
	rejected: "destructive",
};
