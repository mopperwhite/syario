on_ext :png, :jpg, :jpeg
for_each do |src, dst|
  next if File.exists?(dst) && File.mtime(dst) >= File.mtime(src)
  File.write dst, %Q{
    <img class="img-responsive center-block" src="#{
      as_assert(src)
    }" />
  }
end
