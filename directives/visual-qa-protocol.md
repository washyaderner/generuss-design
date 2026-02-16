# Visual QA Protocol

**Trigger:** User says "check your work", "visual QA", or similar.

## Workflow

### Loop (up to 3 passes)

1. **Capture** — Run `bash execution/visual-qa.sh`
2. **Review** — Read screenshots from `.tmp/qa/` using the Read tool:
   - `.tmp/qa/desktop.png` (1920px)
   - `.tmp/qa/tablet.png` (768px)
   - `.tmp/qa/mobile.png` (375px)
   - `.tmp/qa/console.log`
3. **Evaluate** each screenshot against the site brief and design intent:
   - **Layout & spacing** — sections properly spaced, no overlap, correct padding
   - **Typography** — heading hierarchy, readability, no text overflow or orphans
   - **Responsiveness** — mobile/tablet layouts not broken, no horizontal scroll
   - **Visual completeness** — all sections rendered, images loaded, no blank areas
   - **Animation states** — GSAP sections have correct initial states (pre-scroll)
   - **Console** — check `console.log` for errors or warnings
4. **Report** — List specific issues found with section names and descriptions
5. **Fix** — Make code changes to address each issue
6. **Re-run** — Execute the script again and re-evaluate
7. **Repeat** until clean or 3 passes complete

### Exit Criteria

- No layout breaks at any viewport
- No console errors (warnings acceptable if known/benign)
- No missing or broken content
- All sections match design intent from the brief
- Report findings to user after final pass

## Notes

- Screenshots are full-page captures; scroll position is top.
- GSAP animations appear in their pre-scroll initial state.
- The script builds the site fresh each run, so source changes are always reflected.
- `.tmp/qa/` is gitignored — screenshots are ephemeral.
