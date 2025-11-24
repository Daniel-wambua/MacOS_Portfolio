# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## Troubleshooting: "Permission to ... denied to deploy key" when pushing

If you see an error like:

```
ERROR: Permission to <owner>/<repo>.git denied to deploy key
fatal: Could not read from remote repository.
```

it means you are authenticating to GitHub with an SSH deploy key. Deploy keys are attached to a single repository and are read‑only by default, so pushes are rejected unless the key has explicit write permission. Use one of the options below to resolve it.

### 1) Use a user SSH key with write access (recommended)

- Check which user you authenticate as:
  - ssh -T git@github.com
- List keys loaded in your agent:
  - ssh-add -l
- If needed, generate a key and add it to your GitHub account (Settings → SSH and GPG keys):
  - ssh-keygen -t ed25519 -C "you@example.com"
  - ssh-add ~/.ssh/id_ed25519
- Verify it shows your GitHub username when running ssh -T git@github.com.
- Push again:
  - git push -u origin <your-branch>

### 2) Enable write access on the deploy key (repo admins only)

In GitHub → Repository → Settings → Deploy keys, edit the key and check "Allow write access". This is only available if you control the repo and understand the security implications.

### 3) Push to your fork instead

- Fork the repository on GitHub.
- Point origin (or add a new remote) to your fork and push:
  - git remote set-url origin git@github.com:<your-username>/<repo>.git
  - git push -u origin <your-branch>
- Open a Pull Request from your fork back to the original repository.

### 4) Switch to HTTPS and use a Personal Access Token (PAT)

- Create a PAT with repo scope in your GitHub account.
- Update the remote and push:
  - git remote set-url origin https://github.com/<owner>/<repo>.git
  - git push -u origin <your-branch>
- When prompted for a password, use the PAT (GitHub ignores account passwords over HTTPS).

### Quick diagnostics

- Show remotes: git remote -v
- Show current branch and status: git status
- Test SSH auth: ssh -T git@github.com

Once your authentication method has write permissions, your push should succeed and your branch will appear on the remote.
