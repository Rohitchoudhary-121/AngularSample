using Domain.Entities;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Repository
{
    public class Repository<TEntity> : IRepository<TEntity>
        where TEntity : EntityBase
    {
        private readonly IMongoCollection<TEntity> _entity;
        public Repository(DbContext service)
        {
            _entity = service.Database.GetCollection<TEntity>(GetCollectionName(typeof(TEntity)));
        }

        private protected string GetCollectionName(Type documentType)
        {
            return ((BsonCollectionAttribute)documentType.GetCustomAttributes(
                    typeof(BsonCollectionAttribute),
                    true)
                .FirstOrDefault())?.CollectionName;
        }
        public async Task Delete(string id)
        {
            var filter = Builders<TEntity>.Filter.Eq(x => x.Id, id);
            await _entity.DeleteOneAsync(filter);
        }

        public async Task<IList<TEntity>> GetAll()
        {
            return await _entity.Find(FilterDefinition<TEntity>.Empty).ToListAsync();
        }

        public async Task<TEntity> GetById(string id)
        {
            var filter = Builders<TEntity>.Filter.Eq(x => x.Id,id);
            var entityById = await _entity.Find(filter).FirstOrDefaultAsync();
            return entityById;
        }

        public async Task Insert(TEntity entity)
        {
            await _entity.InsertOneAsync(entity);
        }

        public async Task<IList<TEntity>> SearchFor(Expression<Func<TEntity, bool>> predicate)
        {
            var results = await _entity.FindAsync(predicate);
            return results.ToList();
        }

        public async Task Update(TEntity entity)
        {
            var filter = Builders<TEntity>.Filter.Eq(x => x.Id, entity.Id);
            await _entity.ReplaceOneAsync(filter, entity);
        }
    }
}
