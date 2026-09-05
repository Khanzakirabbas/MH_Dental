var builder = WebApplication.CreateBuilder(args);

// Add Razor Pages services
builder.Services.AddRazorPages();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();

// Serve wwwroot files (css, js, icons, manifest.json, service-worker.js)
app.UseStaticFiles(new StaticFileOptions
{
    // Make sure the service worker is never aggressively cached by the browser/CDN,
    // otherwise PWA updates won't be picked up.
    OnPrepareResponse = ctx =>
    {
        if (ctx.File.Name.Equals("service-worker.js", StringComparison.OrdinalIgnoreCase))
        {
            ctx.Context.Response.Headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
            ctx.Context.Response.Headers["Pragma"] = "no-cache";
            ctx.Context.Response.Headers["Expires"] = "-1";
        }
    }
});

app.UseRouting();

app.UseAuthorization();

app.MapRazorPages();

app.Run();
