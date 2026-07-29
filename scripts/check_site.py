#!/usr/bin/env python3
"""Validate the static portfolio before GitHub Pages deployment.

The checks intentionally avoid external network requests. They verify the repository's
own HTML, anchors, local assets, metadata, CSS references, robots file and sitemap.
"""

from __future__ import annotations

import re
import sys
import xml.etree.ElementTree as ET
from collections import Counter
from dataclasses import dataclass, field
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
EXTERNAL_SCHEMES = {"http", "https", "mailto", "tel", "data", "javascript"}
CSS_URL_PATTERN = re.compile(r"url\(\s*(['\"]?)(.*?)\1\s*\)", re.IGNORECASE)
RUNTIME_ASSET_PATTERN = re.compile(
    r"\[\s*['\"]([^'\"]+\.(?:png|jpe?g|webp|gif|svg))['\"]\s*,\s*['\"]https://",
    re.IGNORECASE,
)


@dataclass
class PageData:
    path: Path
    ids: list[str] = field(default_factory=list)
    references: list[tuple[str, str]] = field(default_factory=list)
    image_count: int = 0
    images_without_dimensions: int = 0
    images_without_alt: int = 0
    title_count: int = 0
    title_text: list[str] = field(default_factory=list)
    description_count: int = 0
    canonical_urls: list[str] = field(default_factory=list)
    icon_count: int = 0
    main_count: int = 0
    h1_count: int = 0
    robots_values: list[str] = field(default_factory=list)


class PortfolioHTMLParser(HTMLParser):
    def __init__(self, path: Path) -> None:
        super().__init__(convert_charrefs=True)
        self.page = PageData(path=path)
        self._inside_title = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = {name.lower(): (value or "") for name, value in attrs}
        tag = tag.lower()

        element_id = attributes.get("id")
        if element_id:
            self.page.ids.append(element_id)

        if tag == "title":
            self.page.title_count += 1
            self._inside_title = True
        elif tag == "main":
            self.page.main_count += 1
        elif tag == "h1":
            self.page.h1_count += 1
        elif tag == "meta":
            name = attributes.get("name", "").lower()
            if name == "description" and attributes.get("content", "").strip():
                self.page.description_count += 1
            if name == "robots":
                self.page.robots_values.append(attributes.get("content", ""))
        elif tag == "link":
            rel_values = {value.lower() for value in attributes.get("rel", "").split()}
            href = attributes.get("href", "")
            if "canonical" in rel_values and href:
                self.page.canonical_urls.append(href)
            if "icon" in rel_values and href:
                self.page.icon_count += 1
        elif tag == "img":
            self.page.image_count += 1
            if "alt" not in attributes:
                self.page.images_without_alt += 1
            if not (attributes.get("width") and attributes.get("height")):
                self.page.images_without_dimensions += 1

        for attribute_name in ("href", "src", "poster", "data"):
            value = attributes.get(attribute_name)
            if value:
                self.page.references.append((attribute_name, value.strip()))

        srcset = attributes.get("srcset", "")
        if srcset:
            for candidate in srcset.split(","):
                url = candidate.strip().split()[0]
                if url:
                    self.page.references.append(("srcset", url))

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() == "title":
            self._inside_title = False

    def handle_data(self, data: str) -> None:
        if self._inside_title and data.strip():
            self.page.title_text.append(data.strip())


def parse_html(path: Path) -> PageData:
    parser = PortfolioHTMLParser(path)
    parser.feed(path.read_text(encoding="utf-8"))
    parser.close()
    return parser.page


def documented_runtime_assets() -> set[str]:
    script_path = ROOT / "script-core.js"
    if not script_path.exists():
        return set()
    return set(RUNTIME_ASSET_PATTERN.findall(script_path.read_text(encoding="utf-8")))


def is_external_reference(raw_reference: str) -> bool:
    reference = raw_reference.strip()
    if not reference or reference.startswith("//"):
        return True
    return urlsplit(reference).scheme.lower() in EXTERNAL_SCHEMES


def resolve_local_reference(source: Path, raw_reference: str) -> tuple[Path, str]:
    parsed = urlsplit(raw_reference)
    decoded_path = unquote(parsed.path)
    fragment = unquote(parsed.fragment)

    if not decoded_path:
        target = source
    elif decoded_path.startswith("/"):
        target = ROOT / decoded_path.lstrip("/")
    else:
        target = source.parent / decoded_path

    if decoded_path.endswith("/"):
        target = target / "index.html"

    return target.resolve(), fragment


def display_path(path: Path) -> str:
    try:
        return str(path.relative_to(ROOT))
    except ValueError:
        return str(path)


def check_html_pages(pages: dict[Path, PageData]) -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []

    for path, page in sorted(pages.items(), key=lambda item: str(item[0])):
        relative = display_path(path)
        duplicate_ids = [element_id for element_id, count in Counter(page.ids).items() if count > 1]

        if duplicate_ids:
            errors.append(f"{relative}: duplicate id values: {', '.join(sorted(duplicate_ids))}")
        if page.title_count != 1 or not " ".join(page.title_text).strip():
            errors.append(f"{relative}: expected one non-empty <title> element")
        if page.description_count != 1:
            errors.append(f"{relative}: expected one non-empty meta description")
        if page.icon_count < 1:
            errors.append(f"{relative}: missing favicon link")
        if page.main_count != 1:
            errors.append(f"{relative}: expected exactly one <main> element")
        if page.h1_count != 1:
            errors.append(f"{relative}: expected exactly one <h1> element")
        if page.images_without_alt:
            errors.append(f"{relative}: {page.images_without_alt} image(s) are missing an alt attribute")

        if path.name == "404.html":
            if "noindex" not in " ".join(page.robots_values).lower():
                errors.append("404.html: missing a noindex robots directive")
        elif len(page.canonical_urls) != 1:
            errors.append(f"{relative}: expected exactly one canonical URL")

        if page.images_without_dimensions:
            warnings.append(
                f"{relative}: {page.images_without_dimensions}/{page.image_count} image(s) rely on CSS or intrinsic sizing"
            )

    return errors, warnings


def check_local_references(
    pages: dict[Path, PageData], runtime_assets: set[str]
) -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []
    page_ids = {path.resolve(): set(page.ids) for path, page in pages.items()}

    for source, page in pages.items():
        for attribute_name, reference in page.references:
            if is_external_reference(reference):
                continue
            if reference == "#":
                errors.append(f"{display_path(source)}: empty fragment in {attribute_name}")
                continue

            target, fragment = resolve_local_reference(source, reference)
            if target == source.resolve() and not urlsplit(reference).path and not fragment:
                continue

            if not target.exists():
                if (
                    source.name == "credentials.html"
                    and attribute_name in {"src", "srcset"}
                    and target.name in runtime_assets
                ):
                    warnings.append(
                        f"{display_path(source)}: '{target.name}' is replaced with its documented issuer-hosted preview at runtime"
                    )
                    continue

                errors.append(
                    f"{display_path(source)}: broken local {attribute_name} reference '{reference}' "
                    f"(expected {display_path(target)})"
                )
                continue

            if fragment and target.suffix.lower() in {".html", ".htm"}:
                target_ids = page_ids.get(target)
                if target_ids is None:
                    target_ids = set(parse_html(target).ids)
                    page_ids[target] = target_ids
                if fragment not in target_ids:
                    errors.append(
                        f"{display_path(source)}: fragment '#{fragment}' was not found in {display_path(target)}"
                    )

    return errors, warnings


def check_css_references() -> list[str]:
    errors: list[str] = []

    for css_path in sorted(ROOT.rglob("*.css")):
        if ".git" in css_path.parts:
            continue
        content = css_path.read_text(encoding="utf-8")
        for _, raw_reference in CSS_URL_PATTERN.findall(content):
            reference = raw_reference.strip()
            if not reference or reference.startswith("#") or is_external_reference(reference):
                continue

            target, _ = resolve_local_reference(css_path, reference)
            if not target.exists():
                errors.append(
                    f"{display_path(css_path)}: broken CSS url('{reference}') "
                    f"(expected {display_path(target)})"
                )

    return errors


def check_robots_and_sitemap(pages: dict[Path, PageData]) -> list[str]:
    errors: list[str] = []
    robots_path = ROOT / "robots.txt"
    sitemap_path = ROOT / "sitemap.xml"

    if not robots_path.exists():
        errors.append("robots.txt is missing")
    else:
        robots = robots_path.read_text(encoding="utf-8").lower()
        if "user-agent:" not in robots:
            errors.append("robots.txt is missing a User-agent directive")
        if "sitemap: https://jeraldbucud.com/sitemap.xml" not in robots:
            errors.append("robots.txt is missing the canonical sitemap URL")

    if not sitemap_path.exists():
        errors.append("sitemap.xml is missing")
        return errors

    try:
        tree = ET.parse(sitemap_path)
    except ET.ParseError as exc:
        errors.append(f"sitemap.xml is not valid XML: {exc}")
        return errors

    namespace = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    sitemap_urls = {
        element.text.strip()
        for element in tree.findall("sm:url/sm:loc", namespace)
        if element.text and element.text.strip()
    }
    expected_urls = {
        page.canonical_urls[0]
        for path, page in pages.items()
        if path.name != "404.html" and len(page.canonical_urls) == 1
    }

    missing = sorted(expected_urls - sitemap_urls)
    unexpected = sorted(sitemap_urls - expected_urls)
    if missing:
        errors.append(f"sitemap.xml is missing canonical page URL(s): {', '.join(missing)}")
    if unexpected:
        errors.append(f"sitemap.xml contains URL(s) without a matching canonical page: {', '.join(unexpected)}")

    return errors


def main() -> int:
    html_paths = sorted(ROOT.glob("*.html"))
    if not html_paths:
        print("ERROR: no root HTML pages were found", file=sys.stderr)
        return 1

    pages = {path.resolve(): parse_html(path) for path in html_paths}
    runtime_assets = documented_runtime_assets()
    html_errors, warnings = check_html_pages(pages)
    reference_errors, reference_warnings = check_local_references(pages, runtime_assets)
    warnings.extend(reference_warnings)
    errors = [
        *html_errors,
        *reference_errors,
        *check_css_references(),
        *check_robots_and_sitemap(pages),
    ]

    print(f"Checked {len(pages)} HTML pages and {len(list(ROOT.rglob('*.css')))} CSS files.")
    for warning in warnings:
        print(f"WARNING: {warning}")

    if errors:
        print("\nSite validation failed:", file=sys.stderr)
        for error in errors:
            print(f"- {error}", file=sys.stderr)
        return 1

    print("Site validation passed: metadata, internal links, fragments, local assets, CSS URLs, robots and sitemap are consistent.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
