import json
from typing import Any

import httpx
from openai import AsyncOpenAI

from app.config import settings

client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)


async def extract_claims(message: str) -> list[str]:
    prompt = f"""Extract all factual claims from the following debate argument as a JSON array of strings.
Only include verifiable factual statements, not opinions.
Argument: {message}"""

    response = await client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.0,
        response_format={"type": "json_object"},
    )

    try:
        content = response.choices[0].message.content
        data = json.loads(content)
        # Handle cases where the model returns {"claims": ["...", "..."]}
        for key in data:
            if isinstance(data[key], list):
                return data[key]
        return []
    except Exception:
        return []


async def google_fact_check(claim: str) -> dict[str, Any]:
    if not settings.GOOGLE_FACT_CHECK_API_KEY:
        return {}

    url = "https://factchecktools.googleapis.com/v1alpha1/claims:search"
    params = {
        "query": claim,
        "key": settings.GOOGLE_FACT_CHECK_API_KEY,
    }

    try:
        async with httpx.AsyncClient() as http_client:
            response = await http_client.get(url, params=params)
        if response.status_code == 200:
            data = response.json()
            if "claims" in data and len(data["claims"]) > 0:
                first_claim = data["claims"][0]
                if "claimReview" in first_claim and len(first_claim["claimReview"]) > 0:
                    review = first_claim["claimReview"][0]
                    text_rating = review.get("textualRating", "").lower()

                    verdict = "Partially True"
                    if "true" in text_rating and "false" not in text_rating and "half" not in text_rating:
                        verdict = "True"
                    elif "false" in text_rating:
                        verdict = "False"
                    elif "mixed" in text_rating:
                        verdict = "Partially True"

                    return {
                        "claim": claim,
                        "verdict": verdict,
                        "explanation": f"Source: {review.get('publisher', {}).get('name', 'Unknown')}. Original rating: {text_rating}",
                    }
    except Exception:
        pass
    return {}


async def ai_fallback_fact_check(claim: str) -> dict[str, Any]:
    prompt = f"""Assess the factual accuracy of this claim: "{claim}"
Return a JSON object with exactly two keys:
"verdict": must be exactly one of "True", "False", or "Partially True"
"explanation": a brief 1-2 sentence explanation of why.
"""
    response = await client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.0,
        response_format={"type": "json_object"},
    )
    try:
        content = response.choices[0].message.content
        data = json.loads(content)
        return {
            "claim": claim,
            "verdict": data.get("verdict", "Partially True"),
            "explanation": data.get("explanation", "AI fallback assessment."),
        }
    except Exception:
        return {
            "claim": claim,
            "verdict": "Partially True",
            "explanation": "Unable to verify claim.",
        }


async def process_claims(message: str) -> list[dict[str, Any]]:
    claims = await extract_claims(message)
    results = []
    for claim in claims:
        fc_result = await google_fact_check(claim)
        if not fc_result:
            fc_result = await ai_fallback_fact_check(claim)
        # Ensure fallback mechanism doesn't overwrite claim if it's missing
        fc_result["claim"] = claim
        results.append(fc_result)
    return results


async def run_fact_checker(alpha_msg: str, beta_msg: str) -> str:
    alpha_results = await process_claims(alpha_msg)
    beta_results = await process_claims(beta_msg)

    final_json = {
        "alpha_claims": alpha_results,
        "beta_claims": beta_results,
    }
    return json.dumps(final_json)
