const animeData = [
    {
        id: 1001,
        title: "Attack on Titan",
        description: "Humanity fights for survival against giant humanoid Titans.",
        imgUrl: "https://example.com/attack-on-titan.jpg",
        videoUrl: "https://www.youtube.com/embed/MN4hHqWWpwU",
        genre: "Action",
        country: "Japan",
        year: 2013,
        category: "Anime",
        type: "Series",
        isSeries: true,
        seasons: [
            {
                seasonNumber: 1,
                episodes: [
                    { number: 1, url: "https://www.youtube.com/embed/episode1" },
                    { number: 2, url: "https://www.youtube.com/embed/episode2" },
                    // ... more episodes
                ]
            },
            {
                seasonNumber: 2,
                episodes: [
                    { number: 1, url: "https://www.youtube.com/embed/episode2_1" },
                    // ... more episodes
                ]
            }
        ]
    },
    {
        id: 1002,
        title: "My Hero Academia",
        description: "A boy without powers in a super-powered world strives to become a hero.",
        imgUrl: "https://example.com/my-hero-academia.jpg",
        videoUrl: "https://www.youtube.com/embed/MN4hHqWWpwU",
        genre: "Action",
        country: "Japan",
        year: 2016,
        category: "Anime",
        type: "Series",
        isSeries: true,
        seasons: [
            {
                seasonNumber: 1,
                episodes: [
                    { number: 1, url: "https://www.youtube.com/embed/mha_episode1" },
                    // ... more episodes
                ]
            }
        ]
    },
    {
        id: 1003,
        title: "Spirited Away",
        description: "A young girl enters a world ruled by gods and witches.",
        imgUrl: "https://example.com/spirited-away.jpg",
        videoUrl: "https://www.youtube.com/embed/MN4hHqWWpwU",
        genre: "Fantasy",
        country: "Japan",
        year: 2001,
        category: "Anime",
        type: "Movie"
    },
    // Add more anime as needed
];
