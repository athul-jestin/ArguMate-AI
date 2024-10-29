from transformers import pipeline
import warnings
warnings.filterwarnings('ignore')

# Load a language model, I have used gpt2
debater_1 = pipeline("text-generation", model="gpt2")
debater_2 = pipeline("text-generation", model="gpt2")

def generate_statement(agent, prompt):
    response = agent(prompt,
                    max_length=100,
                    truncation=True,
                    temperature=0.7,
                    top_k=50,
                    top_p=0.9)
    return response[0]["generated_text"]


debate_topic = input("Enter the debate topic: ")
opening_1 = generate_statement(debater_1, f"Argue in favor of: {debate_topic}.")
opening_2 = generate_statement(debater_2, f"Argue against: {debate_topic}.")
print("Debater 1 Opening:", opening_1)
print("Debater 2 Opening:", opening_2)