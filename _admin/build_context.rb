require 'jekyll'
require 'json'
require 'fileutils'

root = File.expand_path('..', __dir__)
site = Jekyll::Site.new(Jekyll.configuration('source' => root, 'quiet' => true))
site.reset
site.read
settings = site.data.fetch('affiliate_admin')
products = site.data.fetch('affiliate_links').fetch('products')
posts = site.posts.docs.select { |post| post.data['affiliate_products'] }
baseurl = site.config.fetch('baseurl', '')
references = posts.map do |post|
  { 'title' => post.data['title'], 'url' => "#{baseurl}#{post.url}", 'path' => post.url, 'products' => post.data['affiliate_products'] }
end
context = {
  'repository' => settings.fetch('repository'),
  'branch' => settings.fetch('branch'),
  'models' => site.collections.fetch('models').docs.map { |model| { 'id' => model.data['model_id'], 'name' => model.data['title'] } },
  'usages' => products.to_h { |product| [product.fetch('id'), references.select { |post| post['products'].include?(product['id']) }.map { |post| post.slice('title', 'url') }] }
}
output = File.join(__dir__, 'generated')
FileUtils.mkdir_p(output)
File.write(File.join(output, 'context.json'), JSON.pretty_generate(context))
File.write(File.join(output, 'references.json'), JSON.pretty_generate(references))
puts 'Contexto del gestor generado fuera del sitio público.'
