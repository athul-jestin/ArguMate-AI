import requests

class FactChecker:

    def check(self, statement: str) -> str:
        url = "https://factchecktools.googleapis.com/v1alpha1/claims:search"
        params = {"query": statement, "key": self.API_KEY}

        res = requests.get(url, params=params)
        if res.status_code != 200:
            return "Partially true"

        data = res.json()
        if "claims" not in data:
            return "Partially true"

        rating = data["claims"][0]["claimReview"][0].get("textualRating", "").lower()

        if "true" in rating:
            return "True"
        if "false" in rating:
            return "False"
        return "Partially true"
