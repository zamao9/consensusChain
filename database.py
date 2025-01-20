import redis.asyncio as redis
from motor.motor_asyncio import AsyncIOMotorClient

# Настройки MongoDB
#mongo_uri = "mongodb://adminUser:122Wa2AAA%24%24%24Ffgdfguyh%25%25%24%24ddQQA@142.132.142.248:27017"
mongo_uri = "mongodb://localhost:27017"
client = AsyncIOMotorClient(mongo_uri)
db = client.consensusChainDB