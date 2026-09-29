import os

from dotenv import load_dotenv
from hindsight_client import Hindsight

load_dotenv()

BANK_ID = os.getenv("HINDSIGHT_BANK_ID", "devrecall")
BASE_URL = os.getenv("HINDSIGHT_BASE_URL")
API_KEY = os.getenv("HINDSIGHT_API_KEY")

client = Hindsight(
    base_url=BASE_URL,
    api_key=API_KEY,
)


async def retain_memory(
    content: str,
    context: str | None = None,
):
    return await client.aretain(
        bank_id=BANK_ID,
        content=content,
        context=context,
    )


async def recall_memories(query: str):
    return await client.arecall(
        bank_id=BANK_ID,
        query=query,
    )


async def reflect_memory(query: str):
    return await client.areflect(
        bank_id=BANK_ID,
        query=query,
    )


async def get_bank_stats():
    """
    Get live statistics from Hindsight Cloud.
    """

    import aiohttp

    url = f"{BASE_URL}/v1/default/banks/{BANK_ID}/stats"

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Accept": "application/json",
    }

    async with aiohttp.ClientSession() as session:
        async with session.get(
            url,
            headers=headers,
            params={"refresh": "true"},
        ) as response:

            if response.status != 200:
                error_text = await response.text()

                raise RuntimeError(
                    f"Hindsight stats request failed "
                    f"({response.status}): {error_text}"
                )

            return await response.json()