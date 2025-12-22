from fastapi import WebSocket
from typing import Dict, List
import json

class ConnectionManager:
    def __init__(self):
        # Store connections by user ID
        self.active_connections: Dict[str, WebSocket] = {}
        # Store user info (role, name)
        self.user_info: Dict[str, dict] = {}

    async def connect(self, user_id: str, websocket: WebSocket, user_role: str, user_name: str):
        """Connect a user's WebSocket"""
        await websocket.accept()
        self.active_connections[user_id] = websocket
        self.user_info[user_id] = {"role": user_role, "name": user_name}
        print(f"User {user_id} ({user_role}) connected to chat")

    def disconnect(self, user_id: str):
        """Disconnect a user's WebSocket"""
        if user_id in self.active_connections:
            del self.active_connections[user_id]
            del self.user_info[user_id]
            print(f"User {user_id} disconnected from chat")

    async def send_personal_message(self, message: dict, user_id: str):
        """Send a message to a specific user"""
        if user_id in self.active_connections:
            try:
                await self.active_connections[user_id].send_json(message)
            except Exception as e:
                print(f"Error sending message to {user_id}: {e}")
                self.disconnect(user_id)

    async def send_to_conversation(self, message: dict, conversation_participants: List[str]):
        """Send a message to all participants in a conversation"""
        for user_id in conversation_participants:
            await self.send_personal_message(message, user_id)

    async def broadcast(self, message: str):
        """Broadcast to all connected users"""
        dead_connections = []
        for user_id, connection in self.active_connections.items():
            try:
                await connection.send_text(message)
            except Exception:
                dead_connections.append(user_id)
        
        # Remove dead connections
        for user_id in dead_connections:
            self.disconnect(user_id)

    def is_online(self, user_id: str) -> bool:
        """Check if a user is online"""
        return user_id in self.active_connections

    def get_user_info(self, user_id: str) -> dict:
        """Get user info (role, name)"""
        return self.user_info.get(user_id, {})

manager = ConnectionManager()
