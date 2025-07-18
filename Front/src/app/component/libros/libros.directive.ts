/**
 * Angular and HTTP imports
 */
import { HttpClient } from "@angular/common/http";
import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Inject,
  Input
} from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

/**
 * RxJS imports for reactive programming
 */
import { of, Subscription } from "rxjs";
import { catchError, map } from "rxjs/operators";

/**
 * Application tokens
 */
import { SAMEORIGIN } from "./same-origin-token";

/**
 * Download directive decorator
 * Enhances anchor elements with download attribute to handle cross-origin downloads
 */
@Directive({
  selector: "a[download]", // Targets all anchor elements with download attribute
  exportAs: "wmDownload"   // Allows template reference with #var="wmDownload"
})
/**
 * Download directive class
 * Provides functionality to download files from both same and cross-origin sources
 * Handles CORS issues by fetching the file as a blob and creating an object URL
 */
export class DownloadDirective {
  /**
   * Error state flag
   * True if something went wrong attempting to download the resource
   */
  public error: boolean = false;

  /**
   * Processing state flag
   * True when the request is in process
   */
  public busy: boolean = false;

  /**
   * Private properties for internal directive functionality
   */
  // Subscription to HTTP request
  private sub: Subscription;
  // Blob URL object reference
  private blob: any;
  // Current href value
  private href: string;

  /**
   * Constructor for the DownloadDirective
   * @param sameOrigin - RegExp to test if a URL is from the same origin
   * @param http - HttpClient for making HTTP requests
   * @param ref - Reference to the host anchor element
   * @param sanitizer - DomSanitizer for URL sanitization
   */
  constructor(
    @Inject(SAMEORIGIN) private sameOrigin: RegExp,
    private http: HttpClient,
    private ref: ElementRef<HTMLAnchorElement>,
    private sanitizer: DomSanitizer
  ) {}

  /**
   * Download attribute binding
   * Turns the download attribute into an input property
   */
  @HostBinding("attr.download")
  @Input()
  download: string;

  /**
   * Href setter
   * Intercepts the href attribute to handle URL management
   * @param href - The URL to download from
   */
  @Input("href") set source(href: string) {
    // Revokes the previous URL object if any
    // releases an existing URL that was previously created, so the browser knows
    // it is no longer needed to keep a reference to this file
    if (this.blob) {
      URL.revokeObjectURL(this.blob);
      this.blob = undefined;
    }
    // Reset possible errors
    this.error = false;

    // update the href
    this.href = href;
  }

  /**
   * Safe href getter
   * Sanitizes the href to accept both URLs and blobs
   * @returns A sanitized URL that bypasses Angular's security
   */
  @HostBinding("href") get safeHref(): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(this.href);
  }

  /**
   * Click event handler
   * Manages the download process when the link is clicked
   * @returns false to prevent default browser behavior when handling cross-origin downloads
   */
  @HostListener("click") onClick() {
    // Do nothing on empty href
    if (!this.href || this.busy) {
      return false;
    }

    // Proceed with the download on files from the same origin
    if (this.error || this.sameOrigin.test(this.href)) {
      return true;
    }

    // Unsubscribes previous subscription, if any
    if (this.sub) {
      this.sub.unsubscribe();
    }

    // Starts processing
    this.busy = true;

    // Gets the source file as a blob
    this.sub = this.http
      .get(this.href, { responseType: "blob" })
      .pipe(
        // Creates the URL object ready for download
        map(blob => (this.blob = URL.createObjectURL(blob))),

        // Catches possible errors such as CORS not allowing the file download
        catchError(error => {
          // Reports the error preventing the download
          console.error("Unable to download the source file", error);

          // Tracks the error for the next round to complete anyhow
          this.error = true;

          // Reverts to the original href for the browser to open the file instead of downloading it
          return of(this.href);
        })
      )
      .subscribe(url => {
        // Updates the href with the blob url on success
        this.href = url;

        // Ends processing
        this.busy = false;

        // Triggers another click event making sure the [href] gets updated first
        setTimeout(() => this.ref.nativeElement.click());
      });

    // Prevents default
    return false;
  }

  /**
   * Angular lifecycle hook that is called when the directive is destroyed
   * Cleans up resources to prevent memory leaks
   */
  ngOnDestroy() {
    // Revokes the URL object
    if (this.blob) {
      URL.revokeObjectURL(this.blob);
    }

    // Unsubscribes the encoder
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
