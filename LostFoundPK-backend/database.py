import logging
from motor.motor_asyncio import AsyncIOMotorClient
from config import settings
import certifi

logger = logging.getLogger("uvicorn.error")

class DatabaseHelper:
    def __init__(self):
        self.client: AsyncIOMotorClient = None
        self.db = None

db_helper = DatabaseHelper()

async def connect_to_mongo():
    logger.info("Connecting to MongoDB...")
    try:
        db_helper.client = AsyncIOMotorClient(
            settings.MONGO_URI,
            tlsAllowInvalidCertificates=True,
        )
        db_helper.db = db_helper.client[settings.MONGO_DB_NAME]
        
        # Ping the database to verify connection
        await db_helper.client.admin.command('ping')
        logger.info("Successfully connected to MongoDB Atlas!")
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB Atlas: {e}")
        raise e

async def close_mongo_connection():
    if db_helper.client:
        logger.info("Closing MongoDB connection...")
        db_helper.client.close()
        logger.info("MongoDB connection closed.")
