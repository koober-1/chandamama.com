import fs from "fs";
import path from "path";

const ABOUT_IMAGE_PATH =
  "C:\\Users\\USER\\.gemini\\antigravity-ide\\brain\\10e08330-4b31-4963-8c21-d4c0eccee937\\chandamama_banner_1790657106582.jpg";
const CONTACT_IMAGE_PATH =
  "C:\\Users\\USER\\.gemini\\antigravity-ide\\brain\\10e08330-4b31-4963-8c21-d4c0eccee937\\chandamama_contact_1790657557075.jpg";

export default function handler(req, res) {
  try {
    const type = req.query.type || "about";
    const destDir = path.join(process.cwd(), "public", "banners");
    const filename = type === "contact" ? "chandamama_contact_banner.jpg" : "chandamama_banner.jpg";
    const destFile = path.join(destDir, filename);
    const sourcePath = type === "contact" ? CONTACT_IMAGE_PATH : ABOUT_IMAGE_PATH;

    if (fs.existsSync(sourcePath)) {
      const imgBuffer = fs.readFileSync(sourcePath);

      // Cache into public/banners
      try {
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }
        if (!fs.existsSync(destFile)) {
          fs.writeFileSync(destFile, imgBuffer);
        }
      } catch (err) {
        console.error("Error caching banner image:", err);
      }

      res.setHeader("Content-Type", "image/jpeg");
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      return res.send(imgBuffer);
    }

    // Fallback to existing banner if generated image is unavailable
    const fallbackPath = path.join(process.cwd(), "public", "banners", "hero_banner.jpg");
    if (fs.existsSync(fallbackPath)) {
      const fallbackBuffer = fs.readFileSync(fallbackPath);
      res.setHeader("Content-Type", "image/jpeg");
      return res.send(fallbackBuffer);
    }

    return res.status(404).send("Banner not found");
  } catch (error) {
    console.error("Banner image handler error:", error);
    return res.status(500).send("Internal Server Error");
  }
}
