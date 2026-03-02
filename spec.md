# Specification

## Summary
**Goal:** Make the app automatically prompt for camera access as soon as the face scan section is rendered, without requiring any user interaction.

**Planned changes:**
- Update `FaceScanComponent` to call `navigator.mediaDevices.getUserMedia({ video: true })` inside a `useEffect` with an empty dependency array on component mount
- Automatically start the live video feed if camera permission is granted
- Display a clear error message if camera permission is denied, instructing the user to enable it in their browser settings

**User-visible outcome:** When the user navigates to the face scan section, the browser immediately prompts for camera access. If granted, the video feed starts automatically; if denied, a helpful error message is shown.
