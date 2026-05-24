## Goal
Move the glowing P6 marker on the calibration screen illustration so it sits higher on the inner forearm — just below the wrist crease rather than mid-forearm.

## Approach
The hand is a static AI-generated PNG (`src/assets/p6-hand.png`), so the dot can't be repositioned with CSS. Use `imagegen--edit_image` to redraw the same illustration with the rose-gold dot moved up to the correct anatomical P6 location: roughly 2–3 finger-widths below the wrist crease (currently it's drawn much further down the forearm).

## Steps
1. Run `imagegen--edit_image` on `src/assets/p6-hand.png` with a prompt to relocate the glowing rose-gold dot and its halo higher up — just under the wrist crease, between the two tendons — keeping everything else (hand pose, navy background, style) identical.
2. Overwrite the existing asset so no code changes are needed; the onboarding screen will pick it up automatically.
3. Visually QA the regenerated image to confirm the dot is in the right spot and the rest of the illustration is unchanged.

## Notes
- No code changes to `src/routes/onboarding.tsx` expected.
- If the edit model drifts the style, fall back to a fresh `imagegen--generate_image` with a more explicit position description.