class Moderator:
    def __init__(self, topic: str):
        self.topic = topic
        self.turn = 0

    def next_turn(self):
        self.turn += 1
        return self.turn
