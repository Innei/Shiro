#!/bin/bash

current_branch=$(git rev-parse --abbrev-ref HEAD)

if [ "$current_branch" = "gh-pages" ]; then
  # Don't build
  echo "🛑 - Build cancelled"
  exit 0
else
  # Proceed with the build
  echo "✅ - Build can proceed"
  exit 1
fi
