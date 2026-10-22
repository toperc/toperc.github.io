# English pages are generated separately so the original post/category indexes and
# published Spanish URLs stay stable. No translation service runs in the browser.
require 'nokogiri'

module TopeRCLocalization
  def self.translate(site, text)
    return text unless text.is_a?(String)
    dictionary = site.data.fetch('english', {})
    normalized = text.gsub(/\s+/, ' ').strip
    translated = dictionary[normalized]
    # Some metadata joins labels and dates in the same text node.
    if !translated && normalized.include?(' · ')
      translated = normalized.split(' · ').map { |part| translate(site, part) }.join(' · ')
    end
    unless translated
      site.data.fetch('english_patterns', []).each do |entry|
        match = Regexp.new("\\A#{entry['match']}\\z").match(normalized)
        next unless match
        translated = entry['text'].gsub(/\$(\d+)/) { translate(site, match[Regexp.last_match(1).to_i].to_s) }
        break
      end
    end
    return text unless translated
    text.sub(/\S(?:[\s\S]*\S)?/, translated)
  end

  class Generator < Jekyll::Generator
    safe true
    priority :low

    def generate(site)
      originals = site.pages.select { |p| p.data['layout'] && !p.url.start_with?('/admin/') }
      originals += site.posts.docs + site.collections.fetch('models').docs + site.collections.fetch('tag').docs
      pairs = {}
      originals.each do |original|
        spanish_url = original.url
        english_url = "/en#{spanish_url}"
        original.data['lang'] = 'es'
        original.data['language_urls'] = { 'es' => spanish_url, 'en' => english_url }
        pairs[spanish_url] = english_url
      end
      site.config['language_pairs'] = pairs
      site.config['english_documents'] = {}

      originals.each do |original|
        path = original.respond_to?(:relative_path) ? original.relative_path.sub(%r{\A/}, '') : original.path
        translation_path = File.join(site.source, '_translations', 'en', path)
        body = original.content.to_s
        translated_data = {}
        if File.file?(translation_path)
          source = File.read(translation_path, encoding: 'UTF-8')
          if (front_matter = /\A---\s*\n(.*?)\n---\s*\n/m.match(source))
            translated_data = SafeYAML.load(front_matter[1]) || {}
            body = source[front_matter[0].length..]
          else
            body = source
          end
        elsif original.is_a?(Jekyll::Document) && original.collection.label == 'posts'
          raise Jekyll::Errors::FatalException, "Missing English article: #{translation_path}"
        end
        extension = File.extname(path)
        english = Jekyll::PageWithoutAFile.new(site, site.source, '', "english-#{site.pages.size}#{extension}")
        english.data = original.data.dup
        %w[title description subtitle eyebrow].each do |key|
          english.data[key] = TopeRCLocalization.translate(site, english.data[key]) if english.data[key]
        end
        english.data.merge!(translated_data)
        # Titles also appear in previous/next links and partner cards, which
        # intentionally keep using the original Spanish document indexes.
        %w[title description subtitle video_title].each do |key|
          if translated_data[key] && original.data[key]
            site.data['english'][original.data[key].gsub(/\s+/, ' ').strip] = translated_data[key]
          end
        end
        english.data['lang'] = 'en'
        english.data['permalink'] = original.data['language_urls']['en']
        english.data['date'] = original.date if original.respond_to?(:date)
        english.data['previous'] = original.previous if original.respond_to?(:previous)
        english.data['next'] = original.next if original.respond_to?(:next)
        english.content = body
        # Translate before truncation when a card or the home page uses an excerpt.
        excerpt = body.split('<!--more-->').first.to_s
        excerpt = site.liquid_renderer.file("#{path}:english-excerpt").parse(excerpt).render!(
          site.site_payload.merge('page' => english.data),
          registers: { site: site, page: english.data }
        )
        english.data['excerpt'] = site.find_converter_instance(Jekyll::Converters::Markdown).convert(excerpt)
        if english.data['description'].to_s.empty? && excerpt.strip.empty?
          english.data['description'] = "RC car reviews, guides and spare parts from TopeRC."
        end
        site.config['english_documents'][original.url] = english
        site.pages << english
      end
    end
  end

  module Filters
    def localized_document(document)
      return document unless @context.registers[:page]['lang'] == 'en' && document
      url = document.respond_to?(:url) ? document.url : document['url']
      @context.registers[:site].config.fetch('english_documents', {}).fetch(url, document)
    end
  end

  def self.localize_html(page)
    return unless page.data['lang'] == 'en' && page.output_ext == '.html'
    site = page.site
    html = Nokogiri::HTML(page.output)
    html.css('html').each { |node| node['lang'] = 'en' }
    html.xpath('//text()[not(ancestor::script or ancestor::style or ancestor::code or ancestor::pre)]').each do |node|
      # Language names always use their native spelling.
      next if node.ancestors.any? { |parent| parent['data-language-link'] }
      node.content = translate(site, node.text)
    end
    html.css('*').each do |node|
      %w[alt title placeholder aria-label data-search-text].each do |attribute|
        node[attribute] = translate(site, node[attribute]) if node[attribute]
      end
      next unless node['href'] && node.name == 'a' && !node['data-language-link']
      base = site.baseurl.to_s
      path, suffix = node['href'].split(/(?=[?#])/, 2)
      next unless base.empty? || path.start_with?(base + '/')
      relative = base.empty? ? path : path.delete_prefix(base)
      target = site.config['language_pairs'][relative]
      # Legacy Markdown links sometimes omit the published trailing slash.
      target ||= site.config['language_pairs'][relative + '/']
      node['href'] = base + target + suffix.to_s if target
    end
    page.output = html.to_html
  end
end

Liquid::Template.register_filter(TopeRCLocalization::Filters)
Jekyll::Hooks.register :pages, :post_render do |page|
  TopeRCLocalization.localize_html(page)
end
