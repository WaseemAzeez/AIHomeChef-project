import os
import requests
from django.http import JsonResponse
from rest_framework.decorators import api_view
from dotenv import load_dotenv

load_dotenv()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
ANTHROPIC_URL = "https://api.anthropic.com/v1/messages"

@api_view(["POST"])
def get_recipe(request):
    data = request.data
    ingredients = data.get("ingredients", [])

    if not ingredients:
        return JsonResponse({"error": "No ingredients provided"}, status=400)

    if not ANTHROPIC_API_KEY:
        return JsonResponse({"error": "Missing Anthropic API key"}, status=500)

    prompt = f"Generate a detailed cooking recipe using: {', '.join(ingredients)}."

    try:
        headers = {
            "x-api-key": ANTHROPIC_API_KEY,
            "Content-Type": "application/json",
            "anthropic-version": "2023-06-01"
        }
        payload = {
            "model": "claude-3-sonnet-20240229",
            "max_tokens": 500,
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt}
                    ]
                }
            ]
        }

        r = requests.post(ANTHROPIC_URL, headers=headers, json=payload)
        if r.status_code != 200:
            return JsonResponse({
                "error": f"Anthropic API returned {r.status_code}",
                "details": r.text
            }, status=r.status_code)

        result = r.json()
        recipe_text = result["content"][0]["text"]

        return JsonResponse({"recipe": recipe_text})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
