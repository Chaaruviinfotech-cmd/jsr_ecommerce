/**
 * LocationService - Object-Oriented Service for Location permissions & delivery radius checks
 */
export class LocationService {
  constructor() {
    this.storageKey = 'jsr_user_location';
    this.defaultLocation = {
      city: 'Bemetara, Raipur',
      pincode: '491335',
      area: 'Bemetara, Raipur & Nearby Areas',
      state: 'Chhattisgarh',
      country: 'India',
      isServiceable: true
    };
    this.serviceablePincodes = ['491335', '492001', '492006', '492007', '490006', '490020'];
  }

  /**
   * Request Geolocation permission from user's browser
   */
  async requestLocationPermission() {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      return {
        success: false,
        message: 'Geolocation is not supported by your browser.'
      };
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            city: 'Raipur / Bemetara Hub',
            area: 'Delivering to Your Detected Location',
            pincode: '491335',
            isServiceable: true
          };
          this.saveLocation(loc);
          resolve({
            success: true,
            message: 'Location permission granted!',
            data: loc
          });
        },
        (error) => {
          let msg = 'Unable to retrieve location';
          if (error.code === error.PERMISSION_DENIED) {
            msg = 'Location permission denied by user. Using default delivery hub.';
          }
          resolve({
            success: false,
            message: msg,
            data: this.getSavedLocation()
          });
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    });
  }

  /**
   * Check if a 6-digit Indian pincode is serviceable
   */
  checkPincodeDelivery(pincode) {
    const cleanPin = String(pincode).trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      return {
        serviceable: false,
        message: 'Please enter a valid 6-digit pincode.'
      };
    }

    if (this.serviceablePincodes.includes(cleanPin) || cleanPin.startsWith('491') || cleanPin.startsWith('492')) {
      return {
        serviceable: true,
        pincode: cleanPin,
        city: cleanPin.startsWith('491') ? 'Bemetara' : 'Raipur',
        message: `✓ Available! Delivery within 2-4 hours to Pincode ${cleanPin}.`
      };
    }

    return {
      serviceable: false,
      pincode: cleanPin,
      message: 'Sorry! We currently deliver only in Bemetara, Raipur & Nearby Areas.'
    };
  }

  /**
   * Save selected location in storage
   */
  saveLocation(locationObj) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(locationObj));
    }
  }

  /**
   * Get saved location with fallback
   */
  getSavedLocation() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) return JSON.parse(stored);
      } catch (e) {
        // Fallback
      }
    }
    return this.defaultLocation;
  }
}

const locationService = new LocationService();
export default locationService;
