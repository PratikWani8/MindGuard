import { failure } from "../utils/apiResponse.js";

export const validateBody = (rules) => (req, res, next) => {
  const errors = [];
  for (const [field, rule] of Object.entries(rules)) {
    const value = req.body[field];
    if (rule.required && (value === undefined || value === null || value === "")) {
      errors.push(`${field} is required`);
      continue;
    }
    if (value !== undefined && rule.type === "string" && typeof value !== "string") {
      errors.push(`${field} must be a string`);
    }
    if (value !== undefined && rule.minLength && String(value).length < rule.minLength) {
      errors.push(`${field} must be at least ${rule.minLength} characters`);
    }
    if (value !== undefined && rule.maxLength && String(value).length > rule.maxLength) {
      errors.push(`${field} must not exceed ${rule.maxLength} characters`);
    }
    if (value !== undefined && rule.min !== undefined && Number(value) < rule.min) {
      errors.push(`${field} must be at least ${rule.min}`);
    }
    if (value !== undefined && rule.max !== undefined && Number(value) > rule.max) {
      errors.push(`${field} must be at most ${rule.max}`);
    }
    if (value !== undefined && rule.pattern && !rule.pattern.test(String(value))) {
      errors.push(`${field} is invalid`);
    }
  }
  if (errors.length) return failure(res, "Validation failed", errors, 400);
  next();
};