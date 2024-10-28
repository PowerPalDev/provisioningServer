# Provisioning Server for IoT Devices

The code for the backend provisioning server developed on Fastapi and Database on Postgres with two tables for users and devices.
It includes API endpoints for creating users, adding devices, listing users and devices.


Prerequisites
- Python 3.10+
- PostgreSQL
- Git (for version control)

The Backend folder have four files
- database.py         # Database connection and session management
- main.py             # FastAPI application and route definitions
- models.py           # SQLAlchemy ORM models for users and devices
- schemas.py          # Pydantic schemas for request and response models


Clone the Repository

```bash
git clone git@github.com:PowerPalDev/provisioningServer.git
cd Provisioning_Server
```

Setup the Virtual Environment

``` bash
python -m venv .venv
source .venv/bin/activate  
```

Install Dependencies
```bash
pip install -r requirements.txt
```
Configure Environment Variables

Create a .env file in the project root with the following content, replacing the placeholders with your PostgreSQL credentials:

```bash
DATABASE_URL=postgresql://username:password@localhost/dbname
```
The current DB configuration is available is alembic.ini file.

Initialize the Database

Create a PostgreSQL database as specified in the .env file and Run Alembic migrations to set up the database tables:

```bash
alembic upgrade head
```

Start the FastAPI server:

```bash
uvicorn backend.main:app --reload
```
- The server will be available at http://127.0.0.1:8000.

- http://127.0.0.1:8000/docs - SwaggerUI
- http://127.0.0.1:8000/redoc - FastAPI Redoc


- SwaggerUI
![image](https://github.com/user-attachments/assets/2e63b741-90e7-44d8-978d-abaf0abff5cc)


-FastAPI Redoc
![image](https://github.com/user-attachments/assets/df43436e-1a16-4e18-9924-8db56edaf5c5)



