#!/usr/bin/env ruby
#encoding=utf-8
require 'find'
require 'json'
require 'fileutils'
class IndexCreator
    class Loader
        LoaderError = Class.new StandardError
        attr_reader :extnames
        def initialize(*extnames)
            @extnames = extnames
        end
        def transfer(src, dst)
            if @loader.nil?
                raise LoaderError.new "Loader is not initialized. @ #{src} -> #{dst}"
            else
                @loader.call(src, dst)
            end
        end
        def on_ext(*extnames)
            @extnames.concat(
                extnames
                .map(&:to_s)
                .map{|x|
                    x.start_with?('.') ? x : '.'+x
                })
        end
        def for_each(&block)
            @loader = block
        end
    end
    def initialize(loaders)
        @loader_dict = Hash.new
        loaders.each do |l|
            l.extnames.each do |e|
                raise Loader::LoaderError.new "Loader for #{e} overlapped." if @loader_dict.has_key? e
                @loader_dict[e] = l
            end
        end
    end
    def create_index(src, dst)
        dir_indices = {
            src => {
                :rpath => '',
                :dirs => [],
                :files => [],
            }
        }
        Find.find src do |f|
            rpath= f.sub(%r{^#{src}}, '')
            sdst = File.join dst, rpath
            ext  = File.extname f
            next if f == '.' or f == '..' or f == src
            if File.directory? f
                fn = sdst
                FileUtils.mkpath sdst
                bn = File.basename(sdst)
                if  bn == 'assert' || bn.start_with?('.')
                    FileUtils.copy_entry f, sdst
                    Find.prune
                else
                    FileUtils.mkpath File.join(sdst, 'assert')
                    dir_indices[File.dirname f][:dirs].push(
                        :title => File.basename(f, '.*'),
                        :path => rpath
                    )
                    dir_indices[f] = {:rpath => rpath, :files=>[], :dirs=>[]}
                end
            else
                prune if File.basename(f) == 'index.json'
                if @loader_dict.has_key?(ext) && !File.basename(sdst).start_with?('.')
                    fn = File.join File.dirname(sdst), File.basename(sdst, '.*')+'.html'
                    @loader_dict[ext].transfer f, fn
                else
                    fn = sdst
                    FileUtils.copy f, fn
                end
                dir_indices[File.dirname f][:files].push(
                    :title => File.basename(f, '.*'),
                    :path  => fn.sub(%r{^#{dst}}, '')
                )
            end
            puts "#{f} => #{fn}"
        end
        dir_indices.each_value do |data|
            File.write (File.join dst, data[:rpath], 'index.json'), data.to_json
        end
    end
    class << self
        def from_loaders_at(dir)
            self.new Dir[File.join dir, '*.rb'].map do |f|
                l = Loader.new
                l.instance_eval File.read f
                l
            end
        end
    end
end
