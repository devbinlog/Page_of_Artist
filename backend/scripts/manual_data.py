"""
수동 입력 데이터 — Spotify API로 수집 불가한 링크 + 소개글.
sync_spotify.py 실행 시 이 파일의 데이터를 DB에 병합.

spotify_id를 키로, 수동 데이터를 값으로 저장.
"""

# 동기화할 Spotify 아티스트 ID 목록
SPOTIFY_IDS = [
    "7Ey4PD4MYsKc5I2dolUwbH",  # Green Day
    "5IaHrOWFB1NfWsXFCDAsLc",  # LANY
    "6X9k3hSiLkHlWx1qFVRX4O",  # Yungblud
    "06HL4z0CvFAxyc27GXpf02",  # Taylor Swift
    "1Xyo4u8uXC1ZmMpatF05PJ",  # The Weeknd
    "6qqNVTkY8uBg9cP3Jd7DAH",  # Billie Eilish
    "66CXWjxzNUsdJxJ2JdwvnR",  # Ariana Grande
    "6eUKZXaKkcviH0Ku9w2n3V",  # Ed Sheeran
    "3Nrfpe0tUJi4K4DXYWgMUX",  # Harry Styles
    "1McMsnEElThX1knmY4oliG",  # Olivia Rodrigo
    "246dkjvS1zLTtiykXe5h60",  # Post Malone
    "53XhwfbYqKCa1cC15pYq2q",  # Imagine Dragons
    "36QJpDe2go2KgaRleHCDTp",  # Linkin Park
    "7jy3rLJdDQY21OgRLCZ9sD",  # Foo Fighters
    "0L8ExT028jH3ddEcZwqJJ5",  # Red Hot Chili Peppers
    "4VMYDCV2IEDYJArk749S6m",  # Panic! at the Disco
    "0du5cEVh5yTK9QJze8zA0C",  # Bruno Mars
    "4dpARuHxo51G3z768sgnrY",  # Adele
    "2wY79sveU1sp5g7SokKOiI",  # Sam Smith
    "7dGJo4pcD2V6oG8kP0tJRR",  # Eminem
    "3TVXtAsR1Inumwj472S9r4",  # Drake
    "2YZyLoL8N0Wb9xBt1NhZWg",  # Kendrick Lamar
    "4q3ewBCX7sLwd24euuV69X",  # Bad Bunny
    "5pKCCKE2ajJHZ9KAiaK11H",  # Rihanna
    "74KM79TiuVKeVCqs8QtB0B",  # Sabrina Carpenter
    "7n2wHs1TKAczGzO7Dd2rGr",  # Shawn Mendes
    "6l3HvQ5sa6mXTsMTB19rO5",  # J. Cole
    "74ASZWbe4lXaubB36ztrGX",  # Bob Dylan
]

# 수동 입력 데이터 (spotify_id → 링크 + 소개글)
MANUAL_DATA: dict[str, dict] = {
    "7Ey4PD4MYsKc5I2dolUwbH": {
        "youtube_url": "https://www.youtube.com/watch?v=Soa3gO7tL-c",
        "album_youtube_url": "https://www.youtube.com/watch?v=Soa3gO7tL-c",
        "instagram_url": "https://www.instagram.com/greenday",
        "introduction": "펑크록의 전설. 사회 풍자와 반항 정신을 3분짜리 앤섬으로 압축한다.",
    },
    "5IaHrOWFB1NfWsXFCDAsLc": {
        "youtube_url": "https://www.youtube.com/watch?v=EAjMXFCd6dE",
        "album_youtube_url": "https://www.youtube.com/watch?v=EAjMXFCd6dE",
        "instagram_url": "https://www.instagram.com/lanymusic",
        "introduction": "LA 기반 드림팝 트리오. 신스팝과 인디팝의 경계를 지운다.",
    },
    "6X9k3hSiLkHlWx1qFVRX4O": {
        "youtube_url": "https://www.youtube.com/watch?v=DXskHBijBsc",
        "album_youtube_url": "https://www.youtube.com/watch?v=DXskHBijBsc",
        "instagram_url": "https://www.instagram.com/yungblud",
        "introduction": "세대의 목소리. 아웃사이더를 위한 팝펑크 앤섬을 만든다.",
    },
    "06HL4z0CvFAxyc27GXpf02": {
        "youtube_url": "https://www.youtube.com/watch?v=b1kbLwvqugk",
        "album_youtube_url": "https://www.youtube.com/watch?v=b1kbLwvqugk",
        "instagram_url": "https://www.instagram.com/taylorswift",
        "introduction": "팝의 재정의. 컨트리에서 신스팝까지 장르를 초월한 스토리텔러.",
    },
    "1Xyo4u8uXC1ZmMpatF05PJ": {
        "youtube_url": "https://www.youtube.com/watch?v=4NRXx6U8ABQ",
        "album_youtube_url": "https://www.youtube.com/watch?v=4NRXx6U8ABQ",
        "instagram_url": "https://www.instagram.com/theweeknd",
        "introduction": "심야의 R&B. 어둠과 화려함이 공존하는 신스웨이브 팝의 제왕.",
    },
    "6qqNVTkY8uBg9cP3Jd7DAH": {
        "youtube_url": "https://www.youtube.com/watch?v=DyDfgMOUjCI",
        "album_youtube_url": "https://www.youtube.com/watch?v=DyDfgMOUjCI",
        "instagram_url": "https://www.instagram.com/billieeilish",
        "introduction": "다크 팝의 아이콘. 속삭이듯 노래하지만 세상을 뒤흔든다.",
    },
    "66CXWjxzNUsdJxJ2JdwvnR": {
        "youtube_url": "https://www.youtube.com/watch?v=QYh6mYIJG2Y",
        "album_youtube_url": "https://www.youtube.com/watch?v=QYh6mYIJG2Y",
        "instagram_url": "https://www.instagram.com/arianagrande",
        "introduction": "4옥타브 보컬과 트랩 비트의 만남. 팝을 완전히 새로 썼다.",
    },
    "6eUKZXaKkcviH0Ku9w2n3V": {
        "youtube_url": "https://www.youtube.com/watch?v=JGwWNGJdvx8",
        "album_youtube_url": "https://www.youtube.com/watch?v=JGwWNGJdvx8",
        "instagram_url": "https://www.instagram.com/teddysphotos",
        "introduction": "어쿠스틱 기타 하나로 차트를 정복한 싱어송라이터.",
    },
    "3Nrfpe0tUJi4K4DXYWgMUX": {
        "youtube_url": "https://www.youtube.com/watch?v=H5v3kku4y6Q",
        "album_youtube_url": "https://www.youtube.com/watch?v=H5v3kku4y6Q",
        "instagram_url": "https://www.instagram.com/harrystyles",
        "introduction": "원디렉션을 넘어 글램록과 소프트록을 재해석한 팝 아티스트.",
    },
    "1McMsnEElThX1knmY4oliG": {
        "youtube_url": "https://www.youtube.com/watch?v=ZmDBbnmKpqQ",
        "album_youtube_url": "https://www.youtube.com/watch?v=ZmDBbnmKpqQ",
        "instagram_url": "https://www.instagram.com/oliviarodrigo",
        "introduction": "10대의 감정을 팝록 앤섬으로. 세대 공감의 아이콘.",
    },
    "246dkjvS1zLTtiykXe5h60": {
        "youtube_url": "https://www.youtube.com/watch?v=wXhTHyIgQ_U",
        "album_youtube_url": "https://www.youtube.com/watch?v=wXhTHyIgQ_U",
        "instagram_url": "https://www.instagram.com/postmalone",
        "introduction": "힙합과 팝록의 경계 파괴자. 멜로디와 래핑을 동시에 장악한다.",
    },
    "53XhwfbYqKCa1cC15pYq2q": {
        "youtube_url": "https://www.youtube.com/watch?v=7wtfhZwyrcc",
        "album_youtube_url": "https://www.youtube.com/watch?v=7wtfhZwyrcc",
        "instagram_url": "https://www.instagram.com/imaginedragons",
        "introduction": "라스베이거스에서 탄생한 인디록 밴드. 아레나 앤섬의 제조기.",
    },
    "36QJpDe2go2KgaRleHCDTp": {
        "youtube_url": "https://www.youtube.com/watch?v=eVTXPUF4Oz4",
        "album_youtube_url": "https://www.youtube.com/watch?v=eVTXPUF4Oz4",
        "instagram_url": "https://www.instagram.com/linkinpark",
        "introduction": "누메탈과 얼터너티브를 융합한 2000년대 록의 상징.",
    },
    "7jy3rLJdDQY21OgRLCZ9sD": {
        "youtube_url": "https://www.youtube.com/watch?v=LnHSF2dJc5g",
        "album_youtube_url": "https://www.youtube.com/watch?v=LnHSF2dJc5g",
        "instagram_url": "https://www.instagram.com/foofighters",
        "introduction": "그런지 이후 하드록의 계보를 잇는 밴드. 데이브 그롤의 유산.",
    },
    "0L8ExT028jH3ddEcZwqJJ5": {
        "youtube_url": "https://www.youtube.com/watch?v=YlUKcNNmywk",
        "album_youtube_url": "https://www.youtube.com/watch?v=YlUKcNNmywk",
        "instagram_url": "https://www.instagram.com/chilipeppers",
        "introduction": "펑크록과 헤비메탈을 섞은 LA 록의 전설. 베이스 라인이 철학이다.",
    },
    "4VMYDCV2IEDYJArk749S6m": {
        "youtube_url": "https://www.youtube.com/watch?v=IPXIgEAGe4U",
        "album_youtube_url": "https://www.youtube.com/watch?v=IPXIgEAGe4U",
        "instagram_url": "https://www.instagram.com/panicatthedisco",
        "introduction": "바로크 팝과 이모 팝을 결합한 독창적 팝록 밴드.",
    },
    "0du5cEVh5yTK9QJze8zA0C": {
        "youtube_url": "https://www.youtube.com/watch?v=OPf0YbXqDm0",
        "album_youtube_url": "https://www.youtube.com/watch?v=OPf0YbXqDm0",
        "instagram_url": "https://www.instagram.com/brunomars",
        "introduction": "팝, 펑크, R&B를 넘나드는 퍼포머. 무대 위에서 시대를 초월한다.",
    },
    "4dpARuHxo51G3z768sgnrY": {
        "youtube_url": "https://www.youtube.com/watch?v=rYEDA3JcQqw",
        "album_youtube_url": "https://www.youtube.com/watch?v=rYEDA3JcQqw",
        "instagram_url": "https://www.instagram.com/adele",
        "introduction": "소울 발라드의 여왕. 목소리 하나로 전 세계를 울린다.",
    },
    "2wY79sveU1sp5g7SokKOiI": {
        "youtube_url": "https://www.youtube.com/watch?v=pB-5XG-DbAA",
        "album_youtube_url": "https://www.youtube.com/watch?v=pB-5XG-DbAA",
        "instagram_url": "https://www.instagram.com/samsmith",
        "introduction": "영국 팝 소울의 차세대 주자. 감정의 깊이를 목소리로 번역한다.",
    },
    "7dGJo4pcD2V6oG8kP0tJRR": {
        "youtube_url": "https://www.youtube.com/watch?v=_Yhyp-_hX2s",
        "album_youtube_url": "https://www.youtube.com/watch?v=_Yhyp-_hX2s",
        "instagram_url": "https://www.instagram.com/eminem",
        "introduction": "가장 빠른 입과 가장 날카로운 펜. 힙합 역사를 다시 쓴 시인.",
    },
    "3TVXtAsR1Inumwj472S9r4": {
        "youtube_url": "https://www.youtube.com/watch?v=xpVfcZ0ZcFM",
        "album_youtube_url": "https://www.youtube.com/watch?v=xpVfcZ0ZcFM",
        "instagram_url": "https://www.instagram.com/champagnepapi",
        "introduction": "토론토에서 세계로. 감성 랩과 트랩을 동시에 지배하는 아티스트.",
    },
    "2YZyLoL8N0Wb9xBt1NhZWg": {
        "youtube_url": "https://www.youtube.com/watch?v=tvTRZJ-4EyI",
        "album_youtube_url": "https://www.youtube.com/watch?v=tvTRZJ-4EyI",
        "instagram_url": "https://www.instagram.com/kendricklamar",
        "introduction": "컨셔스 힙합의 정점. 사회 비판과 자기 성찰을 비트 위에 올린다.",
    },
    "4q3ewBCX7sLwd24euuV69X": {
        "youtube_url": "https://www.youtube.com/watch?v=DSoFbGiudkY",
        "album_youtube_url": "https://www.youtube.com/watch?v=DSoFbGiudkY",
        "instagram_url": "https://www.instagram.com/badbunnypr",
        "introduction": "레게톤을 세계 언어로 만든 아티스트. 장르의 경계를 허문다.",
    },
    "5pKCCKE2ajJHZ9KAiaK11H": {
        "youtube_url": "https://www.youtube.com/watch?v=lWA2pjMjpBs",
        "album_youtube_url": "https://www.youtube.com/watch?v=lWA2pjMjpBs",
        "instagram_url": "https://www.instagram.com/badgalriri",
        "introduction": "팝과 댄스홀을 정복한 바베이도스 출신 글로벌 슈퍼스타.",
    },
    "74KM79TiuVKeVCqs8QtB0B": {
        "youtube_url": "https://www.youtube.com/watch?v=o2H9kvAbBMI",
        "album_youtube_url": "https://www.youtube.com/watch?v=o2H9kvAbBMI",
        "instagram_url": "https://www.instagram.com/sabrinacarpenter",
        "introduction": "버블검 팝의 귀환. 위트 있는 가사와 중독성 있는 멜로디.",
    },
    "7n2wHs1TKAczGzO7Dd2rGr": {
        "youtube_url": "https://www.youtube.com/watch?v=VbfpW0pbvaU",
        "album_youtube_url": "https://www.youtube.com/watch?v=VbfpW0pbvaU",
        "instagram_url": "https://www.instagram.com/shawnmendes",
        "introduction": "캐나다 출신 팝록 싱어송라이터. 감성적 기타 팝의 대명사.",
    },
    "6l3HvQ5sa6mXTsMTB19rO5": {
        "youtube_url": "https://www.youtube.com/watch?v=GC9vUNqMYAk",
        "album_youtube_url": "https://www.youtube.com/watch?v=GC9vUNqMYAk",
        "instagram_url": "https://www.instagram.com/realcoleworld",
        "introduction": "노스캐롤라이나의 목소리. 삶의 진실을 바 단위로 새긴다.",
    },
    "74ASZWbe4lXaubB36ztrGX": {
        "youtube_url": "https://www.youtube.com/watch?v=IwOfCgkyEj0",
        "album_youtube_url": "https://www.youtube.com/watch?v=IwOfCgkyEj0",
        "instagram_url": "https://www.instagram.com/bobdylan",
        "introduction": "노벨 문학상을 받은 싱어송라이터. 포크와 록으로 시대를 증언했다.",
    },
}
