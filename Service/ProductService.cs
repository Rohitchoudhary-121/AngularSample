using Domain.Entities;
using Domain.Repository;
using Service.ViewModels;
using SharpCompress.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service
{
    public class ProductService : IService<ProductViewModel>
    {
        private readonly IRepository<Product> _repository;
        public ProductService(IRepository<Product> repository)
        {
            _repository = repository;
        }
        public async Task AddAsync(ProductViewModel entity)
        {
            Product product = new Product
            {
                Id = "",
                ProductName = entity.ProductName,
                Price = entity.Price,
                Quantity = entity.Quantity,
                Type = entity.Type
            };
             await _repository.Insert(product);
        }

        public async Task DeleteAsync(string id)
        {
            await _repository.Delete(id);
        }

        public async Task<IEnumerable<ProductViewModel>> GetAllAsync()
        {
            var result = await _repository.GetAll();
            return result.Select(x => new ProductViewModel
            {
                Id = x.Id,
                ProductName = x.ProductName,
                Price = x.Price,
                Quantity = x.Quantity,
                Type = x.Type
            }).ToList();
        }

        public async Task<ProductViewModel> GetByIdAsync(string id)
        {
            var result = await _repository.GetById(id);
            return new ProductViewModel
            {
                Id = result.Id,
                ProductName = result.ProductName,
                Price = result.Price,
                Quantity = result.Quantity,
                Type = result.Type
            };
        }

        public async Task UpdateAsync(ProductViewModel entity)
        {
            Product user = new Product
            {
                Id = entity.Id,
                ProductName = entity.ProductName,
                Price = entity.Price,
                Quantity = entity.Quantity,
                Type = entity.Type
            };
            await _repository.Update(user);
        }
    }
}
