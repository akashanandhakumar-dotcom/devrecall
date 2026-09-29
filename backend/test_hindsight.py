import os
import asyncio
from dotenv import load_dotenv
from hindsight_client import Hindsight

load_dotenv()

client = Hindsight(
    base_url=os.getenv("HINDSIGHT_BASE_URL"),
    api_key=os.getenv("HINDSIGHT_API_KEY")
)

BANK_ID = os.getenv("HINDSIGHT_BANK_ID")


async def main():
    print("🤔 Asking DevRecall...\n")

    result = await client.areflect(
        bank_id=BANK_ID,
        query="Why did we choose PostgreSQL instead of MongoDB?"
    )

    print("🧠 DEVRECALL ANSWER:\n")
    print(result)


asyncio.run(main())