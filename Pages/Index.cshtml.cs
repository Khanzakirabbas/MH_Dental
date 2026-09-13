using Microsoft.AspNetCore.Mvc.RazorPages;

namespace MHDental.Pages;

public class IndexModel : PageModel
{
    public record Category(string Name, string ImageUrl);
    public record Product(string Name, string Price, string ImageUrl);
    public record Partner(string Name, string LogoUrl);
    public record EventItem(string Day, string Month, string Title, string Location, string ImageUrl);
    public record Testimonial(string PhotoUrl, string Name, string Clinic, string Quote);
    public record HeroSlide(string ImageUrl, string Alt);

    // NOTE ON IMAGE SOURCES
    // ----------------------
    // Category/product/event photos below are REAL dental & clinical photography
    // sourced from Pexels (free stock photos, Pexels License: free for commercial
    // and personal use, no attribution required - https://www.pexels.com/license/).
    // A few categories (intraoral scanner, LED curing light, ultrasonic scaler,
    // compressor/suction) don't have an exact literal photo on Pexels, so the
    // closest genuinely dental/clinical photo was used instead (e.g. a dental
    // handpiece or dental office shot) rather than falling back to unrelated
    // stock photography. Swap any of these for your own product photography
    // whenever you have it - that's always the best long-term option.
    //
    // Partner "logos" still use placehold.co text badges - real trademarked
    // logos (KaVo, Dürr Dental, NSK, etc.) are each company's registered IP and
    // can't be sourced/embedded here without their permission.
    // Testimonial avatars still use pravatar.cc generic placeholder headshots.

    private const string PexelsBase = "https://images.pexels.com/photos";
    private static string Pexels(int id, int w = 400, int h = 300) =>
        $"{PexelsBase}/{id}/pexels-photo-{id}.jpeg?auto=compress&cs=tinysrgb&w={w}&h={h}&fit=crop";

    // Hero banner slides - local photos in wwwroot/images (1.jpg-4.jpg).
    // Add/remove entries here to change how many slides the hero shows;
    // the dots and arrows in Index.cshtml/site.js follow this list automatically.
    public List<HeroSlide> HeroSlides { get; } = new()
    {
        new("~/images/1.jpg", "MH Dental clinic interior"),
        new("~/images/2.jpg", "MH Dental event booth"),
        new("~/images/3.jpg", "MH Dental equipment showcase"),
        new("~/images/4.jpg", "MH Dental exhibition stand"),
    };

    public List<Category> Categories { get; } = new()
    {
        new("Dental Chairs", "~/images/Chair/C1.jpg"),
        new("Autoclaves & Sterilizers", "~/images/Chair/S2.jpg"),
        new("Intraoral Scanners", "~/images/Chair/3.jpg"),
        new("Dental X-Ray", "~/images/Chair/4.jpg"),
        new("Dental Instruments", "~/images/Chair/5.jpg"),
        new("LED Curing Lights", "~/images/Chair/6.jpg"),
        new("Ultrasonic Scalers", "~/images/Chair/7.jpg"),
        new("Compressors & Suction Units", "~/images/Chair/8.jpg"),
    };

    public List<Product> HotProducts { get; } = new()
    {
        new("Dental Chair Unit Premium Comfort", "", "~/images/HotProducts/1.jpg"),
        new("Autoclave Sterilizer 23L Class B", "", "~/images/HotProducts/2.jpg"),
        new("Intraoral Scanner Wireless", "", "~/images/HotProducts/3.jpg"),
        new("LED Dental Light Shadowless", "", "~/images/HotProducts/4.jpg"),
        new("Ultrasonic Scaler With LED", "", "~/images/HotProducts/5.jpg"),
        new("Dental Compressor Silent 50L", "", "~/images/HotProducts/6.jpg"),
        new("Digital X-Ray Sensor HD", "", "~/images/HotProducts/7.jpg"),
    };

    public List<Partner> Partners { get; } = new()
    {
        new("KAVO", "~/images/Brands/1.jpg"),
        new("DURR DENTAL", "~/images/Brands/2.jpg"),
        new("W&H", "~/images/Brands/4.jpg"),
        new("NSK", "~/images/Brands/7.jpg"),
        new("COLTENE", "~/images/Brands/5.jpg"),
        new("WOODPECKER", "~/images/Brands/6.jpg"),
    };

    public List<EventItem> UpcomingEvents { get; } = new()
    {
        new("10", "JUN", "Dental Expo Mumbai 2025", "NESCO, Mumbai", Pexels(6627827, 120, 120)),
        new("18", "JUN", "IDS Exhibition 2025", "Cologne, Germany", Pexels(4269497, 120, 120)),
        new("25", "JUN", "Dental Conference Delhi 2025", "Pragati Maidan, Delhi", Pexels(6812484, 120, 120)),
    };

    public List<Testimonial> Testimonials { get; } = new()
    {
        new("https://i.pravatar.cc/100?img=12", "Dr. Rahul Sharma", "Dental Clinic, Mumbai", "Excellent quality products and outstanding service. Highly recommended!"),
        new("https://i.pravatar.cc/100?img=47", "Dr. Priya Mehta", "Smile Care, Pune", "MH Dental provides the best after-sales support. Very satisfied with their service."),
        new("https://i.pravatar.cc/100?img=33", "Dr. Amit Verma", "Verma Dental, Delhi", "Wide range of dental equipment under one roof. Great experience!"),
        new("https://i.pravatar.cc/100?img=5", "Dr. Sneha Kulkarni", "Bright Smiles, Bengaluru", "Fast delivery and genuine products. MH Dental is now our go-to supplier."),
    };

    public void OnGet()
    {
    }
}
