"""
Firecrawl Service — Fast structured web extraction.
Primary extraction path (< 2s). Falls back to Gemini vision on failure.
"""

import os
import httpx
from typing import Optional

FIRECRAWL_API_KEY = os.getenv("FIRECRAWL_API_KEY", "")
FIRECRAWL_BASE_URL = "https://api.firecrawl.dev/v1"


async def scrape_url(url: str, timeout: float = 8.0) -> Optional[dict]:
    """
    Attempt fast structured extraction via Firecrawl API.
    Returns structured dict or None on failure.
    """
    if not FIRECRAWL_API_KEY or FIRECRAWL_API_KEY == "your_firecrawl_api_key_here":
        return None  # Fall through to Gemini vision

    headers = {
        "Authorization": f"Bearer {FIRECRAWL_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "url": url,
        "formats": ["markdown", "extract"],
        "extract": {
            "schema": {
                "type": "object",
                "properties": {
                    "company_name": {"type": "string"},
                    "pricing_tiers": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "name": {"type": "string"},
                                "price": {"type": "string"},
                                "period": {"type": "string"},
                                "seats": {"type": "number"},
                            }
                        }
                    },
                    "key_features": {"type": "array", "items": {"type": "string"}},
                    "target_segment": {"type": "string"},
                },
            }
        },
        "onlyMainContent": True,
    }

    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            resp = await client.post(
                f"{FIRECRAWL_BASE_URL}/scrape",
                json=payload,
                headers=headers,
            )
            if resp.status_code == 200:
                data = resp.json()
                extracted = data.get("data", {}).get("extract", {})
                if extracted and extracted.get("company_name"):
                    extracted["confidence"] = 0.85  # Firecrawl = high confidence
                    extracted["page_type"] = "extracted"
                    return extracted
    except Exception:
        pass

    return None  # Signal to use Gemini vision fallback
