#!/usr/bin/env ruby
#encoding=utf-8
require './create-index.rb'
task :init do
    File.mkdir '_files'
    puts "Now you can put your files in files/ and run `rake gen'"
end

task :gen do
    IndexCreator
        .from_loaders_at('loaders', url_root: 'dist/files')
        .create_index('_files', 'dist/files')
end

task :server do
    system 'jekyll server'
end
