#!/bin/bash
# Common shell functions for Spec-Driven Development workflow
# Ported from PowerShell common.ps1

set -e

get_repo_root() {
    if git rev-parse --show-toplevel 2>/dev/null; then
        return
    fi
    # Fall back to script location for non-git repos
    echo "$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
}

get_current_branch() {
    # First check if SPECIFY_FEATURE environment variable is set
    if [ -n "$SPECIFY_FEATURE" ]; then
        echo "$SPECIFY_FEATURE"
        return
    fi
    
    # Then check git if available
    if git rev-parse --abbrev-ref HEAD 2>/dev/null; then
        return
    fi
    
    # For non-git repos, try to find the latest feature directory
    local repo_root
    repo_root=$(get_repo_root)
    local specs_dir="$repo_root/specs"
    
    if [ -d "$specs_dir" ]; then
        local latest_feature=""
        local highest=0
        
        for dir in "$specs_dir"/*/; do
            if [[ "$(basename "$dir")" =~ ^([0-9]{3})- ]]; then
                local num=${BASH_REMATCH[1]}
                if [ "$num" -gt "$highest" ]; then
                    highest=$num
                    latest_feature=$(basename "$dir")
                fi
            fi
        done
        
        if [ -n "$latest_feature" ]; then
            echo "$latest_feature"
            return
        fi
    fi
    
    # Final fallback
    echo "main"
}

has_git() {
    git rev-parse --show-toplevel >/dev/null 2>&1
}

test_feature_branch() {
    local branch="$1"
    local has_git_repo="$2"
    
    # For non-git repos, skip branch validation
    if [ "$has_git_repo" != "true" ]; then
        echo "[specify] Warning: Git repository not detected; skipped branch validation" >&2
        return 0
    fi
    
    # Check branch naming convention (e.g., ###-feature-name)
    if [[ "$branch" =~ ^[0-9]{3}- ]]; then
        return 0
    fi
    
    echo "[specify] Error: Not on a feature branch (expected ###-feature-name pattern)" >&2
    return 1
}

get_feature_paths() {
    local repo_root
    repo_root=$(get_repo_root)
    local branch
    branch=$(get_current_branch)
    local has_git_repo
    has_git_repo=$(has_git && echo "true" || echo "false")
    
    local feature_dir="$repo_root/.specify/specs/$branch"
    local feature_spec="$feature_dir/spec.md"
    local impl_plan="$feature_dir/plan.md"
    local tasks="$feature_dir/tasks.md"
    
    echo "REPO_ROOT=$repo_root"
    echo "CURRENT_BRANCH=$branch"
    echo "HAS_GIT=$has_git_repo"
    echo "FEATURE_DIR=$feature_dir"
    echo "FEATURE_SPEC=$feature_spec"
    echo "IMPL_PLAN=$impl_plan"
    echo "TASKS=$tasks"
}
