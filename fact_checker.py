import requests

def fact_check(statement):
    # Define the API endpoint and parameters
    api_url = "https://factcheck.googleapis.com/v1alpha1/claims:search"
    params = {
        'query': statement,
        'key': 'YOUR_API_KEY'  # Replace with your actual API key
    }

    # Make the API request
    response = requests.get(api_url, params=params)
    
    # Check if the request was successful
    if response.status_code != 200:
        return "Error: Unable to access the API"

    # Parse the JSON response
    data = response.json()

    # Check if there are any results
    if 'claims' not in data or not data['claims']:
        return "False"  # No claims found, assume false

    # Analyze the results
    for claim in data['claims']:
        # Extract the rating of the claim
        rating = claim.get('claimReview', [{}])[0].get('rating')

        if rating in ["True", "Mostly True"]:
            return "True"
        elif rating in ["False", "Mostly False"]:
            return "False"
        elif rating == "Partially True":
            return "Partially true"

    return "Unknown"  # If no clear rating found