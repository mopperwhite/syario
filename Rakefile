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

task :publish => [:rebuild_gh_pages, :clean_generated_files, :gen, :commit_gh_pages] do
  system 'git push origin gh-pages'
  system 'git checkout master'
end

task :clean_generated_files do
  FileUtils.remove_dir 'dist/files'
end

task :rebuild_gh_pages do
  system 'git push origin --delete gh-pages'
  system 'git checkout -B gh-pages'
  system 'git rm .gitignore'
  File.write '.gitignore', 'node_modules'
  system 'npm run dev'
end

task :commit_gh_pages do
  system 'git add . && git commit -m "Auto commit"'
end
