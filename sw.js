/**
 * @fileoverview Service Worker for CFDI Calculator
 * @author Ramses Martinez
 * @version 1.0.0
 */

const CACHE_NAME = 'cfdi-calculator-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/assets/css/styles.css',
  '/src/assets/js/app.js',
  '/src/components/CalculatorController.js',
  '/src/utils/i18n.js',
  '/src/utils/mathUtils.js',
  '/src/utils/taxCalculator.js',
  '/src/utils/exportUtils.js',
  '/src/config/constants.js',
  '/src/config/translations.js',
  '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.log('Service Worker: Error caching files', error);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch(() => {
        // Fallback for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      })
  );
});

// Message event - handle updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
