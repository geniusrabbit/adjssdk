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

> TODO

```html
<script type="text/javascript" async src="https://domain.cdn/ads.js?client=ra-pub-84882993766123"  crossorigin="anonymous"></script>
<ins
  style="display:block"
  data-rad-client="ra-pub-84882993766123"
  data-rad-slot="278774663878"
  data-rad-format="auto"
  data-full-width-responsive="true"><!--

  // IN COMMENT: Default advertisement code if no ad is available ...
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4400168223356384" crossorigin="anonymous"></script>
  <ins class="adsbygoogle"
    style="display:block"
    data-ad-client="ca-pub-4400168223356384"
    data-ad-slot="1760661772"
    data-ad-format="auto"
    data-full-width-responsive="true"></ins>
  <script>
    (adsbygoogle = window.adsbygoogle || []).push({});
  </script>

--></ins>
```
