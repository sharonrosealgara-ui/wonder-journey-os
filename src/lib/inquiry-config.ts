import 'server-only';

/**
 * Server-only inquiry pipeline configuration and fail-closed gates.
 */

export function isInquiryFormEnabled(): boolean {
  return process.env.INQUIRY_FORM_ENABLED === 'true';
}

export function getInquiryPrivacyNoticeVersion(): string | null {
  const version = process.env.INQUIRY_PRIVACY_NOTICE_VERSION?.trim();
  if (!version || version.toLowerCase().includes('draft')) {
    return null;
  }
  return version;
}
