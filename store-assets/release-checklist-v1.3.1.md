# LoyalCard v1.3.1 release checklist

## Completed

- [x] Bundle name matches AppGallery app ID: `sk.loyalcard.app`
- [x] Version metadata set to `1.3.1` / `1030100`
- [x] New application icon added and referenced by the wearable config
- [x] Slovak and English store listing copy prepared
- [x] Slovak and English privacy policy prepared
- [x] Privacy and support pages published over HTTPS
- [x] Five screenshots captured with test card data
- [x] QR and EAN-13 logic tests pass
- [x] Unsigned HAP build succeeds
- [x] QR and EAN codes verified with a phone scanner in the Previewer

## Before AppGallery submission

- [x] Developer identity verification approved
- [ ] Confirm AppGallery category offered for Lite Wearable apps
- [ ] Confirm screenshot count, dimensions, and file-size limits in the form
- [ ] Export screenshots to the dimensions required by the form
- [ ] Export the store icon to the dimensions required by the form
- [ ] Complete the AppGallery content rating questionnaire
- [ ] Select Slovakia and Czech Republic as initial distribution regions
- [ ] Configure cloud-managed signing
- [ ] Build and archive the signed release HAP
- [ ] Install and smoke-test the signed release on a physical supported watch
- [ ] Recheck QR and EAN scanning from the physical watch display
- [ ] Submit the release for AppGallery review

## After approval

- [ ] Confirm the public AppGallery listing and download
- [ ] Tag the merged release commit as `v1.3.1`
- [ ] Create GitHub release notes for `v1.3.1`
- [ ] Archive the exact signed package submitted to AppGallery
