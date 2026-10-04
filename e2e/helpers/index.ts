// The walk-substitute helpers named in garage/pack/WALKS.md § Substitute evidence.
export {
  CERTIFICATE_FOOTER,
  checkInstallable,
  checkNullMx,
  clearSiteData,
  decodeQr,
  keep,
  openDownload,
} from './substitutes.ts';
export type { Installability, OpenedDownload } from './substitutes.ts';
