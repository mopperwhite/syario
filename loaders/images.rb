on_ext :png, :jpg, :jpeg
for_each do |src, dst|
  File.write dst, %Q{
    <img class="img-responsive center-block" src="#{
      src.start_with?('asserts/') ?
        as_assert(src) :
        src}" />
  }
end
