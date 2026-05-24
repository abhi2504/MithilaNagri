// Download REAL stage images for a ritual journey into public/img/stage-<slug>-<key>.jpg.
// Usage: node scripts/fetch-stage-images.mjs <ritual-slug>
// Edit MANIFEST below: per ritual slug, map stage key -> { url, credit, source }.
// Real photos take priority; any key left out keeps its existing (often AI) image.
// Commons requires a descriptive User-Agent or it returns 403.
import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const OUT = path.resolve('public/img');
const UA = 'MithilaEncyclopedia/1.0 (educational cultural site; contact abjha@ivp.in)';

// ─── EDIT ME ─────────────────────────────────────────────────────────────────
const C = 'https://upload.wikimedia.org/wikipedia/commons';
const MANIFEST = {
  'maithil-vivah': {
    // Maithil-SPECIFIC real photos (highest value)
    panji: { url: `${C}/2/2a/Example_of_a_panji_genealogical_record_kept_by_Maithili_Kayasthas_and_Brahmins_of_the_Mithila_region_of_northern_India.jpg`, credit: 'Wikimedia Commons (public domain)', source: 'https://commons.wikimedia.org/wiki/File:Example_of_a_panji_genealogical_record_kept_by_Maithili_Kayasthas_and_Brahmins_of_the_Mithila_region_of_northern_India.jpg' },
    matkor: { url: `${C}/1/1a/Procession_of_Matkor_ritual_%28Maithil_Upanayan%29.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Procession_of_Matkor_ritual_(Maithil_Upanayan).jpg' },
    marwa: { url: `${C}/9/9e/Women_preparing_a_marwa_mandap.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Women_preparing_a_marwa_mandap.jpg' },
    agman: { url: `${C}/4/4d/Janti_or_Baryati_%28The_Groom%27s_Wedding_Procession%29_in_Janki_Temple-070A6158.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Janti_or_Baryati_(The_Groom%27s_Wedding_Procession)_in_Janki_Temple-070A6158.jpg' },
    kanyadan: { url: `${C}/9/9d/Maithil_Vivah.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Maithil_Vivah.jpg' },
    parichhan: { url: `${C}/e/e6/Chumavan_in_Maithil_Vivah.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Chumavan_in_Maithil_Vivah.jpg' },
    shagun: { url: `${C}/1/1d/Chumavan.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Chumavan.jpg' },
    kohbar: { url: `${C}/3/3e/KOHBAR_BY_ARTI_KUMARI.jpg`, credit: 'Arti Kumari, Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:KOHBAR_BY_ARTI_KUMARI.jpg' },
    saurath: { url: `${C}/3/3e/Saurath_Sabha-7.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Saurath_Sabha-7.jpg' },
    // accurate generic Hindu-wedding photos for the shared rites
    saptapadi: { url: `${C}/6/69/%28A%29_Hindu_wedding%2C_Saptapadi_ritual_before_Agni_Yajna.jpg`, credit: 'Wikimedia Commons, CC BY 2.0', source: 'https://commons.wikimedia.org/wiki/File:(A)_Hindu_wedding,_Saptapadi_ritual_before_Agni_Yajna.jpg' },
    chaturthi: { url: `${C}/4/40/Sindoor_ceremony_at_an_Indian_wedding.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Sindoor_ceremony_at_an_Indian_wedding.jpg' },
    haldi: { url: `${C}/4/48/Haldi_Ceremony_-_An_Indian_Wedding_Ritual.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Haldi_Ceremony_-_An_Indian_Wedding_Ritual.jpg' },
    tilak: { url: `${C}/3/3d/Indian_Engagement_ceremony_17.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Indian_Engagement_ceremony_17.jpg' },
    khoichha: { url: `${C}/d/d2/Bidaai_in_hindus.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Bidaai_in_hindus.jpg' },
    // keys with no authentic photo keep their AI Madhubani image: agua, siddhant, aam-mahu, dwiragaman
  },
  'upanayan': {
    // authentic Maithil Upanayan photo set (Sntshkumar750 / Santosh Chaudhary, Madhubani; CC BY-SA 4.0)
    udog: { url: `${C}/7/79/Baskatti_Bidh_%28_Maithil_Upanayana%29.jpg`, credit: 'Santosh Chaudhary, Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Baskatti_Bidh_(_Maithil_Upanayana).jpg' },
    marwa: { url: `${C}/0/0f/Maithil_Upanayan_Mandap.jpg`, credit: 'Santosh Chaudhary, Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Maithil_Upanayan_Mandap.jpg' },
    matkor: { url: `${C}/c/c4/Matkor_rituals_%28_Maithil_Upanayan%29.jpg`, credit: 'Santosh Chaudhary, Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Matkor_rituals_(_Maithil_Upanayan).jpg' },
    matrika: { url: `${C}/e/e4/Matrika_Puja_%28Maithil_Vivah%29.jpg`, credit: 'Santosh Chaudhary, Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Matrika_Puja_(Maithil_Vivah).jpg' },
    janeu: { url: `${C}/d/de/Maithil_Baruaa.jpg`, credit: 'Santosh Chaudhary, Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Maithil_Baruaa.jpg' },
    gayatri: { url: `${C}/0/00/Maithil_Upanayan.jpg`, credit: 'Santosh Chaudhary, Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Maithil_Upanayan.jpg' },
    vows: { url: `${C}/b/bb/Maithil_Upanayan_Sanskar.jpg`, credit: 'Santosh Chaudhary, Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Maithil_Upanayan_Sanskar.jpg' },
    ratim: { url: `${C}/5/58/People_sitting_in_Maithil_Brahmin_Bhoj.jpg`, credit: 'Santosh Chaudhary, Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:People_sitting_in_Maithil_Brahmin_Bhoj.jpg' },
    // close analogues (Bengali Upanayan / Mithila tonsure / generic) for stages without a Maithil-specific frame
    churakaran: { url: `${C}/e/e3/Swastik_on_head.jpg`, credit: 'Wikimedia Commons, CC BY 2.0', source: 'https://commons.wikimedia.org/wiki/File:Swastik_on_head.jpg' },
    bhiksha: { url: `${C}/5/5c/Almsgiving_to_Brahmachari_-_Upanayana_Ceremony_-_Simurali_2015-01-30_5675.JPG`, credit: 'Biswarup Ganguly, Wikimedia Commons, CC BY 3.0', source: 'https://commons.wikimedia.org/wiki/File:Almsgiving_to_Brahmachari_-_Upanayana_Ceremony_-_Simurali_2015-01-30_5675.JPG' },
    charakh: { url: `${C}/a/a3/Charkha_spinning.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Charkha_spinning.jpg' },
    // kumaram keeps its AI Madhubani image (no authentic photo found)
  },
  'sohar-chhathi': {
    // birth rites are under-photographed on Commons; only these two have good real photos
    namkaran: { url: `${C}/e/e9/Child_in_Indian_Sari_Hammock_by_Etan_Doronne.jpg`, credit: 'Etan Doronne, Wikimedia Commons, CC BY-SA 3.0', source: 'https://commons.wikimedia.org/wiki/File:Child_in_Indian_Sari_Hammock_by_Etan_Doronne.jpg' },
    annaprashan: { url: `${C}/2/20/Annaprashan-Baby_eats_meal_for_the_first_time.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Annaprashan-Baby_eats_meal_for_the_first_time.jpg' },
    // sohar, chhathi, barahi keep AI Madhubani art (no authentic photo of these private rites)
  },
  'mundan': {
    'devi-sthan': { url: `${C}/d/d0/Mundan_Ceremony_at_the_Uchchaith_Bhagwati_Temple_Complex.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Mundan_Ceremony_at_the_Uchchaith_Bhagwati_Temple_Complex.jpg' },
    shaving: { url: `${C}/6/63/MundanOfMathil.jpg`, credit: 'Wikimedia Commons (public domain)', source: 'https://commons.wikimedia.org/wiki/File:MundanOfMathil.jpg' },
    hair: { url: `${C}/f/f3/Pilgrimers_after_%22mundan%22%2C_a_religious_ritual_in_Har_ki_Pauri_WTK20150925-DSC_4548.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Pilgrimers_after_%22mundan%22,_a_religious_ritual_in_Har_ki_Pauri_WTK20150925-DSC_4548.jpg' },
    // sankalp (priest + almanac) and chumaon (anointing/feast) keep AI Madhubani art (no authentic photo found)
  },
  'shradh': {
    // dignified, non-graphic real photos (no visible bodies) — ghats, riverbank pinda-daan, Gaya
    cremation: { url: `${C}/f/f5/Piles_of_wood%2C_Manikarnika_Ghat%2C_Varanasi%2C_Uttar_Pradesh%2C_India_%282012%29.jpg`, credit: 'Wikimedia Commons, CC BY 3.0', source: 'https://commons.wikimedia.org/wiki/File:Piles_of_wood,_Manikarnika_Ghat,_Varanasi,_Uttar_Pradesh,_India_(2012).jpg' },
    'kapal-kriya': { url: `${C}/a/af/Pashupatinath_-_Cremation_Ghats_%284802642822%29.jpg`, credit: 'Wikimedia Commons, CC BY-SA 2.0', source: 'https://commons.wikimedia.org/wiki/File:Pashupatinath_-_Cremation_Ghats_(4802642822).jpg' },
    asaucha: { url: `${C}/7/7a/Pinda_Daan_-_Jagannath_Ghat_-_Kolkata_2012-10-15_0571.JPG`, credit: 'Biswarup Ganguly, Wikimedia Commons, CC BY 3.0', source: 'https://commons.wikimedia.org/wiki/File:Pinda_Daan_-_Jagannath_Ghat_-_Kolkata_2012-10-15_0571.JPG' },
    kriya: { url: `${C}/1/15/Mahalaya%2C_an_auspicious_day_to_perform_Tarpan_02.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Mahalaya,_an_auspicious_day_to_perform_Tarpan_02.jpg' },
    gaya: { url: `${C}/d/d9/People_performing_rituals_an_Falgu_river-bed.JPG`, credit: 'Wikimedia Commons, CC BY-SA 3.0', source: 'https://commons.wikimedia.org/wiki/File:People_performing_rituals_an_Falgu_river-bed.JPG' },
  },
  'panji-system': {
    origin: { url: `${C}/e/e3/Map_of_the_Karnats_of_Mithila.png`, credit: 'Wikimedia Commons, CC0', source: 'https://commons.wikimedia.org/wiki/File:Map_of_the_Karnats_of_Mithila.png' },
    panjikar: { url: `${C}/5/59/Folio_of_a_genealogical_register_%28%27Bahi-Khata%27%29_of_Haridwar_for_a_local_village_near_Kanpur.jpg`, credit: 'Wikimedia Commons (public domain)', source: 'https://commons.wikimedia.org/wiki/File:Folio_of_a_genealogical_register_(%27Bahi-Khata%27)_of_Haridwar_for_a_local_village_near_Kanpur.jpg' },
    'mool-gotra': { url: `${C}/d/d9/The_consonants_of_the_Mithilakshar_script_and_the_corresponding_Devnagari.jpg`, credit: 'Wikimedia Commons (public domain)', source: 'https://commons.wikimedia.org/wiki/File:The_consonants_of_the_Mithilakshar_script_and_the_corresponding_Devnagari.jpg' },
    sapinda: { url: `${C}/2/27/Folio_of_a_genealogical_register_%28%27Bahi-Khata%27%29_of_Haridwar_for_the_Kapoor_family.jpg`, credit: 'Wikimedia Commons (public domain)', source: 'https://commons.wikimedia.org/wiki/File:Folio_of_a_genealogical_register_(%27Bahi-Khata%27)_of_Haridwar_for_the_Kapoor_family.jpg' },
    siddhant: { url: `${C}/b/bf/Sahodara_Inscription.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Sahodara_Inscription.jpg' },
    saurath: { url: `${C}/5/58/Saurath_Sabha-9.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Saurath_Sabha-9.jpg' },
  },
  'kohbar-ghar': {
    chamber: { url: `${C}/7/70/Sohrai_and_Kohbar_Paintings_01.jpg`, credit: 'Wikimedia Commons, CC0', source: 'https://commons.wikimedia.org/wiki/File:Sohrai_and_Kohbar_Paintings_01.jpg' },
    wall: { url: `${C}/a/aa/Mithila_Painting.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Mithila_Painting.jpg' },
    motifs: { url: `${C}/3/31/34545016_kohbar_auspicious_marriage_diagram_dh93.jpg`, credit: 'Wellcome Collection, Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:34545016_kohbar_auspicious_marriage_diagram_dh93.jpg' },
    symbolism: { url: `${C}/e/ef/Madhubani_Painting_of_Ram_-_Sita_Vivah.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Madhubani_Painting_of_Ram_-_Sita_Vivah.jpg' },
    'naina-jogin': { url: `${C}/7/7c/Little_world%2C_Aichi_prefecture_-_Main_exhibition_hall_-_Mithila_Painting%2C_India_-_Krishna_and_Radha.jpg`, credit: 'Wikimedia Commons, CC BY-SA 3.0', source: 'https://commons.wikimedia.org/wiki/File:Little_world,_Aichi_prefecture_-_Main_exhibition_hall_-_Mithila_Painting,_India_-_Krishna_and_Radha.jpg' },
    canvas: { url: `${C}/8/84/Colorful_Madhubani_painting.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Colorful_Madhubani_painting.jpg' },
  },
  // ─── FESTIVALS ───
  'chhath': {
    'nahay-khay': { url: `${C}/4/45/Holified.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Holified.jpg' },
    kharna: { url: `${C}/2/29/Kharna_Chhath_Puja.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Kharna_Chhath_Puja.jpg' },
    prasad: { url: `${C}/2/21/Chath_Puja_Traditional_Daura.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Chath_Puja_Traditional_Daura.jpg' },
    'sandhya-arghya': { url: `${C}/c/cf/Chhath_Puja_Sandya_Aragh-001.jpg`, credit: 'Wikimedia Commons, CC BY 2.0', source: 'https://commons.wikimedia.org/wiki/File:Chhath_Puja_Sandya_Aragh-001.jpg' },
    'usha-arghya': { url: `${C}/b/b6/Abishek_Shrestha_20181114_D5A4723-2.jpg`, credit: 'Abishek Shrestha, Wikimedia Commons, CC BY-SA 4.0 (Janakpur, Mithila)', source: 'https://commons.wikimedia.org/wiki/File:Abishek_Shrestha_20181114_D5A4723-2.jpg' },
  },
  'makar-sankranti': {
    snan: { url: `${C}/5/5e/Hindu_Devotees_Taking_Holy_Dip_In_Ganga_-_Makar_Sankranti_Observance_-_Ramkrishnapur_Ghat_-_Howrah_2018-01-14_6927.JPG`, credit: 'Biswarup Ganguly, Wikimedia Commons, CC BY 3.0', source: 'https://commons.wikimedia.org/wiki/File:Hindu_Devotees_Taking_Holy_Dip_In_Ganga_-_Makar_Sankranti_Observance_-_Ramkrishnapur_Ghat_-_Howrah_2018-01-14_6927.JPG' },
    'dahi-chura': { url: `${C}/3/3b/Chura-Dahi_Bhoj_of_Maithil_Brahmin.jpg`, credit: 'Santosh Chaudhary, Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Chura-Dahi_Bhoj_of_Maithil_Brahmin.jpg' },
    tila: { url: `${C}/2/2b/Til_Ke_Laddu%2C_a_traditional_dessert_snack_food_for_winter_solar_festival_of_Makar_Sankranti.jpg`, credit: 'Soniya Goyal, Wikimedia Commons, CC BY-SA 2.0', source: 'https://commons.wikimedia.org/wiki/File:Til_Ke_Laddu,_a_traditional_dessert_snack_food_for_winter_solar_festival_of_Makar_Sankranti.jpg' },
    dana: { url: `${C}/2/2a/Khichdi_Prasadam_in_Donna_%28Iskcon_Bangalore%29.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Khichdi_Prasadam_in_Donna_(Iskcon_Bangalore).jpg' },
  },
  'saraswati-puja': {
    basant: { url: `${C}/0/0c/Mustard_fields_in_bloom%2C_Verinag%2C_Kashmir.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Mustard_fields_in_bloom,_Verinag,_Kashmir.jpg' },
    puja: { url: `${C}/e/e9/Idol_of_Devi_Saraswati_at_Janshedpur_Jharkhand_01.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Idol_of_Devi_Saraswati_at_Janshedpur_Jharkhand_01.jpg' },
    akshar: { url: `${C}/4/4c/Sssm_aksharabhyasam.jpg`, credit: 'Wikimedia Commons, CC0', source: 'https://commons.wikimedia.org/wiki/File:Sssm_aksharabhyasam.jpg' },
    visarjan: { url: `${C}/b/bc/Immersion_of_an_idol_of_Saraswati_%28Babughat_Kolkata%29.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Immersion_of_an_idol_of_Saraswati_(Babughat_Kolkata).jpg' },
  },
  'phaguaa': {
    samat: { url: `${C}/7/71/Holika_Dahan_Illuminates_the_Night_Sky_-_Embers_of_Triumph.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Holika_Dahan_Illuminates_the_Night_Sky_-_Embers_of_Triumph.jpg' },
    rang: { url: `${C}/0/01/Gulal_clouds_as_children_play_Holi_at_Pushkar%2C_Rajasthan.jpg`, credit: 'Wikimedia Commons, CC BY 2.0', source: 'https://commons.wikimedia.org/wiki/File:Gulal_clouds_as_children_play_Holi_at_Pushkar,_Rajasthan.jpg' },
    jogira: { url: `${C}/7/7b/A_Group_of_Dholak_Players.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:A_Group_of_Dholak_Players.jpg' },
    bhojan: { url: `${C}/1/1e/Malpua_sweet_in_Kolkata%2C_India.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Malpua_sweet_in_Kolkata,_India.jpg' },
  },
  'ram-navami': {
    birth: { url: `${C}/c/ca/Ayodhya_Ram_Lalla_Virajman_Sarkar.jpg`, credit: 'Wikimedia Commons, GODL-India', source: 'https://commons.wikimedia.org/wiki/File:Ayodhya_Ram_Lalla_Virajman_Sarkar.jpg' },
    'vrat-path': { url: `${C}/b/b2/Devotees_singing_Rama_%26_Hanuman_bhajan.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Devotees_singing_Rama_%26_Hanuman_bhajan.jpg' },
    mithila: { url: `${C}/c/c5/Janaki_Mandir%2C_Janakpur_Nepal_01.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Janaki_Mandir,_Janakpur_Nepal_01.jpg' },
    shobha: { url: `${C}/9/99/Rama_Navami_30.jpg`, credit: 'Wikimedia Commons, CC BY-SA 3.0', source: 'https://commons.wikimedia.org/wiki/File:Rama_Navami_30.jpg' },
  },
  'jur-sital': {
    satuani: { url: `${C}/5/54/Sattu_Ghol.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Sattu_Ghol.jpg' },
    'basi-bhojan': { url: `${C}/d/d1/Panta_bhat.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Panta_bhat.jpg' },
    'nature-renewal': { url: `${C}/e/eb/Vice_Admiral_Ajit_Kumar_P_watering_a_sapling_after_planting_it_during_a_tree_plantation_drive.jpg`, credit: 'Wikimedia Commons, GODL-India', source: 'https://commons.wikimedia.org/wiki/File:Vice_Admiral_Ajit_Kumar_P_watering_a_sapling_after_planting_it_during_a_tree_plantation_drive.jpg' },
    // jur-water (cooling-water blessing) and naya-saal keep AI Madhubani art — no real photo depicts these
  },
  'sita-navami': {
    'famine-yajna': { url: `${C}/7/7a/Bullock_ploughing_sowing_groundnut_blackeyed_peas_Raichur_Karnataka_India.jp.jpg`, credit: 'Wikimedia Commons, CC BY-SA', source: 'https://commons.wikimedia.org/wiki/File:Bullock_ploughing_sowing_groundnut_blackeyed_peas_Raichur_Karnataka_India.jp.jpg' },
    'furrow-birth': { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/The_Birth_of_Sita_-_Raja_Janaka_of_Mithila_carrying_her_in_his_lap.jpg/1280px-The_Birth_of_Sita_-_Raja_Janaka_of_Mithila_carrying_her_in_his_lap.jpg', credit: 'Wikimedia Commons (public domain)', source: 'https://commons.wikimedia.org/wiki/File:The_Birth_of_Sita_-_Raja_Janaka_of_Mithila_carrying_her_in_his_lap.jpg' },
    'vrat-puja': { url: `${C}/a/ac/Ramapanchayan%2C_Ravi_Varma_Press.jpg`, credit: 'Ravi Varma Press, Wikimedia Commons (public domain)', source: 'https://commons.wikimedia.org/wiki/File:Ramapanchayan,_Ravi_Varma_Press.jpg' },
    melas: { url: `${C}/7/70/Punaura_Dham.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Punaura_Dham.jpg' },
  },
  'vat-savitri': {
    legend: { url: `${C}/a/a6/Satyavan_Savitri.jpg`, credit: 'Raja Ravi Varma, Wikimedia Commons (public domain)', source: 'https://commons.wikimedia.org/wiki/File:Satyavan_Savitri.jpg' },
    'vat-puja': { url: `${C}/b/be/Vat_Purnima_image_by_Raju_Kasambe_DSCN6393_01.jpg`, credit: 'Dr. Raju Kasambe, Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Vat_Purnima_image_by_Raju_Kasambe_DSCN6393_01.jpg' },
    vrat: { url: `${C}/9/9f/Vat_Savitri_Vrat.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Vat_Savitri_Vrat.jpg' },
    'date-today': { url: `${C}/0/0d/Big_Banyan_Tree_at_Bangalore.jpg`, credit: 'Wikimedia Commons, CC BY-SA 2.5 IN', source: 'https://commons.wikimedia.org/wiki/File:Big_Banyan_Tree_at_Bangalore.jpg' },
  },
  'naag-panchami': {
    'nag-puja': { url: `${C}/4/4a/Naag_pooja.jpg`, credit: 'Wikimedia Commons, CC BY-SA 3.0', source: 'https://commons.wikimedia.org/wiki/File:Naag_pooja.jpg' },
    deities: { url: `${C}/c/c0/42._Nagaraja%2C_the_serpent_king-9th_Century_CE-Chlorite-_Bihar-_Sculpture_Gallery-_Indian_Museum-Kolkata-3960-A25129.jpg`, credit: 'Indian Museum Kolkata, Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:42._Nagaraja,_the_serpent_king-9th_Century_CE-Chlorite-_Bihar-_Sculpture_Gallery-_Indian_Museum-Kolkata-3960-A25129.jpg' },
    bishahari: { url: `${C}/d/d4/Manasa_Devi.jpg`, credit: 'Wikimedia Commons (public domain)', source: 'https://commons.wikimedia.org/wiki/File:Manasa_Devi.jpg' },
    meaning: { url: `${C}/7/7f/Snake_charmer_with_Indian_cobra_in_Janakpur_Nepal.jpg`, credit: 'Wikimedia Commons, CC BY-SA 2.0 (Janakpur, Mithila)', source: 'https://commons.wikimedia.org/wiki/File:Snake_charmer_with_Indian_cobra_in_Janakpur_Nepal.jpg' },
  },
  'madhushravani': {
    arambh: { url: `${C}/c/cc/Madhushravani.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Madhushravani.jpg' },
    'phool-lorab': { url: `${C}/4/4f/Jasmine_flower_in_hand.JPG`, credit: 'Wikimedia Commons, CC BY-SA 3.0', source: 'https://commons.wikimedia.org/wiki/File:Jasmine_flower_in_hand.JPG' },
    'puja-bishahari': { url: `${C}/7/77/Madhushravani_pooja.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Madhushravani_pooja.jpg' },
    'katha-bihula': { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/India%2C_Calcutta%2C_Kalighat_painting%2C_19th_century_-_Manasa%2C_The_Snake_Goddess_-_2003.106_-_Cleveland_Museum_of_Art.tif/lossy-page1-1280px-India%2C_Calcutta%2C_Kalighat_painting%2C_19th_century_-_Manasa%2C_The_Snake_Goddess_-_2003.106_-_Cleveland_Museum_of_Art.tif.jpg', credit: 'Cleveland Museum of Art, Wikimedia Commons, CC0', source: 'https://commons.wikimedia.org/wiki/File:India,_Calcutta,_Kalighat_painting,_19th_century_-_Manasa,_The_Snake_Goddess_-_2003.106_-_Cleveland_Museum_of_Art.tif' },
    'tela-baati': { url: `${C}/6/6f/Women_Celebrating_Madhushravani.jpg`, credit: 'Wikimedia Commons, CC0', source: 'https://commons.wikimedia.org/wiki/File:Women_Celebrating_Madhushravani.jpg' },
    samapan: { url: `${C}/f/ff/Women_from_Mithilanchal.jpg`, credit: 'Wikimedia Commons, CC0', source: 'https://commons.wikimedia.org/wiki/File:Women_from_Mithilanchal.jpg' },
  },
  'indra-puja': {
    dhwaj: { url: `${C}/5/5c/Yosin_raising.jpg`, credit: 'Wikimedia Commons, CC BY-SA 3.0', source: 'https://commons.wikimedia.org/wiki/File:Yosin_raising.jpg' },
    puja: { url: `${C}/e/ea/Chariot_procession%2C_Indra_Jatra%2C_Kathmandu_Durbar_Square.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Chariot_procession,_Indra_Jatra,_Kathmandu_Durbar_Square.jpg' },
    legend: { url: `${C}/7/74/Indra%27s_Rain_Banteay_Srei_1264.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Indra%27s_Rain_Banteay_Srei_1264.jpg' },
    today: { url: `${C}/c/cb/Landscape_of_Paddy_Fields_near_Buxar_Town%2C_Bihar.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Landscape_of_Paddy_Fields_near_Buxar_Town,_Bihar.jpg' },
  },
  'jitiya': {
    'nahay-khay': { url: `${C}/5/56/Holy_Bath_-_Jivitputrika_-_Ramkrishnapur_Ghat_-_Howrah_-_Hooghly_River_2016-09-23_9556.JPG`, credit: 'Biswarup Ganguly, Wikimedia Commons, CC BY 3.0', source: 'https://commons.wikimedia.org/wiki/File:Holy_Bath_-_Jivitputrika_-_Ramkrishnapur_Ghat_-_Howrah_-_Hooghly_River_2016-09-23_9556.JPG' },
    'khur-jitiya': { url: `${C}/a/a0/Jivitputrika_Observation_-_Ramkrishnapur_Ghat_-_Howrah_2016-09-23_9570.JPG`, credit: 'Biswarup Ganguly, Wikimedia Commons, CC BY 3.0', source: 'https://commons.wikimedia.org/wiki/File:Jivitputrika_Observation_-_Ramkrishnapur_Ghat_-_Howrah_2016-09-23_9570.JPG' },
    katha: { url: `${C}/c/c7/Sculpture_of_Garuda.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Sculpture_of_Garuda.jpg' },
    paran: { url: `${C}/0/02/Ragi_roti.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Ragi_roti.jpg' },
  },
  'jhijhiya': {
    pots: { url: `${C}/0/0f/The_clay_pot_used_to_perform_Jhijhiya.png`, credit: 'eXploration Etoile, Wikimedia Commons, CC BY 2.0', source: 'https://commons.wikimedia.org/wiki/File:The_clay_pot_used_to_perform_Jhijhiya.png' },
    dance: { url: `${C}/1/12/Jhijhiya_Dance_of_Mithila_region.jpg`, credit: 'Niti Shah, Wikimedia Commons, CC0', source: 'https://commons.wikimedia.org/wiki/File:Jhijhiya_Dance_of_Mithila_region.jpg' },
    witchcraft: { url: `${C}/2/2f/Durga_Puja_DS.jpg`, credit: 'Augustus Binu, Wikimedia Commons, CC BY-SA 3.0', source: 'https://commons.wikimedia.org/wiki/File:Durga_Puja_DS.jpg' },
    today: { url: `${C}/f/fa/Women_performing_Jhijhiya_dance.jpg`, credit: 'Wikimedia Commons, CC BY 3.0 (Darbhanga, Bihar)', source: 'https://commons.wikimedia.org/wiki/File:Women_performing_Jhijhiya_dance.jpg' },
  },
  'kojagara': {
    bhaar: { url: `${C}/0/0e/Foxnut_Makhana_-_Nawada_District_-_Bihar_-_1.jpg`, credit: 'FacetsOfNonStickPans, Wikimedia Commons, CC BY-SA 4.0 (makhana, Bihar)', source: 'https://commons.wikimedia.org/wiki/File:Foxnut_Makhana_-_Nawada_District_-_Bihar_-_1.jpg' },
    chumawan: { url: `${C}/c/c6/Aripan.jpg`, credit: 'Sntshkumar750, Wikimedia Commons, CC BY-SA 4.0 (Mithila aripan)', source: 'https://commons.wikimedia.org/wiki/File:Aripan.jpg' },
    'lakshmi-puja': { url: `${C}/e/e6/Tiler_Naru_-_Kojagari_Lakshmi_Puja_Offering_-_Bengali_Brahman_Family_-_Howrah_20171005173335.jpg`, credit: 'Biswarup Ganguly, Wikimedia Commons, CC BY 3.0 (Kojagari Lakshmi Puja)', source: 'https://commons.wikimedia.org/wiki/File:Tiler_Naru_-_Kojagari_Lakshmi_Puja_Offering_-_Bengali_Brahman_Family_-_Howrah_20171005173335.jpg' },
    'ko-jagarti': { url: `${C}/a/ab/Full_Moon_Night_Sight.jpg`, credit: 'Hasparmar, Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Full_Moon_Night_Sight.jpg' },
    'makhana-prasad': { url: `${C}/1/11/Payesh_-_Kojagari_Lakshmi_Puja_Offering_-_Bengali_Brahman_Family_-_Howrah_20171005173501.jpg`, credit: 'Biswarup Ganguly, Wikimedia Commons, CC BY 3.0 (Kojagari kheer offering)', source: 'https://commons.wikimedia.org/wiki/File:Payesh_-_Kojagari_Lakshmi_Puja_Offering_-_Bengali_Brahman_Family_-_Howrah_20171005173501.jpg' },
  },
  'durga-puja': {
    ghatasthapana: { url: `${C}/6/60/Ghatasthapana_and_Ayudha_Puja_during_Navaratri_festival.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Ghatasthapana_and_Ayudha_Puja_during_Navaratri_festival.jpg' },
    'durga-puja': { url: `${C}/b/b5/Durga_killing_Mahisasur.jpg`, credit: 'Wikimedia Commons, public domain', source: 'https://commons.wikimedia.org/wiki/File:Durga_killing_Mahisasur.jpg' },
    vijayadashami: { url: `${C}/0/09/Dashain_Tika_Day.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0 (Dashain tika, Nepal)', source: 'https://commons.wikimedia.org/wiki/File:Dashain_Tika_Day.jpg' },
    mithila: { url: `${C}/5/55/Ma_Durga_at_Madhubani_style_at_Kolkata_AP.jpg`, credit: 'Wikimedia Commons, CC BY-SA 4.0 (Madhubani-style Durga)', source: 'https://commons.wikimedia.org/wiki/File:Ma_Durga_at_Madhubani_style_at_Kolkata_AP.jpg' },
  },
  'vivaha-panchami': {
    phulwari: { url: `${C}/thumb/e/ef/Madhubani_Painting_of_Ram_-_Sita_Vivah.jpg/1280px-Madhubani_Painting_of_Ram_-_Sita_Vivah.jpg`, credit: 'Suyash Dwivedi, Wikimedia Commons, CC BY-SA 4.0 (Madhubani Ram-Sita Vivah)', source: 'https://commons.wikimedia.org/wiki/File:Madhubani_Painting_of_Ram_-_Sita_Vivah.jpg' },
    'dhanush-yajna': { url: `${C}/b/bd/Rama_breaking_the_bow_to_win_Sita_as_wife.jpg`, credit: 'Raja Ravi Varma, Wikimedia Commons, public domain', source: 'https://commons.wikimedia.org/wiki/File:Rama_breaking_the_bow_to_win_Sita_as_wife.jpg' },
    barat: { url: `${C}/5/53/The_Wedding_Procession_of_Rama%2C_From_the_Mewar_Ramayana.jpg`, credit: 'Manohar of Mewar, Mewar Ramayana (1649), Wikimedia Commons, public domain', source: 'https://commons.wikimedia.org/wiki/File:The_Wedding_Procession_of_Rama,_From_the_Mewar_Ramayana.jpg' },
    vivah: { url: `${C}/thumb/a/a4/The_marriage_ceremony_of_Rama_and_Sita.jpg/1280px-The_marriage_ceremony_of_Rama_and_Sita.jpg`, credit: 'Shangri Ramayana (early 18th c.), National Museum New Delhi, Wikimedia Commons, public domain', source: 'https://commons.wikimedia.org/wiki/File:The_marriage_ceremony_of_Rama_and_Sita.jpg' },
    janakpur: { url: `${C}/b/b7/First_eye_view_of_janaki_mandir_janakpur.jpg`, credit: 'Bhupendra Shrestha, Wikimedia Commons, CC BY-SA 4.0 (Janaki Mandir, Janakpur)', source: 'https://commons.wikimedia.org/wiki/File:First_eye_view_of_janaki_mandir_janakpur.jpg' },
  },
  'sama-chakeva': {
    nirman: { url: `${C}/4/4a/Sama_Chakeva_is_a_native_festival_of_Mithila_2.jpg`, credit: 'Anand Rishav, Wikimedia Commons, CC BY-SA 4.0 (Sama-Chakeva clay figures)', source: 'https://commons.wikimedia.org/wiki/File:Sama_Chakeva_is_a_native_festival_of_Mithila_2.jpg' },
    'sandhya-geet': { url: `${C}/thumb/f/fb/Sama_Chakeba_Performed_by_Maithils.webp/960px-Sama_Chakeba_Performed_by_Maithils.webp.png`, credit: 'Maithil hoon, Wikimedia Commons, CC0 (women carrying the changera)', source: 'https://commons.wikimedia.org/wiki/File:Sama_Chakeba_Performed_by_Maithils.webp' },
    'chugla-jaran': { url: `${C}/e/e6/Idols_of_Sama_and_Chakeba.png`, credit: 'Maithil hoon, Wikimedia Commons, CC0 (Sama & Chakeba idols)', source: 'https://commons.wikimedia.org/wiki/File:Idols_of_Sama_and_Chakeba.png' },
    'bhai-pujan': { url: `${C}/e/ed/Bhai_Dooj_%28Bhai_Phonta%29.jpg`, credit: 'Billjones94, Wikimedia Commons, CC BY-SA 4.0 (Bhai Dooj — the sibling rite)', source: 'https://commons.wikimedia.org/wiki/File:Bhai_Dooj_(Bhai_Phonta).jpg' },
    visarjan: { url: `${C}/4/40/Sama_chakeva.jpg`, credit: 'Shivendujha, Wikimedia Commons, CC BY-SA 4.0 (Sama-Chakeva at dusk)', source: 'https://commons.wikimedia.org/wiki/File:Sama_chakeva.jpg' },
  },
};
// ─────────────────────────────────────────────────────────────────────────────

const slug = process.argv[2];
if (!slug || !MANIFEST[slug]) {
  console.error(`Provide a ritual slug present in MANIFEST. Have: ${Object.keys(MANIFEST).join(', ')}`);
  process.exit(1);
}

async function dl(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'image/*' }, redirect: 'follow' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const ct = res.headers.get('content-type') || '';
  if (!ct.startsWith('image/')) throw new Error(`not an image (${ct})`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 3000) throw new Error(`too small (${buf.length}b)`);
  await writeFile(dest, buf);
  return buf.length;
}

if (!existsSync(OUT)) await mkdir(OUT, { recursive: true });
const entries = Object.entries(MANIFEST[slug]);
let ok = 0, fail = 0;
const credits = [];
for (const [key, info] of entries) {
  const dest = path.join(OUT, `stage-${slug}-${key}.jpg`);
  try {
    const n = await dl(info.url, dest);
    console.log(`✓ ${key}  ${(n / 1024).toFixed(0)}kb  ${info.url.slice(0, 70)}`);
    credits.push({ key, credit: info.credit ?? '', source: info.source ?? info.url });
    ok++;
  } catch (e) {
    console.log(`✗ ${key}  ${e.message}  ${info.url.slice(0, 70)}`);
    fail++;
  }
  await new Promise((r) => setTimeout(r, 800)); // throttle: Commons rate-limits rapid pulls
}
console.log(`\nReal stage images for ${slug}: ${ok} ok, ${fail} failed (of ${entries.length}).`);
if (credits.length) {
  await writeFile(path.join(OUT, `_credits-stage-${slug}.json`), JSON.stringify(credits, null, 2));
  console.log(`Wrote credits to public/img/_credits-stage-${slug}.json`);
}
