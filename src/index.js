// Usage Example:

/*
import AMG from './path-to-amg-module.js'; // Adjust the import path as necessary

// Basic Configuration: Uses the default mapper for elements with the 'data-ad-slot' attribute
AMG.amgConfigure();

// Custom Configuration: Provides a custom initialization function to set up multiple mappers
AMG.amgConfigure((manager) => {
  // Mapper for banner ads
  manager.setMapper('.ad-slot-banner', {
    srcURL: 'https://ads.example.com/getBannerAd',
    on: {
      loading: (data) => {
        console.log('Banner Ad is loading:', data);
      },
      error: (error) => {
        console.error('Banner Ad encountered an error:', error);
      },
    },
    render: new CustomRender(), // Using CustomRender for banner ads
  });

  // Mapper for native ads
  manager.setMapper('.ad-slot-native', {
    srcURL: 'https://ads.example.com/getNativeAd',
    on: {
      loading: (data) => {
        console.log('Native Ad is loading:', data);
      },
      error: (error) => {
        console.error('Native Ad encountered an error:', error);
      },
    },
    render: new CustomRender(), // Using CustomRender for native ads
  });

  // Add more mappers as needed
});

// After configuration, all matched ad slots will be initialized and rendered accordingly
*/

// Import necessary classes from other modules
import { EmbeddedAd } from './embedded.js'; // EmbeddedAd class for handling individual ads
import { Manager } from './manager.js'; // Manager class for orchestrating multiple ad mappers

/**
 * amgConfigure function initializes the ad management system.
 * It sets up ad mappers based on the provided custom initialization function
 * or uses a default mapper targeting elements with the 'data-ad-slot' attribute.
 *
 * @param {Function} [customInit] - Optional custom initialization function that receives a Manager instance.
 */
function amgConfigure(customInit) {
  // Create a new Manager instance to handle ad mappers
  let mn = new Manager();

  if (!!customInit) {
    // If a custom initialization function is provided, execute it with the Manager instance
    customInit(mn);
  } else {
    // If no custom initialization is provided, set a default mapper
    // This mapper targets all elements with the 'data-ad-slot' attribute
    mn.setMapper('[data-ad-slot]', {});
  }

  // Execute the ad rendering process based on the configured mappers
  mn.execute();
}

// Export the EmbeddedAd, Manager, and amgConfigure as default exports
export default { EmbeddedAd, Manager, amgConfigure };