// Ready-to-use 3-panel storyboard prompt templates.
// Each template gives a starting point; users can edit before generating.

export const PROMPT_TEMPLATES = [
  {
    id: 'dremina-italy-trip',
    name: '🇮🇹 Dremina: Nenek & Cucu ke Italy',
    style: 'cinematic realism, warm natural lighting, photorealistic, 8K, shallow depth of field',
    duration: 12,
    panels: [
      // Scene 1 – Berangkat dari rumah menuju bandara
      'Cinematic wide shot, a 55-year-old Indonesian grandmother with warm smile and traditional batik blouse, holding hands with two grandchildren – a 10-year-old boy in casual clothes and a 10-year-old girl in a colorful dress – walking excitedly toward a waiting car in front of their house at golden hour, suitcases loaded in the trunk, soft sunlight, photorealistic, 12-second duration feel',

      // Scene 2 – Naik pesawat & di dalam pesawat
      'Cinematic medium shot inside a modern airplane cabin, the 55-year-old Indonesian grandmother sitting between her two 10-year-old grandchildren (boy by the window, girl on the aisle), all wearing seatbelts, grandmother pointing out the airplane window with joy as clouds pass by, soft warm cabin lighting, cozy and cheerful atmosphere, photorealistic 8K',

      // Scene 3 – Turun dari pesawat
      'Cinematic shot of an airport jet bridge exit, the 55-year-old Indonesian grandmother and her two 10-year-old grandchildren (boy and girl) stepping off the plane onto the aerobridge, pulling cabin luggage, all looking refreshed and excited, bright airport lighting, destination board visible in background showing "ROMA FIUMICINO", photorealistic',

      // Scene 4 – Tiba di Italy (landmark)
      'Cinematic wide establishing shot, the 55-year-old Indonesian grandmother with two 10-year-old grandchildren (boy and girl) standing in front of the iconic Trevi Fountain in Rome Italy, golden afternoon light, tourists in background, grandmother spreading arms wide with joy, children laughing and pointing at the fountain, Italian architecture, lush warm tones, photorealistic 8K',

      // Scene 5 – Penutup / kebersamaan
      'Cinematic golden hour portrait, the 55-year-old Indonesian grandmother sitting on outdoor cafe steps in a narrow cobblestone alley in Rome Italy, arms lovingly around her two 10-year-old grandchildren (boy and girl), all three smiling warmly at camera, gelato in children\'s hands, Italian flags and flowers in background, soft bokeh, emotional and heartwarming, photorealistic 8K, cinematic closing shot'
    ]
  },
  {
    id: 'tiktok-twist',
    name: 'TikTok Twist (Plot Twist)',
    style: 'cinematic, vibrant, ultra-detailed',
    panels: [
      'Close-up wajah remaja kota Jakarta tersenyum percaya diri di kafe modern, golden hour lighting',
      'Reaksi terkejut karakter ketika melihat layar smartphone, ekspresi dramatis, depth of field',
      'Twist ending: ternyata layar menampilkan notifikasi viral 1 juta views, fireworks di latar belakang'
    ]
  },
  {
    id: 'product-launch',
    name: 'Product Launch',
    style: 'studio product photography, clean, minimal',
    panels: [
      'Produk misterius tertutup kain hitam di tengah panggung, spotlight dramatis',
      'Kain tersingkap perlahan, mengungkap produk dengan glow effect dan partikel cahaya',
      'Produk dipegang model dengan latar belakang kota futuristik, lens flare'
    ]
  },
  {
    id: 'travel-vlog',
    name: 'Travel Vlog Bali',
    style: 'cinematic travel, warm tones, sun-kissed',
    panels: [
      'Sunrise di pantai Canggu Bali, surfer berjalan dengan papan ke arah ombak',
      'Drone shot atas sawah Tegalalang dengan petani bekerja di pagi hari',
      'Sunset api unggun di pantai dengan teman-teman tertawa, atmospheric'
    ]
  },
  {
    id: 'comic-action',
    name: 'Comic Action Scene',
    style: 'comic book illustration, bold lines, dynamic',
    panels: [
      'Pahlawan super berdiri di atas gedung pencakar langit memandang kota saat hujan',
      'Aksi melompat antar gedung dengan motion blur, halftone effect',
      'Mendarat di hadapan musuh, pose heroic, dramatic shadow'
    ]
  },
  {
    id: 'food-recipe',
    name: 'Food Recipe Reels',
    style: 'food photography, overhead shot, vibrant',
    panels: [
      'Bahan-bahan rendang tersusun rapi di atas meja kayu, top down view',
      'Tangan koki mengaduk bumbu di wajan, uap mengepul, close-up detail',
      'Hidangan rendang final di piring keramik dengan nasi, garnish, ready to eat'
    ]
  }
];

export const DEFAULT_STYLE = 'realistic, cinematic, colorful';
export const DEFAULT_RESOLUTION = '1024x1024';
