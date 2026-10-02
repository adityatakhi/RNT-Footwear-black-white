export type ProductTone = "chalk" | "volt" | "ember" | "slate";
export type ProductCategory = "Road" | "Court" | "Everyday";

export type Product = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: ProductCategory;
  price: number;
  priceLabel?: string;
  colorway: string;
  tone: ProductTone;
  swatches: Array<{ name: string; tone: ProductTone }>;
  sizes: number[];
  tag?: string;
  description: string;
  details: string[];
  images: string[];
  imageFit?: "cover" | "contain";
  seoTitle?: string;
  seoDescription?: string;
  placeholder: boolean;
};

const photo = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=82`;
const photoSet = [
  photo("photo-1780824946973-ab4e10ec90f6"),
  photo("photo-1780824947013-dc7e01284025"),
  photo("photo-1780824946649-839079583955")
];
const userArtwork = (name: string) => `/campaigns/${name}.jpeg`;

export const products: Product[] = [
  {
    id: "rnt-01", slug: "strata-runner", name: "Strata Runner", subtitle: "Light on the ground. Made for the long way.",
    category: "Road", price: 8490, colorway: "Chalk / Volt", tone: "chalk",
    swatches: [{ name: "Chalk", tone: "chalk" }, { name: "Volt", tone: "volt" }, { name: "Slate", tone: "slate" }],
    sizes: [6, 7, 8, 9, 10, 11], tag: "01 / ROAD",
    description: "A versatile daily runner concept built around a quiet, sculpted profile and a responsive ride.",
    details: ["Engineered mesh upper", "Dual-density foam concept", "Rubber traction outsole"],
    images: photoSet, placeholder: true
  },
  {
    id: "rnt-02", slug: "form-court", name: "Form Court", subtitle: "A cleaner line for every day.",
    category: "Court", price: 7290, colorway: "Bone / Ember", tone: "ember",
    swatches: [{ name: "Ember", tone: "ember" }, { name: "Chalk", tone: "chalk" }, { name: "Slate", tone: "slate" }],
    sizes: [6, 7, 8, 9, 10, 11], tag: "02 / COURT",
    description: "A low-profile court silhouette concept with layered panels and a durable everyday sole.",
    details: ["Synthetic leather concept upper", "Padded collar", "Textured rubber outsole"],
    images: [photoSet[1], photoSet[0], photoSet[2]], placeholder: true
  },
  {
    id: "rnt-03", slug: "drift-one", name: "Drift One", subtitle: "Everyday, with a little more intent.",
    category: "Everyday", price: 6790, colorway: "Slate / Chalk", tone: "slate",
    swatches: [{ name: "Slate", tone: "slate" }, { name: "Volt", tone: "volt" }, { name: "Chalk", tone: "chalk" }],
    sizes: [6, 7, 8, 9, 10, 11], tag: "03 / EVERYDAY",
    description: "An understated lifestyle sneaker concept that balances an easy fit with a distinctive side profile.",
    details: ["Soft-touch textile lining", "Molded midsole concept", "Lace system concept"],
    images: [photoSet[2], photoSet[1], photoSet[0]], placeholder: true
  },
  {
    id: "rnt-04", slug: "pace-prototype", name: "Pace Prototype", subtitle: "Built to find your own pace.",
    category: "Road", price: 9290, colorway: "Volt / Ink", tone: "volt",
    swatches: [{ name: "Volt", tone: "volt" }, { name: "Ember", tone: "ember" }, { name: "Slate", tone: "slate" }],
    sizes: [6, 7, 8, 9, 10, 11], tag: "04 / ROAD",
    description: "A forward-looking performance shoe concept with a bold, graphic midsole and breathable upper.",
    details: ["Open-weave mesh concept upper", "Sculpted foam geometry", "Rubber outsole zones"],
    images: [photoSet[0], photoSet[2], photoSet[1]], placeholder: true
  },
  {
    id: "rnt-aerospace-7-white-navy", slug: "aerospace-7-white-navy-blue", name: "Aerospace 7",
    subtitle: "White and navy blue · Style ka naya roll number", category: "Road", price: 689, priceLabel: "MRP",
    colorway: "White / Navy Blue", tone: "slate", swatches: [{ name: "White / Navy Blue", tone: "slate" }],
    sizes: [6, 7, 8, 9, 10, 11], tag: "AEROSPACE 7", description: "The white and navy blue Aerospace 7 shown in the supplied RNT campaign artwork.",
    details: ["Urban style", "Uncompromising durability", "MRP ₹689, as shown in the artwork"],
    images: [userArtwork("aerospace-7-white-navy")], imageFit: "contain",
    seoTitle: "RNT Aerospace 7 White Navy Blue Sports Shoes", seoDescription: "RNT Aerospace 7 in white and navy blue. MRP ₹689 as shown in the supplied RNT artwork.", placeholder: false
  },
  {
    id: "rnt-aerospace-1-grey-pista", slug: "aerospace-1-grey-pista", name: "Aerospace 1",
    subtitle: "Grey pista · Tech-inspired comfort", category: "Everyday", price: 689, priceLabel: "Special price",
    colorway: "Grey Pista", tone: "chalk", swatches: [{ name: "Grey Pista", tone: "chalk" }],
    sizes: [6, 7, 8, 9, 10, 11], tag: "GREY PISTA", description: "The Aerospace 1 in Grey Pista, shown in the supplied RNT campaign artwork.",
    details: ["Grey Pista colorway", "Special price ₹689, as shown in the artwork"],
    images: [userArtwork("aerospace-1-grey-pista")], imageFit: "contain",
    seoTitle: "RNT Aerospace 1 Grey Pista Sports Shoes", seoDescription: "RNT Aerospace 1 in Grey Pista. Special price ₹689 as shown in the supplied RNT artwork.", placeholder: false
  },
  {
    id: "rnt-aerospace-1-bk", slug: "aerospace-1-bk", name: "Aerospace 1 BK",
    subtitle: "Black and olive · Ergo-fit design", category: "Road", price: 689, priceLabel: "MRP",
    colorway: "Black / Olive", tone: "slate", swatches: [{ name: "Black / Olive", tone: "slate" }],
    sizes: [6, 7, 8, 9, 10, 11], tag: "AEROSPACE 1 BK", description: "Aerospace 1 BK as shown in the supplied black and olive RNT campaign artwork.",
    details: ["Ergo-fit design", "Multi-grip sole", "Breathable mesh", "MRP ₹689, as shown in the artwork"],
    images: [userArtwork("aerospace-1-bk")], imageFit: "contain",
    seoTitle: "RNT Aerospace 1 BK Black Olive Sports Shoes", seoDescription: "RNT Aerospace 1 BK in black and olive. MRP ₹689 as shown in the supplied RNT artwork.", placeholder: false
  },
  {
    id: "rnt-stryder-3-black-black", slug: "stryder-3-black-black", name: "Stryder 3",
    subtitle: "Black on black · Sports style", category: "Everyday", price: 712, priceLabel: "MRP",
    colorway: "Black / Black", tone: "slate", swatches: [{ name: "Black / Black", tone: "slate" }],
    sizes: [6, 7, 8, 9, 10, 11], tag: "STRYDER 3", description: "Stryder 3 in Black / Black, as shown in the supplied RNT artwork.",
    details: ["Black / Black colorway", "MRP ₹712, as shown in the artwork"],
    images: [userArtwork("stryder-3-black-black")], imageFit: "contain",
    seoTitle: "RNT Stryder 3 Black Sports Shoes", seoDescription: "RNT Stryder 3 in Black / Black. MRP ₹712 as shown in the supplied RNT artwork.", placeholder: false
  }
];

export const getProduct = (slug: string) => products.find((product) => product.slug === slug);
export const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);
