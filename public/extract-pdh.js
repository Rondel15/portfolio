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

    urls = urls.filter(function (u, i) { return urls.indexOf(u) === i; });

    console.log('Found ' + urls.length + ' image URLs:', urls);

    var h1 = document.querySelector('h1');
    var title = h1 ? h1.textContent.trim() : 'images';
    var zipName = title + ' PDH.zip';

    var zip = new JSZip();
    var successCount = 0;
    var failed = [];

    var fetches = urls.map(function (url, idx) {
      return fetch(url)
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.blob();
        })
        .then(function (blob) {
          var name = url.split('/').pop().split('?')[0] || ('image-' + idx + '.png');
          zip.file(name, blob);
          successCount++;
        })
        .catch(function (err) {
          console.error('FAILED: ' + url, err);
          failed.push(url);
        });
    });

    Promise.all(fetches).then(function () {
      console.log('Success: ' + successCount + ' / ' + urls.length);
      if (failed.length) console.log('Failed URLs:', failed);

      if (successCount === 0) {
        alert('All ' + urls.length + ' image downloads failed (likely CORS). Check console for details.');
        return;
      }

      zip.generateAsync({ type: 'blob' }).then(function (content) {
        var a = document.createElement('a');
        var objUrl = URL.createObjectURL(content);
        a.href = objUrl;
        a.download = zipName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(objUrl);
        if (failed.length) {
          alert('Zip created with ' + successCount + '/' + urls.length + ' images. ' + failed.length + ' failed — see console.');
        }
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