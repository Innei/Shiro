#!/bin/bash

current_branch=$(git rev-parse --abbrev-ref HEAD)

if [ "$current_branch" = "gh-pages" ]; then
  # Don't build
  echo "🛑 - Build cancelled"
  exit 0
else

  # 获取自上次提交以来更改的所有文件列表
  changed_files=$(git diff --name-only HEAD^ HEAD)

  # 初始化变量，用于标识是否有感兴趣的文件发生了变化
  any_changes=false

  # 检查文件或目录是否更改
  check_for_changes() {
    local pattern="$1"
    echo "$changed_files" | grep -E "$pattern" >/dev/null
    if [ $? -eq 0 ]; then
      any_changes=true
      echo "Changes detected in $pattern."
    fi
  }

  # 检查特定文件是否更改
  check_for_changes "^package\.json$"
  check_for_changes "^next\.config\.mjs$"
  check_for_changes "^tailwind\.config\.ts$"

  check_for_changes "^src/.*"

  # 基于是否有改动进入判断
  if $any_changes; then
    # 如果有文件更改了，执行以下命令
    echo "Some of the specified files or directories have been modified."
    # Proceed with the build
    echo "✅ - Build can proceed"
    exit 1
  else
    echo "None of the specified files or directories have been modified."
    # Don't build
    echo "🛑 - Build cancelled"
    exit 0

  fi

fi
