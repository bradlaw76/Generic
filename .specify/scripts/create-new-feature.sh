#!/bin/bash
# Create a new feature
# Ported from PowerShell create-new-feature.ps1

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

show_help() {
    cat << EOF
Usage: ./create-new-feature.sh [OPTIONS] <feature description>

Options:
  --json              Output in JSON format
  --short-name NAME   Provide a custom short name (2-4 words) for the branch
  --number N          Specify branch number manually (overrides auto-detection)
  --help              Show this help message

Examples:
  ./create-new-feature.sh 'Add user authentication system' --short-name 'user-auth'
  ./create-new-feature.sh 'Implement OAuth2 integration for API'

EOF
}

JSON=false
SHORT_NAME=""
NUMBER=0
FEATURE_DESC=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --json) JSON=true; shift ;;
        --short-name) SHORT_NAME="$2"; shift 2 ;;
        --number) NUMBER="$2"; shift 2 ;;
        --help|-h) show_help; exit 0 ;;
        *) FEATURE_DESC="$FEATURE_DESC $1"; shift ;;
    esac
done

FEATURE_DESC=$(echo "$FEATURE_DESC" | xargs)  # Trim whitespace

if [ -z "$FEATURE_DESC" ]; then
    echo "Error: Feature description required" >&2
    show_help
    exit 1
fi

REPO_ROOT=$(get_repo_root)
SPECS_DIR="$REPO_ROOT/.specify/specs"

# Determine next feature number
get_highest_number() {
    local highest=0
    if [ -d "$SPECS_DIR" ]; then
        for dir in "$SPECS_DIR"/*/; do
            if [[ "$(basename "$dir")" =~ ^([0-9]+) ]]; then
                local num=$((10#${BASH_REMATCH[1]}))
                if [ "$num" -gt "$highest" ]; then
                    highest=$num
                fi
            fi
        done
    fi
    echo "$highest"
}

if [ "$NUMBER" -eq 0 ]; then
    HIGHEST=$(get_highest_number)
    NUMBER=$((HIGHEST + 1))
fi

PADDED_NUM=$(printf "%03d" "$NUMBER")

# Generate short name if not provided
if [ -z "$SHORT_NAME" ]; then
    # Simple slug: lowercase, replace spaces with hyphens, remove special chars
    SHORT_NAME=$(echo "$FEATURE_DESC" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9 ]//g' | tr ' ' '-' | cut -c1-30)
fi

BRANCH_NAME="$PADDED_NUM-$SHORT_NAME"
FEATURE_DIR="$SPECS_DIR/$BRANCH_NAME"

# Create feature directory and spec file
mkdir -p "$FEATURE_DIR"

# Copy spec template if available
SPEC_TEMPLATE="$REPO_ROOT/.specify/templates/spec-template.md"
if [ -f "$SPEC_TEMPLATE" ]; then
    cp "$SPEC_TEMPLATE" "$FEATURE_DIR/spec.md"
else
    echo "# Feature Specification: $FEATURE_DESC" > "$FEATURE_DIR/spec.md"
    echo "" >> "$FEATURE_DIR/spec.md"
    echo "**Feature Branch**: \`$BRANCH_NAME\`" >> "$FEATURE_DIR/spec.md"
    echo "**Created**: $(date +%Y-%m-%d)" >> "$FEATURE_DIR/spec.md"
fi

# Output result
if [ "$JSON" = true ]; then
    echo "{\"branch\":\"$BRANCH_NAME\",\"feature_dir\":\"$FEATURE_DIR\",\"spec\":\"$FEATURE_DIR/spec.md\"}"
else
    echo "Created feature: $BRANCH_NAME"
    echo "Directory: $FEATURE_DIR"
    echo "Spec file: $FEATURE_DIR/spec.md"
fi
