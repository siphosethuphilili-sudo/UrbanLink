const isNode = typeof window === "undefined";

// Safe storage object
const storage = isNode
  ? {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    }
  : window.localStorage;

// Convert camelCase to snake_case
const toSnakeCase = (str) => {
  return str.replace(/([A-Z])/g, "_$1").toLowerCase();
};

// Get an application parameter
const getAppParamValue = (
  paramName,
  { defaultValue = undefined, removeFromUrl = false } = {}
) => {
  // If running outside the browser
  if (isNode) {
    return defaultValue;
  }

  const storageKey = `urbanhub_${toSnakeCase(paramName)}`;

  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get(paramName);

  // Remove parameter from URL if requested
  if (removeFromUrl && searchParam) {
    urlParams.delete(paramName);

    const newUrl = `${window.location.pathname}${
      urlParams.toString() ? `?${urlParams.toString()}` : ""
    }${window.location.hash}`;

    window.history.replaceState({}, document.title, newUrl);
  }

  // URL parameter has priority
  if (searchParam) {
    storage.setItem(storageKey, searchParam);
    return searchParam;
  }

  // Use default value
  if (defaultValue !== undefined) {
    storage.setItem(storageKey, defaultValue);
    return defaultValue;
  }

  // Use stored value
  const storedValue = storage.getItem(storageKey);

  if (storedValue) {
    return storedValue;
  }

  return null;
};

// Get all application parameters
const getAppParams = () => {
  // Clear access token if requested
  if (getAppParamValue("clear_access_token") === "true") {
    storage.removeItem("urbanhub_access_token");
    storage.removeItem("token");
  }

  return {
    appId: getAppParamValue("app_id", {
      defaultValue: import.meta.env.VITE_APP_ID,
    }),

    token: getAppParamValue("access_token", {
      removeFromUrl: true,
    }),

    fromUrl: getAppParamValue("from_url", {
      defaultValue: isNode ? "" : window.location.href,
    }),

    functionsVersion: getAppParamValue("functions_version", {
      defaultValue: import.meta.env.VITE_FUNCTIONS_VERSION,
    }),

    appBaseUrl: getAppParamValue("app_base_url", {
      defaultValue: import.meta.env.VITE_APP_BASE_URL,
    }),
  };
};

// Export application parameters
export const appParams = getAppParams();