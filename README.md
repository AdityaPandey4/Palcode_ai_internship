# Leave Approval Agent: Workflow Design
The application will have 3 major components which will be Frontend (React), Database(Postgres), backend(Fastapi)

The user or the admin will access the application using the Frontend and all the different sessions are described below:

## System Architecture & Data Flow

### User Authentication Flow

-User login/registration
-Role assignment (regular employee or admin)

### Leave Request Submission Flow

User enters natural language request
NLP processing extracts key information:

-Leave type
-Date range
-Reason
-Notification sent to admin

### Admin Approval Flow

-Admin views pending requests
-Reviews request details
-Approves or rejects with optional comment
-System updates leave balance
-Notification sent to user

## Explanation of NLP model & system architecture.

### NLP Model 

For the Leave Approval Agent I have used CrewAI framework and used Gemini 2.0 for the LLM
the crew is designed in such a way that it can process any request of the user leave request and then extract valuable data.

### To test the agent alone I have provided agent.ipynb file

### System Architecture

System Architecture Overview

Component	Technology	 Internal Port   	Host Port	     Docker Service Name

Frontend	React/Vite	    5173	         5173	              frontend
Backend	  FastAPI	        8000	         57230              backend
Database	PostgreSQL	    5432	          5432	               db

### Expected Data Flow

User Interaction
Browser (localhost:5173) → Frontend

Submits leave request via form

AI Processing
Frontend → Backend (POST /api/extract-leave-info/)

Text sent to FastAPI endpoint

CrewAI + Gemini processes request

Database Interaction
Backend ↔ PostgreSQL

Validated data saved to DB

Leave balances updated

Response Cycle
Backend → Frontend

Returns structured JSON:
{
  "leave_type": "Sick",
  "start_date": "2025-11-12",
  "end_date": "2025-11-15",
  "reason": "Flu recovery",
  "user_id": null
}

# Installation Guide

As I have Build the entire system in Docker and have provided the dockerfiles and dockercompose file in the github 

Run the following command to install the docker 

docker-compose up --build 

this will install and run the entire system in the machine 

# NOTE: 

The front and backend are working and also my Agent is working, which we can check by this example

curl -X POST http://localhost:8000/api/extract-leave-info/   ntent-Type: application/json"   -d '{"text": "I need vacation from 2025-12-20 to 2025-12-30"}'

as we provide this in the WSL while the docker is running the backend produces the following result

{"leave_type":"Vacation","start_date":"2025-12-20","end_date":"2025-12-30","reason":"Vacation","user_id":null}

which is the expected output from the agent, and this can also be tested using the agent.ipynb file in the root directory.

However I was not able to connect the frontend and the backend together in the UI and it does not work in the web UI.
As coming from a AI field, this was a great opportunity for me to work on both frontend and backend of this project, but due to less experince in frontend and backend I was not able to accomplish the entire 
project.

I hope that the evaluater will understand my expertise of AI and Agent and judge the project based on that.
Thank You
