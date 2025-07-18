/**
 * Angular dependency injection imports
 */
import { InjectionToken } from "@angular/core";

/**
 * Same Origin Token
 *
 * Provides a RegExp to test if a URL is from the same origin as the current page
 * Used by the DownloadDirective to determine how to handle file downloads
 *
 * The RegExp matches URLs that:
 * 1. Start with "data:" (data URLs)
 * 2. Start with "blob:" (blob URLs)
 * 3. Use the same host as the current page
 */
export const SAMEORIGIN = new InjectionToken<RegExp>("wizdm.sameorigin.regex", {
  factory: () => {
    // Test the given URL to start with "data:" or "blob:" or the current host
    return new RegExp(`^data:|^blob:|^http(?:s)?:\/\/${window.location.host}`);
  },
});
