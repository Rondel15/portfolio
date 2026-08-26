(function () {
  function run() {
    var container = document.querySelector('.HeroLayout_module_media .Thumbnails_module_list');
    if (!container) { alert('Thumbnails container not found'); return; }

    var imgs = container.querySelectorAll('img.ThumbnailImage_module_thumbImage');
    if (!imgs.length) { alert('No thumbnail images found'); return; }

    var base = 'https://ecom-admin.nespresso.com';
    var urls = Array.prototype.map.call(imgs, function (img) {
      var src = img.getAttribute('src');
      if (!src) return null;
      if (src.indexOf('http') === 0) return src;
      return base + (src.indexOf('/') === 0 ? src : '/' + src);
    }).filter(Boolean);

    urls = urls.filter(function (u, i) { return urls.indexOf(u) === i; }); // dedupe

    var h1 = document.querySelector('h1');
    var title = h1 ? h1.textContent.trim() : 'images';
    var zipName = title + ' PDH.zip';

    var zip = new JSZip();
    var fetches = urls.map(function (url, idx) {
      return fetch(url)
        .then(function (res) {
          if (!res.ok) throw new Error('Failed: ' + url);
          return res.blob();
        })
        .then(function (blob) {
          var name = url.split('/').pop().split('?')[0] || ('image-' + idx + '.png');
          zip.file(name, blob);
        })
        .catch(function (err) { console.error(err); });
    });

    Promise.all(fetches).then(function () {
      zip.generateAsync({ type: 'blob' }).then(function (content) {
        var a = document.createElement('a');
        var objUrl = URL.createObjectURL(content);
        a.href = objUrl;
        a.download = zipName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(objUrl);
      });
    });
  }

  if (typeof JSZip === 'undefined') {
    var s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
    s.onload = run;
    document.head.appendChild(s);
  } else {
    run();
  }
})();