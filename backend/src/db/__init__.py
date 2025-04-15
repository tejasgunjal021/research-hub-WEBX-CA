from flask_pymongo import PyMongo

mongo = PyMongo()

def init_db(app):
    mongo.init_app(app)
    try:
        db_host = mongo.cx.address[0]
        print(f"\n✅ MongoDB connected!! DB HOST: {db_host}")
    except Exception as e:
        print("❌ Error in DB connection:", e)
        exit(1)

    return mongo
