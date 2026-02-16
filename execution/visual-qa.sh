#!/bin/bash

# =============================================================================
# visual-qa.sh — Build, preview, capture screenshots for Visual QA
# =============================================================================
#
# Usage:  bash execution/visual-qa.sh
#         npm run qa
#
# Output: .tmp/qa/desktop.png, .tmp/qa/tablet.png, .tmp/qa/mobile.png,
#         .tmp/qa/console.log
# =============================================================================

set -e

PORT=4321
URL="http://localhost:$PORT"
OUTPUT_DIR=".tmp/qa"
PREVIEW_PID=""

cleanup() {
  if [ -n "$PREVIEW_PID" ]; then
    kill "$PREVIEW_PID" 2>/dev/null || true
    wait "$PREVIEW_PID" 2>/dev/null || true
    echo "[QA] Preview server stopped."
  fi
}
trap cleanup EXIT

# --- Step 1: Build ---
echo "[QA] Building site..."
npm run build --silent

# --- Step 2: Start preview server ---
# Cloudflare adapter doesn't support `astro preview`.
# Use Python's built-in HTTP server to serve the static dist/ output.
echo "[QA] Starting preview server on port $PORT..."
python3 -m http.server "$PORT" --directory dist > /dev/null 2>&1 &
PREVIEW_PID=$!

# --- Step 3: Wait for server ready ---
echo "[QA] Waiting for server..."
RETRIES=0
MAX_RETRIES=30
while ! curl -s -o /dev/null "$URL" 2>/dev/null; do
  RETRIES=$((RETRIES + 1))
  if [ "$RETRIES" -ge "$MAX_RETRIES" ]; then
    echo "[QA] ERROR: Server did not start within ${MAX_RETRIES}s"
    exit 1
  fi
  sleep 1
done
echo "[QA] Server ready."

# --- Step 4: Capture screenshots ---
echo "[QA] Capturing screenshots..."
mkdir -p "$OUTPUT_DIR"
node execution/visual-qa-capture.mjs "$URL" "$OUTPUT_DIR"

echo "[QA] Done. Screenshots saved to $OUTPUT_DIR/"
