# Claude project memory — backup

This folder is a **point-in-time backup** of Claude's project memory for this
repo. The `.md` files alongside this README were copied from Claude's
per-project memory directory on the machine where they were originally
created.

## Claude does NOT auto-load from here

Claude Code's auto-memory system reads from a fixed path on the local machine,
**not** from the repo. The path is:

```
<user-home>/.claude/projects/<sanitized-cwd>/memory/
```

where `sanitized-cwd` is the absolute working directory in which `claude` was
launched, with `\`, `/`, and `:` characters all replaced by `-`.

Examples:
- `C:\Users\RamyaBIN`  →  `C--Users-RamyaBIN`
- `/home/alice/work/myrepo`  →  `-home-alice-work-myrepo`

Because the path is keyed by the launch directory and lives outside the repo,
Claude will **not** see these files on a fresh machine — even with the repo
cloned and Claude started inside it.

## To activate this memory on a new machine

1. Identify the directory you launch `claude` from. This is usually the repo
   root or its parent.
2. Compute `sanitized-cwd` from that path (replace `\`, `/`, `:` with `-`).
3. Create the destination folder if it does not exist:

   ```
   <user-home>/.claude/projects/<sanitized-cwd>/memory/
   ```
4. Copy the `.md` files from this `claude-memory/` folder into that path.
5. Start a Claude session — it will pick up the memory on first turn.

After the one-time copy, Claude will continue writing new entries directly to
that local `memory/` directory; this backup will go stale unless refreshed.

## Refreshing this backup

To capture new memory written since the last backup, copy the local
`memory/*.md` files back into this folder and commit. Tooling for this is not
automated — run the copy by hand when you want a new snapshot.

## What's in here

See `MEMORY.md` (the index) for a list of entries, each linking to its own
`.md` file in this folder. Entries cover user profile, project context,
feedback received, and external references — anything Claude judged worth
remembering across sessions.

This backup is currently a fresh baseline: only the index + README exist;
no per-entry `.md` files have accumulated yet. As Claude writes new
memories during work on this repo, refresh the backup with the procedure
above.
