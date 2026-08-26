(function () {
  var container = document.querySelector('.HeroLayout_module_media .Thumbnails_module_list');
  if (!container) { alert('Thumbnails container not found'); return; }

  var imgs = container.querySelectorAll('img.ThumbnailImage_module_thumbImage');
  if (!imgs.length) { alert('No thumbnail images found'); return; }

  var base = 'https://ecom-admin.nespresso.com';
  var urls = Array.from(imgs).map(function (img) {
    var src = img.getAttribute('src');
    if (!src) return null;
    if (src.indexOf('http') !== 0) {
      src = base + (src.indexOf('/') === 0 ? src : '/' + src);
    }
    return src.replace('impolicy=small&imwidth=192', 'impolicy=medium&imwidth=800');
  }).filter(Boolean);

  urls = [...new Set(urls)];

  console.log('Opening ' + urls.length + ' image tabs:', urls);

  urls.forEach(function (url) {
    window.open(url, '_blank');
  });
})();