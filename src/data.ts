/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Testimonial, FAQItem, DetailingTip, DetailingService } from "./types";

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "iDETAIL HydroGloss Hybrid Wax",
    price: 550,
    category: "exterior",
    categoryLabel: "Exterior Care",
    icon: "✨",
    image: "/src/assets/images/idetail_liquid_wax_bottle_1780686811371.png",
    description: "Premium synthetic wax blend delivering deep wet-look gloss and ultimate water-beading performance.",
    fullDescription: "HydroGloss is engineered with fused carnauba wax and advanced liquid polymer sealants. It fills minor swirling while forming a robust, clear shell over your topcoat. This defensive layer stands up to harsh UV radiation, acid rain, and road dirt for up to 6 months.",
    rating: 4.8,
    reviewsCount: 142,
    benefits: [
      "Deep, reflective carnauba-like gloss and mirror finish",
      "Stops water spots through intense hydrophobic action",
      "Shields surfaces from fading caused by UV light",
      "Wipes on and buffs off cleanly without chalky residue"
    ],
    instructions: "Apply 3-4 nickel-sized drops to a foam applicator. Spread thin, even layers over a clean, cool, dry panel. Let cure for 5-10 minutes until a light haze forms, then buff with a premium 450GSM microfiber towel to reveal a deep wet shine.",
    size: "16 oz",
    inStock: true,
    isFeatured: true
  },
  {
    id: 2,
    name: "iDETAIL Nano Shield Ceramic Kit 9H+",
    price: 1650,
    category: "ceramic",
    categoryLabel: "Ceramic Coatings",
    icon: "🛡️",
    image: "/src/assets/images/idetail_ceramic_coating_1780686827012.png",
    description: "Professional military-grade SiO2 coating package supplying up to 2 years of glass-hard protection.",
    fullDescription: "Nano Shield 9H+ represents the absolute apex of paint molecular security. It creates a semi-permanent ceramic bond with your automotive clearcoat, creating an ultra-slick barrier that shrugs off chemical etching, salt-spray oxidation, and fine swirl abrasions. Includes professional suede applicators and premium microfiber kit.",
    rating: 4.9,
    reviewsCount: 94,
    benefits: [
      "True 9H+ Mohs hardness for extreme scratch resistance",
      "Unmatched self-cleaning properties; dirt runs off in rain",
      "A single application lasts up to 24 full months",
      "Protects from environmental industrial fallouts & bird droppings"
    ],
    instructions: "Detail, clay, and polish your paint until flawless. Perform an isopropyl alcohol wipe. Apply 8-10 drops of ceramic coating to the suede wrapped applicator. Work in tiny 2x2 ft cross-hatch sections. Wait 1-2 minutes for 'flashing' (rainbow reflection), then level gently with the first microfiber towel and polish with a second.",
    size: "50 ml Kit",
    inStock: true,
    isFeatured: true
  },
  {
    id: 3,
    name: "iDETAIL Interior Revive Clean & Protect",
    price: 370,
    category: "interior",
    categoryLabel: "Interior Detail",
    icon: "💺",
    image: "/src/assets/images/idetail_interior_spray_1780686839935.png",
    description: "Non-greasy interior dressing that lifts dust and restores a factory-fresh satin sheen to panels.",
    fullDescription: "Give dry, faded vinyl, leatherette, and plastics their factory look back. Interior Revive uses zero greasy silicone, instead hydrating plastic substrates with botanical and technical skin moisturizers. Leftover polymers create a dry-touch microfilm containing broad-spectrum SPF absorbers to stop cracking.",
    rating: 4.7,
    reviewsCount: 220,
    benefits: [
      "Completely dry-to-the-touch satin formula; never slimy",
      "Powerful anti-static dust repellents keep cabin clean longer",
      "High UV blocking filters prevent yellowing, cracking, and chalking",
      "Sophisticated, genuine clean-car scent"
    ],
    instructions: "Vacuum interior thoroughly. Spray directly onto a microfiber applicator pad. Massage into dashboards, door cards, and steering columns. Buff off excess instantly with a clean dry microfiber towel. Ensure complete even absorption.",
    size: "16 oz",
    inStock: true,
    isFeatured: true
  },
  {
    id: 4,
    name: "iDETAIL Pro-Weave Edgeless Towels (10ct)",
    price: 460,
    category: "accessories",
    categoryLabel: "Accessories",
    icon: "🧼",
    image: "/src/assets/images/idetail_towels_1780687102000_1780687411249.png",
    description: "Dense 450GSM scratch-free microfiber drying and buffing towels constructed without hard hems.",
    fullDescription: "Avoid microscopic swirl lines during your detail work. These core buffers utilize an ultra-premium Korean split microfiber weave in an edgeless, ultrasonic-cut format. Durable up to 100 washes while retaining fluffy thickness and immediate water hydration capacity.",
    rating: 4.6,
    reviewsCount: 310,
    benefits: [
      "Ultrasonic cut borders completely remove hard nylon seams",
      "Plush dual-sided pile absorbs liquids 10x its weight",
      "Safe to buff over sensitive paint, soft clearcoats, and high-gloss wood",
      "Lint-free chemical structural weave"
    ],
    instructions: "Always wash microfiber separately from standard clothing. Use liquid detergent (no fabric softeners). Dry on zero-heat air fluff settings. Use one side of towel for compound leveling and fold to fresh side for final mirror shine buffing.",
    size: "10-Pack (16\"x16\")",
    inStock: true,
    isFeatured: false
  },
  {
    id: 5,
    name: "iDETAIL Ultra-Suds Neutral Snow Foam",
    price: 295,
    category: "exterior",
    categoryLabel: "Exterior Care",
    icon: "🫧",
    image: "/src/assets/images/idetail_shampoo_bottle_1780686794337.png",
    description: "Super-concentrated car wash soap designed to produce mounds of clingy dirt-grabbing foam.",
    fullDescription: "Clean your car without compromising delicate pre-existing wax protectants or ceramic layers. Ultra-Suds is a balanced pH-neutral shampoo designed specifically for foam guns, foam cannons, and bucket washing. Safe, synthetic lubricants detach mud without micro-scratching pristine panels.",
    rating: 4.8,
    reviewsCount: 184,
    benefits: [
      "Hyper-concentrated formula yields extreme foam density",
      "Absolutely pH neutral—safe on wax, sealants and ceramics",
      "Superb lubrication lubricates the wash mitt to avoid swirls",
      "Eco-friendly, completely biodegradable formula"
    ],
    instructions: "For foam cannons, mix 2-3 ounces of shampoo with dry water in the cannon reservoir. Spray thick foam starting from wheels up to the roof. Let stand for 3 minutes to lift grime. For buckets, use 1-2 ounces in a 5-gallon wash system.",
    size: "32 oz",
    inStock: true,
    isFeatured: false
  },
  {
    id: 6,
    name: "iDETAIL Apex Iron & Decontamination Spray",
    price: 415,
    category: "exterior",
    categoryLabel: "Exterior Care",
    icon: "🛞",
    image: "/src/assets/images/idetail_wheel_cleaning_spray_1780686853478.png",
    description: "Color-changing chemistry that safely attacks embedded iron brake dust on contact.",
    fullDescription: "Brake dust and industrial metallic fallout quickly lock onto your paint and wheels, rusting under humidity. Apex Fallout neutralizes these particles. Our advanced formula melts embedded iron, indicators turn deep bleeding-purple on contact to prove the chemical decontamination process is working.",
    rating: 4.9,
    reviewsCount: 112,
    benefits: [
      "Fast-acting color indicator reveals active fallout dissolution",
      "Specially thick viscosity clings to vertical wheel and side panels",
      "pH-balanced; friendly to raw alloy, coated steel, and plastics",
      "Saves hours compared to exhausting clay decontamination"
    ],
    instructions: "Ensure wheels and paint are cool to touch. Spray fully across wheel or lower paint panels. Allow 3-4 minutes to chemical react and bleed bright purple. agitation using a wheel brush is recommended for severe baked brake dust. Rinse thoroughly with high-pressure hose.",
    size: "16 oz",
    inStock: true,
    isFeatured: false
  },
  {
    id: 7,
    name: "iDETAIL Leather Nourish Organic Cream",
    price: 350,
    category: "interior",
    categoryLabel: "Interior Detail",
    icon: "🪵",
    image: "/src/assets/images/idetail_leather_conditioner_1780686884214.png",
    description: "Pure beeswax and aloe-infused high conditioning cream to preserve genuine luxury leather.",
    fullDescription: "Keep your luxury leather soft and supple. Leather Nourish targets pores, supplying natural moisturizers that stop drying, heat cracks, and scuffing. Leaves a dry-touch modern satin coat that highlights natural grain and adds a wonderful scent.",
    rating: 4.7,
    reviewsCount: 88,
    benefits: [
      "Beeswax barrier halts color rub-off and oil stains",
      "Aloe infusions keep leather pliable, restoring elastic spring",
      "Leaves zero glossy residue or slippery sheen",
      "Restores authentic luxury leather scent"
    ],
    instructions: "Clean leather with an interior brush first. Dot a quarter-sized amount of cream on a soft applicator. Work thoroughly across leather seams in light circular orbits. Let absorb for 15 minutes, then buff with a soft edgeless cloth.",
    size: "8 oz",
    inStock: true,
    isFeatured: false
  },
  {
    id: 8,
    name: "iDETAIL CrystalClear Rain Shield Booster",
    price: 275,
    category: "exterior",
    categoryLabel: "Exterior Care",
    icon: "🌧️",
    image: "/src/assets/images/idetail_glass_spray_1780686901922.png",
    description: "Slick glass sealant that beads rain in extreme storms, dramatically improving driving visibility.",
    fullDescription: "Do not let poor window visibility blind you during violent downpours. CrystalClear leaves an immediate friction-reducing fluoropolymer shield on windshields, sunroofs, and side glass. Water instantly rounds into beads and flies off at speeds over 35mph.",
    rating: 4.8,
    reviewsCount: 130,
    benefits: [
      "Water droplets slide off instantly, removing rain blur",
      "Keeps bug spots, tree sap, and windshield frost from sticking",
      "Eliminates windshield wiper shuddering and squeaking",
      "A single quick spray defends glass for up to 30 days"
    ],
    instructions: "Deep clean glass fully and remove residue. Spray fine mist on microfiber towel, wipe evenly to complete haze. Let dry for 2 minutes. Buff clean with damp microfiber, then dry off with glass waffle towel for zero-streak clarity.",
    size: "12 oz",
    inStock: true,
    isFeatured: false
  },
  {
    id: 9,
    name: "iDETAIL Apex Wheel & Tire Catalyst Gel",
    price: 325,
    category: "exterior",
    categoryLabel: "Exterior Care",
    icon: "🏎️",
    image: "/src/assets/images/idetail_wheel_cleaning_spray_1780686853478.png",
    description: "Thick clinging wash gel designed to strip heavy grease, stubborn mud, and tire browning.",
    fullDescription: "Tire sidewalls brown and decay due to antiozonants blooming. Catalyst Gel strips away old tire shine, road oils, and mud, preparing tyre rubbers for clean, uniform dressing absorption. The heavy clinging formulation ensures maximum surface contact time to loosen grease.",
    rating: 4.5,
    reviewsCount: 67,
    benefits: [
      "Strips brown oxidation blooming off tire rubbers instantly",
      "Sticks to wheel walls to break down stubborn road mud",
      "Prepares rubber so dressings soak deeper and stay longer",
      "Deeply cleans wheel chambers, rims, and tire walls"
    ],
    instructions: "Rinse tires with water. Spray Catalyst Gel onto tire treads and sidewalls. Let sit for 1 minute. Use a stiff tire scrub brush to scrub side walls; foam should turn brown. Rinse wheels and tires using pressurized water.",
    size: "16 oz",
    inStock: true,
    isFeatured: false
  },
  {
    id: 10,
    name: "iDETAIL Supreme Slick Ceramic Detailer",
    price: 385,
    category: "ceramic",
    categoryLabel: "Ceramic Coatings",
    icon: "⚡",
    image: "/src/assets/images/idetail_glass_spray_1780686901922.png",
    description: "Instant spray-and-wipe SiO2 shine amplifier to boost ceramics and repel environmental dirt.",
    fullDescription: "Whether your vehicle is coated in high-tier Nano Shield or has raw factory finish, Supreme Slick instantly delivers an insane slickness, glossy depth, and hydrophobic water-slide protection. Perfect as a quick final detailer to wipe away dust and light spots.",
    rating: 4.8,
    reviewsCount: 165,
    benefits: [
      "Maintains existing ceramic or paint sealant longevity",
      "Produces a smooth friction-free finish that repels fine dust",
      "Provides water spot defense and wet gloss look in minutes",
      "Safely removes water marks, fresh bugs, and bird droppings"
    ],
    instructions: "Work on cool paint in shaded areas. Spray very light mist directly over one panel. Buff off instantly with a dry premium microfiber towel. Turn towel to clean side and buff a second time for full mirror shine.",
    size: "16 oz",
    inStock: true,
    isFeatured: true
  },
  {
    id: 11,
    name: "iDETAIL Tornado Grit Guard Filter",
    price: 240,
    category: "accessories",
    categoryLabel: "Accessories",
    icon: "🎯",
    image: "/src/assets/images/idetail_grit_guard_1780687539513.png",
    description: "Rigid heavy-duty bucket grit filter to screen harmful dirt from scratching premium car clearcoats.",
    fullDescription: "Nearly all swirl-mark spiderwebs come from microscopic rocks trapped on wash mitts. The Tornado Grit Guard settles at the bottom of standard 5-gallon buckets. Radial grid vents absorb dirt and trap paint particles isolated below the baffle plate.",
    rating: 4.9,
    reviewsCount: 205,
    benefits: [
      "Stops grit particles from re-attaching onto wash mitts",
      "Four radial columns separate dirty water, keeping upper water clean",
      "Constructed of heavy-duty, impact-resistant polypropylene",
      "Fits snug inside standard 3.5 to 5-gallon round wash buckets"
    ],
    instructions: "Push the Tornado Grit Guard firmly into the bottom of soap and rinse water buckets. Frequently rub your wash mitt over the grid after washing a dirty panel to sweep embedded gravel beneath the grit baffle.",
    size: "10.5\" Diameter",
    inStock: true,
    isFeatured: false
  },
  {
    id: 12,
    name: "iDETAIL Apex Clay & Polish Slick Kit",
    price: 495,
    category: "accessories",
    categoryLabel: "Accessories",
    icon: "💎",
    image: "/src/assets/images/idetail_clay_bar_1780686871465.png",
    description: "Premium smooth automotive clay bar kit with high-slip lubricant for paint decontamination.",
    fullDescription: "Feel the clearcoat of your car. Is it rough or bumpy? Air particulates, rail dust, and industrial sap are fused into the paint. This complete kit decontaminates pores, leaving your paint glassy smooth and ready for premium waxes or nano coatings.",
    rating: 4.8,
    reviewsCount: 78,
    benefits: [
      "Removes rough, embedded surface grimes that wash soaps can't touch",
      "Ultra-slick glide lubricant prevents paint scratching",
      "Includes 3 separately wrapped 100g medium clay bars",
      "Dramatically improves compound buffet and wax results"
    ],
    instructions: "Wash vehicle cleanly. Cut one clay bar into thirds and knead flat. Spray a 2x2 ft paint area with clay lubricant. Glide flat clay back and forth. You will feel roughness, then a glassy slide. Wipe clean. Knead clay to a clean face when dirty.",
    size: "3x 100g Clay + 16 oz Lube",
    inStock: true,
    isFeatured: false
  },
  {
    id: 13,
    name: "iDETAIL Gold Premium Car Shampoo",
    price: 360,
    category: "exterior",
    categoryLabel: "Exterior Care",
    icon: "🧼",
    image: "/src/assets/images/idetail_shampoo_bottle_1780686794337.png",
    description: "Rich and luxurious formula designed to both clean and condition paint in one easy step.",
    fullDescription: "iDETAIL Gold Premium Shampoo is a premium, pH-balanced formula containing advanced sudsing conditioners that lift road dirt and grime without stripping valuable wax protection. Rich conditioners leave a radiant, deep-gloss finish on all paint types.",
    rating: 4.9,
    reviewsCount: 425,
    benefits: [
      "Cleans and conditions paint in one simple wash step",
      "Lifts grime while preserving existing wax layers",
      "Highly concentrated suds and premium paint conditioners",
      "Biodegradable and completely pH-balanced formula"
    ],
    instructions: "Mix 4 capfuls of Gold Premium wash in a bucket with 5 liters of clean water. For foam cannons, dilute 10:1. Wash the vehicle panels starting from top to bottom with a soft microfiber mitten. Rinse thoroughly with clear water.",
    size: "1.89 L",
    inStock: true,
    isFeatured: true
  },
  {
    id: 14,
    name: "iDETAIL Ultimate Liquid Wax",
    price: 680,
    category: "exterior",
    categoryLabel: "Exterior Care",
    icon: "🧴",
    image: "/src/assets/images/idetail_liquid_wax_bottle_1780686811371.png",
    description: "Advanced dynamic pure synthetic hydrophobic polymer wax delivering deep wet-look reflection.",
    fullDescription: "iDETAIL Ultimate Liquid Wax features advanced pure synthetic polymer chemistry that crosses and bonds together to create a durable protective barrier. It elevates paint gloss, depth of color, and establishes unbelievable water-beading action easily.",
    rating: 4.8,
    reviewsCount: 195,
    benefits: [
      "Long-lasting synthetic polymer barrier protection",
      "ThinFilm technology allows easy wipe off even in direct sun",
      "Exceptional deep visual wet-look gloss reflection",
      "Intense hydrophobic beading action repels rains"
    ],
    instructions: "Apply a small amount onto a foam applicator pad. Spread a very thin, even coat over the panel. Allow to dry/cure to a light haze (approx. 5-10 mins). Wipe clean with a soft microfiber towel. Turn towel to a clean side for a final glass-like buff.",
    size: "473 ml",
    inStock: true,
    isFeatured: true
  },
  {
    id: 15,
    name: "iDETAIL Gloss Shield Quik Detailer",
    price: 380,
    category: "exterior",
    categoryLabel: "Exterior Care",
    icon: "💨",
    image: "/src/assets/images/idetail_glass_spray_1780686901922.png",
    description: "Slick paint detailer spray with Hydrophobic Polymer Technology for high water surface-tension.",
    fullDescription: "iDETAIL Gloss Shield Quik Detailer represents the bridge between washing and waxing. Ideal for removing dust and fingerprints in minutes, it uses unique Hydrophobic Polymer Technology to create high surface tension so water beads up and rolls off instantly.",
    rating: 4.7,
    reviewsCount: 280,
    benefits: [
      "Safely removes dust, fingerprints, and lightweight soilings",
      "Enriches paint slickness, color depth, and glossiness",
      "Hydrophobic polymer tech yields dramatic water repulse",
      "Perfect for maintenance between major wax applications"
    ],
    instructions: "Spray lightly onto a cool, dry panel. Wipe off immediately with a clean, folded microfiber towel. Flip to a dry portion of the towel and buff lightly. Work section by section across the vehicle.",
    size: "709 ml",
    inStock: true,
    isFeatured: false
  },
  {
    id: 16,
    name: "iDETAIL Hybrid Ceramic Wax Spray",
    price: 620,
    category: "exterior",
    categoryLabel: "Exterior Care",
    icon: "💧",
    image: "/src/assets/images/idetail_glass_spray_1780686901922.png",
    description: "Sophisticated hybrid SiO2 formulation that seals paint by simply spraying on and rinsing off.",
    fullDescription: "Get ceramic protection without complicated buffers. iDETAIL Hybrid Ceramic Wax uses advanced hybrid ceramic SiO2 technology that bonds to exterior clearcoat during rinse down. Just spray on wet paint, rinse off with water, and dry. Incredible water-shedding.",
    rating: 4.8,
    reviewsCount: 340,
    benefits: [
      "SiO2-infused ceramic protection with zero tiresome buffing",
      "Frictionless spray-on, rinse-off simple application method",
      "Leaves massive hydrophobic protection and mirror slickness",
      "Fills fine micro-swirls and locks in deep glossy color"
    ],
    instructions: "Wash vehicle. Rinse off loose soap. Spray Hybrid Ceramic Wax over all wet painted panels. For the first application, wipe dry with a microfiber towel to set foundation. For subsequent washes, spray on wet paint, spray rinse with high pressure, and dry.",
    size: "768 ml",
    inStock: true,
    isFeatured: true
  },
  {
    id: 17,
    name: "iDETAIL Heavy Swirl Cutter Compound",
    price: 450,
    category: "exterior",
    categoryLabel: "Exterior Care",
    icon: "🌀",
    image: "/src/assets/images/idetail_clay_bar_1780686871465.png",
    description: "Micro-abrasive scratch remover that safely clears oxidation, swirl patterns, and water spots.",
    fullDescription: "iDETAIL Heavy Swirl Cutter Compound uses exclusive micro-abrasive compounding technology that cuts fast to restore neglected or damaged paints. It removes oxidation, deep swirls, bird drop stains, and water etching without scouring or scratching clearcoat.",
    rating: 4.7,
    reviewsCount: 215,
    benefits: [
      "Safely removes scratches and heavy swirl spiderwebs",
      "Clears stubborn paint oxidation and heavy water spots",
      "Micro-abrasive tech finishes down like a polish",
      "Safe for all glossy paints and clearcoats (hand or DA buffer)"
    ],
    instructions: "Place 3 drops onto a foam compound pad. Apply to a 2x2 ft panel with moderate pressure in circular motions, or use a Dual-Action polisher. Buff off wet compound with a clean microfiber. Do not allow to dry.",
    size: "450 ml",
    inStock: true,
    isFeatured: false
  },
  {
    id: 18,
    name: "iDETAIL Ultimate Interior Detailer",
    price: 340,
    category: "interior",
    categoryLabel: "Interior Detail",
    icon: "🧽",
    image: "/src/assets/images/idetail_interior_spray_1780686839935.png",
    description: "Deep cleaner and UV protector for all interior surfaces, leaving a non-greasy satin finish.",
    fullDescription: "Clean and protect your custom dashboard, console, and door panels. iDETAIL Ultimate Interior Detailer combines deep cleaning power with high UV blockers. It leaves a long-lasting, deep-colored satin finish that isn't greasy or slick.",
    rating: 4.8,
    reviewsCount: 190,
    benefits: [
      "Cleans and shields vinyl, leatherette, wood, and LCD panels",
      "Creates a completely dry-touch satin look; zero glare",
      "Powerful UV shield blocks fading, cracking, and decay",
      "Excellent dust-repelling anti-static guard properties"
    ],
    instructions: "Spray directly onto a microfiber applicator pad or towel. Wipe down all interior surfaces to lift dust and oils. Flip towel to dry side and perform a light buff to set the satin sheen.",
    size: "450 ml",
    inStock: true,
    isFeatured: true
  },
  {
    id: 19,
    name: "iDETAIL Rich Leather 3-in-1 Cream",
    price: 395,
    category: "interior",
    categoryLabel: "Interior Detail",
    icon: "🛋️",
    image: "/src/assets/images/idetail_leather_conditioner_1780686884214.png",
    description: "Premium leather cleanser, conditioner, and protective barrier infused with aloe.",
    fullDescription: "Treat premium leather seats with iDETAIL Rich Leather 3-in-1 Cream. It safely lifts grease, body oils, and soils, while active aloe nutrients restore natural suppleness. Added UV guards prevent dry fade and cracking.",
    rating: 4.6,
    reviewsCount: 155,
    benefits: [
      "Cleanses, conditions, and shields leather in one quick treatment",
      "Aloe nutrients keep surface soft and supple without greasy shine",
      "Strong UV protectors block sun damage and premature aging",
      "Maintains natural grain and returns classy leather scent"
    ],
    instructions: "Dispense a small amount onto a foam sponge applicator. Massage gently in circular motions across genuine leather upholstery. Let absorb for 5 minutes, then wipe clean with a soft dry microfiber.",
    size: "400 ml",
    inStock: true,
    isFeatured: false
  },
  {
    id: 20,
    name: "iDETAIL Quik Interior Matte Cleaner",
    price: 295,
    category: "interior",
    categoryLabel: "Interior Detail",
    icon: "✨",
    image: "/src/assets/images/idetail_interior_spray_1780686839935.png",
    description: "Fast touch-up cleaner for a factory-fresh, natural matte finish on all cabin surfaces.",
    fullDescription: "Ideal for daily upkeep, iDETAIL Quik Interior Matte Cleaner safely lifts dust, minor spills, makeup oils, and fingerprints. It preserves the original matte look of plastic, steering wheels, and screens without adding any artificial shine or sticky residue.",
    rating: 4.8,
    reviewsCount: 310,
    benefits: [
      "Safely cleans dashboards, sat-nav screens, trim, and leather",
      "Leaves a completely natural, factory-fresh matte look",
      "High UV blockage defense stops cracking and fading",
      "Non-greasy, non-sticky premium touch formulation"
    ],
    instructions: "Mist light sprays over the surfaces. Wipe immediately with a premium clean microfiber. Safely works across navigation screens, instrument clusters, and delicate materials.",
    size: "473 ml",
    inStock: true,
    isFeatured: false
  },
  {
    id: 21,
    name: "iDETAIL Heavy Duty Fabric Cleanser",
    price: 315,
    category: "interior",
    categoryLabel: "Interior Detail",
    icon: "🌬️",
    image: "/src/assets/images/idetail_carpet_cleaner_1780686914910.png",
    description: "Active stain-lifting foam spray that penetrates fabrics to lift oils, mud, and bad odors.",
    fullDescription: "iDETAIL Heavy Duty Fabric Cleanser utilizes active foaming action to lift grease, coffee, mud, and ground-in dirt. Deep-penetrating agents break bonds, while built-in odor eliminator compounds neutralize deep-seated smells permanently.",
    rating: 4.7,
    reviewsCount: 125,
    benefits: [
      "Penetrates deep into fibers to break down ground-in soils",
      "Active dry-foam tech dries quickly without sticky soap pools",
      "Permanent odor elimination technology stops wet dog/smoke smells",
      "Safe on all automotive carpets, carpet mats, and upholstery cloths"
    ],
    instructions: "Vacuum area first. Spray foaming cleanser evenly over stained sections. Let foam sit for 30 seconds to penetrate. Gently scrub fibers with a nylon detailing brush. Blot dry with a dry microfiber cloth.",
    size: "568 ml",
    inStock: true,
    isFeatured: false
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Marcus Sterling",
    role: "Professional Detailing Shop Owner",
    vehicle: "Porsche 911 GT3 RS",
    text: "I have applied under three dozen brands of ceramic coatings, and the iDETAIL Nano Shield is absolutely outstanding. The flash rate is predictable, leveling is flawless, and the deep wet-look reflection holds up month after month even with daily driving.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120"
  },
  {
    id: 2,
    name: "Sophia Martinez",
    role: "Concours D'Elegance Competitor",
    vehicle: "1967 Jaguar E-Type",
    text: "To preserve single-stage vintage automotive lacquer coatings, you need chemists who respect car materials. The Hybrid Wax leaves a beautiful, warm, deep gloss that elevates our paint. The edgeless towels are incredibly premium, soft, and lint-free.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120"
  },
  {
    id: 3,
    name: "Jordan Vance",
    role: "Car Enthusiast & Daily Commuter",
    vehicle: "Tesla Model S Plaid",
    text: "Interior Revive has completely changed how my cabin feels. Dust doesn't accumulate on my dashboard, and the non-greasy satin sheen looks identical to the factory leather finish. Plus, the high-end scent makes it smell like a brand new showroom delivery.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120"
  }
];

export const FAQS: FAQItem[] = [
  {
    id: 1,
    question: "What is the primary difference between wax and ceramic coatings?",
    answer: "Typical waxes (like HydroGloss) deposit slick natural carnauba or synthetic polymers on top of the paint, lasting 3 to 6 months. They provide a beautiful warm glow. Ceramic coatings (like Nano Shield) contain SiO2 molecules that bond into the clearcoat, creating a high-hardness shell. They last 1 to 2 years, provide extreme chemical resistance, and have a highly reflective glass-like shine."
  },
  {
    id: 2,
    question: "Are your products pH neutral and safe for existing clearcoats?",
    answer: "Yes, our wash shampoos and surface treatments are specifically formulated by professional auto chemists to be pH balanced. This guarantees they will not leach, cloud, or strip existing layers of wax, synthetic sealants, or quartz ceramic coatings, keeping your paint perfectly protected."
  },
  {
    id: 3,
    question: "Do you offer international shipping or detailing store discounts?",
    answer: "Yes! iDETAIL ships worldwide with premium express carriers to preserve product temperature stability. We also offer certified business accounts for custom detailing shops with discounted rates, custom bulk sizing, and educational application workshops."
  },
  {
    id: 4,
    question: "How should I wash and care for the microfiber edgeless towels?",
    answer: "Never use powdered detergent, fabric softeners, or bleach, as these clog the split micro-polyester loops and scratch clearcoat. Wash towels separately from household cottons in lukewarm water with liquid detergent, then dry on delicate air fluff (no heat) settings."
  }
];

export const TIPS: DetailingTip[] = [
  {
    id: 1,
    title: "The Professional Two-Bucket Car Washing Technique",
    category: "Exterior Prep",
    description: "How to safely wash daily drivers without inducing spiderweb clearcoat swirl marks.",
    duration: "45 mins",
    difficulty: "Beginner",
    steps: [
      "Prepare Bucket 1 with pH neutral Ultra-Suds Soap, and Bucket 2 with purely Clean Water. Insert Tornado Grit Guards in both.",
      "Thoroughly pre-rinse the vehicle from the top down to clear loose heavy pebbles and sand.",
      "Dip your premium microfiber wash mitt into Bucket 1 (Soap), and wash one single car panel in light, straight lines (never circular orbits).",
      "Submerge the soiled mitt into Bucket 2 (Rinse water) and scrub it flat against the bottom grit guard to release trapped paint gravel.",
      "Squeeze the clean mitt dry, submerge it back into Bucket 1 (Soap), and advance to the next panel. Rinse the vehicle from top down once completed."
    ]
  },
  {
    id: 2,
    title: "Automotive Paint Prep: Clay Bar Decontamination",
    category: "Paint Decon",
    description: "Restore glassy smooth surfaces by removing invisible embedded iron, fallout, and tree sap.",
    duration: "60 mins",
    difficulty: "Intermediate",
    steps: [
      "Thoroughly wash and dry your vehicle out of direct sunlight.",
      "Spray a generous mist of clay bar lubricant across a compact 2x2 foot section.",
      "Gently slide the clay bar in back-and-forth lines. Do not use high downforce. At first, you will hear and feel friction.",
      "Continue sliding until the clay moves completely silent with zero drag across the paint.",
      "Wipe the panel dry with a plush microfiber towel. Fold the dirty clay bar inward to expose a fresh paint-safe surface for the next panel."
    ]
  },
  {
    id: 3,
    title: "Flawless Nano Ceramic Coating Application",
    category: "Protection",
    description: "Install SiO2 glass bonds like a professional, achieving 2 years of solid defense.",
    duration: "3-4 hours",
    difficulty: "Expert",
    steps: [
      "Perform a full wash, iron fallout removal, clay bar, and fine paint polishing. Clean paint is critical for ceramic bonding.",
      "Do a final wipe with an Isopropyl Alcohol panel prep spray to strip any oily polishing residues.",
      "Wrap a suede applicator cloth around the sponge block. Apply 8-10 drops of Nano Shield Ceramic Coating in a tight row.",
      "Spread the product across a 2x2 foot panel using cross-hatch strokes (left-right, then top-down) to guarantee dense leveling.",
      "Watch the surface closely. After 1-2 minutes, the product will 'flash' and turn into oil-rainbow specks. Immediately buff flat with the first microfiber, and wipe again with a second microfiber to ensure zero high-spot borders."
    ]
  }
];

export const SERVICES: DetailingService[] = [
  {
    id: "interior-valet",
    name: "Elite Interior Detailing",
    price: 850,
    duration: "2 - 3 Hours",
    icon: "💺",
    description: "Deep cabin purification and steam decontamination. We treat every fabric, crevice, and leather pore.",
    includes: [
      "Full deep steam sanitisation of all upholstery & carpets",
      "Hot-water extraction of deep-seated grime & stains",
      "Premium pH-balanced leather cleaning & conditioning",
      "Satin dashboard UV treatment & anti-static shielding",
      "Detail brush cleaning of all vents, cup holders & dials",
      "Ozone cabin air deodorisation treatment"
    ],
    recommendedFor: "Vehicles with pet hair, drink stains, dust build-up, or stubborn cabin odors."
  },
  {
    id: "exterior-valet",
    name: "HydroShield Exterior Detailing",
    price: 1200,
    duration: "2 - 3 Hours",
    icon: "✨",
    description: "Deep exterior decontamination followed by a state-of-the-art hybrid wax hand-burnished coat.",
    includes: [
      "Signature twin-bucket scratch-safe snow foam bath",
      "Apex wheel catalyst gel wash & tire browning removal",
      "Clay-bar paint decontamination to lift tree sap & fallout",
      "Professional panel wipe & Isopropyl clean",
      "HydroGloss synthetic hand-applied protection (6-month coat)",
      "CrystalClear glass rain-bead treatment across all windows",
      "Satin tyre walls and arch trim dressing"
    ],
    recommendedFor: "Cars requiring gloss restoration, deep brake-dust removal, and solid environmental defense."
  },
  {
    id: "paint-correction",
    name: "Precision Paint Correction",
    price: 2800,
    duration: "4 - 6 Hours",
    icon: "💎",
    description: "Multi-stage machine compounding and finishing polish. Eliminates swirl webs, haze, and light surface trails.",
    includes: [
      "Full exterior strip chemical & mechanical decontamination wash",
      "Automotive digital paint-thickness meter assessment",
      "Heavy rotary compound cut to remove 80-90% of swirl webs",
      "Refining dual-action dual-polish to restore absolute mirrors",
      "Jewelling gloss enhancement finishing compound",
      "Complete microcar prep alcohol clean"
    ],
    recommendedFor: "Dark vehicles with micro-scratches, spiderweb swirls, or single-stage oxidation."
  },
  {
    id: "ceramic-coating",
    name: "Master Signature Ceramic Coating",
    price: 5500,
    duration: "6 - 8 Hours",
    icon: "🛡️",
    description: "Our absolute apex level mobile treatment. Full preparation wash followed by 9H hardness silica-quartz coating.",
    includes: [
      "Includes complete single-stage paint gloss enhancement",
      "Dual-layer Nano Shield Ceramic 9H+ clearcoat molecular bond",
      "Ceramic coating applied to windshield, steel/alloy wheels & callipers",
      "Complete plastic-trim ceramic restoration & protection",
      "Infrared heat lamp curing for immediate surface locking",
      "Complimentary iDETAIL maintenance kit included"
    ],
    recommendedFor: "Investment vehicles, brand new deliveries, and enthusiasts demanding 2+ years of armor protection."
  }
];
