/**
 * Form-related constants
 */

export const FORM_LABELS = {
  category: "Category",
  price: "Price (ZAR)",
  title: "Title",
  description: "Description",
  brand: "Brand",
  condition: "Condition",
  size: "Size",
  location: "Location",
  model: "Model",
  type: "Type",
  year: "Year",
  mileage: "Mileage (KM)",
  engineSize: "Engine Size (CC)",
  images: "Images",
  status: "Status",
} as const

export const FORM_PLACEHOLDERS = {
  category: "Select category",
  price: "0",
  title: "e.g: 2023 Yamaha MT-07",
  description: "Describe your item in detail...",
  brand: "Select brand",
  condition: "Select condition",
  size: "Select size",
  location: "Select location",
  model: "Select model",
  type: "Select type",
  year: "e.g: 2023",
  mileage: "e.g: 5000",
  engineSize: "e.g: 600",
  status: "Select status",
} as const

export const VALIDATION_MESSAGES = {
  title: "Title is required",
  description: "Description must be at least 10 characters",
  price: "Price is required",
  images: "At least one image is required",
  motorcycleRequired: "Model, type, year, mileage, and engine size are required for motorcycles",
  invalidPrice: "Invalid price",
  invalidYear: "Invalid year",
  invalidMileage: "Invalid mileage",
  invalidEngineSize: "Invalid engine size",
} as const

export const FORM_VALIDATION = {
  year: {
    min: 1990,
    max: new Date().getFullYear() + 1,
  },
  mileage: {
    min: 0,
  },
  engineSize: {
    min: 50,
  },
  description: {
    minLength: 10,
  },
} as const

export const API_TIMEOUTS = {
  FETCH: 10000, // 10 seconds
  SUBMIT: 15000, // 15 seconds
} as const

export const BUTTON_TEXT = {
  create: {
    default: "Create Listing",
    loading: "Creating...",
  },
  edit: {
    default: "Save Changes",
    loading: "Saving...",
  },
  cancel: "Cancel",
  keepEditing: "Keep Editing",
  discardChanges: "Discard Changes",
} as const

export const DIALOG_TEXT = {
  unsavedChanges: {
    title: "Unsaved changes",
    description: "Are you sure you want to cancel? Your changes will be lost.",
  },
} as const

export const LOADING_TEXT = {
  listing: "Please wait...",
} as const

export const REQUIRED_FIELD_INDICATOR = "*"
