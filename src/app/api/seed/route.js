// app/api/seed/route.js
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Post from "@/models/Post";
import { hashPassword } from "@/lib/auth";

function slugifyHindi(str = "") {
  return str.toString().trim().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9\u0900-\u097F-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g,"").toLowerCase().slice(0,160);
}
function slugifyEnglish(str = "") {
  return str.toString().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").trim().replace(/[^a-zA-Z0-9]+/g,"-").replace(/-+/g,"-").replace(/^-|-$/g,"").toLowerCase().slice(0,160);
}

const sample = [
  {
    category_hi: "धर्म", category_en: "Religion",
    title_hi: "वैष्णो देवी मेडिकल कॉलेज: अनुदान पर विवाद",
    title_en: "Vaishno Devi Medical College: Grant Controversy",
    excerpt_hi: "वैष्णो देवी विश्वविद्यालय को सरकार से मिली अनुदान राशि पर रिपोर्ट...",
    excerpt_en: "Documents show Vaishno Devi university received grants from the government...",
    description_hi: "<p>श्रीनगर: भारतीय जनता पार्टी (भाजपा) और हिंदू दक्षिणपंथी समूह ...</p>",
    description_en: "<p>Srinagar: BJP and right-wing groups claimed..., but documents show...</p>",
    tags: ["धर्म","news"], featured: true, trending: false,
  },
  {
    category_hi: "ऑटो", category_en: "Auto",
    title_hi: "मारुति की Fronx और Baleno पर बड़ा डिस्काउंट",
    title_en: "Big Discounts on Maruti Fronx and Baleno",
    excerpt_hi: "मारुति के कुछ मॉडलों पर बड़े डिस्काउंट दिए जा रहे हैं...",
    excerpt_en: "Big discounts announced on selected Maruti models this December...",
    description_hi: "<p>धमाकेदार ऑफर्स का मौसम...</p>",
    description_en: "<p>Discount season arrived for car buyers...</p>",
    tags: ["auto","deals"], featured: true, trending: true,
  },
  // 13 more posts following similar structure...
];

// create 15 posts by cloning and minor changes
for (let i = 3; i <= 15; i++) {
  const base = {
    category_hi: i % 3 === 0 ? "खेल" : i % 3 === 1 ? "टेक" : "लाइफस्टाइल",
    category_en: i % 3 === 0 ? "Sports" : i % 3 === 1 ? "Tech" : "Lifestyle",
    title_hi: `नमूना पोस्ट शीर्षक ${i}`,
    title_en: `Sample Post Title ${i}`,
    excerpt_hi: `यह एक नमूना सारांश है ${i}...`,
    excerpt_en: `This is a sample excerpt ${i}...`,
    description_hi: `<p>यह पोस्ट #${i} के लिए हिंदी सामग्री है।</p>`,
    description_en: `<p>This is English content for post #${i}.</p>`,
    tags: ["sample","demo"],
    featured: i % 5 === 0,
    trending: i % 4 === 0,
  };
  sample.push(base);
}

export async function POST(req) {
  await connectDB();
  try {
    // create users if not exist
    const adminEmail = "admin@site.com";
    const writerEmail = "writer@site.com";
    const readerEmail = "reader@site.com";

    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({ name: "Admin", email: adminEmail, password: await hashPassword("admin123"), role: "admin" });
    }
    let writer = await User.findOne({ email: writerEmail });
    if (!writer) {
      writer = await User.create({ name: "Writer", email: writerEmail, password: await hashPassword("writer123"), role: "writer" });
    }
    let reader = await User.findOne({ email: readerEmail });
    if (!reader) {
      reader = await User.create({ name: "Reader", email: readerEmail, password: await hashPassword("reader123"), role: "reader" });
    }

    // only seed posts if none exist
    const existingCount = await Post.countDocuments();
    if (existingCount > 0) {
      return new Response(JSON.stringify({ message: "Already seeded", count: existingCount }), { status: 200 });
    }

    // create posts
    const created = [];
    for (let i = 0; i < sample.length; i++) {
      const s = sample[i];
      const slug_hi = s.title_hi ? slugifyHindi(s.title_hi) : null;
      const slug_en = s.title_en ? slugifyEnglish(s.title_en) : null;

      const post = await Post.create({
        title_hi: s.title_hi || "",
        title_en: s.title_en || "",
        slug_hi,
        slug_en,
        category_hi: s.category_hi || "",
        category_en: s.category_en || "",
        excerpt_hi: s.excerpt_hi || "",
        excerpt_en: s.excerpt_en || "",
        description_hi: s.description_hi || "",
        description_en: s.description_en || "",
        image: `https://picsum.photos/seed/seed${i}/1200/800`,
        tags: s.tags || [],
        featured: !!s.featured,
        trending: !!s.trending,
        author: i % 2 === 0 ? admin._id : writer._id,
      });
      created.push(post);
    }

    return new Response(JSON.stringify({ message: "Seeded", postsCreated: created.length }), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
