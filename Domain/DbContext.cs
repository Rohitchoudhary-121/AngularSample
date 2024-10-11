using Microsoft.Extensions.Configuration;
using MongoDB.Driver;

namespace Domain
{
    public class DbContext
    {
        private readonly IConfiguration _config;
        private readonly IMongoDatabase _database;
        public DbContext(IConfiguration config)
        {
            _config = config;
            var connectionString = _config.GetConnectionString("default");
            var mongoUrl = MongoUrl.Create(connectionString);
            var mongoClient = new MongoClient(mongoUrl);
            _database = mongoClient.GetDatabase(mongoUrl.DatabaseName);
        }

        public IMongoDatabase Database => _database;
    }
}