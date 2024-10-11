using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    [BsonCollection("products")]
    public class Product : EntityBase
    {
        [BsonElement("productName"), BsonRepresentation(BsonType.String)]
        public string ProductName { get; set; }

        [BsonElement("type"), BsonRepresentation(BsonType.String)]
        public string Type { get; set; }

        [BsonElement("price"), BsonRepresentation(BsonType.String)]
        public int Price { get; set; }

        [BsonElement("quantity"), BsonRepresentation(BsonType.String)]
        public int Quantity { get; set; }
    }
}
