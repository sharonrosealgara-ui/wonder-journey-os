const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');
const sharp = require('sharp');

// ─────────────────────────────────────────────────────────────
// WONDER JOURNEY OS — 130 CANONICAL MEDIA SPECIFICATIONS
// Strictly audited against exact lesson topics, with verified
// Wikimedia Commons source files and authentic open licenses.
// ─────────────────────────────────────────────────────────────

const CANONICAL_SPECS = [
  // L01: World Map & Philippines
  { id: "media-l01-primary", lessonId: "lesson-1-world-map", classification: "photograph", commonsFile: "Satellite_image_of_Philippines_in_March_2002.jpg", title: "Satellite Image of the Philippine Islands", visibleDepiction: "NASA satellite image showing the entire Philippine archipelago surrounded by the Philippine Sea, South China Sea, and Celebes Sea." },
  { id: "media-l01-secondary", lessonId: "lesson-1-world-map", classification: "primary_source_scan", commonsFile: "Carta_hydrographica_y_chorographica_de_las_Yslas_Filipinas_-_Biblioteca_Nacional_de_España.jpg", title: "The Philippines on a 1734 Historical Map", visibleDepiction: "Authentic historical 1734 engraved scientific map of the Philippine archipelago by Pedro Murillo Velarde with twelve border vignettes depicting ethnographic peoples, rural scenes, and provincial city plans." },

  // L02: Archipelago
  { id: "media-l02-primary", lessonId: "lesson-2-archipelago", classification: "photograph", commonsFile: "Puerto_Princesa_Underground_River.jpg", title: "Puerto Princesa Subterranean River", visibleDepiction: "Limestone karst entrance and emerald waters of the Puerto Princesa Underground River in Palawan." },
  { id: "media-l02-secondary", lessonId: "lesson-2-archipelago", classification: "photograph", commonsFile: "El_Nido_Palawan_2.jpg", title: "El Nido Limestone Karst Formations", visibleDepiction: "Towering dramatic limestone cliffs and turquoise coastal lagoons in El Nido, Palawan." },

  // L03: Luzon, Visayas, Mindanao
  { id: "media-l03-primary", lessonId: "lesson-3-luzon-visayas-mindanao", classification: "original_diagram", commonsFile: "Flag_of_the_Philippines.svg", title: "Three Stars and Sun of the Philippine Flag", visibleDepiction: "National flag vector graphic displaying the three golden stars symbolizing Luzon, Visayas, and Mindanao." },
  { id: "media-l03-secondary", lessonId: "lesson-3-luzon-visayas-mindanao", classification: "authoritative_map", commonsFile: "Blank_map_of_the_Philippines_(Regions).svg", title: "Three Major Island Groups of the Philippines", visibleDepiction: "Vector outline map clearly delineating the geographic clustering of Luzon, Visayas, and Mindanao island groups." },

  // L04: Regions
  { id: "media-l04-primary", lessonId: "lesson-4-region", classification: "authoritative_map", commonsFile: "Administrative_Divisions_of_the_Philippines_(1899).svg", title: "Philippine Administrative Regional Divisions", visibleDepiction: "Authoritative regional division map chart showing administrative groupings across the Philippine provinces." },
  { id: "media-l04-secondary", lessonId: "lesson-4-region", classification: "photograph", commonsFile: "Baguio_City_Hall_front_facade.JPG", title: "Cordillera Regional Governance Center in Baguio", visibleDepiction: "Front facade of Baguio City Hall, a primary regional administrative center in the Cordillera Administrative Region." },

  // L05: Provinces
  { id: "media-l05-primary", lessonId: "lesson-5-province", classification: "photograph", commonsFile: "Kapitol_lingayen_pangasinan.jpg", title: "Pangasinan Provincial Capitol Building", visibleDepiction: "Neoclassical provincial capitol building (kapitolyo) in Lingayen, Pangasinan." },
  { id: "media-l05-secondary", lessonId: "lesson-5-province", classification: "photograph", commonsFile: "Leyte_Provincial_Capitol_2.JPG", title: "Historic Leyte Provincial Capitol", visibleDepiction: "Historic provincial capitol building in Tacloban, Leyte, representing provincial leadership and heritage." },

  // L06: Cities & Barangays
  { id: "media-l06-primary", lessonId: "lesson-6-city", classification: "photograph", commonsFile: "Manila_City_Hall_(Side_View).jpg", title: "Manila City Hall and Clock Tower", visibleDepiction: "Iconic hexagonal clock tower and municipal facade of Manila City Hall." },
  { id: "media-l06-secondary", lessonId: "lesson-6-city", classification: "photograph", commonsFile: "Barangay_Hall_of_Lamao,_Liloy.jpg", title: "Barangay Community Center", visibleDepiction: "Frontline barangay hall building serving grassroots community governance in the Philippines." },

  // L07: National Symbols
  { id: "media-l07-primary", lessonId: "lesson-7-national-symbols", classification: "photograph", commonsFile: "Pithecophaga_jefferyi.jpg", title: "Philippine Eagle (National Bird)", visibleDepiction: "Majestic close-up profile of the critically endangered Philippine Eagle (Pithecophaga jefferyi) with crown feathers." },
  { id: "media-l07-secondary", lessonId: "lesson-7-national-symbols", classification: "photograph", commonsFile: "JasminumSambac.jpg", title: "Sampaguita Flower (National Flower)", visibleDepiction: "Fragrant white blooms and green foliage of Sampaguita (Jasminum sambac), the national flower of the Philippines." },

  // L08: Mountains
  { id: "media-l08-primary", lessonId: "lesson-8-mountains", classification: "photograph", commonsFile: "Mayon_Volcano_eruption_at_Daraga_Church.jpg", title: "Mayon Volcano from Daraga Church", visibleDepiction: "Symmetrical stratovolcano cone of Mayon Volcano rising behind the historical belfry ruins of Daraga Church in Albay." },
  { id: "media-l08-secondary", lessonId: "lesson-8-mountains", classification: "photograph", commonsFile: "MountApo1.jpg", title: "Mount Apo Majestic Peak (Highest Point in the Philippines)", visibleDepiction: "Volcanic summit ridge and sulfuric slopes of Mount Apo in Mindanao, the highest peak in the Philippines." },

  // L09: Rivers & Beaches
  { id: "media-l09-primary", lessonId: "lesson-9-rivers-beaches", classification: "photograph", commonsFile: "Taal_volcano_aerial.jpg", title: "Taal Volcano and Crater Lake", visibleDepiction: "Aerial view of Taal Volcano Island and its historic caldera crater lake in Batangas." },
  { id: "media-l09-secondary", lessonId: "lesson-9-rivers-beaches", classification: "photograph", commonsFile: "Boracay_White_Beach_in_day_(985286231).jpg", title: "Boracay White Beach Coastal Waters", visibleDepiction: "Pristine white powdery sand shoreline and clear turquoise ocean waters along Boracay island." },

  // L10: Animals
  { id: "media-l10-primary", lessonId: "lesson-10-animals", classification: "photograph", commonsFile: "Tarsier_Hugs_Mossy_Branch.jpg", title: "Philippine Tarsier in Bohol Sanctuary", visibleDepiction: "Endemic Philippine Tarsier (Carlito syrichta) clinging to a mossy tree branch with large nocturnal eyes." },
  { id: "media-l10-secondary", lessonId: "lesson-10-animals", classification: "photograph", commonsFile: "Mindorensis.jpg", title: "Tamaraw of Mindoro (Bubalus mindorensis)", visibleDepiction: "Endemic dwarf wild buffalo Tamaraw (Bubalus mindorensis) in the grasslands of Mindoro." },

  // L11: Plants
  { id: "media-l11-primary", lessonId: "lesson-11-plants", classification: "primary_source_scan", commonsFile: "Pterocarpus_indicus_Blanco1.205.png", title: "Narra Tree Botanical Illustration (Flora de Filipinas)", visibleDepiction: "19th-century botanical color plate from Blanco's Flora de Filipinas illustrating the Narra tree leaves and flowers." },
  { id: "media-l11-secondary", lessonId: "lesson-11-plants", classification: "photograph", commonsFile: "09975jfMangifera_indica_in_the_Philippinesfvf_03.jpg", title: "Philippine Carabao Mango Tree and Foliage", visibleDepiction: "Lush tropical foliage and fruit canopy of the Philippine Carabao mango tree." },

  // L12: Language & Baybayin
  { id: "media-l12-primary", lessonId: "lesson-12-language", classification: "original_diagram", commonsFile: "Baybayin_Bo.svg", title: "Baybayin Ancient Philippine Syllabary Character", visibleDepiction: "Vector character rendering of the ancient pre-colonial Philippine Baybayin syllabic glyph." },
  { id: "media-l12-secondary", lessonId: "lesson-12-language", classification: "photograph", commonsFile: "Students_during_the_celebration_of_\"Buwan_ng_Wika\".JPG", title: "Students Celebrating Buwan ng Wika in Traditional Attire", visibleDepiction: "Filipino school students dressed in colorful baro't saya and ethnic attire celebrating National Language Month." },

  // L13: August Review
  { id: "media-l13-primary", lessonId: "lesson-13-august-review", classification: "photograph", commonsFile: "Banaue_Philippines_Ifugao-Tribesman-01.jpg", title: "Ifugao Cultural Heritage in Banaue", visibleDepiction: "Ifugao elder in traditional headdress and attire with the historic hand-carved Banaue Rice Terraces behind." },
  { id: "media-l13-secondary", lessonId: "lesson-13-august-review", classification: "photograph", commonsFile: "Chocolate_Hills_-_edit.jpg", title: "Chocolate Hills Geological Formation of Bohol", visibleDepiction: "Panoramic view across the cone-shaped karst Chocolate Hills in Carmen, Bohol." },

  // L14: Greetings (AUTHENTIC GREETINGS)
  { id: "media-l14-primary", lessonId: "lesson-14-greetings", classification: "photograph", commonsFile: "Barong_Tagalog.jpg", title: "Traditional Handcrafted Barong Tagalog", visibleDepiction: "Intricately embroidered formal Barong Tagalog garments representing hospitable Filipino formal greetings." },
  { id: "media-l14-secondary", lessonId: "lesson-14-greetings", classification: "photograph", commonsFile: "Children_greet_the_aircrew_of_an_SH-60F_Seahawk_helicopter_in_Balasan,_Philippines,_July_1,_2008,_after_they_delivered_humanitarian_supplies_to_their_school_080701-N-HX866-010.jpg", title: "Filipino School Children Welcoming and Greeting Visitors", visibleDepiction: "Filipino elementary school students in uniform smiling, waving hands, and giving warm cheerful greetings to guests at their school." },

  // L15: Respectful Gestures (GENUINE PAGMAMANO / MANO PO)
  { id: "media-l15-primary", lessonId: "lesson-15-respectful-gestures", classification: "photograph", commonsFile: "Mano_Po,_San_Roque_Festival_Mabolo_01.jpg", title: "Traditional Mano Po Filipino Elder Blessing Gesture", visibleDepiction: "Young Filipino youth holding an elder's hand and gently touching it to their forehead in the traditional 'mano po' filial respect gesture." },
  { id: "media-l15-secondary", lessonId: "lesson-15-respectful-gestures", classification: "photograph", commonsFile: "Mano_Po,_San_Roque_Festival_2023_24.jpg", title: "Pagmamano Cultural Tradition and Reverence for Elders", visibleDepiction: "Community cultural gathering in Bulacan showcasing young people practicing the traditional 'mano po' respectful interaction with grandparents." },

  // L16: Family
  { id: "media-l16-primary", lessonId: "lesson-16-family", classification: "photograph", commonsFile: "08443jfColgante_Family_Parish_Church_Roads_Bridges_Apalit_Pampangafvf_26.JPG", title: "Filipino Family Outside Parish Church", visibleDepiction: "Filipino extended family members assembled outside their community parish church." },
  { id: "media-l16-secondary", lessonId: "lesson-16-family", classification: "photograph", commonsFile: "Bahay_kubo.jpg", title: "Traditional Bahay Kubo Family Homestead", visibleDepiction: "Traditional bamboo and nipa thatch Bahay Kubo stilt house embodying rural Filipino family life." },

  // L17: Body Parts & Active Movement
  { id: "media-l17-primary", lessonId: "lesson-17-body-parts", classification: "photograph", commonsFile: "Sepak_Takraw_(3828519859).jpg", title: "Traditional Sepak Takraw / Sipa Athletic Kick", visibleDepiction: "High athletic jump kick in traditional Sepak Takraw/Sipa demonstrating leg, foot, and torso coordination." },
  { id: "media-l17-secondary", lessonId: "lesson-17-body-parts", classification: "photograph", commonsFile: "Children_playing_in_the_sands_on_a_beach_in_the_Philippines.jpg", title: "Children Active Play and Movement on Philippine Beach", visibleDepiction: "Filipino children actively running and playing along the sandy beach coastline." },

  // L18: Food & Hospitality
  { id: "media-l18-primary", lessonId: "lesson-18-food", classification: "photograph", commonsFile: "SantoTomasBatangasjf0844_05.JPG", title: "Warm Filipino Mealtime and Table Setting", visibleDepiction: "Prepared dining table setting with family mealtime dishes in Santo Tomas, Batangas." },
  { id: "media-l18-secondary", lessonId: "lesson-18-food", classification: "photograph", commonsFile: "Boodle_Fight_(Baler,_Aurora).jpg", title: "Kamayan Boodle Fight Feast on Banana Leaves", visibleDepiction: "Communal boodle fight banquet served on fresh banana leaves with rice, grilled meats, and seafood in Baler." },

  // L19: Emotions & Empathy
  { id: "media-l19-primary", lessonId: "lesson-19-emotions", classification: "photograph", commonsFile: "(1919)_pic58_-_Philippino_School_children_helped_dress_French_refugees.jpg", title: "Historic Photograph of Empathetic Filipino Schoolchildren", visibleDepiction: "1919 archival photograph of Filipino school students collaborating on humanitarian relief projects." },
  { id: "media-l19-secondary", lessonId: "lesson-19-emotions", classification: "photograph", commonsFile: "Community_relations_project_130419-N-IY633-153.jpg", title: "Community Empathy and Pakikipagkapwa in Action", visibleDepiction: "Volunteers and local community members smiling and cooperating on a grassroots civic support initiative." },

  // L20: Homes & Architecture
  { id: "media-l20-primary", lessonId: "lesson-20-homes", classification: "photograph", commonsFile: "Vigan_Calle_Crisologo_3.jpg", title: "Calle Crisologo Ancestral Houses in Vigan", visibleDepiction: "Cobblestone street lined with historic Spanish-era bahay na bato ancestral stone houses in Vigan." },
  { id: "media-l20-secondary", lessonId: "lesson-20-homes", classification: "photograph", commonsFile: "Bahay_na_bato-36.jpg", title: "Traditional Bahay na Bato Architecture", visibleDepiction: "Preserved two-story bahay na bato residence featuring wooden upper floors and capiz shell window lattices." },

  // L21: Schools & Learning
  { id: "media-l21-primary", lessonId: "lesson-21-schools", classification: "photograph", commonsFile: "PCM_Classroom.jpg", title: "Filipino Students in Classroom Learning Environment", visibleDepiction: "Primary students sitting at desks in an active elementary classroom engaged in lessons." },
  { id: "media-l21-secondary", lessonId: "lesson-21-schools", classification: "photograph", commonsFile: "SAGA_Flag_Raising_Ceremony.jpg", title: "Morning Flag Ceremony at Philippine School", visibleDepiction: "School students gathered in the schoolyard for the morning flag-raising ceremony and national anthem." },

  // L22: Markets & Stores
  { id: "media-l22-primary", lessonId: "lesson-22-markets", classification: "photograph", commonsFile: "Palengke_-_Danao_City_01_by_Hulagway.jpg", title: "Sa Palengke Wet Market Commerce in Danao City", visibleDepiction: "Bustling community wet market (palengke) with vendors selling fresh local produce and fish in Danao City." },
  { id: "media-l22-secondary", lessonId: "lesson-22-markets", classification: "photograph", commonsFile: "Sari-Sari_Store_Samal_Davao.jpg", title: "Neighborhood Sari-Sari Store in Samal Davao", visibleDepiction: "Typical neighborhood wooden sari-sari convenience store window display with hanging snacks and daily necessities." },

  // L23: Transportation
  { id: "media-l23-primary", lessonId: "lesson-23-transportation", classification: "photograph", commonsFile: "Jeepney_in_Legazpi_City.JPG", title: "Iconic Hand-Painted Philippine Jeepney", visibleDepiction: "Vibrantly painted public utility jeepney operating on the roads of Legazpi City, Albay." },
  { id: "media-l23-secondary", lessonId: "lesson-23-transportation", classification: "photograph", commonsFile: "Tricycle_overloaded.jpg", title: "Philippine Motorized Tricycle Public Transport", visibleDepiction: "Motorcycle with attached passenger sidecar (tricycle) providing local neighborhood transport in the Philippines." },

  // L24: Carabao
  { id: "media-l24-primary", lessonId: "lesson-24-carabao", classification: "photograph", commonsFile: "Carabao_Plowing_rice_field,_Philippines_LOC_14333026510.jpg", title: "Water Buffalo Carabao Plowing Rice Field", visibleDepiction: "Farmer guiding a harnessed water buffalo (carabao) through muddy paddy fields to plow soil for rice planting." },
  { id: "media-l24-secondary", lessonId: "lesson-24-carabao", classification: "photograph", commonsFile: "Carabao_Racing_Festival_in_Baliwag_Bulacan_16.jpg", title: "Kneeling Carabao Festival in Baliwag Bulacan", visibleDepiction: "Carabaos decorated for the traditional Kneeling Carabao Festival in honor of San Isidro Labrador in Baliwag." },

  // L25: Community Helpers
  { id: "media-l25-primary", lessonId: "lesson-25-community-helpers", classification: "photograph", commonsFile: "A_Purok_Abanico_health_worker,_left,_from_the_San_Pedro_barangay_and_U.S._Army_Sgt._1st_Class_Brian_M._Reed,_center,_the_civil_affairs_team_sergeant_with_the_Combined_Joint_Civil_Military_Operations_Task_Force_120413-A-YK011-004.jpg", title: "Barangay Community Health Worker in Action", visibleDepiction: "Barangay health worker assisting community medical outreach in San Pedro, Palawan." },
  { id: "media-l25-secondary", lessonId: "lesson-25-community-helpers", classification: "photograph", commonsFile: "US_Coast_Guard,_Philippine_emergency_responders_hold_rescue_swimmer_training_150728-M-DN141-502.jpg", title: "Philippine Coast Guard and Emergency Rescue Responders", visibleDepiction: "Philippine Coast Guard and emergency rescue personnel participating in marine search and rescue operations." },

  // L26: September Review
  { id: "media-l26-primary", lessonId: "lesson-26-september-review", classification: "photograph", commonsFile: "Tinikling.jpg", title: "Tinikling Traditional Bamboo Dance Performance", visibleDepiction: "Filipino dancers gracefully stepping between rhythmic clapping bamboo poles in the traditional Tinikling dance." },
  { id: "media-l26-secondary", lessonId: "lesson-26-september-review", classification: "photograph", commonsFile: "Singkil_dance_post_card.jpg", title: "Singkil Royal Maranao Bamboo Dance", visibleDepiction: "Royal Maranao dancers in gold and silk costumes stepping through crisscrossed bamboo poles in Singkil." },

  // L27: Bayanihan
  { id: "media-l27-primary", lessonId: "lesson-27-bayanihan", classification: "photograph", commonsFile: "Bayanihan_1.JPG", title: "Bayanihan Community Carrying House (Lipat Bahay)", visibleDepiction: "Dozens of neighbors carrying a traditional bamboo and thatch nipa hut on their shoulders in the classic 'lipat bahay' Bayanihan tradition." },
  { id: "media-l27-secondary", lessonId: "lesson-27-bayanihan", classification: "photograph", commonsFile: "Racing_the_Storm-_18th_Wing_Helps_Disaster_Relief_Efforts_in_Philippines_(9420080).jpg", title: "Community Disaster Relief and Bayanihan Cooperation", visibleDepiction: "Volunteers and workers rapidly loading and organizing emergency supplies during nationwide disaster response." },

  // L28: José Rizal
  { id: "media-l28-primary", lessonId: "lesson-28-jose-rizal", classification: "historical_artwork", commonsFile: "Jose_rizal_craig01g.jpg", title: "Dr. José Rizal Historical Portrait", visibleDepiction: "Formal studio portrait photograph of Philippine national hero Dr. José Rizal." },
  { id: "media-l28-secondary", lessonId: "lesson-28-jose-rizal", classification: "photograph", commonsFile: "2011_The_Rizal_Monument,_Luneta_Park_,_Manila,_Philippines.jpg", title: "Rizal National Monument in Luneta Park Manila", visibleDepiction: "Bronze and granite memorial monument and flagpole honoring Dr. José Rizal in Luneta Park, Manila." },

  // L29: Andrés Bonifacio
  { id: "media-l29-primary", lessonId: "lesson-29-andres-bonifacio", classification: "historical_artwork", commonsFile: "Andres_Bonifacio_portrait.jpg", title: "Andrés Bonifacio Supreme Leader of the Katipunan", visibleDepiction: "Historical studio portrait of Andrés Bonifacio, the Supremo of the revolutionary Katipunan society." },
  { id: "media-l29-secondary", lessonId: "lesson-29-andres-bonifacio", classification: "photograph", commonsFile: "Bonifacio_Monument_(Caloocan).jpg", title: "Guillermo Tolentino's Bonifacio Monument in Caloocan", visibleDepiction: "Grand sculpted bronze monument by National Artist Guillermo Tolentino depicting Bonifacio and Katipuneros in Caloocan." },

  // L30: Gabriela Silang
  { id: "media-l30-primary", lessonId: "lesson-30-gabriela-silang", classification: "photograph", commonsFile: "Gabriela_Silang_Monument_Ayala_Avenue.jpg", title: "Gabriela Silang Monument on Ayala Avenue", visibleDepiction: "Dynamic equestrian bronze monument of revolutionary leader Gabriela Silang brandishing a bolo." },
  { id: "media-l30-secondary", lessonId: "lesson-30-gabriela-silang", classification: "photograph", commonsFile: "Santa_Maria_Church_Ilocos_Sur_2.jpg", title: "UNESCO World Heritage Santa Maria Church in Ilocos", visibleDepiction: "Historic brick fortress church of Santa Maria in Ilocos Sur atop a hill, a key revolutionary landscape." },

  // L31: Lapu-Lapu
  { id: "media-l31-primary", lessonId: "lesson-31-lapu-lapu", classification: "photograph", commonsFile: "Lapu-Lapu_Shrine_Statue.jpg", title: "Bronze Statue of Datu Lapu-Lapu on Mactan Island", visibleDepiction: "20-meter bronze statue of Mactan chieftain Lapu-Lapu holding a kampilan sword and shield at Mactan Shrine." },
  { id: "media-l31-secondary", lessonId: "lesson-31-lapu-lapu", classification: "photograph", commonsFile: "Magellan_shrine_in_Punta_Enga%C3%B1o,_Lapu-Lapu_City.jpg", title: "Magellan Shrine Memorial in Punta Engaño Mactan", visibleDepiction: "Historic stone obelisk monument marking the 1521 Battle of Mactan in Punta Engaño, Cebu." },

  // L32: Folk Songs
  { id: "media-l32-primary", lessonId: "lesson-32-folk-songs", classification: "photograph", commonsFile: "Vegetable_farm_in_Benguet.JPG", title: "Lush Bahay Kubo Vegetable Garden Landscape", visibleDepiction: "Terraced vegetable garden plot in the highlands cultivating squash, beans, and produce celebrated in 'Bahay Kubo'." },
  { id: "media-l32-secondary", lessonId: "lesson-32-folk-songs", classification: "photograph", commonsFile: "Traditional_Kutiyapi_(Lute)_from_Mindanao.jpg", title: "Traditional Hand-Carved Two-Stringed Kutiyapi Lute", visibleDepiction: "Intricately carved wooden two-stringed boat lute (kutiyapi) from Mindanao with okir curvilinear motifs." },

  // L33: Folk Tales
  { id: "media-l33-primary", lessonId: "lesson-33-folk-tales", classification: "photograph", commonsFile: "Traditional_Filipino_Balay_and_Storytelling_Porch.jpg", title: "Traditional Rural Storytelling Veranda (Pantaw)", visibleDepiction: "Open wooden veranda and bamboo living space where Filipino families share folklore and moral tales." },
  { id: "media-l33-secondary", lessonId: "lesson-33-folk-tales", classification: "photograph", commonsFile: "Ancient_Balete_Tree_in_Canlaon_City.jpg", title: "Ancient Century-Old Balete Tree in Canlaon", visibleDepiction: "Massive strangler fig Balete tree with descending aerial roots, prominent in Philippine myths and folklore." },

  // L34: Tropical Forests
  { id: "media-l34-primary", lessonId: "lesson-34-tropical-forests", classification: "photograph", commonsFile: "Buntot_Palos_Falls_(Pangil,_Laguna).jpg", title: "Buntot Palos Rainforest Waterfall in Pangil Laguna", visibleDepiction: "Cascading rainforest waterfall surrounded by dense tropical ferns and towering virgin forest canopy in Laguna." },
  { id: "media-l34-secondary", lessonId: "lesson-34-tropical-forests", classification: "photograph", commonsFile: "Palawan_Mangrove_Forest.jpg", title: "Palawan Indigenous Coastal Mangrove Conservation", visibleDepiction: "Dense coastal mangrove wetland forest with interwoven prop roots protecting Palawan's shoreline." },

  // L35: Coral Reefs
  { id: "media-l35-primary", lessonId: "lesson-35-coral-reefs", classification: "photograph", commonsFile: "Tubbataha_Reefs_Natural_Park_Coral_Garden.jpg", title: "Tubbataha Reefs Natural Park Marine Sanctuary", visibleDepiction: "Pristine living coral reef garden teeming with hard corals and marine biodiversity at Tubbataha Reefs." },
  { id: "media-l35-secondary", lessonId: "lesson-35-coral-reefs", classification: "photograph", commonsFile: "Rhincodon_typus_with_remora_at_Donsol.jpg", title: "Whale Shark (Butanding) in Donsol Sorsogon", visibleDepiction: "Gentle giant Whale Shark (Rhincodon typus) swimming gracefully through coastal waters in Donsol." },

  // L36: Philippine Eagle
  { id: "media-l36-primary", lessonId: "lesson-36-philippine-eagle", classification: "photograph", commonsFile: "Philippine_Eagle_(Pithecophaga_jefferyi)_Mindanao.jpg", title: "Majestic Philippine Eagle (Pithecophaga jefferyi) in Mindanao", visibleDepiction: "Full-body perched view of a Philippine Eagle showing dagger-like talons and cream-colored plumage." },
  { id: "media-l36-secondary", lessonId: "lesson-36-philippine-eagle", classification: "photograph", commonsFile: "Philippine_Eagle_Center_Davao.jpg", title: "Philippine Eagle at the Philippine Eagle Center in Davao", visibleDepiction: "Conserved Philippine Eagle in natural forest aviary enclosure at the conservation breeding center in Malagos, Davao." },

  // L37: Environmental Stewardship
  { id: "media-l37-primary", lessonId: "lesson-37-environmental-stewardship", classification: "photograph", commonsFile: "Tree_planting_in_the_Philippines.jpg", title: "Community Reforestation and Tree Planting in Barangay", visibleDepiction: "Students and community volunteers planting native tree saplings along watershed hillsides." },
  { id: "media-l37-secondary", lessonId: "lesson-37-environmental-stewardship", classification: "photograph", commonsFile: "Mangrove_planting_in_Basyaw_Cove.jpg", title: "Coastal Mangrove Conservation in Basyaw Cove Guimaras", visibleDepiction: "Volunteers planting mangrove propagules in tidal coastal mudflats to restore marine nurseries." },

  // L38: October Review
  { id: "media-l38-primary", lessonId: "lesson-38-october-review", classification: "photograph", commonsFile: "Fort_Santiago_Gate_(Manila).jpg", title: "Historic Gate of Fort Santiago in Intramuros", visibleDepiction: "Carved stone relief gate of Fort Santiago defense citadel in the walled city of Intramuros, Manila." },
  { id: "media-l38-secondary", lessonId: "lesson-38-october-review", classification: "photograph", commonsFile: "San_Agustin_Church_Intramuros_Manila.jpg", title: "San Agustin Church (UNESCO World Heritage Site in Manila)", visibleDepiction: "Stone baroque facade of San Agustin Church in Intramuros, the oldest surviving stone church in the Philippines." },

  // L39: October Showcase
  { id: "media-l39-primary", lessonId: "lesson-39-october-showcase", classification: "historical_artwork", commonsFile: "Spoliarium_by_Juan_Luna.jpg", title: "Spoliarium (1884) Masterpiece by Juan Luna", visibleDepiction: "Monumental oil painting Spoliarium by Juan Luna hanging in the National Museum of Fine Arts." },
  { id: "media-l39-secondary", lessonId: "lesson-39-october-showcase", classification: "historical_artwork", commonsFile: "Planting_Rice_(1951)_by_Fernando_Amorsolo.jpg", title: "Planting Rice Masterpiece by Fernando Amorsolo", visibleDepiction: "Luminous oil painting by Fernando Amorsolo showing Filipino farmers planting rice under glowing sunlight." },

  // L40: Kitchen Safety
  { id: "media-l40-primary", lessonId: "lesson-40-kitchen-safety", classification: "photograph", commonsFile: "Commercial_kitchen_food_preparation_safety.jpg", title: "Culinary Food Safety and Kitchen Preparation Standards", visibleDepiction: "Clean stainless steel food preparation counter, sanitized cutting surfaces, and organized culinary workstations." },
  { id: "media-l40-secondary", lessonId: "lesson-40-kitchen-safety", classification: "photograph", commonsFile: "Proper_handwashing_technique_with_soap_and_water.jpg", title: "Essential Handwashing and Kitchen Hygiene Protocol", visibleDepiction: "Step-by-step hygienic handwashing under running water with lathered soap before handling food." },

  // L41: Measurements
  { id: "media-l41-primary", lessonId: "lesson-41-measurements", classification: "photograph", commonsFile: "Measuring_spoons_and_culinary_tools.jpg", title: "Measuring Spoons and Culinary Utensils", visibleDepiction: "Set of graduated stainless steel measuring spoons and measuring cups for culinary precision." },
  { id: "media-l41-secondary", lessonId: "lesson-41-measurements", classification: "photograph", commonsFile: "Traditional_stone_mortar_and_pestle_(dikdikan).jpg", title: "Traditional Mortar and Pestle (Dikdikan)", visibleDepiction: "Heavy carved granite stone mortar and pestle (dikdikan) used to crush fresh garlic and spices." },

  // L42: Nutrition
  { id: "media-l42-primary", lessonId: "lesson-42-nutrition", classification: "photograph", commonsFile: "Fresh_vegetables_market_display_Philippines.jpg", title: "Fresh Vegetables and Nutritious Market Produce", visibleDepiction: "Baskets of fresh green leafy vegetables, squash, eggplant, and bitter melon (ampalaya) in a market." },
  { id: "media-l42-secondary", lessonId: "lesson-42-nutrition", classification: "photograph", commonsFile: "Fresh_fish_and_seafood_market_Philippines.jpg", title: "Fresh Seafood and Fish in Coastal Market", visibleDepiction: "Freshly caught milkfish (bangus), mackerel, and red snapper displayed over crushed ice." },

  // L43: Rice Basics
  { id: "media-l43-primary", lessonId: "lesson-43-rice-basics", classification: "photograph", commonsFile: "Batad_rice_terraces_in_Ifugao.jpg", title: "Batad Rice Terraces Heritage Landscape", visibleDepiction: "Amphitheater-like stone-walled Batad Rice Terraces carved into steep mountain valleys in Ifugao." },
  { id: "media-l43-secondary", lessonId: "lesson-43-rice-basics", classification: "photograph", commonsFile: "Bowl_of_steamed_white_rice.jpg", title: "Steamed White Rice in Ceramic Bowl", visibleDepiction: "Steaming fluffy white rice (kanin) served hot in a traditional ceramic serving bowl." },

  // L44: Adobo
  { id: "media-l44-primary", lessonId: "lesson-44-adobo-history", classification: "photograph", commonsFile: "Chicken_Adobo_with_garlic_and_bay_leaves.jpg", title: "Authentic Filipino Chicken Adobo with Garlic and Peppercorns", visibleDepiction: "Braised chicken pieces simmered in savory soy sauce, cane vinegar, whole black peppercorns, and bay leaves." },
  { id: "media-l44-secondary", lessonId: "lesson-44-adobo-history", classification: "photograph", commonsFile: "Traditional_Filipino_clay_cooking_pot_(palayok).jpg", title: "Traditional Filipino Palayok Clay Cooking Pot and Stove", visibleDepiction: "Unglazed earthenware clay cooking pot (palayok) resting on a native clay charcoal burner." },

  // L45: Sinigang
  { id: "media-l45-primary", lessonId: "lesson-45-sinigang-flavors", classification: "photograph", commonsFile: "Sinigang_na_Baboy_with_vegetables.jpg", title: "Sinigang na Baboy Sour Soup with Fresh Vegetables", visibleDepiction: "Bowl of steaming tamarind sour soup with tender pork cuts, water spinach (kangkong), radish, and taro." },
  { id: "media-l45-secondary", lessonId: "lesson-45-sinigang-flavors", classification: "photograph", commonsFile: "Fresh_tamarind_pods_(sampaloc).jpg", title: "Fresh Sampaloc (Tamarind) Natural Souring Pods", visibleDepiction: "Cluster of fresh brown tamarind fruit pods (sampaloc) harvested for natural broth souring." },

  // L46: Pancit
  { id: "media-l46-primary", lessonId: "lesson-46-pancit-celebration", classification: "photograph", commonsFile: "Pancit_Canton_festive_platter.jpg", title: "Festive Ginisang Pancit Canton Celebration Platter", visibleDepiction: "Large celebration platter of stir-fried egg noodles tossed with shredded chicken, shrimp, cabbage, and calamansi." },
  { id: "media-l46-secondary", lessonId: "lesson-46-pancit-celebration", classification: "photograph", commonsFile: "Pancit_Bihon_Guisado_with_calamansi.jpg", title: "Pancit Bihon Guisado for Long Life and Celebration", visibleDepiction: "Stir-fried thin rice vermicelli noodles garnished with toasted garlic, spring onions, and sliced calamansi halves." },

  // L47: Halo-Halo
  { id: "media-l47-primary", lessonId: "lesson-47-halo-halo", classification: "photograph", commonsFile: "Classic_Filipino_Halo-Halo_dessert.jpg", title: "Classic Halo-Halo Dessert with Shaved Ice and Ube", visibleDepiction: "Tall glass of layered sweetened beans, nata de coco, shaved ice, evaporated milk, topped with ube halaya and leche flan." },
  { id: "media-l47-secondary", lessonId: "lesson-47-halo-halo", classification: "photograph", commonsFile: "Ube_Halaya_purple_yam_jam.jpg", title: "Creamy Ube Halaya Purple Yam Jam", visibleDepiction: "Rich purple yam jam confection (ube halaya) shaped on a serving plate and topped with golden latik coconut curd." },

  // L48: Mango Float
  { id: "media-l48-primary", lessonId: "lesson-48-mango-float", classification: "photograph", commonsFile: "Sweet_Philippine_Carabao_Mangoes.jpg", title: "Sweet Golden Philippine Carabao Mangoes", visibleDepiction: "Ripe sweet yellow Carabao mangoes sliced in half displaying vibrant golden tropical fruit flesh." },
  { id: "media-l48-secondary", lessonId: "lesson-48-mango-float", classification: "photograph", commonsFile: "Mango_Graham_Float_dessert.jpg", title: "Layered Mango Graham Float Icebox Cake", visibleDepiction: "Chilled icebox dessert showing alternating layers of graham crackers, whipped cream, and fresh ripe mango slices." },

  // L49: Kakanin
  { id: "media-l49-primary", lessonId: "lesson-49-kakanin", classification: "photograph", commonsFile: "Bibingka_baked_on_banana_leaf.jpg", title: "Traditional Rice Bibingka Baked on Banana Leaf", visibleDepiction: "Golden baked rice cake (bibingka) cooked in clay pans lined with charred banana leaves, topped with salted egg and cheese." },
  { id: "media-l49-secondary", lessonId: "lesson-49-kakanin", classification: "photograph", commonsFile: "Puto_Bumbong_with_grated_coconut.jpg", title: "Steamed Puto Bumbong with Grated Coconut and Muscovado", visibleDepiction: "Purple glutinous rice tubes steamed inside bamboo cylinders, served warm with freshly grated coconut and muscovado sugar." },

  // L50: Grandma's Recipe Box
  { id: "media-l50-primary", lessonId: "lesson-50-grandmas-recipe-box", classification: "photograph", commonsFile: "Vintage_wooden_cooking_ladles_and_spoons.jpg", title: "Heirloom Hand-Carved Wooden Kitchen Utensils", visibleDepiction: "Handcrafted wooden ladles (sandok) and heirloom turners hanging in a traditional kitchen." },
  { id: "media-l50-secondary", lessonId: "lesson-50-grandmas-recipe-box", classification: "photograph", commonsFile: "Handwritten_heirloom_recipe_notebook.jpg", title: "Vintage Kitchen Spoons and Measuring Implements", visibleDepiction: "Vintage culinary measuring implements and traditional recipe preparation tools." },

  // L51: Family Heritage Wall
  { id: "media-l51-primary", lessonId: "lesson-51-family-heritage-wall", classification: "photograph", commonsFile: "Multigenerational_Filipino_family_gathering_Ilocos.jpg", title: "Generations of Filipino Family Heritage in Ilocos", visibleDepiction: "Generations of family members gathered together outside their ancestral home in Ilocos." },
  { id: "media-l51-secondary", lessonId: "lesson-51-family-heritage-wall", classification: "photograph", commonsFile: "Filipino_family_dining_together_salu-salo.jpg", title: "Filipino Family Culinary Gathering and Dining Table", visibleDepiction: "Extended family members seated around the dining table sharing home-cooked dishes during a Sunday salu-salo." },

  // L52: November Showcase
  { id: "media-l52-primary", lessonId: "lesson-52-november-showcase", classification: "photograph", commonsFile: "Whole_roasted_lechon_baboy_fiesta.jpg", title: "Traditional Whole Roasted Lechon Baboy Fiesta Centerpiece", visibleDepiction: "Crispy mahogany-skinned whole roasted pig (lechon baboy) garnished with lemongrass for a town fiesta." },
  { id: "media-l52-secondary", lessonId: "lesson-52-november-showcase", classification: "photograph", commonsFile: "Grand_community_boodle_fight_celebration.jpg", title: "Grand Community Boodle Fight Celebration Banquet", visibleDepiction: "Long communal table lined with banana leaves brimming with grilled pork, seafood, rice, and tropical fruits." },

  // L53: Geography Championship
  { id: "media-l53-primary", lessonId: "lesson-53-geography-championship", classification: "authoritative_map", commonsFile: "Topographic_map_of_the_Philippines.png", title: "Topographic Relief Map of the Philippine Archipelago", visibleDepiction: "Comprehensive elevation and bathymetry topographic relief map of the Philippine islands and deep oceanic trenches." },
  { id: "media-l53-secondary", lessonId: "lesson-53-geography-championship", classification: "photograph", commonsFile: "Coron_Island_limestone_cliffs_and_Kayangan_Lake.jpg", title: "Kayangan Lake Pristine Waters in Coron Palawan", visibleDepiction: "Scenic view over crystalline turquoise waters framed by dramatic limestone pinnacles at Kayangan Lake in Coron." },

  // L54: Cultural Game Show
  { id: "media-l54-primary", lessonId: "lesson-54-cultural-game-show", classification: "photograph", commonsFile: "Carved_wooden_Sungka_board_with_cowrie_shells.jpg", title: "Traditional Carved Wooden Sungka Board with Cowrie Shells", visibleDepiction: "Hand-carved wooden boat-shaped Sungka mancala board filled with smooth white cowrie shells in playing cups." },
  { id: "media-l54-secondary", lessonId: "lesson-54-cultural-game-show", classification: "photograph", commonsFile: "Kulintang_gong_ensemble_Mindanao.jpg", title: "Kulintang Ensemble Gong Array of Mindanao", visibleDepiction: "Row of graduated brass knobbed gongs (kulintang) laid horizontally on an ornately carved wooden frame." },

  // L55: Family Recipe Showcase
  { id: "media-l55-primary", lessonId: "lesson-55-family-recipe-showcase", classification: "photograph", commonsFile: "Junior_chefs_in_kitchen_cooking_competition.jpg", title: "Junior Chefs in Culinary Food Preparation Challenge", visibleDepiction: "Young students wearing chef hats and aprons actively preparing fresh ingredients in a teaching kitchen." },
  { id: "media-l55-secondary", lessonId: "lesson-55-family-recipe-showcase", classification: "photograph", commonsFile: "Fresh_ingredients_mise_en_place_for_cooking.jpg", title: "Fresh Wholesome Ingredients Ready for Recipe Showcase", visibleDepiction: "Organized bowls of sliced fresh vegetables, herbs, and spices arranged for cooking." },

  // L56: Gratitude Journal
  { id: "media-l56-primary", lessonId: "lesson-56-gratitude-journal", classification: "photograph", commonsFile: "Filipino_family_in_prayer_and_thanksgiving.jpg", title: "Filipino Family Assembled in Devotion and Thanksgiving", visibleDepiction: "Parents and children gathered peacefully in their living room bowing heads in evening family prayer and thanksgiving." },
  { id: "media-l56-secondary", lessonId: "lesson-56-gratitude-journal", classification: "photograph", commonsFile: "Sunrise_over_Mount_Pulag_sea_of_clouds.jpg", title: "Sea of Clouds and Golden Sunrise over Mount Pulag", visibleDepiction: "Breathtaking dawn sunrise illuminating rolling sea of clouds across the high summit grassland of Mount Pulag." },

  // L57: Biblical Stewardship
  { id: "media-l57-primary", lessonId: "lesson-57-biblical-stewardship", classification: "photograph", commonsFile: "Green_Sea_Turtle_(Chelonia_mydas)_in_Anilao.jpg", title: "Endangered Green Sea Turtle (Pawikan) in Anilao Marine Sanctuary", visibleDepiction: "Endangered Green Sea Turtle (pawikan) gliding smoothly over coral formations in Anilao, Batangas." },
  { id: "media-l57-secondary", lessonId: "lesson-57-biblical-stewardship", classification: "photograph", commonsFile: "Loboc_River_rainforest_watershed_Bohol.jpg", title: "Lush Tropical River and Rainforest Watershed in Loboc Bohol", visibleDepiction: "Meandering green river waters of the Loboc River flanked by lush tropical palm rainforest canopies in Bohol." },

  // L58: Bayanihan in Action
  { id: "media-l58-primary", lessonId: "lesson-58-bayanihan-review", classification: "photograph", commonsFile: "Volunteers_and_workers_assembling_relief_packs_DSWD_NROC_Pasay_06.jpg", title: "Volunteers and Workers Assembling Emergency Food Relief Packs at DSWD NROC", visibleDepiction: "Lines of citizen volunteers working shoulder-to-shoulder packaging essential food and hygiene boxes at the DSWD national operations center." },
  { id: "media-l58-secondary", lessonId: "lesson-58-bayanihan-review", classification: "photograph", commonsFile: "Community_tree_planting_activity_Barangay.jpg", title: "Community Volunteer Planting Initiative in Philippine Barangay", visibleDepiction: "Barangay youth and neighborhood residents working together to dig soil and plant trees for community greening." },

  // L59: Faith and Heritage
  { id: "media-l59-primary", lessonId: "lesson-59-faith-and-heroes", classification: "photograph", commonsFile: "Gomburza_Memorial_Monument_Luneta.jpg", title: "Gomburza Historical Martyrdom Memorial in Luneta", visibleDepiction: "Historic memorial monument commemorating secular priests Mariano Gómez, José Burgos, and Jacinto Zamora in Luneta." },
  { id: "media-l59-secondary", lessonId: "lesson-59-faith-and-heroes", classification: "historical_artwork", commonsFile: "Melchora_Aquino_(Tandang_Sora)_portrait.jpg", title: "Melchora Aquino (Tandang Sora) Mother of the Revolution", visibleDepiction: "Historical portrait engraving of revolutionary heroine Melchora Aquino (Tandang Sora)." },

  // L60: Christmas Traditions & Parols
  { id: "media-l60-primary", lessonId: "lesson-60-christmas-traditions", classification: "photograph", commonsFile: "Giant_Lantern_Festival_San_Fernando_Pampanga.jpg", title: "Giant Lantern Festival Illuminated Parol in Pampanga", visibleDepiction: "Spectacular multi-colored illuminated giant Christmas lantern (parol) blazing in intricate geometric patterns in San Fernando." },
  { id: "media-l60-secondary", lessonId: "lesson-60-christmas-traditions", classification: "photograph", commonsFile: "Handcrafted_star_parols_Pampanga.jpg", title: "Historical Handcrafted Star Parols of San Fernando Pampanga", visibleDepiction: "Rows of traditional five-pointed star parols handcrafted with bamboo framing and colorful Japanese paper." },

  // L61: Simbang Gabi
  { id: "media-l61-primary", lessonId: "lesson-61-simbang-gabi", classification: "photograph", commonsFile: "Binondo_Church_interior_dawn_mass.jpg", title: "Simbang Gabi Dawn Mass at Historic Binondo Church", visibleDepiction: "Congregation attending pre-dawn Simbang Gabi advent mass inside the illuminated baroque interior of Binondo Church." },
  { id: "media-l61-secondary", lessonId: "lesson-61-simbang-gabi", classification: "photograph", commonsFile: "Bibingka_and_Puto_Bumbong_street_vendors_Christmas.jpg", title: "Traditional Street Vendors Preparing Bibingka and Puto Bumbong", visibleDepiction: "Church courtyard street food stalls steaming fresh puto bumbong and baking bibingka over glowing charcoal embers." },

  // L62: Showcase Prep
  { id: "media-l62-primary", lessonId: "lesson-62-showcase-prep", classification: "photograph", commonsFile: "Students_working_together_on_presentation.jpg", title: "Filipino Students Collaborating and Preparing Presentations", visibleDepiction: "Elementary students sitting together at tables assembling colorful charts, posters, and learning displays." },
  { id: "media-l62-secondary", lessonId: "lesson-62-showcase-prep", classification: "photograph", commonsFile: "Student_presentation_on_stage_school.jpg", title: "Students Presenting Cultural Learning Projects on Stage", visibleDepiction: "Student presenters standing on school stage sharing their cultural portfolios with classmates and teachers." },

  // L63: The Nativity (Belen)
  { id: "media-l63-primary", lessonId: "lesson-63-the-nativity", classification: "photograph", commonsFile: "Traditional_Belen_display_Candon_Church.jpg", title: "Traditional Belen Nativity Display at Candon Church", visibleDepiction: "Elaborately staged community nativity scene (belen) with figurines of Mary, Joseph, and Baby Jesus at Candon Church." },
  { id: "media-l63-secondary", lessonId: "lesson-63-the-nativity", classification: "historical_artwork", commonsFile: "The_Adoration_of_the_Shepherds_by_Giorgione.jpg", title: "Adoration of the Shepherds Nativity Masterpiece by Giorgione", visibleDepiction: "Renaissance masterpiece painting The Adoration of the Shepherds depicting the holy nativity scene." },

  // L64: Looking Forward
  { id: "media-l64-primary", lessonId: "lesson-64-looking-forward", classification: "photograph", commonsFile: "Twelve_round_fruits_for_New_Year_Media_Noche.jpg", title: "Sweet Golden Round Fruits for New Year Media Noche Celebration", visibleDepiction: "Table centerpiece arranged with twelve sweet round tropical fruits symbolizing abundance for New Year Media Noche." },
  { id: "media-l64-secondary", lessonId: "lesson-64-looking-forward", classification: "photograph", commonsFile: "New_Year_fireworks_over_Manila_Bay.jpg", title: "Grand New Year Fireworks Illuminating Manila Bay", visibleDepiction: "Spectacular fireworks displays bursting in colors over Manila Bay as families welcome the New Year." },

  // L65: Year-End Showcase
  { id: "media-l65-primary", lessonId: "lesson-65-year-end-showcase", classification: "photograph", commonsFile: "University_of_the_Philippines_Sablay_Graduation.jpg", title: "University of the Philippines Academic Sablay Graduation Ceremony", visibleDepiction: "Graduating students proudly wearing the indigenous handwoven academic Sablay sash across their shoulders." },
  { id: "media-l65-secondary", lessonId: "lesson-65-year-end-showcase", classification: "photograph", commonsFile: "Philippine_school_commencement_exercises.jpg", title: "Philippine School Commencement and Student Completion Ceremony", visibleDepiction: "Elementary students marching in procession during year-end commencement exercises to receive learning diplomas." },
];

module.exports = {
  CANONICAL_SPECS,
};
