require('dotenv').config();
const mongoose = require('mongoose');
const Crop = require('./models/Crop');
const CropSchedule = require('./models/CropSchedule');
const GovtScheme = require('./models/GovtScheme');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/krishimitra';

const cropsData = [
  {
    name: 'Wheat',
    localName: 'गेहूँ (Gehun)',
    season: 'Rabi',
    soilTypes: ['Loamy', 'Clay Loam', 'Sandy Loam'],
    states: ['Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh', 'Rajasthan', 'Bihar'],
    duration: 120,
    waterRequirement: '4-6 irrigations (450-650mm)',
    avgYield: '40-55 quintals/hectare',
    mspPrice: 2275,
    marketPrice: 2500,
    profitMargin: '18-25%',
    description: 'Most important Rabi crop of India. Ideal sowing time October–November. Grown extensively in the Indo-Gangetic plains.',
    tags: ['staple', 'rabi', 'high-demand'],
  },
  {
    name: 'Paddy',
    localName: 'धान (Dhan)',
    season: 'Kharif',
    soilTypes: ['Clay', 'Silty Clay', 'Heavy Loam'],
    states: ['West Bengal', 'Uttar Pradesh', 'Punjab', 'Andhra Pradesh', 'Tamil Nadu', 'Odisha'],
    duration: 110,
    waterRequirement: '1200-2000mm (flood irrigation)',
    avgYield: '35-60 quintals/hectare',
    mspPrice: 2300,
    marketPrice: 2650,
    profitMargin: '15-30%',
    description: 'Primary Kharif food crop. Transplanting in June–July; harvest in October–November. Requires standing water for most growth stages.',
    tags: ['staple', 'kharif', 'high-demand', 'water-intensive'],
  },
  {
    name: 'Mustard',
    localName: 'सरसों (Sarson)',
    season: 'Rabi',
    soilTypes: ['Sandy Loam', 'Loamy', 'Well-drained'],
    states: ['Rajasthan', 'Uttar Pradesh', 'Haryana', 'Madhya Pradesh', 'West Bengal'],
    duration: 110,
    waterRequirement: '2-3 irrigations (250-400mm)',
    avgYield: '15-25 quintals/hectare',
    mspPrice: 5650,
    marketPrice: 6200,
    profitMargin: '25-40%',
    description: 'India\'s largest oilseed crop. Sowing in October–November. High MSP and good market demand. Relatively drought-tolerant.',
    tags: ['oilseed', 'rabi', 'profitable'],
  },
  {
    name: 'Sugarcane',
    localName: 'गन्ना (Ganna)',
    season: 'Zaid',
    soilTypes: ['Loamy', 'Clay Loam', 'Alluvial'],
    states: ['Uttar Pradesh', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Bihar'],
    duration: 365,
    waterRequirement: '1500-2500mm (needs heavy irrigation)',
    avgYield: '650-750 quintals/hectare',
    mspPrice: 370,
    marketPrice: 420,
    profitMargin: '20-35%',
    description: 'Long-duration cash crop, takes 10–18 months. Planted February–March. Major source of sugar and ethanol production.',
    tags: ['cash-crop', 'zaid', 'high-yield'],
  },
  {
    name: 'Cotton',
    localName: 'कपास (Kapas)',
    season: 'Kharif',
    soilTypes: ['Black Cotton Soil', 'Deep Loam', 'Well-drained Red Soil'],
    states: ['Gujarat', 'Maharashtra', 'Telangana', 'Andhra Pradesh', 'Punjab', 'Haryana'],
    duration: 150,
    waterRequirement: '700-1200mm',
    avgYield: '15-25 quintals/hectare (kapas)',
    mspPrice: 7121,
    marketPrice: 8500,
    profitMargin: '20-30%',
    description: 'White gold of India. Planted May–July. Bt cotton widely grown. Telangana and Gujarat are major producers.',
    tags: ['cash-crop', 'kharif', 'export'],
  },
  {
    name: 'Maize',
    localName: 'मक्का (Makka)',
    season: 'Kharif',
    soilTypes: ['Sandy Loam', 'Loamy', 'Well-drained'],
    states: ['Andhra Pradesh', 'Karnataka', 'Rajasthan', 'Bihar', 'Uttar Pradesh', 'Madhya Pradesh'],
    duration: 90,
    waterRequirement: '500-800mm',
    avgYield: '30-60 quintals/hectare',
    mspPrice: 2090,
    marketPrice: 2400,
    profitMargin: '15-25%',
    description: 'Versatile cereal used for food, feed, and industrial purposes. Short duration crop with high yield potential.',
    tags: ['cereal', 'kharif', 'poultry-feed'],
  },
  {
    name: 'Soybean',
    localName: 'सोयाबीन (Soyabean)',
    season: 'Kharif',
    soilTypes: ['Black Soil', 'Loamy', 'Clay Loam'],
    states: ['Madhya Pradesh', 'Maharashtra', 'Rajasthan', 'Karnataka', 'Telangana'],
    duration: 95,
    waterRequirement: '450-700mm',
    avgYield: '20-30 quintals/hectare',
    mspPrice: 4892,
    marketPrice: 5500,
    profitMargin: '20-35%',
    description: 'High-protein oilseed. Madhya Pradesh is the soybean bowl of India. Excellent soil nitrogen-fixing ability.',
    tags: ['oilseed', 'kharif', 'protein-rich'],
  },
  {
    name: 'Chickpea',
    localName: 'चना (Chana)',
    season: 'Rabi',
    soilTypes: ['Sandy Loam', 'Loamy', 'Well-drained Black Soil'],
    states: ['Madhya Pradesh', 'Rajasthan', 'Maharashtra', 'Uttar Pradesh', 'Andhra Pradesh'],
    duration: 95,
    waterRequirement: '300-400mm (mostly rainfed)',
    avgYield: '15-25 quintals/hectare',
    mspPrice: 5440,
    marketPrice: 6500,
    profitMargin: '25-40%',
    description: 'Most important pulse crop of India. Low water requirement, improves soil fertility. High protein food with strong market demand.',
    tags: ['pulse', 'rabi', 'protein-rich', 'drought-tolerant'],
  },
];

const cropSchedulesData = [
  {
    cropName: 'Wheat',
    totalDays: 120,
    stages: [
      {
        stageName: 'Germination & Establishment',
        stageNameHindi: 'अंकुरण और स्थापना',
        startDay: 1,
        endDay: 21,
        color: '#86efac',
        tasks: [
          { day: 1, week: 1, title: 'Seed Treatment & Sowing', titleHindi: 'बीज उपचार और बुवाई', description: 'Treat seeds with Bavistin (2g/kg). Sow at 100-125 kg/ha depth 5-6 cm. Row spacing 22.5 cm.', type: 'sowing', priority: 'high' },
          { day: 3, week: 1, title: 'Pre-sowing Irrigation (Palewa)', titleHindi: 'बुवाई से पहले पलेवा', description: 'Give life-saving irrigation if soil moisture is insufficient. 6-8 cm depth.', type: 'irrigation', priority: 'high' },
          { day: 7, week: 1, title: 'Germination Check', titleHindi: 'अंकुरण जांच', description: 'Check germination percentage (target >85%). Note gaps for gap-filling.', type: 'monitoring', priority: 'medium' },
          { day: 14, week: 2, title: 'First Irrigation (Crown Root)', titleHindi: 'पहली सिंचाई - मुकुट जड़', description: 'Crown Root Initiation stage. CRITICAL: Do not miss. Light irrigation 4-5 cm.', type: 'irrigation', priority: 'high' },
          { day: 20, week: 3, title: 'Weed Removal', titleHindi: 'खरपतवार हटाना', description: 'Apply Clodinafop (Topik) for narrow-leaf weeds or 2,4-D for broad-leaf weeds.', type: 'pesticide', priority: 'medium' },
        ]
      },
      {
        stageName: 'Tillering',
        stageNameHindi: 'कंसे निकलना',
        startDay: 22,
        endDay: 45,
        color: '#4ade80',
        tasks: [
          { day: 25, week: 4, title: 'First Urea Top-dress', titleHindi: 'पहली यूरिया टॉप-ड्रेसिंग', description: 'Apply 65-70 kg Urea/ha as top dressing. Broadcast evenly.', type: 'fertilizer', priority: 'high' },
          { day: 35, week: 5, title: 'Second Irrigation (Tillering)', titleHindi: 'दूसरी सिंचाई - कंसे', description: 'Tillering stage irrigation. 6-7 cm water. Most productive irrigation.', type: 'irrigation', priority: 'high' },
          { day: 40, week: 6, title: 'Aphid/Yellow Rust Check', titleHindi: 'माहू और पीला रतुआ जांच', description: 'Inspect for aphid colonies and yellow rust pustules. Spray Dimethoate if aphids >10/tiller.', type: 'monitoring', priority: 'medium' },
        ]
      },
      {
        stageName: 'Jointing & Booting',
        stageNameHindi: 'गांठ बनना और बाली निकलना',
        startDay: 46,
        endDay: 75,
        color: '#22c55e',
        tasks: [
          { day: 50, week: 7, title: 'Third Irrigation (Jointing)', titleHindi: 'तीसरी सिंचाई - जोड़', description: 'Jointing stage. Apply 6-7 cm water. Apply second Urea dose of 35 kg/ha simultaneously.', type: 'irrigation', priority: 'high' },
          { day: 55, week: 8, title: 'Second Urea Application', titleHindi: 'दूसरी यूरिया डालना', description: 'Apply remaining Urea 35 kg/ha. Mix with irrigation for better absorption.', type: 'fertilizer', priority: 'high' },
          { day: 65, week: 9, title: 'Fourth Irrigation (Booting)', titleHindi: 'चौथी सिंचाई - बूटिंग', description: 'Before ear emergence. 6 cm light irrigation to support grain development.', type: 'irrigation', priority: 'medium' },
        ]
      },
      {
        stageName: 'Heading & Flowering',
        stageNameHindi: 'सिट्टा निकलना और फूलना',
        startDay: 76,
        endDay: 95,
        color: '#16a34a',
        tasks: [
          { day: 78, week: 11, title: 'Fifth Irrigation (Heading)', titleHindi: 'पाँचवीं सिंचाई - सिट्टा', description: 'Ear emergence stage. CRITICAL: Avoid heavy irrigation during pollination. 5 cm only.', type: 'irrigation', priority: 'high' },
          { day: 85, week: 12, title: 'Foliar Spray (Micronutrient)', titleHindi: 'पर्णीय छिड़काव', description: 'Spray 2% Urea + 0.5% Zinc Sulfate solution to boost grain filling.', type: 'fertilizer', priority: 'medium' },
          { day: 90, week: 13, title: 'Rust & Karnal Bunt Check', titleHindi: 'रतुआ और करनाल बंट जांच', description: 'Monitor for brown/black rust and Karnal Bunt. Spray Propiconazole if needed.', type: 'monitoring', priority: 'high' },
        ]
      },
      {
        stageName: 'Grain Filling & Harvest',
        stageNameHindi: 'दाना भरना और कटाई',
        startDay: 96,
        endDay: 120,
        color: '#15803d',
        tasks: [
          { day: 100, week: 14, title: 'Sixth Irrigation (Grain Filling)', titleHindi: 'छठी सिंचाई - दाना भराव', description: 'Last irrigation. 5 cm water. Stop irrigation after this stage.', type: 'irrigation', priority: 'medium' },
          { day: 110, week: 16, title: 'Pre-harvest Check (Maturity)', titleHindi: 'पकाई जांच', description: 'Check grain moisture (target 14-16%). When straw turns golden-yellow, ready for harvest.', type: 'monitoring', priority: 'high' },
          { day: 115, week: 16, title: 'Harvesting (Combine/Manual)', titleHindi: 'कटाई', description: 'Harvest when grain moisture is 14-16%. Use combine harvester for large fields. Avoid delays to prevent shattering.', type: 'harvest', priority: 'high' },
          { day: 120, week: 17, title: 'Threshing & Storage', titleHindi: 'गहाई और भंडारण', description: 'Thresh and dry grain to 12% moisture before storage. Store in metal bins with Aluminum Phosphide tablets.', type: 'harvest', priority: 'high' },
        ]
      },
    ]
  },
  {
    cropName: 'Paddy',
    totalDays: 110,
    stages: [
      {
        stageName: 'Nursery & Transplanting',
        stageNameHindi: 'नर्सरी और रोपाई',
        startDay: 1,
        endDay: 25,
        color: '#bef264',
        tasks: [
          { day: 1, week: 1, title: 'Nursery Seed Sowing', titleHindi: 'नर्सरी बीज बुवाई', description: 'Sow pre-soaked seeds in nursery beds. 20-25 kg seed/ha. Maintain 2-3 cm water in nursery.', type: 'sowing', priority: 'high' },
          { day: 3, week: 1, title: 'Nursery Fertilizer', titleHindi: 'नर्सरी खाद', description: 'Apply 1 kg DAP per 10 sq meters nursery bed for healthy seedlings.', type: 'fertilizer', priority: 'medium' },
          { day: 20, week: 3, title: 'Main Field Preparation', titleHindi: 'मुख्य खेत तैयारी', description: 'Puddle the main field. Apply FYM 10t/ha. Basal dose: 60:40:40 NPK kg/ha.', type: 'sowing', priority: 'high' },
          { day: 25, week: 4, title: 'Transplanting (Ropa)', titleHindi: 'रोपाई', description: 'Transplant 20-25 day old seedlings. Row: 20cm, Plant: 15cm. 2-3 seedlings/hill. Maintain 5 cm water.', type: 'sowing', priority: 'high' },
        ]
      },
      {
        stageName: 'Vegetative Growth',
        stageNameHindi: 'वानस्पतिक वृद्धि',
        startDay: 26,
        endDay: 55,
        color: '#a3e635',
        tasks: [
          { day: 28, week: 4, title: 'Maintain Flood Irrigation', titleHindi: 'बाढ़ सिंचाई बनाए रखें', description: 'Keep 5-7 cm standing water. Check for bunds/leakage daily. Drain if water is stagnant >7 cm.', type: 'irrigation', priority: 'high' },
          { day: 30, week: 5, title: 'First Urea Top-dress', titleHindi: 'पहली यूरिया डालना', description: 'Apply 40 kg Urea/ha as top dressing after transplanting + 5 days. Drain field partially before application.', type: 'fertilizer', priority: 'high' },
          { day: 35, week: 5, title: 'Weed Management', titleHindi: 'खरपतवार प्रबंधन', description: 'Apply Butachlor (1.5 L/ha) or Bispyribac-Sodium for weed control. Maintain 3 cm water during application.', type: 'pesticide', priority: 'medium' },
          { day: 45, week: 7, title: 'Second Urea Dose', titleHindi: 'दूसरी यूरिया डालना', description: 'Apply 40 kg Urea/ha at active tillering. Drain field to thin layer before application.', type: 'fertilizer', priority: 'high' },
          { day: 50, week: 7, title: 'Stem Borer & BLB Check', titleHindi: 'तना छेदक और BLB जांच', description: 'Inspect for dead hearts (stem borer) and Bacterial Leaf Blight yellowing. Apply Chlorpyriphos if needed.', type: 'monitoring', priority: 'high' },
        ]
      },
      {
        stageName: 'Reproductive (Panicle)',
        stageNameHindi: 'प्रजनन अवस्था',
        startDay: 56,
        endDay: 85,
        color: '#84cc16',
        tasks: [
          { day: 60, week: 9, title: 'Third Urea (Panicle Init.)', titleHindi: 'तीसरी यूरिया - बाली बनना', description: 'Apply 40 kg Urea/ha at panicle initiation stage. CRITICAL stage for yield.', type: 'fertilizer', priority: 'high' },
          { day: 65, week: 9, title: 'Drainage & Re-flooding', titleHindi: 'निकासी और पुनः भराव', description: 'Drain field for 3-5 days to harden soil, then re-flood. Improves root anchorage.', type: 'irrigation', priority: 'medium' },
          { day: 75, week: 11, title: 'Neck Blast & Sheath Rot Check', titleHindi: 'गर्दन झुलसा और शीथ रॉट', description: 'Spray Tricyclazole (Beam) for neck blast at panicle emergence. Critical window.', type: 'pesticide', priority: 'high' },
          { day: 80, week: 11, title: 'Flowering Stage Irrigation', titleHindi: 'फूल आने पर सिंचाई', description: 'Maintain 5 cm water during flowering. Avoid drought stress - severely affects grain setting.', type: 'irrigation', priority: 'high' },
        ]
      },
      {
        stageName: 'Grain Maturity & Harvest',
        stageNameHindi: 'दाना पकना और कटाई',
        startDay: 86,
        endDay: 110,
        color: '#65a30d',
        tasks: [
          { day: 90, week: 13, title: 'Drain Field (Pre-harvest)', titleHindi: 'खेत खाली करना', description: 'Stop irrigation. Drain field 15-20 days before harvest for soil hardening and mechanized harvest.', type: 'irrigation', priority: 'high' },
          { day: 100, week: 14, title: 'Maturity Assessment', titleHindi: 'पकाई जांच', description: '85-90% grain turning golden-yellow = harvest ready. Grain moisture should be 20-25%.', type: 'monitoring', priority: 'medium' },
          { day: 108, week: 15, title: 'Harvesting', titleHindi: 'कटाई', description: 'Harvest when moisture is 20-22% for combine, or 25% for manual. Avoid over-ripening to prevent shattering.', type: 'harvest', priority: 'high' },
          { day: 110, week: 16, title: 'Threshing & Sun Drying', titleHindi: 'गहाई और सुखाना', description: 'Thresh within 24h of harvest. Sun dry paddy to 14% moisture for safe storage.', type: 'harvest', priority: 'high' },
        ]
      },
    ]
  },
  {
    cropName: 'Mustard',
    totalDays: 110,
    stages: [
      {
        stageName: 'Sowing & Germination',
        stageNameHindi: 'बुवाई और अंकुरण',
        startDay: 1,
        endDay: 20,
        color: '#fde047',
        tasks: [
          { day: 1, week: 1, title: 'Field Preparation & Sowing', titleHindi: 'खेत तैयारी और बुवाई', description: 'Sow 4-5 kg seed/ha. Row spacing 45 cm, depth 2-3 cm. Treat seed with Thiram 3g/kg. Basal: 60:40:40 NPK.', type: 'sowing', priority: 'high' },
          { day: 5, week: 1, title: 'Pre-sowing Irrigation', titleHindi: 'पलेवा', description: 'Apply light pre-sowing irrigation if soil is dry. Ensures uniform germination.', type: 'irrigation', priority: 'medium' },
          { day: 10, week: 2, title: 'Thinning', titleHindi: 'पौधों की छंटाई', description: 'Thin seedlings to 15-20 cm plant-to-plant distance within rows. Remove excess seedlings.', type: 'monitoring', priority: 'medium' },
          { day: 15, week: 2, title: 'First Irrigation (Germination)', titleHindi: 'पहली सिंचाई', description: 'Light irrigation 4-5 cm to support early growth. Avoid waterlogging.', type: 'irrigation', priority: 'medium' },
        ]
      },
      {
        stageName: 'Vegetative Growth',
        stageNameHindi: 'वानस्पतिक वृद्धि',
        startDay: 21,
        endDay: 50,
        color: '#fbbf24',
        tasks: [
          { day: 25, week: 4, title: 'First Urea Top-dress', titleHindi: 'पहली यूरिया डालना', description: 'Apply 30-35 kg Urea/ha as split dose. Improves vegetative growth.', type: 'fertilizer', priority: 'high' },
          { day: 35, week: 5, title: 'Second Irrigation (Branching)', titleHindi: 'दूसरी सिंचाई', description: 'Branching stage irrigation. 5-6 cm water. Critical for branch development.', type: 'irrigation', priority: 'high' },
          { day: 40, week: 6, title: 'Aphid & Painted Bug Control', titleHindi: 'माहू नियंत्रण', description: 'Monitor for mustard aphid (Lipaphis erysimi). Spray Dimethoate 30 EC if >30 aphids/plant.', type: 'pesticide', priority: 'high' },
        ]
      },
      {
        stageName: 'Flowering (Sarson Phool)',
        stageNameHindi: 'फूल आना',
        startDay: 51,
        endDay: 75,
        color: '#f59e0b',
        tasks: [
          { day: 55, week: 8, title: 'Flowering Stage Irrigation', titleHindi: 'फूल वाली सिंचाई', description: 'MOST CRITICAL: Irrigate at flowering. 5-6 cm. Avoid irrigation during peak bloom (12pm-4pm). Morning irrigation preferred.', type: 'irrigation', priority: 'high' },
          { day: 60, week: 9, title: 'Honey Bee Pollination', titleHindi: 'मधुमक्खी परागण', description: 'Place beehives near field (1-2 hives/acre) during flowering to enhance pollination. Increases yield 15-20%.', type: 'monitoring', priority: 'medium' },
          { day: 65, week: 9, title: 'Powdery Mildew Control', titleHindi: 'पाउडरी मिल्ड्यू नियंत्रण', description: 'Spray Wettable Sulphur 80% WP (3g/L) if powdery mildew symptoms observed on leaves.', type: 'pesticide', priority: 'medium' },
        ]
      },
      {
        stageName: 'Pod Formation & Maturity',
        stageNameHindi: 'फली बनना और पकाई',
        startDay: 76,
        endDay: 110,
        color: '#d97706',
        tasks: [
          { day: 80, week: 11, title: 'Pod-filling Irrigation', titleHindi: 'फली भरने वाली सिंचाई', description: 'Light irrigation during pod filling stage. 4-5 cm. Stop all irrigation 20 days before harvest.', type: 'irrigation', priority: 'medium' },
          { day: 90, week: 13, title: 'Maturity Check', titleHindi: 'पकाई जांच', description: 'Crop ready when 75% pods turn from green to yellow-brown. Avoid over-maturity to prevent pod shattering.', type: 'monitoring', priority: 'high' },
          { day: 100, week: 14, title: 'Harvesting (Threshing)', titleHindi: 'कटाई', description: 'Cut in early morning to avoid pod shatter. Use sickle. Stack and dry for 3-4 days before threshing.', type: 'harvest', priority: 'high' },
          { day: 108, week: 15, title: 'Seed Cleaning & Storage', titleHindi: 'बीज सफाई और भंडारण', description: 'Clean seed with Winnower. Dry to 8-9% moisture. Store in gunny bags with Neem leaves to repel insects.', type: 'harvest', priority: 'medium' },
        ]
      },
    ]
  },
];

const govtSchemesData = [
  {
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    nameHindi: 'प्रधानमंत्री किसान सम्मान निधि',
    category: 'central',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    launchYear: 2019,
    benefitAmount: '₹6,000/year (₹2,000 per installment, 3 times)',
    eligibility: [
      'All landholding farmers with cultivable land',
      'Must have valid Aadhaar card',
      'Bank account linked to Aadhaar',
      'State land records must be updated',
      'Not applicable to institutional landholders, government employees, income tax payees',
    ],
    documents: ['Aadhaar Card', 'Bank Passbook', 'Land Records (Khatauni)', 'Mobile Number'],
    applicationUrl: 'https://pmkisan.gov.in',
    description: 'Direct income support of ₹6,000 per year to all eligible farmer families transferred directly to bank accounts in three equal installments.',
    descriptionHindi: 'सभी पात्र किसान परिवारों को प्रति वर्ष ₹6,000 की प्रत्यक्ष आय सहायता, तीन समान किस्तों में बैंक खातों में स्थानांतरित।',
    targetStates: ['All India'],
    tags: ['income-support', 'direct-benefit', 'all-farmers'],
  },
  {
    name: 'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
    nameHindi: 'प्रधानमंत्री फसल बीमा योजना',
    category: 'insurance',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    launchYear: 2016,
    benefitAmount: 'Up to ₹2 lakh per crop season based on sum insured',
    eligibility: [
      'All farmers growing notified crops in notified areas',
      'Loanee farmers enrolled compulsorily through banks',
      'Non-loanee farmers can enroll voluntarily',
      'Premium: 1.5% (Rabi), 2% (Kharif), 5% (commercial crops)',
    ],
    documents: ['Aadhaar Card', 'Bank Account', 'Land Records', 'Sowing Certificate', 'Previous Loan Papers (if applicable)'],
    applicationUrl: 'https://pmfby.gov.in',
    description: 'Comprehensive crop insurance scheme providing financial support to farmers suffering crop loss/damage due to unforeseen events like natural calamities, pests, and diseases.',
    descriptionHindi: 'किसानों को प्राकृतिक आपदाओं, कीटों और बीमारियों से फसल नुकसान पर वित्तीय सहायता प्रदान करने वाली फसल बीमा योजना।',
    targetStates: ['All India'],
    tags: ['insurance', 'crop-protection', 'risk-management'],
  },
  {
    name: 'PM-KUSUM (Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyan)',
    nameHindi: 'प्रधानमंत्री किसान ऊर्जा सुरक्षा एवं उत्थान महाभियान',
    category: 'subsidy',
    ministry: 'Ministry of New and Renewable Energy',
    launchYear: 2019,
    benefitAmount: '60% subsidy on solar pump installation (30% central + 30% state)',
    eligibility: [
      'Individual farmers with agricultural land',
      'Groups of farmers / FPOs',
      'Panchayats, Water User Associations',
      'Agricultural cooperative societies',
      'Farmer pays only 10% cost; 30% bank loan available',
    ],
    documents: ['Aadhaar Card', 'Land Records', 'Bank Account', 'Electricity Bill (existing pump)', 'Farmer Registration Certificate'],
    applicationUrl: 'https://pmkusum.mnre.gov.in',
    description: 'Solar pump installation and solarization of agricultural pumps to reduce electricity costs and promote renewable energy in farming. Component-A: Ground/stilt-mounted decentralized plants. Component-B: Solar pumps installation. Component-C: Solarization of grid-connected pumps.',
    descriptionHindi: 'बिजली लागत कम करने और खेती में नवीकरणीय ऊर्जा को बढ़ावा देने के लिए सौर पंप स्थापना और कृषि पंपों का सौरीकरण।',
    targetStates: ['All India'],
    tags: ['solar-energy', 'subsidy', 'irrigation', 'renewable'],
  },
  {
    name: 'Drone Didi / Namo Drone Didi Scheme',
    nameHindi: 'ड्रोन दीदी / नमो ड्रोन दीदी योजना',
    category: 'training',
    ministry: 'Ministry of Agriculture & Ministry of Women & Child Development',
    launchYear: 2023,
    benefitAmount: '₹15,000 stipend during training + free drone unit to SHG',
    eligibility: [
      'Women Self-Help Groups (SHGs)',
      'Rural women aged 18-45',
      'Class 10 pass minimum education',
      'Must be member of active SHG linked to bank',
      '15,000 SHGs targeted across India',
    ],
    documents: ['Aadhaar Card', 'SHG Membership Certificate', 'Bank Account', '10th Pass Certificate', 'Photograph'],
    applicationUrl: 'https://agricoop.gov.in',
    description: 'Empowering rural women SHGs with agricultural drones for crop spraying services. Promotes women entrepreneurship, youth employment in modern agri-technology. Training includes drone operation, maintenance, and business management.',
    descriptionHindi: 'ग्रामीण महिला SHGs को कृषि ड्रोन से सशक्त बनाना। आधुनिक कृषि प्रौद्योगिकी में महिला उद्यमिता और युवा रोजगार को बढ़ावा।',
    targetStates: ['All India'],
    tags: ['women-empowerment', 'drone', 'training', 'youth', 'technology'],
  },
  {
    name: 'KCC (Kisan Credit Card)',
    nameHindi: 'किसान क्रेडिट कार्ड',
    category: 'loan',
    ministry: 'Ministry of Finance / RBI / NABARD',
    launchYear: 1998,
    benefitAmount: 'Credit up to ₹3 lakh at 4% interest (with 3% subvention); above ₹3 lakh at 7%',
    eligibility: [
      'All farmers - individual/joint borrowers',
      'Tenant farmers, Oral lessees, Share croppers',
      'SHGs or Joint Liability Groups of farmers',
      'No prior loan default',
      'Valid land records required',
    ],
    documents: ['Aadhaar Card', 'Land Records', 'Passport Photograph', 'Bank Account', 'Crop Plan'],
    applicationUrl: 'https://www.nabard.org/content.aspx?id=591',
    description: 'Flexible credit facility to meet short-term credit requirements for crop cultivation, post-harvest expenses, maintenance of farm assets, and allied activities.',
    descriptionHindi: 'फसल उत्पादन, कटाई के बाद खर्च और कृषि संबद्ध गतिविधियों के लिए लचीला क्रेडिट।',
    targetStates: ['All India'],
    tags: ['loan', 'credit', 'interest-subvention', 'short-term'],
  },
  {
    name: 'SMAM (Sub-Mission on Agricultural Mechanization)',
    nameHindi: 'कृषि यंत्रीकरण उप-मिशन',
    category: 'subsidy',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    launchYear: 2014,
    benefitAmount: '25-50% subsidy on farm machinery (SC/ST/women farmers get higher subsidy)',
    eligibility: [
      'All categories of farmers',
      'SC/ST farmers get 50% subsidy',
      'General category: 25-40%',
      'Women farmers: additional benefit',
      'One-time benefit per machine category',
    ],
    documents: ['Aadhaar Card', 'Land Records', 'Caste Certificate (for SC/ST)', 'Bank Account', 'Machine Quotation'],
    applicationUrl: 'https://agrimachinery.nic.in',
    description: 'Promoting farm mechanization by providing subsidies on purchase of agricultural machinery like tractors, threshers, seed drills, sprayers, and harvesters.',
    descriptionHindi: 'ट्रैक्टर, थ्रेशर, सीड ड्रिल, स्प्रेयर जैसी कृषि मशीनरी की खरीद पर सब्सिडी।',
    targetStates: ['All India'],
    tags: ['machinery', 'subsidy', 'mechanization', 'tractor'],
  },
  {
    name: 'National Beekeeping & Honey Mission (NBHM)',
    nameHindi: 'राष्ट्रीय मधुमक्खी पालन एवं शहद मिशन',
    category: 'central',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    launchYear: 2020,
    benefitAmount: 'Up to ₹5,000 per bee colony; training and equipment subsidy',
    eligibility: [
      'Farmers, rural youths interested in beekeeping',
      'SHGs and FPOs',
      'Women entrepreneurs',
      'Age 18-55 years',
    ],
    documents: ['Aadhaar Card', 'Bank Account', 'Farmer ID / Land Record', 'Training Certificate (if any)'],
    applicationUrl: 'https://www.nhb.gov.in',
    description: 'Promoting beekeeping and honey production as allied income for farmers. Provides training, equipment (hive boxes, extractors), and market linkage. "Sweet Revolution" initiative.',
    descriptionHindi: 'किसानों के लिए सहायक आय के रूप में मधुमक्खी पालन को बढ़ावा। प्रशिक्षण, उपकरण और बाजार संपर्क।',
    targetStates: ['All India'],
    tags: ['allied-farming', 'beekeeping', 'youth', 'honey'],
  },
  {
    name: 'PMEGP (PM Employment Generation Programme)',
    nameHindi: 'प्रधानमंत्री रोजगार सृजन कार्यक्रम',
    category: 'loan',
    ministry: 'Ministry of MSME / KVIC',
    launchYear: 2008,
    benefitAmount: '15-35% margin money subsidy on project cost (up to ₹50 lakh manufacturing / ₹20 lakh service)',
    eligibility: [
      'Any individual above 18 years',
      'Minimum VIII class pass for projects above ₹10 lakh',
      'SHGs, Institutions, Production Cooperative Societies',
      'Existing units and beneficiaries of other govt subsidy not eligible',
    ],
    documents: ['Aadhaar Card', 'Education Certificate', 'Project Report', 'Bank Account', 'Caste Certificate (if applicable)'],
    applicationUrl: 'https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp',
    description: 'Employment generation through establishment of micro-enterprises in non-farm sector in rural and urban areas. Agro-processing, food processing, and dairy units are eligible.',
    descriptionHindi: 'ग्रामीण और शहरी क्षेत्रों में सूक्ष्म उद्यमों की स्थापना के माध्यम से रोजगार सृजन। कृषि-प्रसंस्करण इकाइयाँ पात्र।',
    targetStates: ['All India'],
    tags: ['employment', 'youth', 'loan', 'agro-processing', 'entrepreneur'],
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Crop.deleteMany({});
    await CropSchedule.deleteMany({});
    await GovtScheme.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert Crops
    const insertedCrops = await Crop.insertMany(cropsData);
    console.log(`🌾 Seeded ${insertedCrops.length} crops`);

    // Map crop names to IDs
    const cropMap = {};
    insertedCrops.forEach(crop => { cropMap[crop.name] = crop._id; });

    // Insert CropSchedules with real crop IDs
    const schedulesWithIds = cropSchedulesData.map(schedule => ({
      ...schedule,
      cropId: cropMap[schedule.cropName],
    }));
    const insertedSchedules = await CropSchedule.insertMany(schedulesWithIds);
    console.log(`📅 Seeded ${insertedSchedules.length} crop schedules`);

    // Insert GovtSchemes
    const insertedSchemes = await GovtScheme.insertMany(govtSchemesData);
    console.log(`📋 Seeded ${insertedSchemes.length} government schemes`);

    console.log('\n✨ Database seeding complete! Krishi Mitra is ready.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();
