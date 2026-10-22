require 'jekyll'
require 'nokogiri'
require 'time'
require 'uri'

site = Jekyll::Site.new(Jekyll.configuration('source' => Dir.pwd, 'destination' => File.join(Dir.pwd, '_site')))
site.read
baseurl = (ARGV[0] || '').delete_suffix('/')
posts = site.posts.docs.to_h { |post| [post.url, post] }
timestamps = posts.to_h do |url, post|
  video = site.data.fetch('video_dates')[post.data['video_id']]
  [url, video ? Time.iso8601(video.fetch('published_at')).to_i : post.date.to_i]
end
ordered_urls = posts.keys.sort_by { |url| [-timestamps.fetch(url), url] }

def output_file(destination, url)
  return File.join(destination, url, 'index.html') if url.end_with?('/')
  path = File.join(destination, url)
  File.file?(path) ? path : path + '.html'
end

normalize = ->(href) { URI(href).path.delete_prefix(baseurl).sub(%r{\A/en(?=/)}, '') }
card_urls = ->(nodes) { nodes.map { |node| normalize.call(node.at_css('h2 a, h3 a')['href']) } }
check_order = lambda do |urls, context|
  raise "Entradas repetidas: #{context}" unless urls.uniq == urls
  raise "Entrada desconocida: #{context}" unless urls.all? { |url| timestamps.key?(url) }
  expected = urls.sort_by { |url| [-timestamps.fetch(url), url] }
  raise "Orden distinto a la fecha del vídeo: #{context}" unless urls == expected
end

grids = 0
Dir.glob(File.join(site.dest, '**', '*.html')).each do |path|
  document = Nokogiri::HTML(File.read(path))
  document.css('.article-grid').each do |grid|
    cards = grid.element_children.select { |node| node['class'].to_s.split.include?('article-card') && !node['class'].to_s.split.include?('model-card') }
    next if cards.empty?
    check_order.call(card_urls.call(cards), path)
    grids += 1
  end
end

['', '/en'].each do |locale|
  { '/blog/' => posts.values, '/reviews' => site.categories.fetch('reviews'), '/guias/' => site.categories.fetch('manuales') }.each do |route, expected_posts|
    document = Nokogiri::HTML(File.read(output_file(site.dest, locale + route)))
    urls = card_urls.call(document.css('#archive-list > .article-card'))
    raise "Faltan entradas en #{locale}#{route}" unless urls.sort == expected_posts.map(&:url).sort
  end
  home = Nokogiri::HTML(File.read(output_file(site.dest, locale + '/')))
  featured = normalize.call(home.at_css('.featured-story h2 a')['href'])
  home_urls = [featured] + card_urls.call(home.css('.featured-side > .article-card'))
  raise "La portada no destaca las entradas más recientes: #{locale}" unless home_urls == ordered_urls.first(3)

  site.categories.each do |category, category_posts|
    document = Nokogiri::HTML(File.read(output_file(site.dest, locale + '/categorias/')))
    nodes = document.css("section[id='#{Jekyll::Utils.slugify(category)}'] .article-card")
    expected = ordered_urls.select { |url| category_posts.include?(posts.fetch(url)) }.first(3)
    raise "Destacados incorrectos de categoría #{locale} #{category}" unless card_urls.call(nodes) == expected
  end

  ordered_urls.each_with_index do |url, index|
    post = posts.fetch(url)
    next unless post.data['layout'] == 'post'
    document = Nokogiri::HTML(File.read(output_file(site.dest, locale + url)))
    actual = document.css('.post-navigation > a').map { |link| normalize.call(link['href']) }
    expected = []
    expected << ordered_urls[index + 1] if index + 1 < ordered_urls.size
    expected << ordered_urls[index - 1] if index.positive?
    raise "Anterior/siguiente no respeta la cronología: #{locale}#{url}" unless actual == expected
  end
end

puts "Cronología validada: #{grids} listados ES/EN, todas las entradas, destacados y navegación anterior/siguiente."
