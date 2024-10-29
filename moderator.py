from fact_checker import FactChecker

class Moderator:
    def __init__(self, topic):
        self.topic = topic
        self.turn = 0
        self.fact_checker = FactChecker()

    def introduce_topic(self):
        return f"Today's topic is: {self.topic}"

    def next_turn(self, debater_statement):
        self.turn += 1
        accuracy = self.fact_checker.check_statement(debater_statement)
        return f"Turn {self.turn}: Statement checked as {accuracy}"

