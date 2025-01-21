import redis.asyncio as redis
from motor.motor_asyncio import AsyncIOMotorClient

# Настройки MongoDB
mongo_uri = "mongodb://mongo:HeyufqSNrHrUOvoBEKdJAVANABdfytPb@autorack.proxy.rlwy.net:51943"
#mongo_uri = "mongodb://localhost:27017"
client = AsyncIOMotorClient(mongo_uri)
db = client.consensusChainDB