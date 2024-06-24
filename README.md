# adjssdk

Opensource advertisement render SDK for Web

## Usage

```html
<script type="text/javascript" src="https://domain.cdn/embedded.js"></script>

<ins id="advertisement-side-block"></ins>
<script type="text/javascript">!(function(){
  (new EmbeddedAd({element: "advertisement-side-block", zone_id: 1}))
    .on('error', function(err) {console.log(err);})
    .on('loading', function(data) {console.log(data);})
    .render();
})();
</script>
```
