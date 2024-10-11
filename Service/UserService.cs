using Domain.Entities;
using Domain.Repository;
using Service.ViewModels;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;
using System.Linq.Expressions;
using Microsoft.Extensions.Configuration;

namespace Service
{
    public interface IUserService
    {
        Task<string> LoginUser(LoginUserViewModel creds);
        Task<IList<User>> SearchFor(Expression<Func<User, bool>> predicate);
    }
    public class UserService : IService<UserViewModel>,IUserService
    {
        private readonly IRepository<User> _repository;
        private readonly IConfiguration _config;
        public UserService(IRepository<User> repository,IConfiguration config)
        {
            _repository = repository;
            _config = config;
        }
        public async Task AddAsync(UserViewModel entity)
        {
            var hashedPassword = Encrypt(entity.Password);
            User user = new User
            {
                Id = "",
                FullName = entity.FullName,
                Password = hashedPassword,
                Age = entity.Age,
                Email = entity.Email,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            await _repository.Insert(user);
        }

        public async Task DeleteAsync(string id)
        {
            await _repository.Delete(id);
        }

        public async Task<IEnumerable<UserViewModel>> GetAllAsync()
        {
            var result = await _repository.GetAll();
            return result.Select(x => new UserViewModel
            {
                Id = x.Id,
                FullName = x.FullName,
                Age = x.Age,
                Email = x.Email,
            }).ToList();
        }

        public async Task<UserViewModel> GetByIdAsync(string id)
        {
            var result = await _repository.GetById(id);
            return new UserViewModel
            {
                Id = result.Id,
                FullName = result.FullName,
                Age = result.Age,
                Email = result.Email
            };
        }

        public async Task UpdateAsync(UserViewModel entity)
        {
            User user = new User
            {
                Id = entity.Id,
                FullName = entity.FullName,
                Age = entity.Age,
                Email = entity.Email,
                UpdatedAt = DateTime.Now
            };
            await _repository.Update(user);
        }

        public async Task<string> LoginUser(LoginUserViewModel creds)
        {
            var user = await _repository.SearchFor(x => x.Email == creds.Email);
            if (user.FirstOrDefault() == null)
            {
                return null;
            }

            var decryptPassword = Decrypt(user.FirstOrDefault().Password);
            if (decryptPassword != creds.Password)
            {
                return null;
            }

            // Generate JWT token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_config.GetSection("JWTSettings").GetSection("secretKey").Value);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
            new Claim(ClaimTypes.Name, user.FirstOrDefault().Email),
            // You can add more claims here if needed
        }),
                Expires = DateTime.UtcNow.AddMinutes(60), // Set expiration as configured
                Issuer = _config.GetSection("JWTSettings").GetSection("issuer").Value,
                Audience = _config.GetSection("JWTSettings").GetSection("audience").Value,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private string Encrypt(string clearText)
        {
            string encryptionKey = "MAKV2SPBNI99212";
            byte[] clearBytes = Encoding.Unicode.GetBytes(clearText);
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(encryptionKey, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });
                encryptor.Key = pdb.GetBytes(32);
                encryptor.IV = pdb.GetBytes(16);
                using (MemoryStream ms = new MemoryStream())
                {
                    using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateEncryptor(), CryptoStreamMode.Write))
                    {
                        cs.Write(clearBytes, 0, clearBytes.Length);
                        cs.Close();
                    }
                    clearText = Convert.ToBase64String(ms.ToArray());
                }
            }

            return clearText;
        }

        private string Decrypt(string cipherText)
        {
            string encryptionKey = "MAKV2SPBNI99212";
            byte[] cipherBytes = Convert.FromBase64String(cipherText);
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(encryptionKey, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });
                encryptor.Key = pdb.GetBytes(32);
                encryptor.IV = pdb.GetBytes(16);
                using (MemoryStream ms = new MemoryStream())
                {
                    using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateDecryptor(), CryptoStreamMode.Write))
                    {
                        cs.Write(cipherBytes, 0, cipherBytes.Length);
                        cs.Close();
                    }
                    cipherText = Encoding.Unicode.GetString(ms.ToArray());
                }
            }

            return cipherText;
        }

        public async Task<IList<User>> SearchFor(Expression<Func<User, bool>> predicate)
        {
            return await _repository.SearchFor(predicate);
        }
    }
}
