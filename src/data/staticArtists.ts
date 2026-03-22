// 정적 아티스트 데이터 — Spotify API 없이 동작하는 완전한 데이터셋
// 이미지: Wikimedia Commons (CORS 허용, 무료, 공개 라이선스)
//         upload.wikimedia.org 는 CORS 헤더를 허용하므로 Three.js 텍스처로 사용 가능
// 링크: YouTube / Instagram / Spotify 직접 입력

import type { Artist } from '@/types/artist'

export const STATIC_ARTISTS: Artist[] = [
  // ─────────────────────────────────────────
  // 1. Green Day
  // ─────────────────────────────────────────
  {
    id: 'greenday',
    name: 'Green Day',
    imageUrl: '/artists/greenday_r.jpg',
    description: 'Punk rock legends from California who defined pop-punk with explosive energy and politically charged anthems.',
    genres: ['punk rock', 'alternative rock', 'pop punk'],
    spotifyUrl: 'https://open.spotify.com/artist/7Ey4PD4MYsKc5I2dolUwbH',
    featuredAlbum: {
      id: 'greenday-ai',
      name: 'American Idiot',
      imageUrl: '/albums/greenday-ai.jpg',
      tracks: [
        { number: 1, name: 'American Idiot' },
        { number: 2, name: 'Jesus of Suburbia' },
        { number: 3, name: 'Holiday' },
        { number: 4, name: 'Boulevard of Broken Dreams' },
        { number: 5, name: 'Are We the Waiting' },
        { number: 6, name: 'St. Jimmy' },
        { number: 7, name: 'Give Me Novacaine' },
        { number: 8, name: "She's a Rebel" },
        { number: 9, name: 'Extraordinary Girl' },
        { number: 10, name: 'Letterbomb' },
        { number: 11, name: 'Wake Me Up When September Ends' },
        { number: 12, name: 'Homecoming' },
        { number: 13, name: 'Whatsername' },
      ],
    },
    featuredTrack: { name: 'Boulevard of Broken Dreams', youtubeUrl: 'https://www.youtube.com/watch?v=Soa3gO7tL-c' },
    albumYoutubeUrl: 'https://www.youtube.com/watch?v=Soa3gO7tL-c',
    instagramUrl: 'https://www.instagram.com/greenday',
  },

  // ─────────────────────────────────────────
  // 2. LANY
  // ─────────────────────────────────────────
  {
    id: 'lany',
    name: 'LANY',
    imageUrl: '/artists/lany_r.jpg',
    description: 'LA-based indie pop trio crafting dreamy synth-driven soundscapes and heartfelt, cinematic love songs.',
    genres: ['indie pop', 'synth-pop', 'dream pop'],
    spotifyUrl: 'https://open.spotify.com/artist/5IaHrOWFB1NfWsXFCDAsLc',
    featuredAlbum: {
      id: 'lany-mb',
      name: "mama's boy",
      imageUrl: '/albums/lany-mb.jpg',
      tracks: [
        { number: 1, name: 'Thick and Thin' },
        { number: 2, name: 'I Still Talk to Jesus' },
        { number: 3, name: "I Don't Wanna Love You Anymore" },
        { number: 4, name: "Heart Won't Let Me" },
        { number: 5, name: 'Malibu Nights' },
        { number: 6, name: 'Bad About You' },
        { number: 7, name: 'Sail' },
        { number: 8, name: 'Thru These Tears' },
        { number: 9, name: 'color pink' },
        { number: 10, name: 'if this is the last time' },
        { number: 11, name: 'cowboy in LA' },
        { number: 12, name: 'let me know' },
      ],
    },
    featuredTrack: { name: 'ILYSB', youtubeUrl: 'https://www.youtube.com/watch?v=EAjMXFCd6dE' },
    albumYoutubeUrl: 'https://www.youtube.com/watch?v=EAjMXFCd6dE',
    instagramUrl: 'https://www.instagram.com/lanymusic',
  },

  // ─────────────────────────────────────────
  // 3. Yungblud
  // ─────────────────────────────────────────
  {
    id: 'yungblud',
    name: 'Yungblud',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Yungblud_2019_by_Glenn_Francis_%283x4_cropped%29.jpg/400px-Yungblud_2019_by_Glenn_Francis_%283x4_cropped%29.jpg',
    description: 'British alt-rock provocateur known for fierce advocacy for youth culture and electrifying live shows.',
    genres: ['alternative rock', 'pop punk', 'post-punk'],
    spotifyUrl: 'https://open.spotify.com/artist/6X9k3hSiLkHlWx1qFVRX4O',
    featuredAlbum: {
      id: 'yungblud-weird',
      name: 'Weird!',
      imageUrl: '/albums/yungblud-weird.jpg',
      tracks: [
        { number: 1, name: 'Teresa' },
        { number: 2, name: 'Cotton Candy' },
        { number: 3, name: 'Love Song' },
        { number: 4, name: 'Strawberry Lipstick' },
        { number: 5, name: 'God Save Me' },
        { number: 6, name: 'Charity' },
        { number: 7, name: 'The Freak Show' },
        { number: 8, name: 'Ice Cream Man' },
        { number: 9, name: 'Mars' },
        { number: 10, name: 'Superdeadfriends' },
        { number: 11, name: 'Rocketship' },
        { number: 12, name: 'Acting Like That' },
      ],
    },
    featuredTrack: { name: 'The Funeral', youtubeUrl: 'https://www.youtube.com/watch?v=DXskHBijBsc' },
    albumYoutubeUrl: 'https://www.youtube.com/watch?v=DXskHBijBsc',
    instagramUrl: 'https://www.instagram.com/yungblud',
  },

  // ─────────────────────────────────────────
  // 4. Taylor Swift
  // ─────────────────────────────────────────
  {
    id: 'taylorswift',
    name: 'Taylor Swift',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_%283%29.png/400px-Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_%283%29.png',
    description: 'Country-turned-pop icon and prolific songwriter behind countless cultural moments and record-breaking albums.',
    genres: ['pop', 'country pop', 'indie pop'],
    spotifyUrl: 'https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02',
    featuredAlbum: {
      id: 'ts-midnights',
      name: 'Midnights',
      imageUrl: '/albums/ts-midnights.jpg',
      tracks: [
        { number: 1, name: 'Lavender Haze' },
        { number: 2, name: 'Marjorie' },
        { number: 3, name: 'Anti-Hero' },
        { number: 4, name: 'Snow on the Beach' },
        { number: 5, name: 'Midnight Rain' },
        { number: 6, name: 'Question...?' },
        { number: 7, name: 'Vigilante Shit' },
        { number: 8, name: 'Bejeweled' },
        { number: 9, name: 'Labyrinth' },
        { number: 10, name: 'Karma' },
        { number: 11, name: 'Sweet Nothing' },
        { number: 12, name: 'Mastermind' },
      ],
    },
    featuredTrack: { name: 'Anti-Hero', youtubeUrl: 'https://www.youtube.com/watch?v=b1kbLwvqugk' },
    albumYoutubeUrl: 'https://www.youtube.com/watch?v=b1kbLwvqugk',
    instagramUrl: 'https://www.instagram.com/taylorswift',
  },

  // ─────────────────────────────────────────
  // 5. The Weeknd
  // ─────────────────────────────────────────
  {
    id: 'theweeknd',
    name: 'The Weeknd',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/The_Weeknd_Portrait_by_Brian_Ziff.jpg/400px-The_Weeknd_Portrait_by_Brian_Ziff.jpg',
    description: 'Canadian R&B artist blending moody synthwave with cinematic production and hauntingly distinctive vocals.',
    genres: ['r&b', 'pop', 'synth-pop'],
    spotifyUrl: 'https://open.spotify.com/artist/1Xyo4u8uXC1ZmMpatF05PJ',
    featuredAlbum: {
      id: 'weeknd-afterhours',
      name: 'After Hours',
      imageUrl: '/albums/weeknd-afterhours.jpg',
      tracks: [
        { number: 1, name: 'Alone Again' },
        { number: 2, name: 'Too Late' },
        { number: 3, name: 'Hardest to Love' },
        { number: 4, name: 'Scared to Live' },
        { number: 5, name: 'Snowchild' },
        { number: 6, name: 'Escape from LA' },
        { number: 7, name: 'Until I Bleed Out' },
        { number: 8, name: 'After Hours' },
        { number: 9, name: 'Save Your Tears' },
        { number: 10, name: 'Blinding Lights' },
        { number: 11, name: 'In Your Eyes' },
        { number: 12, name: 'Repeat After Me' },
      ],
    },
    featuredTrack: { name: 'Blinding Lights', youtubeUrl: 'https://www.youtube.com/watch?v=4NRXx6U8ABQ' },
    albumYoutubeUrl: 'https://www.youtube.com/watch?v=4NRXx6U8ABQ',
    instagramUrl: 'https://www.instagram.com/theweeknd',
  },

  // ─────────────────────────────────────────
  // 6. Billie Eilish
  // ─────────────────────────────────────────
  {
    id: 'billieeilish',
    name: 'Billie Eilish',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/BillieEilishO2140725-39_-_54665577407_%28cropped%29.jpg/400px-BillieEilishO2140725-39_-_54665577407_%28cropped%29.jpg',
    description: 'Gen Z pop phenomenon who redefined modern music with whispered vocals, dark aesthetics, and unflinching honesty.',
    genres: ['pop', 'electropop', 'dark pop'],
    spotifyUrl: 'https://open.spotify.com/artist/6qqNVTkY8uBg9cP3Jd7DAH',
    featuredAlbum: {
      id: 'billie-wwa',
      name: 'WHEN WE ALL FALL ASLEEP',
      imageUrl: '/albums/billie-wwa.jpg',
      tracks: [
        { number: 1, name: '!!!!!!' },
        { number: 2, name: 'bad guy' },
        { number: 3, name: 'xanny' },
        { number: 4, name: 'you should see me in a crown' },
        { number: 5, name: 'all the good girls go to hell' },
        { number: 6, name: 'wish you were gay' },
        { number: 7, name: "when the party's over" },
        { number: 8, name: '8' },
        { number: 9, name: 'my strange addiction' },
        { number: 10, name: 'bury a friend' },
        { number: 11, name: 'ilomilo' },
        { number: 12, name: 'i love you' },
      ],
    },
    featuredTrack: { name: 'bad guy', youtubeUrl: 'https://www.youtube.com/watch?v=DyDfgMOUjCI' },
    albumYoutubeUrl: 'https://www.youtube.com/watch?v=DyDfgMOUjCI',
    instagramUrl: 'https://www.instagram.com/billieeilish',
  },

  // ─────────────────────────────────────────
  // 7. Ariana Grande
  // ─────────────────────────────────────────
  {
    id: 'arianagrande',
    name: 'Ariana Grande',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Ariana_Grande_promoting_Wicked_%282024%29.jpg/400px-Ariana_Grande_promoting_Wicked_%282024%29.jpg',
    description: 'Powerhouse vocalist seamlessly blending pop, R&B, and trap with emotional depth and stunning vocal range.',
    genres: ['pop', 'r&b', 'trap pop'],
    spotifyUrl: 'https://open.spotify.com/artist/66CXWjxzNUsdJxJ2JdwvnR',
    featuredAlbum: {
      id: 'ari-tyg',
      name: 'thank u, next',
      imageUrl: '/albums/ari-tyg.jpg',
      tracks: [
        { number: 1, name: 'imagine' },
        { number: 2, name: 'needy' },
        { number: 3, name: 'NASA' },
        { number: 4, name: 'bloodline' },
        { number: 5, name: 'fake smile' },
        { number: 6, name: 'bad idea' },
        { number: 7, name: 'make up' },
        { number: 8, name: 'ghostin' },
        { number: 9, name: 'in my head' },
        { number: 10, name: '7 rings' },
        { number: 11, name: 'thank u, next' },
        { number: 12, name: "break up with your girlfriend, i'm bored" },
      ],
    },
    featuredTrack: { name: '7 rings', youtubeUrl: 'https://www.youtube.com/watch?v=QYh6mYIJG2Y' },
    albumYoutubeUrl: 'https://www.youtube.com/watch?v=QYh6mYIJG2Y',
    instagramUrl: 'https://www.instagram.com/arianagrande',
  },

  // ─────────────────────────────────────────
  // 8. Ed Sheeran
  // ─────────────────────────────────────────
  {
    id: 'edsheeran',
    name: 'Ed Sheeran',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Ed_Sheeran-6886_%28cropped%29.jpg/400px-Ed_Sheeran-6886_%28cropped%29.jpg',
    description: 'British singer-songwriter known for intricate guitar work, chart-topping hits, and deeply personal lyrics.',
    genres: ['pop', 'folk pop', 'acoustic pop'],
    spotifyUrl: 'https://open.spotify.com/artist/6eUKZXaKkcviH0Ku9w2n3V',
    featuredAlbum: {
      id: 'ed-divide',
      name: '÷ (Divide)',
      imageUrl: '/albums/ed-divide.jpg',
      tracks: [
        { number: 1, name: 'Eraser' },
        { number: 2, name: 'Castle on the Hill' },
        { number: 3, name: 'Dive' },
        { number: 4, name: 'Shape of You' },
        { number: 5, name: 'Perfect' },
        { number: 6, name: 'Galway Girl' },
        { number: 7, name: 'Happier' },
        { number: 8, name: 'New Man' },
        { number: 9, name: "Hearts Don't Break Around Here" },
        { number: 10, name: 'What Do I Know?' },
        { number: 11, name: 'Supermarket Flowers' },
        { number: 12, name: 'Barcelona' },
      ],
    },
    featuredTrack: { name: 'Shape of You', youtubeUrl: 'https://www.youtube.com/watch?v=JGwWNGJdvx8' },
    albumYoutubeUrl: 'https://www.youtube.com/watch?v=JGwWNGJdvx8',
    instagramUrl: 'https://www.instagram.com/teddysphotos',
  },

  // ─────────────────────────────────────────
  // 9. Harry Styles
  // ─────────────────────────────────────────
  {
    id: 'harrystyles',
    name: 'Harry Styles',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/HarryStylesWembley170623_%2865_of_93%29_%2852982678051%29_%28cropped_2%29.jpg/400px-HarryStylesWembley170623_%2865_of_93%29_%2852982678051%29_%28cropped_2%29.jpg',
    description: 'One Direction alumnus turned solo superstar, known for genre-defying music and magnetic stage presence.',
    genres: ['pop rock', 'soft rock', 'glam rock'],
    spotifyUrl: 'https://open.spotify.com/artist/3Nrfpe0tUJi4K4DXYWgMUX',
    featuredAlbum: {
      id: 'harry-hh',
      name: "Harry's House",
      imageUrl: '/albums/harry-hh.jpg',
      tracks: [
        { number: 1, name: 'Music for a Sushi Restaurant' },
        { number: 2, name: 'Late Night Talking' },
        { number: 3, name: 'Grapejuice' },
        { number: 4, name: 'As It Was' },
        { number: 5, name: 'Daylight' },
        { number: 6, name: 'Little Freak' },
        { number: 7, name: 'Matilda' },
        { number: 8, name: 'Cinema' },
        { number: 9, name: 'Daydreaming' },
        { number: 10, name: 'Keep Driving' },
        { number: 11, name: 'Satellite' },
        { number: 12, name: 'Love of My Life' },
      ],
    },
    featuredTrack: { name: 'As It Was', youtubeUrl: 'https://www.youtube.com/watch?v=H5v3kku4y6Q' },
    albumYoutubeUrl: 'https://www.youtube.com/watch?v=H5v3kku4y6Q',
    instagramUrl: 'https://www.instagram.com/harrystyles',
  },

  // ─────────────────────────────────────────
  // 10. Olivia Rodrigo
  // ─────────────────────────────────────────
  {
    id: 'oliviarodrigo',
    name: 'Olivia Rodrigo',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Glasto2025-546_%28cropped%29_%282%29.jpg/400px-Glasto2025-546_%28cropped%29_%282%29.jpg',
    description: 'Pop-rock superstar who captured a generation with raw emotional songwriting and her explosive debut SOUR.',
    genres: ['pop', 'pop rock', 'bedroom pop'],
    spotifyUrl: 'https://open.spotify.com/artist/1McMsnEElThX1knmY4oliG',
    featuredAlbum: {
      id: 'olivia-sour',
      name: 'SOUR',
      imageUrl: '/albums/olivia-sour.jpg',
      tracks: [
        { number: 1, name: 'brutal' },
        { number: 2, name: 'traitor' },
        { number: 3, name: 'drivers license' },
        { number: 4, name: 'deja vu' },
        { number: 5, name: 'good 4 u' },
        { number: 6, name: 'enough for you' },
        { number: 7, name: 'happier' },
        { number: 8, name: 'favorite crime' },
        { number: 9, name: '1 step forward, 3 steps back' },
        { number: 10, name: 'hope ur ok' },
      ],
    },
    featuredTrack: { name: 'drivers license', youtubeUrl: 'https://www.youtube.com/watch?v=ZmDBbnmKpqQ' },
    albumYoutubeUrl: 'https://www.youtube.com/watch?v=ZmDBbnmKpqQ',
    instagramUrl: 'https://www.instagram.com/oliviarodrigo',
  },

  // ─────────────────────────────────────────
  // 11. Post Malone
  // ─────────────────────────────────────────
  {
    id: 'postmalone',
    name: 'Post Malone',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Post_Malone_July_2021_%28cropped%29.jpg/400px-Post_Malone_July_2021_%28cropped%29.jpg',
    description: 'Genre-blending artist merging hip-hop, rock, and pop with melodic hooks and introspective, heartfelt lyrics.',
    genres: ['hip-hop', 'pop rap', 'trap'],
    spotifyUrl: 'https://open.spotify.com/artist/246dkjvS1zLTtiykXe5h60',
    featuredAlbum: {
      id: 'post-hb',
      name: "Hollywood's Bleeding",
      imageUrl: '/albums/post-hb.jpg',
      tracks: [
        { number: 1, name: "Hollywood's Bleeding" },
        { number: 2, name: 'Saint-Tropez' },
        { number: 3, name: 'On the Road' },
        { number: 4, name: 'Internet' },
        { number: 5, name: 'Allergic' },
        { number: 6, name: 'Too Young' },
        { number: 7, name: 'Circles' },
        { number: 8, name: 'Goodbyes' },
        { number: 9, name: 'Enemies' },
        { number: 10, name: 'A Thousand Bad Times' },
        { number: 11, name: 'Take What You Want' },
        { number: 12, name: 'Sunflower' },
      ],
    },
    featuredTrack: { name: 'Circles', youtubeUrl: 'https://www.youtube.com/watch?v=wXhTHyIgQ_U' },
    albumYoutubeUrl: 'https://www.youtube.com/watch?v=wXhTHyIgQ_U',
    instagramUrl: 'https://www.instagram.com/postmalone',
  },

  // ─────────────────────────────────────────
  // 12. Imagine Dragons
  // ─────────────────────────────────────────
  {
    id: 'imaginedragons',
    name: 'Imagine Dragons',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Imagine_Dragons_-_Uncasville_CT_-_November_2017_-_2.jpg/400px-Imagine_Dragons_-_Uncasville_CT_-_November_2017_-_2.jpg',
    description: 'Las Vegas alt-rock band known for stadium-filling anthems and a genre-crossing experimental sound.',
    genres: ['pop rock', 'alternative rock', 'indie rock'],
    spotifyUrl: 'https://open.spotify.com/artist/53XhwfbYqKCa1cC15pYq2q',
    featuredAlbum: {
      id: 'id-nightvisions',
      name: 'Night Visions',
      imageUrl: '/albums/id-nightvisions.jpg',
      tracks: [
        { number: 1, name: 'Radioactive' },
        { number: 2, name: 'Tiptoe' },
        { number: 3, name: "It's Time" },
        { number: 4, name: 'Demons' },
        { number: 5, name: 'On Top of the World' },
        { number: 6, name: 'Amsterdam' },
        { number: 7, name: 'Hear Me' },
        { number: 8, name: 'Every Night' },
        { number: 9, name: 'Bleeding Out' },
        { number: 10, name: 'Underdog' },
        { number: 11, name: 'Nothing Left to Say' },
      ],
    },
    featuredTrack: { name: 'Believer', youtubeUrl: 'https://www.youtube.com/watch?v=7wtfhZwyrcc' },
    albumYoutubeUrl: 'https://www.youtube.com/watch?v=7wtfhZwyrcc',
    instagramUrl: 'https://www.instagram.com/imaginedragons',
  },

  // ─────────────────────────────────────────
  // 13. Linkin Park
  // ─────────────────────────────────────────
  {
    id: 'linkinpark',
    name: 'Linkin Park',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Linkin_Park_-_From_Zero_Lead_Press_Photo_-_James_Minchin_III.jpg/400px-Linkin_Park_-_From_Zero_Lead_Press_Photo_-_James_Minchin_III.jpg',
    description: 'Nu-metal pioneers who defined a generation by fusing rap, rock, and electronic elements into a powerful sound.',
    genres: ['nu-metal', 'alternative metal', 'rap rock'],
    spotifyUrl: 'https://open.spotify.com/artist/36QJpDe2go2KgaRleHCDTp',
    featuredAlbum: {
      id: 'lp-ht',
      name: 'Hybrid Theory',
      imageUrl: '/albums/lp-ht.jpg',
      tracks: [
        { number: 1, name: 'Papercut' },
        { number: 2, name: 'One Step Closer' },
        { number: 3, name: 'With You' },
        { number: 4, name: 'Points of Authority' },
        { number: 5, name: 'Crawling' },
        { number: 6, name: 'Runaway' },
        { number: 7, name: 'By Myself' },
        { number: 8, name: 'In the End' },
        { number: 9, name: 'A Place for My Head' },
        { number: 10, name: 'Forgotten' },
        { number: 11, name: 'Pushing Me Away' },
      ],
    },
    featuredTrack: { name: 'In the End', youtubeUrl: 'https://www.youtube.com/watch?v=eVTXPUF4Oz4' },
    albumYoutubeUrl: 'https://www.youtube.com/watch?v=eVTXPUF4Oz4',
    instagramUrl: 'https://www.instagram.com/linkinpark',
  },

  // ─────────────────────────────────────────
  // 14. Foo Fighters
  // ─────────────────────────────────────────
  {
    id: 'foofighters',
    name: 'Foo Fighters',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Foo-Fighters-Fall-2025.webp/400px-Foo-Fighters-Fall-2025.webp.png',
    description: "Dave Grohl's legendary rock band delivering high-energy anthems and raw, passionate performances since 1994.",
    genres: ['alternative rock', 'hard rock', 'post-grunge'],
    spotifyUrl: 'https://open.spotify.com/artist/7jy3rLJdDQY21OgRLCZ9sD',
    featuredAlbum: {
      id: 'foo-tcs',
      name: 'The Colour and the Shape',
      imageUrl: '/albums/foo-tcs.jpg',
      tracks: [
        { number: 1, name: 'Doll' },
        { number: 2, name: 'Monkey Wrench' },
        { number: 3, name: 'Hey, Johnny Park' },
        { number: 4, name: 'My Poor Brain' },
        { number: 5, name: 'Wind Up' },
        { number: 6, name: 'Up in Arms' },
        { number: 7, name: 'My Hero' },
        { number: 8, name: 'February Stars' },
        { number: 9, name: 'Everlong' },
        { number: 10, name: 'Walking After You' },
        { number: 11, name: 'New Way Home' },
      ],
    },
    featuredTrack: { name: 'Best of You', youtubeUrl: 'https://www.youtube.com/watch?v=LnHSF2dJc5g' },
    albumYoutubeUrl: 'https://www.youtube.com/watch?v=LnHSF2dJc5g',
    instagramUrl: 'https://www.instagram.com/foofighters',
  },

  // ─────────────────────────────────────────
  // 15. Red Hot Chili Peppers
  // ─────────────────────────────────────────
  {
    id: 'rhcp',
    name: 'Red Hot Chili Peppers',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/RHCP_Live_in_London_26_June_2022.jpg/400px-RHCP_Live_in_London_26_June_2022.jpg',
    description: 'LA funk-rock veterans known for explosive live energy, soulful grooves, and decades of genre-defying music.',
    genres: ['alternative rock', 'funk rock', 'rap rock'],
    spotifyUrl: 'https://open.spotify.com/artist/0L8ExT028jH3ddEcZwqJJ5',
    featuredAlbum: {
      id: 'rhcp-californication',
      name: 'Californication',
      imageUrl: '/albums/rhcp-californication.jpg',
      tracks: [
        { number: 1, name: 'Around the World' },
        { number: 2, name: 'Parallel Universe' },
        { number: 3, name: 'Scar Tissue' },
        { number: 4, name: 'Otherside' },
        { number: 5, name: 'Get on Top' },
        { number: 6, name: 'Californication' },
        { number: 7, name: 'Easily' },
        { number: 8, name: 'Porcelain' },
        { number: 9, name: 'This Velvet Glove' },
        { number: 10, name: "Road Trippin'" },
      ],
    },
    featuredTrack: { name: 'Californication', youtubeUrl: 'https://www.youtube.com/watch?v=YlUKcNNmywk' },
    albumYoutubeUrl: 'https://www.youtube.com/watch?v=YlUKcNNmywk',
    instagramUrl: 'https://www.instagram.com/chilipeppers',
  },

  // ─────────────────────────────────────────
  // 16. Panic! at the Disco
  // ─────────────────────────────────────────
  {
    id: 'panicatthedisco',
    name: 'Panic! at the Disco',
    imageUrl: 'https://picsum.photos/seed/116/400/400',
    description: 'Pop-punk pioneers celebrated for theatrical flair, baroque pop arrangements, and irresistibly anthemic hooks.',
    genres: ['pop rock', 'emo', 'baroque pop'],
    spotifyUrl: 'https://open.spotify.com/artist/4VMYDCV2IEDYJArk749S6m',
    featuredAlbum: {
      id: 'patd-fever',
      name: "A Fever You Can't Sweat Out",
      imageUrl: '/albums/patd-fever.jpg',
      tracks: [
        { number: 1, name: 'Introduction' },
        { number: 2, name: 'The Only Difference...' },
        { number: 3, name: 'London Beckoned Songs...' },
        { number: 4, name: 'Nails for Breakfast, Tacks for Snacks' },
        { number: 5, name: 'Camisado' },
        { number: 6, name: 'Time to Dance' },
        { number: 7, name: 'Lying Is the Most Fun...' },
        { number: 8, name: 'Intermission' },
        { number: 9, name: "But It's Better If You Do" },
        { number: 10, name: 'I Write Sins Not Tragedies' },
        { number: 11, name: "There's a Good Reason..." },
        { number: 12, name: "Build God, Then We'll Talk" },
      ],
    },
    featuredTrack: { name: 'High Hopes', youtubeUrl: 'https://www.youtube.com/watch?v=IPXIgEAGe4U' },
    albumYoutubeUrl: 'https://www.youtube.com/watch?v=IPXIgEAGe4U',
    instagramUrl: 'https://www.instagram.com/panicatthedisco',
  },

  // ─────────────────────────────────────────
  // 17. Bruno Mars
  // ─────────────────────────────────────────
  {
    id: 'brunomars',
    name: 'Bruno Mars',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/BrunoMars24KMagicWorldTourLive_%28cropped%29.jpg/400px-BrunoMars24KMagicWorldTourLive_%28cropped%29.jpg',
    description: 'Versatile pop and funk artist known for retro-inspired hits, extraordinary showmanship, and irresistible grooves.',
    genres: ['pop', 'r&b', 'funk'],
    spotifyUrl: 'https://open.spotify.com/artist/0du5cEVh5yTK9QJze8zA0C',
    featuredAlbum: {
      id: 'bruno-24k',
      name: '24K Magic',
      imageUrl: '/albums/bruno-24k.jpg',
      tracks: [
        { number: 1, name: '24K Magic' },
        { number: 2, name: 'Chunky' },
        { number: 3, name: 'Perm' },
        { number: 4, name: 'Too Good to Say Goodbye' },
        { number: 5, name: 'Versace on the Floor' },
        { number: 6, name: 'Straight Up & Down' },
        { number: 7, name: 'Calling All My Lovelies' },
        { number: 8, name: 'Finesse' },
        { number: 9, name: "That's What I Like" },
      ],
    },
    featuredTrack: { name: 'Uptown Funk', youtubeUrl: 'https://www.youtube.com/watch?v=OPf0YbXqDm0' },
    albumYoutubeUrl: 'https://www.youtube.com/watch?v=OPf0YbXqDm0',
    instagramUrl: 'https://www.instagram.com/brunomars',
  },

  // ─────────────────────────────────────────
  // 18. Adele
  // ─────────────────────────────────────────
  {
    id: 'adele',
    name: 'Adele',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Adele_2016.jpg/400px-Adele_2016.jpg',
    description: 'British soul powerhouse whose deeply emotional ballads and stunning vocals have broken global records.',
    genres: ['pop', 'soul', 'r&b'],
    spotifyUrl: 'https://open.spotify.com/artist/4dpARuHxo51G3z768sgnrY',
    featuredAlbum: {
      id: 'adele-21',
      name: '21',
      imageUrl: '/albums/adele-21.jpg',
      tracks: [
        { number: 1, name: 'Rolling in the Deep' },
        { number: 2, name: 'Rumour Has It' },
        { number: 3, name: 'Turning Tables' },
        { number: 4, name: "Don't You Remember" },
        { number: 5, name: 'Set Fire to the Rain' },
        { number: 6, name: "He Won't Go" },
        { number: 7, name: 'Take It All' },
        { number: 8, name: "I'll Be Waiting" },
        { number: 9, name: 'One and Only' },
        { number: 10, name: 'Someone Like You' },
      ],
    },
    featuredTrack: { name: 'Rolling in the Deep', youtubeUrl: 'https://www.youtube.com/watch?v=rYEDA3JcQqw' },
    albumYoutubeUrl: 'https://www.youtube.com/watch?v=rYEDA3JcQqw',
    instagramUrl: 'https://www.instagram.com/adele',
  },

  // ─────────────────────────────────────────
  // 19. Sam Smith
  // ─────────────────────────────────────────
  {
    id: 'samsmith',
    name: 'Sam Smith',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/SamSmith-byPhilipRomano.jpg/400px-SamSmith-byPhilipRomano.jpg',
    description: 'Soulful British singer known for vulnerable confessional songwriting and a voice that cuts straight to the heart.',
    genres: ['pop', 'soul', 'r&b'],
    spotifyUrl: 'https://open.spotify.com/artist/2wY79sveU1sp5g7SokKOiI',
    featuredAlbum: {
      id: 'sam-lonely',
      name: 'In the Lonely Hour',
      imageUrl: '/albums/sam-lonely.jpg',
      tracks: [
        { number: 1, name: 'Money on My Mind' },
        { number: 2, name: 'Good Thing' },
        { number: 3, name: 'Stay with Me' },
        { number: 4, name: 'Leave Your Lover' },
        { number: 5, name: "I'm Not the Only One" },
        { number: 6, name: 'Life Support' },
        { number: 7, name: 'Like I Can' },
        { number: 8, name: 'Restart' },
        { number: 9, name: 'Lay Me Down' },
        { number: 10, name: 'Not in That Way' },
      ],
    },
    featuredTrack: { name: 'Stay With Me', youtubeUrl: 'https://www.youtube.com/watch?v=pB-5XG-DbAA' },
    albumYoutubeUrl: 'https://www.youtube.com/watch?v=pB-5XG-DbAA',
    instagramUrl: 'https://www.instagram.com/samsmith',
  },

  // ─────────────────────────────────────────
  // 20. Eminem
  // ─────────────────────────────────────────
  {
    id: 'eminem',
    name: 'Eminem',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Eminem_2021_Color_Corrected.jpg/400px-Eminem_2021_Color_Corrected.jpg',
    description: 'Detroit rapper widely regarded as one of the greatest lyricists in hip-hop history, known for razor-sharp wordplay.',
    genres: ['hip-hop', 'rap', 'hardcore hip-hop'],
    spotifyUrl: 'https://open.spotify.com/artist/7dGJo4pcD2V6oG8kP0tJRR',
    featuredAlbum: {
      id: 'eminem-mmlp',
      name: 'The Marshall Mathers LP',
      imageUrl: '/albums/eminem-mmlp.jpg',
      tracks: [
        { number: 1, name: 'Kill You' },
        { number: 2, name: 'Stan' },
        { number: 3, name: 'Who Knew' },
        { number: 4, name: 'The Way I Am' },
        { number: 5, name: 'The Real Slim Shady' },
        { number: 6, name: 'Remember Me?' },
        { number: 7, name: "I'm Back" },
        { number: 8, name: 'Marshall Mathers' },
        { number: 9, name: 'Drug Ballad' },
        { number: 10, name: 'Criminal' },
      ],
    },
    featuredTrack: { name: 'Lose Yourself', youtubeUrl: 'https://www.youtube.com/watch?v=_Yhyp-_hX2s' },
    albumYoutubeUrl: 'https://www.youtube.com/watch?v=_Yhyp-_hX2s',
    instagramUrl: 'https://www.instagram.com/eminem',
  },

  // ─────────────────────────────────────────
  // 21. Drake
  // ─────────────────────────────────────────
  {
    id: 'drake',
    name: 'Drake',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Drake_at_The_Carter_Effect_2017_%2836818935200%29_%28cropped%29.jpg/400px-Drake_at_The_Carter_Effect_2017_%2836818935200%29_%28cropped%29.jpg',
    description: 'Toronto rapper turned global superstar who reshaped hip-hop with emotional vulnerability and melodic sensibility.',
    genres: ['hip-hop', 'rap', 'trap'],
    spotifyUrl: 'https://open.spotify.com/artist/3TVXtAsR1Inumwj472S9r4',
    featuredAlbum: {
      id: 'drake-scorpion',
      name: 'Scorpion',
      imageUrl: '/albums/drake-scorpion.jpg',
      tracks: [
        { number: 1, name: 'Survival' },
        { number: 2, name: 'Nonstop' },
        { number: 3, name: 'Elevate' },
        { number: 4, name: "God's Plan" },
        { number: 5, name: "I'm Upset" },
        { number: 6, name: 'Nice for What' },
        { number: 7, name: 'In My Feelings' },
        { number: 8, name: "Don't Matter to Me" },
        { number: 9, name: 'After Dark' },
        { number: 10, name: 'Summer Games' },
      ],
    },
    featuredTrack: { name: "God's Plan", youtubeUrl: 'https://www.youtube.com/watch?v=xpVfcZ0ZcFM' },
    albumYoutubeUrl: 'https://www.youtube.com/watch?v=xpVfcZ0ZcFM',
    instagramUrl: 'https://www.instagram.com/champagnepapi',
  },

  // ─────────────────────────────────────────
  // 22. Kendrick Lamar
  // ─────────────────────────────────────────
  {
    id: 'kendricklamar',
    name: 'Kendrick Lamar',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/KendrickSZASPurs230725-144_%28cropped%29_desaturated.jpg/400px-KendrickSZASPurs230725-144_%28cropped%29_desaturated.jpg',
    description: 'Pulitzer Prize-winning rapper and one of the most critically acclaimed artists in the history of modern hip-hop.',
    genres: ['hip-hop', 'conscious hip-hop', 'west coast rap'],
    spotifyUrl: 'https://open.spotify.com/artist/2YZyLoL8N0Wb9xBt1NhZWg',
    featuredAlbum: {
      id: 'kendrick-tpab',
      name: 'To Pimp a Butterfly',
      imageUrl: '/albums/kendrick-tpab.jpg',
      tracks: [
        { number: 1, name: "Wesley's Theory" },
        { number: 2, name: 'For Free? (Interlude)' },
        { number: 3, name: 'King Kunta' },
        { number: 4, name: 'Institutionalized' },
        { number: 5, name: 'These Walls' },
        { number: 6, name: 'u' },
        { number: 7, name: 'Alright' },
        { number: 8, name: 'Momma' },
        { number: 9, name: 'Hood Politics' },
        { number: 10, name: 'How Much a Dollar Cost' },
        { number: 11, name: 'The Blacker the Berry' },
        { number: 12, name: 'i' },
      ],
    },
    featuredTrack: { name: 'HUMBLE.', youtubeUrl: 'https://www.youtube.com/watch?v=tvTRZJ-4EyI' },
    albumYoutubeUrl: 'https://www.youtube.com/watch?v=tvTRZJ-4EyI',
    instagramUrl: 'https://www.instagram.com/kendricklamar',
  },

  // ─────────────────────────────────────────
  // 23. Bad Bunny
  // ─────────────────────────────────────────
  {
    id: 'badbunny',
    name: 'Bad Bunny',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Bad_Bunny_2019_by_Glenn_Francis_%28cropped%29.jpg/400px-Bad_Bunny_2019_by_Glenn_Francis_%28cropped%29.jpg',
    description: 'Puerto Rican reggaeton superstar who brought Latin trap to global audiences with bold and unapologetic artistry.',
    genres: ['reggaeton', 'latin trap', 'urbano latino'],
    spotifyUrl: 'https://open.spotify.com/artist/4q3ewBCX7sLwd24euuV69X',
    featuredAlbum: {
      id: 'bb-uvst',
      name: 'Un Verano Sin Ti',
      imageUrl: '/albums/bb-uvst.jpg',
      tracks: [
        { number: 1, name: 'El Apagón' },
        { number: 2, name: 'Después de la Playa' },
        { number: 3, name: 'Tití Me Preguntó' },
        { number: 4, name: 'Efecto' },
        { number: 5, name: 'Party' },
        { number: 6, name: 'Ojitos Lindos' },
        { number: 7, name: 'Un Coco' },
        { number: 8, name: 'Me Porto Bonito' },
        { number: 9, name: 'Neverita' },
        { number: 10, name: 'Moscow Mule' },
      ],
    },
    featuredTrack: { name: 'Tití Me Preguntó', youtubeUrl: 'https://www.youtube.com/watch?v=DSoFbGiudkY' },
    albumYoutubeUrl: 'https://www.youtube.com/watch?v=DSoFbGiudkY',
    instagramUrl: 'https://www.instagram.com/badbunnypr',
  },

  // ─────────────────────────────────────────
  // 24. Rihanna
  // ─────────────────────────────────────────
  {
    id: 'rihanna',
    name: 'Rihanna',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Rihanna_Fenty_2018.png/400px-Rihanna_Fenty_2018.png',
    description: 'Barbadian pop icon known for dancehall roots, boundary-pushing artistry, and iconic influence on fashion and music.',
    genres: ['pop', 'r&b', 'dancehall'],
    spotifyUrl: 'https://open.spotify.com/artist/5pKCCKE2ajJHZ9KAiaK11H',
    featuredAlbum: {
      id: 'rih-anti',
      name: 'ANTI',
      imageUrl: '/albums/rih-anti.jpg',
      tracks: [
        { number: 1, name: 'Consideration' },
        { number: 2, name: 'James Joint' },
        { number: 3, name: 'Kiss It Better' },
        { number: 4, name: 'Work' },
        { number: 5, name: 'Desperado' },
        { number: 6, name: 'Needed Me' },
        { number: 7, name: "Same Ol' Mistakes" },
        { number: 8, name: 'Never Ending' },
        { number: 9, name: 'Love on the Brain' },
        { number: 10, name: 'Higher' },
        { number: 11, name: 'Close to You' },
      ],
    },
    featuredTrack: { name: 'Diamonds', youtubeUrl: 'https://www.youtube.com/watch?v=lWA2pjMjpBs' },
    albumYoutubeUrl: 'https://www.youtube.com/watch?v=lWA2pjMjpBs',
    instagramUrl: 'https://www.instagram.com/badgalriri',
  },

  // ─────────────────────────────────────────
  // 25. Sabrina Carpenter
  // ─────────────────────────────────────────
  {
    id: 'sabrinacarpenter',
    name: 'Sabrina Carpenter',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Primavera2025_%28139_of_182%29_%2854574520207%29_%28cropped%29.jpg/400px-Primavera2025_%28139_of_182%29_%2854574520207%29_%28cropped%29.jpg',
    description: 'Rising pop star known for catchy hooks, playful confidence, and a rapidly growing legion of devoted fans.',
    genres: ['pop', 'bubblegum pop', 'dance pop'],
    spotifyUrl: 'https://open.spotify.com/artist/74KM79TiuVKeVCqs8QtB0B',
    featuredAlbum: {
      id: 'sabrina-sns',
      name: "Short n' Sweet",
      imageUrl: '/albums/sabrina-sns.jpg',
      tracks: [
        { number: 1, name: 'Taste' },
        { number: 2, name: 'Espresso' },
        { number: 3, name: 'Please Please Please' },
        { number: 4, name: 'Coincidence' },
        { number: 5, name: 'Slim Pickins' },
        { number: 6, name: 'Sharpest Tool' },
        { number: 7, name: 'Dumb & Poetic' },
        { number: 8, name: 'Bed Chem' },
        { number: 9, name: 'Good Graces' },
        { number: 10, name: 'Lie to Girls' },
        { number: 11, name: "Don't Smile" },
        { number: 12, name: 'Beach Boys' },
      ],
    },
    featuredTrack: { name: 'Espresso', youtubeUrl: 'https://www.youtube.com/watch?v=o2H9kvAbBMI' },
    albumYoutubeUrl: 'https://www.youtube.com/watch?v=o2H9kvAbBMI',
    instagramUrl: 'https://www.instagram.com/sabrinacarpenter',
  },

  // ─────────────────────────────────────────
  // 26. Shawn Mendes
  // ─────────────────────────────────────────
  {
    id: 'shawnmendes',
    name: 'Shawn Mendes',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/191125_Shawn_Mendes_at_the_2019_American_Music_Awards.png/400px-191125_Shawn_Mendes_at_the_2019_American_Music_Awards.png',
    description: 'Canadian pop artist known for heartfelt acoustic ballads and self-taught guitar skills first discovered on Vine.',
    genres: ['pop', 'pop rock', 'soft rock'],
    spotifyUrl: 'https://open.spotify.com/artist/7n2wHs1TKAczGzO7Dd2rGr',
    featuredAlbum: {
      id: 'shawn-wonder',
      name: 'Wonder',
      imageUrl: '/albums/shawn-wonder.jpg',
      tracks: [
        { number: 1, name: 'Dream' },
        { number: 2, name: 'Monster' },
        { number: 3, name: 'Call My Friends' },
        { number: 4, name: 'Look Up at the Stars' },
        { number: 5, name: 'Wonder' },
        { number: 6, name: 'Piece of You' },
        { number: 7, name: "Can't Imagine" },
        { number: 8, name: 'Teach Me How to Love' },
        { number: 9, name: 'Always Been You' },
        { number: 10, name: '24 Hours' },
      ],
    },
    featuredTrack: { name: 'Stitches', youtubeUrl: 'https://www.youtube.com/watch?v=VbfpW0pbvaU' },
    albumYoutubeUrl: 'https://www.youtube.com/watch?v=VbfpW0pbvaU',
    instagramUrl: 'https://www.instagram.com/shawnmendes',
  },

  // ─────────────────────────────────────────
  // 27. J. Cole
  // ─────────────────────────────────────────
  {
    id: 'jcole',
    name: 'J. Cole',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/HOTSPOTATL_-_21_Savage_%26_J.Cole_Light_Birthday_Bash_ATL_2023_On_FIRE_%28xu6HKf40MX0_-_2m38s%29_%28cropped%29.jpg/400px-HOTSPOTATL_-_21_Savage_%26_J.Cole_Light_Birthday_Bash_ATL_2023_On_FIRE_%28xu6HKf40MX0_-_2m38s%29_%28cropped%29.jpg',
    description: 'Thoughtful rapper-producer from North Carolina known for introspective lyricism and self-produced concept albums.',
    genres: ['hip-hop', 'conscious hip-hop', 'east coast rap'],
    spotifyUrl: 'https://open.spotify.com/artist/6l3HvQ5sa6mXTsMTB19rO5',
    featuredAlbum: {
      id: 'jcole-fhd',
      name: '2014 Forest Hills Drive',
      imageUrl: '/albums/jcole-fhd.jpg',
      tracks: [
        { number: 1, name: 'Intro' },
        { number: 2, name: 'January 28th' },
        { number: 3, name: 'Wet Dreamz' },
        { number: 4, name: "03' Adolescence" },
        { number: 5, name: 'A Tale of 2 Citiez' },
        { number: 6, name: 'Fire Squad' },
        { number: 7, name: 'St. Tropez' },
        { number: 8, name: 'Apparently' },
        { number: 9, name: 'Love Yourz' },
        { number: 10, name: 'No Role Modelz' },
        { number: 11, name: 'G.O.M.D.' },
      ],
    },
    featuredTrack: { name: 'Middle Child', youtubeUrl: 'https://www.youtube.com/watch?v=GC9vUNqMYAk' },
    albumYoutubeUrl: 'https://www.youtube.com/watch?v=GC9vUNqMYAk',
    instagramUrl: 'https://www.instagram.com/realcoleworld',
  },

  // ─────────────────────────────────────────
  // 28. P!nk
  // ─────────────────────────────────────────
  {
    id: 'pink',
    name: 'P!nk',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/PinkSpurs160624_%2833_of_156%29_%28cropped%29.jpg/400px-PinkSpurs160624_%2833_of_156%29_%28cropped%29.jpg',
    description: 'Rock-infused pop powerhouse celebrated for powerful vocals, acrobatic live performances, and fearless attitude.',
    genres: ['pop rock', 'pop', 'dance pop'],
    spotifyUrl: 'https://open.spotify.com/artist/1McMsnEElThX1knmY4oliG',
    featuredAlbum: {
      id: 'pink-missundaztood',
      name: 'Missundaztood',
      imageUrl: '/albums/pink-missundaztood.jpg',
      tracks: [
        { number: 1, name: "Don't Let Me Get Me" },
        { number: 2, name: 'Haze' },
        { number: 3, name: 'Just Like a Pill' },
        { number: 4, name: 'Get the Party Started' },
        { number: 5, name: 'Respect' },
        { number: 6, name: '18 Wheeler' },
        { number: 7, name: 'Family Portrait' },
        { number: 8, name: 'Misery' },
        { number: 9, name: 'Dear Diary' },
        { number: 10, name: 'Gone to California' },
      ],
    },
    featuredTrack: { name: 'Just Give Me a Reason', youtubeUrl: 'https://www.youtube.com/watch?v=OpQFFLBMEPI' },
    albumYoutubeUrl: 'https://www.youtube.com/watch?v=OpQFFLBMEPI',
    instagramUrl: 'https://www.instagram.com/pink',
  },

  // ─────────────────────────────────────────
  // 29. Meghan Trainor
  // ─────────────────────────────────────────
  {
    id: 'meghantrainor',
    name: 'Meghan Trainor',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Meghan_Trainor_Alt._2020_%28cropped%29.png/400px-Meghan_Trainor_Alt._2020_%28cropped%29.png',
    description: 'Pop songwriter who rose to fame with nostalgic doo-wop inspired anthems celebrating self-confidence and body positivity.',
    genres: ['pop', 'doo-wop pop', 'dance pop'],
    spotifyUrl: 'https://open.spotify.com/artist/64KEffDW9EtZ1y2vBYgq8T',
    featuredAlbum: {
      id: 'meghan-title',
      name: 'Title',
      imageUrl: '/albums/meghan-title.jpg',
      tracks: [
        { number: 1, name: 'All About That Bass' },
        { number: 2, name: 'Lips Are Movin' },
        { number: 3, name: '3AM' },
        { number: 4, name: "Like I'm Gonna Lose You" },
        { number: 5, name: 'Close Your Eyes' },
        { number: 6, name: 'Bang Dem Sticks' },
        { number: 7, name: 'Title' },
        { number: 8, name: 'Last One Standing' },
        { number: 9, name: 'Dear Future Husband' },
        { number: 10, name: 'Walkashame' },
      ],
    },
    featuredTrack: { name: 'All About That Bass', youtubeUrl: 'https://www.youtube.com/watch?v=7PCkvCPvDXk' },
    albumYoutubeUrl: 'https://www.youtube.com/watch?v=7PCkvCPvDXk',
    instagramUrl: 'https://www.instagram.com/meghan_trainor',
  },

  // ─────────────────────────────────────────
  // 30. Bob Dylan
  // ─────────────────────────────────────────
  {
    id: 'bobdylan',
    name: 'Bob Dylan',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/DylanYoungKilkenny140719v2_%2850_of_52%29_%2852246124397%29_%28cropped%29.jpg/400px-DylanYoungKilkenny140719v2_%2850_of_52%29_%2852246124397%29_%28cropped%29.jpg',
    description: 'Nobel Prize-winning folk legend whose poetic lyricism and social commentary transformed popular music across generations.',
    genres: ['folk rock', 'country rock', 'blues rock'],
    spotifyUrl: 'https://open.spotify.com/artist/74ASZWbe4lXaubB36ztrGX',
    featuredAlbum: {
      id: 'dylan-h61',
      name: 'Highway 61 Revisited',
      imageUrl: '/albums/dylan-h61.jpg',
      tracks: [
        { number: 1, name: 'Like a Rolling Stone' },
        { number: 2, name: 'Tombstone Blues' },
        { number: 3, name: 'It Takes a Lot to Laugh, It Takes a Train to Cry' },
        { number: 4, name: 'From a Buick 6' },
        { number: 5, name: 'Ballad of a Thin Man' },
        { number: 6, name: 'Queen Jane Approximately' },
        { number: 7, name: 'Highway 61 Revisited' },
        { number: 8, name: "Just Like Tom Thumb's Blues" },
        { number: 9, name: 'Desolation Row' },
      ],
    },
    featuredTrack: { name: 'Like a Rolling Stone', youtubeUrl: 'https://www.youtube.com/watch?v=IwOfCgkyEj0' },
    albumYoutubeUrl: 'https://www.youtube.com/watch?v=IwOfCgkyEj0',
    instagramUrl: 'https://www.instagram.com/bobdylan',
  },
]

