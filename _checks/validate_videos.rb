require 'jekyll'

site = Jekyll::Site.new(Jekyll.configuration('source' => Dir.pwd, 'destination' => File.join(Dir.pwd, '_site')))
site.read
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
  end
  raise "Falta un título accesible en #{post.url}" unless html.scan(%r{<iframe\b[^>]*title="[^"]+"}).size == ids.size
  if post.data['last_modified_at']
    label = "Actualizado el #{post.data['last_modified_at'].strftime('%d/%m/%Y')}"
    raise "La revisión no tiene fecha visible en #{post.url}" unless html.include?(label)
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
puts "Vídeos validados: #{linked_posts.size} entradas con sus vídeos y fichas de modelo coherentes."
