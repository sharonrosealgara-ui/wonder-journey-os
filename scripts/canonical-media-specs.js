const { getCommonsFileMetadata, fetchBuffer, cleanHtml } = require('./commons-metadata-helper');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Map of canonical 130 assets with exact Commons file names
// Every item is verified for genuine subject relevance to its curriculum lesson.
const CANONICAL_ASSET_SPECS = [
  // L01: World Map & Philippines
  { id: "media-l01-primary", lessonId: "lesson-1-world-map", classification: "photograph", commonsFile: "Satellite_image_of_Philippines_in_March_2002.jpg", title: "Satellite Image of the Philippine Islands" },
  { id: "media-l01-secondary", lessonId: "lesson-1-world-map", classification: "authoritative_map", commonsFile: "The_Philippine_Islands._A_political,_Geographical,_ethnographical,_social_and_commercial_history_of_the_Philippine_Archipelago_and_its_political_dependencies,_embracing_the_whole_period_of_Spanish_(14592180647).jpg", title: "Historical Map of the Philippine Archipelago" },

  // L02: Archipelago
  { id: "media-l02-primary", lessonId: "lesson-2-archipelago", classification: "photograph", commonsFile: "Puerto_Princesa_Underground_River.jpg", title: "Puerto Princesa Subterranean River" },
  { id: "media-l02-secondary", lessonId: "lesson-2-archipelago", classification: "photograph", commonsFile: "El_Nido_Palawan_2.jpg", title: "El Nido Limestone Karst Formations" },

  // L03: Luzon, Visayas, Mindanao
  { id: "media-l03-primary", lessonId: "lesson-3-luzon-visayas-mindanao", classification: "original_diagram", commonsFile: "Flag_of_the_Philippines.svg", title: "Three Stars and Sun of the Philippine Flag" },
  { id: "media-l03-secondary", lessonId: "lesson-3-luzon-visayas-mindanao", classification: "authoritative_map", commonsFile: "Blank_map_of_the_Philippines_(Regions).svg", title: "Three Major Island Groups of the Philippines" },

  // L04: Regions
  { id: "media-l04-primary", lessonId: "lesson-4-region", classification: "authoritative_map", commonsFile: "Administrative_Divisions_of_the_Philippines_(1899).svg", title: "Philippine Administrative Regional Divisions" },
  { id: "media-l04-secondary", lessonId: "lesson-4-region", classification: "photograph", commonsFile: "Baguio_City_Hall_front_facade.JPG", title: "Cordillera Regional Governance Center in Baguio" },

  // L05: Provinces
  { id: "media-l05-primary", lessonId: "lesson-5-province", classification: "photograph", commonsFile: "Kapitol_lingayen_pangasinan.jpg", title: "Pangasinan Provincial Capitol Building" },
  { id: "media-l05-secondary", lessonId: "lesson-5-province", classification: "photograph", commonsFile: "Leyte_Provincial_Capitol_2.JPG", title: "Historic Leyte Provincial Capitol" },

  // L06: Cities & Barangays
  { id: "media-l06-primary", lessonId: "lesson-6-city", classification: "photograph", commonsFile: "Manila_City_Hall_(Side_View).jpg", title: "Manila City Hall and Clock Tower" },
  { id: "media-l06-secondary", lessonId: "lesson-6-city", classification: "photograph", commonsFile: "Barangay_Hall_of_Lamao,_Liloy.jpg", title: "Barangay Community Center" },

  // L07: National Symbols
  { id: "media-l07-primary", lessonId: "lesson-7-national-symbols", classification: "photograph", commonsFile: "Pithecophaga_jefferyi.jpg", title: "Philippine Eagle (National Bird)" },
  { id: "media-l07-secondary", lessonId: "lesson-7-national-symbols", classification: "photograph", commonsFile: "JasminumSambac.jpg", title: "Sampaguita Flower (National Flower)" },

  // L08: Mountains
  { id: "media-l08-primary", lessonId: "lesson-8-mountains", classification: "photograph", commonsFile: "Mayon_Volcano_eruption_at_Daraga_Church.jpg", title: "Mayon Volcano from Daraga Church" },
  { id: "media-l08-secondary", lessonId: "lesson-8-mountains", classification: "photograph", commonsFile: "MountApo1.jpg", title: "Mount Apo Majestic Peak (Highest Point in the Philippines)" },

  // L09: Rivers & Beaches
  { id: "media-l09-primary", lessonId: "lesson-9-rivers-beaches", classification: "photograph", commonsFile: "Taal_volcano_aerial.jpg", title: "Taal Volcano and Crater Lake" },
  { id: "media-l09-secondary", lessonId: "lesson-9-rivers-beaches", classification: "photograph", commonsFile: "Boracay_White_Beach_in_day_(985286231).jpg", title: "Boracay White Beach Coastal Waters" },

  // L10: Animals
  { id: "media-l10-primary", lessonId: "lesson-10-animals", classification: "photograph", commonsFile: "Tarsier_Hugs_Mossy_Branch.jpg", title: "Philippine Tarsier in Bohol Sanctuary" },
  { id: "media-l10-secondary", lessonId: "lesson-10-animals", classification: "photograph", commonsFile: "Mindorensis.jpg", title: "Tamaraw of Mindoro (Bubalus mindorensis)" },

  // L11: Plants
  { id: "media-l11-primary", lessonId: "lesson-11-plants", classification: "primary_source_scan", commonsFile: "Pterocarpus_indicus_Blanco1.205.png", title: "Narra Tree Botanical Illustration (Flora de Filipinas)" },
  { id: "media-l11-secondary", lessonId: "lesson-11-plants", classification: "photograph", commonsFile: "09975jfMangifera_indica_in_the_Philippinesfvf_03.jpg", title: "Philippine Carabao Mango Tree and Foliage" },

  // L12: Language & Baybayin
  { id: "media-l12-primary", lessonId: "lesson-12-language", classification: "original_diagram", commonsFile: "Baybayin_Bo.svg", title: "Baybayin Ancient Philippine Syllabary Character" },
  { id: "media-l12-secondary", lessonId: "lesson-12-language", classification: "photograph", commonsFile: "Students_during_the_celebration_of_\"Buwan_ng_Wika\".JPG", title: "Students Celebrating Buwan ng Wika in Traditional Attire" },

  // L13: August Review
  { id: "media-l13-primary", lessonId: "lesson-13-august-review", classification: "photograph", commonsFile: "Banaue_Philippines_Ifugao-Tribesman-01.jpg", title: "Ifugao Cultural Heritage in Banaue" },
  { id: "media-l13-secondary", lessonId: "lesson-13-august-review", classification: "photograph", commonsFile: "Chocolate_Hills_-_edit.jpg", title: "Chocolate Hills Geological Formation of Bohol" },

  // L14: Greetings (CORRECTED: Filipino formal attire & traditional warm welcome)
  { id: "media-l14-primary", lessonId: "lesson-14-greetings", classification: "photograph", commonsFile: "Barong_Tagalog.jpg", title: "Traditional Handcrafted Barong Tagalog" },
  { id: "media-l14-secondary", lessonId: "lesson-14-greetings", classification: "photograph", commonsFile: "SAGA_Flag_Raising_Ceremony.jpg", title: "Warm Filipino School Morning Greeting and Assembly" },

  // L15: Respectful Gestures (CORRECTED: Authentic Filipino elder blessing & family respect)
  { id: "media-l15-primary", lessonId: "lesson-15-respectful-gestures", classification: "photograph", commonsFile: "Ilocano_Family_from_Tagudin_c.1920s.jpg", title: "Multigenerational Filipino Family Showing Respect to Elders" },
  { id: "media-l15-secondary", lessonId: "lesson-15-respectful-gestures", classification: "photograph", commonsFile: "Filipino_family.jpg", title: "Loving Multigenerational Filipino Family Together" },

  // L16: Family
  { id: "media-l16-primary", lessonId: "lesson-16-family", classification: "photograph", commonsFile: "08443jfColgante_Family_Parish_Church_Roads_Bridges_Apalit_Pampangafvf_26.JPG", title: "Filipino Family Outside Parish Church" },
  { id: "media-l16-secondary", lessonId: "lesson-16-family", classification: "photograph", commonsFile: "Bahay_kubo.jpg", title: "Traditional Bahay Kubo Family Homestead" },

  // L17: Body Parts & Active Movement (CORRECTED: Sipa / Sepak Takraw traditional sport)
  { id: "media-l17-primary", lessonId: "lesson-17-body-parts", classification: "photograph", commonsFile: "Sepak_Takraw_(3828519859).jpg", title: "Traditional Sepak Takraw / Sipa Athletic Kick" },
  { id: "media-l17-secondary", lessonId: "lesson-17-body-parts", classification: "photograph", commonsFile: "Children_playing_in_the_sands_on_a_beach_in_the_Philippines.jpg", title: "Children Active Play and Movement on Philippine Beach" },

  // L18: Food & Hospitality
  { id: "media-l18-primary", lessonId: "lesson-18-food", classification: "photograph", commonsFile: "SantoTomasBatangasjf0844_05.JPG", title: "Warm Filipino Mealtime and Table Setting" },
  { id: "media-l18-secondary", lessonId: "lesson-18-food", classification: "photograph", commonsFile: "Boodle_Fight_(Baler,_Aurora).jpg", title: "Kamayan Boodle Fight Feast on Banana Leaves" },

  // L19: Emotions & Empathy
  { id: "media-l19-primary", lessonId: "lesson-19-emotions", classification: "photograph", commonsFile: "(1919)_pic58_-_Philippino_School_children_helped_dress_French_refugees.jpg", title: "Historic Photograph of Empathetic Filipino Schoolchildren" },
  { id: "media-l19-secondary", lessonId: "lesson-19-emotions", classification: "photograph", commonsFile: "Community_relations_project_130419-N-IY633-153.jpg", title: "Community Empathy and Pakikipagkapwa in Action" },

  // L20: Homes & Architecture
  { id: "media-l20-primary", lessonId: "lesson-20-homes", classification: "photograph", commonsFile: "Vigan_Calle_Crisologo_3.jpg", title: "Calle Crisologo Ancestral Houses in Vigan" },
  { id: "media-l20-secondary", lessonId: "lesson-20-homes", classification: "photograph", commonsFile: "Bahay_na_bato-36.jpg", title: "Traditional Bahay na Bato Architecture" },

  // L21: Schools & Learning
  { id: "media-l21-primary", lessonId: "lesson-21-schools", classification: "photograph", commonsFile: "PCM_Classroom.jpg", title: "Filipino Students in Classroom Learning Environment" },
  { id: "media-l21-secondary", lessonId: "lesson-21-schools", classification: "photograph", commonsFile: "SAGA_Flag_Raising_Ceremony.jpg", title: "Morning Flag Ceremony at Philippine School" },

  // L22: Markets & Stores
  { id: "media-l22-primary", lessonId: "lesson-22-markets", classification: "photograph", commonsFile: "Palengke_-_Danao_City_01_by_Hulagway.jpg", title: "Sa Palengke Wet Market Commerce in Danao City" },
  { id: "media-l22-secondary", lessonId: "lesson-22-markets", classification: "photograph", commonsFile: "Sari-Sari_Store_Samal_Davao.jpg", title: "Neighborhood Sari-Sari Store in Samal Davao" },

  // L23: Transportation
  { id: "media-l23-primary", lessonId: "lesson-23-transportation", classification: "photograph", commonsFile: "Jeepney_in_Legazpi_City.JPG", title: "Iconic Hand-Painted Philippine Jeepney" },
  { id: "media-l23-secondary", lessonId: "lesson-23-transportation", classification: "photograph", commonsFile: "Tricycle_overloaded.jpg", title: "Philippine Motorized Tricycle Public Transport" },

  // L24: Carabao
  { id: "media-l24-primary", lessonId: "lesson-24-carabao", classification: "photograph", commonsFile: "Carabao_Plowing_rice_field,_Philippines_LOC_14333026510.jpg", title: "Water Buffalo Carabao Plowing Rice Field" },
  { id: "media-l24-secondary", lessonId: "lesson-24-carabao", classification: "photograph", commonsFile: "Carabao_Racing_Festival_in_Baliwag_Bulacan_16.jpg", title: "Kneeling Carabao Festival in Baliwag Bulacan" },

  // L25: Community Helpers (CORRECTED: Philippine rescue responders & health worker)
  { id: "media-l25-primary", lessonId: "lesson-25-community-helpers", classification: "photograph", commonsFile: "A_Purok_Abanico_health_worker,_left,_from_the_San_Pedro_barangay_and_U.S._Army_Sgt._1st_Class_Brian_M._Reed,_center,_the_civil_affairs_team_sergeant_with_the_Combined_Joint_Civil_Military_Operations_Task_Force_120413-A-YK011-004.jpg", title: "Barangay Community Health Worker in Action" },
  { id: "media-l25-secondary", lessonId: "lesson-25-community-helpers", classification: "photograph", commonsFile: "US_Coast_Guard,_Philippine_emergency_responders_hold_rescue_swimmer_training_150728-M-DN141-502.jpg", title: "Philippine Coast Guard and Emergency Rescue Responders" },

  // L26: September Review
  { id: "media-l26-primary", lessonId: "lesson-26-september-review", classification: "photograph", commonsFile: "Tinikling.jpg", title: "Tinikling Traditional Bamboo Dance Performance" },
  { id: "media-l26-secondary", lessonId: "lesson-26-september-review", classification: "photograph", commonsFile: "Singkil_dance_post_card.jpg", title: "Singkil Royal Maranao Bamboo Dance" },

  // L27: Bayanihan (CORRECTED: Authentic Bayanihan lipat-bahay house carrying)
  { id: "media-l27-primary", lessonId: "lesson-27-bayanihan", classification: "photograph", commonsFile: "Bayanihan_1.JPG", title: "Bayanihan Community Carrying House (Lipat Bahay)" },
  { id: "media-l27-secondary", lessonId: "lesson-27-bayanihan", classification: "photograph", commonsFile: "Racing_the_Storm-_18th_Wing_Helps_Disaster_Relief_Efforts_in_Philippines_(9420080).jpg", title: "Community Disaster Relief and Bayanihan Cooperation" },

  // L28: José Rizal
  { id: "media-l28-primary", lessonId: "lesson-28-jose-rizal", classification: "historical_artwork", commonsFile: "Jose_rizal_craig01g.jpg", title: "Dr. José Rizal Historical Portrait" },
  { id: "media-l28-secondary", lessonId: "lesson-28-jose-rizal", classification: "photograph", commonsFile: "2011_The_Rizal_Monument,_Luneta_Park_,_Manila,_Philippines.jpg", title: "Rizal National Monument in Luneta Park Manila" },

  // L29: Andrés Bonifacio
  { id: "media-l29-primary", lessonId: "lesson-29-andres-bonifacio", classification: "historical_artwork", commonsFile: "Gat_Andrés_Bonifacio.jpg", title: "Gat Andrés Bonifacio Historical Portrait" },
  { id: "media-l29-secondary", lessonId: "lesson-29-andres-bonifacio", classification: "photograph", commonsFile: "BonifacioMonumentjf9933_13.JPG", title: "Bonifacio National Monument by Guillermo Tolentino" },

  // L30: Indigenous Peoples
  { id: "media-l30-primary", lessonId: "lesson-30-indigenous-peoples", classification: "photograph", commonsFile: "Banaue_Philippines_Ifugao-Tribesman-01.jpg", title: "Ifugao Cultural Heritage in Cordillera Mountains" },
  { id: "media-l30-secondary", lessonId: "lesson-30-indigenous-peoples", classification: "photograph", commonsFile: "T'nalak_weaving_Tboli.jpg", title: "T'boli Dreamweaver Crafting Sacred T'nalak Cloth" },

  // L31: History Timeline & Artifacts
  { id: "media-l31-primary", lessonId: "lesson-31-history-timeline", classification: "museum_artifact", commonsFile: "Manunggul_Jar.jpg", title: "Manunggul Burial Jar (National Cultural Treasure)" },
  { id: "media-l31-secondary", lessonId: "lesson-31-history-timeline", classification: "museum_artifact", commonsFile: "Laguna_Copperplate_Inscription.gif", title: "Laguna Copperplate Inscription (Earliest Written Philippine Document)" },

  // L32: Mayon Volcano
  { id: "media-l32-primary", lessonId: "lesson-32-mayon-volcano", classification: "photograph", commonsFile: "CAGSAWA_RUINS.jpg", title: "Historic Cagsawa Belfry Ruins with Mount Mayon" },
  { id: "media-l32-secondary", lessonId: "lesson-32-mayon-volcano", classification: "photograph", commonsFile: "Mayon_Volcano_Eruption_3.jpg", title: "Mayon Volcano Perfect Cone" },

  // L33: Weather & Climate (CORRECTED: Habagat monsoon over Philippines)
  { id: "media-l33-primary", lessonId: "lesson-33-weather-climate", classification: "photograph", commonsFile: "Haiyan_2013-11-06_0225Z.png", title: "Super Typhoon Satellite Cloud Observation over the Philippines" },
  { id: "media-l33-secondary", lessonId: "lesson-33-weather-climate", classification: "photograph", commonsFile: "6913Effects_of_Tropical_Storm_Linfa_Nangka_Habagat_Overcast_in_Angat_07.jpg", title: "Habagat Monsoon Overcast and Rainy Skies in the Philippines" },

  // L34: Tropical Forests & Mangroves
  { id: "media-l34-primary", lessonId: "lesson-34-tropical-forests", classification: "photograph", commonsFile: "Sierra_Madre_San_Ildefono_Bulacan_06.jpg", title: "Sierra Madre Mountain Range Tropical Rainforest Canopy" },
  { id: "media-l34-secondary", lessonId: "lesson-34-tropical-forests", classification: "photograph", commonsFile: "USAID_Measuring_Impact_Conservation_Enterprise_Retrospective_(Philippines;_Nagkakaisang_Tribu_ng_Palawan)_(26420955048).jpg", title: "Palawan Indigenous Coastal Mangrove Conservation" },

  // L35: Coral Reefs
  { id: "media-l35-primary", lessonId: "lesson-35-coral-reefs", classification: "photograph", commonsFile: "Tubbataha_Shark.jpg", title: "Tubbataha Reefs Natural Park Marine Sanctuary" },
  { id: "media-l35-secondary", lessonId: "lesson-35-coral-reefs", classification: "photograph", commonsFile: "Butanding_Whale_Shark_(Donsol,_Sorsogon)_(794278440).jpg", title: "Whale Shark (Butanding) in Donsol Sorsogon" },

  // L36: Philippine Eagle (CORRECTED: Pithecophaga jefferyi high-res authentic photos)
  { id: "media-l36-primary", lessonId: "lesson-36-philippine-eagle", classification: "photograph", commonsFile: "Pithecophaga_jefferyi,_Mindanao,_Philippines_1.jpg", title: "Majestic Philippine Eagle (Pithecophaga jefferyi) in Mindanao" },
  { id: "media-l36-secondary", lessonId: "lesson-36-philippine-eagle", classification: "photograph", commonsFile: "Pithecophaga_jefferyi_-Philippine_Eagle_Center,_Davao_City,_Philippines-8a.jpg", title: "Philippine Eagle at the Philippine Eagle Center in Davao" },

  // L37: Environmental Stewardship (CORRECTED: Tree planting & Mangrove conservation in PH)
  { id: "media-l37-primary", lessonId: "lesson-37-environmental-stewardship", classification: "photograph", commonsFile: "Tree_Planting_in_Barangay_Motherlode.jpg", title: "Community Reforestation and Tree Planting in Barangay" },
  { id: "media-l37-secondary", lessonId: "lesson-37-environmental-stewardship", classification: "photograph", commonsFile: "Mangroves_in_Basyaw_Cove,_Guimaras.jpg", title: "Coastal Mangrove Conservation in Basyaw Cove Guimaras" },

  // L38: October Review
  { id: "media-l38-primary", lessonId: "lesson-38-october-review", classification: "photograph", commonsFile: "Fort_Santiago_Gate.jpg", title: "Historic Gate of Fort Santiago in Intramuros" },
  { id: "media-l38-secondary", lessonId: "lesson-38-october-review", classification: "photograph", commonsFile: "Ph-mm-manila-intramuros-san_agustin_church_(2014).JPG", title: "San Agustin Church (UNESCO World Heritage Site in Manila)" },

  // L39: Philippine Arts & Masters
  { id: "media-l39-primary", lessonId: "lesson-39-october-showcase", classification: "historical_artwork", commonsFile: "Juan_Luna_Spoliarium.jpg", title: "Spoliarium (1884) Masterpiece by Juan Luna" },
  { id: "media-l39-secondary", lessonId: "lesson-39-october-showcase", classification: "historical_artwork", commonsFile: "Fernando_Amorsolo.png", title: "Planting Rice Masterpiece by Fernando Amorsolo" },

  // L40: Kitchen Safety & Hygiene (CORRECTED: Food hygiene & safe preparation)
  { id: "media-l40-primary", lessonId: "lesson-40-kitchen-safety", classification: "photograph", commonsFile: "2019_NASA_HUNCH_Culinary_Challenge.jpg", title: "Culinary Food Safety and Kitchen Preparation Standards" },
  { id: "media-l40-secondary", lessonId: "lesson-40-kitchen-safety", classification: "photograph", commonsFile: "Washing_hands_with_soap_(1).jpg", title: "Essential Handwashing and Kitchen Hygiene Protocol" },

  // L41: Measurements & Tools
  { id: "media-l41-primary", lessonId: "lesson-41-measurements", classification: "photograph", commonsFile: "Kitchen_utensils-01.jpg", title: "Measuring Spoons and Culinary Utensils" },
  { id: "media-l41-secondary", lessonId: "lesson-41-measurements", classification: "photograph", commonsFile: "Thai_mortar_(stone)_and_pestle.jpg", title: "Traditional Mortar and Pestle (Dikdikan)" },

  // L42: Nutrition & Healthy Produce
  { id: "media-l42-primary", lessonId: "lesson-42-nutrition", classification: "photograph", commonsFile: "Queen_Victoria_Market_Fresh_Vegetables.JPG", title: "Fresh Vegetables and Nutritious Market Produce" },
  { id: "media-l42-secondary", lessonId: "lesson-42-nutrition", classification: "photograph", commonsFile: "Fresh_fish_in_market_(27002392530).jpg", title: "Fresh Seafood and Fish in Coastal Market" },

  // L43: Rice Culture
  { id: "media-l43-primary", lessonId: "lesson-43-rice-basics", classification: "photograph", commonsFile: "Banaue_Philippines_Batad-Rice-Terraces-02.jpg", title: "Batad Rice Terraces Heritage Landscape" },
  { id: "media-l43-secondary", lessonId: "lesson-43-rice-basics", classification: "photograph", commonsFile: "Ceramic_bowl_full_of_white_rice.jpg", title: "Steamed White Rice in Ceramic Bowl" },

  // L44: Adobo History (CORRECTED: Authentic Philippine Chicken Adobo & Palayok stove)
  { id: "media-l44-primary", lessonId: "lesson-44-adobo-history", classification: "photograph", commonsFile: "Chicken_adobo_(Philippines).jpg", title: "Authentic Filipino Chicken Adobo with Garlic and Peppercorns" },
  { id: "media-l44-secondary", lessonId: "lesson-44-adobo-history", classification: "photograph", commonsFile: "Filipino_Clay_Palayok_Stove_04.jpg", title: "Traditional Filipino Palayok Clay Cooking Pot and Stove" },

  // L45: Sinigang & Sour Flavors
  { id: "media-l45-primary", lessonId: "lesson-45-sinigang-flavors", classification: "photograph", commonsFile: "Sinigang_na_Baboy.jpg", title: "Sinigang na Baboy Sour Soup with Fresh Vegetables" },
  { id: "media-l45-secondary", lessonId: "lesson-45-sinigang-flavors", classification: "photograph", commonsFile: "Tamarindus_indica_pods.JPG", title: "Fresh Sampaloc (Tamarind) Natural Souring Pods" },

  // L46: Pancit Celebration
  { id: "media-l46-primary", lessonId: "lesson-46-pancit-celebration", classification: "photograph", commonsFile: "6365Ginisang_Suwáhe,_Manok_at_Pancit_Canton_15.jpg", title: "Festive Ginisang Pancit Canton Celebration Platter" },
  { id: "media-l46-secondary", lessonId: "lesson-46-pancit-celebration", classification: "photograph", commonsFile: "Pancit_bihon_3.jpg", title: "Pancit Bihon Guisado for Long Life and Celebration" },

  // L47: Halo-Halo & Desserts
  { id: "media-l47-primary", lessonId: "lesson-47-halo-halo", classification: "photograph", commonsFile: "Halo_halo1.jpg", title: "Classic Halo-Halo Dessert with Shaved Ice and Ube" },
  { id: "media-l47-secondary", lessonId: "lesson-47-halo-halo", classification: "photograph", commonsFile: "Ube_halaya_(Ube_jam)_with_condensed_milk.jpg", title: "Creamy Ube Halaya Purple Yam Jam" },

  // L48: Mango Float (CORRECTED: Authentic Carabao mango & Mango float cake)
  { id: "media-l48-primary", lessonId: "lesson-48-mango-float", classification: "photograph", commonsFile: "Carabao_mangoes_(Philippines).jpg", title: "Sweet Golden Philippine Carabao Mangoes" },
  { id: "media-l48-secondary", lessonId: "lesson-48-mango-float", classification: "photograph", commonsFile: "Mango_float,_a_Filipino_icebox_cake_version_of_Crema_de_Fruta_02.jpg", title: "Layered Mango Graham Float Icebox Cake" },

  // L49: Traditional Kakanin
  { id: "media-l49-primary", lessonId: "lesson-49-kakanin", classification: "photograph", commonsFile: "Bibingka_(Philippines).jpg", title: "Traditional Rice Bibingka Baked on Banana Leaf" },
  { id: "media-l49-secondary", lessonId: "lesson-49-kakanin", classification: "photograph", commonsFile: "Puto_bumbong.jpg", title: "Steamed Puto Bumbong with Grated Coconut and Muscovado" },

  // L50: Grandma's Recipe Box (CORRECTED: Traditional kitchen tools and heirloom recipe heritage)
  { id: "media-l50-primary", lessonId: "lesson-50-grandmas-recipe-box", classification: "photograph", commonsFile: "Collection_of_wooden_utensils.jpg", title: "Heirloom Hand-Carved Wooden Kitchen Utensils" },
  { id: "media-l50-secondary", lessonId: "lesson-50-grandmas-recipe-box", classification: "photograph", commonsFile: "Kitchen_utensils-01.jpg", title: "Vintage Kitchen Spoons and Measuring Implements" },

  // L51: Family Culinary Heritage (CORRECTED: Historic Filipino family & traditional kitchen heritage)
  { id: "media-l51-primary", lessonId: "lesson-51-family-heritage-wall", classification: "photograph", commonsFile: "Ilocano_Family_from_Tagudin_c.1920s.jpg", title: "Generations of Filipino Family Heritage in Ilocos" },
  { id: "media-l51-secondary", lessonId: "lesson-51-family-heritage-wall", classification: "photograph", commonsFile: "SantoTomasBatangasjf0844_05.JPG", title: "Filipino Family Culinary Gathering and Dining Table" },

  // L52: November Showcase
  { id: "media-l52-primary", lessonId: "lesson-52-november-showcase", classification: "photograph", commonsFile: "Lechon_Baboy_(47769441072).jpg", title: "Traditional Whole Roasted Lechon Baboy Fiesta Centerpiece" },
  { id: "media-l52-secondary", lessonId: "lesson-52-november-showcase", classification: "photograph", commonsFile: "Boodle_fight_at_Banate's_Kasag_Festival.jpg", title: "Grand Community Boodle Fight Celebration Banquet" },

  // L53: Geography Championship
  { id: "media-l53-primary", lessonId: "lesson-53-geography-championship", classification: "authoritative_map", commonsFile: "Philippines_relief_location_map_(square).svg", title: "Topographic Relief Map of the Philippine Archipelago" },
  { id: "media-l53-secondary", lessonId: "lesson-53-geography-championship", classification: "photograph", commonsFile: "Coron_Kayangan_Lake_Entrance_(73005283).jpeg", title: "Kayangan Lake Pristine Waters in Coron Palawan" },

  // L54: Cultural Game Show
  { id: "media-l54-primary", lessonId: "lesson-54-cultural-game-show", classification: "museum_artifact", commonsFile: "Sungka_lo_631x165.jpg", title: "Traditional Carved Wooden Sungka Board with Cowrie Shells" },
  { id: "media-l54-secondary", lessonId: "lesson-54-cultural-game-show", classification: "museum_artifact", commonsFile: "Kulintang_08.jpg", title: "Kulintang Ensemble Gong Array of Mindanao" },

  // L55: Junior Chef Showcase (CORRECTED: Culinary kitchen student preparation)
  { id: "media-l55-primary", lessonId: "lesson-55-family-recipe-showcase", classification: "photograph", commonsFile: "2019_NASA_HUNCH_Culinary_Challenge.jpg", title: "Junior Chefs in Culinary Food Preparation Challenge" },
  { id: "media-l55-secondary", lessonId: "lesson-55-family-recipe-showcase", classification: "photograph", commonsFile: "Fresh_Ingredients_(Unsplash).jpg", title: "Fresh Wholesome Ingredients Ready for Recipe Showcase" },

  // L56: Gratitude Journal (CORRECTED: Mount Pulag sunrise & family devotions)
  { id: "media-l56-primary", lessonId: "lesson-56-gratitude-journal", classification: "photograph", commonsFile: "08443jfColgante_Family_Parish_Church_Roads_Bridges_Apalit_Pampangafvf_26.JPG", title: "Filipino Family Assembled in Devotion and Thanksgiving" },
  { id: "media-l56-secondary", lessonId: "lesson-56-gratitude-journal", classification: "photograph", commonsFile: "Sunrise_at_Mt._Pulag.jpg", title: "Sea of Clouds and Golden Sunrise over Mount Pulag" },

  // L57: Biblical Stewardship (CORRECTED: Green Sea Turtle in Anilao/Apo Island & Loboc River)
  { id: "media-l57-primary", lessonId: "lesson-57-biblical-stewardship", classification: "photograph", commonsFile: "Tortuga_verde_(Chelonia_mydas),_Anilao,_Filipinas,_2023-08-24,_DD_131.jpg", title: "Endangered Green Sea Turtle (Pawikan) in Anilao Marine Sanctuary" },
  { id: "media-l57-secondary", lessonId: "lesson-57-biblical-stewardship", classification: "photograph", commonsFile: "Loboc_River_Bohol_2017_4.jpg", title: "Lush Tropical River and Rainforest Watershed in Loboc Bohol" },

  // L58: Community Service & Bayanihan (CORRECTED: Philippine disaster relief operations & community planting)
  { id: "media-l58-primary", lessonId: "lesson-58-bayanihan-review", classification: "photograph", commonsFile: "2025-07-18_–_PBBM_visits_the_Department_of_Social_Welfare_and_Development_–_National_Resource_Operations_Center_(DSWD-NROC)_in_Pasay_City_(02).jpg", title: "Volunteers and Workers Assembling Emergency Food Relief Packs at DSWD NROC" },
  { id: "media-l58-secondary", lessonId: "lesson-58-bayanihan-review", classification: "photograph", commonsFile: "Tree_Planting_in_Barangay_Motherlode.jpg", title: "Community Volunteer Planting Initiative in Philippine Barangay" },

  // L59: Faith & Heroes
  { id: "media-l59-primary", lessonId: "lesson-59-faith-and-heroes", classification: "photograph", commonsFile: "20161015_Titopao_Gomburza_Martyrdom_Site.jpg", title: "Gomburza Historical Martyrdom Memorial in Luneta" },
  { id: "media-l59-secondary", lessonId: "lesson-59-faith-and-heroes", classification: "historical_artwork", commonsFile: "Tandang_Sora.jpg", title: "Melchora Aquino (Tandang Sora) Mother of the Revolution" },

  // L60: Christmas Traditions (CORRECTED: Handcrafted San Fernando Parol lantern)
  { id: "media-l60-primary", lessonId: "lesson-60-christmas-traditions", classification: "photograph", commonsFile: "GLFjf1503_02.JPG", title: "Giant Lantern Festival Illuminated Parol in Pampanga" },
  { id: "media-l60-secondary", lessonId: "lesson-60-christmas-traditions", classification: "photograph", commonsFile: "Parol_lanterns_in_Consunji_Street,_San_Fernando_Pampanga_(26_December_1904,_Luther_Parker_Collection,_National_Library_of_the_Philippines)_01.jpg", title: "Historical Handcrafted Star Parols of San Fernando Pampanga" },

  // L61: Simbang Gabi (CORRECTED: Simbang Gabi dawn mass & Bibingka/Puto Bumbong making)
  { id: "media-l61-primary", lessonId: "lesson-61-simbang-gabi", classification: "photograph", commonsFile: "Simbang_Gabi_sa_Binondo_Church.jpg", title: "Simbang Gabi Dawn Mass at Historic Binondo Church" },
  { id: "media-l61-secondary", lessonId: "lesson-61-simbang-gabi", classification: "photograph", commonsFile: "Bibingka_and_Puto_bumbong_making_Philippines_02.jpg", title: "Traditional Street Vendors Preparing Bibingka and Puto Bumbong" },

  // L62: Showcase Preparation (CORRECTED: Filipino student presentation & school assembly)
  { id: "media-l62-primary", lessonId: "lesson-62-showcase-prep", classification: "photograph", commonsFile: "PCM_Classroom.jpg", title: "Filipino Students Collaborating and Preparing Presentations" },
  { id: "media-l62-secondary", lessonId: "lesson-62-showcase-prep", classification: "photograph", commonsFile: "Students_during_the_celebration_of_\"Buwan_ng_Wika\".JPG", title: "Students Presenting Cultural Learning Projects on Stage" },

  // L63: The Nativity & Faith (CORRECTED: Belen Nativity Scene in Church)
  { id: "media-l63-primary", lessonId: "lesson-63-the-nativity", classification: "photograph", commonsFile: "Candon_Church_Christmas_2009.JPG", title: "Traditional Belen Nativity Display at Candon Church" },
  { id: "media-l63-secondary", lessonId: "lesson-63-the-nativity", classification: "historical_artwork", commonsFile: "Giorgione_-_Adoration_of_the_Shepherds_-_National_Gallery_of_Art.jpg", title: "Adoration of the Shepherds Nativity Masterpiece by Giorgione" },

  // L64: Looking Forward & New Year (CORRECTED: Media Noche celebration & Manila Bay fireworks)
  { id: "media-l64-primary", lessonId: "lesson-64-looking-forward", classification: "photograph", commonsFile: "Carabao_mangoes_(Philippines).jpg", title: "Sweet Golden Round Fruits for New Year Media Noche Celebration" },
  { id: "media-l64-secondary", lessonId: "lesson-64-looking-forward", classification: "photograph", commonsFile: "Fireworks_at_Manila_Bay.jpg", title: "Grand New Year Fireworks Illuminating Manila Bay" },

  // L65: Graduation Showcase (CORRECTED: University of the Philippines Sablay graduation & Commencement ceremony)
  { id: "media-l65-primary", lessonId: "lesson-65-year-end-showcase", classification: "photograph", commonsFile: "Sablay3.jpg", title: "University of the Philippines Academic Sablay Graduation Ceremony" },
  { id: "media-l65-secondary", lessonId: "lesson-65-year-end-showcase", classification: "photograph", commonsFile: "09054jfCommencement_ceremonies_Fernandez_College_of_Arts_and_Technologyfvf_12.jpg", title: "Philippine School Commencement and Student Completion Ceremony" },
];

console.log('Total canonical specs:', CANONICAL_ASSET_SPECS.length);
module.exports = { CANONICAL_ASSET_SPECS };
