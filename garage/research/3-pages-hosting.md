---
updated: 2026-10-03
read_by: the handoff author (stage 8) and the build-readiness auditor (stage 9); the PLAN gate
relations:
  derived_from: garage/BRAINSTORM.md
---

# R3 — GitHub Pages: custom domain, HTTPS, Actions versus branch, and the internal staging copy

> Research item R3. The platform note in `## Organized` fixes the destination: static files served
> by GitHub Pages from the project's repository on a custom domain, staged first on our internal
> network, repository public at launch. This file covers how each of those works, as GitHub
> documents it and as I observed it on 2026-10-03. (Petra, 2026-10-03)

## 1. The finding that decides Actions versus branch

The internal records (issue tracker, correspondence, chat, inventory, status notes) live in the
repository, and the site must **not** show them (Q9). How Pages publishes determines whether that
holds.

- **Publishing from a branch** serves the branch root or its `/docs` folder [1]. Unless a
  `.nojekyll` file is present, the branch is processed by Jekyll with plugins GitHub enables by
  default. Since 2016, "All Markdown files are now rendered by GitHub Pages" without front matter,
  and a README becomes the index if there is no `index.html` [2]. **Published from the root, every
  Markdown record in the repository would become a web page on our domain.** Jekyll skips files
  and folders whose names start with `_`, `.` or `#` [3]. A records folder that does not start with
  one of those would be published.
- **Publishing with a custom GitHub Actions workflow** uploads exactly the folder the workflow
  names, and nothing else, as the Pages artifact. GitHub recommends Actions "if you want to use a
  build process other than Jekyll or you do not want a dedicated branch to hold your compiled
  static files" [1].

Either `/docs` or Actions keeps the records off the site. Actions also makes the published set
explicit (one folder, named in one file) instead of depending on a folder convention.

**Recommendation: publish with GitHub Actions, uploading only the site folder** (for example
`site/`). Trade-offs:

- Actions adds a workflow file and three pinned actions. Current releases (GitHub API, 2026-10-03
  [4]): `actions/configure-pages` v6.0.0 (2026-03-25), `actions/upload-pages-artifact` v5.0.0
  (2026-04-10), `actions/deploy-pages` v5.0.1 (2026-09-01).
- The workflow deploys through an environment named `github-pages`; GitHub recommends a deployment
  protection rule "so that only the default branch can deploy to this environment" [1].
- `upload-pages-artifact` has excluded dotfiles by default since v4.0.0; v5.0.0 added an
  `include-hidden-files` input [4]. A site that needs a dotfile (`.well-known/…`) must set it.
- With Actions, "no `CNAME` file is created, and any existing `CNAME` file is ignored" [5]. The
  custom domain is set in repository settings or the API, which is the only mechanism in either
  mode anyway: "A `CNAME` file in your repository file does not automatically add or remove a
  custom domain" [1].
- Branch publishing from `/docs` is simpler (no workflow) and also keeps the records off the site,
  provided nobody ever places a record under `/docs`. It also runs Jekyll unless `.nojekyll` is
  added. Kept as the alternative, not chosen.
- Cost: Actions is free for public repositories on standard runners. Private repositories on the
  Free plan include 2,000 minutes per month [6]. Pages itself requires a public repository on the
  Free plan [7], and the site is public even when a paid plan publishes it from a private
  repository [7]. Since staging is internal and the repository goes public at launch, Pages is
  first enabled at launch.

## 2. Custom domain and HTTPS

From GitHub's documentation [5][8][9][10]:

- **Records.** Apex: `A` records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`,
  `185.199.111.153`; `AAAA` records `2606:50c0:8000::153` through `2606:50c0:8003::153`; or an
  ALIAS/ANAME to `<owner>.github.io`. `www`: a `CNAME` to `<owner>.github.io` [5].
- **`www` is recommended** "even if you also use an apex domain"; when both are configured, GitHub
  redirects between them automatically [8].
- **Order:** add the domain in Settings → Pages, then create DNS records, check with `dig`, then
  enable HTTPS [5]. DNS changes "may take up to 24 hours" [5].
- **Verify the domain first.** A TXT record at `_github-pages-challenge-<owner>.<domain>` stops
  other GitHub users from claiming it [9]. **No wildcard DNS records**: GitHub warns they create
  "immediate risk of domain takeovers, even if you verify the domain" [5][9].
- **HTTPS** is provisioned automatically once DNS checks pass: GitHub "queues a job to request a
  TLS certificate from Let's Encrypt" and uploads it to its TLS servers. **Enforce HTTPS** then
  redirects HTTP to HTTPS. Mixed content (any `http://` asset) must be removed. The full domain
  must be under 64 characters [10]. GitHub's own caveat: Pages "shouldn't be used for sensitive
  transactions like sending passwords or credit card numbers" [10]. We collect neither (Q8: the
  Enterprise page "collects nothing").
- **Limits** [11]: published site ≤ 1 GB; soft bandwidth limit 100 GB/month; deployments time out
  after 10 minutes; Pages may not be used for e-commerce or SaaS. A certificate generator that
  sells nothing is, I would argue, neither; the argument is mine, not GitHub's.

## 3. How Pages actually answers (observed, not documented)

These are observed behaviours, recorded because the staging copy must reproduce them. Tested
against `pages.github.com` (a GitHub Pages site) on 2026-10-03:

| Request | Answer |
|---|---|
| `/index` (file `index.html` exists) | 200, served without the extension |
| `/index.html` | 200 |
| `/index/` | 404 |
| `/versions` (a folder) | 301 → `/versions/` |
| a missing path | 404 (a custom `404.html` in the published root is served if present [12]) |
| response headers | `cache-control: max-age=600`; `server: GitHub.com`; served via Fastly |

A third-party guide reports the same table [13]. I found no GitHub documentation of a way to set
custom response headers on Pages. That is "not found," not "impossible." It does mean a Content
Security Policy, if wanted, would go in a `<meta http-equiv>` tag rather than a header.

## 4. The internal staging copy

Requirement (`## Organized`): staged on our internal network only before launch. The staging copy
should serve **the same folder** Actions uploads and behave like the table in section 3.

**Serving.** nginx with:

```nginx
server {
    listen 127.0.0.1:8080;
    root /srv/still-here/site;                    # the same folder Actions uploads
    location / { try_files $uri $uri.html $uri/ =404; }   # nginx's own documented pattern [14]
    error_page 404 /404.html;
}
```

`try_files … $uri.html` reproduces Pages' extensionless `.html` answer. `error_page` reproduces the
custom 404 [14]. Directory trailing-slash redirects and `/file/` → 404 should match, but I have not
run this config against the table, so **unverified**. The build should include a smoke test that
requests each row of the section-3 table against staging and production and compares the answers.

**Reaching it.** `tailscale serve` exposes a local service to the tailnet only, not the public
internet (that is `tailscale funnel`), and terminates HTTPS with an automatically provisioned
certificate for the machine's `*.ts.net` name. The form is `tailscale serve --bg localhost:8080`
[15]. It can also serve a directory directly, but then shows directory listings [15] and does not
reproduce section 3, so the nginx layer stays. Prerequisites: MagicDNS and HTTPS Certificates
enabled for the tailnet [16].

**Two consequences to carry into the plan:**

1. **Staging must be HTTPS** (or `localhost`). R4's identifier uses `crypto.subtle`, which browsers
   expose only in secure contexts. R5's storage APIs and R2's Web Share have the same requirement.
   A plain `http://` tailnet address would break features that work in production.
2. **The staging hostname is not to be written into the repository.** Tailscale warns that HTTPS
   certificate names are published to the public Certificate Transparency logs and says not to
   enable HTTPS on machines whose names carry sensitive information [16]. Separately, the repository
   goes public and runs the public-tier scan. The staging address belongs in local configuration,
   not in committed files.

**Deploying to staging.** Either `rsync` the site folder from a workstation over the tailnet, or
run a workflow step that joins the tailnet. Both are feasible. Neither was tested here.

## Sources

1. GitHub Docs, Configuring a publishing source — https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
2. The GitHub Blog, "Publishing with GitHub Pages, now as easy as 1, 2, 3" (2016-12-09, updated 2019-12-06) — https://github.blog/2016-12-09-publishing-with-github-pages-now-as-easy-as-1-2-3/
3. GitHub Docs, About GitHub Pages and Jekyll — https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll
4. GitHub REST API, releases of `actions/configure-pages`, `actions/upload-pages-artifact`, `actions/deploy-pages` (queried 2026-10-03); https://github.com/actions/upload-pages-artifact/releases
5. GitHub Docs, Managing a custom domain — https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
6. GitHub Docs, GitHub Actions billing — https://docs.github.com/en/billing/concepts/product-billing/github-actions
7. GitHub Docs, Creating a GitHub Pages site — https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
8. GitHub Docs, About custom domains and GitHub Pages — https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages
9. GitHub Docs, Verifying your custom domain — https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages
10. GitHub Docs, Securing your GitHub Pages site with HTTPS — https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https
11. GitHub Docs, GitHub Pages limits — https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
12. GitHub Docs, Creating a custom 404 page — https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site
13. Trailing-slash guide (third party) — https://github.com/slorber/trailing-slash-guide
14. nginx, `ngx_http_core_module` (`try_files`, `error_page`) — https://nginx.org/en/docs/http/ngx_http_core_module.html
15. Tailscale, `tailscale serve` — https://tailscale.com/kb/1242/tailscale-serve
16. Tailscale, Enabling HTTPS — https://tailscale.com/kb/1153/enabling-https

## Changelog

- 2026-10-03 — Written: Actions publishing recommended because branch publishing would render the repository's records as pages; Pages URL behaviour observed live; staging mirror specified, with its nginx config marked unverified. (Petra, 2026-10-03)
