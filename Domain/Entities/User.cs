using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    [BsonCollection("users")]
    public class User : EntityBase
    {
        [BsonElement("fullName"), BsonRepresentation(BsonType.String)]
        public string FullName { get; set; }

        [BsonElement("password"), BsonRepresentation(BsonType.String)]
        public string Password { get; set; }

        [BsonElement("age"), BsonRepresentation(BsonType.Int64)]
        public int Age { get; set; }

        [BsonElement("email"), BsonRepresentation(BsonType.String)]
        public string Email { get; set; }

        [BsonElement("dateOfBirth"), BsonRepresentation(BsonType.DateTime)]
        public DateTime DateOfBirth { get; set; }

        [BsonElement("createdAt"), BsonRepresentation(BsonType.DateTime)]
        public DateTime CreatedAt { get; set; }

        [BsonElement("updatedAt"), BsonRepresentation(BsonType.DateTime)]
        public DateTime UpdatedAt { get; set; }
    }
}
