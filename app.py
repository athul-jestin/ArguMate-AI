import streamlit as st
from debate_system import Debater
from moderator import Moderator

# Set up the page title and subheader
st.set_page_config(page_title="ArguMate-AI")
st.title("ArguMate-AI")
st.subheader("Agentic Adversarial AI Debate System")

# Initialize agents and moderator
topic = st.text_input("Enter the debate topic:")
moderator = Moderator(topic)
debater_1 = Debater("pro")
debater_2 = Debater("con")

# CSS for the chat bubbles with updated colors
st.markdown("""
    <style>
    .left-bubble, .right-bubble {
        padding: 10px 15px;
        border-radius: 20px;
        margin: 10px;
        display: inline-block;
        max-width: 70%;
        color: white;
    }
    .left-bubble {
        background-color: #373835;
        text-align: left;
        float: left;
        clear: both;
    }
    .right-bubble {
        background-color: #373835;
        text-align: right;
        float: right;
        clear: both;
    }
    </style>
    """, unsafe_allow_html=True)

# Start the debate
if st.button("Start Debate"):
    st.write(moderator.introduce_topic())

    # Debater 1's opening statement (aligned left)
    opening_1 = debater_1.generate_statement(f"Opening statement in favor of {topic}")
    st.markdown(f'<div class="left-bubble">Debater 1: {opening_1}</div>', unsafe_allow_html=True)

    # Moderator checks fact and moves to Debater 2
    result_1 = moderator.next_turn(opening_1)
    st.write(result_1)

    # Debater 2's opening statement (aligned right)
    opening_2 = debater_2.generate_statement(f"Opening statement against {topic}")
    st.markdown(f'<div class="right-bubble">Debater 2: {opening_2}</div>', unsafe_allow_html=True)

    # Moderator checks fact and continues as above
    result_2 = moderator.next_turn(opening_2)
    st.write(result_2)
