/** Same Origin regular expression */
import { InjectionToken } from "@angular/core";

export const SAMEORIGIN = new InjectionToken<RegExp>("wizdm.sameorigin.regex", {
  factory: () => {
    // Test the given URL to start with "data:" or "blob:" or the current host
    return new RegExp(`^data:|^blob:|^http(?:s)?:\/\/${window.location.host}`);
  }
});
