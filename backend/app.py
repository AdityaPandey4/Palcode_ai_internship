from fastapi import FastAPI, APIRouter, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from api_endpoints import router as leave_requests_router
import os
import json
from typing import Optional
from crewai import Agent, Task, Crew, LLM

# Create main app and router
app = FastAPI()


# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Frontend dev server
        "http://127.0.0.1:5173"    # Alternative localhost
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
api_router = APIRouter(prefix="/api")  # Prefix for all API routes

# Configure CrewAI with Gemini
os.environ["GEMINI_API_KEY"] = "API_KEY"

llm = LLM(
    model="gemini/gemini-2.0-flash"
)
# Input model
class LeaveRequest(BaseModel):
    text: str

# Output model
class ExtractedInfo(BaseModel):
    leave_type: str
    start_date: str
    end_date: str
    reason: str
    user_id: Optional[str] = None

# Add extract-leave-info endpoint to the router
@api_router.post("/extract-leave-info/", response_model=ExtractedInfo)
async def extract_leave_info(request: LeaveRequest):
    try:
        # # Configure Gemini LLM properly
        # llm = LLM(
        #     model="gemini/gemini-2.0-flash",
        #     max_tokens=1024,
        #     temperature=0.3
        # )

        # Configure Agent with proper JSON output instructions
        leave_approval_agent = Agent(
            role="Gemini Leave Request Processor Expert",
            goal="""Extract leave details from text and return ONLY valid JSON with:
            - leave_type (must be one of: Sick, Vacation, Personal)
            - start_date (YYYY-MM-DD)
            - end_date (YYYY-MM-DD)
            - reason (short summary)
            - user_id (if mentioned)""",
            backstory="Expert in HR document processing and leave management systems.",
            verbose=True,
            allow_delegations=False,
            llm=llm,
        )

        # Enhanced task description
        process_leave_request = Task(
            description=f"""Process this leave request: {request.text}
            Output MUST BE VALID JSON in this exact format:
            {{
                "leave_type": "type", 
                "start_date": "YYYY-MM-DD", 
                "end_date": "YYYY-MM-DD",
                "reason": "summary",
                "user_id": "optional-id"
            }}""",
            expected_output="Valid JSON object with leave details",
            agent=leave_approval_agent,
            output_json=ExtractedInfo  # Force JSON output
        )

        # Execute the task
        crew = Crew(
            agents=[leave_approval_agent],
            tasks=[process_leave_request],
            verbose=True
        )
        
        # Get raw output
        result = crew.kickoff()
        print(f"Raw CrewAI Output: {result}")  # Debugging

        raw_output = str(result)
        print(f"Raw Output: {raw_output}")  # Debugging

        # Enhanced JSON cleaning
        def clean_json(output):
            # Remove code block markers
            output = output.replace('```json', '').replace('```', '')
            # Fix Python-specific values
            output = output.replace("None", "null").replace("'", '"')
            # Extract JSON portion
            start = output.find('{')
            end = output.rfind('}') + 1
            return output[start:end]

        cleaned_json = clean_json(raw_output)
        print(f"Cleaned JSON: {cleaned_json}")  # Debugging

        # Validate and parse
        try:
            parsed = json.loads(cleaned_json)
            return ExtractedInfo(**parsed)
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON: {cleaned_json}") from e
        
    except Exception as e:
        print(f"FULL ERROR DETAILS: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing request: {str(e)}"
        )
        
    except Exception as e:
        print(f"Full Error: {str(e)}")  # Detailed logging
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing request: {str(e)}"
        )
# Include all routers
api_router.include_router(
    leave_requests_router, 
    prefix="/leave-requests",
    tags=["Leave Requests"]
)
app.include_router(api_router)  # From api_endpoints.py

@app.get("/")
def read_root():
    return {"message": "Leave Approval Agent API is running"}

@app.get("/api/health", tags=["health"])
def health_check():
    return {"status": "healthy", "message": "Leave API operational"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)