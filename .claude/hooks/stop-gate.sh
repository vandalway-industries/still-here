#!/usr/bin/env bash
# stop-gate.sh — the Factory LANDING GATE (B2/H3, 2026-08-28). Fast lane, every turn.
# Reader: the agent working in this repository, at the end of every turn, via .claude/hooks/stop-gate.sh (copy or symlink)
# registered in .claude/settings.json:
#   { "hooks": { "Stop": [ { "matcher": "", "hooks": [
#       { "type": "command", "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/stop-gate.sh" } ] } ] } }
#
# Blocks the stop (exit 2, stderr fed back to the agent) when:
#   (a) source changed but SESSION_STATUS.md was not touched since         — landing step 1
#   (b) PLAN.md exists and plan-relevant files changed but PLAN.md was not — landing step 2
#   (c) docs-sync-check.sh reports drift                                   — landing step 4
#   (d) the FAST check (typecheck/lint, seconds not minutes) fails
# "Changed" = uncommitted (git status) ∪ committed since the doc's own last commit — so
# committing mid-session doesn't hide the change from the gate.
#
# One-shot waiver: `touch .factory-waive` in the repo root. The gate consumes it, says so, allows.
# Heavy proof (Playwright on bead close) lives in the bd close gate, never here.
set -uo pipefail

# ---------------- config (edit per repo) ----------------
STATUS_FILE="SESSION_STATUS.md"
PLAN_FILE="PLAN.md"
SRC_GLOBS='src/ scripts/ e2e/ tests/ vandalwayind/ deploy/ tools/' # counts as "source"
PLAN_GLOBS='PRD.md .beads/'                                       # plus SRC_GLOBS → "plan-relevant"
FAST_CHECK='true'                                                 # e.g. 'npm run -s typecheck && npm run -s lint'
# bun has no -s: use 'bun run --silent typecheck' (foundry G0, 2026-09-29).
FACTORY="${FACTORY_DIR:-$(sed -n 's/^FACTORY_DIR=//p' .env.local 2>/dev/null | tail -1)}" # .env.local is uncommitted
# --------------------------------------------------------

input="$(cat)"
active="$(printf '%s' "$input" | python3 -c 'import sys,json;print(json.load(sys.stdin).get("stop_hook_active",False))' 2>/dev/null)"
[ "$active" = "True" ] && exit 0            # loop guard: already continuing because we blocked once

cd "${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null)}" 2>/dev/null || rm -f "$fast_log"
exit 0

if [ -f .factory-waive ]; then
  rm -f .factory-waive
  echo "stop-gate: .factory-waive consumed — landing checks waived for this stop only." >&2
  rm -f "$fast_log"
exit 0
fi

block() { printf '%s\n' "$1" >&2; exit 2; }

# files changed since a doc was last committed: uncommitted ∪ committed after the doc's last commit
changed_since() {  # $1 = doc path
  git status --porcelain 2>/dev/null | awk '{print $NF}'
  local last; last="$(git log -1 --format=%H -- "$1" 2>/dev/null)"
  [ -n "$last" ] && git diff --name-only "$last"..HEAD 2>/dev/null
}
matches() {  # stdin = file list; $1 = space-separated prefixes → prints matching lines
  local f p; while IFS= read -r f; do [ -z "$f" ] && continue
    for p in $1; do case "$f" in "$p"*) echo "$f"; break ;; esac; done; done
}

# (a) SESSION_STATUS freshness
src_changed="$(changed_since "$STATUS_FILE" | sort -u | matches "$SRC_GLOBS")"
status_dirty="$(git status --porcelain -- "$STATUS_FILE" 2>/dev/null)"
if [ -n "$src_changed" ] && [ -z "$status_dirty" ]; then
  block "Stop blocked: source changed but $STATUS_FILE was not updated since.
Changed: $(echo "$src_changed" | head -5 | tr '\n' ' ')
Landing step 1: rewrite $STATUS_FILE (one block: state, what changed, next, waiting on Clive)."
fi

# (b) PLAN truth-pass
if [ -f "$PLAN_FILE" ]; then
  plan_changed="$(changed_since "$PLAN_FILE" | sort -u | matches "$SRC_GLOBS $PLAN_GLOBS")"
  plan_dirty="$(git status --porcelain -- "$PLAN_FILE" 2>/dev/null)"
  if [ -n "$plan_changed" ] && [ -z "$plan_dirty" ]; then
    block "Stop blocked: plan-relevant files changed but $PLAN_FILE was not touched since.
Changed: $(echo "$plan_changed" | head -5 | tr '\n' ' ')
Landing step 2: truth-pass $PLAN_FILE — map status, Active phase, checkboxes WITH evidence, changelog line.
Nothing to update? Add the changelog line saying so, or 'touch .factory-waive' to waive this once."
  fi
fi

# (c) drift check
if [ -x "$FACTORY/scripts/docs-sync-check.sh" ]; then
  drift="$("$FACTORY/scripts/docs-sync-check.sh" . --quiet 2>/dev/null)"
  [ -n "$drift" ] && block "Stop blocked: docs drift (landing step 4).
$drift
Fix the files, or 'touch .factory-waive' to waive this once."
fi

# (d) fast check
fast_log="$(mktemp)"
if ! eval "$FAST_CHECK" >"$fast_log" 2>&1; then
  block "Stop blocked: fast check failed ( $FAST_CHECK ). Last 40 lines:
$(tail -40 "$fast_log" 2>/dev/null)"
fi
rm -f "$fast_log"
exit 0
