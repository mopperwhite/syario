require 'redcarpet'
on_ext :md
for_each do |src, dst|
    File.write dst, Redcarpet::Markdown
        .new(Redcarpet::Render::HTML)
        .render(File.read src)
end
