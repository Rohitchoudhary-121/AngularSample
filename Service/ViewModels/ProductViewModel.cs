using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.ViewModels
{
    public class ProductViewModel
    {
        public string Id { get; set; }
        public string ProductName { get; set; }
        public string Type { get; set; }
        public int Price { get; set; }
        public int Quantity { get; set; }
    }
}
