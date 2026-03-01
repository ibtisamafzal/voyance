"""
Perplexity Service — Live web grounding and fact verification.
Verifies key extracted claims against the live web index.
"""

import os
import re
import json
import httpx
from typing import Optional

PERPLEXITY_API_KEY = os.getenv("PERPLEXITY_API_KEY", "")
PERPLEXITY_BASE_URL = "https://api.perplexity.ai"

# Fallback: extract URLs from text when JSON parsing fails
_URL_RE = re.compile(r'https?://[a-zA-Z0-9][-a-zA-Z0-9.]*[a-zA-Z0-9](?:/[^\s"\'<>]*)?')


async def verify_claim(company: str, claim: str, timeout: float = 10.0) -> dict:
    """
    Verify a specific claim about a company against the live web.
    Returns: { verified: bool, confidence: float, source: str, correction: Optional[str] }
    """
    if not PERPLEXITY_API_KEY or PERPLEXITY_API_KEY == "your_perplexity_api_key_here":
        return {
            "verified": False,
            "confidence": 0.5,
            "source": "API key not configured",
            "correction": None,
        }

    query = f'Verify this claim about {company}: "{claim}". Is this accurate as of 2024-2025?'

    headers = {
        "Authorization": f"Bearer {PERPLEXITY_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": os.getenv("PERPLEXITY_MODEL", "sonar"),
        "messages": [
            {
                "role": "system",
                "content": "You are a fact-checker. Verify claims from live web sources. Be concise. Answer in 2-3 sentences max."
            },
            {
                "role": "user",
                "content": query,
            }
        ],
        "temperature": 0.1,
        "return_citations": True,
    }

    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            resp = await client.post(
                f"{PERPLEXITY_BASE_URL}/chat/completions",
                json=payload,
                headers=headers,
            )
            if resp.status_code == 200:
                data = resp.json()
                content = data["choices"][0]["message"]["content"]
                citations = data.get("citations", [])

                # Basic heuristic: if response starts with "Yes" or includes "accurate" → verified
                verified = any(
                    word in content.lower()[:80]
                    for word in ["yes", "correct", "accurate", "confirmed", "indeed", "true"]
                )
                confidence = 0.85 if verified else 0.45

                return {
                    "verified": verified,
                    "confidence": confidence,
                    "source": citations[0] if citations else content[:100],
                    "correction": None if verified else content[:200],
                }
    except Exception as e:
        pass

    return {
        "verified": False,
        "confidence": 0.4,
        "source": "Verification timed out",
        "correction": None,
    }


async def search_competitors(query: str, timeout: float = 15.0) -> list[dict]:
    """
    Search for competitor info via Perplexity's online model.
    Returns list of company snippets with URLs.
    """
    if not PERPLEXITY_API_KEY or PERPLEXITY_API_KEY == "your_perplexity_api_key_here":
        return []

    headers = {
        "Authorization": f"Bearer {PERPLEXITY_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": os.getenv("PERPLEXITY_MODEL", "sonar"),
        "messages": [
            {
                "role": "system",
                "content": "Return a JSON array of tools/competitors. Each item: {company, website, pricing_hint, segment}. website must be full URL (https://...). No markdown."
            },
            {"role": "user", "content": f"List the top 5 for: {query}. Return real product URLs."},
        ],
        "temperature": 0.2,
        "return_citations": True,
    }

    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            resp = await client.post(
                f"{PERPLEXITY_BASE_URL}/chat/completions",
                json=payload,
                headers=headers,
            )
            if resp.status_code == 200:
                data = resp.json()
                content = data["choices"][0]["message"]["content"]
                text = re.sub(r'^```(?:json)?\n?', '', content.strip()).rstrip('`').strip()
                try:
                    parsed = json.loads(text)
                    if isinstance(parsed, list):
                        return parsed
                    if isinstance(parsed, dict) and "items" in parsed:
                        return parsed["items"]
                    return [parsed] if isinstance(parsed, dict) else []
                except json.JSONDecodeError:
                    # Extract URLs from content and build minimal competitor list
                    urls = list(dict.fromkeys(_URL_RE.findall(content)))
                    return [{"company": u.split("//")[1].split("/")[0].replace("www.", ""), "website": u} for u in urls[:5]]
    except Exception:
        pass

    return []
