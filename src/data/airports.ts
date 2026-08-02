export type Airport = {
  code: string;
  city: string;
  country: string;
  name: string;
};

export const AIRPORTS: Airport[] = [
    // Pakistan - Featured prominently
    { code: 'LYP', city: 'Faisalabad', country: 'Pakistan', name: 'Faisalabad International Airport' },
    { code: 'KHI', city: 'Karachi', country: 'Pakistan', name: 'Jinnah International' },
    { code: 'LHE', city: 'Lahore', country: 'Pakistan', name: 'Allama Iqbal International' },
    { code: 'ISB', city: 'Islamabad', country: 'Pakistan', name: 'Islamabad International' },
    { code: 'PEW', city: 'Peshawar', country: 'Pakistan', name: 'Bacha Khan International' },
    { code: 'UET', city: 'Quetta', country: 'Pakistan', name: 'Quetta International' },
    { code: 'MUX', city: 'Multan', country: 'Pakistan', name: 'Multan International' },
    { code: 'SKT', city: 'Sialkot', country: 'Pakistan', name: 'Sialkot International' },
    { code: 'BWP', city: 'Bahawalpur', country: 'Pakistan', name: 'Bahawalpur Airport' },
    { code: 'CJL', city: 'Chitral', country: 'Pakistan', name: 'Chitral Airport' },
    { code: 'GIL', city: 'Gilgit', country: 'Pakistan', name: 'Gilgit Airport' },
    { code: 'KDU', city: 'Skardu', country: 'Pakistan', name: 'Skardu Airport' },
    
    // United States
    { code: 'JFK', city: 'New York', country: 'United States', name: 'John F. Kennedy International' },
    { code: 'LAX', city: 'Los Angeles', country: 'United States', name: 'Los Angeles International' },
    { code: 'ORD', city: 'Chicago', country: 'United States', name: 'O\'Hare International' },
    { code: 'MIA', city: 'Miami', country: 'United States', name: 'Miami International' },
    { code: 'SFO', city: 'San Francisco', country: 'United States', name: 'San Francisco International' },
    { code: 'LAS', city: 'Las Vegas', country: 'United States', name: 'McCarran International' },
    { code: 'SEA', city: 'Seattle', country: 'United States', name: 'Seattle-Tacoma International' },
    { code: 'DEN', city: 'Denver', country: 'United States', name: 'Denver International' },
    { code: 'ATL', city: 'Atlanta', country: 'United States', name: 'Hartsfield-Jackson Atlanta International' },
    { code: 'BOS', city: 'Boston', country: 'United States', name: 'Logan International' },
    { code: 'DFW', city: 'Dallas', country: 'United States', name: 'Dallas/Fort Worth International' },
    { code: 'PHX', city: 'Phoenix', country: 'United States', name: 'Phoenix Sky Harbor International' },
    
    // United Kingdom
    { code: 'LHR', city: 'London', country: 'United Kingdom', name: 'Heathrow Airport' },
    { code: 'LGW', city: 'London', country: 'United Kingdom', name: 'Gatwick Airport' },
    { code: 'STN', city: 'London', country: 'United Kingdom', name: 'Stansted Airport' },
    { code: 'LTN', city: 'London', country: 'United Kingdom', name: 'Luton Airport' },
    { code: 'MAN', city: 'Manchester', country: 'United Kingdom', name: 'Manchester Airport' },
    { code: 'EDI', city: 'Edinburgh', country: 'United Kingdom', name: 'Edinburgh Airport' },
    { code: 'GLA', city: 'Glasgow', country: 'United Kingdom', name: 'Glasgow Airport' },
    { code: 'BHX', city: 'Birmingham', country: 'United Kingdom', name: 'Birmingham Airport' },
    { code: 'LPL', city: 'Liverpool', country: 'United Kingdom', name: 'Liverpool John Lennon Airport' },
    
    // France
    { code: 'CDG', city: 'Paris', country: 'France', name: 'Charles de Gaulle' },
    { code: 'ORY', city: 'Paris', country: 'France', name: 'Orly Airport' },
    { code: 'NCE', city: 'Nice', country: 'France', name: 'Nice Côte d\'Azur Airport' },
    { code: 'LYS', city: 'Lyon', country: 'France', name: 'Lyon-Saint Exupéry Airport' },
    { code: 'MRS', city: 'Marseille', country: 'France', name: 'Marseille Provence Airport' },
    { code: 'TLS', city: 'Toulouse', country: 'France', name: 'Toulouse-Blagnac Airport' },
    
    // Germany
    { code: 'FRA', city: 'Frankfurt', country: 'Germany', name: 'Frankfurt Airport' },
    { code: 'MUC', city: 'Munich', country: 'Germany', name: 'Munich Airport' },
    { code: 'BER', city: 'Berlin', country: 'Germany', name: 'Berlin Brandenburg Airport' },
    { code: 'DUS', city: 'Düsseldorf', country: 'Germany', name: 'Düsseldorf Airport' },
    { code: 'HAM', city: 'Hamburg', country: 'Germany', name: 'Hamburg Airport' },
    { code: 'CGN', city: 'Cologne', country: 'Germany', name: 'Cologne Bonn Airport' },
    { code: 'STR', city: 'Stuttgart', country: 'Germany', name: 'Stuttgart Airport' },
    
    // Netherlands
    { code: 'AMS', city: 'Amsterdam', country: 'Netherlands', name: 'Schiphol Airport' },
    { code: 'RTM', city: 'Rotterdam', country: 'Netherlands', name: 'Rotterdam The Hague Airport' },
    { code: 'EIN', city: 'Eindhoven', country: 'Netherlands', name: 'Eindhoven Airport' },
    
    // Italy
    { code: 'FCO', city: 'Rome', country: 'Italy', name: 'Fiumicino Airport' },
    { code: 'CIA', city: 'Rome', country: 'Italy', name: 'Ciampino Airport' },
    { code: 'MXP', city: 'Milan', country: 'Italy', name: 'Malpensa Airport' },
    { code: 'LIN', city: 'Milan', country: 'Italy', name: 'Linate Airport' },
    { code: 'VCE', city: 'Venice', country: 'Italy', name: 'Marco Polo Airport' },
    { code: 'NAP', city: 'Naples', country: 'Italy', name: 'Naples International Airport' },
    { code: 'FLR', city: 'Florence', country: 'Italy', name: 'Florence Airport' },
    { code: 'BLQ', city: 'Bologna', country: 'Italy', name: 'Bologna Guglielmo Marconi Airport' },
    
    // Spain
    { code: 'MAD', city: 'Madrid', country: 'Spain', name: 'Barajas Airport' },
    { code: 'BCN', city: 'Barcelona', country: 'Spain', name: 'Barcelona-El Prat Airport' },
    { code: 'PMI', city: 'Palma', country: 'Spain', name: 'Palma de Mallorca Airport' },
    { code: 'AGP', city: 'Málaga', country: 'Spain', name: 'Málaga Airport' },
    { code: 'SVQ', city: 'Seville', country: 'Spain', name: 'Seville Airport' },
    { code: 'VLC', city: 'Valencia', country: 'Spain', name: 'Valencia Airport' },
    { code: 'BIO', city: 'Bilbao', country: 'Spain', name: 'Bilbao Airport' },
    
    // UAE
    { code: 'DXB', city: 'Dubai', country: 'UAE', name: 'Dubai International' },
    { code: 'AUH', city: 'Abu Dhabi', country: 'UAE', name: 'Abu Dhabi International' },
    { code: 'SHJ', city: 'Sharjah', country: 'UAE', name: 'Sharjah International' },
    { code: 'RKT', city: 'Ras Al Khaimah', country: 'UAE', name: 'Ras Al Khaimah International' },
    { code: 'AAN', city: 'Al Ain', country: 'UAE', name: 'Al Ain International' },
    
    // Qatar
    { code: 'DOH', city: 'Doha', country: 'Qatar', name: 'Hamad International' },
    
    // Saudi Arabia
    { code: 'RUH', city: 'Riyadh', country: 'Saudi Arabia', name: 'King Khalid International' },
    { code: 'JED', city: 'Jeddah', country: 'Saudi Arabia', name: 'King Abdulaziz International' },
    { code: 'DMM', city: 'Dammam', country: 'Saudi Arabia', name: 'King Fahd International' },
    { code: 'MED', city: 'Medina', country: 'Saudi Arabia', name: 'Prince Mohammad Bin Abdulaziz Airport' },
    { code: 'TUU', city: 'Tabuk', country: 'Saudi Arabia', name: 'Tabuk Airport' },
    { code: 'AHB', city: 'Abha', country: 'Saudi Arabia', name: 'Abha Airport' },
    
    // Kuwait
    { code: 'KWI', city: 'Kuwait City', country: 'Kuwait', name: 'Kuwait International' },
    
    // Oman
    { code: 'MCT', city: 'Muscat', country: 'Oman', name: 'Muscat International' },
    { code: 'SLL', city: 'Salalah', country: 'Oman', name: 'Salalah Airport' },
    
    // Bahrain
    { code: 'BAH', city: 'Manama', country: 'Bahrain', name: 'Bahrain International' },
    
    // Singapore
    { code: 'SIN', city: 'Singapore', country: 'Singapore', name: 'Changi Airport' },
    
    // Japan
    { code: 'NRT', city: 'Tokyo', country: 'Japan', name: 'Narita International' },
    { code: 'HND', city: 'Tokyo', country: 'Japan', name: 'Haneda Airport' },
    { code: 'KIX', city: 'Osaka', country: 'Japan', name: 'Kansai International' },
    { code: 'NGO', city: 'Nagoya', country: 'Japan', name: 'Chubu Centrair International' },
    { code: 'CTS', city: 'Sapporo', country: 'Japan', name: 'New Chitose Airport' },
    { code: 'FUK', city: 'Fukuoka', country: 'Japan', name: 'Fukuoka Airport' },
    
    // South Korea
    { code: 'ICN', city: 'Seoul', country: 'South Korea', name: 'Incheon International' },
    { code: 'GMP', city: 'Seoul', country: 'South Korea', name: 'Gimpo International' },
    { code: 'PUS', city: 'Busan', country: 'South Korea', name: 'Gimhae International' },
    { code: 'CJU', city: 'Jeju', country: 'South Korea', name: 'Jeju International' },
    
    // Thailand
    { code: 'BKK', city: 'Bangkok', country: 'Thailand', name: 'Suvarnabhumi Airport' },
    { code: 'DMK', city: 'Bangkok', country: 'Thailand', name: 'Don Mueang International' },
    { code: 'HKT', city: 'Phuket', country: 'Thailand', name: 'Phuket International' },
    { code: 'CNX', city: 'Chiang Mai', country: 'Thailand', name: 'Chiang Mai International' },
    { code: 'USM', city: 'Koh Samui', country: 'Thailand', name: 'Samui Airport' },
    
    // Hong Kong
    { code: 'HKG', city: 'Hong Kong', country: 'Hong Kong', name: 'Hong Kong International' },
    
    // China
    { code: 'PEK', city: 'Beijing', country: 'China', name: 'Beijing Capital International' },
    { code: 'PVG', city: 'Shanghai', country: 'China', name: 'Shanghai Pudong International' },
    { code: 'SHA', city: 'Shanghai', country: 'China', name: 'Shanghai Hongqiao International' },
    { code: 'CAN', city: 'Guangzhou', country: 'China', name: 'Guangzhou Baiyun International' },
    { code: 'SZX', city: 'Shenzhen', country: 'China', name: 'Shenzhen Bao\'an International' },
    { code: 'CTU', city: 'Chengdu', country: 'China', name: 'Chengdu Shuangliu International' },
    
    // India
    { code: 'DEL', city: 'New Delhi', country: 'India', name: 'Indira Gandhi International' },
    { code: 'BOM', city: 'Mumbai', country: 'India', name: 'Chhatrapati Shivaji International' },
    { code: 'BLR', city: 'Bangalore', country: 'India', name: 'Kempegowda International' },
    { code: 'MAA', city: 'Chennai', country: 'India', name: 'Chennai International' },
    { code: 'HYD', city: 'Hyderabad', country: 'India', name: 'Rajiv Gandhi International' },
    { code: 'CCU', city: 'Kolkata', country: 'India', name: 'Netaji Subhas Chandra Bose International' },
    { code: 'GOI', city: 'Goa', country: 'India', name: 'Goa International' },
    { code: 'COK', city: 'Kochi', country: 'India', name: 'Cochin International' },
    { code: 'AMD', city: 'Ahmedabad', country: 'India', name: 'Sardar Vallabhbhai Patel International' },
    { code: 'PNQ', city: 'Pune', country: 'India', name: 'Pune Airport' },
    
    // Bangladesh
    { code: 'DAC', city: 'Dhaka', country: 'Bangladesh', name: 'Hazrat Shahjalal International' },
    { code: 'CGP', city: 'Chittagong', country: 'Bangladesh', name: 'Shah Amanat International' },
    { code: 'SPD', city: 'Saidpur', country: 'Bangladesh', name: 'Saidpur Airport' },
    { code: 'JSR', city: 'Jashore', country: 'Bangladesh', name: 'Jashore Airport' },
    
    // Sri Lanka
    { code: 'CMB', city: 'Colombo', country: 'Sri Lanka', name: 'Bandaranaike International' },
    { code: 'HRI', city: 'Hambantota', country: 'Sri Lanka', name: 'Mattala Rajapaksa International' },
    
    // Nepal
    { code: 'KTM', city: 'Kathmandu', country: 'Nepal', name: 'Tribhuvan International' },
    { code: 'PKR', city: 'Pokhara', country: 'Nepal', name: 'Pokhara Airport' },
    
    // Australia
    { code: 'SYD', city: 'Sydney', country: 'Australia', name: 'Kingsford Smith Airport' },
    { code: 'MEL', city: 'Melbourne', country: 'Australia', name: 'Melbourne Airport' },
    { code: 'BNE', city: 'Brisbane', country: 'Australia', name: 'Brisbane Airport' },
    { code: 'PER', city: 'Perth', country: 'Australia', name: 'Perth Airport' },
    { code: 'ADL', city: 'Adelaide', country: 'Australia', name: 'Adelaide Airport' },
    { code: 'DRW', city: 'Darwin', country: 'Australia', name: 'Darwin Airport' },
    { code: 'CNS', city: 'Cairns', country: 'Australia', name: 'Cairns Airport' },
    { code: 'GC', city: 'Gold Coast', country: 'Australia', name: 'Gold Coast Airport' },
    
    // New Zealand
    { code: 'AKL', city: 'Auckland', country: 'New Zealand', name: 'Auckland Airport' },
    { code: 'CHC', city: 'Christchurch', country: 'New Zealand', name: 'Christchurch Airport' },
    { code: 'WLG', city: 'Wellington', country: 'New Zealand', name: 'Wellington Airport' },
    { code: 'ZQN', city: 'Queenstown', country: 'New Zealand', name: 'Queenstown Airport' },
    
    // South Africa
    { code: 'JNB', city: 'Johannesburg', country: 'South Africa', name: 'O.R. Tambo International' },
    { code: 'CPT', city: 'Cape Town', country: 'South Africa', name: 'Cape Town International' },
    { code: 'DUR', city: 'Durban', country: 'South Africa', name: 'King Shaka International' },
    { code: 'PLZ', city: 'Port Elizabeth', country: 'South Africa', name: 'Port Elizabeth Airport' },
    
    // Egypt
    { code: 'CAI', city: 'Cairo', country: 'Egypt', name: 'Cairo International' },
    { code: 'HRG', city: 'Hurghada', country: 'Egypt', name: 'Hurghada International' },
    { code: 'SSH', city: 'Sharm El Sheikh', country: 'Egypt', name: 'Sharm El Sheikh International' },
    { code: 'LXR', city: 'Luxor', country: 'Egypt', name: 'Luxor International' },
    
    // Morocco
    { code: 'CMN', city: 'Casablanca', country: 'Morocco', name: 'Mohammed V International' },
    { code: 'RAK', city: 'Marrakech', country: 'Morocco', name: 'Marrakech Menara Airport' },
    { code: 'FEZ', city: 'Fez', country: 'Morocco', name: 'Fez–Saïs Airport' },
    { code: 'AGA', city: 'Agadir', country: 'Morocco', name: 'Agadir–Al Massira Airport' },
    
    // Turkey
    { code: 'IST', city: 'Istanbul', country: 'Turkey', name: 'Istanbul Airport' },
    { code: 'SAW', city: 'Istanbul', country: 'Turkey', name: 'Sabiha Gökçen International' },
    { code: 'AYT', city: 'Antalya', country: 'Turkey', name: 'Antalya Airport' },
    { code: 'ESB', city: 'Ankara', country: 'Turkey', name: 'Esenboğa Airport' },
    { code: 'ADB', city: 'Izmir', country: 'Turkey', name: 'Adnan Menderes Airport' },
    { code: 'BJV', city: 'Bodrum', country: 'Turkey', name: 'Bodrum-Milas Airport' },
    
    // Canada
    { code: 'YYZ', city: 'Toronto', country: 'Canada', name: 'Pearson International' },
    { code: 'YVR', city: 'Vancouver', country: 'Canada', name: 'Vancouver International' },
    { code: 'YUL', city: 'Montreal', country: 'Canada', name: 'Pierre Elliott Trudeau International' },
    { code: 'YYC', city: 'Calgary', country: 'Canada', name: 'Calgary International' },
    { code: 'YEG', city: 'Edmonton', country: 'Canada', name: 'Edmonton International' },
    { code: 'YOW', city: 'Ottawa', country: 'Canada', name: 'Macdonald-Cartier International' },
    { code: 'YHZ', city: 'Halifax', country: 'Canada', name: 'Halifax Stanfield International' },
    
    // Brazil
    { code: 'GRU', city: 'São Paulo', country: 'Brazil', name: 'Guarulhos International' },
    { code: 'GIG', city: 'Rio de Janeiro', country: 'Brazil', name: 'Galeão International' },
    { code: 'BSB', city: 'Brasília', country: 'Brazil', name: 'Brasília International' },
    { code: 'FOR', city: 'Fortaleza', country: 'Brazil', name: 'Pinto Martins International' },
    { code: 'SSA', city: 'Salvador', country: 'Brazil', name: 'Deputado Luís Eduardo Magalhães International' },
    { code: 'REC', city: 'Recife', country: 'Brazil', name: 'Guararapes International' },
    
    // Argentina
    { code: 'EZE', city: 'Buenos Aires', country: 'Argentina', name: 'Ezeiza International' },
    { code: 'AEP', city: 'Buenos Aires', country: 'Argentina', name: 'Jorge Newbery Airfield' },
    { code: 'COR', city: 'Córdoba', country: 'Argentina', name: 'Córdoba Airport' },
    { code: 'MDZ', city: 'Mendoza', country: 'Argentina', name: 'Governor Francisco Gabrielli International' },
    
    // Mexico
    { code: 'MEX', city: 'Mexico City', country: 'Mexico', name: 'Mexico City International' },
    { code: 'CUN', city: 'Cancún', country: 'Mexico', name: 'Cancún International' },
    { code: 'GDL', city: 'Guadalajara', country: 'Mexico', name: 'Guadalajara International' },
    { code: 'MTY', city: 'Monterrey', country: 'Mexico', name: 'General Mariano Escobedo International' },
    { code: 'PVR', city: 'Puerto Vallarta', country: 'Mexico', name: 'Licenciado Gustavo Díaz Ordaz International' },
    
    // Russia
    { code: 'SVO', city: 'Moscow', country: 'Russia', name: 'Sheremetyevo International' },
    { code: 'DME', city: 'Moscow', country: 'Russia', name: 'Domodedovo International' },
    { code: 'VKO', city: 'Moscow', country: 'Russia', name: 'Vnukovo Airport' },
    { code: 'LED', city: 'St. Petersburg', country: 'Russia', name: 'Pulkovo Airport' },
    { code: 'SVX', city: 'Yekaterinburg', country: 'Russia', name: 'Koltsovo Airport' },
    
    // Indonesia
    { code: 'CGK', city: 'Jakarta', country: 'Indonesia', name: 'Soekarno-Hatta International' },
    { code: 'DPS', city: 'Denpasar', country: 'Indonesia', name: 'Ngurah Rai International' },
    { code: 'SUB', city: 'Surabaya', country: 'Indonesia', name: 'Juanda International' },
    { code: 'MLG', city: 'Malang', country: 'Indonesia', name: 'Abdul Rachman Saleh Airport' },
    { code: 'YIA', city: 'Yogyakarta', country: 'Indonesia', name: 'Yogyakarta International Airport' },
    
    // Malaysia
    { code: 'KUL', city: 'Kuala Lumpur', country: 'Malaysia', name: 'Kuala Lumpur International' },
    { code: 'PEN', city: 'Penang', country: 'Malaysia', name: 'Penang International' },
    { code: 'JHB', city: 'Johor Bahru', country: 'Malaysia', name: 'Senai International' },
    { code: 'KCH', city: 'Kuching', country: 'Malaysia', name: 'Kuching Airport' },
    { code: 'BKI', city: 'Kota Kinabalu', country: 'Malaysia', name: 'Kota Kinabalu International' },
    
    // Philippines
    { code: 'MNL', city: 'Manila', country: 'Philippines', name: 'Ninoy Aquino International' },
    { code: 'CEB', city: 'Cebu', country: 'Philippines', name: 'Mactan-Cebu International' },
    { code: 'DVO', city: 'Davao', country: 'Philippines', name: 'Francisco Bangoy International' },
    { code: 'ILO', city: 'Iloilo', country: 'Philippines', name: 'Iloilo International' },
    
    // Vietnam
    { code: 'SGN', city: 'Ho Chi Minh City', country: 'Vietnam', name: 'Tan Son Nhat International' },
    { code: 'HAN', city: 'Hanoi', country: 'Vietnam', name: 'Noi Bai International' },
    { code: 'DAD', city: 'Da Nang', country: 'Vietnam', name: 'Da Nang International' },
    { code: 'CXR', city: 'Nha Trang', country: 'Vietnam', name: 'Cam Ranh International' },
    
    // Iran
    { code: 'IKA', city: 'Tehran', country: 'Iran', name: 'Imam Khomeini International' },
    { code: 'MHD', city: 'Mashhad', country: 'Iran', name: 'Mashhad International' },
    { code: 'IFN', city: 'Isfahan', country: 'Iran', name: 'Isfahan International' },
    { code: 'SYZ', city: 'Shiraz', country: 'Iran', name: 'Shiraz International' },
    
    // Iraq
    { code: 'BGW', city: 'Baghdad', country: 'Iraq', name: 'Baghdad International' },
    { code: 'BSR', city: 'Basra', country: 'Iraq', name: 'Basra International' },
    { code: 'EBL', city: 'Erbil', country: 'Iraq', name: 'Erbil International' },
    { code: 'ISU', city: 'Sulaymaniyah', country: 'Iraq', name: 'Sulaymaniyah International' },
    
    // Jordan
    { code: 'AMM', city: 'Amman', country: 'Jordan', name: 'Queen Alia International' },
    { code: 'AQJ', city: 'Aqaba', country: 'Jordan', name: 'King Hussein International' },
    
    // Lebanon
    { code: 'BEY', city: 'Beirut', country: 'Lebanon', name: 'Rafic Hariri International' },
    
    // Israel
    { code: 'TLV', city: 'Tel Aviv', country: 'Israel', name: 'Ben Gurion Airport' },
    { code: 'VDA', city: 'Eilat', country: 'Israel', name: 'Ramon Airport' },
    
    // Kenya
    { code: 'NBO', city: 'Nairobi', country: 'Kenya', name: 'Jomo Kenyatta International' },
    { code: 'MBA', city: 'Mombasa', country: 'Kenya', name: 'Moi International' },
    
    // Ethiopia
    { code: 'ADD', city: 'Addis Ababa', country: 'Ethiopia', name: 'Bole International' },
    
    // Nigeria
    { code: 'LOS', city: 'Lagos', country: 'Nigeria', name: 'Murtala Muhammed International' },
    { code: 'ABV', city: 'Abuja', country: 'Nigeria', name: 'Nnamdi Azikiwe International' },
    { code: 'KAN', city: 'Kano', country: 'Nigeria', name: 'Mallam Aminu Kano International' },
    { code: 'PHC', city: 'Port Harcourt', country: 'Nigeria', name: 'Port Harcourt International' },
    
    // Ghana
    { code: 'ACC', city: 'Accra', country: 'Ghana', name: 'Kotoka International' },
    { code: 'KMS', city: 'Kumasi', country: 'Ghana', name: 'Kumasi Airport' },
    { code: 'MLE', city: 'Malé', country: 'Maldives', name: 'Velana International Airport' },
];


export function formatAirportLabel(airport: Airport): string {
  return `${airport.city} (${airport.code})`;
}

/** Common destination aliases → IATA */
const ALIASES: Record<string, string> = {
  makkah: 'JED',
  mecca: 'JED',
  madinah: 'MED',
  medina: 'MED',
  maldives: 'MLE',
  male: 'MLE',
  malé: 'MLE',
  london: 'LHR',
  dubai: 'DXB',
  istanbul: 'IST',
  skardu: 'KDU',
};

/** Ranked typeahead: code match first, then city, then name/country */
export function searchAirports(input: string, limit = 12): Airport[] {
  const q = input.trim().toLowerCase();
  if (!q) return [];

  const aliasCode = ALIASES[q];
  const aliasHit = aliasCode
    ? AIRPORTS.find((a) => a.code === aliasCode)
    : undefined;

  const scored = AIRPORTS.map((airport) => {
    const code = airport.code.toLowerCase();
    const city = airport.city.toLowerCase();
    const country = airport.country.toLowerCase();
    const name = airport.name.toLowerCase();
    let score = 0;

    if (code === q) score = 100;
    else if (code.startsWith(q)) score = 90;
    else if (city === q) score = 85;
    else if (city.startsWith(q)) score = 80;
    else if (city.includes(q)) score = 70;
    else if (country.startsWith(q)) score = 55;
    else if (country.includes(q)) score = 45;
    else if (name.includes(q)) score = 40;
    else if (code.includes(q)) score = 35;

    return { airport, score };
  })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score || a.airport.city.localeCompare(b.airport.city));

  const seen = new Set<string>();
  const results: Airport[] = [];
  if (aliasHit) {
    results.push(aliasHit);
    seen.add(aliasHit.code);
  }
  for (const row of scored) {
    if (seen.has(row.airport.code)) continue;
    seen.add(row.airport.code);
    results.push(row.airport);
    if (results.length >= limit) break;
  }
  return results;
}

export function resolveAirportInput(input: string): Airport | undefined {
  const q = input.trim().toLowerCase();
  if (!q) return undefined;
  const exactCode = AIRPORTS.find((a) => a.code.toLowerCase() === q);
  if (exactCode) return exactCode;
  const fromLabel = q.match(/\(([a-z0-9]{3,4})\)$/i);
  if (fromLabel) {
    return AIRPORTS.find((a) => a.code.toLowerCase() === fromLabel[1].toLowerCase());
  }
  const matches = searchAirports(input, 5);
  if (matches.length === 1) return matches[0];
  const cityExact = matches.find((a) => a.city.toLowerCase() === q);
  return cityExact || matches[0];
}
