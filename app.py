import streamlit as st
from debate_system import Debater
from moderator import Moderator

st.title("Agentic Adversarial AI Debate System")

# Initialize agents and moderator
topic = st.text_input("Enter the debate topic:")
moderator = Moderator(topic)
debater_1 = Debater("pro")
debater_2 = Debater("con")

if st.button("Start Debate"):
    st.write(moderator.introduce_topic())
    
    # Debater 1's opening statement
    opening_1 = debater_1.generate_statement(f"Opening statement in favor of {topic}")
    st.write("Debater 1:", opening_1)
    
    # Moderator checks fact and moves to Debater 2
    result_1 = moderator.next_turn(opening_1)
    st.write(result_1)
    
    # Debater 2's opening statement
    opening_2 = debater_2.generate_statement(f"Opening statement against {topic}")
    st.write("Debater 2:", opening_2)
    
    # Moderator checks fact and continues as above
    result_2 = moderator.next_turn(opening_2)
    st.write(result_2)
