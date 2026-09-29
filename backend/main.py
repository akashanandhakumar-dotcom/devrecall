from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from schemas import MemoryRequest, AskRequest
from memory import (
    retain_memory,
    recall_memories,
    reflect_memory,
)


app = FastAPI(
    title="DevRecall API",
    description="Long-term memory for AI coding assistants",
    version="0.2.0",
)


# ---------------------------------------------------------
# CORS
# ---------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# ROOT
# ---------------------------------------------------------

@app.get("/")
async def root():
    return {
        "name": "DevRecall",
        "status": "online",
        "message": "Your project's long-term memory.",
    }


# ---------------------------------------------------------
# HEALTH CHECK
# ---------------------------------------------------------

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "DevRecall",
    }


# ---------------------------------------------------------
# RETAIN MEMORY
# ---------------------------------------------------------

@app.post("/memory")
async def add_memory(request: MemoryRequest):
    try:
        result = await retain_memory(
            content=request.content,
            context=request.context,
        )

        return {
            "success": True,
            "message": "Memory stored successfully",
            "result": result,
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


# ---------------------------------------------------------
# RECALL MEMORY
# ---------------------------------------------------------

@app.post("/recall")
async def recall(request: AskRequest):
    try:
        result = await recall_memories(
            request.query
        )

        return {
            "success": True,
            "query": request.query,
            "results": result,
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


# ---------------------------------------------------------
# REFLECT / ASK
# ---------------------------------------------------------

@app.post("/ask")
async def ask(request: AskRequest):
    try:
        result = await reflect_memory(
            request.query
        )

        return {
            "success": True,
            "query": request.query,
            "answer": result.text,
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


# ---------------------------------------------------------
# MEMORY EXPLORER
# ---------------------------------------------------------

@app.get("/memories")
async def get_memories():
    try:

        result = await recall_memories(
            "project architecture decisions debugging deployment engineering preferences"
        )

        memories = []

        # Hindsight recall response
        # contains the relevant memory results.
        for memory in result.results:

            memories.append(
                {
                    "id": memory.id,
                    "text": memory.text,
                    "type": memory.type,
                    "context": memory.context,
                    "mentioned_at": memory.mentioned_at,
                }
            )

        return {
            "success": True,
            "count": len(memories),
            "memories": memories,
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )