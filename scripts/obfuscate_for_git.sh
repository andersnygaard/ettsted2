#!/bin/bash
#
# Obfuscation Script for Git Check-in
#
# Replaces sensitive data (tokens, emails, client IDs) with placeholders
# before committing documentation files.
#
# Usage:
#   ./scripts/obfuscate_for_git.sh [file_or_directory]
#
# Default: Processes all files in .docs/

set -e

TARGET="${1:-.docs}"

if [ ! -e "$TARGET" ]; then
    echo "Error: $TARGET does not exist"
    exit 1
fi

echo "Obfuscating sensitive data in: $TARGET"

# Find all text files to process
if [ -d "$TARGET" ]; then
    FILES=$(find "$TARGET" -type f \( -name "*.md" -o -name "*.txt" -o -name "*.json" -o -name "*.yaml" -o -name "*.yml" \))
else
    FILES="$TARGET"
fi

for FILE in $FILES; do
    echo "Processing: $FILE"

    # Backup original
    cp "$FILE" "$FILE.bak"

    # Google OAuth access tokens (ya29.xxx format)
    sed -E -i 's/ya29\.[A-Za-z0-9_\-]+/<REDACTED_ACCESS_TOKEN>/g' "$FILE"

    # Generic JWT tokens (eyJ format)
    sed -E -i 's/eyJ[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]+/<REDACTED_JWT_TOKEN>/g' "$FILE"

    # Email addresses
    sed -E -i 's/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/<REDACTED_EMAIL>/g' "$FILE"

    # Google Client IDs (format: numbers-xxx.apps.googleusercontent.com)
    sed -E -i 's/[0-9]+-[A-Za-z0-9]+\.apps\.googleusercontent\.com/<REDACTED_GOOGLE_CLIENT_ID>/g' "$FILE"

    # Facebook App IDs (typically 15-16 digit numbers)
    sed -E -i 's/"app_id":\s*"[0-9]{15,16}"/"app_id": "<REDACTED_FACEBOOK_APP_ID>"/g' "$FILE"
    sed -E -i 's/FACEBOOK_APP_ID=[0-9]{15,16}/FACEBOOK_APP_ID=<REDACTED_FACEBOOK_APP_ID>/g' "$FILE"

    # Azure resource names with subscription info
    sed -E -i 's/\/subscriptions\/[a-f0-9-]+\//\/subscriptions\/<REDACTED_SUBSCRIPTION_ID>\//g' "$FILE"

    # CosmosDB keys (base64-like strings, typically 88 chars)
    sed -E -i 's/AccountKey=[A-Za-z0-9+\/=]{80,100}/AccountKey=<REDACTED_COSMOS_KEY>/g' "$FILE"

    # Generic API keys (common patterns)
    sed -E -i 's/sk-[A-Za-z0-9]{32,}/<REDACTED_API_KEY>/g' "$FILE"
    sed -E -i 's/api[_-]?key["\s:=]+[A-Za-z0-9]{20,}/api_key=<REDACTED_API_KEY>/gi' "$FILE"

    # Remove backup if no changes
    if diff -q "$FILE" "$FILE.bak" > /dev/null 2>&1; then
        rm "$FILE.bak"
        echo "  No sensitive data found"
    else
        rm "$FILE.bak"
        echo "  Obfuscated sensitive data"
    fi
done

echo ""
echo "Obfuscation complete!"
echo ""
echo "IMPORTANT: Review the changes before committing:"
echo "  git diff $TARGET"
