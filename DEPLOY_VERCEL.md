# Deploy OBBBA Site To Vercel

## 1) Initialize Git (if not already)
Run in project root:

```powershell
git init
git add .
git commit -m "Initial deploy setup"
```

## 2) Push to GitHub
Create a new GitHub repo, then run:

```powershell
git remote add origin https://github.com/<your-username>/<your-repo>.git
git branch -M main
git push -u origin main
```

## 3) Import in Vercel
1. Open Vercel dashboard.
2. Click `Add New -> Project`.
3. Select your GitHub repo.
4. Vercel should auto-detect Vite.
5. Click `Deploy`.

## 4) Add domain
In Vercel project:
1. `Settings -> Domains`
2. Add:
- `obbacalculators.com`
- `www.obbacalculators.com`

Set DNS records in your domain panel:
- `A` record: `@` -> `76.76.21.21`
- `CNAME` record: `www` -> `cname.vercel-dns.com`

## 5) Verify
After DNS propagation:
- Open `https://obbacalculators.com`
- Open a deep route directly (example: `/faq`) to confirm SPA rewrite works.

---

This project already includes `vercel.json` for SPA routing and Vite build output.
