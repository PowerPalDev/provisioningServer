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
