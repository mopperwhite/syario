on_ext :png, :jpg, :jpeg
for_each do |src, dst|
  File.write dst, %Q{
    <img src="#{as_assert src}" />
  }
end
