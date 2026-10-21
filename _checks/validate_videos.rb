require 'jekyll'

site = Jekyll::Site.new(Jekyll.configuration('source' => Dir.pwd, 'destination' => File.join(Dir.pwd, '_site')))
site.read
linked_posts = site.posts.docs.select { |post| post.data['video_id'] }
linked_posts.each do |post|
  id = post.data['video_id']
  raise "ID de YouTube inválido: #{post.relative_path}" unless id.is_a?(String) && id.match?(/\A[A-Za-z0-9_-]{11}\z/)
  html = File.read(post.destination(site.dest))
  embeds = html.scan(%r{src="https://www\.youtube(?:-nocookie)?\.com/embed/([^"?]+)})
  raise "Vídeo duplicado, ausente o distinto en #{post.url}" unless embeds == [[id]]
  raise "Falta el enlace directo en #{post.url}" unless html.include?("https://www.youtube.com/watch?v=#{id}")
  raise "Falta un título accesible en #{post.url}" unless html.match?(%r{<iframe\b[^>]*title="[^"]+"})
  if post.data['last_modified_at']
    label = "Actualizado el #{post.data['last_modified_at'].strftime('%d/%m/%Y')}"
    raise "La revisión no tiene fecha visible en #{post.url}" unless html.include?(label)
  end
end
models = site.collections.fetch('models').docs
models.each do |model|
  review = site.posts.docs.select { |post| post.data['model_id'] == model.data['model_id'] && post.data['content_type'] == 'review' }.sort_by(&:date).reverse.first
  primary_id = review&.data&.fetch('video_id', nil)
  next unless primary_id
  legacy_id = model.data['video_id']
  raise "Vídeos contradictorios en el modelo #{model.data['model_id']}" if legacy_id && legacy_id != primary_id
  html = File.read(model.destination(site.dest))
  raise "La ficha no enlaza el vídeo de su review: #{model.url}" unless html.include?("https://www.youtube.com/watch?v=#{primary_id}")
end
puts "Vídeos validados: #{linked_posts.size} entradas con vídeo único y fichas de modelo coherentes."
