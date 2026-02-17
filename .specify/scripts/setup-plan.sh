#!/bin/bash
# Setup implementation plan for a feature
# Ported from PowerShell setup-plan.ps1

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

show_help() {
    cat << EOF
Usage: ./setup-plan.sh [OPTIONS]

Options:
  --json    Output results in JSON format
  --help    Show this help message

EOF
}

JSON=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --json) JSON=true; shift ;;
        --help|-h) show_help; exit 0 ;;
        *) echo "Unknown option: $1"; exit 1 ;;
    esac
done

# Get feature paths
eval "$(get_feature_paths)"

# Check if we're on a proper feature branch
if ! test_feature_branch "$CURRENT_BRANCH" "$HAS_GIT"; then
    exit 1
fi

# Ensure the feature directory exists
mkdir -p "$FEATURE_DIR"

# Copy plan template if it exists
TEMPLATE="$REPO_ROOT/.specify/templates/plan-template.md"
if [ -f "$TEMPLATE" ]; then
    cp "$TEMPLATE" "$IMPL_PLAN"
    echo "Copied plan template to $IMPL_PLAN"
else
    echo "Warning: Plan template not found at $TEMPLATE" >&2
    touch "$IMPL_PLAN"
fi

# Output results
if [ "$JSON" = true ]; then
    echo "{\"FEATURE_SPEC\":\"$FEATURE_SPEC\",\"IMPL_PLAN\":\"$IMPL_PLAN\",\"SPECS_DIR\":\"$FEATURE_DIR\",\"BRANCH\":\"$CURRENT_BRANCH\",\"HAS_GIT\":$HAS_GIT}"
else
    echo "FEATURE_SPEC: $FEATURE_SPEC"
    echo "IMPL_PLAN: $IMPL_PLAN"
    echo "SPECS_DIR: $FEATURE_DIR"
    echo "BRANCH: $CURRENT_BRANCH"
    echo "HAS_GIT: $HAS_GIT"
fi
