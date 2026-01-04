// series-data.js

const SERIES_DATA = [
    {
        id: 'series-001',
        title: "House of Cards",
        description: "Political drama full of manipulation and power.",
        imgUrl: "https://media.themoviedb.org/t/p/w600_and_h900_face/6Z37lW0JfLdeFcgH9yaTyg6B9A6.jpg",
        carouselCover: "https://media.themoviedb.org/t/p/w1000_and_h563_face/m96iaX6b4bKaD9xME9JOQghBrqC.jpg",
        videoUrl: "https://www.youtube.com/embed/MN4hHqWWpwU",
        share: "#",
        category: "Hollywood",
        genre: "Drama",
        year: "2018",
        language: "English",
        country: "USA",
        carousel: true,
        type: "Series",
        isSeries: true,
        trending: true,
        views: 120000,
        rating: 4.8,
        openUrl: false,
        dateAdded: "2022-05-15",
        premium: false,
        price: 0,
        seasons: [
            {
                seasonNumber: 1,
                episodes: [
                    { 
                        number: 1, 
                        url: "https://www.youtube.com/embed/MN4hHqWWpwU",
                        title: "Chapter 1",
                        premium: false,
                        price: 0,
                        duration: "45m",
                        description: "The beginning of political intrigue."
                    },
                    { 
                        number: 2, 
                        url: "https://www.youtube.com/embed/MN4hHqWWpwU",
                        title: "Chapter 2",
                        premium: false,
                        price:   0,
                        duration: "47m",
                        description: "Power plays continue."
                    },
                    { 
                        number: 3, 
                        url: "https://www.youtube.com/embed/MN4hHqWWpwU",
                        title: "Chapter 3",
                        premium: false,
                        price: 0,
                        duration: "46m",
                        description: "Secrets are revealed."
                    }
                ]
            },
            {
                seasonNumber: 2,
                episodes: [
                    { 
                        number: 1, 
                        url: "https://www.youtube.com/embed/MN4hHqWWpwU",
                        title: "Chapter 6",
                        premium: true,
                        price: 20,
                        duration: "48m",
                        description: "New season begins."
                    },
                    { 
                        number: 2, 
                        url: "https://www.youtube.com/embed/MN4hHqWWpwU",
                        title: "Chapter 7",
                        premium: true,
                        price:  20,
                        duration: "49m",
                        description: "Conflict intensifies."
                    }
                ]
            }
        ]
    },
    {
        id: 'series-002',
        title: "The Office",
        description: "Mockumentary on a group of typical office workers.",
        imgUrl: "https://media.themoviedb.org/t/p/w600_and_h900_face/qWnJzyZhyy74gjpSjIXWmuk0ifX.jpg",
        carouselCover: "https://media.themoviedb.org/t/p/w1000_and_h563_face/example5.jpg",
        videoUrl: "https://drive.google.com/file/d/1Cm52d5TH1SpkHVpAcKXk4VLMEl9ptB4P/preview",
        share: "#",
        category: "Hollywood",
        genre: "Comedy",
        year: "2005",
        language: "English",
        country: "USA",
        carousel: false,
        type: "Series",
        isSeries: true,
        trending: true,
        views: 85000,
        rating: 4.9,
        openUrl: false,
        dateAdded: "2023-09-10",
        premium: false,
        price: 0,
        seasons: [
            {
                seasonNumber: 1,
                episodes: [
                    { 
                        number: 1, 
                        url: "https://drive.google.com/file/d/1Cm52d5TH1SpkHVpAcKXk4VLMEl9ptB4P/preview",
                        title: "Pilot",
                        premium: false,
                        price: 0,
                        duration: "22m"
                    },
                    { 
                        number: 2, 
                        url: "https://drive.google.com/file/d/1Cm52d5TH1SpkHVpAcKXk4VLMEl9ptB4P/preview",
                        title: "Diversity Day",
                        premium: false,
                        openUrl: true,
                        price: 0,
                        duration: "21m"
                    }
                ]
            }
        ]
    }
];

// Add more series as needed
