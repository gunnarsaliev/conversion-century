#!/usr/bin/env python3
"""Launch checks for the public site. Standard library only; sends GET requests.

Before the switch, against a deployment that has the launch env vars:
  python3 scripts/verify-launch.py --base https://<deployment>.vercel.app

After the switch, including the host redirects:
  python3 scripts/verify-launch.py --check-hosts

Current state of the noindexed staging site (skips the launch-only checks):
  python3 scripts/verify-launch.py --base https://www.cc-hub.online \
    --site https://www.cc-hub.online --staging

FAIL means a page is lost or blocked from search, and exits with status 1.
WARN is for review: redirects and metadata are managed in the CMS, so a warning
may be a deliberate choice.
"""

import argparse
import concurrent.futures as cf
import pathlib
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

SITE = "https://www.conversion-century.com"
OLD_DOMAIN = "cc-hub"
NOT_FOUND_MARKER = "NEXT_HTTP_ERROR_FALLBACK"
OLD_URLS = pathlib.Path(__file__).with_name("launch-old-urls.txt")
MISSING_PATHS = [
    "/launch-check-missing",
    "/bg/launch-check-missing",
    "/blog/launch-check-missing",
    "/launch-check-missing.php",
]
PRIVATE_PATHS = ["/admin", "/api", "/dashboard", "/login", "/offers"]
# Crawlers get different metadata handling from browsers, so test as one.
HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"}
REDIRECTS = (301, 302, 303, 307, 308)
PERMANENT = (301, 308)


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


OPENER = urllib.request.build_opener(NoRedirect)


def fetch(url):
    """Returns (status, location, body). Status 0 means a network error."""
    request = urllib.request.Request(url, headers=HEADERS)
    try:
        with OPENER.open(request, timeout=60) as response:
            return response.status, response.headers.get("Location"), response.read().decode("utf8", "ignore")
    except urllib.error.HTTPError as error:
        return error.code, error.headers.get("Location"), error.read().decode("utf8", "ignore")
    except Exception as error:
        return 0, None, str(error)


def follow(url, limit=8):
    """Follows redirects. Returns (hops as [(status, url)], final status, final url, body)."""
    hops = []
    for _ in range(limit):
        status, location, body = fetch(url)
        if status not in REDIRECTS or not location:
            return hops, status, url, body
        hops.append((status, url))
        url = urllib.parse.urljoin(url, location)
    return hops, 0, url, ""


def robots_tags(body):
    return re.findall(r'<meta name="robots" content="([^"]*)', body)


def path_of(url):
    parts = urllib.parse.urlsplit(url)
    path = parts.path.rstrip("/") or "/"
    return f"{path}?{parts.query}" if parts.query else path


class Report:
    def __init__(self):
        self.fails, self.warns = [], []

    def fail(self, group, message):
        self.fails.append((group, message))

    def warn(self, group, message):
        self.warns.append((group, message))

    def show(self, limit):
        for label, rows in (("WARN", self.warns), ("FAIL", self.fails)):
            groups = {}
            for group, message in rows:
                groups.setdefault(group, []).append(message)
            for group, messages in groups.items():
                print(f"\n{label} {group} ({len(messages)})")
                for message in messages[:limit]:
                    print(f"  {message}")
                if len(messages) > limit:
                    print(f"  ... and {len(messages) - limit} more (use --limit)")
        print(f"\n{len(self.fails)} failures, {len(self.warns)} warnings")


def check_sitemap_page(base, site, staging, old_domain, report, path):
    status, location, body = fetch(base + path)
    if status != 200:
        report.fail("Sitemap page not 200", f"{status} {path} {location or ''}")
        return
    if NOT_FOUND_MARKER in body:
        report.fail("Sitemap page renders not-found", path)
        return
    if not staging and any("noindex" in tag for tag in robots_tags(body)):
        report.fail("Sitemap page is noindex", path)
    if old_domain and old_domain in body:
        report.fail("Old domain in page", path)
    canonical = re.search(r'rel="canonical" href="([^"]*)', body)
    if not canonical:
        report.warn("No canonical in raw HTML", path)
    elif canonical.group(1).rstrip("/") != (site + path).rstrip("/"):
        report.warn("Canonical differs from URL", f"{path} -> {canonical.group(1)}")
    if not re.search(r"<title[\s>]", body):
        report.warn("No <title> in raw HTML", path)
    if 'hrefLang="' not in body:
        report.warn("No hreflang in raw HTML", path)
    h1_count = len(re.findall(r"<h1[\s>]", body))
    if h1_count != 1:
        report.warn("Page does not have exactly one <h1>", f"{h1_count} on {path}")


def check_old_url(base, site, sitemap, report, path):
    hops, status, final, body = follow(base + path)
    final_path = path_of(final)
    if status != 200:
        report.fail("Old URL does not reach a page", f"{path} -> {status} {final_path}")
        return
    if NOT_FOUND_MARKER in body:
        report.fail("Old URL ends on not-found", f"{path} -> {final_path}")
        return
    if len(hops) > 1:
        report.warn("Old URL takes more than one hop", f"{path} ({len(hops)} hops) -> {final_path}")
    if any(code not in PERMANENT for code, _ in hops):
        codes = ",".join(str(code) for code, _ in hops)
        report.warn("Old URL uses a temporary redirect", f"{path} ({codes}) -> {final_path}")
    if final_path.split("?")[0] not in sitemap:
        report.warn("Old URL ends outside the sitemap", f"{path} -> {final_path}")
    canonical = re.search(r'rel="canonical" href="([^"]*)', body)
    if canonical and canonical.group(1).rstrip("/") != (site + final_path.split("?")[0]).rstrip("/"):
        report.warn("Old URL ends on a non-canonical page", f"{path} -> {final_path} -> {canonical.group(1)}")


def check_missing_page(base, report, path):
    status, _, body = fetch(base + path)
    if status == 404:
        return
    if not any("noindex" in tag for tag in robots_tags(body)):
        report.fail("Missing page can be indexed", f"{status} {path}")


def check_robots(base, site, report):
    status, _, body = fetch(base + "/robots.txt")
    if status != 200:
        report.fail("robots.txt", f"status {status}")
        return
    if f"Sitemap: {site}/sitemap.xml" not in body:
        report.fail("robots.txt", f"does not list {site}/sitemap.xml")
    # The first group is the catch-all; AI training bots are blocked separately.
    first_group = body.split("User-Agent:")[1] if "User-Agent:" in body else body
    if re.search(r"^Disallow: /\s*$", first_group, re.M):
        report.fail("robots.txt", "blocks all crawlers")
    for path in PRIVATE_PATHS:
        if f"Disallow: {path}" not in first_group:
            report.fail("robots.txt", f"does not block {path}")
    status, _, _ = fetch(base + "/llms.txt")
    if status != 200:
        report.fail("llms.txt", f"status {status}")


def check_hosts(site, report):
    probe = "/about"
    host = urllib.parse.urlsplit(site).hostname
    apex = host.removeprefix("www.")
    sources = [f"https://{apex}", f"http://{apex}", f"http://{host}", "https://www.cc-hub.online", "https://cc-hub.online"]
    for source in sources:
        hops, status, final, _ = follow(source + probe)
        if status != 200 or final.rstrip("/") != site + probe:
            report.fail("Host redirect", f"{source}{probe} -> {status} {final}")
        elif len(hops) > 1:
            report.warn("Host redirect takes more than one hop", f"{source}{probe} ({len(hops)} hops)")
        elif any(code not in PERMANENT for code, _ in hops):
            report.warn("Host redirect is temporary", f"{source}{probe}")


def main():
    parser = argparse.ArgumentParser(description="Launch checks for the public site.")
    parser.add_argument("--base", default=SITE, help="origin to request (default: production)")
    parser.add_argument("--site", default=SITE, help="origin expected in canonicals and the sitemap")
    parser.add_argument("--staging", action="store_true", help="skip checks that need SITE_INDEXABLE=true")
    parser.add_argument("--check-hosts", action="store_true", help="also test apex, http and cc-hub.online redirects")
    parser.add_argument("--limit", type=int, default=25, help="rows shown per group")
    args = parser.parse_args()
    base, site = args.base.rstrip("/"), args.site.rstrip("/")
    old_domain = None if OLD_DOMAIN in site else OLD_DOMAIN
    report = Report()

    status, _, body = fetch(base + "/sitemap.xml")
    if status != 200:
        print(f"Cannot read {base}/sitemap.xml: status {status}")
        return 1
    locations = re.findall(r"<loc>([^<]+)", body)
    foreign = [loc for loc in locations if not loc.startswith(site)]
    for loc in foreign:
        report.fail("Sitemap URL on the wrong domain", loc)
    sitemap = {path_of(loc) for loc in locations if loc.startswith(site)}
    old_urls = [
        line.strip()
        for line in OLD_URLS.read_text().splitlines()
        if line.strip() and not line.startswith("#")
    ]
    print(f"Checking {len(sitemap)} sitemap pages and {len(old_urls)} old URLs on {base}")

    with cf.ThreadPoolExecutor(6) as pool:
        tasks = [pool.submit(check_sitemap_page, base, site, args.staging, old_domain, report, p) for p in sorted(sitemap)]
        tasks += [pool.submit(check_old_url, base, site, sitemap, report, p) for p in old_urls]
        tasks += [pool.submit(check_missing_page, base, report, p) for p in MISSING_PATHS]
        for task in tasks:
            task.result()

    if not args.staging:
        check_robots(base, site, report)
    if args.check_hosts:
        check_hosts(site, report)

    report.show(args.limit)
    return 1 if report.fails else 0


if __name__ == "__main__":
    sys.exit(main())
