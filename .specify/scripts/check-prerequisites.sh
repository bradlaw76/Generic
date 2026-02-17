#!/bin/bash
# Check prerequisites for Spec-Driven Development workflow
# Ported from PowerShell check-prerequisites.ps1

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

show_help() {
    cat << EOF
Usage: check-prerequisites.sh [OPTIONS]

Consolidated prerequisite checking for Spec-Driven Development workflow.

OPTIONS:
  --json            Output in JSON format
  --require-tasks   Require tasks.md to exist (for implementation phase)
  --include-tasks   Include tasks.md in AVAILABLE_DOCS list
  --paths-only      Only output path variables (no prerequisite validation)
  --help            Show this help message

EXAMPLES:
  # Check task prerequisites (plan.md required)
  ./check-prerequisites.sh --json
  
  # Check implementation prerequisites (plan.md + tasks.md required)
  ./check-prerequisites.sh --json --require-tasks --include-tasks
  
  # Get feature paths only (no validation)
  ./check-prerequisites.sh --paths-only

EOF
}

JSON=false
REQUIRE_TASKS=false
INCLUDE_TASKS=false
PATHS_ONLY=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --json) JSON=true; shift ;;
        --require-tasks) REQUIRE_TASKS=true; shift ;;
        --include-tasks) INCLUDE_TASKS=true; shift ;;
        --paths-only) PATHS_ONLY=true; shift ;;
        --help|-h) show_help; exit 0 ;;
        *) echo "Unknown option: $1"; exit 1 ;;
    esac
done

# Get feature paths
eval "$(get_feature_paths)"

# If paths-only mode, output paths and exit
if [ "$PATHS_ONLY" = true ]; then
    if [ "$JSON" = true ]; then
        echo "{\"REPO_ROOT\":\"$REPO_ROOT\",\"BRANCH\":\"$CURRENT_BRANCH\",\"FEATURE_DIR\":\"$FEATURE_DIR\",\"FEATURE_SPEC\":\"$FEATURE_SPEC\",\"IMPL_PLAN\":\"$IMPL_PLAN\",\"TASKS\":\"$TASKS\"}"
    else
        echo "REPO_ROOT: $REPO_ROOT"
        echo "BRANCH: $CURRENT_BRANCH"
        echo "FEATURE_DIR: $FEATURE_DIR"
        echo "FEATURE_SPEC: $FEATURE_SPEC"
        echo "IMPL_PLAN: $IMPL_PLAN"
        echo "TASKS: $TASKS"
    fi
    exit 0
fi

# Validate feature branch
if ! test_feature_branch "$CURRENT_BRANCH" "$HAS_GIT"; then
    exit 1
fi

# Check required files
MISSING_DOCS=()
AVAILABLE_DOCS=()

if [ -f "$IMPL_PLAN" ]; then
    AVAILABLE_DOCS+=("plan.md")
else
    MISSING_DOCS+=("plan.md")
fi

if [ "$REQUIRE_TASKS" = true ]; then
    if [ -f "$TASKS" ]; then
        AVAILABLE_DOCS+=("tasks.md")
    else
        MISSING_DOCS+=("tasks.md")
    fi
elif [ "$INCLUDE_TASKS" = true ] && [ -f "$TASKS" ]; then
    AVAILABLE_DOCS+=("tasks.md")
fi

# Output results
if [ "$JSON" = true ]; then
    AVAILABLE_JSON=$(printf '%s\n' "${AVAILABLE_DOCS[@]}" | jq -R . | jq -s .)
    MISSING_JSON=$(printf '%s\n' "${MISSING_DOCS[@]}" | jq -R . | jq -s .)
    echo "{\"status\":\"ok\",\"available\":$AVAILABLE_JSON,\"missing\":$MISSING_JSON,\"branch\":\"$CURRENT_BRANCH\"}"
else
    echo "Available: ${AVAILABLE_DOCS[*]}"
    echo "Missing: ${MISSING_DOCS[*]}"
fi
