/**
 * Check whether a link's host is trusted.
 *
 * @param {string} link - The link (absolute or relative if allowRelative=true).
 * @param {Array<string>} trustedHosts - Array of allowed host patterns.
 *      Supported formats:
 *        - "example.com"  => matches example.com and any subdomain (sub.example.com)
 *        - ".example.com" => same as above
 *        - "localhost"    => exact host match
 *        - "127.0.0.1"    => exact match
 *        - "sub.example.com" => exact/subdomain match rules apply
 *        - "*.example.com" => wildcard for single-level subdomains
 *        - "regex:^.*\\.example\\.com$" => regex match (prefix with "regex:")
 *        - "*" => match anything
 * @param {Object} [opts]
 * @param {boolean} [opts.allowRelative=true] - If true, resolves relative URLs using `base`.
 * @param {string} [opts.base='http://localhost'] - Base used to resolve relative URLs.
 * @param {Array<string>} [opts.allowedProtocols=['http','https']] - Allowed URL protocols.
 * @returns {boolean}
 */
export function isTrusted(link:string, trustedHosts = import.meta.env.VITE_TRUSTED_HOST && import.meta.env.VITE_TRUSTED_HOST.split(",") || [], opts:{ allowRelative?:boolean,base?:string;allowedProtocols?:string[] } = {}) {
  const {
    allowRelative = true,
    base = import.meta.env.BASE_URL,
    allowedProtocols = ["http", "https"],
  } = opts;

  if (!link || typeof link !== "string") return false;

  // Reject data:, javascript:, mailto:, etc unless allowedProtocols includes them.
  const protoCandidate = link.split(":")[0].toLowerCase();
  if (protoCandidate && !/^[a-zA-Z]+$/.test(protoCandidate)) {
    // unlikely protocol, keep going to URL parsing
  } else if (link.includes(":") && !allowedProtocols.includes(protoCandidate)) {
    // has a scheme and it's not in allowedProtocols
    return false;
  }

  let url;
  try {
    // Try absolute first
    url = new URL(link);
  } catch (e) {
    if (allowRelative) {
      try {
        url = new URL(link, base);
      } catch (err) {
        return false;
      }
    } else {
      return false;
    }
  }

  // Protocol must be allowed
  if (!allowedProtocols.includes(url.protocol.replace(":", ""))) return false;

  // Normalize host (lowercase, remove trailing dot)
  let hostname = (url.hostname || "").toLowerCase();
  if (hostname.endsWith(".")) hostname = hostname.slice(0, -1);

  // Helper to check a single trusted pattern against hostname
  function matchPattern(pattern:string) {
    if (pattern === "*") return true;

    // regex:... pattern
    if (pattern.startsWith("regex:")) {
      try {
        const re = new RegExp(pattern.slice(6));
        return re.test(hostname);
      } catch (e) {
        return false;
      }
    }

    // wildcard in pattern (e.g. *.example.com)
    if (pattern.includes("*")) {
      // convert wildcard to regex safely
      const escaped = pattern.split("*").map(s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join(".*");
      const re = new RegExp(`^${escaped}$`, "i");
      return re.test(hostname);
    }

    // leading dot or plain domain (treat plain domain as domain + subdomains)
    const p = pattern.startsWith(".") ? pattern.slice(1).toLowerCase() : pattern.toLowerCase();

    // exact match
    if (hostname === p) return true;

    // subdomain match: hostname ends with ".p"
    if (hostname.endsWith("." + p)) return true;

    return false;
  }

  // If trustedHosts empty -> treat as not trusted (safer). Caller can include "*" to allow all.
  if (!Array.isArray(trustedHosts) || trustedHosts.length === 0) return false;

  for (const pat of trustedHosts) {
    if (matchPattern(String(pat))) return true;
  }

  return false;
}


/**
 * Adds or updates query parameters in a given URL.
 *
 * @param url - The base URL (e.g. "http://localhost:8000/path/?foo=bar")
 * @param newParams - An object of new query params (e.g. { page: 2, sort: "desc" })
 * @returns A new URL string with updated query parameters.
 */
export function updateURLParams(url: string, newParams: Record<string, any>): string {
  const parsedUrl = new URL(url, window.location.origin);

  // Add or update params
  Object.entries(newParams).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      parsedUrl.searchParams.delete(key);
    } else {
      parsedUrl.searchParams.set(key, String(value));
    }
  });

  return parsedUrl.toString();
}