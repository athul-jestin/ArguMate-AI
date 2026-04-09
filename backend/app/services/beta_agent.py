import openai
from app.config import settings

client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)

def generate_beta_response(topic: str, alpha_message: str, history: str) -> str:
    system_prompt = f"""You are Beta, a critical and analytical debater who always argues AGAINST the given topic. 
Your job is to counter Alpha's arguments directly and present strong opposing points. 
Topic: {topic}.
Alpha just said:
{alpha_message}

Previous debate context:
{history}

Refute Alpha's points and present your con arguments in 3-5 clear points.
Do not mention that you are an AI."""

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "system", "content": system_prompt}],
        max_tokens=800,
        temperature=0.7,
    )
    return response.choices[0].message.content.strip()
