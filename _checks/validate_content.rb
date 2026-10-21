require 'jekyll'
require 'json'
require 'digest'

root = File.expand_path('..', __dir__)
site = Jekyll::Site.new(Jekyll.configuration('source' => root, 'quiet' => true))
site.reset
site.read
errors = []
posts = site.posts.docs
published = JSON.parse(File.read(File.join(__dir__, 'fixtures/published-posts.json')))

published.each do |expected|
  post = posts.find { |item| item.relative_path == expected['path'] }
  if post.nil?
    errors << "Artículo desaparecido: #{expected['path']}"
    next
  end
  errors << "URL modificada: #{expected['path']}" unless post.url == expected['url']
  %w[categories tags].each do |key|
    errors << "#{key} modificadas: #{expected['path']}" unless post.data[key] == expected[key]
  end
end

models = site.collections.fetch('models').docs
brands = site.data.fetch('brands')
types = site.data.fetch('content_types')
model_ids = models.map { |model| model.data['model_id'] }
errors << 'Identificadores de modelo vacíos o duplicados' if model_ids.any? { |id| id.nil? || id.empty? } || model_ids.uniq.size != models.size

models.each do |model|
  id = model.data['model_id']
  errors << "Marca inexistente para el modelo #{id}" unless brands.key?(model.data['brand_id'])
  related = posts.select { |post| post.data['model_id'] == id }
  errors << "Modelo sin publicaciones: #{id}" if related.empty?
end

posts.each do |post|
  type = post.data['content_type']
  errors << "Tipo de contenido inválido: #{post.relative_path}" unless types.key?(type)
  next unless %w[review parts].include?(type) || post.data['model_id']
  model = models.find { |item| item.data['model_id'] == post.data['model_id'] }
  if model.nil?
    errors << "Modelo inexistente: #{post.relative_path}"
  elsif model.data['brand_id'] != post.data['brand_id']
    errors << "Marca distinta a la del modelo: #{post.relative_path}"
  end
end

if ENV['VERIFY_UNCHANGED_BODY'] == '1'
  baseline = JSON.parse(File.read(File.join(root, '.local/post-baseline.json')))
  baseline.each do |expected|
    post = posts.find { |item| item.relative_path == expected['path'] }
    errors << "Texto del artículo modificado: #{expected['path']}" if post && Digest::SHA256.hexdigest(post.content) != expected['body_sha256']
  end
end

unless errors.empty?
  warn errors.join("\n")
  exit 1
end

puts "Contenido validado: #{posts.size} publicaciones, #{models.size} modelos, #{brands.size} marcas."
puts "URLs, categorías y etiquetas de los #{published.size} artículos publicados conservadas."
puts 'Textos de los artículos conservados.' if ENV['VERIFY_UNCHANGED_BODY'] == '1'
