import requests

class FactChecker:
    # Declare the API key here
    api_key = "AIzaSyC9OoeNSLXxMc8eyAqIK_QiLl5ffGTFXik"  # Replace with your actual API key

    def __init__(self):
        self.verified_facts = {}

    def check_statement(self, statement):
        # Call Google Fact Check API
        url = "https://factchecktools.googleapis.com/v1alpha1/claims:search"
        params = {
            "query": statement,
            "key": self.api_key
        }
        response = requests.get(url, params=params)

        # Check for successful response
        if response.status_code == 200:
            data = response.json()

            # Process the response if claims are found
            if "claims" in data:
                claim_review = data["claims"][0]["claimReview"][0]
                rating = claim_review.get("textualRating", "").lower()

                # Map the rating to "True", "False", or "Partially true"
                if "true" in rating:
                    return "True"
                elif "false" in rating:
                    return "False"
                elif "partially" in rating or "mixed" in rating:
                    return "Partially true"
                else:
                    return "Partially true"  # Default if rating isn't clear
            else:
                return "Partially true"  # No fact-checking results found
        else:
            # In case of error, return "Partially true" as a fallback
            return "Partially true"

# Example usage
# fact_checker = FactChecker()
# result = fact_checker.check_statement("Example statement to fact-check")
# print(result)
