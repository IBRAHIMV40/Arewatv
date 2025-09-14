// Initialize Firebase with your configuration
const firebaseConfig = {
    apiKey: "AIzaSyARFUQJo32JwHMzPmlgz-1pOOINzkdZTH8",
    authDomain: "arewatv-d151b.firebaseapp.com",
    projectId: "arewatv-d151b",
    storageBucket: "arewatv-d151b.firebasestorage.app",
    messagingSenderId: "1051914778796",
    appId: "1:1051914778796:web:173a5e42dc3dc4da1a0709"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// Fetch videos from Firestore
async function fetchVideosFromFirestore() {
    try {
        showLoading();
        const snapshot = await db.collection('videos').get();
        const videos = [];
        snapshot.forEach(doc => {
            videos.push({ id: doc.id, ...doc.data() });
        });
        hideLoading();
        return videos;
    } catch (error) {
        console.error('Error fetching videos:', error);
        hideLoading();
        showNotification('Failed to load videos. Please check your connection.', 'error');
        return [];
    }
}

// Fetch ads from Firestore
async function fetchAdsFromFirestore() {
    try {
        const snapshot = await db.collection('ads').get();
        const ads = [];
        snapshot.forEach(doc => {
            ads.push({ id: doc.id, ...doc.data() });
        });
        return ads;
    } catch (error) {
        console.error('Error fetching ads:', error);
        return [];
    }
}

// Fetch apps from Firestore
async function fetchAppsFromFirestore() {
    try {
        const snapshot = await db.collection('apps').get();
        const apps = [];
        snapshot.forEach(doc => {
            apps.push({ id: doc.id, ...doc.data() });
        });
        return apps;
    } catch (error) {
        console.error('Error fetching apps:', error);
        return [];
    }
}

// Initialize saved movies from localStorage
let savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || [];

// Initialize user profile from localStorage
let userProfile = JSON.parse(localStorage.getItem('userProfile')) || {
    name: 'Movie Nest User',
    avatar: null
};

// Fallback data in case external files fail to load
const fallbackData = [
    {
        id: 1,
        title: "Sample Movie",
        description: "A sample movie for testing",
        imgUrl: "https://picsum.photos/seed/movie1/300/450.jpg",
        videoUrl: "https://www.youtube.com/embed/MN4hHWpwU",
        category: "Algaita Dub-Studio",
        genre: "Action",
        year: 2023,
        type: "Movie"
    }
];

// Data validation
let videosData, seriesData, animeData, profileApps, adsData;

function validateData() {
    if (!videosData || !Array.isArray(videosData)) {
        console.error("videosData is missing or invalid");
        return false;
    }
    if (!seriesData || !Array.isArray(seriesData)) {
        console.error("seriesData is missing or invalid");
        return false;
    }
    if (!animeData || !Array.isArray(animeData)) {
        console.error("animeData is missing or invalid");
        return false;
    }
    return true;
}

// Combine videos, series, and anime data and shuffle
let combinedData;
let data;

try {
    if (validateData()) {
        combinedData = [...videosData, ...seriesData, ...animeData];
    } else {
        combinedData = fallbackData;
        console.warn("Using fallback data due to validation errors");
    }
    data = shuffleArray(combinedData);
} catch (error) {
    console.error("Error combining data:", error);
    data = fallbackData;
}

// Track if we're currently in the video modal
let inVideoModal = false;

// Track if we're currently in a grid view
let inGridView = false;

// Track if we're currently in the filter modal
let inFilterModal = false;

// Track if we're currently in the history modal
let inHistoryModal = false;

// Track if we're currently in the sidebar modal
let inSidebarModal = false;

// Track if we're currently in the upload modal
let inUploadModal = false;

// Track if we're currently in the password modal
let inPasswordModal = false;

// Track if we're currently in the ad upload modal
let inAdUploadModal = false;

// Track if we're currently in the app upload modal
let inAppUploadModal = false;

// Track if we're currently in the ads submenu
let inAdsSubmenu = false;

// Track if we're currently in the apps submenu
let inAppsSubmenu = false;

// Track current grid data for filtering
let currentGridData = [];

// Track if we're navigating episodes/seasons
let isEpisodeNavigation = false;

// Track search suggestions
let searchTimeout;
let currentSearchTerm = '';

// Track seasons and episodes for upload
let seasons = [];
let seasonCounter = 0;

// Track if we're opening a direct video link
let openingDirectLink = false;

// Function to show/hide loading spinner
function showLoading() {
    document.getElementById('loading').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

// Function to validate video URLs
function isValidVideoUrl(url) {
    try {
        const urlObj = new URL(url);
        return (
            urlObj.hostname.includes('youtube.com') || 
            urlObj.hostname.includes('drive.google.com')
        );
    } catch (e) {
        return false;
    }
}

// Function to toggle the upload modal
const openUploadModal = () => {
    const uploadModal = document.getElementById('upload-modal');
    const sidebarModal = document.getElementById('sidebar-modal');
    
    // Close sidebar modal first
    if (sidebarModal.classList.contains('open')) {
        sidebarModal.classList.remove('open');
        inSidebarModal = false;
    }
    
    // Open upload modal
    uploadModal.classList.add('open');
    inUploadModal = true;
    
    // Push state to history
    history.pushState({ uploadOpen: true }, '');
    
    // Reset form
    document.getElementById('upload-form').reset();
    
    // Reset seasons data
    seasons = [];
    seasonCounter = 0;
    document.getElementById('seasons-list').innerHTML = '';
    
    // Scroll to top of modal content
    setTimeout(() => {
        const uploadContent = document.querySelector('.upload-content');
        if (uploadContent) {
            uploadContent.scrollTop = 0;
        }
    }, 100);
};

const closeUploadModal = () => {
    const uploadModal = document.getElementById('upload-modal');
    uploadModal.classList.remove('open');
    inUploadModal = false;
    
    // Reset form
    document.getElementById('upload-form').reset();
};

// Function to toggle the ad upload modal
const openAdUploadModal = () => {
    const adUploadModal = document.getElementById('ad-upload-modal');
    const sidebarModal = document.getElementById('sidebar-modal');
    const adsSubmenu = document.getElementById('ads-submenu');
    
    // Close sidebar modal first
    if (sidebarModal.classList.contains('open')) {
        sidebarModal.classList.remove('open');
        inSidebarModal = false;
    }
    
    // Close ads submenu
    if (adsSubmenu.classList.contains('open')) {
        adsSubmenu.classList.remove('open');
        inAdsSubmenu = false;
    }
    
    // Open ad upload modal
    adUploadModal.classList.add('open');
    inAdUploadModal = true;
    
    // Reset form
    document.getElementById('ad-upload-form').reset();
    
    // Scroll to top of modal content
    setTimeout(() => {
        const adUploadContent = document.querySelector('.ad-upload-content');
        if (adUploadContent) {
            adUploadContent.scrollTop = 0;
        }
    }, 100);
};

const closeAdUploadModal = () => {
    const adUploadModal = document.getElementById('ad-upload-modal');
    adUploadModal.classList.remove('open');
    inAdUploadModal = false;
    
    // Reset form
    document.getElementById('ad-upload-form').reset();
};

// Function to toggle the app upload modal
const openAppUploadModal = () => {
    const appUploadModal = document.getElementById('app-upload-modal');
    const sidebarModal = document.getElementById('sidebar-modal');
    const appsSubmenu = document.getElementById('apps-submenu');
    
    // Close sidebar modal first
    if (sidebarModal.classList.contains('open')) {
        sidebarModal.classList.remove('open');
        inSidebarModal = false;
    }
    
    // Close apps submenu
    if (appsSubmenu.classList.contains('open')) {
        appsSubmenu.classList.remove('open');
        inAppsSubmenu = false;
    }
    
    // Open app upload modal
    appUploadModal.classList.add('open');
    inAppUploadModal = true;
    
    // Reset form
    document.getElementById('app-upload-form').reset();
    
    // Scroll to top of modal content
    setTimeout(() => {
        const appUploadContent = document.querySelector('.app-upload-content');
        if (appUploadContent) {
            appUploadContent.scrollTop = 0;
        }
    }, 100);
};

const closeAppUploadModal = () => {
    const appUploadModal = document.getElementById('app-upload-modal');
    appUploadModal.classList.remove('open');
    inAppUploadModal = false;
    
    // Reset form
    document.getElementById('app-upload-form').reset();
};

// Function to check password before opening upload modal
const checkUploadPassword = () => {
    const passwordModal = document.getElementById('password-modal');
    passwordModal.classList.add('open');
    inPasswordModal = true;
    
    // Focus on password input
    setTimeout(() => {
        document.getElementById('password-input').focus();
    }, 100);
};

// Function to check password before opening app upload modal
const checkUploadAppPassword = () => {
    const passwordModal = document.getElementById('password-modal');
    passwordModal.classList.add('open');
    inPasswordModal = true;
    
    // Focus on password input
    setTimeout(() => {
        document.getElementById('password-input').focus();
    }, 100);
    
    // Set a flag to indicate we're opening app upload
    passwordModal.dataset.target = 'app';
};

// Function to check password before opening ad upload modal
const checkUploadAdPassword = () => {
    const passwordModal = document.getElementById('password-modal');
    passwordModal.classList.add('open');
    inPasswordModal = true;
    
    // Focus on password input
    setTimeout(() => {
        document.getElementById('password-input').focus();
    }, 100);
    
    // Set a flag to indicate we're opening ad upload
    passwordModal.dataset.target = 'ad';
};

const closePasswordModal = () => {
    const passwordModal = document.getElementById('password-modal');
    passwordModal.classList.remove('open');
    inPasswordModal = false;
    
    // Clear password input and error message
    document.getElementById('password-input').value = '';
    document.getElementById('password-error').textContent = '';
};

const validatePassword = (event) => {
    event.preventDefault();
    
    const password = document.getElementById('password-input').value;
    const correctPassword = "Mm&&0220";
    const target = document.getElementById('password-modal').dataset.target;
    
    if (password === correctPassword) {
        closePasswordModal();
        openUploadModal();
    } else if (password === "Mm&&0221" && target === 'app') {
        closePasswordModal();
        openAppUploadModal();
    } else if (password === "Mm&&0221" && target === 'ad') {
        closePasswordModal();
        openAdUploadModal();
    } else {
        document.getElementById('password-error').textContent = "Incorrect password. Please try again.";
    }
};

// Function to open Apps Center
const openAppsCenter = () => {
    const appsSubmenu = document.getElementById('apps-submenu');
    const sidebarModal = document.getElementById('sidebar-modal');
    
    // Toggle the submenu
    if (appsSubmenu.classList.contains('open')) {
        appsSubmenu.classList.remove('open');
        inAppsSubmenu = false;
    } else {
        // Close other submenus first
        document.getElementById('ads-submenu').classList.remove('open');
        inAdsSubmenu = false;
        
        appsSubmenu.classList.add('open');
        inAppsSubmenu = true;
    }
};

// Function to open Ads Center
const openAdsCenter = () => {
    const adsSubmenu = document.getElementById('ads-submenu');
    const sidebarModal = document.getElementById('sidebar-modal');
    
    // Toggle the submenu
    if (adsSubmenu.classList.contains('open')) {
        adsSubmenu.classList.remove('open');
        inAdsSubmenu = false;
    } else {
        // Close other submenus first
        document.getElementById('apps-submenu').classList.remove('open');
        inAppsSubmenu = false;
        
        adsSubmenu.classList.add('open');
        inAdsSubmenu = true;
    }
};

// Function to view all apps
const viewApps = async () => {
    // Reset scroll position
    window.scrollTo(0, 0);
    
    // Set flag and push state for grid view
    inGridView = true;
    history.pushState({ gridView: true, view: 'apps' }, '');
    
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';
    gridContainer.scrollTop = 0;
    
    // Hide other sections
    document.getElementById('discover-container').style.display = 'none';
    document.getElementById('categories-container').style.display = 'none';
    gridContainer.style.display = 'block';
    
    // Create search container for apps
    const searchContainer = document.createElement('div');
    searchContainer.className = 'view-search-container';
    searchContainer.innerHTML = `
        <div class="view-search-input-container">
            <i class="fas fa-search"></i>
            <input type="text" id="apps-search-bar" placeholder="Search apps..." oninput="searchApps()">
        </div>
    `;
    
    // Create apps section header
    const appsHeader = document.createElement('div');
    appsHeader.className = 'view-section-header';
    appsHeader.innerHTML = `
        <h3 class="view-section-title">Apps Center</h3>
        <span class="view-section-count">${profileApps ? profileApps.length : 0} apps</span>
    `;
    
    // Create apps content container
    const appsContent = document.createElement('div');
    appsContent.className = 'view-section';
    appsContent.id = 'apps-content';
    
    // Add elements to grid container
    gridContainer.appendChild(searchContainer);
    gridContainer.appendChild(appsHeader);
    gridContainer.appendChild(appsContent);
    
    // Populate apps
    if (profileApps && profileApps.length > 0) {
        profileApps.forEach(app => {
            const appItem = createAppViewItem(app);
            appsContent.appendChild(appItem);
        });
    } else {
        appsContent.innerHTML = '<p>No apps available</p>';
    }
    
    // Close sidebar
    toggleSidebarModal();
};

// Function to view all ads
const viewAds = async () => {
    // Reset scroll position
    window.scrollTo(0, 0);
    
    // Set flag and push state for grid view
    inGridView = true;
    history.pushState({ gridView: true, view: 'ads' }, '');
    
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';
    gridContainer.scrollTop = 0;
    
    // Hide other sections
    document.getElementById('discover-container').style.display = 'none';
    document.getElementById('categories-container').style.display = 'none';
    gridContainer.style.display = 'block';
    
    // Create search container for ads
    const searchContainer = document.createElement('div');
    searchContainer.className = 'view-search-container';
    searchContainer.innerHTML = `
        <div class="view-search-input-container">
            <i class="fas fa-search"></i>
            <input type="text" id="ads-search-bar" placeholder="Search ads..." oninput="searchAds()">
        </div>
    `;
    
    // Create ads section header
    const adsHeader = document.createElement('div');
    adsHeader.className = 'view-section-header';
    adsHeader.innerHTML = `
        <h3 class="view-section-title">Ads Center</h3>
        <span class="view-section-count">${adsData ? adsData.length : 0} ads</span>
    `;
    
    // Create ads content container
    const adsContent = document.createElement('div');
    adsContent.className = 'view-section';
    adsContent.id = 'ads-content';
    
    // Add elements to grid container
    gridContainer.appendChild(searchContainer);
    gridContainer.appendChild(adsHeader);
    gridContainer.appendChild(adsContent);
    
    // Populate ads
    if (adsData && adsData.length > 0) {
        adsData.forEach(ad => {
            const adItem = createAdViewItem(ad);
            adsContent.appendChild(adItem);
        });
    } else {
        adsContent.innerHTML = '<p>No ads available</p>';
    }
    
    // Close sidebar
    toggleSidebarModal();
};

// Function to create an app view item
const createAppViewItem = (app) => {
    const appItem = document.createElement('div');
    appItem.className = 'view-item';
    
    const icon = document.createElement('img');
    icon.src = app.icon || 'https://picsum.photos/seed/app/50/50.jpg';
    icon.alt = app.name;
    icon.className = 'view-item-icon';
    
    const content = document.createElement('div');
    content.className = 'view-item-content';
    
    const name = document.createElement('h4');
    name.className = 'view-item-title';
    name.textContent = app.name;
    
    const description = document.createElement('p');
    description.className = 'view-item-description';
    description.textContent = app.description;
    
    const viewsButton = document.createElement('button');
    viewsButton.className = 'view-item-views';
    viewsButton.textContent = app.views ? `${app.views} views` : '0 views';
    viewsButton.onclick = async () => {
        try {
            // Get the app document
            const appRef = db.collection('apps').doc(app.id);
            const appDoc = await appRef.get();
            
            if (appDoc.exists) {
                // Get current view count
                const currentViews = appDoc.data().views || 0;
                const newViews = currentViews + 1;
                
                // Update view count in Firestore
                await appRef.update({ views: newViews });
                
                // Update button text to show view count
                viewsButton.textContent = `${newViews} views`;
                
                // Update local data
                app.views = newViews;
            } else {
                // If document doesn't exist, create it with view count
                await appRef.set({ 
                    views: 1,
                    ...app 
                });
                viewsButton.textContent = '1 views';
                app.views = 1;
            }
        } catch (error) {
            console.error('Error updating app view count:', error);
            showNotification('Error updating view count', 'error');
        }
    };
    
    content.appendChild(name);
    content.appendChild(description);
    appItem.appendChild(icon);
    appItem.appendChild(content);
    appItem.appendChild(viewsButton);
    
    return appItem;
};

// Function to create an ad view item
const createAdViewItem = (ad) => {
    const adItem = document.createElement('div');
    adItem.className = 'view-item';
    
    const icon = document.createElement('img');
    icon.src = ad.image || 'https://picsum.photos/seed/ad/50/50.jpg';
    icon.alt = ad.title;
    icon.className = 'view-item-icon';
    
    const content = document.createElement('div');
    content.className = 'view-item-content';
    
    const name = document.createElement('h4');
    name.className = 'view-item-title';
    name.textContent = ad.title;
    
    const description = document.createElement('p');
    description.className = 'view-item-description';
    description.textContent = ad.description;
    
    const viewsButton = document.createElement('button');
    viewsButton.className = 'view-item-views';
    viewsButton.textContent = ad.views ? `${ad.views} views` : '0 views';
    viewsButton.onclick = async () => {
        try {
            // Get the ad document
            const adRef = db.collection('ads').doc(ad.id);
            const adDoc = await adRef.get();
            
            if (adDoc.exists) {
                // Get current view count
                const currentViews = adDoc.data().views || 0;
                const newViews = currentViews + 1;
                
                // Update view count in Firestore
                await adRef.update({ views: newViews });
                
                // Update button text to show view count
                viewsButton.textContent = `${newViews} views`;
                
                // Update local data
                ad.views = newViews;
            } else {
                // If document doesn't exist, create it with view count
                await adRef.set({ 
                    views: 1,
                    ...ad 
                });
                viewsButton.textContent = '1 views';
                ad.views = 1;
            }
        } catch (error) {
            console.error('Error updating ad view count:', error);
            showNotification('Error updating view count', 'error');
        }
    };
    
    content.appendChild(name);
    content.appendChild(description);
    adItem.appendChild(icon);
    adItem.appendChild(content);
    adItem.appendChild(viewsButton);
    
    return adItem;
};

// Function to search apps
const searchApps = () => {
    const searchTerm = document.getElementById('apps-search-bar').value.toLowerCase();
    const appsContent = document.getElementById('apps-content');
    appsContent.innerHTML = '';
    
    if (!profileApps || profileApps.length === 0) {
        appsContent.innerHTML = '<p>No apps available</p>';
        return;
    }
    
    const filteredApps = profileApps.filter(app => {
        return app.name.toLowerCase().includes(searchTerm) || 
               app.description.toLowerCase().includes(searchTerm) ||
               (app.category && app.category.toLowerCase().includes(searchTerm));
    });
    
    if (filteredApps.length > 0) {
        filteredApps.forEach(app => {
            const appItem = createAppViewItem(app);
            appsContent.appendChild(appItem);
        });
    } else {
        appsContent.innerHTML = '<p>No apps found matching your search</p>';
    }
};

// Function to search ads
const searchAds = () => {
    const searchTerm = document.getElementById('ads-search-bar').value.toLowerCase();
    const adsContent = document.getElementById('ads-content');
    adsContent.innerHTML = '';
    
    if (!adsData || adsData.length === 0) {
        adsContent.innerHTML = '<p>No ads available</p>';
        return;
    }
    
    const filteredAds = adsData.filter(ad => {
        return ad.title.toLowerCase().includes(searchTerm) || 
               ad.description.toLowerCase().includes(searchTerm) ||
               (ad.category && ad.category.toLowerCase().includes(searchTerm));
    });
    
    if (filteredAds.length > 0) {
        filteredAds.forEach(ad => {
            const adItem = createAdViewItem(ad);
            adsContent.appendChild(adItem);
        });
    } else {
        adsContent.innerHTML = '<p>No ads found matching your search</p>';
    }
};

// Function to toggle series fields based on video type
const toggleSeriesFields = () => {
    const videoType = document.getElementById('video-type').value;
    const seriesFields = document.getElementById('series-fields');
    
    if (videoType === 'series' || videoType === 'anime') {
        seriesFields.style.display = 'block';
        
        // Add at least one season if none exist
        if (seasons.length === 0) {
            addSeason();
        }
    } else {
        seriesFields.style.display = 'none';
    }
};

// Function to add a new season
const addSeason = () => {
    seasonCounter++;
    const seasonId = `season-${seasonCounter}`;
    
    const seasonData = {
        id: seasonId,
        seasonNumber: seasonCounter,
        episodes: []
    };
    
    seasons.push(seasonData);
    
    const seasonElement = document.createElement('div');
    seasonElement.className = 'seasons-container';
    seasonElement.id = seasonId;
    seasonElement.innerHTML = `
        <div class="season-header">
            <div class="season-title">Season ${seasonCounter}</div>
            <div class="season-actions">
                <button type="button" class="season-btn" onclick="addEpisode('${seasonId}')">Add Episode</button>
                <button type="button" class="season-btn remove" onclick="removeSeason('${seasonId}')">Remove</button>
            </div>
        </div>
        <div class="episodes-container" id="${seasonId}-episodes">
            <!-- Episodes will be added here dynamically -->
        </div>
    `;
    
    document.getElementById('seasons-list').appendChild(seasonElement);
    
    // Add at least one episode to the new season
    addEpisode(seasonId);
};

// Function to remove a season
const removeSeason = (seasonId) => {
    // Remove from data array
    seasons = seasons.filter(season => season.id !== seasonId);
    
    // Remove from DOM
    document.getElementById(seasonId).remove();
    
    // If no seasons left, reset counter
    if (seasons.length === 0) {
        seasonCounter = 0;
    }
};

// Function to add a new episode to a season
const addEpisode = (seasonId) => {
    const season = seasons.find(s => s.id === seasonId);
    if (!season) return;
    
    const episodeNumber = season.episodes.length + 1;
    const episodeId = `${seasonId}-episode-${episodeNumber}`;
    
    const episodeData = {
        id: episodeId,
        number: episodeNumber,
        title: `Episode ${episodeNumber}`,
        url: ''
    };
    
    season.episodes.push(episodeData);
    
    const episodeElement = document.createElement('div');
    episodeElement.className = 'episode-item';
    episodeElement.id = episodeId;
    episodeElement.innerHTML = `
        <div class="episode-info">
            <div class="episode-number">Episode ${episodeNumber}</div>
            <div class="episode-title">
                <input type="text" placeholder="Episode title" value="${episodeData.title}" onchange="updateEpisodeTitle('${episodeId}', this.value)">
            </div>
        </div>
        <div class="episode-actions">
            <input type="url" placeholder="Episode URL" style="width: 200px; padding: 5px; margin-right: 10px;" onchange="updateEpisodeUrl('${episodeId}', this.value)">
            <button type="button" class="episode-btn remove" onclick="removeEpisode('${seasonId}', '${episodeId}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    document.getElementById(`${seasonId}-episodes`).appendChild(episodeElement);
};

// Function to remove an episode
const removeEpisode = (seasonId, episodeId) => {
    const season = seasons.find(s => s.id === seasonId);
    if (!season) return;
    
    // Remove from data array
    season.episodes = season.episodes.filter(episode => episode.id !== episodeId);
    
    // Remove from DOM
    document.getElementById(episodeId).remove();
    
    // Renumber remaining episodes
    season.episodes.forEach((episode, index) => {
        episode.number = index + 1;
        episode.title = episode.title.replace(/Episode \d+/, `Episode ${index + 1}`);
        
        // Update DOM
        const episodeElement = document.getElementById(episode.id);
        if (episodeElement) {
            episodeElement.querySelector('.episode-number').textContent = `Episode ${index + 1}`;
            episodeElement.querySelector('.episode-title input').value = episode.title;
        }
    });
};

// Function to update episode title
const updateEpisodeTitle = (episodeId, title) => {
    for (const season of seasons) {
        const episode = season.episodes.find(e => e.id === episodeId);
        if (episode) {
            episode.title = title;
            break;
        }
    }
};

// Function to update episode URL
const updateEpisodeUrl = (episodeId, url) => {
    for (const season of seasons) {
        const episode = season.episodes.find(e => e.id === episodeId);
        if (episode) {
            episode.url = url;
            break;
        }
    }
};

// Handle form submission for video upload - Enhanced for series
document.getElementById('upload-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form values
    const title = document.getElementById('video-title').value;
    const description = document.getElementById('video-description').value;
    const type = document.getElementById('video-type').value;
    const category = document.getElementById('video-category').value;
    const genre = document.getElementById('video-genre').value;
    const country = document.getElementById('video-country').value;
    const year = document.getElementById('video-year').value;
    const trending = document.getElementById('video-trending').checked;
    const videoUrl = document.getElementById('video-url').value;
    const downloadUrl = document.getElementById('video-download-url').value;
    const thumbnail = document.getElementById('video-thumbnail').value || `https://picsum.photos/seed/${Math.random().toString(36).substring(7)}/300/450.jpg`;
    const carouselThumbnail = document.getElementById('video-carousel-thumbnail').value;
    
    // Validate URL format
    if (!isValidVideoUrl(videoUrl)) {
        showNotification('Please enter a valid YouTube embed or Google Drive preview URL', 'warning');
        return;
    }
    
    // If it's a Google Drive video, download URL is required
    if (videoUrl.includes('drive.google.com') && !downloadUrl) {
        showNotification('Please provide a download URL for Google Drive videos', 'warning');
        return;
    }
    
    try {
        showLoading();
        
        // Create video object
        const videoData = {
            title,
            description,
            type,
            category,
            genre,
            country,
            year: parseInt(year),
            trending,
            videoUrl,
            downloadUrl: downloadUrl || null,
            imgUrl: thumbnail,
            carouselCover: carouselThumbnail || thumbnail, // Use carousel thumbnail if provided, otherwise use regular thumbnail
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uploadedBy: 'anonymous' // Use 'anonymous' instead of user ID
        };
        
        // If it's a series or anime, add seasons and episodes data
        if ((type === 'series' || type === 'anime') && seasons.length > 0) {
            videoData.isSeries = true;
            videoData.seasons = seasons.map(season => ({
                seasonNumber: season.seasonNumber,
                episodes: season.episodes.map(episode => ({
                    number: episode.number,
                    title: episode.title,
                    url: episode.url
                }))
            }));
            
            // Validate that all episodes have URLs
            let allEpisodesHaveUrls = true;
            for (const season of videoData.seasons) {
                for (const episode of season.episodes) {
                    if (!episode.url || !isValidVideoUrl(episode.url)) {
                        allEpisodesHaveUrls = false;
                        break;
                    }
                }
                if (!allEpisodesHaveUrls) break;
            }
            
            if (!allEpisodesHaveUrls) {
                showNotification('Please provide valid URLs for all episodes', 'warning');
                hideLoading();
                return;
            }
        }
        
        // Add to Firestore
        const docRef = await db.collection('videos').add(videoData);
        
        // Show success message
        showNotification('Video uploaded successfully!', 'success');
        
        // Close modal
        closeUploadModal();
        
        // Add the new video to the local data array
        const newVideo = {
            id: docRef.id,
            ...videoData
        };
        data.unshift(newVideo);
        
        // Refresh the UI
        createDiscoverSection();
        createCategories();
        
    } catch (error) {
        console.error('Error uploading video:', error);
        showNotification('Error uploading video. Please try again.', 'warning');
    } finally {
        hideLoading();
    }
});

// Handle form submission for ad upload
document.getElementById('ad-upload-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form values
    const title = document.getElementById('ad-title').value;
    const description = document.getElementById('ad-description').value;
    const image = document.getElementById('ad-image').value;
    const link = document.getElementById('ad-link').value;
    const category = document.getElementById('ad-category').value;
    
    try {
        showLoading();
        
        // Create ad object
        const adData = {
            title,
            description,
            image,
            link,
            category,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uploadedBy: 'anonymous'
        };
        
        // Add to Firestore
        const docRef = await db.collection('ads').add(adData);
        
        // Show success message
        showNotification('Ad uploaded successfully!', 'success');
        
        // Close modal
        closeAdUploadModal();
        
        // Refresh ads data
        const newAd = {
            id: docRef.id,
            ...adData
        };
        if (!adsData) {
            adsData = [];
        }
        adsData.unshift(newAd);
        
        // Update ad display
        updateAdDisplay();
        
    } catch (error) {
        console.error('Error uploading ad:', error);
        showNotification('Error uploading ad. Please try again.', 'warning');
    } finally {
        hideLoading();
    }
});

// Handle form submission for app upload
document.getElementById('app-upload-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('app-name').value;
    const description = document.getElementById('app-description').value;
    const icon = document.getElementById('app-icon').value;
    const link = document.getElementById('app-link').value;
    const category = document.getElementById('app-category').value;
    const rating = parseFloat(document.getElementById('app-rating').value);
    
    try {
        showLoading();
        
        // Create app object
        const appData = {
            name,
            description,
            icon,
            link,
            category,
            rating,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uploadedBy: 'anonymous'
        };
        
        // Add to Firestore
        const docRef = await db.collection('apps').add(appData);
        
        // Show success message
        showNotification('App uploaded successfully!', 'success');
        
        // Close modal
        closeAppUploadModal();
        
        // Refresh apps data
        const newApp = {
            id: docRef.id,
            ...appData
        };
        if (!profileApps) {
            profileApps = [];
        }
        profileApps.unshift(newApp);
        
        // Shuffle the profile apps array
        profileApps = shuffleArray(profileApps);
        
        // Update app display
        updateAppDisplay();
        
    } catch (error) {
        console.error('Error uploading app:', error);
        showNotification('Error uploading app. Please try again.', 'warning');
    } finally {
        hideLoading();
    }
});

// Function to update ad display
const updateAdDisplay = () => {
    // Update notification bar ad
    const notificationBar = document.getElementById('notification-bar');
    if (adsData && adsData.length > 0) {
        const ad = adsData[0];
        notificationBar.querySelector('img').src = ad.image;
        notificationBar.querySelector('.notification-text').textContent = ad.title;
        notificationBar.querySelector('.notification-button').onclick = () => window.open(ad.link, '_blank');
    }
};

// Function to update app display
const updateAppDisplay = () => {
    // Update profile section
    if (inGridView && document.getElementById('grid-container').style.display === 'block') {
        const gridContainer = document.getElementById('grid-container');
        gridContainer.innerHTML = '';
        
        if (profileApps && Array.isArray(profileApps)) {
            profileApps.forEach(item => {
                const profileItem = createProfileItem(item);
                gridContainer.appendChild(profileItem);
            });
        }
    }
};

// Function to toggle the sidebar modal
const toggleSidebarModal = () => {
    const sidebarModal = document.getElementById('sidebar-modal');
    const historyModal = document.getElementById('history-modal');
    const filterModal = document.getElementById('filter-modal');
    
    // If history modal is open, close it first
    if (historyModal.classList.contains('open')) {
        historyModal.classList.remove('open');
        inHistoryModal = false;
    }
    
    // If filter modal is open, close it first
    if (filterModal.classList.contains('open')) {
        filterModal.classList.remove('open');
        inFilterModal = false;
    }
    
    // Close submenus
    document.getElementById('ads-submenu').classList.remove('open');
    inAdsSubmenu = false;
    document.getElementById('apps-submenu').classList.remove('open');
    inAppsSubmenu = false;
    
    // Toggle the sidebar modal
    sidebarModal.classList.toggle('open');
    inSidebarModal = !inSidebarModal;
    
    // If opening the sidebar modal, push state to history
    if (inSidebarModal) {
        history.pushState({ sidebarOpen: true }, '');
    }
};

// Function to toggle the history modal
const toggleHistoryModal = () => {
    const historyModal = document.getElementById('history-modal');
    const sidebarModal = document.getElementById('sidebar-modal');
    const filterModal = document.getElementById('filter-modal');
    
    // If sidebar modal is open, close it first
    if (sidebarModal.classList.contains('open')) {
        sidebarModal.classList.remove('open');
        inSidebarModal = false;
    }
    
    // If filter modal is open, close it first
    if (filterModal.classList.contains('open')) {
        filterModal.classList.remove('open');
        inFilterModal = false;
    }
    
    // Toggle the history modal
    historyModal.classList.toggle('open');
    inHistoryModal = !inHistoryModal;
    
    // If opening the history modal, push state to history
    if (inHistoryModal) {
        history.pushState({ historyOpen: true }, '');
    }
};

// Function to toggle the filter modal
const toggleFilterModal = () => {
    const filterModal = document.getElementById('filter-modal');
    const sidebarModal = document.getElementById('sidebar-modal');
    const historyModal = document.getElementById('history-modal');
    
    // If sidebar modal is open, close it first
    if (sidebarModal.classList.contains('open')) {
        sidebarModal.classList.remove('open');
        inSidebarModal = false;
    }
    
    // If history modal is open, close it first
    if (historyModal.classList.contains('open')) {
        historyModal.classList.remove('open');
        inHistoryModal = false;
    }
    
    // Toggle the filter modal
    filterModal.classList.toggle('open');
    inFilterModal = !inFilterModal;
    
    // If opening the filter modal, push state to history
    if (inFilterModal) {
        history.pushState({ filterOpen: true }, '');
    }
};

// Function to populate the sidebar with URL logos
const populateSidebar = () => {
    const sidebarList = document.getElementById('sidebar-list');
    sidebarList.innerHTML = '';
    // Example list of URL logos (replace with your own data)
    const urlLogos = [
        { logoUrl: "https://cdn-icons-png.flaticon.com/128/18831/18831648.png", name: "Director Center", url: "#", isUpload: true },
        { logoUrl: "https://cdn-icons-png.flaticon.com/128/5303/5303479.png", name: "Apps Center", url: "#", isApps: true },
        { logoUrl: "https://cdn-icons-png.flaticon.com/128/9592/9592247.png", name: "Ads Center", url: "#", isAds: true },
        { logoUrl: "https://cdn-icons-png.flaticon.com/128/2767/2767325.png", name: "View Apps", url: "#", isViewApps: true },
        { logoUrl: "https://cdn-icons-png.flaticon.com/128/2767/2767325.png", name: "View Ads", url: "#", isViewAds: true },
        { logoUrl: "https://cdn-icons-png.flaticon.com/128/18392/18392966.png", name: "Online Service", url: "#" },
        { logoUrl: "https://cdn-icons-png.flaticon.com/128/2312/2312342.png", name: "Privacy Policy", url: "#" },
        { logoUrl: "https://cdn-icons-png.flaticon.com/128/3405/3405247.png", name: "Settings", url: "#" },
        { logoUrl: "https://cdn-icons-png.flaticon.com/128/2838/2838694.png", name: "Help & Support", url: "#" },
    ];
    urlLogos.forEach(item => {
        const sidebarItem = document.createElement('div');
        sidebarItem.className = 'sidebar-item';
        
        if (item.isUpload) {
            // Director Center with upload functionality
            sidebarItem.onclick = checkUploadPassword;
        } else if (item.isApps) {
            // Apps Center
            sidebarItem.onclick = openAppsCenter;
        } else if (item.isAds) {
            // Ads Center
            sidebarItem.onclick = openAdsCenter;
        } else if (item.isViewApps) {
            // View Apps
            sidebarItem.onclick = viewApps;
        } else if (item.isViewAds) {
            // View Ads
            sidebarItem.onclick = viewAds;
        } else {
            sidebarItem.onclick = () => window.open(item.url, '_blank');
        }
        
        const img = document.createElement('img');
        img.src = item.logoUrl;
        img.alt = item.name;
        const span = document.createElement('span');
        span.textContent = item.name;
        sidebarItem.appendChild(img);
        sidebarItem.appendChild(span);
        sidebarList.appendChild(sidebarItem);
    });
};
// Call the function to populate the sidebar on page load
populateSidebar();

// Function to shuffle array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Create carousel using the data array - Updated to match screenshot
const createCarousel = () => {
    const carousel = document.getElementById("carousel");
    const dotsContainer = document.getElementById("dots");
    carousel.innerHTML = '';
    dotsContainer.innerHTML = '';
    
    // Use the first 5 items for carousel
    const carouselData = data.slice(0, 5);
    
    carouselData.forEach((item, index) => {
        const slide = document.createElement("div");
        slide.className = "slide";
        
        // Format tags for display
        const tagsDisplay = item.tags ? item.tags.join(" • ") : "";
        
        // Use carouselCover if available, otherwise fall back to imgUrl
        const carouselImage = item.carouselCover || item.imgUrl;
        
        slide.innerHTML = `
            <img src="${carouselImage}" alt="${item.title}">
            <div class="overlay"></div>
            <div class="video-title">${item.title}</div>
            <div class="video-info">${item.type || 'Movie'} | ${item.year || '2025'} | ${tagsDisplay}</div>
            <button class="download-btn">
                <i class="fas fa-download"></i> Download
            </button>
        `;
        
        // Add click event to open modal
        slide.onclick = () => openVideoNav(item.videoUrl, item.title, item);
        
        carousel.appendChild(slide);
        
        const dot = document.createElement("div");
        dot.className = "dot";
        if (index === 0) dot.classList.add("active");
        dot.addEventListener("click", () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
};

const createDiscoverSection = () => {
    const discoverScroll = document.getElementById('discover-scroll');
    discoverScroll.innerHTML = '';
    
    // Use items from index 5 to 24 (20 items) for discover section
    const discoverData = data.slice(5, 25);
    
    discoverData.forEach(item => {
        const discoverItem = document.createElement('div');
        discoverItem.className = 'discover-item';
        const img = document.createElement('img');
        img.src = item.imgUrl; // Use movie cover for discover section
        img.alt = item.title;
        const content = document.createElement('div');
        content.className = 'content';
        content.innerHTML = `
            <h2>${item.title}</h2>
            <p>${item.description}</p>
        `;
        
        // Add click event to the entire discover item
        discoverItem.onclick = () => openVideoNav(item.videoUrl, item.title, item);
        
        discoverItem.appendChild(img);
        discoverItem.appendChild(content);
        discoverScroll.appendChild(discoverItem);
    });
};
const createCategories = () => {
    const categories = [...new Set(data.map(item => item.category))]; // Get unique categories
    const container = document.getElementById('categories-container');
    container.innerHTML = '';
    categories.forEach(category => {
        const categoryData = data.filter(item => item.category === category); // Use original data
        const categoryContainer = document.createElement('div');
        categoryContainer.className = 'category-container';
        const categoryTitle = document.createElement('div');
        categoryTitle.className = 'category-title';
        categoryTitle.innerHTML = `
            <span>
                ${category}
                <i class="fas fa-chevron-right"></i> <!-- Right arrow icon -->
            </span>
            <button onclick="showAllVideos('${category}')">All <i class="fas fa-chevron-right"></i></button>
        `;
        // Make the entire title clickable
        categoryTitle.onclick = () => showAllVideos(category);
        const categoryScroll = document.createElement('div');
        categoryScroll.className = 'category-scroll';
        // Display all videos in the category (no slice limit)
        categoryData.forEach(item => {
            const frame = createFrame(item);
            categoryScroll.appendChild(frame);
        });
        categoryContainer.appendChild(categoryTitle);
        categoryContainer.appendChild(categoryScroll);
        container.appendChild(categoryContainer);
    });
};

// Function to show all videos in grid layout
const showAllVideosGrid = () => {
    // Reset scroll position
    window.scrollTo(0, 0);
    
    // Set flag and push state for grid view
    inGridView = true;
    history.pushState({ gridView: true }, '');
    
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';
    gridContainer.scrollTop = 0; // Reset grid container scroll
    
    // Hide other sections
    document.getElementById('discover-container').style.display = 'none';
    document.getElementById('categories-container').style.display = 'none';
    gridContainer.style.display = 'grid';
    
    // Add all videos to the grid
    data.forEach(item => {
        const frame = createFrame(item);
        gridContainer.appendChild(frame);
    });
};

const showTrendingVideos = () => {
    // Reset scroll position
    window.scrollTo(0, 0);
    
    // Set flag and push state for grid view
    inGridView = true;
    history.pushState({ gridView: true }, '');
    
    const trendingData = data.filter(item => item.trending); // Filter trending videos
    currentGridData = trendingData; // Set current grid data for filtering
    
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';
    gridContainer.scrollTop = 0; // Reset grid container scroll
    
    // Hide other sections
    document.getElementById('discover-container').style.display = 'none';
    document.getElementById('categories-container').style.display = 'none';
    gridContainer.style.display = 'grid';
    
    // Add filter section
    const filterSection = createFilterSection();
    gridContainer.insertBefore(filterSection, gridContainer.firstChild);
    
    // Add trending videos to the grid
    if (trendingData.length > 0) {
        trendingData.forEach(item => {
            const frame = createFrame(item);
            gridContainer.appendChild(frame);
        });
    } else {
        showNotification('No trending movies found.', 'warning');
    }
};

const showProfileSection = () => {
    // Reset scroll position
    window.scrollTo(0, 0);
    
    // Set flag and push state for grid view
    inGridView = true;
    history.pushState({ gridView: true }, '');
    
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';
    gridContainer.scrollTop = 0; // Reset grid container scroll
    
    // Hide other sections
    document.getElementById('discover-container').style.display = 'none';
    document.getElementById('categories-container').style.display = 'none';
    gridContainer.style.display = 'block'; // Use block for list layout
    
    // Create Apps section with count
    const appsSection = document.createElement('div');
    appsSection.className = 'view-section';
    appsSection.innerHTML = `
        <div class="view-section-header">
            <h3 class="view-section-title">Apps Center</h3>
            <span class="view-section-count">${profileApps ? profileApps.length : 0} apps</span>
        </div>
        <div class="view-section-content" id="apps-section-content">
            <!-- Apps will be added here -->
        </div>
    `;
    
    // Create Ads section with count
    const adsSection = document.createElement('div');
    adsSection.className = 'view-section';
    adsSection.innerHTML = `
        <div class="view-section-header">
            <h3 class="view-section-title">Ads Center</h3>
            <span class="view-section-count">${adsData ? adsData.length : 0} ads</span>
        </div>
        <div class="view-section-content" id="ads-section-content">
            <!-- Ads will be added here -->
        </div>
    `;
    
    gridContainer.appendChild(appsSection);
    gridContainer.appendChild(adsSection);
    
    // Add apps to the apps section
    const appsContent = document.getElementById('apps-section-content');
    if (profileApps && profileApps.length > 0) {
        profileApps.forEach(item => {
            const appItem = createProfileItem(item);
            appsContent.appendChild(appItem);
        });
    } else {
        appsContent.innerHTML = '<p>No apps available</p>';
    }
    
    // Add ads to the ads section
    const adsContent = document.getElementById('ads-section-content');
    if (adsData && adsData.length > 0) {
        adsData.forEach(item => {
            const adItem = createProfileAdItem(item);
            adsContent.appendChild(adItem);
        });
    } else {
        adsContent.innerHTML = '<p>No ads available</p>';
    }
};

const showHomeVideos = () => {
    // Reset scroll position
    window.scrollTo(0, 0);
    
    // Set flag and push state for grid view
    inGridView = true;
    history.pushState({ gridView: true }, '');
    
    const homeData = data; // Use the entire data array for home videos
    currentGridData = homeData; // Set current grid data for filtering
    
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';
    gridContainer.scrollTop = 0; // Reset grid container scroll
    
    // Hide other sections
    document.getElementById('discover-container').style.display = 'none';
    document.getElementById('categories-container').style.display = 'none';
    gridContainer.style.display = 'grid';
    
    // Add filter section
    const filterSection = createFilterSection();
    gridContainer.insertBefore(filterSection, gridContainer.firstChild);
    
    // Add home videos to the grid
    if (homeData.length > 0) {
        homeData.forEach(item => {
            const frame = createFrame(item);
            gridContainer.appendChild(frame);
        });
    } else {
        showNotification('No movies found.', 'warning');
    }
};

const showMyList = () => {
    // Reset scroll position
    window.scrollTo(0, 0);
    
    // Set flag and push state for grid view
    inGridView = true;
    history.pushState({ gridView: true }, '');
    
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';
    gridContainer.scrollTop = 0; // Reset grid container scroll
    
    // Hide other sections
    document.getElementById('discover-container').style.display = 'none';
    document.getElementById('categories-container').style.display = 'none';
    gridContainer.style.display = 'block'; // Use block for list layout
    
    // Get saved movies from localStorage
    const savedMoviesData = data.filter(item => savedMovies.includes(item.title));
    
    if (savedMoviesData.length > 0) {
        savedMoviesData.forEach(item => {
            const listItem = createUnlockedListItem(item);
            gridContainer.appendChild(listItem);
        });
    } else {
        showNotification('No saved movies found. Save some movies to see them here.', 'warning');
    }
};

// Function to show the Discover section with carousel
const showDiscoverSection = () => {
    // Reset scroll position
    window.scrollTo(0, 0);
    
    // Set flag and push state for discover view
    inGridView = false;
    history.pushState({ gridView: false, discoverView: true }, '');
    
    // Show discover and categories containers
    document.getElementById('discover-container').style.display = 'block';
    document.getElementById('categories-container').style.display = 'block';
    
    // Hide grid container
    document.getElementById('grid-container').style.display = 'none';
};

// Function to create filter section
const createFilterSection = () => {
    const filterSection = document.createElement('div');
    filterSection.className = 'filter-section';
    
    // Get unique genres, countries, and years from currentGridData
    const genres = [...new Set(currentGridData.map(item => item.genre).filter(Boolean))];
    const countries = [...new Set(currentGridData.map(item => item.country).filter(Boolean))];
    const years = [...new Set(currentGridData.map(item => item.year).filter(Boolean))].sort((a, b) => b - a);
    
    // Create genre dropdown
    const genreDropdown = document.createElement('select');
    genreDropdown.className = 'filter-dropdown';
    genreDropdown.id = 'genre-filter';
    
    const genreDefault = document.createElement('option');
    genreDefault.value = '';
    genreDefault.textContent = 'All Genres';
    genreDropdown.appendChild(genreDefault);
    
    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        genreDropdown.appendChild(option);
    });
    
    // Create country dropdown
    const countryDropdown = document.createElement('select');
    countryDropdown.className = 'filter-dropdown';
    countryDropdown.id = 'country-filter';
    
    const countryDefault = document.createElement('option');
    countryDefault.value = '';
    countryDefault.textContent = 'All Countries';
    countryDropdown.appendChild(countryDefault);
    
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countryDropdown.appendChild(option);
    });
    
    // Create year dropdown
    const yearDropdown = document.createElement('select');
    yearDropdown.className = 'filter-dropdown';
    yearDropdown.id = 'year-filter';
    
    const yearDefault = document.createElement('option');
    yearDefault.value = '';
    yearDefault.textContent = 'All Years';
    yearDropdown.appendChild(yearDefault);
    
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearDropdown.appendChild(option);
    });
    
    // Create filter button
    const filterButton = document.createElement('button');
    filterButton.className = 'filter-button';
    filterButton.innerHTML = '<i class="fas fa-filter"></i> Apply';
    filterButton.onclick = applyGridFilters;
    
    // Add elements to filter section
    filterSection.appendChild(genreDropdown);
    filterSection.appendChild(countryDropdown);
    filterSection.appendChild(yearDropdown);
    filterSection.appendChild(filterButton);
    
    return filterSection;
};

// Function to apply grid filters
const applyGridFilters = () => {
    const genreValue = document.getElementById('genre-filter').value;
    const countryValue = document.getElementById('country-filter').value;
    const yearValue = document.getElementById('year-filter').value;
    
    let filteredData = currentGridData;
    
    if (genreValue) {
        filteredData = filteredData.filter(item => item.genre === genreValue);
    }
    
    if (countryValue) {
        filteredData = filteredData.filter(item => item.country === countryValue);
    }
    
    if (yearValue) {
        filteredData = filteredData.filter(item => item.year == yearValue);
    }
    
    // Update the grid with filtered data
    const gridContainer = document.getElementById('grid-container');
    
    // Remove existing frames but keep the filter section
    const filterSection = gridContainer.querySelector('.filter-section');
    gridContainer.innerHTML = '';
    if (filterSection) {
        gridContainer.appendChild(filterSection);
    }
    
    if (filteredData.length > 0) {
        filteredData.forEach(item => {
            const frame = createFrame(item);
            gridContainer.appendChild(frame);
        });
    } else {
        showNotification('No movies found with the selected filters.', 'warning');
    }
};

const createProfileItem = (item) => {
    const profileItem = document.createElement('div');
    profileItem.className = 'profile-item';
    profileItem.style.display = 'flex';
    profileItem.style.alignItems = 'center';
    profileItem.style.gap = '10px';
    profileItem.style.padding = '10px';
    profileItem.style.borderBottom = '1px solid #333';
    
    const icon = document.createElement('img');
    icon.src = item.icon || 'https://picsum.photos/seed/app/50/50.jpg';
    icon.alt = item.name;
    icon.style.width = '50px';
    icon.style.height = '50px';
    icon.style.borderRadius = '8px';
    
    const content = document.createElement('div');
    content.style.flex = '1';
    
    const name = document.createElement('h4');
    name.textContent = item.name;
    name.style.margin = '0';
    name.style.fontSize = '13px';
    name.style.color = '#ccc';
    
    const description = document.createElement('p');
    description.textContent = item.description;
    description.style.margin = '0';
    description.style.fontSize = '10px';
    description.style.color = '#888';
    
    const openButton = document.createElement('button');
    openButton.textContent = 'Install';
    openButton.style.backgroundColor = '#00b300';
    openButton.style.color = '#fff';
    openButton.style.border = 'none';
    openButton.style.padding = '6px 12px';
    openButton.style.borderRadius = '5px';
    openButton.style.cursor = 'pointer';
    openButton.style.fontSize = '14px';
    
    openButton.onclick = async () => {
        try {
            // Get the app document
            const appRef = db.collection('apps').doc(item.id);
            const appDoc = await appRef.get();
            
            if (appDoc.exists) {
                // Get current view count
                const currentViews = appDoc.data().views || 0;
                const newViews = currentViews + 1;
                
                // Update view count in Firestore
                await appRef.update({ views: newViews });
                
                // Update button text to show view count
                openButton.textContent = `${newViews} views`;
                
                // Update local data
                item.views = newViews;
            } else {
                // If document doesn't exist, create it with view count
                await appRef.set({ 
                    views: 1,
                    ...item 
                });
                openButton.textContent = '1 views';
                item.views = 1;
            }
            
            // Open the app link
            window.open(item.link, '_blank');
        } catch (error) {
            console.error('Error updating app view count:', error);
            showNotification('Error updating view count', 'error');
            
            // Still open the link even if there's an error
            window.open(item.link, '_blank');
        }
    };
    
    content.appendChild(name);
    content.appendChild(description);
    profileItem.appendChild(icon);
    profileItem.appendChild(content);
    profileItem.appendChild(openButton);
    
    return profileItem;
};

const createProfileAdItem = (item) => {
    const profileItem = document.createElement('div');
    profileItem.className = 'profile-item';
    profileItem.style.display = 'flex';
    profileItem.style.alignItems = 'center';
    profileItem.style.gap = '10px';
    profileItem.style.padding = '10px';
    profileItem.style.borderBottom = '1px solid #333';
    
    const icon = document.createElement('img');
    icon.src = item.image || 'https://picsum.photos/seed/ad/50/50.jpg';
    icon.alt = item.title;
    icon.style.width = '50px';
    icon.style.height = '50px';
    icon.style.borderRadius = '8px';
    
    const content = document.createElement('div');
    content.style.flex = '1';
    
    const name = document.createElement('h4');
    name.textContent = item.title;
    name.style.margin = '0';
    name.style.fontSize = '13px';
    name.style.color = '#ccc';
    
    const description = document.createElement('p');
    description.textContent = item.description;
    description.style.margin = '0';
    description.style.fontSize = '10px';
    description.style.color = '#888';
    
    const openButton = document.createElement('button');
    openButton.textContent = 'Install';
    openButton.style.backgroundColor = '#00b300';
    openButton.style.color = '#fff';
    openButton.style.border = 'none';
    openButton.style.padding = '6px 12px';
    openButton.style.borderRadius = '5px';
    openButton.style.cursor = 'pointer';
    openButton.style.fontSize = '14px';
    
    openButton.onclick = async () => {
        try {
            // Get the ad document
            const adRef = db.collection('ads').doc(item.id);
            const adDoc = await adRef.get();
            
            if (adDoc.exists) {
                // Get current view count
                const currentViews = adDoc.data().views || 0;
                const newViews = currentViews + 1;
                
                // Update view count in Firestore
                await adRef.update({ views: newViews });
                
                // Update button text to show view count
                openButton.textContent = `${newViews} views`;
                
                // Update local data
                item.views = newViews;
            } else {
                // If document doesn't exist, create it with view count
                await adRef.set({ 
                    views: 1,
                    ...item 
                });
                openButton.textContent = '1 views';
                item.views = 1;
            }
            
            // Open the ad link
            window.open(item.link, '_blank');
        } catch (error) {
            console.error('Error updating ad view count:', error);
            showNotification('Error updating view count', 'error');
            
            // Still open the link even if there's an error
            window.open(item.link, '_blank');
        }
    };
    
    content.appendChild(name);
    content.appendChild(description);
    profileItem.appendChild(icon);
    profileItem.appendChild(content);
    profileItem.appendChild(openButton);
    
    return profileItem;
};

const createFrame = (item) => {
    const frame = document.createElement('div');
    frame.className = 'frame';
    const img = document.createElement('img');
    img.src = item.imgUrl; // Use movie cover for frame
    img.alt = item.title;
    const content = document.createElement('div');
    content.className = 'content';
    const title = document.createElement('h2');
    title.textContent = item.title;
    
    // Add click event to the entire frame
    frame.onclick = () => openVideoNav(item.videoUrl, item.title, item);
    
    content.appendChild(title);
    frame.appendChild(img);
    frame.appendChild(content);
    return frame;
};

const createUnlockedListItem = (item) => {
    const listItem = document.createElement('div');
    listItem.className = 'unlocked-item';
    listItem.style.display = 'flex';
    listItem.style.alignItems = 'center';
    listItem.style.gap = '10px';
    listItem.style.padding = '10px';
    listItem.style.borderBottom = '1px solid #333';
    listItem.style.cursor = 'pointer';
    
    const img = document.createElement('img');
    img.src = item.imgUrl; // Use movie cover for list item
    img.alt = item.title;
    img.style.width = '80px';
    img.style.height = '115px';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '5px';
    
    const content = document.createElement('div');
    content.style.flex = '1';
    
    const title = document.createElement('h4');
    title.textContent = item.title;
    title.style.margin = '0';
    title.style.fontSize = '14px';
    title.style.color = '#ccc';
    
    const description = document.createElement('p');
    description.textContent = item.description;
    description.style.margin = '0';
    description.style.fontSize = '12px';
    description.style.color = '#777';
    
    // Add click event to the entire list item
    listItem.onclick = () => openVideoNav(item.videoUrl, item.title, item);
    
    content.appendChild(title);
    content.appendChild(description);
    listItem.appendChild(img);
    listItem.appendChild(content);
    return listItem;
};

// Track current movie in modal
let currentMovieInModal = null;

// Modified checkVideoIdInUrl function to wait for ads data
const checkVideoIdInUrl = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('videoId');
    
    if (videoId) {
        // Show direct link message
        const directLinkMessage = document.getElementById('direct-link-message');
        directLinkMessage.style.display = 'block';
        
        // Set flag that we're opening a direct link
        openingDirectLink = true;
        
        try {
            // Fetch videos from Firestore
            const fetchedVideos = await fetchVideosFromFirestore();
            if (fetchedVideos.length > 0) {
                data = shuffleArray(fetchedVideos);
                
                // Fetch ads from Firestore to ensure they're loaded
                const fetchedAds = await fetchAdsFromFirestore();
                if (fetchedAds.length > 0) {
                    adsData = fetchedAds;
                    updateAdDisplay();
                }
                
                // Find the video with the matching ID
                const video = data.find(item => item.id == videoId);
                if (video) {
                    // Hide the direct link message after a short delay
                    setTimeout(() => {
                        directLinkMessage.style.display = 'none';
                    }, 2000);
                    
                    // Open video modal immediately without delay
                    openVideoNav(video.videoUrl, video.title, video);
                } else {
                    // Video not found
                    directLinkMessage.textContent = 'Video not found. Redirecting to home page...';
                    setTimeout(() => {
                        directLinkMessage.style.display = 'none';
                        showDiscoverSection();
                    }, 3000);
                }
            } else {
                // No videos available
                directLinkMessage.textContent = 'No videos available. Please check back later.';
                setTimeout(() => {
                    directLinkMessage.style.display = 'none';
                }, 3000);
            }
        } catch (error) {
            console.error("Error fetching videos for direct link:", error);
            directLinkMessage.textContent = 'Error loading video. Please try again later.';
            setTimeout(() => {
                directLinkMessage.style.display = 'none';
            }, 3000);
        }
    }
};

// Modified openVideoNav function to ensure ads are displayed
const openVideoNav = async (videoUrl, videoId, item) => {
    // Check network connection before opening video
    if (!navigator.onLine) {
        showNetworkWarning();
        return;
    }
    
    // Validate video URL
    if (!isValidVideoUrl(videoUrl)) {
        showNotification('Invalid video URL', 'warning');
        return;
    }
    
    // Display the video navigation modal
    document.getElementById('video-nav').style.display = 'flex';
    
    // Check if the iframe exists, if not create it
    const navBody = document.querySelector('.nav-body');
    const iframeContainer = navBody.querySelector('div[style*="position: relative"]');
    let videoPlayer = document.getElementById('video-player');
    
    if (!videoPlayer) {
        // Create a new iframe
        videoPlayer = document.createElement('iframe');
        videoPlayer.id = 'video-player';
        videoPlayer.setAttribute('frameborder', '0');
        videoPlayer.setAttribute('allowfullscreen', '');
        videoPlayer.style.width = '100%';
        videoPlayer.style.height = '100%';
        iframeContainer.appendChild(videoPlayer);
    }
    
    // Process the video URL based on its source
    let processedUrl = videoUrl;
    
    // Check if it's a YouTube embed URL
    if (videoUrl.includes('youtube.com/embed/')) {
        // Add autoplay=1 parameter for YouTube to autoplay with sound
        const separator = videoUrl.includes('?') ? '&' : '?';
        processedUrl = videoUrl + separator + 'autoplay=1&mute=0';
    } 
    // For Google Drive preview, ensure no autoplay parameters
    else if (videoUrl.includes('drive.google.com/file/d/')) {
        // Google Drive preview doesn't autoplay by default, so no changes needed
        processedUrl = videoUrl;
    }
    
    // Set the processed video URL in the iframe
    videoPlayer.src = processedUrl;
    
    // Track current movie
    currentMovieInModal = item;
    
    // Update save button state
    updateSaveButton();
    
    // Show/hide download button based on video source
    const downloadBtn = document.getElementById('video-download-btn');
    if (videoUrl.includes('drive.google.com') && item.downloadUrl) {
        // Show download button for Google Drive videos with download URL
        downloadBtn.style.display = 'flex';
        downloadBtn.onclick = () => downloadVideo(item.downloadUrl);
    } else {
        // Hide download button for YouTube videos or Google Drive videos without download URL
        downloadBtn.style.display = 'none';
    }
    
    // Ensure ads data is available before initializing ad rotation
    if (!adsData || adsData.length === 0) {
        try {
            const fetchedAds = await fetchAdsFromFirestore();
            if (fetchedAds.length > 0) {
                adsData = fetchedAds;
                updateAdDisplay();
            }
        } catch (error) {
            console.error('Error fetching ads for video modal:', error);
        }
    }
    
    // Initialize video ad rotation
    initVideoAdRotation();
    
    // Update view count
    if (item && item.id) {
        try {
            // Get the video document
            const videoRef = db.collection('videos').doc(item.id);
            const videoDoc = await videoRef.get();
            
            if (videoDoc.exists) {
                // Get current view count
                const currentViews = videoDoc.data().views || 0;
                const newViews = currentViews + 1;
                
                // Update view count in Firestore
                await videoRef.update({ views: newViews });
                
                // Update view count display
                document.getElementById('view-count').textContent = `${newViews} views`;
                
                // Update local data
                item.views = newViews;
            } else {
                // If document doesn't exist, create it with view count
                await videoRef.set({ 
                    views: 1,
                    ...item 
                });
                document.getElementById('view-count').textContent = '1 views';
                item.views = 1;
            }
        } catch (error) {
            console.error('Error updating view count:', error);
            document.getElementById('view-count').textContent = 'Error loading views';
        }
    } else {
        document.getElementById('view-count').textContent = '0 views';
    }
    
    // Only push state if we're not already in the modal
    if (!inVideoModal) {
        history.pushState({ videoOpen: true }, '');
        inVideoModal = true;
    }
    
    // Check if this is a series with episodes
    const episodeFooter = document.getElementById('episode-footer');
    if (item && item.isSeries && item.seasons) {
        // Show episode footer
        episodeFooter.style.display = 'block';
        
        // Set current season index (if not set, default to 0)
        if (typeof item.currentSeason === 'undefined') {
            item.currentSeason = 0;
        }
        
        // Update episode title to include season
        document.getElementById('episode-title').textContent = `${item.title} - Season ${item.seasons[item.currentSeason].seasonNumber}`;
        
        // Update episode count for the current season
        document.getElementById('episode-count').textContent = `${item.seasons[item.currentSeason].episodes.length} Episodes`;
        
        // Clear existing episodes
        const episodeScroller = document.getElementById('episode-scroller');
        episodeScroller.innerHTML = '';
        
        // Add Previous Season button if not the first season
        if (item.currentSeason > 0) {
            const prevSeasonBtn = document.createElement('div');
            prevSeasonBtn.className = 'season-nav-btn prev-season';
            prevSeasonBtn.innerHTML = `
                <span class="season-nav-text">Prev</span>
                <span class="season-number">S${item.seasons[item.currentSeason - 1].seasonNumber}</span>
            `;
            
            prevSeasonBtn.onclick = () => {
                goToSeason(item.currentSeason - 1);
            };
            
            episodeScroller.appendChild(prevSeasonBtn);
        }
        
        // Add episode buttons for the current season
        item.seasons[item.currentSeason].episodes.forEach((episode, index) => {
            const episodeBtn = document.createElement('div');
            episodeBtn.className = 'episode-btn';
            if (index === 0) episodeBtn.classList.add('active');
            
            const epNum = document.createElement('div');
            epNum.className = 'ep-num';
            epNum.textContent = `EP`;
            
            const epNumber = document.createElement('div');
            epNumber.textContent = episode.number;
            
            episodeBtn.appendChild(epNum);
            episodeBtn.appendChild(epNumber);
            
            // Add click event
            episodeBtn.onclick = () => {
                // Set flag to indicate we're navigating episodes
                isEpisodeNavigation = true;
                
                // Remove active class from all buttons
                document.querySelectorAll('.episode-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Add active class to clicked button
                episodeBtn.classList.add('active');
                
                // Process episode URL if it's a YouTube video
                let episodeUrl = episode.url;
                if (episodeUrl.includes('youtube.com/embed/')) {
                    const separator = episodeUrl.includes('?') ? '&' : '?';
                    episodeUrl = episodeUrl + separator + 'autoplay=1&mute=0';
                }
                
                // Load episode in iframe
                videoPlayer.src = episodeUrl;
                
                // Reset flag after a short delay
                setTimeout(() => {
                    isEpisodeNavigation = false;
                }, 100);
            };
            
            episodeScroller.appendChild(episodeBtn);
        });
        
        // Add Next Season button if not the last season
        if (item.currentSeason < item.seasons.length - 1) {
            const nextSeasonBtn = document.createElement('div');
            nextSeasonBtn.className = 'season-nav-btn next-season';
            nextSeasonBtn.innerHTML = `
                <span class="season-nav-text">Next</span>
                <span class="season-number">S${item.seasons[item.currentSeason + 1].seasonNumber}</span>
            `;
            
            nextSeasonBtn.onclick = () => {
                goToSeason(item.currentSeason + 1);
            };
            
            episodeScroller.appendChild(nextSeasonBtn);
        }
    } else {
        // Hide episode footer for non-series content
        episodeFooter.style.display = 'none';
    }
    
    // Add the video to the history
    addToHistory(videoId);
};

// Function to download video
const downloadVideo = (downloadUrl) => {
    if (!downloadUrl) {
        showNotification('Download URL not available', 'warning');
        return;
    }
    
    // Open the download URL in a new tab
    window.open(downloadUrl, '_blank');
    
    // Show notification
    showNotification('Download started', 'success');
};

// Function to go to a specific season
const goToSeason = (seasonIndex) => {
    if (!currentMovieInModal || !currentMovieInModal.isSeries || !currentMovieInModal.seasons) return;
    
    // Set flag to indicate we're navigating episodes
    isEpisodeNavigation = true;
    
    // Update current season
    currentMovieInModal.currentSeason = seasonIndex;
    
    // Update the episode scroller for the new season
    const currentSeason = currentMovieInModal.seasons[seasonIndex];
    document.getElementById('episode-title').textContent = `${currentMovieInModal.title} - Season ${currentSeason.seasonNumber}`;
    document.getElementById('episode-count').textContent = `${currentSeason.episodes.length} Episodes`;
    
    // Clear and repopulate episode scroller
    const episodeScroller = document.getElementById('episode-scroller');
    episodeScroller.innerHTML = '';
    
    // Add Previous Season button if not the first season
    if (seasonIndex > 0) {
        const prevSeasonBtn = document.createElement('div');
        prevSeasonBtn.className = 'season-nav-btn prev-season';
        prevSeasonBtn.innerHTML = `
            <span class="season-nav-text">PREV</span>
            <span class="season-number">S${currentMovieInModal.seasons[seasonIndex - 1].seasonNumber}</span>
        `;
        
        prevSeasonBtn.onclick = () => {
            goToSeason(seasonIndex - 1);
        };
        
        episodeScroller.appendChild(prevSeasonBtn);
    }
    
    // Add episode buttons for the current season
    currentSeason.episodes.forEach((episode, index) => {
        const episodeBtn = document.createElement('div');
        episodeBtn.className = 'episode-btn';
        if (index === 0) episodeBtn.classList.add('active');
        
        const epNum = document.createElement('div');
        epNum.className = 'ep-num';
        epNum.textContent = `EP`;
        
        const epNumber = document.createElement('div');
        epNumber.textContent = episode.number;
        
        episodeBtn.appendChild(epNum);
        episodeBtn.appendChild(epNumber);
        
        episodeBtn.onclick = () => {
            // Set flag to indicate we're navigating episodes
            isEpisodeNavigation = true;
            
            document.querySelectorAll('.episode-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            episodeBtn.classList.add('active');
            
            // Process episode URL if it's a YouTube video
            let episodeUrl = episode.url;
            if (episodeUrl.includes('youtube.com/embed/')) {
                const separator = episodeUrl.includes('?') ? '&' : '?';
                episodeUrl = episodeUrl + separator + 'autoplay=1&mute=0';
            }
            
            document.getElementById('video-player').src = episodeUrl;
            
            // Reset flag after a short delay
            setTimeout(() => {
                isEpisodeNavigation = false;
            }, 100);
        };
        
        episodeScroller.appendChild(episodeBtn);
    });
    
    // Add Next Season button if not the last season
    if (seasonIndex < currentMovieInModal.seasons.length - 1) {
        const nextSeasonBtn = document.createElement('div');
        nextSeasonBtn.className = 'season-nav-btn next-season';
        nextSeasonBtn.innerHTML = `
            <span class="season-nav-text">NEXT</span>
            <span class="season-number">S${currentMovieInModal.seasons[seasonIndex + 1].seasonNumber}</span>
        `;
        
        nextSeasonBtn.onclick = () => {
            goToSeason(seasonIndex + 1);
        };
        
        episodeScroller.appendChild(nextSeasonBtn);
    }
    
    // Load the first episode of the new season
    if (currentSeason.episodes.length > 0) {
        let firstEpisodeUrl = currentSeason.episodes[0].url;
        // Process URL if it's a YouTube video
        if (firstEpisodeUrl.includes('youtube.com/embed/')) {
            const separator = firstEpisodeUrl.includes('?') ? '&' : '?';
            firstEpisodeUrl = firstEpisodeUrl + separator + 'autoplay=1&mute=0';
        }
        document.getElementById('video-player').src = firstEpisodeUrl;
    }
    
    // Scroll to the beginning of the episode scroller
    episodeScroller.scrollLeft = 0;
    
    // Reset flag after a short delay
    setTimeout(() => {
        isEpisodeNavigation = false;
    }, 100);
};

// Function to update save button state
const updateSaveButton = () => {
    const saveBtn = document.getElementById('save-btn');
    if (currentMovieInModal && savedMovies.includes(currentMovieInModal.title)) {
        saveBtn.textContent = 'Added';
        saveBtn.style.backgroundColor = '#ff0000';
    } else {
        saveBtn.textContent = 'Add to list';
        saveBtn.style.backgroundColor = '#00b300';
    }
};

// Function to toggle save status
const toggleSaveStatus = () => {
    if (!currentMovieInModal) return;
    
    const movieTitle = currentMovieInModal.title;
    const saveBtn = document.getElementById('save-btn');
    
    if (savedMovies.includes(movieTitle)) {
        // Remove from saved list
        savedMovies = savedMovies.filter(title => title !== movieTitle);
        saveBtn.textContent = 'Add to list';
        saveBtn.style.backgroundColor = '#00b300';
        showNotification('Removed from My List', 'success');
    } else {
        // Add to saved list
        savedMovies.push(movieTitle);
        saveBtn.textContent = 'Added';
        saveBtn.style.backgroundColor = '#ff0000';
        showNotification('Added to My List', 'success');
    }
    
    // Update localStorage
    localStorage.setItem('savedMovies', JSON.stringify(savedMovies));
};

const addToHistory = (videoId) => {
    const history = JSON.parse(localStorage.getItem('videoHistory')) || [];
    const video = data.find(item => item.title === videoId);
    if (video) {
        // Remove duplicate entries
        const filteredHistory = history.filter(item => item.title !== videoId);
        // Add the new entry at the beginning
        filteredHistory.unshift(video);
        // Save the updated history
        localStorage.setItem('videoHistory', JSON.stringify(filteredHistory));
        // Update the history list
        updateHistoryList();
    }
};

const updateHistoryList = () => {
    const history = JSON.parse(localStorage.getItem('videoHistory')) || [];
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    if (history.length === 0) {
        historyList.innerHTML = '<p>No history available.</p>';
        return;
    }
    history.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        const img = document.createElement('img');
        img.src = item.imgUrl;
        img.alt = item.title;
        const content = document.createElement('div');
        content.className = 'content';
        content.innerHTML = `
            <h4>${item.title}</h4>
            <p>${item.description}</p>
        `;
        
        // Add click event to the entire history item that closes the history modal
        historyItem.onclick = () => {
            // Close the history modal first
            toggleHistoryModal();
            // Then open the video
            openVideoNav(item.videoUrl, item.title, item);
        };
        
        historyItem.appendChild(img);
        historyItem.appendChild(content);
        historyList.appendChild(historyItem);
    });
};

const clearHistory = () => {
    localStorage.removeItem('videoHistory');
    updateHistoryList();
    showNotification('All history has been cleared.', 'success');
};

const showAllVideos = (category) => {
    // Reset scroll position
    window.scrollTo(0, 0);
    
    // Set flag and push state for grid view
    inGridView = true;
    history.pushState({ gridView: true }, '');
    
    const categoryData = data.filter(item => item.category === category);
    currentGridData = categoryData; // Set current grid data for filtering
    
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';
    gridContainer.scrollTop = 0; // Reset grid container scroll
    
    // Hide other sections
    document.getElementById('discover-container').style.display = 'none';
    document.getElementById('categories-container').style.display = 'none';
    gridContainer.style.display = 'grid';
    
    // Add filter section
    const filterSection = createFilterSection();
    gridContainer.insertBefore(filterSection, gridContainer.firstChild);
    
    // Add videos to the grid
    categoryData.forEach(item => {
        const frame = createFrame(item);
        gridContainer.appendChild(frame);
    });
};

// Enhanced search function to search by title, genre, tags, and keywords
const handleSearch = () => {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    currentSearchTerm = searchTerm;
    
    // Clear any existing timeout
    clearTimeout(searchTimeout);
    
    // Set a new timeout to delay the search
    searchTimeout = setTimeout(() => {
        // Reset scroll position
        window.scrollTo(0, 0);
        
        // Set flag and push state for grid view
        inGridView = true;
        history.pushState({ gridView: true }, '');
        
        // Filter data based on search term across multiple fields
        const filteredData = data.filter(item => {
            // Search in title
            if (item.title && item.title.toLowerCase().includes(searchTerm)) {
                return true;
            }
            
            // Search in genre
            if (item.genre && item.genre.toLowerCase().includes(searchTerm)) {
                return true;
            }
            
            // Search in tags
            if (item.tags && Array.isArray(item.tags)) {
                for (const tag of item.tags) {
                    if (tag.toLowerCase().includes(searchTerm)) {
                        return true;
                    }
                }
            }
            
            // Search in description (keywords)
            if (item.description && item.description.toLowerCase().includes(searchTerm)) {
                return true;
            }
            
            // Search in category
            if (item.category && item.category.toLowerCase().includes(searchTerm)) {
                return true;
            }
            
            // Search in year
            if (item.year && item.year.toString().includes(searchTerm)) {
                return true;
            }
            
            // Search in type (Movie, Series, etc.)
            if (item.type && item.type.toLowerCase().includes(searchTerm)) {
                return true;
            }
            
            return false;
        });
        
        currentGridData = filteredData; // Set current grid data for filtering
        
        const gridContainer = document.getElementById('grid-container');
        gridContainer.innerHTML = '';
        gridContainer.scrollTop = 0; // Reset grid container scroll
        
        // Hide other sections
        document.getElementById('discover-container').style.display = 'none';
        document.getElementById('categories-container').style.display = 'none';
        gridContainer.style.display = 'grid';
        
        // Add filter section
        const filterSection = createFilterSection();
        gridContainer.insertBefore(filterSection, gridContainer.firstChild);
        
        // Add search results to the grid
        if (filteredData.length > 0) {
            filteredData.forEach(item => {
                const frame = createFrame(item);
                gridContainer.appendChild(frame);
            });
        } else {
            showNotification('No movies found matching your search.', 'warning');
        }
    }, 300); // 300ms delay for better performance
};

// Function to show search suggestions
const showSearchSuggestions = () => {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const suggestionsContainer = document.getElementById('search-suggestions');
    
    if (searchTerm.length < 2) {
        suggestionsContainer.innerHTML = '';
        suggestionsContainer.classList.remove('show');
        return;
    }
    
    // Get unique suggestions from various fields
    const suggestions = new Set();
    
    data.forEach(item => {
        // Title suggestions
        if (item.title && item.title.toLowerCase().includes(searchTerm)) {
            suggestions.add({
                text: item.title,
                type: 'Title',
                item: item
            });
        }
        
        // Genre suggestions
        if (item.genre && item.genre.toLowerCase().includes(searchTerm)) {
            suggestions.add({
                text: item.genre,
                type: 'Genre',
                item: item
            });
        }
        
        // Tag suggestions
        if (item.tags && Array.isArray(item.tags)) {
            item.tags.forEach(tag => {
                if (tag.toLowerCase().includes(searchTerm)) {
                    suggestions.add({
                        text: tag,
                        type: 'Tag',
                        item: item
                    });
                }
            });
        }
        
        // Category suggestions
        if (item.category && item.category.toLowerCase().includes(searchTerm)) {
            suggestions.add({
                text: item.category,
                type: 'Category',
                item: item
            });
        }
    });
    
    // Convert to array and limit to 5 suggestions
    const suggestionsArray = Array.from(suggestions).slice(0, 5);
    
    // Clear and populate suggestions container
    suggestionsContainer.innerHTML = '';
    
    if (suggestionsArray.length > 0) {
        suggestionsArray.forEach(suggestion => {
            const suggestionItem = document.createElement('div');
            suggestionItem.className = 'search-suggestion-item';
            suggestionItem.innerHTML = `
                ${suggestion.text}
                <span class="suggestion-type">${suggestion.type}</span>
            `;
            
            suggestionItem.onclick = () => {
                document.getElementById('search-bar').value = suggestion.text;
                handleSearch();
                suggestionsContainer.classList.remove('show');
            };
            
            suggestionsContainer.appendChild(suggestionItem);
        });
        
        suggestionsContainer.classList.add('show');
    } else {
        suggestionsContainer.classList.remove('show');
    }
};

// Function to hide search suggestions with delay
const hideSearchSuggestions = () => {
    setTimeout(() => {
        document.getElementById('search-suggestions').classList.remove('show');
    }, 200);
};

// Improved notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Position fixed at top center
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.zIndex = '10000';
    notification.style.padding = '15px 25px';
    notification.style.borderRadius = '8px';
    notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    
    // Style based on type
    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#4CAF50';
            notification.style.color = 'white';
            break;
        case 'warning':
            notification.style.backgroundColor = '#FF9800';
            notification.style.color = 'white';
            break;
        case 'error':
            notification.style.backgroundColor = '#F44336';
            notification.style.color = 'white';
            break;
        default:
            notification.style.backgroundColor = '#2196F3';
            notification.style.color = 'white';
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// New functions for added features

// Apply filters
const applyFilters = () => {
    // Reset scroll position
    window.scrollTo(0, 0);
    
    // Set flag and push state for grid view
    inGridView = true;
    history.pushState({ gridView: true }, '');
    
    // Get selected filters
    const selectedGenre = document.querySelector('.filter-option[data-genre].active')?.dataset.genre || 'All';
    const selectedSort = document.querySelector('.filter-option[data-sort].active')?.dataset.sort || 'Newest';
    
    // Apply filters to data
    let filteredData = data;
    
    if (selectedGenre !== 'All') {
        filteredData = filteredData.filter(item => item.genre === selectedGenre);
    }
    
    // Sort data
    if (selectedSort === 'Newest') {
        filteredData.sort((a, b) => b.id - a.id);
    } else if (selectedSort === 'Popular') {
        filteredData.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (selectedSort === 'Rating') {
        filteredData.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (selectedSort === 'A-Z') {
        filteredData.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    // Update UI with filtered data
    const gridContainer = document.getElementById('grid-container');
    
    // Remove existing frames but keep the filter section
    const filterSection = gridContainer.querySelector('.filter-section');
    gridContainer.innerHTML = '';
    if (filterSection) {
        gridContainer.appendChild(filterSection);
    }
    
    filteredData.forEach(item => {
        const frame = createFrame(item);
        gridContainer.appendChild(frame);
    });
    
    // Close filter modal
    toggleFilterModal();
};

// Share movie function
const shareMovie = () => {
    // Create a URL with video ID parameter
    const url = new URL(window.location.href);
    url.searchParams.set('videoId', currentMovieInModal.id);
    const shareUrl = url.toString();
    
    if (navigator.share) {
        navigator.share({
            title: currentMovieInModal.title,
            text: 'Check out this movie on Movie Nest!',
            url: shareUrl
        })
        .then(() => console.log('Shared successfully'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
        // Fallback - copy to clipboard
        const dummy = document.createElement('input');
        document.body.appendChild(dummy);
        dummy.value = shareUrl;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        showNotification('Link copied to clipboard!', 'success');
    }
};

// Open Edit Profile Modal
const openEditProfileModal = () => {
    const editProfileModal = document.getElementById('edit-profile-modal');
    editProfileModal.classList.add('open');
    
    // Set current user name in input
    document.getElementById('user-name-input').value = userProfile.name;
    
    // Set selected avatar
    document.querySelectorAll('.avatar-option').forEach(option => {
        option.classList.remove('selected');
        if (option.dataset.avatar === userProfile.avatar) {
            option.classList.add('selected');
        }
    });
};

// Close Edit Profile Modal
const closeEditProfileModal = () => {
    const editProfileModal = document.getElementById('edit-profile-modal');
    editProfileModal.classList.remove('open');
};

// Save Profile
const saveProfile = () => {
    // Get selected avatar
    const selectedAvatar = document.querySelector('.avatar-option.selected');
    if (selectedAvatar) {
        userProfile.avatar = selectedAvatar.dataset.avatar;
    }
    
    // Get user name
    const userName = document.getElementById('user-name-input').value;
    if (userName.trim() !== '') {
        userProfile.name = userName.trim();
    }
    
    // Save to localStorage
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    
    // Update UI
    updateUserProfile();
    
    // Close modal
    closeEditProfileModal();
    
    // Show notification
    showNotification('Profile updated successfully!', 'success');
};

// Update User Profile UI
const updateUserProfile = () => {
    // Update user name
    document.getElementById('user-name').textContent = userProfile.name;
    
    // Update user avatar
    const userAvatar = document.getElementById('user-avatar');
    userAvatar.innerHTML = '';
    
    if (userProfile.avatar) {
        const avatarImg = document.createElement('img');
        avatarImg.src = getAvatarUrl(userProfile.avatar);
        avatarImg.alt = 'User Avatar';
        userAvatar.appendChild(avatarImg);
    } else {
        const defaultIcon = document.createElement('i');
        defaultIcon.className = 'fas fa-user';
        defaultIcon.style.fontSize = '36px';
        userAvatar.appendChild(defaultIcon);
    }
};

// Get Avatar URL by ID
const getAvatarUrl = (avatarId) => {
    const avatars = {
        '1': 'https://cdn-icons-png.flaticon.com/128/6997/6997666.png',
        '2': 'https://cdn-icons-png.flaticon.com/128/6997/6997662.png',
        '3': 'https://cdn-icons-png.flaticon.com/128/6997/6997661.png',
        '4': 'https://cdn-icons-png.flaticon.com/128/6997/6997664.png'
    };
    return avatars[avatarId] || avatars['1'];
};

// Network connection warning functions - Updated to match image
const showNetworkWarning = () => {
    const networkWarning = document.getElementById('network-warning');
    networkWarning.classList.remove('hidden');
    
    // Hide app content when network warning is shown
    document.querySelector('header').style.display = 'none';
    document.getElementById('discover-container').style.display = 'none';
    document.getElementById('categories-container').style.display = 'none';
    document.getElementById('grid-container').style.display = 'none';
    document.querySelector('footer').style.display = 'none';
};

const hideNetworkWarning = () => {
    const networkWarning = document.getElementById('network-warning');
    networkWarning.classList.add('hidden');
    
    // Restore app content when network warning is hidden
    document.querySelector('header').style.display = 'flex';
    
    // Restore the appropriate section based on current state
    if (inGridView) {
        document.getElementById('grid-container').style.display = 'grid';
    } else {
        document.getElementById('discover-container').style.display = 'block';
        document.getElementById('categories-container').style.display = 'block';
    }
    
    document.querySelector('footer').style.display = 'flex';
};

// Check network connection status
const checkNetworkConnection = () => {
    if (navigator.onLine) {
        hideNetworkWarning();
        showNotification('Network connection restored', 'success');
        // Attempt to reload data
        initializeApp();
    } else {
        // Still offline, keep showing the warning
        showNetworkWarning();
    }
};

// Ad logic
const adContainer = document.getElementById('adContainer');
const adContent = document.getElementById('adContent');
const installButton = document.getElementById('installButton');
let currentAdIndex = parseInt(localStorage.getItem('currentAdIndex')) || 0;
function showAd(index) {
    if (!adsData || !Array.isArray(adsData) || adsData.length === 0) {
        console.warn("Ads data not available");
        return;
    }
    
    const app = adsData[index];
    adContent.innerHTML = `
        <div class="app-icon">
            <img src="${app.image}" alt="App Icon" />
        </div>
        <div class="ad-info">
            <div class="app-name">${app.title}</div>
            <div class="ad-meta">
                <span class="sponsored">Sponsored ·</span>
                <span>${app.category} ★ FREE</span>
            </div>
        </div>
    `;
    installButton.href = app.link;
    adContainer.style.display = 'flex';
    localStorage.setItem('currentAdIndex', index);
}
function rotateAds() {
    if (!adsData || !Array.isArray(adsData) || adsData.length === 0) {
        console.warn("Ads data not available, skipping rotation");
        return;
    }
    
    showAd(currentAdIndex);
    currentAdIndex = (currentAdIndex + 1) % adsData.length;
}
// Show first ad immediately and rotate
rotateAds();
setInterval(rotateAds, 15000);

// Initialize all new features when the page loads
window.addEventListener('load', () => {
    // Initialize filter options
    document.querySelectorAll('.filter-option').forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from siblings in the same filter-options container
            const siblings = this.parentElement.querySelectorAll('.filter-option');
            siblings.forEach(sib => sib.classList.remove('active'));
            // Add active class to clicked option
            this.classList.add('active');
        });
    });
    
    // Initialize avatar options
    document.querySelectorAll('.avatar-option').forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            document.querySelectorAll('.avatar-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            // Add selected class to clicked option
            this.classList.add('selected');
        });
    });
    
    // Update user profile UI
    updateUserProfile();
    
    // Check for video ID in URL immediately
    checkVideoIdInUrl();
    
    // Check network connection on load
    checkNetworkConnection();
    
    // Add event listeners for online/offline events
    window.addEventListener('online', () => {
        hideNetworkWarning();
        showNotification('Network connection restored', 'success');
    });
    
    window.addEventListener('offline', () => {
        showNetworkWarning();
    });
    
    // Add event listener to close modal when clicking outside
    document.getElementById('upload-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeUploadModal();
        }
    });
    
    document.getElementById('ad-upload-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeAdUploadModal();
        }
    });
    
    document.getElementById('app-upload-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeAppUploadModal();
        }
    });
    
    document.getElementById('password-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closePasswordModal();
        }
    });
    
    // Add keyboard event to close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && inUploadModal) {
            closeUploadModal();
        }
        if (e.key === 'Escape' && inAdUploadModal) {
            closeAdUploadModal();
        }
        if (e.key === 'Escape' && inAppUploadModal) {
            closeAppUploadModal();
        }
        if (e.key === 'Escape' && inPasswordModal) {
            closePasswordModal();
        }
    });
    
    // Add history state handling with immediate response
    window.addEventListener('popstate', (event) => {
        // If we're navigating episodes, ignore the back button
        if (isEpisodeNavigation) {
            // Push state again to prevent closing the modal
            history.pushState({ videoOpen: true }, '');
            return;
        }
        
        // Handle video modal - close immediately
        if (inVideoModal) {
            closeModal();
            return; // Exit early to prevent any delays
        } 
        // Handle grid view
        else if (inGridView) {
            inGridView = false;
            // Show both discover container and categories container
            document.getElementById('discover-container').style.display = 'block';
            document.getElementById('categories-container').style.display = 'block';
            document.getElementById('grid-container').style.display = 'none';
        }
        // Handle filter modal
        else if (inFilterModal) {
            document.getElementById('filter-modal').classList.remove('open');
            inFilterModal = false;
        }
        // Handle history modal
        else if (inHistoryModal) {
            document.getElementById('history-modal').classList.remove('open');
            inHistoryModal = false;
        }
        // Handle sidebar modal
        else if (inSidebarModal) {
            document.getElementById('sidebar-modal').classList.remove('open');
            inSidebarModal = false;
        }
        // Handle upload modal
        else if (inUploadModal) {
            document.getElementById('upload-modal').classList.remove('open');
            inUploadModal = false;
        }
        // Handle ad upload modal
        else if (inAdUploadModal) {
            document.getElementById('ad-upload-modal').classList.remove('open');
            inAdUploadModal = false;
        }
        // Handle app upload modal
        else if (inAppUploadModal) {
            document.getElementById('app-upload-modal').classList.remove('open');
            inAppUploadModal = false;
        }
        // Handle password modal
        else if (inPasswordModal) {
            document.getElementById('password-modal').classList.remove('open');
            inPasswordModal = false;
        }
        // Handle ads submenu
        else if (inAdsSubmenu) {
            document.getElementById('ads-submenu').classList.remove('open');
            inAdsSubmenu = false;
        }
        // Handle apps submenu
        else if (inAppsSubmenu) {
            document.getElementById('apps-submenu').classList.remove('open');
            inAppsSubmenu = false;
        }
        // Default to discover if no specific state
        else {
            showDiscoverSection();
        }
    });
    
    // Initialize the app
    initializeApp();
    
    // Add category button click handlers
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter content based on selected category
            const selectedCategory = this.dataset.category;
            if (selectedCategory === 'All') {
                // Show all discover videos when "All" category is selected
                createDiscoverSection();
            } else {
                filterContentByCategory(selectedCategory);
            }
        });
    });
});

// Function to initialize ad rotation in the video modal
function initVideoAdRotation() {
    // Ensure ads data is available
    if (!adsData || !Array.isArray(adsData) || adsData.length === 0) {
        console.warn("Ads data not available for video modal, trying to fetch...");
        // Try to fetch ads data if not available
        fetchAdsFromFirestore().then(fetchedAds => {
            if (fetchedAds && fetchedAds.length > 0) {
                adsData = fetchedAds;
                updateAdDisplay();
                // Now initialize ad rotation
                initializeAdRotation();
            }
        }).catch(error => {
            console.error('Error fetching ads for video modal:', error);
        });
        return;
    }
    
    // If ads data is available, initialize ad rotation
    initializeAdRotation();
}

// Helper function to initialize ad rotation
function initializeAdRotation() {
    let currentVideoAdIndex = 0;
    
    function showVideoAd() {
        const ad = adsData[currentVideoAdIndex];
        const adContent = document.getElementById('video-ad-content');
        const installButton = document.getElementById('video-install-button');
        const adContainer = document.getElementById('video-ad-container');
        
        adContent.innerHTML = `
            <div class="app-icon">
                <img src="${ad.image}" alt="App Icon" />
            </div>
            <div class="ad-info">
                <div class="app-name">${ad.title}</div>
                <div class="ad-meta">
                    <span class="sponsored">Sponsored ·</span>
                    <span>${ad.category} ★ FREE</span>
                </div>
            </div>
        `;
        
        // Update install button click handler to track views
        installButton.onclick = async () => {
            try {
                // Get the ad document
                const adRef = db.collection('ads').doc(ad.id);
                const adDoc = await adRef.get();
                
                if (adDoc.exists) {
                    // Get current view count
                    const currentViews = adDoc.data().views || 0;
                    const newViews = currentViews + 1;
                    
                    // Update view count in Firestore
                    await adRef.update({ views: newViews });
                    
                    // Update local data
                    ad.views = newViews;
                    
                    // Open the ad link
                    window.open(ad.link, '_blank');
                } else {
                    // If document doesn't exist, create it with view count
                    await adRef.set({ 
                        views: 1,
                        ...ad 
                    });
                    ad.views = 1;
                    
                    // Open the ad link
                    window.open(ad.link, '_blank');
                }
            } catch (error) {
                console.error('Error updating ad view count:', error);
                showNotification('Error updating view count', 'error');
                
                // Still open the link even if there's an error
                window.open(ad.link, '_blank');
            }
        };
        
        // Ensure the ad container is displayed
        adContainer.style.display = 'flex';
        
        currentVideoAdIndex = (currentVideoAdIndex + 1) % adsData.length;
    }
    
    // Show first ad immediately
    showVideoAd();
    
    // Rotate ads every 15 seconds
    setInterval(showVideoAd, 15000);
}

// Initialize the page
async function initializeApp() {
    try {
        showLoading();
        
        // Fetch videos from Firestore
        const fetchedVideos = await fetchVideosFromFirestore();
        if (fetchedVideos.length > 0) {
            data = shuffleArray(fetchedVideos);
            combinedData = data;
            createCarousel();
            createDiscoverSection();
            createCategories();
            updateHistoryList();
            initCarousel();
        } else {
            showNotification('No videos available. Please check back later.', 'warning');
        }
        
        // Fetch ads from Firestore
        const fetchedAds = await fetchAdsFromFirestore();
        if (fetchedAds.length > 0) {
            adsData = fetchedAds;
            updateAdDisplay();
        }
        
        // Fetch apps from Firestore
        const fetchedApps = await fetchAppsFromFirestore();
        if (fetchedApps.length > 0) {
            profileApps = shuffleArray(fetchedApps);
        }
        
        hideLoading();
    } catch (error) {
        console.error("App initialization failed:", error);
        showNotification("Failed to load content. Please check your connection.", "warning");
        hideLoading();
    }
}

// Add category button click handlers
document.addEventListener('DOMContentLoaded', () => {
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter content based on selected category
            const selectedCategory = this.dataset.category;
            if (selectedCategory === 'All') {
                createDiscoverSection();
            } else {
                filterContentByCategory(selectedCategory);
            }
        });
    });
});

// Function to filter content by category
const filterContentByCategory = (category) => {
    const discoverScroll = document.getElementById('discover-scroll');
    discoverScroll.innerHTML = '';
    
    // Filter data by category
    const filteredData = data.filter(item => {
        // Check if item matches the selected category
        if (category === 'Algaita Dub-Studio') return item.category === 'Algaita Dub-Studio';
        if (category === 'Nollywood') return item.category === 'Nollywood';
        if (category === 'Bollywood') return item.category === 'Bollywood';
        if (category === 'Kannywood') return item.category === 'Kannywood';
        if (category === 'Action') return item.genre === 'Action';
        if (category === 'Drama') return item.genre === 'Drama';
        if (category === 'Comedy') return item.genre === 'Comedy';
        return true;
    });
    
    // Add filtered items to discover section
    filteredData.forEach(item => {
        const discoverItem = document.createElement('div');
        discoverItem.className = 'discover-item';
        const img = document.createElement('img');
        img.src = item.imgUrl;
        img.alt = item.title;
        const content = document.createElement('div');
        content.className = 'content';
        content.innerHTML = `
            <h2>${item.title}</h2>
            <p>${item.description}</p>
        `;
        
        // Add click event to the entire discover item
        discoverItem.onclick = () => openVideoNav(item.videoUrl, item.title, item);
        
        discoverItem.appendChild(img);
        discoverItem.appendChild(content);
        discoverScroll.appendChild(discoverItem);
    });
};

let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const footer = document.querySelector('footer');
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    // Check if user has reached the bottom of the page
    const atPageEnd = (currentScrollTop + windowHeight) >= documentHeight;
    if (atPageEnd && currentScrollTop > lastScrollTop) {
        // Immediately hide footer when at the end of the page and scrolling down
        footer.classList.add('hide');
    } else {
        // Show footer when scrolling down anywhere else or when scrolling up
        footer.classList.remove('hide');
    }
    lastScrollTop = currentScrollTop;
});

// Fixed: Changed timeout value to something more reasonable (40 seconds)
setTimeout(() => {
    const bar = document.getElementById('notification-bar');
    bar.style.opacity = '1';
    bar.style.pointerEvents = 'auto'; // Enable interaction once visible
}, 40000); // Show after 40 seconds

function closeNotification() {
    const bar = document.getElementById('notification-bar');
    bar.style.opacity = '0';
    bar.style.pointerEvents = 'none'; // Disable interaction immediately
    setTimeout(() => {
        bar.remove(); // Fully remove from DOM
    }, 500); // Allow fade-out to complete
}

// Carousel functionality
let currentIndex = 0;
let startX = 0;
let moveX = 0;
let isDragging = false;

function updateCarousel() {
    const carousel = document.getElementById("carousel");
    carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    document.querySelectorAll(".dot").forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex);
    });
}

function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
}

function nextSlide() {
    const carouselData = data.slice(0, 5);
    currentIndex = (currentIndex + 1) % carouselData.length;
    updateCarousel();
}

function prevSlide() {
    const carouselData = data.slice(0, 5);
    currentIndex = (currentIndex - 1 + carouselData.length) % carouselData.length;
    updateCarousel();
}

function handleTouchStart(e) {
    startX = e.touches[0].clientX;
    isDragging = true;
}

function handleTouchMove(e) {
    if (!isDragging) return;
    moveX = e.touches[0].clientX - startX;
}

function handleTouchEnd() {
    isDragging = false;
    if (moveX > 50) {
        prevSlide();
    } else if (moveX < -50) {
        nextSlide();
    }
}

function handleMouseDown(e) {
    startX = e.clientX;
    isDragging = true;
}

function handleMouseMove(e) {
    if (!isDragging) return;
    moveX = e.clientX - startX;
}

function handleMouseUp() {
    isDragging = false;
    if (moveX > 50) {
        prevSlide();
    } else if (moveX < -50) {
        nextSlide();
    }
}

// Initialize carousel event listeners
function initCarousel() {
    const carousel = document.getElementById("carousel");
    carousel.addEventListener("touchstart", handleTouchStart);
    carousel.addEventListener("touchmove", handleTouchMove);
    carousel.addEventListener("touchend", handleTouchEnd);
    carousel.addEventListener("mousedown", handleMouseDown);
    carousel.addEventListener("mousemove", handleMouseMove);
    carousel.addEventListener("mouseup", handleMouseUp);
    carousel.addEventListener("mouseleave", handleMouseUp);
    
    // Auto-slide every 5 seconds
    setInterval(nextSlide, 5000);
}

// Function to close the modal - optimized for immediate closing
const closeModal = () => {
    // Stop the video immediately
    const videoPlayer = document.getElementById('video-player');
    const currentSrc = videoPlayer.src;
    
    // Clear the src to stop playback
    videoPlayer.src = 'about:blank'; // Use about:blank to unload
    
    // For YouTube videos, we need additional handling
    if (currentSrc && currentSrc.includes('youtube.com/embed/')) {
        // Create a temporary iframe to properly unload YouTube content
        const tempIframe = document.createElement('iframe');
        tempIframe.style.display = 'none';
        document.body.appendChild(tempIframe);
        tempIframe.src = 'about:blank';
        setTimeout(() => {
            document.body.removeChild(tempIframe);
        }, 100);
    }
    
    // Hide the modal immediately
    document.getElementById('video-nav').style.display = 'none';
    
    // Hide the ad container
    document.getElementById('video-ad-container').style.display = 'none';
    
    // Reset state immediately
    currentMovieInModal = null;
    inVideoModal = false;
    isEpisodeNavigation = false; // Reset the flag
    
    // Clear any episode/season data
    const episodeFooter = document.getElementById('episode-footer');
    episodeFooter.style.display = 'none';
    
    // Remove the iframe from the DOM to completely stop the video
    const navBody = document.querySelector('.nav-body');
    const iframeContainer = navBody.querySelector('div[style*="position: relative"]');
    if (iframeContainer) {
        const oldIframe = iframeContainer.querySelector('iframe');
        if (oldIframe) {
            oldIframe.remove();
        }
    }
};
// Modified closeNav function for immediate closing
const closeNav = () => {
    if (inVideoModal) {
        // Close modal immediately without any delay
        closeModal();
        
        // Only use history.back() if we actually pushed a state
        if (window.history.state && window.history.state.videoOpen) {
            // Use a small timeout to ensure the modal is fully closed before navigating back
            setTimeout(() => {
                window.history.back();
            }, 10);
        }
    } else {
        closeModal();
    }
};
