from sqlalchemy.orm import Session
from app.models.message import Message, RoleEnum
from app.models.session import DebateSession
from app.services.alpha_agent import generate_alpha_response
from app.services.beta_agent import generate_beta_response
from app.services.fact_checker import run_fact_checker
import json

def get_history_string(messages: list[Message]) -> str:
    history = ""
    for msg in messages:
        if msg.role in [RoleEnum.alpha, RoleEnum.beta]:
            role_name = "Alpha" if msg.role == RoleEnum.alpha else "Beta"
            history += f"[{role_name}]: {msg.content}\n"
    return history

def process_debate_turn(db: Session, session: DebateSession, trip_number: int):
    # Retrieve all previous messages for context
    messages = db.query(Message).filter(Message.session_id == session.id).order_by(Message.created_at).all()
    history_str = get_history_string(messages)

    # 1. Alpha generating pro argument
    alpha_content = generate_alpha_response(session.topic, session.key_points or "", history_str)
    alpha_msg = Message(
        session_id=session.id,
        trip_number=trip_number,
        role=RoleEnum.alpha,
        content=alpha_content
    )
    db.add(alpha_msg)
    db.commit()
    db.refresh(alpha_msg)

    # Append Alpha's new message to history for Beta
    current_history_for_beta = history_str + f"[Alpha]: {alpha_content}\n"

    # 2. Beta generating con argument
    beta_content = generate_beta_response(session.topic, alpha_content, current_history_for_beta)
    beta_msg = Message(
        session_id=session.id,
        trip_number=trip_number,
        role=RoleEnum.beta,
        content=beta_content
    )
    db.add(beta_msg)
    db.commit()
    db.refresh(beta_msg)

    # 3. Fact Checker evaluation
    fc_json_str = run_fact_checker(alpha_content, beta_content)
    fc_msg = Message(
        session_id=session.id,
        trip_number=trip_number,
        role=RoleEnum.fact_checker,
        content=fc_json_str
    )
    db.add(fc_msg)
    db.commit()
    db.refresh(fc_msg)

    # Return the mapped response dictated by schema
    return {
        "trip_number": trip_number,
        "alpha": {"content": alpha_content, "role": "alpha"},
        "beta": {"content": beta_content, "role": "beta"},
        "fact_checker": json.loads(fc_json_str)
    }
