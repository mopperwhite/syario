require 'redcarpet'
A___SELF = self
class MdRender < Redcarpet::Render::HTML

  def image(src, title, alt_text)
    p A___SELF
    %Q{<img
      src=#{
        src.start_with?('asserts/') ?
          A___SELF.as_assert(File.join(A___SELF.src_dir, src)) :
          src}
      alt=#{alt_text}>
    #{title}</img>}
  end
end
on_ext :md
for_each do |src, dst|
    File.write dst, Redcarpet::Markdown
        .new(MdRender)
        .render(File.read src)
end
