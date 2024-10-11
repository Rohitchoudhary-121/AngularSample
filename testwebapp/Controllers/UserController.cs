using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Service;
using Service.ViewModels;

namespace testwebapp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IService<UserViewModel> _service;
        private readonly IUserService _userService;
        public UserController(IService<UserViewModel> service,IUserService  userService)
        {
            _service = service;
            _userService = userService;
        }

        [HttpGet]
        public async Task<IEnumerable<UserViewModel>> Get()
        {
            return new List<UserViewModel>
            {
                new UserViewModel()
                {
                    Id = "",
                    Email = "test@gmail.com",
                    Age = 24,
                    FullName = "Test User",
                    Password ="abc"
                }
            };
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserViewModel>> GetById(string id)
        {
            var user = await _service.GetByIdAsync(id);
            return user is not null ? Ok(user) : NotFound();
        }

        [HttpPost]
        public async Task<ActionResult> Post(UserViewModel user)
        {
            try
            {
                var userEmailCheck = await _userService.SearchFor(x=>x.Email==user.Email);
                if (userEmailCheck.Any())
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, "User with same email already exists!");
                }
                await _service.AddAsync(user);
                return Ok();
            }
            catch(Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");
            }
        }

        [HttpPost("Login")]
        public async Task<ActionResult> Login(LoginUserViewModel creds)
        {
            try
            {
               var user = await _userService.LoginUser(creds);
                return Ok(new {token=user});
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPut]
        public async Task<ActionResult> Update(UserViewModel user)
        {
            await _service.UpdateAsync(user);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(string id)
        {
            try
            {
                await _service.DeleteAsync(id);
                return Ok();
            }
            catch(Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");
            }
        }
    }
}
