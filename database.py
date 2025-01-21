import redis.asyncio as redis
from motor.motor_asyncio import AsyncIOMotorClient

# Настройки MongoDB
mongo_uri = "mongodb://mongo:eGXKsXnRVStuhEuYYkbAXrYhPNgtWbfr@mongodb.railway.internal:27017"
#mongo_uri = "mongodb://localhost:27017"
client = AsyncIOMotorClient(mongo_uri)
db = client.consensusChainDB