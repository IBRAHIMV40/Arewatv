const videosData = [
    {
        imgUrl: "https://ucarecdn.com/7f1a9c71-3b9c-4078-b64c-1f44301f9f05/-/preview/666x1000/",
        videoUrl: "https://www.youtube.com/embed/o_mN6ryMRaI?autoplay=1&mute=0",
        title: "CUTAR KAI",
        category: "Action",
        rating: 4.5,
        views: 12000,
        id: 1
    },
    {
        imgUrl: "https://ucarecdn.com/22989cf7-6064-40d1-a039-c46992ab9893/-/preview/666x1000/",
        videoUrl: "https://hausanovelup.blogspot.com/2025/06/bin-abinda-zuciya-ke-so.html",
        title: "ABINDA ZUCIYA KE SO",
        category: "Romance",
        rating: 4.2,
        views: 8500,
        id: 2
    },
    {
        imgUrl: "https://ucarecdn.com/b366b273-9c99-49a7-8b4f-8f052f4b75dd/-/preview/666x1000/",
        videoUrl: "https://hausanovelup.blogspot.com/2025/06/adalili-na.html",
        title: "ADALILI NA",
        category: "Drama",
        rating: 3.8,
        views: 6500,
        id: 3
    },
    {
        imgUrl: "https://ucarecdn.com/140b370c-78ae-428e-bdd4-a0f53646ab3d/-/preview/666x1000/",
        videoUrl: "https://hausanovelup.blogspot.com/2025/06/shin-so-daya-ne.html",
        title: "SHIN SO DAYA NE",
        category: "Comedy",
        rating: 4.0,
        views: 9200,
        id: 4
    },
    {
        imgUrl: "https://short-link.me/QSz4",
        videoUrl: "https://hausanovelup.blogspot.com/2024/05/ep-one.html",
        title: "TSANTSAR SO",
        category: "Thriller",
        rating: 4.7,
        views: 15000,
        id: 5
    },
    {
        imgUrl: "https://ucarecdn.com/83d20f2f-225c-47a7-bab1-29b56377c839/-/preview/666x1000/",
        videoUrl: "https://hausanovelup.blogspot.com/2025/05/ya-macce-kyautar-allah.html",
        title: "'YA MACCE",
        category: "Drama",
        rating: 3.9,
        views: 7800,
        id: 6
    },
    {
        imgUrl: "https://ucarecdn.com/921f18c2-f832-448d-bf26-dfca56674596/-/preview/666x1000/",
        videoUrl: "https://hausanovelup.blogspot.com/2025/06/allah-ne-shaida.html",
        title: "ALLAH NE SHAIDA",
        category: "Drama",
        rating: 4.3,
        views: 11000,
        id: 7
    },
    {
        imgUrl: "https://ucarecdn.com/96b94415-a7bf-4239-b394-63b4e2e7a847/-/preview/666x1000/",
        videoUrl: "https://hausanovelup.blogspot.com/2025/05/doctor-essha.html",
        title: "DOCTOR ESSHA",
        category: "Action",
        rating: 4.1,
        views: 9500,
        id: 8
    },
    {
        imgUrl: "https://ucarecdn.com/b95d6e46-abb8-449f-9473-1a5593cc8c0f/-/preview/666x1000/",
        videoUrl: "https://hausanovelup.blogspot.com/2025/06/daren-goma-sha-hudu.html",
        title: "DAREN GOMA SHA HUDU",
        category: "Horror",
        rating: 4.4,
        views: 13000,
        id: 9
    },
    {
        imgUrl: "https://ucarecdn.com/26173d22-4681-4e26-97a8-083613cb2651/-/preview/666x1000/",
        videoUrl: "https://hausanovelup.blogspot.com/2025/06/kukan-kurciya.html",
        title: "KUKAN KURCIYA",
        category: "Horror",
        rating: 4.6,
        views: 14000,
        id: 10
    },
    {
        imgUrl: "https://ucarecdn.com/9dadcd30-eef8-4d63-89ab-d3bf6ef83dfd/-/preview/666x1000/",
        videoUrl: "https://hausanovelup.blogspot.com/2025/06/matar-gwamna.html",
        title: "MATAR GWAMNA",
        category: "Action",
        rating: 4.2,
        views: 10500,
        id: 11
    },
    {
        imgUrl: "https://short-link.me/-8wN",
        videoUrl: "https://hausanovelup.blogspot.com/2024/05/gidan-uncle-hausa-novels.html",
        title: "GIDAN UNCLE",
        category: "Comedy",
        rating: 3.7,
        views: 6000,
        id: 12
    },
    {
        imgUrl: "https://ucarecdn.com/377505dc-f6bb-4f2f-a543-791abb95f71e/-/preview/666x1000/",
        videoUrl: "https://hausanovelup.blogspot.com/2025/06/alkibla.html",
        title: "ALKIBLA",
        category: "Drama",
        rating: 4.0,
        views: 8800,
        id: 13
    },
    {
        imgUrl: "https://ucarecdn.com/2c10177e-f68a-442f-92ee-34baf6fee050/-/preview/666x1000/",
        videoUrl: "https://hausanovelup.blogspot.com/2025/06/mairo.html",
        title: "MAIRO",
        category: "Drama",
        rating: 3.9,
        views: 7500,
        id: 14
    },
    {
        imgUrl: "https://bit.ly/3HqoQHR",
        videoUrl: "https://drive.google.com/file/d/1hdfqZO1tVfxWIf8n9qolEF4M1xudnsHp/preview",
        title: "BINTU DIYAR BAYI CE",
        category: "Drama",
        rating: 4.3,
        views: 11200,
        id: 15
    },
    {
        imgUrl: "https://ucarecdn.com/9566d727-cec4-431b-be6e-5a718b7602db/-/preview/666x1000/",
        videoUrl: "https://hausanovelup.blogspot.com/2025/05/jaruma-yazila.html",
        title: "JARUMA YAZILA",
        category: "Adventure",
        rating: 4.5,
        views: 12500,
        id: 16
    },
    {
        imgUrl: "https://bit.ly/4dHCFh0",
        videoUrl: "https://hausanovelup.blogspot.com/2025/06/fulata.html",
        title: "FULATA",
        category: "Romance",
        rating: 4.1,
        views: 9700,
        id: 17
    },
    {
        imgUrl: "https://short-link.me/-eIS",
        videoUrl: "https://hausanovelup.blogspot.com/2025/05/wutsiyar-rakumi.html",
        title: "WUTSIYAR RAKUMI",
        category: "Romance",
        rating: 4.4,
        views: 11800,
        id: 18
    },
    // Google Drive video (no autoplay)
    {
        imgUrl: "https://ucarecdn.com/b366b273-9c99-49a7-8b4f-8f052f4b75dd/-/preview/666x1000/",
        videoUrl: "https://geo.dailymotion.com/player.html?video=x9h60de",
        title: "Google Drive Video",
        category: "Drama",
        rating: 3.5,
        views: 5000,
        id: 21,
        isGoogleDrive: true
    }
];