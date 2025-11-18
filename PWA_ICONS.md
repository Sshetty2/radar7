# PWA Icon Requirements

This document outlines the required icons and assets for the Radar7 Progressive Web App (PWA).

## Required Icons

The following icons must be placed in the `public/` directory:

### App Icons

- **icon-192.png** (192x192 pixels)
  - Purpose: Any maskable
  - Used for: Home screen icon on mobile devices
  - Format: PNG

- **icon-512.png** (512x512 pixels)
  - Purpose: Any maskable
  - Used for: High-resolution displays, splash screens
  - Format: PNG

### Screenshots (Optional but Recommended)

- **screenshot-desktop.png** (1280x720 pixels)
  - Form factor: Wide (desktop/tablet)
  - Format: PNG
  - Used for: App store listings, install prompts

- **screenshot-mobile.png** (750x1334 pixels)
  - Form factor: Narrow (mobile)
  - Format: PNG
  - Used for: App store listings, install prompts

## Favicon (Recommended)

- **favicon.ico** (32x32 pixels)
  - Used for: Browser tabs, bookmarks
  - Format: ICO

## Design Guidelines

### Maskable Icons
Icons marked as "maskable" should follow these guidelines:
- Include a **safe zone** in the center (80% of the icon size)
- Important content (logo, text) must stay within the safe zone
- The outer 20% may be cropped on some devices
- Background should extend to the edges

### Color Scheme
Based on the current theme configuration:
- **Light theme background**: `#ffffff` (white)
- **Dark theme background**: `#0a0a0b` (near black)
- **Theme color**: `#000000` (black)
- **Accent color**: Use brand colors consistently across all icons

### File Formats
- Use **PNG** for all app icons and screenshots
- Optimize images for file size without losing quality
- Recommended tools: ImageOptim, TinyPNG, or Squoosh

## Testing Icons

After creating icons:

1. **Local Testing**:
   - Place icons in `public/` directory
   - Run `npm run build`
   - Test with Chrome DevTools > Application > Manifest

2. **Device Testing**:
   - Test on iOS Safari (Add to Home Screen)
   - Test on Android Chrome (Install App prompt)
   - Verify icons appear correctly on home screen

3. **Maskable Icon Testing**:
   - Use [Maskable.app](https://maskable.app/) to preview maskable icons
   - Ensure important content stays within the safe zone

## Current Configuration

The PWA manifest is located at `app/manifest.ts` and includes:
- App name: "Radar7 - Event Discovery Platform"
- Short name: "Radar7"
- Theme colors configured for light/dark themes
- Icons configured with both "any" and "maskable" purposes

## Quick Start

To generate placeholder icons for development:

1. Create a 512x512 square icon with your logo/branding
2. Use an online tool like [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator) to create all sizes:
   ```bash
   npx pwa-asset-generator logo.svg public --manifest app/manifest.ts
   ```

3. Manually verify and optimize generated images
4. Test on actual devices

## References

- [Web.dev - Adaptive Icon Support](https://web.dev/maskable-icon/)
- [MDN - Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Maskable.app Editor](https://maskable.app/editor)
