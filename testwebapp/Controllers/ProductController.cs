using Microsoft.AspNetCore.Mvc;
using Service.ViewModels;
using Service;
using Microsoft.AspNetCore.Authorization;

namespace testwebapp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IService<ProductViewModel> _service;
        public ProductController(IService<ProductViewModel> service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IEnumerable<ProductViewModel>> Get()
        {
            return await _service.GetAllAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductViewModel>> GetById(string id)
        {
            var user = await _service.GetByIdAsync(id);
            return user is not null ? Ok(user) : NotFound();
        }

        [HttpPost]
        public async Task<ActionResult> Post(ProductViewModel user)
        {
            try
            {
                await _service.AddAsync(user);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");
            }
        }

        [HttpPut]
        public async Task<ActionResult> Update(ProductViewModel user)
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
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");
            }
        }
    }
}
