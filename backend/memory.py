import os
from dotenv import load_dotenv
from hindsight_client import Hindsight

load_dotenv()

BANK_ID = os.getenv("HINDSIGHT_BANK_ID", "devrecall")

client = Hindsight(
    base_url=os.getenv("HINDSIGHT_BASE_URL"),
    api_key=os.getenv("HINDSIGHT_API_KEY")
)


async def retain_memory(content: str, context: str | None = None):
    return await client.aretain(
        bank_id=BANK_ID,
        content=content,
        context=context
    )


async def recall_memories(query: str):
    return await client.arecall(
        bank_id=BANK_ID,
        query=query
    )


async def reflect_memory(query: str):
    return await client.areflect(
        bank_id=BANK_ID,
        query=query
    )