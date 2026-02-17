#!/bin/bash
# Update agent context files (Claude, Copilot, etc.)
# Ported from PowerShell update-agent-context.ps1

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

show_help() {
    cat << EOF
Usage: ./update-claude-md.sh [AGENT_TYPE]

Update agent context files with information from plan.md.

AGENT_TYPE: Optional - claude, copilot, gemini, cursor-agent, etc.
            If omitted, updates all existing agent files.

EOF
}

AGENT_TYPE="${1:-}"

if [ "$AGENT_TYPE" = "--help" ] || [ "$AGENT_TYPE" = "-h" ]; then
    show_help
    exit 0
fi

# Get feature paths
eval "$(get_feature_paths)"

# Agent file paths
CLAUDE_FILE="$REPO_ROOT/CLAUDE.md"
COPILOT_FILE="$REPO_ROOT/.github/agents/copilot-instructions.md"
TEMPLATE_FILE="$REPO_ROOT/.specify/templates/agent-file-template.md"

update_agent_file() {
    local agent_file="$1"
    local agent_name="$2"
    
    if [ ! -f "$agent_file" ]; then
        if [ -f "$TEMPLATE_FILE" ]; then
            mkdir -p "$(dirname "$agent_file")"
            cp "$TEMPLATE_FILE" "$agent_file"
            echo "Created $agent_name context file from template"
        else
            echo "Warning: Template not found, skipping $agent_name" >&2
            return
        fi
    fi
    
    # Update timestamp
    local timestamp
    timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    
    echo "Updated $agent_name context file at $timestamp"
}

# Update based on agent type or all
case "$AGENT_TYPE" in
    claude)
        update_agent_file "$CLAUDE_FILE" "Claude"
        ;;
    copilot)
        update_agent_file "$COPILOT_FILE" "Copilot"
        ;;
    "")
        # Update all existing agent files
        [ -f "$CLAUDE_FILE" ] && update_agent_file "$CLAUDE_FILE" "Claude"
        [ -f "$COPILOT_FILE" ] && update_agent_file "$COPILOT_FILE" "Copilot"
        ;;
    *)
        echo "Unknown agent type: $AGENT_TYPE" >&2
        exit 1
        ;;
esac

echo "Agent context update complete"
