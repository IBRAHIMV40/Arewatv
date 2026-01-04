// script.js - Complete JavaScript File

/**
 * CONFIGURATION
 * Set USE_MOCK_BACKEND to false to use real Firebase.
 */
const USE_MOCK_BACKEND = false;

// Payment Configuration
const PAYMENT_CONFIG = {
    paystack: {
        publicKey: 'pk_live_245f1e03b10714f7756f33ee27e36c86d72b2bb3',
        callbackUrl: window.location.origin + '/payment-callback'
    },
    flutterwave: {
        publicKey: 'FLWPUBK-b6a394843a630ed5ffaf386da998c67b-X',
        encryptionKey: 'bd2d842f3148f89507cc5e68'
    }
};

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyARFUQJo32JwHMzPmlgz-1pOOINzkdZTH8",
    authDomain: "arewatv-d151b.firebaseapp.com",
    projectId: "arewatv-d151b",
    storageBucket: "arewatv-d151b.firebasestorage.app",
    messagingSenderId: "1051914778796",
    appId: "1:1051914778796:web:173a5e42dc3dc4da1a0709"
};

// Initialize Firebase
let auth, db;
if (!USE_MOCK_BACKEND && typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
}

// COUNTRY DATA & CURRENCY CONVERSION
const COUNTRIES = [
    // Africa
        { code: 'NG', name: 'Nigeria 🇳🇬', currency: 'NGN', phoneCode: '+234', flutterwave: true, paystack: true },
        { code: 'GH', name: 'Ghana 🇬🇭', currency: 'GHS', phoneCode: '+233', flutterwave: true, paystack: false },
        { code: 'KE', name: 'Kenya 🇰🇪', currency: 'KES', phoneCode: '+254', flutterwave: true, paystack: false },
        { code: 'UG', name: 'Uganda 🇺🇬', currency: 'UGX', phoneCode: '+256', flutterwave: true, paystack: false },
        { code: 'TZ', name: 'Tanzania 🇹🇿', currency: 'TZS', phoneCode: '+255', flutterwave: true, paystack: false },
        { code: 'RW', name: 'Rwanda 🇷🇼', currency: 'RWF', phoneCode: '+250', flutterwave: true, paystack: false },
        { code: 'ZA', name: 'South Africa 🇿🇦', currency: 'ZAR', phoneCode: '+27', flutterwave: true, paystack: false },
        { code: 'ZM', name: 'Zambia 🇿🇲', currency: 'ZMW', phoneCode: '+260', flutterwave: true, paystack: false },
        { code: 'MW', name: 'Malawi 🇲🇼', currency: 'MWK', phoneCode: '+265', flutterwave: true, paystack: false },
        { code: 'EG', name: 'Egypt 🇪🇬', currency: 'EGP', phoneCode: '+20', flutterwave: true, paystack: false },
        { code: 'ET', name: 'Ethiopia 🇪🇹', currency: 'ETB', phoneCode: '+251', flutterwave: true, paystack: false },
        { code: 'SN', name: 'Senegal 🇸🇳', currency: 'XOF', phoneCode: '+221', flutterwave: true, paystack: false },
        { code: 'CI', name: 'Ivory Coast 🇨🇮', currency: 'XOF', phoneCode: '+225', flutterwave: true, paystack: false },
        { code: 'CM', name: 'Cameroon 🇨🇲', currency: 'XAF', phoneCode: '+237', flutterwave: true, paystack: false },
        { code: 'BJ', name: 'Benin 🇧🇯', currency: 'XOF', phoneCode: '+229', flutterwave: true, paystack: false },
        { code: 'TG', name: 'Togo 🇹🇬', currency: 'XOF', phoneCode: '+228', flutterwave: true, paystack: false },
        { code: 'BF', name: 'Burkina Faso 🇧🇫', currency: 'XOF', phoneCode: '+226', flutterwave: true, paystack: false },
        { code: 'ML', name: 'Mali 🇲🇱', currency: 'XOF', phoneCode: '+223', flutterwave: true, paystack: false },
        { code: 'NE', name: 'Niger 🇳🇪', currency: 'XOF', phoneCode: '+227', flutterwave: true, paystack: false },
        { code: 'GN', name: 'Guinea 🇬🇳', currency: 'GNF', phoneCode: '+224', flutterwave: true, paystack: false },
        { code: 'GW', name: 'Guinea‑Bissau 🇬🇼', currency: 'XOF', phoneCode: '+245', flutterwave: true, paystack: false },
        { code: 'SL', name: 'Sierra Leone 🇸🇱', currency: 'SLL', phoneCode: '+232', flutterwave: true, paystack: false },
        { code: 'LR', name: 'Liberia 🇱🇷', currency: 'LRD', phoneCode: '+231', flutterwave: true, paystack: false },
        { code: 'GM', name: 'Gambia 🇬🇲', currency: 'GMD', phoneCode: '+220', flutterwave: true, paystack: false },
        { code: 'CV', name: 'Cape Verde 🇨🇻', currency: 'CVE', phoneCode: '+238', flutterwave: true, paystack: false },
        { code: 'MZ', name: 'Mozambique 🇲🇿', currency: 'MZN', phoneCode: '+258', flutterwave: true, paystack: false },
        { code: 'ZW', name: 'Zimbabwe 🇿🇼', currency: 'ZWL', phoneCode: '+263', flutterwave: true, paystack: false },
        { code: 'NA', name: 'Namibia 🇳🇦', currency: 'NAD', phoneCode: '+264', flutterwave: true, paystack: false },
        { code: 'BW', name: 'Botswana 🇧🇼', currency: 'BWP', phoneCode: '+267', flutterwave: true, paystack: false },
        { code: 'MU', name: 'Mauritius 🇲🇺', currency: 'MUR', phoneCode: '+230', flutterwave: true, paystack: false },
        
        // Central Africa (Requested)
        { code: 'GA', name: 'Gabon 🇬🇦', currency: 'XAF', phoneCode: '+241', flutterwave: true, paystack: false },
        { code: 'CG', name: 'Republic of the Congo 🇨🇬', currency: 'XAF', phoneCode: '+242', flutterwave: true, paystack: false },
        { code: 'CD', name: 'DR Congo 🇨🇩', currency: 'CDF', phoneCode: '+243', flutterwave: true, paystack: false },
        { code: 'CF', name: 'Central African Republic 🇨🇫', currency: 'XAF', phoneCode: '+236', flutterwave: true, paystack: false },
        { code: 'TD', name: 'Chad 🇹🇩', currency: 'XAF', phoneCode: '+235', flutterwave: true, paystack: false },
        { code: 'GQ', name: 'Equatorial Guinea 🇬🇶', currency: 'XAF', phoneCode: '+240', flutterwave: true, paystack: false },
        { code: 'ST', name: 'São Tomé and Príncipe 🇸🇹', currency: 'STN', phoneCode: '+239', flutterwave: true, paystack: false },
        { code: 'SS', name: 'South Sudan 🇸🇸', currency: 'SSP', phoneCode: '+211', flutterwave: true, paystack: false },
        { code: 'SD', name: 'Sudan 🇸🇩', currency: 'SDG', phoneCode: '+249', flutterwave: true, paystack: false },
        { code: 'SO', name: 'Somalia 🇸🇴', currency: 'SOS', phoneCode: '+252', flutterwave: true, paystack: false },
        { code: 'TN', name: 'Tunisia 🇹🇳', currency: 'TND', phoneCode: '+216', flutterwave: true, paystack: false },
        { code: 'MA', name: 'Morocco 🇲🇦', currency: 'MAD', phoneCode: '+212', flutterwave: true, paystack: false },
        { code: 'DZ', name: 'Algeria 🇩🇿', currency: 'DZD', phoneCode: '+213', flutterwave: true, paystack: false },
        
        // Americas
        { code: 'US', name: 'United States 🇺🇸', currency: 'USD', phoneCode: '+1', flutterwave: true, paystack: false },
        { code: 'GB', name: 'United Kingdom 🇬🇧', currency: 'GBP', phoneCode: '+44', flutterwave: true, paystack: false },
        { code: 'CA', name: 'Canada 🇨🇦', currency: 'CAD', phoneCode: '+1', flutterwave: true, paystack: false },
        { code: 'MX', name: 'Mexico 🇲🇽', currency: 'MXN', phoneCode: '+52', flutterwave: true, paystack: false },
        { code: 'BR', name: 'Brazil 🇧🇷', currency: 'BRL', phoneCode: '+55', flutterwave: true, paystack: false },
        { code: 'AR', name: 'Argentina 🇦🇷', currency: 'ARS', phoneCode: '+54', flutterwave: true, paystack: false },
        { code: 'CL', name: 'Chile 🇨🇱', currency: 'CLP', phoneCode: '+56', flutterwave: true, paystack: false },
        { code: 'CO', name: 'Colombia 🇨🇴', currency: 'COP', phoneCode: '+57', flutterwave: true, paystack: false },
        
        // Europe
        { code: 'DE', name: 'Germany 🇩🇪', currency: 'EUR', phoneCode: '+49', flutterwave: true, paystack: false },
        { code: 'FR', name: 'France 🇫🇷', currency: 'EUR', phoneCode: '+33', flutterwave: true, paystack: false },
        { code: 'NL', name: 'Netherlands 🇳🇱', currency: 'EUR', phoneCode: '+31', flutterwave: true, paystack: false },
        { code: 'ES', name: 'Spain 🇪🇸', currency: 'EUR', phoneCode: '+34', flutterwave: true, paystack: false },
        { code: 'IT', name: 'Italy 🇮🇹', currency: 'EUR', phoneCode: '+39', flutterwave: true, paystack: false },
        { code: 'BE', name: 'Belgium 🇧🇪', currency: 'EUR', phoneCode: '+32', flutterwave: true, paystack: false },
        { code: 'IE', name: 'Ireland 🇮🇪', currency: 'EUR', phoneCode: '+353', flutterwave: true, paystack: false },
        { code: 'PT', name: 'Portugal 🇵🇹', currency: 'EUR', phoneCode: '+351', flutterwave: true, paystack: false },
        { code: 'AT', name: 'Austria 🇦🇹', currency: 'EUR', phoneCode: '+43', flutterwave: true, paystack: false },
        { code: 'CH', name: 'Switzerland 🇨🇭', currency: 'CHF', phoneCode: '+41', flutterwave: true, paystack: false },
        
        // Additional European countries (Requested)
        { code: 'PL', name: 'Poland 🇵🇱', currency: 'PLN', phoneCode: '+48', flutterwave: true, paystack: false },
        { code: 'LT', name: 'Lithuania 🇱🇹', currency: 'EUR', phoneCode: '+370', flutterwave: true, paystack: false },
        { code: 'HU', name: 'Hungary 🇭🇺', currency: 'HUF', phoneCode: '+36', flutterwave: true, paystack: false },
        { code: 'LV', name: 'Latvia 🇱🇻', currency: 'EUR', phoneCode: '+371', flutterwave: true, paystack: false },
        { code: 'EE', name: 'Estonia 🇪🇪', currency: 'EUR', phoneCode: '+372', flutterwave: true, paystack: false },
        { code: 'FI', name: 'Finland 🇫🇮', currency: 'EUR', phoneCode: '+358', flutterwave: true, paystack: false },
        { code: 'DK', name: 'Denmark 🇩🇰', currency: 'DKK', phoneCode: '+45', flutterwave: true, paystack: false },
        { code: 'SE', name: 'Sweden 🇸🇪', currency: 'SEK', phoneCode: '+46', flutterwave: true, paystack: false },
        { code: 'NO', name: 'Norway 🇳🇴', currency: 'NOK', phoneCode: '+47', flutterwave: true, paystack: false },
        { code: 'LU', name: 'Luxembourg 🇱🇺', currency: 'EUR', phoneCode: '+352', flutterwave: true, paystack: false },
        { code: 'GR', name: 'Greece 🇬🇷', currency: 'EUR', phoneCode: '+30', flutterwave: true, paystack: false },
        { code: 'CZ', name: 'Czech Republic 🇨🇿', currency: 'CZK', phoneCode: '+420', flutterwave: true, paystack: false },
        { code: 'TR', name: 'Turkey 🇹🇷', currency: 'TRY', phoneCode: '+90', flutterwave: true, paystack: false },
        
        // Asia
        { code: 'CN', name: 'China 🇨🇳', currency: 'CNY', phoneCode: '+86', flutterwave: true, paystack: false },
        { code: 'IN', name: 'India 🇮🇳', currency: 'INR', phoneCode: '+91', flutterwave: true, paystack: false },
        { code: 'AE', name: 'United Arab Emirates 🇦🇪', currency: 'AED', phoneCode: '+971', flutterwave: true, paystack: false },
        { code: 'SA', name: 'Saudi Arabia 🇸🇦', currency: 'SAR', phoneCode: '+966', flutterwave: true, paystack: false },
        { code: 'QA', name: 'Qatar 🇶🇦', currency: 'QAR', phoneCode: '+974', flutterwave: true, paystack: false },
        { code: 'SG', name: 'Singapore 🇸🇬', currency: 'SGD', phoneCode: '+65', flutterwave: true, paystack: false },
        { code: 'MY', name: 'Malaysia 🇲🇾', currency: 'MYR', phoneCode: '+60', flutterwave: true, paystack: false },
        { code: 'JP', name: 'Japan 🇯🇵', currency: 'JPY', phoneCode: '+81', flutterwave: true, paystack: false },
        { code: 'KR', name: 'South Korea 🇰🇷', currency: 'KRW', phoneCode: '+82', flutterwave: true, paystack: false },
        { code: 'ID', name: 'Indonesia 🇮🇩', currency: 'IDR', phoneCode: '+62', flutterwave: true, paystack: false },
        { code: 'PH', name: 'Philippines 🇵🇭', currency: 'PHP', phoneCode: '+63', flutterwave: true, paystack: false },
        { code: 'TH', name: 'Thailand 🇹🇭', currency: 'THB', phoneCode: '+66', flutterwave: true, paystack: false },
        
        // Middle East (Requested)
        { code: 'BH', name: 'Bahrain 🇧🇭', currency: 'BHD', phoneCode: '+973', flutterwave: true, paystack: false },
        { code: 'KW', name: 'Kuwait 🇰🇼', currency: 'KWD', phoneCode: '+965', flutterwave: true, paystack: false },
        { code: 'OM', name: 'Oman 🇴🇲', currency: 'OMR', phoneCode: '+968', flutterwave: true, paystack: false },
        { code: 'JO', name: 'Jordan 🇯🇴', currency: 'JOD', phoneCode: '+962', flutterwave: true, paystack: false },
        { code: 'LB', name: 'Lebanon 🇱🇧', currency: 'LBP', phoneCode: '+961', flutterwave: true, paystack: false },
        { code: 'IQ', name: 'Iraq 🇮🇶', currency: 'IQD', phoneCode: '+964', flutterwave: true, paystack: false },
        { code: 'LY', name: 'Libya 🇱🇾', currency: 'LYD', phoneCode: '+218', flutterwave: true, paystack: false },
        { code: 'YE', name: 'Yemen 🇾🇪', currency: 'YER', phoneCode: '+967', flutterwave: true, paystack: false },
        { code: 'PS', name: 'Palestine 🇵🇸', currency: 'ILS', phoneCode: '+970', flutterwave: true, paystack: false },
        
        // Oceania
        { code: 'AU', name: 'Australia 🇦🇺', currency: 'AUD', phoneCode: '+61', flutterwave: true, paystack: false },
        { code: 'NZ', name: 'New Zealand 🇳🇿', currency: 'NZD', phoneCode: '+64', flutterwave: true, paystack: false }
    ];

    // COIN PACKAGES WITH BONUSES - Updated with 500 coins = $1.00
    const COIN_PACKAGES = [
        { coins: 500, usd: 1.00, label: 'Starter', bonus: 0 },
        { coins: 2500, usd: 5.00, label: 'Basic', bonus: 15 },
        { coins: 5000, usd: 10.00, label: 'Popular', bonus: 20 },
        { coins: 12500, usd: 25.00, label: 'Premium', bonus: 35 },
        { coins: 25000, usd: 50.00, label: 'Elite', bonus: 50 },
        { coins: 50000, usd: 100.00, label: 'Ultimate', bonus: 100 }
    ];

    // MOCK EXCHANGE RATES (In a real app, fetch from an API)
    const EXCHANGE_RATES = {
        'NGN': 1500, // 1500 NGN = 1 USD
        'GHS': 12.5,
        'KES': 150,
        'UGX': 3700,
        'TZS': 2500,
        'RWF': 1300,
        'ZAR': 18.5,
        'ZMW': 25,
        'MWK': 1700,
        'EGP': 30,
        'ETB': 55,
        'XOF': 600,
        'XAF': 600,
        'GNF': 9500,
        'SLL': 23000,
        'LRD': 190,
        'GMD': 65,
        'CVE': 100,
        'MZN': 64,
        'ZWL': 15000,
        'NAD': 18.5,
        'BWP': 13.5,
        'MUR': 45,
        'USD': 1,
        'GBP': 0.79,
        'CAD': 1.35,
        'MXN': 17,
        'BRL': 5,
        'ARS': 850,
        'CLP': 950,
        'COP': 3900,
        'EUR': 0.92,
        'CHF': 0.88,
        'CNY': 7.2,
        'INR': 83,
        'AED': 3.67,
        'SAR': 3.75,
        'QAR': 3.64,
        'SGD': 1.35,
        'MYR': 4.7,
        'JPY': 150,
        'KRW': 1300,
        'IDR': 15600,
        'PHP': 56,
        'THB': 35,
        'AUD': 1.52,
        'NZD': 1.62,
        // New currencies
        'PLN': 4.0,
        'HUF': 350,
        'DKK': 6.8,
        'SEK': 10.5,
        'NOK': 10.8,
        'CZK': 22.5,
        'TRY': 30,
        'BHD': 0.38,
        'KWD': 0.31,
        'OMR': 0.38,
        'JOD': 0.71,
        'LBP': 15000,
        'IQD': 1460,
        'LYD': 4.8,
        'YER': 250,
        'ILS': 3.8,
        'DZD': 134,
        'MAD': 10,
        'TND': 3.1,
        'SOS': 570,
        'SDG': 600,
        'SSP': 1100,
        'STN': 23,
        'CDF': 2700,
        'DZD': 134
    };

    // Price reduction factors for low-value currencies (adjusts the local price)
    const PRICE_REDUCTION_FACTORS = {
        // Countries with very low-value currencies get bigger discounts
        'UGX': 0.7,   // 30% discount
        'TZS': 0.7,   // 30% discount
        'RWF': 0.7,   // 30% discount
        'MWK': 0.7,   // 30% discount
        'ETB': 0.7,   // 30% discount
        'GNF': 0.7,   // 30% discount
        'SLL': 0.7,   // 30% discount
        'ZWL': 0.7,   // 30% discount
        // Countries with moderately low-value currencies
        'NGN': 0.8,   // 20% discount
        'KES': 0.8,   // 20% discount
        'GHS': 0.85,  // 15% discount
        'ZAR': 0.85,  // 15% discount
        'ZMW': 0.85,  // 15% discount
        'EGP': 0.85,  // 15% discount
        'XOF': 0.85,  // 15% discount
        'XAF': 0.85,  // 15% discount
        'LRD': 0.85,  // 15% discount
        'GMD': 0.85,  // 15% discount
        'CVE': 0.85,  // 15% discount
        'MZN': 0.85,  // 15% discount
        'NAD': 0.85,  // 15% discount
        'BWP': 0.85,  // 15% discount
        'MUR': 0.85,  // 15% discount
        // Other countries
        'USD': 1.0,
        'GBP': 1.0,
        'EUR': 1.0,
        'CAD': 1.0,
        'AUD': 1.0,
        'NZD': 1.0,
        'JPY': 1.0
        // Add more as needed, default is 1.0 (no discount)
    };

// --- GLOBAL STATE ---
let combinedData = [];
let homeDisplayData = [];
let savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || [];
let userProfile = JSON.parse(localStorage.getItem('userProfile')) || {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    phoneVerified: false,
    avatar: null,
    referralCode: generateReferralCode(),
    referrals: []
};
let currentUser = null;
let walletBalance = parseInt(localStorage.getItem('walletBalance')) || 0;
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let purchasedMovies = JSON.parse(localStorage.getItem('purchasedMovies')) || [];
let purchasedEpisodes = JSON.parse(localStorage.getItem('purchasedEpisodes')) || [];

let currentMovieInModal = null;
let inVideoModal = false;
let currentGridData = [];
let isEpisodeNavigation = false;
let inGridView = false;
let currentPremiumItem = null;
let selectedPaymentMethod = 'paystack';
let selectedCoinPackage = null;
let selectedBaseCoins = null;
let isLoginMode = true;
let currentSlideIndex = 0;
let activeCategory = 'all';

// Reset Password State
let resetPasswordData = {
    email: '',
    phone: '',
    lastFourDigits: '',
    verified: false
};

// --- HELPER FUNCTIONS ---
function generateReferralCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

function convertUSDToCoins(usdAmount) {
    return Math.round(usdAmount * 500);
}

function convertCoinsToLocalCurrency(coins, currency) {
    const usdAmount = coins / 500;
    const rate = EXCHANGE_RATES[currency] || 1;
    const reductionFactor = PRICE_REDUCTION_FACTORS[currency] || 1.0;
    return (usdAmount * rate) * reductionFactor;
}

function formatCurrency(amount, currency) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    return formatter.format(amount);
}

function updateCountryCode() {
    const countrySelect = document.getElementById('register-country');
    const countryCodeIndicator = document.getElementById('country-code-indicator');
    const phoneInput = document.getElementById('register-phone');
    
    if (countrySelect.value) {
        const country = COUNTRIES.find(c => c.code === countrySelect.value);
        if (country && country.phoneCode) {
            countryCodeIndicator.textContent = country.phoneCode;
            phoneInput.placeholder = country.phoneCode + ' XXX XXX XXX';
        }
    } else {
        countryCodeIndicator.textContent = '+1';
        phoneInput.placeholder = 'Enter phone number';
    }
}

function togglePasswordVisibility(inputId, buttonElement) {
    const input = document.getElementById(inputId);
    const icon = buttonElement.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

function toggleReferralModal() {
    if (!currentUser) {
        showNotification('Please login to view referral program', 'warning');
        toggleLoginModal();
        return;
    }
    
    const referralCount = userProfile.referrals ? userProfile.referrals.length : 0;
    const earnings = referralCount * 500;
    
    document.getElementById('referral-count').textContent = referralCount;
    document.getElementById('referral-earnings').textContent = earnings;
    document.getElementById('referral-code-display').textContent = userProfile.referralCode || generateReferralCode();
    
    const historyContainer = document.getElementById('referral-history-container');
    const referralList = document.getElementById('referral-list');
    
    if (referralCount > 0) {
        historyContainer.style.display = 'block';
        referralList.innerHTML = '';
        
        userProfile.referrals.forEach((ref, index) => {
            const item = document.createElement('div');
            item.className = 'profile-item';
            item.style.display = 'flex';
            item.style.alignItems = 'center';
            item.style.gap = '10px';
            item.style.marginBottom = '10px';
            item.innerHTML = `
                <div style="width: 40px; height: 40px; background: #333; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <span style="font-weight: bold;">${index + 1}</span>
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: bold;">User ${index + 1}</div>
                    <div style="font-size: 0.8rem; color: #888;">Referred</div>
                </div>
                <div style="color: var(--gold); font-weight: bold;">
                    <i class="fas fa-coins"></i> 500
                </div>
            `;
            referralList.appendChild(item);
        });
    } else {
        historyContainer.style.display = 'none';
    }
    
    document.getElementById('referral-modal').classList.toggle('open');
}

function openExternalLink(url) {
    window.open(url, '_blank');
}

function openReportPage() {
    window.open('https://report.com.ng', '_blank');
}

function openTermsModal() {
    document.getElementById('terms-modal').classList.add('open');
}

function closeTermsModal() {
    document.getElementById('terms-modal').classList.remove('open');
}

function openPrivacyModal() {
    document.getElementById('privacy-modal').classList.add('open');
}

function closePrivacyModal() {
    document.getElementById('privacy-modal').classList.remove('open');
}

function checkResetEmail() {
    const email = document.getElementById('reset-email').value;
    resetPasswordData.email = email;
    
    document.getElementById('phone-display-container').style.display = 'none';
    resetPasswordData.verified = false;
    resetPasswordData.lastFourDigits = '';
    resetPasswordData.phone = '';
    
    ['digit1', 'digit2', 'digit3', 'digit4'].forEach(id => {
        document.getElementById(id).value = '';
    });
    
    document.getElementById('reset-password-btn').disabled = true;
    
    if (!email) return;
    
    if (USE_MOCK_BACKEND) {
        const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
        const user = mockUsers.find(u => u.email === email);
        
        if (user && user.phone) {
            const phone = user.phone;
            resetPasswordData.phone = phone;
            const lastFour = phone.slice(-4);
            resetPasswordData.lastFourDigits = lastFour;
            
            const visiblePart = phone.slice(0, -4);
            const maskedPart = '•'.repeat(4);
            const displayPhone = `${visiblePart}${maskedPart}`;
            
            document.getElementById('phone-display').textContent = displayPhone;
            document.getElementById('phone-display-container').style.display = 'block';
            
            showNotification('Phone number found. Enter the last 4 digits to verify.', 'info');
        } else {
            showNotification('No account found with this email', 'error');
        }
    } else {
        showNotification('Please contact support for password reset', 'info');
    }
}

function moveToNext(currentInput, nextInputId) {
    if (currentInput.value.length === 1) {
        document.getElementById(nextInputId).focus();
    }
    
    checkVerificationDigits();
}

function checkVerificationDigits() {
    const digit1 = document.getElementById('digit1').value;
    const digit2 = document.getElementById('digit2').value;
    const digit3 = document.getElementById('digit3').value;
    const digit4 = document.getElementById('digit4').value;
    
    if (digit1 && digit2 && digit3 && digit4) {
        const enteredDigits = digit1 + digit2 + digit3 + digit4;
        
        if (enteredDigits === resetPasswordData.lastFourDigits) {
            resetPasswordData.verified = true;
            showNotification('Verification successful! You can now set a new password.', 'success');
            
            document.getElementById('reset-new-password').disabled = false;
            document.getElementById('reset-confirm-password').disabled = false;
            
            document.getElementById('reset-password-btn').disabled = false;
        } else {
            showNotification('Incorrect verification digits', 'error');
            resetPasswordData.verified = false;
        }
    }
}

function verifyResetDigits() {
    checkVerificationDigits();
}

async function handlePasswordReset() {
    if (!resetPasswordData.verified) {
        showNotification('Please verify phone digits first', 'warning');
        return;
    }
    
    const newPassword = document.getElementById('reset-new-password').value;
    const confirmPassword = document.getElementById('reset-confirm-password').value;
    
    if (!newPassword || !confirmPassword) {
        showNotification('Please enter and confirm new password', 'warning');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    const btn = document.getElementById('reset-password-btn');
    const originalText = btn.textContent;
    btn.textContent = 'Resetting...';
    btn.disabled = true;
    
    try {
        if (USE_MOCK_BACKEND) {
            const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
            const userIndex = mockUsers.findIndex(u => u.email === resetPasswordData.email);
            
            if (userIndex > -1) {
                mockUsers[userIndex].password = newPassword;
                localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
                
                showNotification('Password reset successfully! You can now login with your new password.', 'success');
                
                resetPasswordForm();
                
                toggleForgotPasswordModal();
                toggleLoginModal();
            } else {
                showNotification('User not found', 'error');
            }
        } else {
            await AuthService.resetPassword(resetPasswordData.email);
            
            showNotification('Password reset email sent! Check your email for instructions.', 'success');
            
            resetPasswordForm();
            
            toggleForgotPasswordModal();
        }
    } catch (error) {
        showNotification('Password reset failed: ' + error.message, 'error');
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
}

function resetPasswordForm() {
    document.getElementById('reset-email').value = '';
    document.getElementById('phone-display-container').style.display = 'none';
    document.getElementById('reset-new-password').value = '';
    document.getElementById('reset-confirm-password').value = '';
    document.getElementById('reset-password-btn').disabled = true;
    
    ['digit1', 'digit2', 'digit3', 'digit4'].forEach(id => {
        document.getElementById(id).value = '';
    });
    
    resetPasswordData = {
        email: '',
        phone: '',
        lastFourDigits: '',
        verified: false
    };
}

function copyReferralCode() {
    const code = userProfile.referralCode || generateReferralCode();
    navigator.clipboard.writeText(code).then(() => {
        showNotification('Referral code copied to clipboard!', 'success');
    }).catch(err => {
        showNotification('Failed to copy referral code', 'error');
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function checkPremiumExpiration() {
    const now = new Date();
    
    purchasedMovies = purchasedMovies.filter(item => {
        if (typeof item === 'object' && item.expiresAt) {
            const expiresAt = new Date(item.expiresAt);
            return expiresAt > now;
        }
        return true;
    });
    
    purchasedEpisodes = purchasedEpisodes.filter(item => {
        if (typeof item === 'object' && item.expiresAt) {
            const expiresAt = new Date(item.expiresAt);
            return expiresAt > now;
        }
        return true;
    });
    
    localStorage.setItem('purchasedMovies', JSON.stringify(purchasedMovies));
    localStorage.setItem('purchasedEpisodes', JSON.stringify(purchasedEpisodes));
    
    return { purchasedMovies, purchasedEpisodes };
}

function isContentPurchased(contentKey, isEpisode = false) {
    const purchasedList = isEpisode ? purchasedEpisodes : purchasedMovies;
    
    const purchaseRecord = purchasedList.find(item => 
        typeof item === 'object' && item.contentId === contentKey
    );
    
    if (purchaseRecord) {
        const expiresAt = new Date(purchaseRecord.expiresAt);
        const now = new Date();
        
        if (expiresAt > now) {
            return true;
        } else {
            if (isEpisode) {
                purchasedEpisodes = purchasedEpisodes.filter(item => 
                    !(typeof item === 'object' && item.contentId === contentKey)
                );
                localStorage.setItem('purchasedEpisodes', JSON.stringify(purchasedEpisodes));
            } else {
                purchasedMovies = purchasedMovies.filter(item => 
                    !(typeof item === 'object' && item.contentId === contentKey)
                );
                localStorage.setItem('purchasedMovies', JSON.stringify(purchasedMovies));
            }
            return false;
        }
    }
    
    if (purchasedList.includes(contentKey)) {
        return true;
    }
    
    return false;
}

function populateCountries() {
    const countrySelect = document.getElementById('register-country');
    if (!countrySelect) return;
    
    countrySelect.innerHTML = '<option value="">Select your country</option>';
    COUNTRIES.forEach(country => {
        const option = document.createElement('option');
        option.value = country.code;
        option.textContent = country.name;
        countrySelect.appendChild(option);
    });
}

function getCountryByCode(code) {
    return COUNTRIES.find(c => c.code === code);
}

function renderCoinPackages(countryCode) {
    const container = document.getElementById('coin-packages-container');
    const country = getCountryByCode(countryCode);
    
    if (!container || !country) return;
    
    container.innerHTML = '';
    
    COIN_PACKAGES.forEach(pkg => {
        const localAmount = convertCoinsToLocalCurrency(pkg.coins, country.currency);
        const totalCoins = pkg.bonus > 0 ? pkg.coins + Math.round(pkg.coins * (pkg.bonus / 100)) : pkg.coins;
        
        const div = document.createElement('div');
        div.className = 'coin-package';
        div.dataset.coins = totalCoins;
        div.dataset.baseCoins = pkg.coins;
        div.innerHTML = `
            <div style="position: relative;">
                <div style="font-size: 0.8rem; color: #888;">${pkg.label}</div>
                ${pkg.bonus > 0 ? `<div class="bonus-badge">+${pkg.bonus}% </div>` : ''}
            </div>
            <div class="coin-package-amount">${totalCoins.toLocaleString()} Coins</div>
            <div class="coin-package-price">${formatCurrency(localAmount, country.currency)}</div>
            ${pkg.bonus > 0 ? 
                `<div style="font-size: 0.7rem; color: var(--gold); margin-top: 5px;">
                     + ${Math.round(pkg.coins * (pkg.bonus / 100)).toLocaleString()} bonus
                </div>` : 
                ''}
        `;
        div.onclick = () => selectCoinPackage(div, totalCoins, pkg.coins);
        container.appendChild(div);
    });
    
    if (COIN_PACKAGES.length > 0) {
        const firstPackage = container.querySelector('.coin-package');
        selectCoinPackage(firstPackage, 
            COIN_PACKAGES[0].bonus > 0 ? 
                COIN_PACKAGES[0].coins + Math.round(COIN_PACKAGES[0].coins * (COIN_PACKAGES[0].bonus / 100)) : 
                COIN_PACKAGES[0].coins,
            COIN_PACKAGES[0].coins
        );
    }
}

function renderPaymentMethods(countryCode) {
    const container = document.getElementById('payment-methods-container');
    const country = getCountryByCode(countryCode);
    
    if (!container || !country) return;
    
    container.innerHTML = '';
    
    if (country.paystack) {
        const div = document.createElement('div');
        div.className = 'payment-method selected';
        div.dataset.method = 'paystack';
        div.innerHTML = `
            <i class="fas fa-credit-card"></i>
            <div>Paystack</div>
            <div style="font-size: 0.7rem; color: #888;">Cards, Bank Transfer</div>
        `;
        div.onclick = () => selectPaymentMethod(div, 'paystack');
        container.appendChild(div);
        selectedPaymentMethod = 'paystack';
    }
    
    if (country.flutterwave) {
        const div = document.createElement('div');
        div.className = country.paystack ? 'payment-method' : 'payment-method selected';
        div.dataset.method = 'flutterwave';
        div.innerHTML = `
            <i class="fas fa-globe"></i>
            <div>Flutterwave</div>
            <div style="font-size: 0.7rem; color: #888;">International</div>
        `;
        div.onclick = () => selectPaymentMethod(div, 'flutterwave');
        container.appendChild(div);
        
        if (!country.paystack) {
            selectedPaymentMethod = 'flutterwave';
        }
    }
}

function selectCoinPackage(el, totalCoins, baseCoins) {
    document.querySelectorAll('.coin-package').forEach(e => e.classList.remove('selected'));
    el.classList.add('selected');
    selectedCoinPackage = totalCoins;
    selectedBaseCoins = baseCoins;
}

function selectPaymentMethod(el, method) {
    document.querySelectorAll('.payment-method').forEach(e => e.classList.remove('selected'));
    el.classList.add('selected');
    selectedPaymentMethod = method;
}

// --- DATA MANAGEMENT ---
function combineAllData() {
    combinedData = [
        ...MOVIE_DATA,
        ...SERIES_DATA,
        ...ANIME_DATA
    ];
    
    homeDisplayData = [...combinedData];
    shuffleArray(homeDisplayData);
}

function filterContentByCategory(category) {
    if (category === 'all') {
        return combinedData;
    } else if (category === 'movies') {
        return combinedData.filter(item => item.type === 'Movie');
    } else if (category === 'series') {
        return combinedData.filter(item => item.type === 'Series');
    } else if (category === 'anime') {
        return combinedData.filter(item => item.type === 'Anime');
    } else if (category === 'trending') {
        return combinedData.filter(item => item.trending);
    } else {
        return combinedData.filter(item => 
            item.category === category || item.genre === category
        );
    }
}

function switchCategory(category) {
    activeCategory = category;
    
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`.category-tab[data-category="${category}"]`).classList.add('active');
    
    if (category === 'all') {
        document.getElementById('discover-container').style.display = 'block';
        document.getElementById('categories-container').style.display = 'block';
        document.getElementById('grid-container').style.display = 'none';
        inGridView = false;
    } else {
        const filteredData = filterContentByCategory(category);
        loadGrid(filteredData, category.charAt(0).toUpperCase() + category.slice(1));
    }
}

// Initialize category tabs
function initCategoryTabs() {
    const tabs = document.querySelectorAll('.category-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.dataset.category;
            switchCategory(category);
        });
    });
}

// --- FIREBASE SERVICE ---
const FirebaseService = {
    async saveUserProfile(userId, profileData) {
        try {
            await db.collection('users').doc(userId).set({
                ...profileData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            return true;
        } catch (error) {
            console.error('Error saving user profile:', error);
            throw error;
        }
    },

    async getUserProfile(userId) {
        try {
            const doc = await db.collection('users').doc(userId).get();
            if (doc.exists) {
                return doc.data();
            }
            return null;
        } catch (error) {
            console.error('Error getting user profile:', error);
            throw error;
        }
    },

    async getWalletBalance(userId) {
        try {
            const doc = await db.collection('wallets').doc(userId).get();
            if (doc.exists) {
                return doc.data().balance || 0;
            } else {
                await this.createWallet(userId);
                return 0;
            }
        } catch (error) {
            console.error('Error getting wallet balance:', error);
            throw error;
        }
    },

    async createWallet(userId) {
        try {
            await db.collection('wallets').doc(userId).set({
                userId: userId,
                balance: 0,
                currency: 'COINS',
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            });
            return true;
        } catch (error) {
            console.error('Error creating wallet:', error);
            throw error;
        }
    },

    async updateWalletBalance(userId, newBalance) {
        try {
            await db.collection('wallets').doc(userId).update({
                balance: newBalance,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            });
            return true;
        } catch (error) {
            console.error('Error updating wallet balance:', error);
            throw error;
        }
    },

    async saveTransaction(transactionData) {
        try {
            const transactionId = 'tx_' + Date.now();
            await db.collection('transactions').doc(transactionId).set({
                ...transactionData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return transactionId;
        } catch (error) {
            console.error('Error saving transaction:', error);
            throw error;
        }
    },

    async getTransactions(userId, limit = 20) {
        try {
            const snapshot = await db.collection('transactions')
                .where('userId', '==', userId)
                .get();
            
            const transactions = [];
            snapshot.forEach(doc => {
                transactions.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            transactions.sort((a, b) => {
                const dateA = a.createdAt ? a.createdAt.toDate().getTime() : 0;
                const dateB = b.createdAt ? b.createdAt.toDate().getTime() : 0;
                return dateB - dateA;
            });
            
            return transactions.slice(0, limit);
        } catch (error) {
            console.error('Error getting transactions:', error);
            const localTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
            return localTransactions.slice(0, limit);
        }
    },

    async savePurchase(purchaseData) {
        try {
            const purchaseId = 'pur_' + Date.now();
            await db.collection('purchases').doc(purchaseId).set({
                ...purchaseData,
                purchaseDate: firebase.firestore.FieldValue.serverTimestamp()
            });
            return purchaseId;
        } catch (error) {
            console.error('Error saving purchase:', error);
            throw error;
        }
    },

    async getPurchases(userId, contentType = null) {
        try {
            let query = db.collection('purchases').where('userId', '==', userId);
            
            if (contentType) {
                query = query.where('contentType', '==', contentType);
            }
            
            const snapshot = await query.get();
            
            const purchases = [];
            snapshot.forEach(doc => {
                purchases.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            purchases.sort((a, b) => {
                const dateA = a.purchaseDate ? a.purchaseDate.toDate().getTime() : 0;
                const dateB = b.purchaseDate ? b.purchaseDate.toDate().getTime() : 0;
                return dateB - dateA;
            });
            
            return purchases;
        } catch (error) {
            console.error('Error getting purchases:', error);
            const localPurchases = JSON.parse(localStorage.getItem('purchasedMovies')) || [];
            return localPurchases;
        }
    },

    async clearUserData(userId) {
        try {
            await db.collection('users').doc(userId).delete();
            await db.collection('wallets').doc(userId).delete();
            
            const txSnapshot = await db.collection('transactions').where('userId', '==', userId).get();
            const txBatch = db.batch();
            txSnapshot.forEach(doc => {
                txBatch.delete(doc.ref);
            });
            await txBatch.commit();
            
            const purSnapshot = await db.collection('purchases').where('userId', '==', userId).get();
            const purBatch = db.batch();
            purSnapshot.forEach(doc => {
                purBatch.delete(doc.ref);
            });
            await purBatch.commit();
            
            return true;
        } catch (error) {
            console.error('Error clearing user data:', error);
            throw error;
        }
    },

    async processReferral(referrerId, referredUserId) {
        try {
            await db.collection('users').doc(referrerId).update({
                referrals: firebase.firestore.FieldValue.arrayUnion(referredUserId),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            return true;
        } catch (error) {
            console.error('Error processing referral:', error);
            throw error;
        }
    },

    async awardReferralBonus(referrerId) {
        try {
            const walletDoc = await db.collection('wallets').doc(referrerId).get();
            const currentBalance = walletDoc.exists ? walletDoc.data().balance : 0;
            
            const newBalance = currentBalance + 500;
            
            await db.collection('wallets').doc(referrerId).update({
                balance: newBalance,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            await this.saveTransaction({
                userId: referrerId,
                type: 'Credit',
                amount: 500,
                currency: 'COINS',
                paymentMethod: 'Referral',
                status: 'Completed',
                description: 'Referral bonus - friend made first purchase'
            });
            
            return newBalance;
        } catch (error) {
            console.error('Error awarding referral bonus:', error);
            throw error;
        }
    }
};

// --- AUTH SERVICE ---
const AuthService = {
    async login(email, password) {
        if (USE_MOCK_BACKEND) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (email && password) {
                        const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
                        const user = mockUsers.find(u => u.email === email && u.password === password);
                        
                        if (user) {
                            const userObj = {
                                uid: user.uid,
                                email: user.email,
                                displayName: user.firstName + ' ' + user.lastName,
                                phoneNumber: user.phone,
                                recentLogin: true
                            };
                            
                            userProfile = {
                                firstName: user.firstName,
                                lastName: user.lastName,
                                email: user.email,
                                phone: user.phone,
                                country: user.country,
                                phoneVerified: user.phoneVerified || false,
                                avatar: null,
                                referralCode: user.referralCode || generateReferralCode(),
                                referrals: user.referrals || []
                            };
                            
                            localStorage.setItem('userProfile', JSON.stringify(userProfile));
                            resolve(userObj);
                        } else {
                            reject({ message: "Invalid credentials" });
                        }
                    } else {
                        reject({ message: "Please enter email and password" });
                    }
                }, 1000);
            });
        } else {
            try {
                const userCredential = await auth.signInWithEmailAndPassword(email, password);
                const user = userCredential.user;
                
                const lastSignInTime = user.metadata.lastSignInTime;
                const now = new Date().getTime();
                const lastSignIn = new Date(lastSignInTime).getTime();
                const hoursSinceLastSignIn = (now - lastSignIn) / (1000 * 60 * 60);
                
                user.recentLogin = hoursSinceLastSignIn < (5/60);
                
                const profile = await FirebaseService.getUserProfile(user.uid);
                if (profile) {
                    userProfile = profile;
                    localStorage.setItem('userProfile', JSON.stringify(profile));
                }
                
                walletBalance = await FirebaseService.getWalletBalance(user.uid);
                localStorage.setItem('walletBalance', walletBalance);
                
                try {
                    const firestoreTransactions = await FirebaseService.getTransactions(user.uid);
                    transactions = firestoreTransactions;
                } catch (error) {
                    console.error('Error loading transactions from Firestore, using localStorage:', error);
                    transactions = JSON.parse(localStorage.getItem('transactions')) || [];
                }
                localStorage.setItem('transactions', JSON.stringify(transactions));
                
                try {
                    const purchases = await FirebaseService.getPurchases(user.uid);
                    purchasedMovies = purchases.filter(p => p.contentType === 'movie' || p.contentType === 'series');
                    purchasedEpisodes = purchases.filter(p => p.contentType === 'episode');
                } catch (error) {
                    console.error('Error loading purchases from Firestore, using localStorage:', error);
                    purchasedMovies = JSON.parse(localStorage.getItem('purchasedMovies')) || [];
                    purchasedEpisodes = JSON.parse(localStorage.getItem('purchasedEpisodes')) || [];
                }
                
                localStorage.setItem('purchasedMovies', JSON.stringify(purchasedMovies));
                localStorage.setItem('purchasedEpisodes', JSON.stringify(purchasedEpisodes));
                
                return user;
            } catch (error) {
                throw error;
            }
        }
    },

    async register(email, password, firstName, lastName, phone, country, referralCode = null) {
        if (USE_MOCK_BACKEND) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (email && password.length >= 6 && country) {
                        const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
                        
                        const existingUser = mockUsers.find(u => u.email === email);
                        if (existingUser) {
                            reject({ message: "User with this email already exists" });
                            return;
                        }
                        
                        const uid = 'mock_user_' + Date.now();
                        
                        const countryData = COUNTRIES.find(c => c.code === country);
                        const fullPhone = phone.startsWith('+') ? phone : (countryData?.phoneCode || '+1') + phone;
                        
                        const newUser = {
                            uid: uid,
                            email: email,
                            password: password,
                            firstName: firstName,
                            lastName: lastName,
                            phone: fullPhone,
                            country: country,
                            phoneVerified: false,
                            referralCode: generateReferralCode(),
                            referrals: [],
                            referredBy: referralCode || null,
                            createdAt: new Date().toISOString()
                        };
                        
                        mockUsers.push(newUser);
                        localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
                        
                        if (referralCode) {
                            const referrer = mockUsers.find(u => u.referralCode === referralCode);
                            if (referrer) {
                                referrer.referrals = referrer.referrals || [];
                                referrer.referrals.push(uid);
                                localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
                            }
                        }
                        
                        const user = {
                            uid: uid,
                            email: email,
                            displayName: `${firstName} ${lastName}`,
                            phoneNumber: fullPhone,
                            recentLogin: true
                        };
                        
                        userProfile = {
                            firstName,
                            lastName,
                            email,
                            phone: fullPhone,
                            country,
                            phoneVerified: false,
                            avatar: null,
                            referralCode: newUser.referralCode,
                            referrals: [],
                            referredBy: referralCode || null
                        };
                        localStorage.setItem('userProfile', JSON.stringify(userProfile));
                        
                        walletBalance = 0;
                        localStorage.setItem('walletBalance', walletBalance);
                        
                        resolve(user);
                    } else {
                        reject({ message: "Password must be at least 6 characters and country must be selected" });
                    }
                }, 1000);
            });
        } else {
            try {
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                const user = userCredential.user;
                
                await user.updateProfile({
                    displayName: `${firstName} ${lastName}`
                });
                
                const countryData = COUNTRIES.find(c => c.code === country);
                const fullPhone = phone.startsWith('+') ? phone : (countryData?.phoneCode || '+1') + phone;
                
                userProfile = {
                    firstName,
                    lastName,
                    email,
                    phone: fullPhone,
                    country,
                    phoneVerified: false,
                    avatar: null,
                    referralCode: generateReferralCode(),
                    referrals: [],
                    referredBy: referralCode || null
                };
                
                await FirebaseService.saveUserProfile(user.uid, userProfile);
                localStorage.setItem('userProfile', JSON.stringify(userProfile));
                
                await FirebaseService.createWallet(user.uid);
                
                if (referralCode) {
                    const usersSnapshot = await db.collection('users').where('referralCode', '==', referralCode).get();
                    if (!usersSnapshot.empty) {
                        const referrerDoc = usersSnapshot.docs[0];
                        const referrerId = referrerDoc.id;
                        
                        await FirebaseService.processReferral(referrerId, user.uid);
                    }
                }
                
                user.recentLogin = true;
                return user;
            } catch (error) {
                throw error;
            }
        }
    },

    async resetPassword(email) {
        if (USE_MOCK_BACKEND) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({ message: "Password reset email sent (mock)" });
                }, 1000);
            });
        } else {
            return auth.sendPasswordResetEmail(email);
        }
    },

    async reauthenticate(password) {
        if (!currentUser) {
            throw new Error("No user logged in");
        }
        
        const credential = firebase.auth.EmailAuthProvider.credential(
            currentUser.email,
            password
        );
        
        return currentUser.reauthenticateWithCredential(credential);
    },

    async logout() {
        if (USE_MOCK_BACKEND) {
            return Promise.resolve();
        } else {
            return auth.signOut();
        }
    },

    async deleteAccount(password) {
        if (!currentUser) {
            throw new Error("No user logged in");
        }

        try {
            await this.reauthenticate(password);
        } catch (error) {
            if (error.code === 'auth/wrong-password') {
                throw new Error("Incorrect password. Please try again.");
            } else if (error.code === 'auth/requires-recent-login') {
                throw new Error("Please login again to perform this sensitive operation.");
            }
            throw error;
        }

        const userId = currentUser.uid;
        
        await FirebaseService.clearUserData(userId);
        
        await currentUser.delete();
        
        return true;
    },

    async updatePassword(newPassword) {
        if (!currentUser) {
            throw new Error("No user logged in");
        }
        
        if (USE_MOCK_BACKEND) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
                    const userIndex = mockUsers.findIndex(u => u.uid === currentUser.uid);
                    
                    if (userIndex > -1) {
                        mockUsers[userIndex].password = newPassword;
                        localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
                        resolve({ success: true });
                    } else {
                        reject({ success: false, message: "User not found" });
                    }
                }, 1000);
            });
        } else {
            try {
                await currentUser.updatePassword(newPassword);
                return { success: true };
            } catch (error) {
                throw error;
            }
        }
    }
};

// --- PAYMENT SERVICE ---
const PaymentService = {
    async processPaystack(baseCoins, email, name, country) {
        if (!PAYMENT_CONFIG.paystack.publicKey || PAYMENT_CONFIG.paystack.publicKey.includes('your_test_key')) {
            showNotification('Paystack is not properly configured. Please set your Paystack public key.', 'error');
            return {
                success: false,
                message: "Paystack not configured"
            };
        }

        const countryData = COUNTRIES.find(c => c.code === country);
        const localAmount = convertCoinsToLocalCurrency(baseCoins, countryData.currency);
        
        const amountInKobo = Math.round(localAmount * 100);
        
        if (amountInKobo < 5000 && countryData.currency === 'NGN') {
            showNotification('Minimum payment amount is ₦50 for Paystack', 'error');
            return {
                success: false,
                message: "Amount too low"
            };
        }
        
        return new Promise((resolve) => {
            const handler = PaystackPop.setup({
                key: PAYMENT_CONFIG.paystack.publicKey,
                email: email,
                amount: amountInKobo,
                currency: countryData.currency,
                ref: 'MOVIE_' + Date.now(),
                metadata: {
                    custom_fields: [
                        {
                            display_name: "Customer Name",
                            variable_name: "customer_name",
                            value: name
                        },
                        {
                            display_name: "Base Coins",
                            variable_name: "base_coins",
                            value: baseCoins
                        },
                        {
                            display_name: "Total Coins (with bonus)",
                            variable_name: "total_coins",
                            value: selectedCoinPackage
                        }
                    ]
                },
                callback: function(response) {
                    resolve({
                        success: true,
                        reference: response.reference,
                        message: "Payment successful",
                        baseCoins: baseCoins,
                        totalCoins: selectedCoinPackage
                    });
                },
                onClose: function() {
                    resolve({
                        success: false,
                        message: "Payment cancelled"
                    });
                }
            });
            handler.openIframe();
        });
    },

    async processFlutterwave(baseCoins, email, name, phone, country) {
        const countryData = COUNTRIES.find(c => c.code === country);
        const localAmount = convertCoinsToLocalCurrency(baseCoins, countryData.currency);

        const roundedAmount = parseFloat(localAmount.toFixed(2));
        
        return new Promise((resolve) => {
            FlutterwaveCheckout({
                public_key: PAYMENT_CONFIG.flutterwave.publicKey,
                tx_ref: "MOVIE_" + Date.now(),
                amount: roundedAmount,
                currency: countryData.currency,
                payment_options: "card, mobilemoney, banktransfer, ussd",
                customer: {
                    email: email,
                    phone_number: phone || "",
                    name: name
                },
                customizations: {
                    title: "MovieNest",
                    description: `Purchase ${baseCoins} Coins (+ Bonus)`,
                    logo: "https://via.placeholder.com/100x35/e50914/ffffff?text=MN"
                },
                meta: {
                    baseCoins: baseCoins,
                    totalCoins: selectedCoinPackage,
                    country: country
                },
                callback: function(response) {
                    resolve({
                        success: response.status === 'successful',
                        reference: response.transaction_id,
                        message: response.status,
                        baseCoins: baseCoins,
                        totalCoins: selectedCoinPackage
                    });
                },
                onclose: function() {
                    resolve({
                        success: false,
                        message: "Payment cancelled"
                    });
                }
            });
        });
    }
};

// --- AUTHENTICATION FUNCTIONS ---
async function checkAuthStatus() {
    if (USE_MOCK_BACKEND) {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            currentUser = JSON.parse(storedUser);
            updateUserProfileUI();
        }
    } else if (auth) {
        auth.onAuthStateChanged(async (user) => {
            currentUser = user;
            if (user) {
                try {
                    const profile = await FirebaseService.getUserProfile(user.uid);
                    if (profile) {
                        userProfile = profile;
                        localStorage.setItem('userProfile', JSON.stringify(profile));
                    }
                    
                    walletBalance = await FirebaseService.getWalletBalance(user.uid);
                    localStorage.setItem('walletBalance', walletBalance);
                    
                    try {
                        const firestoreTransactions = await FirebaseService.getTransactions(user.uid);
                        transactions = firestoreTransactions;
                    } catch (error) {
                        console.error('Error loading transactions from Firestore, using localStorage:', error);
                        transactions = JSON.parse(localStorage.getItem('transactions')) || [];
                    }
                    localStorage.setItem('transactions', JSON.stringify(transactions));
                    
                    try {
                        const purchases = await FirebaseService.getPurchases(user.uid);
                        purchasedMovies = purchases.filter(p => p.contentType === 'movie' || p.contentType === 'series');
                        purchasedEpisodes = purchases.filter(p => p.contentType === 'episode');
                    } catch (error) {
                        console.error('Error loading purchases from Firestore, using localStorage:', error);
                        purchasedMovies = JSON.parse(localStorage.getItem('purchasedMovies')) || [];
                        purchasedEpisodes = JSON.parse(localStorage.getItem('purchasedEpisodes')) || [];
                    }
                    
                    localStorage.setItem('purchasedMovies', JSON.stringify(purchasedMovies));
                    localStorage.setItem('purchasedEpisodes', JSON.stringify(purchasedEpisodes));
                    
                } catch (error) {
                    console.error('Error loading user data:', error);
                }
            } else {
                userProfile = {
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    country: '',
                    phoneVerified: false,
                    avatar: null,
                    referralCode: generateReferralCode(),
                    referrals: []
                };
                
                localStorage.removeItem('userProfile');
            }
            
            updateUserProfileUI();
            updateWalletUI();
            updateHistoryList();
        });
    }
}

function handleAuthSidebarClick() {
    const authBtn = document.getElementById('auth-sidebar-btn');
    const accountMenu = document.getElementById('account-actions-menu');
    
    if (currentUser) {
        if (accountMenu.style.display === 'none' || accountMenu.style.display === '') {
            accountMenu.style.display = 'block';
            authBtn.textContent = 'Hide Menu';
            authBtn.style.background = 'var(--info)';
        } else {
            accountMenu.style.display = 'none';
            authBtn.textContent = 'Account';
            authBtn.style.background = 'var(--primary-color)';
        }
    } else {
        toggleLoginModal();
    }
}

async function handleLogout() {
    try {
        await AuthService.logout();
        currentUser = null;
        localStorage.removeItem('currentUser');
        
        document.getElementById('account-actions-menu').style.display = 'none';
        
        const authBtn = document.getElementById('auth-sidebar-btn');
        authBtn.textContent = 'Login';
        authBtn.style.background = 'var(--success)';
        
        userProfile = {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            country: '',
            phoneVerified: false,
            avatar: null,
            referralCode: generateReferralCode(),
            referrals: []
        };
        
        localStorage.removeItem('userProfile');
        localStorage.setItem('videoHistory', JSON.stringify([]));
        
        updateUserProfileUI();
        showNotification('You have been logged out successfully', 'success');
        
        toggleSidebarModal();
        
    } catch (error) {
        showNotification('Logout failed: ' + error.message, 'error');
    }
}

async function handleDeleteAccount() {
    if (!currentUser) {
        showNotification('No user is logged in', 'warning');
        return;
    }

    let needsReauth = false;
    
    if (!USE_MOCK_BACKEND && currentUser) {
        const lastSignInTime = currentUser.metadata.lastSignInTime;
        if (lastSignInTime) {
            const now = new Date().getTime();
            const lastSignIn = new Date(lastSignInTime).getTime();
            const minutesSinceLastSignIn = (now - lastSignIn) / (1000 * 60);
            needsReauth = minutesSinceLastSignIn > 5;
        }
    }

    if (needsReauth) {
        const password = prompt('For security, please enter your password to continue:');
        if (!password) {
            showNotification('Account deletion cancelled', 'info');
            return;
        }

        try {
            await AuthService.reauthenticate(password);
            showNotification('Authentication successful', 'success');
        } catch (reauthError) {
            showNotification('Authentication failed: ' + reauthError.message, 'error');
            return;
        }
    } else {
        if (!confirm('Are you sure you want to delete your account? This action cannot be undone. All your data (wallet, history, favorites) will be permanently deleted.')) {
            return;
        }
        
        if (USE_MOCK_BACKEND) {
            const password = prompt('Please enter your password to confirm account deletion:');
            if (!password) {
                showNotification('Account deletion cancelled', 'info');
                return;
            }
        }
    }

    try {
        const deleteBtn = document.querySelector('.account-action-btn.delete');
        const originalText = deleteBtn.innerHTML;
        deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deleting...';
        deleteBtn.disabled = true;

        if (USE_MOCK_BACKEND) {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('userProfile');
            localStorage.removeItem('walletBalance');
            localStorage.removeItem('transactions');
            localStorage.removeItem('videoHistory');
            localStorage.removeItem('savedMovies');
            localStorage.removeItem('purchasedMovies');
            localStorage.removeItem('purchasedEpisodes');
            
            currentUser = null;
            showNotification('Account deleted successfully (mock)', 'success');
        } else {
            let password = null;
            if (needsReauth) {
                await AuthService.deleteAccount('');
            } else {
                password = prompt('Please enter your password to confirm account deletion:');
                if (!password) {
                    showNotification('Account deletion cancelled', 'info');
                    deleteBtn.innerHTML = originalText;
                    deleteBtn.disabled = false;
                    return;
                }
                await AuthService.deleteAccount(password);
            }
            
            localStorage.removeItem('currentUser');
            localStorage.removeItem('userProfile');
            localStorage.removeItem('walletBalance');
            localStorage.removeItem('transactions');
            localStorage.removeItem('videoHistory');
            localStorage.removeItem('savedMovies');
            localStorage.removeItem('purchasedMovies');
            localStorage.removeItem('purchasedEpisodes');
            
            currentUser = null;
            showNotification('Account deleted successfully', 'success');
        }
        
        walletBalance = 0;
        userProfile = {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            country: '',
            phoneVerified: false,
            avatar: null,
            referralCode: generateReferralCode(),
            referrals: []
        };
        transactions = [];
        savedMovies = [];
        purchasedMovies = [];
        purchasedEpisodes = [];
        
        updateUserProfileUI();
        updateWalletUI();
        
        document.getElementById('account-actions-menu').style.display = 'none';
        
        const authBtn = document.getElementById('auth-sidebar-btn');
        authBtn.textContent = 'Login';
        authBtn.style.background = 'var(--success)';
        
        toggleSidebarModal();
        
    } catch (error) {
        showNotification('Failed to delete account: ' + error.message, 'error');
        
        const deleteBtn = document.querySelector('.account-action-btn.delete');
        deleteBtn.innerHTML = originalText;
        deleteBtn.disabled = false;
    }
}

function toggleLoginModal() {
    const modal = document.getElementById('login-modal');
    modal.classList.toggle('open');
    resetAuthForms();
}

function toggleForgotPasswordModal() {
    const modal = document.getElementById('forgot-password-modal');
    modal.classList.toggle('open');
    if (!modal.classList.contains('open')) {
        resetPasswordForm();
    }
    if (modal.classList.contains('open')) {
        document.getElementById('login-modal').classList.remove('open');
    }
}

function toggleEditProfileModal() {
    const modal = document.getElementById('edit-profile-modal');
    if (currentUser) {
        document.getElementById('edit-first-name').value = userProfile.firstName || '';
        document.getElementById('edit-last-name').value = userProfile.lastName || '';
        document.getElementById('edit-email').value = currentUser.email || '';
        document.getElementById('edit-country').value = userProfile.country ? getCountryByCode(userProfile.country).name : '';
        document.getElementById('edit-phone').value = userProfile.phone || '';
        
        const statusBadge = document.getElementById('phone-status-badge');
        const statusText = document.getElementById('phone-status-text');
        if (userProfile.phoneVerified) {
            statusBadge.className = 'status-indicator status-verified';
            statusBadge.innerHTML = '<i class="fas fa-check-circle"></i> Verified';
            statusText.textContent = 'Verified';
        } else {
            statusBadge.className = 'status-indicator status-pending';
            statusBadge.innerHTML = '<i class="fas fa-clock"></i> Not Verified';
            statusText.textContent = 'Verify';
        }
        
        modal.classList.toggle('open');
    } else {
        toggleLoginModal();
    }
}

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (isLoginMode) {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        document.getElementById('auth-title').textContent = 'Login';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        document.getElementById('auth-title').textContent = 'Create Account';
        checkPasswordStrength();
        checkPasswordMatch();
    }
}

function resetAuthForms() {
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
    document.getElementById('register-first-name').value = '';
    document.getElementById('register-last-name').value = '';
    document.getElementById('register-country').value = '';
    document.getElementById('register-email').value = '';
    document.getElementById('register-phone').value = '';
    document.getElementById('register-password').value = '';
    document.getElementById('register-confirm-password').value = '';
    document.getElementById('referral-code').value = '';
    
    document.getElementById('strength-bar').style.width = '0%';
    document.getElementById('strength-bar').style.backgroundColor = '#444';
    
    const reqs = document.querySelectorAll('.requirement');
    reqs.forEach(req => {
        req.classList.remove('met');
        const icon = req.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-times';
            icon.style.color = 'var(--primary-color)';
        }
    });
    
    document.getElementById('password-match-message').textContent = '';
    document.getElementById('register-submit-btn').disabled = false;
}

function checkPasswordStrength() {
    const password = document.getElementById('register-password').value;
    const strengthBar = document.getElementById('strength-bar');
    
    let strength = 0;
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password)
    };
    
    Object.keys(requirements).forEach(key => {
        const reqElement = document.getElementById(`req-${key}`);
        const icon = reqElement.querySelector('i');
        
        if (requirements[key]) {
            reqElement.classList.add('met');
            icon.className = 'fas fa-check';
            icon.style.color = 'var(--success)';
            strength += 20;
        } else {
            reqElement.classList.remove('met');
            icon.className = 'fas fa-times';
            icon.style.color = 'var(--primary-color)';
        }
    });
    
    strengthBar.style.width = `${strength}%`;
    if (strength < 40) {
        strengthBar.style.backgroundColor = '#ff0000';
    } else if (strength < 80) {
        strengthBar.style.backgroundColor = '#ff9900';
    } else {
        strengthBar.style.backgroundColor = '#00b300';
    }
    
    checkPasswordMatch();
}

function checkPasswordMatch() {
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const matchMessage = document.getElementById('password-match-message');
    const registerBtn = document.getElementById('register-submit-btn');
    
    if (password === '' || confirmPassword === '') {
        matchMessage.textContent = '';
        registerBtn.disabled = false;
        return;
    }
    
    if (password === confirmPassword) {
        matchMessage.textContent = 'Passwords match ✓';
        matchMessage.style.color = 'var(--success)';
        registerBtn.disabled = false;
    } else {
        matchMessage.textContent = 'Passwords do not match ✗';
        matchMessage.style.color = 'var(--primary-color)';
        registerBtn.disabled = true;
    }
}

async function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const btn = document.getElementById('login-submit-btn');
    
    if (!email || !password) {
        showNotification('Please fill all fields', 'warning');
        return;
    }
    
    btn.textContent = 'Logging in...';
    btn.disabled = true;
    
    try {
        const user = await AuthService.login(email, password);
        currentUser = user;
        
        if (USE_MOCK_BACKEND) {
            localStorage.setItem('currentUser', JSON.stringify(user));
        }
        
        updateUserProfileUI();
        toggleLoginModal();
        showNotification('Login successful!', 'success');
        
    } catch (error) {
        showNotification(error.message || 'Login failed', 'error');
    } finally {
        btn.textContent = 'Login';
        btn.disabled = false;
    }
}

async function handleRegister() {
    const firstName = document.getElementById('register-first-name').value;
    const lastName = document.getElementById('register-last-name').value;
    const country = document.getElementById('register-country').value;
    const email = document.getElementById('register-email').value;
    const phone = document.getElementById('register-phone').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const referralCode = document.getElementById('referral-code').value || null;
    const btn = document.getElementById('register-submit-btn');
    
    if (!firstName || !lastName || !country || !email || !password || !confirmPassword) {
        showNotification('Please fill all required fields', 'warning');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'warning');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'warning');
        return;
    }
    
    btn.textContent = 'Creating account...';
    btn.disabled = true;
    
    try {
        const user = await AuthService.register(email, password, firstName, lastName, phone, country, referralCode);
        currentUser = user;
        
        if (USE_MOCK_BACKEND) {
            localStorage.setItem('currentUser', JSON.stringify(user));
        }
        
        updateUserProfileUI();
        toggleLoginModal();
        showNotification('Account created successfully!', 'success');
        
        if (referralCode) {
            showNotification('Referral code applied! You will receive 500 coins when your friend makes their first purchase.', 'info');
        }
        
    } catch (error) {
        showNotification(error.message || 'Registration failed', 'error');
    } finally {
        btn.textContent = 'Create Account';
        btn.disabled = false;
    }
}

function verifyPhoneNumber() {
    if (!currentUser) {
        showNotification('Please login first', 'warning');
        toggleLoginModal();
        return;
    }
    
    const phone = document.getElementById('edit-phone').value;
    if (!phone) {
        showNotification('Please enter phone number', 'warning');
        return;
    }
    
    userProfile.phoneVerified = true;
    userProfile.phone = phone;
    
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    
    if (currentUser && !USE_MOCK_BACKEND) {
        FirebaseService.saveUserProfile(currentUser.uid, userProfile);
    }
    
    const statusBadge = document.getElementById('phone-status-badge');
    const statusText = document.getElementById('phone-status-text');
    statusBadge.className = 'status-indicator status-verified';
    statusBadge.innerHTML = '<i class="fas fa-check-circle"></i> Verified';
    statusText.textContent = 'Verified';
    
    showNotification('Phone verified successfully!', 'success');
}

async function saveProfile() {
    const firstName = document.getElementById('edit-first-name').value;
    const lastName = document.getElementById('edit-last-name').value;
    const phone = document.getElementById('edit-phone').value;
    
    if (!firstName || !lastName) {
        showNotification('First and last name are required', 'warning');
        return;
    }
    
    userProfile.firstName = firstName;
    userProfile.lastName = lastName;
    userProfile.phone = phone;
    
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    
    if (currentUser && !USE_MOCK_BACKEND) {
        try {
            await FirebaseService.saveUserProfile(currentUser.uid, userProfile);
        } catch (error) {
            console.error('Error saving profile to Firestore:', error);
        }
    }
    
    updateUserProfileUI();
    toggleEditProfileModal();
    showNotification('Profile updated successfully!', 'success');
}

function updateUserProfileUI() {
    const nameEl = document.getElementById('user-name');
    const emailEl = document.getElementById('user-email-text');
    const countryEl = document.getElementById('user-country');
    const authBtn = document.getElementById('auth-sidebar-btn');
    const avatarEl = document.getElementById('user-avatar');
    const accountMenu = document.getElementById('account-actions-menu');
    
    if (currentUser) {
        const displayName = userProfile.firstName && userProfile.lastName 
            ? `${userProfile.firstName} ${userProfile.lastName}`
            : currentUser.displayName || currentUser.email.split('@')[0];
        
        nameEl.textContent = displayName;
        emailEl.textContent = currentUser.email;
        
        if (userProfile.country) {
            const country = getCountryByCode(userProfile.country);
            countryEl.textContent = country ? country.name : '';
        } else {
            countryEl.textContent = '';
        }
        
        authBtn.textContent = 'Account';
        authBtn.style.background = 'var(--primary-color)';
        
        accountMenu.style.display = 'none';
        
        avatarEl.innerHTML = '';
        const img = document.createElement('img');
        const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase();
        img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random&color=fff&size=60`;
        img.alt = displayName;
        avatarEl.appendChild(img);
    } else {
        nameEl.textContent = 'Guest User';
        emailEl.textContent = 'Not logged in';
        countryEl.textContent = '';
        authBtn.textContent = 'Login';
        authBtn.style.background = 'var(--success)';
        avatarEl.innerHTML = '<i class="fas fa-user" style="font-size: 24px; color: #fff;"></i>';
        accountMenu.style.display = 'none';
    }
}

// --- PAYMENT FUNCTIONS ---
function toggleWalletModal() {
    document.getElementById('wallet-modal').classList.toggle('open');
}

function togglePaymentModal() {
    if (!currentUser) {
        showNotification('Please login to buy coins', 'warning');
        toggleLoginModal();
        return;
    }
    
    selectedCoinPackage = null;
    selectedBaseCoins = null;
    renderCoinPackages(userProfile.country);
    renderPaymentMethods(userProfile.country);
    
    document.getElementById('payment-modal').classList.toggle('open');
}

async function processPayment() {
    if (!currentUser) {
        showNotification('Please login to make payments', 'warning');
        toggleLoginModal();
        return;
    }
    
    if (!selectedCoinPackage || !selectedBaseCoins) {
        showNotification('Please select a coin package', 'warning');
        return;
    }
    
    const loading = document.getElementById('payment-loading');
    const payBtn = document.getElementById('pay-now-btn');
    loading.style.display = 'flex';
    payBtn.disabled = true;
    
    try {
        let paymentResult;
        const userName = userProfile.firstName && userProfile.lastName 
            ? `${userProfile.firstName} ${userProfile.lastName}`
            : currentUser.displayName || currentUser.email.split('@')[0];
        
        const coinsForPayment = selectedBaseCoins;
        
        if (selectedPaymentMethod === 'paystack') {
            paymentResult = await PaymentService.processPaystack(
                coinsForPayment,
                currentUser.email,
                userName,
                userProfile.country
            );
        } else {
            paymentResult = await PaymentService.processFlutterwave(
                coinsForPayment,
                currentUser.email,
                userName,
                userProfile.phone,
                userProfile.country
            );
        }
        
        if (paymentResult.success) {
            const totalCoinsAwarded = selectedCoinPackage;
            walletBalance += totalCoinsAwarded;
            
            const bonusAmount = totalCoinsAwarded - selectedBaseCoins;
            
            const transactionData = {
                transactionId: 'tx_' + Date.now(),
                userId: currentUser.uid,
                type: 'Credit',
                amount: totalCoinsAwarded,
                currency: 'COINS',
                paymentMethod: selectedPaymentMethod,
                status: 'Completed',
                reference: paymentResult.reference,
                description: bonusAmount > 0 ? 
                    `Purchased ${selectedBaseCoins} Coins + ${bonusAmount} Bonus` : 
                    `Purchased ${selectedBaseCoins} Coins`
            };
            
            transactions.push(transactionData);
            
            if (!USE_MOCK_BACKEND) {
                await FirebaseService.saveTransaction(transactionData);
                await FirebaseService.updateWalletBalance(currentUser.uid, walletBalance);
                
                if (userProfile.referredBy) {
                    const usersSnapshot = await db.collection('users').where('referralCode', '==', userProfile.referredBy).get();
                    if (!usersSnapshot.empty) {
                        const referrerDoc = usersSnapshot.docs[0];
                        const referrerId = referrerDoc.id;
                        
                        await FirebaseService.awardReferralBonus(referrerId);
                        showNotification('Referral bonus awarded to your friend!', 'success');
                    }
                }
            }
            
            localStorage.setItem('walletBalance', walletBalance);
            localStorage.setItem('transactions', JSON.stringify(transactions));
            
            updateWalletUI();
            togglePaymentModal();
            toggleWalletModal();
            
            if (bonusAmount > 0) {
                showNotification(`Successfully purchased ${selectedBaseCoins} coins + ${bonusAmount} bonus coins! Total: ${totalCoinsAwarded} coins`, 'success');
            } else {
                showNotification(`Successfully purchased ${totalCoinsAwarded} coins!`, 'success');
            }
            
        } else {
            showNotification(paymentResult.message || 'Payment failed', 'error');
        }
        
    } catch (error) {
        showNotification('Payment processing error: ' + error.message, 'error');
        console.error('Payment error:', error);
    } finally {
        loading.style.display = 'none';
        payBtn.disabled = false;
    }
}

function updateWalletUI() {
    const formattedCoins = walletBalance.toLocaleString();
    
    document.getElementById('sidebar-balance').textContent = `${formattedCoins} Coins`;
    document.getElementById('wallet-balance-display').textContent = `${formattedCoins} Coins`;
    
    const txList = document.getElementById('transaction-history');
    if (transactions.length === 0) {
        txList.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">No transactions yet.</div>';
    } else {
        txList.innerHTML = '';
        transactions.slice().reverse().forEach(tx => {
            const div = document.createElement('div');
            div.className = 'transaction-item';
            
            let dateStr = 'N/A';
            if (tx.createdAt && tx.createdAt.toDate) {
                dateStr = tx.createdAt.toDate().toLocaleDateString('en-NG', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            } else if (tx.date) {
                dateStr = tx.date;
            } else if (tx.createdAt && tx.createdAt.seconds) {
                dateStr = new Date(tx.createdAt.seconds * 1000).toLocaleDateString('en-NG', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }
            
            const amountText = tx.currency === 'COINS' ? 
                `${tx.amount} Coins` : 
                formatCurrency(tx.amount, tx.currency || 'NGN');
            
            div.innerHTML = `
                <div>
                    <div style="font-weight:bold; color:white;">${tx.type} - ${tx.paymentMethod || 'Wallet'}</div>
                    <div style="font-size:0.8rem; color:#888;">${dateStr}</div>
                    ${tx.reference ? `<div style="font-size:0.7rem; color:#666;">Ref: ${tx.reference}</div>` : ''}
                    <div style="font-size:0.7rem; color:#888;">${tx.description || ''}</div>
                </div>
                <div class="tx-amount ${tx.status === 'Completed' ? 'success' : 'failed'}">
                    ${tx.type === 'Debit' ? '-' : '+'}${amountText}
                </div>
            `;
            txList.appendChild(div);
        });
    }
}

// --- PREMIUM CONTENT ---
function openPremiumModal(item, isEpisode = false, seriesTitle = '', seasonNum = 0, episodeNum = 0) {
    currentPremiumItem = item;
    const coins = item.price || 500;
    
    if (walletBalance < coins) {
        showNotification(`Insufficient coins! You need ${coins} coins but only have ${walletBalance}.`, 'warning');
        toggleWalletModal();
        return;
    }
    
    document.getElementById('premium-price-display').textContent = `${coins} Coins`;
    
    const descEl = document.getElementById('premium-desc');
    const usdAmount = (coins / 500).toFixed(2);
    
    if (isEpisode) {
        descEl.textContent = `Episode ${episodeNum} of "${seriesTitle}" - Season ${seasonNum} requires ${coins} coins to unlock.`;
    } else {
        descEl.textContent = `This content requires ${coins} coins to unlock.`;
    }
    
    document.getElementById('premium-modal').style.display = 'flex';
}

function closePremiumModal() {
    document.getElementById('premium-modal').style.display = 'none';
    currentPremiumItem = null;
}

async function unlockPremiumVideo() {
    if (!currentUser) {
        closePremiumModal();
        showNotification('Please login to unlock premium content', 'warning');
        toggleLoginModal();
        return;
    }

    if (walletBalance < currentPremiumItem.price) {
        closePremiumModal();
        showNotification(`Insufficient coins! You need ${currentPremiumItem.price} coins but only have ${walletBalance}.`, 'warning');
        toggleWalletModal();
        return;
    }

    walletBalance -= currentPremiumItem.price;
    
    const transactionData = {
        transactionId: 'tx_' + Date.now(),
        userId: currentUser.uid,
        type: 'Debit',
        amount: currentPremiumItem.price,
        currency: 'COINS',
        paymentMethod: 'Wallet',
        status: 'Completed',
        description: `Purchased premium content: ${currentPremiumItem.isEpisode ? 
            `Episode ${currentPremiumItem.episodeNum} of "${currentPremiumItem.seriesTitle}"` : 
            currentPremiumItem.title}`
    };
    
    transactions.push(transactionData);
    
    const now = new Date();
    const expirationDate = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));
    
    if (currentPremiumItem.isEpisode) {
        const contentId = `${currentPremiumItem.seriesTitle}_S${currentPremiumItem.seasonNum}_E${currentPremiumItem.episodeNum}`;
        const purchaseRecord = {
            contentId: contentId,
            purchaseDate: now.toISOString(),
            expiresAt: expirationDate.toISOString(),
            isExpired: false,
            price: currentPremiumItem.price
        };
        
        purchasedEpisodes = purchasedEpisodes.filter(item => 
            typeof item === 'object' ? item.contentId !== contentId : item !== contentId
        );
        purchasedEpisodes.push(purchaseRecord);
        
        const purchaseData = {
            purchaseId: 'pur_' + Date.now(),
            userId: currentUser.uid,
            contentType: 'episode',
            contentId: contentId,
            contentTitle: `${currentPremiumItem.seriesTitle} - S${currentPremiumItem.seasonNum}E${currentPremiumItem.episodeNum}`,
            amount: currentPremiumItem.price,
            currency: 'COINS',
            purchaseDate: now.toISOString(),
            expiresAt: expirationDate.toISOString()
        };
        
        if (!USE_MOCK_BACKEND) {
            await FirebaseService.savePurchase(purchaseData);
            await FirebaseService.saveTransaction(transactionData);
            await FirebaseService.updateWalletBalance(currentUser.uid, walletBalance);
        }
        
        localStorage.setItem('purchasedEpisodes', JSON.stringify(purchasedEpisodes));
        
    } else {
        const contentId = currentPremiumItem.title;
        const purchaseRecord = {
            contentId: contentId,
            purchaseDate: now.toISOString(),
            expiresAt: expirationDate.toISOString(),
            isExpired: false,
            price: currentPremiumItem.price
        };
        
        purchasedMovies = purchasedMovies.filter(item => 
            typeof item === 'object' ? item.contentId !== contentId : item !== contentId
        );
        purchasedMovies.push(purchaseRecord);
        
        const purchaseData = {
            purchaseId: 'pur_' + Date.now(),
            userId: currentUser.uid,
            contentType: 'movie',
            contentId: contentId,
            contentTitle: currentPremiumItem.title,
            amount: currentPremiumItem.price,
            currency: 'COINS',
            purchaseDate: now.toISOString(),
            expiresAt: expirationDate.toISOString()
        };
        
        if (!USE_MOCK_BACKEND) {
            await FirebaseService.savePurchase(purchaseData);
            await FirebaseService.saveTransaction(transactionData);
            await FirebaseService.updateWalletBalance(currentUser.uid, walletBalance);
        }
        
        localStorage.setItem('purchasedMovies', JSON.stringify(purchasedMovies));
    }
    
    localStorage.setItem('walletBalance', walletBalance);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    updateWalletUI();
    closePremiumModal();
    showNotification(`Content unlocked successfully! Access valid for 7 days.`, 'success');
    
    if (currentPremiumItem.isEpisode && currentMovieInModal) {
        renderEpisodes(currentMovieInModal);
        playEpisode(currentPremiumItem.url, null, true);
    }
}

// --- VIDEO PLAYER ---
const openVideoNav = async (videoUrl, title, item, bypassPremiumCheck = false) => {
    if (!navigator.onLine) {
        showNetworkWarning();
        return;
    }

    if (!bypassPremiumCheck && item.premium && !item.isSeries) {
        const contentId = item.title;
        if (!isContentPurchased(contentId, false)) {
            openPremiumModal(item);
            return;
        }
    }

    addToHistory(title);

    if (item && item.openUrl === true) {
        window.open(videoUrl, '_blank');
        return;
    }

    currentMovieInModal = item;
    const videoNav = document.getElementById('video-nav');
    const iframe = document.getElementById('video-player');
    
    let processedUrl = videoUrl;
    if (videoUrl.includes('youtube.com/embed/')) {
        const separator = videoUrl.includes('?') ? '&' : '?';
        processedUrl = videoUrl + separator + 'autoplay=1&mute=0';
    }
    
    iframe.src = processedUrl;
    videoNav.style.display = 'flex';
    inVideoModal = true;
    updateSaveButton();
    pushVideoState();

    const episodeFooter = document.getElementById('episode-footer');
    if (item.isSeries && item.seasons) {
        episodeFooter.style.display = 'block';
        item.currentSeason = item.currentSeason || 0;
        renderEpisodes(item);
    } else {
        episodeFooter.style.display = 'none';
    }
};

const closeNav = () => {
    const videoNav = document.getElementById('video-nav');
    const iframe = document.getElementById('video-player');
    iframe.src = 'about:blank';
    videoNav.style.display = 'none';
    inVideoModal = false;
    currentMovieInModal = null;
    isEpisodeNavigation = false;
    if (inGridView) {
        document.getElementById('grid-container').style.display = 'grid';
    } else {
        document.getElementById('discover-container').style.display = 'block';
        document.getElementById('categories-container').style.display = 'block';
    }
};

const shareMovie = () => {
    if (!currentMovieInModal) return;
    const shareUrl = currentMovieInModal.share || window.location.href;
    if (navigator.share) {
        navigator.share({
            title: currentMovieInModal.title,
            text: `Watch ${currentMovieInModal.title} on MovieNest`,
            url: shareUrl
        });
    } else {
        navigator.clipboard.writeText(shareUrl).then(() => {
            showNotification('Link copied to clipboard!', 'success');
        });
    }
};

const toggleSaveStatus = () => {
    if (!currentMovieInModal) return;
    const title = currentMovieInModal.title;
    const index = savedMovies.indexOf(title);
    const btn = document.getElementById('save-btn');

    if (index > -1) {
        savedMovies.splice(index, 1);
        btn.textContent = 'Add to list';
        btn.style.backgroundColor = 'var(--success)';
        showNotification('Removed from My List', 'success');
    } else {
        savedMovies.push(title);
        btn.textContent = 'Added';
        btn.style.backgroundColor = 'var(--primary-color)';
        showNotification('Added to My List', 'success');
        const item = combinedData.find(i => i.title === title);
        if (item) {
            item.dateAdded = new Date().toISOString().split('T')[0];
            const dataIdx = combinedData.findIndex(i => i.title === title);
            if (dataIdx > -1) combinedData[dataIdx] = item;
        }
    }
    localStorage.setItem('savedMovies', JSON.stringify(savedMovies));
    if (document.querySelector('.nav-icon.active').dataset.target === 'mylist') showMyList();
};

const updateSaveButton = () => {
    const btn = document.getElementById('save-btn');
    if (!currentMovieInModal) return;
    if (savedMovies.includes(currentMovieInModal.title)) {
        btn.textContent = 'Added';
        btn.style.backgroundColor = 'var(--primary-color)';
    } else {
        btn.textContent = 'Add to list';
        btn.style.backgroundColor = 'var(--success)';
    }
};

function renderEpisodes(item) {
    const season = item.seasons[item.currentSeason];
    document.getElementById('episode-title').textContent = `${item.title} - Season ${season.seasonNumber}`;
    document.getElementById('episode-count').textContent = `${season.episodes.length} Episodes`;
    const scroller = document.getElementById('episode-scroller');
    scroller.innerHTML = '';
    
    if (item.currentSeason > 0) {
        const btn = document.createElement('div');
        btn.className = 'season-nav-btn prev-season';
        btn.innerHTML = `
            <div class="season-text">PREV</div>
            <div class="season-number">S${item.seasons[item.currentSeason - 1].seasonNumber}</div>
        `;
        btn.onclick = () => changeSeason(item, -1);
        scroller.appendChild(btn);
    }

    season.episodes.forEach((ep, idx) => {
        const btn = document.createElement('div');
        btn.className = 'episode-btn';
        if (idx === 0 && !ep.premium) btn.classList.add('active');
        
        const contentId = `${item.title}_S${season.seasonNumber}_E${ep.number}`;
        const isPurchased = isContentPurchased(contentId, true);
        
        const premiumBadge = ep.premium && !isPurchased ? 
            `<div class="episode-premium-badge"><i class="fas fa-crown"></i></div>` : '';
        
        btn.innerHTML = `
            ${premiumBadge}
            <div class="ep-num">EP ${ep.number}</div>
            <div>${ep.number}</div>
        `;
        
        if (ep.premium && !isPurchased) {
            btn.onclick = () => {
                const premiumItem = {
                    ...ep,
                    isEpisode: true,
                    seriesTitle: item.title,
                    seasonNum: season.seasonNumber,
                    episodeNum: ep.number,
                    price: ep.price || 200
                };
                openPremiumModal(premiumItem, true, item.title, season.seasonNumber, ep.number);
            };
            
            btn.style.background = 'linear-gradient(135deg, #333 0%, #222 100%)';
            btn.style.border = '2px solid var(--gold)';
        } else {
            btn.onclick = () => playEpisode(ep.url, btn, false, ep);
        }
        
        scroller.appendChild(btn);
    });

    if (item.currentSeason < item.seasons.length - 1) {
        const btn = document.createElement('div');
        btn.className = 'season-nav-btn next-season';
        btn.innerHTML = `
            <div class="season-text">NEXT</div>
            <div class="season-number">S${item.seasons[item.currentSeason + 1].seasonNumber}</div>
        `;
        btn.onclick = () => changeSeason(item, 1);
        scroller.appendChild(btn);
    }
}

function changeSeason(item, direction) {
    isEpisodeNavigation = true;
    item.currentSeason += direction;
    renderEpisodes(item);
    
    const season = item.seasons[item.currentSeason];
    let firstPlayableEp = null;
    for (const ep of season.episodes) {
        const contentId = `${item.title}_S${season.seasonNumber}_E${ep.number}`;
        const isPurchased = isContentPurchased(contentId, true);
        
        if (!ep.premium || isPurchased) {
            firstPlayableEp = ep;
            break;
        }
    }
    
    if (firstPlayableEp) {
        setTimeout(() => {
            const buttons = document.querySelectorAll('.episode-btn');
            buttons.forEach((btn, idx) => {
                if (btn.textContent.includes(`EP ${firstPlayableEp.number}`)) {
                    btn.classList.add('active');
                    playEpisode(firstPlayableEp.url, btn, false, firstPlayableEp);
                } else {
                    btn.classList.remove('active');
                }
            });
        }, 100);
    }
    
    setTimeout(() => isEpisodeNavigation = false, 100);
}

function playEpisode(url, btnElement, bypassPremiumCheck = false, episodeData = null) {
    if (episodeData && episodeData.premium && !bypassPremiumCheck) {
        const contentId = `${currentMovieInModal.title}_S${currentMovieInModal.seasons[currentMovieInModal.currentSeason].seasonNumber}_E${episodeData.number}`;
        if (!isContentPurchased(contentId, true)) {
            const premiumItem = {
                ...episodeData,
                isEpisode: true,
                seriesTitle: currentMovieInModal.title,
                seasonNum: currentMovieInModal.seasons[currentMovieInModal.currentSeason].seasonNumber,
                episodeNum: episodeData.number,
                price: episodeData.price || 200
            };
            openPremiumModal(premiumItem, true, currentMovieInModal.title, 
                currentMovieInModal.seasons[currentMovieInModal.currentSeason].seasonNumber, 
                episodeData.number);
            return;
        }
    }
    
    isEpisodeNavigation = true;
    if (btnElement) {
        document.querySelectorAll('.episode-btn').forEach(b => b.classList.remove('active'));
        btnElement.classList.add('active');
    }
    
    const iframe = document.getElementById('video-player');
    let processedUrl = url;
    if (url.includes('youtube.com/embed/')) {
        const separator = url.includes('?') ? '&' : '?';
        processedUrl = url + separator + 'autoplay=1';
    }
    iframe.src = processedUrl;
    setTimeout(() => isEpisodeNavigation = false, 100);
}

// --- CAROUSEL ---
function createCarousel(data) {
    const carousel = document.getElementById("carousel");
    const dotsContainer = document.getElementById("dots");
    carousel.innerHTML = '';
    dotsContainer.innerHTML = '';
    const carouselData = data.filter(item => item.carousel === true);
    if (carouselData.length === 0) return;

    carouselData.forEach((item, index) => {
        const slide = document.createElement("div");
        slide.className = "slide";
        slide.onclick = function() {
            const fullItem = combinedData.find(i => i.title === item.title);
            openVideoNav(item.videoUrl, item.title, fullItem);
        };
        
        const isPurchased = item.premium ? isContentPurchased(item.title, false) : true;
        const premiumBadge = item.premium && !isPurchased ? 
            '<div class="premium-badge" style="position:absolute; top:20px; right:20px; z-index:5;"><i class="fas fa-crown"></i></div>' : '';
        
        slide.innerHTML = `
            ${premiumBadge}
            <img src="${item.carouselCover || item.imgUrl}" alt="${item.title}" loading="lazy">
            <div class="overlay">
                <div class="video-title">${item.title}</div>
                <div class="video-info">${item.type || 'Movie'} | ${item.year || '2024'} | ${item.genre || ''}</div>
                <button class="download-btn" onclick="event.stopPropagation(); openVideoNav('${item.videoUrl}', '${item.title}', combinedData.find(i=>i.title==='${item.title}'))">
                    <i class="fas fa-play"></i> Watch Now
                </button>
            </div>
        `;
        carousel.appendChild(slide);

        const dot = document.createElement("div");
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.onclick = (e) => { e.stopPropagation(); goToSlide(index); };
        dotsContainer.appendChild(dot);
    });
}

function goToSlide(index) {
    const carousel = document.getElementById("carousel");
    const carouselData = homeDisplayData.filter(item => item.carousel === true);
    currentSlideIndex = index;
    carousel.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function nextSlide() {
    const carouselData = homeDisplayData.filter(item => item.carousel === true);
    currentSlideIndex = (currentSlideIndex + 1) % carouselData.length;
    goToSlide(currentSlideIndex);
}

function initCarousel() {
    setInterval(nextSlide, 5000);
}

// --- CATEGORIES ---
function createCategories(data) {
    const container = document.getElementById('categories-container');
    container.innerHTML = '';
    const categories = ['Hollywood', 'Action', 'Nollywood', 'Bollywood', 'Kannywood', 'Comedy', 'Drama', 'Romance'];
    
    categories.forEach(cat => {
        const catData = data.filter(i => i.category === cat || i.genre === cat);
        if (catData.length === 0) return;
        const wrapper = document.createElement('div');
        wrapper.className = 'category-container';
        wrapper.innerHTML = `
            <div class="category-header">
                <div class="category-title"><span>${cat}</span></div>
                <button class="download-btn" onclick="showCategoryGrid('${cat}')" style="padding: 5px 10px; font-size: 0.8rem;">
                    All <i class="fas fa-chevron-right"></i>
                </button>
            </div>
            <div class="category-scroll" id="cat-${cat}"></div>
        `;
        container.appendChild(wrapper);
        const scrollContainer = wrapper.querySelector('.category-scroll');
        catData.slice(0, 10).forEach(item => {
            const el = document.createElement('div');
            el.className = 'frame';
            
            const isPurchased = item.premium ? isContentPurchased(item.title, false) : true;
            const premiumBadge = item.premium && !isPurchased ? 
                '<div class="premium-badge"><i class="fas fa-crown"></i></div>' : '';
            
            const typeBadge = item.type === 'Anime' ? 'anime-badge' : 
                             item.type === 'Series' ? 'series-badge' : 
                             item.type === 'Movie' ? 'movie-badge' : '';
            
            el.innerHTML = `
                ${premiumBadge}
                <div class="type-badge ${typeBadge}">${item.type}</div>
                <img src="${item.imgUrl}" alt="${item.title}" loading="lazy">
                <div class="content"><h2>${item.title}</h2></div>`;
            el.onclick = () => {
                const fullItem = combinedData.find(i => i.title === item.title);
                openVideoNav(item.videoUrl, item.title, fullItem);
            };
            scrollContainer.appendChild(el);
        });
    });
}

// --- GRID VIEWS ---
function loadGrid(data, title = '') {
    const grid = document.getElementById('grid-container');
    grid.innerHTML = '';
    document.getElementById('discover-container').style.display = 'none';
    document.getElementById('categories-container').style.display = 'none';
    grid.style.display = 'grid';
    inGridView = true;

    if (title) {
        const header = document.createElement('div');
        header.style.gridColumn = '1/-1';
        header.style.padding = '10px';
        header.style.fontSize = '1.2rem';
        header.style.fontWeight = 'bold';
        header.textContent = title;
        grid.appendChild(header);
    }

    data.forEach(item => {
        const el = document.createElement('div');
        el.className = 'frame';
        
        const isPurchased = item.premium ? isContentPurchased(item.title, false) : true;
        const premiumBadge = item.premium && !isPurchased ? 
            '<div class="premium-badge"><i class="fas fa-crown"></i></div>' : '';
        
        const typeBadge = item.type === 'Anime' ? 'anime-badge' : 
                         item.type === 'Series' ? 'series-badge' : 
                         item.type === 'Movie' ? 'movie-badge' : '';
        
        el.innerHTML = `
            ${premiumBadge}
            <div class="type-badge ${typeBadge}">${item.type}</div>
            <img src="${item.imgUrl}" alt="${item.title}" loading="lazy">
            <div class="content"><h2>${item.title}</h2></div>`;
        el.onclick = () => openVideoNav(item.videoUrl, item.title, item);
        grid.appendChild(el);
    });
    
    if (data.length === 0) {
        grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:50px; color:#666;">No content found.</div>';
    }
}

function showHomeVideos() {
    currentGridData = combinedData;
    loadGrid(combinedData, 'All Movies');
}

function showTrendingVideos() {
    const trending = combinedData.filter(i => i.trending);
    currentGridData = trending;
    loadGrid(trending, 'Trending Now');
}

function showMyList() {
    let list = combinedData.filter(i => savedMovies.includes(i.title));
    list.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    currentGridData = list;
    loadGrid(list, 'My List');
}

function showCategoryGrid(cat) {
    let filtered = ['Action', 'Comedy', 'Drama', 'Romance'].includes(cat) 
        ? combinedData.filter(i => i.genre === cat) 
        : combinedData.filter(i => i.category === cat);
    currentGridData = filtered;
    loadGrid(filtered, cat);
}

function showProfileSection() {
    const grid = document.getElementById('grid-container');
    grid.innerHTML = '';
    document.getElementById('discover-container').style.display = 'none';
    document.getElementById('categories-container').style.display = 'none';
    grid.style.display = 'grid';
    inGridView = true;
    
    const header = document.createElement('div');
    header.style.gridColumn = '1/-1';
    header.style.padding = '10px';
    header.style.fontSize = '1.2rem';
    header.textContent = 'Apps & Services';
    grid.appendChild(header);
    
    // Mock apps data
    const mockApps = [
        { name: "Hausa Novels", description: "Read thousands of novels", icon: "https://via.placeholder.com/64x64/333/ffffff?text=HN", link: "#" },
        { name: "Movie Editor", description: "Edit your own clips", icon: "https://via.placeholder.com/64x64/444/ffffff?text=ME", link: "#" },
        { name: "Music Player", description: "Stream local music", icon: "https://via.placeholder.com/64x64/555/ffffff?text=MP", link: "#" }
    ];
    
    mockApps.forEach(app => {
        const el = document.createElement('div');
        el.className = 'profile-item';
        el.style.gridColumn = '1/-1';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.gap = '10px';
        el.style.padding = '15px';
        el.innerHTML = `
            <img src="${app.icon}" style="width:50px; height:50px; border-radius:8px;" alt="${app.name}">
            <div style="flex:1">
                <div style="font-weight:bold;">${app.name}</div>
                <div style="font-size:0.8rem; color:#888;">${app.description}</div>
            </div>
            <button class="install-button" onclick="window.open('${app.link}','_blank')">Open</button>`;
        grid.appendChild(el);
    });
}

// --- NAVIGATION ---
function switchTab(tabName, push = true) {
    const discoverContainer = document.getElementById('discover-container');
    const categoriesContainer = document.getElementById('categories-container');
    const gridContainer = document.getElementById('grid-container');

    discoverContainer.style.display = 'none';
    categoriesContainer.style.display = 'none';
    gridContainer.style.display = 'none';

    document.querySelectorAll('.nav-icon').forEach(el => el.classList.remove('active'));
    const activeBtn = document.querySelector(`.nav-icon[data-target="${tabName}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    if (tabName === 'discover') {
        discoverContainer.style.display = 'block';
        categoriesContainer.style.display = 'block';
        inGridView = false;
    } else if (tabName === 'movies') {
        showHomeVideos();
    } else if (tabName === 'series') {
        const seriesData = combinedData.filter(item => item.type === 'Series');
        loadGrid(seriesData, 'TV Series');
    } else if (tabName === 'anime') {
        const animeData = combinedData.filter(item => item.type === 'Anime');
        loadGrid(animeData, 'Anime');
    } else if (tabName === 'mylist') {
        showMyList();
    }
    
    window.scrollTo(0, 0);
    if (push) pushTabState(tabName);
}

function pushTabState(tabName) {
    history.pushState({ tab: tabName }, '');
}

function pushVideoState() {
    history.pushState({ modal: 'video' }, '');
}

function handlePopState(event) {
    const state = event.state;
    if (state && state.modal === 'video') {
        closeNav();
    } else if (state && state.tab) {
        switchTab(state.tab, false);
    } else {
        switchTab('discover', false);
    }
}

// --- SEARCH & FILTER ---
function handleSearch() {
    const query = document.getElementById('search-bar').value.toLowerCase();
    if (query.length < 2) return;
    const results = combinedData.filter(item => 
        item.title.toLowerCase().includes(query) || 
        (item.genre && item.genre.toLowerCase().includes(query)) || 
        (item.category && item.category.toLowerCase().includes(query))
    );
    loadGrid(results, `Search: "${query}"`);
    document.getElementById('search-suggestions').classList.remove('show');
}

function showSearchSuggestions() {
    const query = document.getElementById('search-bar').value.toLowerCase();
    const box = document.getElementById('search-suggestions');
    box.innerHTML = '';
    if (query.length < 2) {
        box.classList.remove('show');
        return;
    }
    const matches = combinedData.filter(i => i.title.toLowerCase().includes(query)).slice(0, 5);
    if (matches.length > 0) {
        matches.forEach(item => {
            const div = document.createElement('div');
            div.className = 'search-suggestion-item';
            div.innerHTML = `<span>${item.title}</span><span class="suggestion-type">${item.type}</span>`;
            div.onclick = () => {
                document.getElementById('search-bar').value = item.title;
                handleSearch();
                box.classList.remove('show');
            };
            box.appendChild(div);
        });
        box.classList.add('show');
    } else {
        box.classList.remove('show');
    }
}

function hideSearchSuggestions() {
    setTimeout(() => {
        document.getElementById('search-suggestions').classList.remove('show');
    }, 200);
}

function toggleFilterModal() {
    document.getElementById('filter-modal').classList.toggle('open');
}

function populateFilterOptions() {
    const container = document.getElementById('dynamic-filters');
    container.innerHTML = '';
    
    const genres = [...new Set(combinedData.map(i => i.genre).filter(Boolean))];
    const years = [...new Set(combinedData.map(i => i.year).filter(Boolean))];
    
    const createSelect = (label, opts) => {
        const wrap = document.createElement('div');
        wrap.className = 'filter-section';
        wrap.innerHTML = `
            <label class="filter-label">${label}</label>
            <div class="select-wrapper">
                <select class="filter-select">
                    <option value="All">All</option>
                    ${opts.map(o => `<option value="${o}">${o}</option>`).join('')}
                </select>
            </div>
        `;
        container.appendChild(wrap);
    };
    
    createSelect('Genre', genres);
    createSelect('Year', years);
}

function applyFilters() {
    const genre = document.querySelectorAll('.filter-select')[0].value;
    const year = document.querySelectorAll('.filter-select')[1].value;
    
    let filtered = currentGridData.length > 0 ? currentGridData : combinedData;
    if (genre !== 'All') filtered = filtered.filter(i => i.genre === genre);
    if (year !== 'All') filtered = filtered.filter(i => String(i.year) === year);
    loadGrid(filtered, 'Filtered Results');
    toggleFilterModal();
}

// --- HISTORY ---
async function addToHistory(title) {
    let history = JSON.parse(localStorage.getItem('videoHistory')) || [];
    history = history.filter(i => i.contentTitle !== title);
    
    const item = combinedData.find(i => i.title === title);
    if (item) {
        const historyItem = {
            contentTitle: item.title,
            contentId: item.title,
            contentType: item.isSeries ? 'episode' : 'movie',
            watchedAt: new Date().toISOString()
        };
        
        history.unshift(historyItem);
        
        localStorage.setItem('videoHistory', JSON.stringify(history.slice(0, 20)));
        updateHistoryList();
    }
}

async function updateHistoryList() {
    const list = document.getElementById('history-list');
    let history = JSON.parse(localStorage.getItem('videoHistory')) || [];
    
    document.getElementById('history-count').textContent = history.length;
    document.getElementById('sidebar-history-count').textContent = history.length;
    list.innerHTML = '';
    
    if (history.length === 0) {
        list.innerHTML = '<div style="padding:20px; text-align:center; color:#666;">No history yet</div>';
        return;
    }
    
    history.forEach(item => {
        const el = document.createElement('div');
        el.className = 'sidebar-item';
        
        const videoItem = combinedData.find(i => i.title === item.contentTitle);
        const imgSrc = videoItem ? videoItem.imgUrl : 'https://via.placeholder.com/30x45/333/fff?text=MN';
        
        el.innerHTML = `<img src="${imgSrc}" alt="${item.contentTitle}"><span>${item.contentTitle}</span>`;
        el.onclick = () => {
            toggleHistoryModal();
            const fullItem = combinedData.find(i => i.title === item.contentTitle) || item;
            openVideoNav(videoItem ? videoItem.videoUrl : 'https://www.youtube.com/embed/dQw4w9WgXcQ', item.contentTitle, fullItem);
        };
        list.appendChild(el);
    });
}

function toggleHistoryModal() {
    document.getElementById('history-modal').classList.toggle('open');
}

async function clearHistory() {
    localStorage.removeItem('videoHistory');
    
    updateHistoryList();
    showNotification('History cleared', 'success');
}

// --- UTILITY FUNCTIONS ---
function showNotification(msg, type = 'success') {
    const el = document.createElement('div');
    el.className = `notification ${type}`;
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
}

function showNetworkWarning() {
    document.getElementById('network-warning').classList.remove('hidden');
}

function hideNetworkWarning() {
    document.getElementById('network-warning').classList.add('hidden');
}

function checkNetworkConnection() {
    if (navigator.onLine) {
        hideNetworkWarning();
    } else {
        showNetworkWarning();
    }
}

function handleFooterScroll() {
    const footer = document.querySelector('footer');
    const st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > 100) {
        footer.classList.add('hide');
    } else {
        footer.classList.remove('hide');
    }
}

function closeNotification() {
    const bar = document.getElementById('notification-bar');
    bar.classList.remove('show');
}

function toggleSidebarModal() {
    document.getElementById('sidebar-modal').classList.toggle('open');
    if (!document.getElementById('sidebar-modal').classList.contains('open')) {
        document.getElementById('account-actions-menu').style.display = 'none';
        const authBtn = document.getElementById('auth-sidebar-btn');
        if (currentUser) {
            authBtn.textContent = 'Account';
            authBtn.style.background = 'var(--primary-color)';
        }
    }
}

// --- MAIN INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // Initialize data
    combineAllData();
    checkPremiumExpiration();
    populateCountries();
    
    // Initialize page
    initializePage();
    setupEventListeners();
    updateWalletUI();
    checkAuthStatus();
    
    // Initialize category tabs
    initCategoryTabs();
    
    history.replaceState({ tab: 'discover' }, '');
});

function initializePage() {
    createCarousel(homeDisplayData);
    createCategories(homeDisplayData);
    updateUserProfileUI();
    updateHistoryList();
    initCarousel();
    populateFilterOptions();
    switchTab('discover');
    
    setTimeout(() => {
        const bar = document.getElementById('notification-bar');
        if(bar) {
            bar.classList.add('show');
            setTimeout(() => bar.classList.remove('show'), 10000);
        }
    }, 3000);
}

function setupEventListeners() {
    window.addEventListener('online', hideNetworkWarning);
    window.addEventListener('offline', showNetworkWarning);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('scroll', handleFooterScroll);
    checkNetworkConnection();
}

// Initialize the app
initializePage();
