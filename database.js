const{MongoClient}= require('mongodb')

const database_URI = 'mongodb+srv://saikatghosh5434:D9fZzMlPFbQhgX2I@namastenodejs.ygizgc3.mongodb.net/';

const client = new MongoClient(database_URI);

const dbName = 'HelloWorld';
const connectToDatabase = async () => {
    try {
        await client.connect();
        console.log('Connected to database');
        const db = client.db(dbName);
        const collection = db.collection('User');
        //Insert Data
        const user = { firstName: 'Lipi', lastName: 'MondalGhosh', city: 'Bankura',phoneNumber: '7001303885'}
        const result = await collection.insertOne(user);
        console.log('Inserted document:', result.insertedId);
        // Read the data from the collection
        const data = await collection.find({}).toArray();
        console.log('Data from collection:', data);

        //Delete the data from the collection
        const deleteResult = await collection.deleteMany({ _id: "682a0176d6ba9402db4f789e" }); 
        if (deleteResult.deletedCount === 0) {
            console.log('No documents matched the query. Deleted 0 documents.');
        } else {
            console.log('Deleted document:', deleteResult.deletedCount);
        }
        console.log('Deleted document:', deleteResult.deletedCount);
    } catch (error) {
        console.error('Error connecting to database:', error);
    }
    finally {
        await client.close();
        console.log('Database connection closed');
    }
};

connectToDatabase();