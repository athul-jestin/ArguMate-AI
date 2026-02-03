from transformers import pipeline

class Debater:
    def __init__(self, stance: str):
        self.stance = stance
        self.memory = []
        self.generator = pipeline("text-generation", model="gpt2")

    def respond(self, topic: str, opponent_statement: str = ""):
        prompt = f"""
        You are debating on: {topic}
        Your stance: {self.stance}
        Opponent said: {opponent_statement}
        Respond with a strong argument.
        """
        output = self.generator(prompt, max_length=150)[0]["generated_text"]
        self.memory.append(output)
        return output
