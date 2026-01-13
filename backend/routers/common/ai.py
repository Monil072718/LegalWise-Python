from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
import google.generativeai as genai
import re

router = APIRouter(
    prefix="/ai",
    tags=["ai"],
)

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

def get_fallback_response(query: str) -> str:
    """Improved fallback logic if no AI key is present"""
    query = query.lower()
    
    # Knowledge Base
    kb = {
        "divorce": "Divorce proceedings generally involve filing a petition, disclosing financial assets, and determining child custody arrangements if applicable. Laws vary significantly by state.",
        "custody": "Child custody is usually determined based on the 'best interests of the child' standard. This considers factors like the child's age, emotional ties, and the parents' ability to provide care.",
        "contract": "A valid contract typically requires three elements: an offer, acceptance, and consideration (exchange of value). If one party fails to fulfill terms, it may be considered a breach.",
        "arrest": "If arrested, you have the right to remain silent and the right to an attorney (Miranda Rights). It is generally advised to exercise these rights immediately.",
        "ticket": "Traffic violations can often be contested in court or resolved by paying a fine. Some jurisdictions offer traffic school to prevent points on your license.",
        "will": "A will is a legal document setting forth your wishes regarding the distribution of your property and the care of any minor children. It usually requires witnesses to be valid.",
        "copyright": "Copyright protection exists from the moment an original work of authorship is fixed in a tangible medium. Registration provides additional benefits for enforcement.",
        "stolen": "Theft of property, such as a mobile phone, is a criminal offense. You should file a First Information Report (FIR) with the local police immediately. Online portals like 'CeIR' (Central Equipment Identity Register) in India can also block lost mobiles.",
        "theft": "Theft depends on the value of goods stolen and jurisdiction. It is punished under criminal codes (e.g., IPC 379 in India). Report to police.",
        "fir": "An FIR (First Information Report) is the first step to setting the criminal justice process in motion. You can file it at the nearest police station.",
        "consumer": "Consumer courts handle disputes regarding defective goods or services. You can file a complaint with the proper evidence of purchase and defect."
    }
    
    # Direct Match
    for key, val in kb.items():
        if key in query:
            return val + " Would you like to know more about this?"

    # Expanded Keyword List
    keywords = [
        "law", "legal", "court", "judge", "attorney", "lawyer", "advocate",
        "crime", "civil", "rights", "sue", "litigation", "appeal",
        "property", "tenant", "landlord", "rent", "lease",
        "eviction", "police", "justice", "statute", "act", "section",
        "regulation", "compliance", "fraud", "scam", "negligence", "injury", "accident",
        "damages", "compensation", "trust", "estate", "patent", "copyright",
        "trademark", "help", "advice", "case", "file", "complaint", "complain",
        "stolen", "lost", "theft", "robbery", "assault", "harassment",
        "divorce", "marriage", "custody", "alimony", "maintenance",
        "contract", "agreement", "breach", "sign", "deal",
        "company", "business", "incorporation", "tax", "gst",
        "consumer", "defective", "service", "warranty"
    ]
    
    if any(k in query for k in keywords):
        return f"I understand you are asking about '{query}'. While I am running in offline mode (Keyword Match), this appears to be a legal matter regarding {next((k for k in keywords if k in query), 'legal issues')}. Please consult a lawyer for specific advice."

    return "I apologize, but I am programmed to assist only with legal inquiries. Please ask about laws, rights, procedures, or specific legal situations."

@router.post("/chat")
def chat_with_ai(request: ChatRequest):
    api_key = os.getenv("GEMINI_API_KEY")
    
    # Legacy/Fallback Mode
    if not api_key:
        last_message = request.messages[-1].content
        return {"response": get_fallback_response(last_message)}
    
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-pro')
        
        # Convert history format
        # Gemini handles history as: [{'role': 'user', 'parts': ['msg']}, {'role': 'model', 'parts': ['msg']}]
        # Our format: [{'role': 'user', 'content': 'msg'}]
        history = []
        for msg in request.messages[:-1]: # All except last
            role = 'user' if msg.role == 'user' else 'model'
            history.append({'role': role, 'parts': [msg.content]})
            
        chat = model.start_chat(history=history)
        
        last_msg = request.messages[-1].content
        
        # System Prompt Injection (Soft)
        # Gemini doesn't have system prompt in standard chat, we can prepend it or rely on instruction.
        # We'll rely on a strong first message context or just send it.
        
        # Actually, let's just send the message.
        response = chat.send_message(
            f"SYSTEM: You are an expert Legal AI Assistant. Answer the following legal question accurately and concisely. If it is NOT related to law, politely decline. User Question: {last_msg}"
        )
        
        return {"response": response.text}
        
    except Exception as e:
        print(f"AI Error: {e}")
        # Fallback if API fails
        return {"response": get_fallback_response(request.messages[-1].content)}
