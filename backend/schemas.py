from pydantic import BaseModel


class MemoryRequest(BaseModel):
    content: str
    context: str | None = None


class AskRequest(BaseModel):
    query: str