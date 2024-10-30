from fact_checker import FactChecker

class Moderator:
    def __init__(self, topic):
        self.topic = topic
        self.turn = 0
        self.fact_checker = FactChecker()  # Initialize the FactChecker

    def introduce_topic(self):
        return f"Today's topic is: {self.topic}"

    def next_turn(self, debater_statement):
        self.turn += 1
        
        # Use the FactChecker to verify the statement
        fact_check_result = self.fact_checker.check_statement(debater_statement)
        
        # Return structured information for the debate flow
        return f"Turn {self.turn}: Statement accuracy is {fact_check_result}"

    def summarize_debate(self):
        return "Debate concluded. Thank you to both debaters!"
