export const fardarDistrictCityMap: Record<string, string[]> = {
  Ampara: ["Akkaraipattu", "Ampara", "Dehiaththakandiya", "Kalmunai", "Pottuvil"],
  Anuradhapura: ["Anuradhapura", "Kebithigollewa", "Kekirawa", "Medawachchiya", "Thambuttegama"],
  Badulla: ["Badulla", "Bandarawela", "Mahiyanganaya", "Welimada"],
  Batticaloa: ["Batticaloa", "Valaichchenai"],
  Colombo: ["Avissawella", "City Office", "Fardar International", "Hanwella", "Homagama", "Kohuwala", "Kotte", "Malabe", "Pannipitiya", "Piliyandala", "Ratmalana", "Wellampitiya"],
  Galle: ["Ambalangoda", "Baddegama", "Galle", "Imaduwa", "Uragasmanhandiya"],
  Gampaha: ["Biyagama", "Divulapitiya", "Katunayake", "Kirindiwela", "Negombo", "Pasyala", "Wattala", "Yakkala"],
  Hambantota: ["Ranna", "Tissamaharama", "Walasmulla"],
  Jaffna: ["Jaffna", "Kodikamam", "Nelliady"],
  Kalutara: ["Dharga Town", "Horana", "Kalutara", "Matugama", "Panadura"],
  Kandy: ["Akurana", "Digana", "Gampola", "Kandy", "Nawalapitiya", "Peradeniya"],
  Kegalle: ["Kegalle", "Mawanella", "Yatiyanthota"],
  Kilinochchi: ["Kilinochchi"],
  Kurunegala: ["Kuliyapitiya", "Kurunegala", "Mahawa", "Mawathagama", "Melsiripura", "Narammala", "Nikaweratiya", "Wariyapola"],
  Mannar: ["Mannar"],
  Matale: ["Dambulla", "Matale"],
  Matara: ["Matara", "Morawaka"],
  Monaragala: ["Bibile", "Monaragala", "Siyambalanduwa", "Wellawaya"],
  Mullaitivu: ["Mullaitivu"],
  "Nuwara Eliya": ["Hatton", "Nuwara Eliya", "Rikillagaskada", "Walapane"],
  Polonnaruwa: ["Hingurakgoda", "Polonnaruwa"],
  Puttalam: ["Chilaw", "Puttalam", "Wennappuwa"],
  Ratnapura: ["Balangoda", "Eheliyagoda", "Embilipitiya", "Kahawatta", "Kalawana", "Ratnapura"],
  Trincomalee: ["Kantale", "Trincomalee"],
  Vavuniya: ["Vavuniya"]
};

export const allFardarCities = Object.values(fardarDistrictCityMap).flat().sort();
