/**
 * Service for location-related operations
 */
export const locationService = {
  /**
   * Resolves latitude and longitude to a human-readable area name using Nominatim (OpenStreetMap)
   * @param {number} lat 
   * @param {number} lon 
   * @returns {Promise<string>}
   */
  async resolveAreaName(lat, lon) {
    try {
      console.log(`[LocationService] Primary attempt (Nominatim): ${lat}, ${lon}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`,
          {
            signal: controller.signal,
            headers: { 'Accept-Language': 'en' }
          }
        );
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          if (data && data.address) {
            const ad = data.address;
            return ad.village || ad.hamlet || ad.suburb || ad.town || ad.city_district || ad.city || ad.municipality || ad.district || ad.county || 'Location Identified';
          }
        }
      } catch (e) {
        console.warn('[LocationService] Nominatim failed, trying fallback...', e.message);
      }

      // Fallback API: BigDataCloud (No key required for client-side JS)
      console.log('[LocationService] Fallback attempt (BigDataCloud)');
      const fallbackResponse = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
      );

      if (fallbackResponse.ok) {
        const fbData = await fallbackResponse.json();
        return fbData.locality || fbData.city || fbData.principalSubdivision || 'Location Identified';
      }

      throw new Error('All location services failed');
    } catch (error) {
      console.error('[LocationService] Extraction failed:', error);
      throw new Error('Unable to resolve location name. Please enter it manually.');
    }
  },

  /**
   * Gets current position using Geolocation API
   * @returns {Promise<GeolocationPosition>}
   */
  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    });
  }
};
