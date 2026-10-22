require 'nokogiri'
require 'uri'
require 'cgi'

destination = File.expand_path(ARGV[0] || '_site')
baseurl = (ARGV[1] || '').delete_suffix('/')
errors = []
count = 0

def output_file(destination, route)
  route = CGI.unescape(route)
  return File.join(destination, route, 'index.html') if route.end_with?('/')
  path = File.join(destination, route)
  File.file?(path) ? path : path + '.html'
end

Dir.glob(File.join(destination, 'en', '**', '*.html')).each do |file|
  html = Nokogiri::HTML(File.read(file, encoding: 'UTF-8'))
  next unless html.at_css('.language-selector')
  count += 1
  errors << "Wrong lang: #{file}" unless html.at_css('html')['lang'] == 'en'
  pairs = html.css('link[hreflang]').to_h { |link| [link['hreflang'], URI(link['href']).path] }
  errors << "Missing language metadata: #{file}" unless pairs.keys.sort == %w[en es x-default]
  next unless pairs['es'] && pairs['en']
  errors << "Mismatched language pair: #{file}" unless pairs['en'].delete_prefix(baseurl) == '/en' + pairs['es'].delete_prefix(baseurl)
  canonical = html.at_css('link[rel="canonical"]')
  errors << "Wrong canonical: #{file}" unless canonical && URI(canonical['href']).path == pairs['en']
  original_path = output_file(destination, pairs['es'].delete_prefix(baseurl))
  if File.file?(original_path)
    original = Nokogiri::HTML(File.read(original_path, encoding: 'UTF-8'))
    alternate = original.at_css('link[hreflang="en"]')
    errors << "Missing reciprocal alternate: #{file}" unless alternate && URI(alternate['href']).path == pairs['en']
    errors << "Wrong Spanish lang: #{original_path}" unless original.at_css('html')['lang'] == 'es'
    videos = ->(document) { document.css('iframe[src*="youtube"]').map { |frame| frame['src'] } }
    errors << "Video changed between languages: #{file}" unless videos.call(html) == videos.call(original)
    offers = ->(document) { document.css('a[rel~="sponsored"]').map { |link| link['href'] }.sort }
    errors << "Affiliate links changed between languages: #{file}" unless offers.call(html) == offers.call(original)
  else
    errors << "Missing Spanish page: #{original_path}"
  end
  html.css('a[href]').each do |link|
    route = link['href'].split(/[?#]/).first.to_s
    next unless route.start_with?('/') && !route.start_with?('//')
    next unless baseurl.empty? || route.start_with?(baseurl + '/')
    route = route.delete_prefix(baseurl)
    target = output_file(destination, route)
    errors << "Broken internal link: #{file}: #{route}" unless File.file?(target)
    if !link['data-language-link'] && !%w[/feed.xml].include?(route) && !route.start_with?('/en/', '/img/', '/assets/')
      errors << "Link loses English: #{file}: #{route}"
    end
  end
  html.css('script, style, [data-language-link]').remove
  text = html.text.gsub(/\s+/, ' ')
  errors << "Unrendered Liquid: #{file}" if html.to_html.include?('{{') || html.to_html.include?('{%')
  errors << "Spanish UI or excerpt: #{file}" if text.match?(/[áéíóúñ¿¡]|PUBLICACION|Todas las|publicaciones|lectura|Buscar en|En el siguiente|El Wltoys|El MJX|El Traxxas/)
end
errors << 'No English pages were generated' if count.zero?
abort errors.uniq.join("\n") unless errors.empty?
puts "Validated #{count} ES/EN page pairs: language metadata, links and rendered content."
