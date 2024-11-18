// Usage Example:

/*
import { Manager } from './path-to-manager.js';

// Initialize the Manager instance
const adManager = new Manager();

// Configure ad mappers with CSS selectors and corresponding configurations
adManager.setMapper('.ad-slot-banner', {
  srcURL: 'https://ads.example.com/getBannerAd',
  on: {
    loading: (data) => {
      console.log('Banner Ad is loading:', data);
    },
    error: (error) => {
      console.error('Banner Ad encountered an error:', error);
    },
  },
  render: new Render(), // Default render instance or CustomRender if needed
});

adManager.setMapper('.ad-slot-native', {
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

// Execute the ad rendering process
adManager.execute();
*/

// Import necessary classes from other modules
import { CustomRender } from './custom_render.js'; // Custom rendering capabilities
import { EmbeddedAd } from './embedded.js'; // EmbeddedAd class for handling ads

// Define the default configuration for ad mappers
const defaultConfig = {
  srcURL: process.env.ADSERVER_AD_JSONP_REQUEST_URL, // Default source URL for JSONP requests
  dataParams: {
    slot: "data-ad-slot",                 // Attribute for ad slot identification
    format: "data-ad-format",             // Attribute for ad format specification
    fullWidth: "data-full-width-responsive", // Attribute for full-width responsiveness
  },
  on: {
    render: null,   // Callback for render events
    loading: null,  // Callback for loading events
    loaded: null,   // Callback for loaded events
    error: null,    // Callback for error events
  },
  render: undefined, // Default render instance (can be overridden)
};

/**
 * Manager class handles the setup and execution of multiple ad mappers.
 * It scans the DOM for elements matching specified selectors and initializes
 * EmbeddedAd instances with appropriate configurations.
 */
export class Manager {
  /**
   * Constructor initializes the array to hold ad mappers.
   */
  constructor() {
    // Array to store ad mapper configurations
    this.admappers = [];
  }

  /**
   * Registers a new ad mapper with a CSS selector and its configuration.
   * @param {string} matchPattern - The CSS selector to match ad container elements.
   * @param {Object} conf - The configuration object for the ad mapper.
   */
  setMapper(matchPattern, conf) {
    // Merge the provided configuration with the default configuration
    const config = { ...defaultConfig, ...conf };
    
    // Add the mapper to the admappers array
    this.admappers.push({
      matchPattern,
      config,
    });
  }

  /**
   * Executes the ad rendering process by iterating over all registered mappers.
   * It selects DOM elements based on the match patterns and initializes EmbeddedAd instances.
   */
  execute() {
    // Iterate through each ad mapper configuration
    for (let it of this.admappers) {
      // Select all DOM elements that match the current mapper's pattern
      document.querySelectorAll(it.matchPattern).forEach((el) => {
        // Extract ad-related attributes from the element
        let slot = el.getAttribute(it.config.dataParams.slot);
        let format = el.getAttribute(it.config.dataParams.format);
        let fullWidth = el.getAttribute(it.config.dataParams.fullWidth);

        // Create container for the ad if not already present
        el.querySelectorAll(".promo-block-container").forEach((container) => {
          container.remove();
        });

        let container = document.createElement("div");
        container.classList.add("promo-block-container");
        el.appendChild(container);

        // Initialize a new CustomRender instance for potential custom templates
        let customRender = it.config.render && it.config.render.addTemplate
                         ? it.config.render.clone()
                         : new CustomRender(it.config.render);
        let initedRender = false; // Flag to check if any custom templates are added

        // Search for script tags containing HTML templates within the ad container
        el.querySelectorAll("script[type='html/template']").forEach((templateEl) => {
          // Retrieve and trim the template content
          let content = (templateEl.innerHTML + "").trim();
          
          // Get the type of the template (e.g., 'proxy', 'native', 'banner')
          let ttype = templateEl.getAttribute("data-type");
          
          // If both content and type are present, add the template to CustomRender
          if (content && ttype) {
            customRender.addTemplate(ttype, content);
            initedRender = true; // Mark that a custom template has been initialized
          }
        });

        // Initialize a new EmbeddedAd instance with the gathered configurations
        new EmbeddedAd({
          element: container,                        // The DOM element where the ad will be rendered
          spot_id: slot,                      // The ad zone ID
          JSONPLink: it.config.srcURL,        // The JSONP endpoint URL
          format: format,                     // The ad format (e.g., 'banner', 'native')
          fullWidth: fullWidth,               // Full-width responsiveness setting
          render: initedRender ? customRender : it.config.render, // Use CustomRender if templates are initialized
        })
          // Register event callbacks as specified in the mapper's configuration
          .on('render', it.config.on.render)
          .on('loading', it.config.on.loading)
          .on('loaded', it.config.on.loaded)
          .on('error', it.config.on.error)
          // Initiate the ad rendering process
          .render();
      });
    }
  }
}