import openai
from app.config import settings

client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)

def generate_alpha_response(topic: str, key_points: str, history: str) -> str:
    system_prompt = f"""You are Alpha, a sharp and persuasive debater who always argues in FAVOR of the given topic. 
Your arguments must be logical, evidence-based, and compelling. You are currently debating the following topic: {topic}.
The user has highlighted these key points: {key_points}.
Previous debate context:
{history}

Present your pro arguments clearly in 3-5 well-structured points.
Do not mention that you are an AI."""

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "system", "content": system_prompt}],
        max_tokens=800,
        temperature=0.7,
    )
    return response.choices[0].message.content.strip()
