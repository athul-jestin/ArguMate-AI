from app.agents.debater import Debater
from app.agents.fact_checker import FactChecker
from app.agents.moderator import Moderator

class DebateEngine:
    def __init__(self, topic: str):
        self.topic = topic
        self.pro = Debater("PRO")
        self.con = Debater("CON")
        self.fact_checker = FactChecker()
        self.moderator = Moderator(topic)

    def run(self, rounds: int):
        turns = []
        last_statement = ""

        for _ in range(rounds):
            for debater, name in [(self.pro, "Debater_Pro"), (self.con, "Debater_Con")]:
                statement = debater.respond(self.topic, last_statement)
                fact = self.fact_checker.check(statement)

                turns.append({
                    "speaker": name,
                    "statement": statement,
                    "fact_check": fact
                })

                last_statement = statement

        return turns
