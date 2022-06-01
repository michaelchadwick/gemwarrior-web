task :deploy

task :deploy do |t|
  sh "git push origin master"
  sh "rsync -aP --exclude-from='rsync-exclude.txt' . $GWWEB_REMOTE"
end

task :sass do |t|
  # dart sass
  sh "sass assets/scss:public/build/css"
end

task :sassw do |t|
  # dart sass
  sh "sass --watch assets/scss:public/build/css"
end

task :default => [:sass, :deploy]
