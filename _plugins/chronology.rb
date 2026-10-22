require 'time'

module TopeRCChronology
  module Filters
    # Keep article publication dates and permalinks intact. Only the displayed
    # order changes, using the verified publication instant of the main video.
    def video_chronology(documents)
      dates = @context.registers[:site].data.fetch('video_dates', {})
      Array(documents).sort_by do |document|
        data = document.respond_to?(:data) ? document.data : document
        video = dates[data['video_id']]
        published = video ? video.fetch('published_at') : data['date']
        timestamp = published.is_a?(String) ? Time.iso8601(published) : published.to_time
        url = document.respond_to?(:url) ? document.url : data['url']
        [-timestamp.to_i, url.to_s]
      end
    end
  end
end

Liquid::Template.register_filter(TopeRCChronology::Filters)
