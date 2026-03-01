"""
Browser Service — Playwright headless browser automation.
Captures screenshots and navigates sites without DOM access.
"""

import base64
import time
from typing import Optional

try:
    from playwright.async_api import async_playwright, Browser, Page
    PLAYWRIGHT_AVAILABLE = True
except ImportError:
    PLAYWRIGHT_AVAILABLE = False

_browser: Optional["Browser"] = None


async def get_browser():
    """Lazy-init a shared Playwright browser instance."""
    global _browser
    if not PLAYWRIGHT_AVAILABLE:
        raise RuntimeError("Playwright not installed. Run: pip install playwright && playwright install chromium")
    if _browser is None or not _browser.is_connected():
        playwright = await async_playwright().__aenter__()
        _browser = await playwright.chromium.launch(
            headless=True,
            args=[
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
                "--no-zygote",
            ],
        )
    return _browser


async def capture_screenshot(url: str, timeout_ms: int = 15000) -> tuple[str, int]:
    """
    Navigate to a URL and capture a full-page screenshot.
    Returns: (base64_png_string, duration_ms)
    Zero DOM access — pure visual capture.
    """
    start = time.monotonic()
    try:
        browser = await get_browser()
        context = await browser.new_context(
            viewport={"width": 1280, "height": 800},
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        )
        page: Page = await context.new_page()

        # Block ads/tracking for cleaner screenshots
        await page.route("**/*.{png,jpg,jpeg,gif,svg,woff,woff2}", lambda route: route.abort())
        await page.route("**/analytics*", lambda route: route.abort())
        await page.route("**/ads*", lambda route: route.abort())

        try:
            await page.goto(url, timeout=timeout_ms, wait_until="domcontentloaded")
            await page.wait_for_timeout(2000)  # Let JS render
        except Exception:
            pass  # Capture whatever loaded

        screenshot_bytes = await page.screenshot(
            type="png",
            full_page=False,
            clip={"x": 0, "y": 0, "width": 1280, "height": 800},
        )
        await context.close()

        duration_ms = int((time.monotonic() - start) * 1000)
        return base64.b64encode(screenshot_bytes).decode("utf-8"), duration_ms

    except Exception as e:
        duration_ms = int((time.monotonic() - start) * 1000)
        raise RuntimeError(f"Screenshot failed for {url}: {e}") from e


async def close_browser():
    """Close the shared browser."""
    global _browser
    if _browser and _browser.is_connected():
        await _browser.close()
        _browser = None
