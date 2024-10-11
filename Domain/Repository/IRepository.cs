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
    public  interface IRepository<TEntity> where TEntity : EntityBase
    {
        Task Delete(string id);
        Task<IList<TEntity>> GetAll();
        Task<TEntity> GetById(string id);
        Task Insert(TEntity entity);
        Task<IList<TEntity>> SearchFor(Expression<Func<TEntity, bool>> predicate);
        Task Update(TEntity entity);
    }
}
