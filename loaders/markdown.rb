require 'redcarpet'
A___SELF = self
class MdRender < Redcarpet::Render::HTML
  def image(src, title, alt_text)
    url = src.start_with?('asserts/') ?
            A___SELF.as_assert(File.join(A___SELF.src_dir, src)) :
            src
    %Q{
    <a href="#{url}" target="_blank" class="center-block">
      <img
        class="img-responsive center-block"
        src=#{url}
        alt=#{alt_text}>
      #{title}</img>
    </a>}
  end
end
on_ext :md
for_each do |src, dst|
    next if File.exists?(dst) && File.mtime(dst) >= File.mtime(src)
    res = Redcarpet::Markdown
        .new(MdRender)
        .render(File.read src)
    File.write dst, res
end
