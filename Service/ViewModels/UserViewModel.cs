using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.ViewModels
{
    public class UserViewModel 
    {
        public string Id { get; set; }
        public string FullName { get; set; }
        public string Password { get; set; }
        public int Age { get; set; }
        public string Email { get; set; }
    }
}
