# adjssdk

Open-source Advertisement Render SDK for Web

adjssdk is a flexible and extensible JavaScript SDK designed to simplify the integration and rendering of advertisements on your web applications. It supports various ad formats, custom templates, and robust event handling to ensure seamless ad management and display.

Table of Contents

* [Features](#features)
* [Installation](#installation)
* [Usage](#usage)
  * [Defining Ad Slots in HTML](#defining-ad-slots-in-html)
  * [Initializing the SDK](#initializing-the-sdk)
  * [Basic Configuration](#basic-configuration)
  * [Initializing the SDK at the Bottom of the Body](#initializing-the-sdk-at-the-bottom-of-the-body)
* [Advanced Configuration](#advanced-configuration)
  * [Event Callbacks](#event-callbacks)
* [Customization](#customization)
* [Examples](#examples)
* [License](#license)

## Features

* Multiple Ad Formats: Supports proxy, native, and banner ad formats.
* Custom Templates: Easily define and manage custom HTML templates for different ad types.
* Responsive Design: Generates srcset attributes for responsive images.
* Event Handling: Register callbacks for loading, rendering, and error events.
* Security: Sanitizes URLs and safely injects scripts to prevent XSS attacks.
* Extensible Architecture: Modular design allows for easy extensions and integrations.

## Installation

Include the adjssdk script in your HTML file by adding the following `<script>` tag before the closing `</body>` tag or in the `<head>` section:

```html
<script type="text/javascript" src="https://domain.cdn/adjssdk.js"></script>
```

## Usage

### Defining Ad Slots in HTML

Define ad slots within your HTML by using the `<ins>` tag with appropriate data- attributes. You can also include custom HTML templates within `<script>` tags inside the `<ins>` element to define how different ad types should be rendered.

Here’s an example of how to define an ad slot with custom templates:

```html
<ins class="myads"
     style="display:block"
     data-ad-slot="2nkBXMzDH71gxXKlBxH9GiG8eGc"
     data-ad-format="auto"
     data-full-width-responsive="true">
  
  <!-- Default Ad Template -->
  <script type="html/template" data-type="default">
    <!-- Default ad code goes here -->
    <div class="default-ad">
      <p>Your ad will appear here.</p>
    </div>
  </script>
  
  <!-- Native Ad Template -->
  <script type="html/template" data-type="native">
    <a href="{{url}}" target="_blank" class="max-w-4xl mx-auto rounded bg-white dark:bg-gray-800 shadow-lg rounded-lg transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-gray-700">
      <img src="{{mainAsset.path}}" alt="{{fields.title}}" class="w-full h-auto rounded" />
      {{?fields.title}}<h2>{{fields.title}}</h2>{{/?}}
      {{?fields.description}}<p>{{fields.description}}</p>{{/?}}
    </a>
  </script>
</ins>
```

### Initializing the SDK

You can initialize the ad rendering system using the amgConfigure function. This function sets up the ad manager and executes the ad rendering process based on your configurations.

### Basic Configuration

If you want to use the default mapper that targets all elements with the data-ad-slot attribute, you can initialize the SDK as follows:

```html
<script type="text/javascript" src="https://domain.cdn/adjssdk.js"></script>

<script type="text/javascript">
  import AMG from './path-to-adjssdk.js'; // Adjust the path as necessary

  // Initialize the ad manager with default settings
  AMG.amgConfigure();
</script>
```

### Initializing the SDK at the Bottom of the Body

To optimize page loading and ensure that all DOM elements are available when initializing the SDK, you can place the initialization scripts at the bottom of the `<body>` tag. This approach ensures that the ad slots are present in the DOM before the SDK attempts to render ads.

## Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Advertisement Integration Example</title>
</head>
<body>
  <!-- Your website content -->

  <!-- Ad Slot Definition -->
  <ins class="myads"
       style="display:block"
       data-ad-slot="2nkBXMzDH71gxXKlBxH9GiG8eGc"
       data-ad-format="auto"
       data-full-width-responsive="true">

    <!-- Default Ad Template -->
    <script type="html/template" data-type="default">
      <div class="default-ad">
        <p>Your ad will appear here.</p>
      </div>
    </script>
    
    <!-- Native Ad Template -->
    <script type="html/template" data-type="native">
      <a href="{{url}}" target="_blank" class="native-ad">
        <img src="{{mainAsset.path}}" alt="{{fields.title}}" class="ad-image" srcset="{{srcSetThumbs}}" />
        <h2>{{fields.title}}</h2>
        <p>{{fields.description}}</p>
      </a>
    </script>
  </ins>

  <!-- Advertisement Script -->
  <script src="../dist/ads.js"></script>
  <script type="text/javascript">
    pads.amgConfigure(function(mn) {
      mn.setMapper("ins.myads", {
        srcURL: "http://localhost:7077/b/dynamic/{<id>}?format=jsonp",
        /*dataParams: {
          slot: "data-ad-slot",
          format: "data-ad-format",
          fullWidth: "data-full-width-responsive",
        },*/
      });
    });
  </script>
</body>
</html>
```

## Explanation

1. Including the SDK Script:
    * The `<script src="../dist/ads.js"></script>` tag includes the adjssdk JavaScript file. Ensure the path is correct relative to your HTML file.
2. Initializing the SDK:
    * The `<script type="text/javascript">` block initializes the ad manager by calling amgConfigure.
    * The amgConfigure function accepts a callback function that receives a Manager instance (mn).
    * Within the callback, mn.setMapper is used to define how ads should be mapped and rendered.
    * Parameters:
    * Selector (`"ins.myads"`): Targets all `<ins>` elements with the class `myads`.
    * Configuration Object:
        * srcURL: Specifies the JSONP endpoint for fetching ad data. The `{<id>}` placeholder is replaced with the actual `spot_id` defined in the ad slot’s data-ad-slot attribute.
        * dataParams (Optional): Maps HTML data- attributes to configuration parameters. This section is commented out but can be used if custom data attribute mappings are required.
3. Ad Slot Definition:
    * The `<ins>` tag with class myads defines an ad slot.
    * `data-ad-slot` contains the ad spot ID.
    * `data-ad-format` specifies the ad format (auto, banner, native, etc.).
    * `data-full-width-responsive` enables full-width responsiveness.
    * Within the `<ins>` tag, `<script type="html/template" data-type="...">` tags define custom templates for different ad types.
4. Placement:
    * Placing the initialization scripts at the bottom of the `<body>` ensures that all ad slots are loaded into the DOM before the SDK attempts to render ads. This approach can improve page performance and prevent rendering issues.

## Advanced Configuration

For more granular control, you can provide a custom initialization function to set up multiple ad mappers with specific configurations.

```html
<script type="text/javascript" src="https://domain.cdn/adjssdk.js"></script>

<script type="text/javascript">
  import AMG from './path-to-adjssdk.js'; // Adjust the path as necessary
  import { CustomRender } from './custom_render.js'; // Ensure CustomRender is properly imported

  // Initialize the ad manager with custom configurations
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
</script>
```

### Event Callbacks

adjssdk allows you to register callbacks for various ad lifecycle events. This enables you to implement custom behaviors such as displaying loading indicators, handling errors gracefully, or tracking ad impressions.

#### Available Events

* `loading`: Triggered when an ad starts loading.
* `render`: Triggered after an ad is successfully rendered.
* `error`: Triggered when an error occurs during ad loading or rendering.

#### Registering Event Callbacks

You can register event callbacks using the .on() method when initializing an EmbeddedAd instance or within the Manager’s mapper configurations.

**Example: Registering Callbacks with EmbeddedAd**

```javascript
import { EmbeddedAd } from './embedded.js';
import { CustomRender } from './custom_render.js';

// Initialize CustomRender and add templates as needed
const customRender = new CustomRender();
customRender.addTemplate('native', `
  <a href="{{url}}" target="_blank" class="native-ad">
    <img src="{{mainAsset.path}}" alt="{{fields.title}}" class="ad-image" srcset="{{srcSetThumbs}}" />
    <h2>{{fields.title}}</h2>
    <p>{{fields.description}}</p>
  </a>
`);

// Create a new EmbeddedAd instance with custom settings and CustomRender
const ad = new EmbeddedAd({
  element: 'ad-container',           // ID of the DOM element where the ad will be rendered
  spot_id: 'spot123',                // Your ad spot ID
  JSONPLink: '<https://ads.example.com/getAd>', // Your JSONP endpoint
  render: customRender,              // Use the CustomRender instance
});

// Register event callbacks
ad.on('loading', (ad) => {
  console.log('Ad is loading:');
}).on('loaded', (ad, data) => {
  console.log('Ad has finished loading:', data);
}).on('render', (ad, data, success) => {
  if (success) {
    console.log('Ad rendered successfully.');
  } else {
    console.log('Ad rendering failed.');
  }
}).on('error', (ad, error) => {
  console.error('An error occurred while rendering the ad:', error);
});

// Initiate the ad rendering process
ad.render();
```

**Example: Registering Callbacks within Manager**

```javascript
import { Manager } from './manager.js';
import { CustomRender } from './custom_render.js';

// Initialize CustomRender and add templates
const customRender = new CustomRender();
customRender.addTemplate('banner', `
  <div class="custom-banner-ad">
    <a href="{{url}}" target="_blank">
      <img src="{{mainAsset.path}}" alt="Banner Ad" srcset="{{srcSetThumbs}}" />
    </a>
  </div>
`);
customRender.addTemplate('native', `
  <a href="{{url}}" target="_blank" class="native-ad">
    <img src="{{mainAsset.path}}" alt="{{fields.title}}" class="ad-image" srcset="{{srcSetThumbs}}" />
    <h2>{{fields.title}}</h2>
    <p>{{fields.description}}</p>
  </a>
`);

// Initialize the Manager with custom mappers
const adManager = new Manager();

adManager.setMapper('.ad-slot-banner', {
  srcURL: '<https://ads.example.com/getBannerAd>',
  on: {
    loading: (data) => {
      console.log('Banner Ad is loading:', data);
    },
    error: (error) => {
      console.error('Banner Ad encountered an error:', error);
    },
  },
  render: customRender, // Using CustomRender for banner ads
});

adManager.setMapper('.ad-slot-native', {
  srcURL: '<https://ads.example.com/getNativeAd>',
  on: {
    loading: (data) => {
      console.log('Native Ad is loading:', data);
    },
    error: (error) => {
      console.error('Native Ad encountered an error:', error);
    },
  },
  render: customRender, // Using CustomRender for native ads
});

// Execute the ad rendering process
adManager.execute();
```

## Customization

adjssdk provides the flexibility to customize how ads are rendered through the CustomRender class. You can define custom HTML templates for different ad types, allowing you to tailor the appearance and structure of ads to match your website’s design.

Defining Custom Templates

Custom templates are defined within `<script>` tags inside the ad slot elements. Each template should have a data-type attribute corresponding to the ad type it represents (e.g., proxy, native, banner).

**Example: Defining a Native Ad Template**

```html
<script type="html/template" data-type="native">
  <a href="{{url}}" target="_blank" class="native-ad">
    <img src="{{mainAsset.path}}" alt="{{fields.title}}" class="ad-image" srcset="{{srcSetThumbs}}" />
    <h2>{{fields.title}}</h2>
    <p>{{fields.description}}</p>
  </a>
</script>
```

### Adding Templates to CustomRender

When initializing the CustomRender instance, add your custom templates using the `.addTemplate()` method.

```javascript
import { CustomRender } from './custom_render.js';

// Initialize CustomRender
const customRender = new CustomRender();

// Add a custom native ad template
customRender.addTemplate('native', `
  <a href="{{url}}" target="_blank" class="native-ad">
    <img src="{{mainAsset.path}}" alt="{{fields.title}}" class="ad-image" srcset="{{srcSetThumbs}}" />
    <h2>{{fields.title}}</h2>
    <p>{{fields.description}}</p>
  </a>
`);

// Add a custom banner ad template
customRender.addTemplate('banner', `
  <div class="custom-banner-ad">
    <a href="{{url}}" target="_blank">
      <img src="{{mainAsset.path}}" alt="Banner Ad" srcset="{{srcSetThumbs}}" />
    </a>
  </div>
`);
```

### Utilizing Custom Templates with EmbeddedAd

Pass the CustomRender instance to the EmbeddedAd or Manager configurations to enable the use of custom templates during ad rendering.

```javascript
import { EmbeddedAd } from './embedded.js';
import { CustomRender } from './custom_render.js';

// Initialize CustomRender and add templates as needed
const customRender = new CustomRender();
customRender.addTemplate('native', `...`);
customRender.addTemplate('banner', `...`);

// Create a new EmbeddedAd instance with CustomRender
const ad = new EmbeddedAd({
  element: 'ad-container',           // ID of the DOM element where the ad will be rendered
  spot_id: 'spot123',                // Your ad spot ID
  JSONPLink: '<https://ads.example.com/getAd>', // Your JSONP endpoint
  render: customRender,              // Use the CustomRender instance
});

// Register event callbacks as needed
ad.on('loading', (data) => { /*... */ })
  .on('render', (success) => { /* ... */ })
  .on('error', (error) => { /* ...*/ });

// Initiate the ad rendering process
ad.render();
```

## Examples

**Example: Defining and Rendering a Native Ad**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Native Ad Example</title>
  <script type="text/javascript" src="https://domain.cdn/adjssdk.js"></script>
</head>
<body>
  <!-- Native Ad Slot -->
  <ins class="myads"
       style="display:block"
       data-ad-slot="native-slot-id"
       data-ad-format="native"
       data-full-width-responsive="true">

    <!-- Native Ad Template -->
    <script type="html/template" data-type="native">
      <a href="{{url}}" target="_blank" class="native-ad">
        <img src="{{mainAsset.path}}" alt="{{fields.title}}" class="ad-image" srcset="{{srcSetThumbs}}" />
        <h2>{{fields.title}}</h2>
        <p>{{fields.description}}</p>
      </a>
    </script>
  </ins>

  <script type="text/javascript">
    import AMG from './path-to-adjssdk.js'; // Adjust the path as necessary
    import { CustomRender } from './custom_render.js'; // Ensure CustomRender is properly imported

    // Initialize CustomRender and add the native ad template
    const customRender = new CustomRender();
    customRender.addTemplate('native', `
      <a href="{{url}}" target="_blank" class="native-ad">
        <img src="{{mainAsset.path}}" alt="{{fields.title}}" class="ad-image" srcset="{{srcSetThumbs}}" />
        <h2>{{fields.title}}</h2>
        <p>{{fields.description}}</p>
      </a>
    `);

    // Initialize the ad manager with a custom mapper for native ads
    AMG.amgConfigure((manager) => {
      manager.setMapper('.myads', {
        srcURL: 'https://ads.example.com/getNativeAd',
        on: {
          loading: (data) => {
            console.log('Native Ad is loading:', data);
          },
          error: (error) => {
            console.error('Native Ad encountered an error:', error);
          },
        },
        render: customRender, // Use CustomRender for native ads
      });
    });
  </script>
</body>
</html>
```

**Example: Handling Errors and Loading Events**

```javascript
import AMG from './path-to-adjssdk.js'; // Adjust the path as necessary
import { CustomRender } from './custom_render.js';

// Initialize CustomRender and add templates
const customRender = new CustomRender();
customRender.addTemplate('banner', `...`);
customRender.addTemplate('native', `...`);

// Initialize the ad manager with custom mappers and event callbacks
AMG.amgConfigure((manager) => {
  manager.setMapper('.ad-slot-banner', {
    srcURL: '<https://ads.example.com/getBannerAd>',
    on: {
      loading: (data) => {
        // Display a loading spinner or message
        document.getElementById('banner-loading').style.display = 'block';
        console.log('Banner Ad is loading:', data);
      },
      error: (error) => {
        // Hide the loading spinner and display an error message
        document.getElementById('banner-loading').style.display = 'none';
        document.getElementById('banner-error').style.display = 'block';
        console.error('Banner Ad encountered an error:', error);
      },
    },
    render: customRender, // Use CustomRender for banner ads
  });

  manager.setMapper('.ad-slot-native', {
    srcURL: '<https://ads.example.com/getNativeAd>',
    on: {
      loading: (data) => {
        // Display a loading spinner or message
        document.getElementById('native-loading').style.display = 'block';
        console.log('Native Ad is loading:', data);
      },
      error: (error) => {
        // Hide the loading spinner and display an error message
        document.getElementById('native-loading').style.display = 'none';
        document.getElementById('native-error').style.display = 'block';
        console.error('Native Ad encountered an error:', error);
      },
    },
    render: customRender, // Use CustomRender for native ads
  });
});
```

## Customization

### CustomRender Class

The CustomRender class allows you to define and manage custom HTML templates for different ad types. This enables you to tailor the appearance and structure of ads to match your website’s design and layout.

**Adding Custom Templates**

You can add custom templates using the .addTemplate() method by specifying the ad type and the corresponding HTML template.

```javascript
import { CustomRender } from './custom_render.js';

// Initialize CustomRender
const customRender = new CustomRender();

// Add a custom native ad template
customRender.addTemplate('native', `
  <a href="{{url}}" target="_blank" class="native-ad">
    <img src="{{mainAsset.path}}" alt="{{fields.title}}" class="ad-image" srcset="{{srcSetThumbs}}" />
    <h2>{{fields.title}}</h2>
    <p>{{fields.description}}</p>
  </a>
`);

// Add a custom banner ad template
customRender.addTemplate('banner', `
  <div class="custom-banner-ad">
    <a href="{{url}}" target="_blank">
      <img src="{{mainAsset.path}}" alt="Banner Ad" srcset="{{srcSetThumbs}}" />
    </a>
  </div>
`);
```

### Manager Class

The Manager class orchestrates multiple ad mappers, each responsible for handling different ad placements and configurations. By using the Manager class, you can efficiently manage and render multiple ads across your website.

**Setting Up Ad Mappers**

Use the `.setMapper()` method to register new ad mappers by specifying a CSS selector and the corresponding configuration.

```javascript
import { Manager } from './manager.js';
import { CustomRender } from './custom_render.js';

// Initialize the Manager
const adManager = new Manager();

// Initialize CustomRender and add templates as needed
const customRender = new CustomRender();
customRender.addTemplate('banner', `...`);
customRender.addTemplate('native', `...`);

// Set up a mapper for banner ads
adManager.setMapper('.ad-slot-banner', {
  srcURL: '<https://ads.example.com/getBannerAd>',
  on: {
    loading: (data) => {
      console.log('Banner Ad is loading:', data);
    },
    error: (error) => {
      console.error('Banner Ad encountered an error:', error);
    },
  },
  render: customRender, // Use CustomRender for banner ads
});

// Set up a mapper for native ads
adManager.setMapper('.ad-slot-native', {
  srcURL: '<https://ads.example.com/getNativeAd>',
  on: {
    loading: (data) => {
      console.log('Native Ad is loading:', data);
    },
    error: (error) => {
      console.error('Native Ad encountered an error:', error);
    },
  },
  render: customRender, // Use CustomRender for native ads
});

// Execute the ad rendering process
adManager.execute();
```

## License

This project is licensed under the MIT License.

Note: Ensure that all paths in the `<script>` tags and import statements correctly point to the respective JavaScript modules in your project structure. Adjust the URLs and configurations as needed to match your ad server endpoints and ad slot identifiers.
