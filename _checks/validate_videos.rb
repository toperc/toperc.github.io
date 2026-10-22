require 'jekyll'
require 'nokogiri'
require 'time'

site = Jekyll::Site.new(Jekyll.configuration('source' => Dir.pwd, 'destination' => File.join(Dir.pwd, '_site')))
site.read
video_dates = site.data.fetch('video_dates')
ENV['TZ'] = 'Europe/Madrid'
video_dates.each do |id, record|
  raise "Fecha de vídeo inválida: #{id}" unless record['published_on'].is_a?(String) && record['published_on'].match?(/\A\d{4}-\d{2}-\d{2}\z/)
  expected = Time.iso8601(record.fetch('published_at')).getlocal.strftime('%Y-%m-%d')
  raise "La fecha no respeta Europe/Madrid: #{id}" unless record['published_on'] == expected
  raise "Falta la fuente de la fecha: #{id}" unless record['source_url'] == "https://www.youtube.com/watch?v=#{id}"
  raise "Falta la fecha de comprobación: #{id}" unless record['checked_on'].is_a?(String) && Date.iso8601(record['checked_on'])
end
site.posts.docs.each do |post|
  raise "Los vídeos adicionales necesitan un vídeo principal: #{post.relative_path}" if post.data['additional_videos'] && !post.data['video_id']
end
linked_posts = site.posts.docs.select { |post| post.data['video_id'] }
linked_posts.each do |post|
  additional = post.data.fetch('additional_videos', [])
  raise "Lista de vídeos inválida: #{post.relative_path}" unless additional.is_a?(Array) && additional.all? { |video| video.is_a?(Hash) && video['title'].is_a?(String) && !video['title'].strip.empty? }
  ids = [post.data['video_id']] + additional.map { |video| video['id'] }
  raise "ID de YouTube inválido: #{post.relative_path}" unless ids.all? { |id| id.is_a?(String) && id.match?(/\A[A-Za-z0-9_-]{11}\z/) }
  raise "Vídeo repetido en #{post.relative_path}" unless ids.uniq == ids
  html = File.read(post.destination(site.dest))
  embeds = html.scan(%r{src="https://www\.youtube(?:-nocookie)?\.com/embed/([^"?]+)})
  raise "Vídeo duplicado, ausente o distinto en #{post.url}" unless embeds == ids.map { |id| [id] }
  ids.each do |id|
    raise "Falta el enlace directo en #{post.url}" unless html.include?("https://www.youtube.com/watch?v=#{id}")
    raise "Falta verificar la fecha de YouTube: #{id}" unless video_dates.key?(id)
  end
  raise "Falta un título accesible en #{post.url}" unless html.scan(%r{<iframe\b[^>]*title="[^"]+"}).size == ids.size
  [['es', post.destination(site.dest)], ['en', File.join(site.dest, 'en', post.url, 'index.html')]].each do |lang, path|
    document = Nokogiri::HTML(File.read(path))
    expected_ids = document.css('.article-video [data-video-published]').map { |node| node['data-video-published'] }
    raise "Faltan fechas de las partes: #{lang} #{post.url}" unless expected_ids == ids
    ids.each do |id|
      node = document.at_css(".article-video [data-video-published='#{id}']")
      expected_date = video_dates.fetch(id).fetch('published_on')
      expected_label = lang == 'es' ? 'Vídeo publicado el' : 'Video published on'
      raise "Fecha original incorrecta: #{lang} #{id}" unless node.at_css('time')['datetime'] == expected_date && node.text.include?(expected_label)
      raise "Fecha original no visible: #{lang} #{id}" unless node.at_css('time').text == Date.iso8601(expected_date).strftime('%d/%m/%Y')
    end
    original_date = document.at_css('.article-original-video-date time')
    raise "Falta fecha del vídeo en la cabecera: #{lang} #{post.url}" unless original_date && original_date['datetime'] == video_dates.fetch(ids.first).fetch('published_on')
    article_date = document.at_css('.article-publication-date time')
    raise "La fecha del artículo debe conservarse: #{lang} #{post.url}" unless article_date && article_date.text == post.date.strftime('%d/%m/%Y')
    if post.data['last_modified_at']
      updated = document.at_css('.article-modified-date time')
      raise "La revisión no tiene fecha visible: #{lang} #{post.url}" unless updated && updated.text == post.data['last_modified_at'].strftime('%d/%m/%Y')
    end
  end
end
%w[index.html blog/index.html en/index.html en/blog/index.html].each do |path|
  document = Nokogiri::HTML(File.read(File.join(site.dest, path)))
  document.css('[data-content-video]').each do |node|
    expected = video_dates.fetch(node['data-content-video']).fetch('published_on')
    label = path.start_with?('en/') ? 'Video from' : 'Vídeo del'
    raise "La tarjeta no muestra la fecha del vídeo: #{path}" unless node.at_css('time')['datetime'] == expected && node.text.include?(label)
  end
  document.css('.article-card.video-card').each do |node|
    raise "Tarjeta sin fecha original: #{path}" unless node.at_css('.card-bottom [data-content-video]')
  end
  document.css('.article-card:not(.video-card)').each do |node|
    raise "Tarjeta sin fecha de artículo: #{path}" unless node.at_css('.card-bottom .content-date time')
  end
end
models = site.collections.fetch('models').docs
models.each do |model|
  site.posts.docs.select { |post| Array(post.data['related_model_ids']).include?(model.data['model_id']) }.each do |post|
    raise "Falta la guía compartida en #{model.url}" unless File.read(model.destination(site.dest)).include?(post.url)
  end
  review = site.posts.docs.select { |post| post.data['model_id'] == model.data['model_id'] && post.data['content_type'] == 'review' }.sort_by(&:date).reverse.first
  primary_id = review&.data&.fetch('video_id', nil)
  next unless primary_id
  legacy_id = model.data['video_id']
  raise "Vídeos contradictorios en el modelo #{model.data['model_id']}" if legacy_id && legacy_id != primary_id
  html = File.read(model.destination(site.dest))
  raise "La ficha no enlaza el vídeo de su review: #{model.url}" unless html.include?("https://www.youtube.com/watch?v=#{primary_id}")
end
puts "Vídeos validados: #{linked_posts.size} entradas, #{video_dates.size} fechas originales en ES/EN, tarjetas y fichas de modelo coherentes."
