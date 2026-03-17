---
tracker:
  kind: github
  # api_key 는 GITHUB_TOKEN 환경변수로 전달
  project_slug: jikime/my-lotto-app
  active_states:
    - jikime-todo
  terminal_states:
    - jikime-done
    - Done

polling:
  interval_ms: 15000

workspace:
  root: /tmp/jikime-my-lotto-app

hooks:
  after_create: |
    git clone https://github.com/jikime/my-lotto-app.git .
    echo "[after_create] cloned repo to $(pwd)"

  before_run: |
    echo "[before_run] syncing to latest main..."
    git fetch origin
    git checkout main
    git reset --hard origin/main
    echo "[before_run] ready at $(git rev-parse --short HEAD)"

  after_run: |
    echo "[after_run] done"
    if [ -d "/Users/jikime/Dev/my-lotto-app/.git" ]; then
      cd "/Users/jikime/Dev/my-lotto-app" && git pull --ff-only 2>&1 \
        && echo "[after_run] local repo synced at $(git rev-parse --short HEAD)" \
        || echo "[after_run] git pull skipped (local changes or diverged branch)"
    fi

  timeout_ms: 60000

agent:
  max_concurrent_agents: 1
  max_turns: 10
  max_retry_backoff_ms: 300000

claude:
  command: claude
  turn_timeout_ms: 3600000
  stall_timeout_ms: 180000

server:
  port: 8001
---

You are an autonomous software engineer working on a GitHub issue.

Repository: https://github.com/jikime/my-lotto-app

## Issue

**{{ issue.identifier }}**: {{ issue.title }}

{{ issue.description }}

## Instructions

1. Read the issue carefully and implement what is requested.
2. Create a feature branch: `git checkout -b fix/issue-{{ issue.id }}`
3. Make your changes using the available file tools.
4. Commit: `git add -A && git commit -m "fix: {{ issue.identifier }} - {{ issue.title }}"`
5. Push the branch: `git push origin fix/issue-{{ issue.id }}`
6. Create a pull request:
   `gh pr create --title "fix: {{ issue.title }}" --body "Closes #{{ issue.id }}" --base main --head fix/issue-{{ issue.id }}`
7. Merge the pull request and delete the branch:
   `gh pr merge --squash --delete-branch --admin`

Work in the current directory. The repository has already been cloned here.
