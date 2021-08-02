task :deploy

task :deploy do |t|
  sh "git push origin master"
  sh "rsync -aP --exclude-from='rsync-exclude.txt' . $GWWEB_REMOTE"
end

task :sass do |t|
  sh "sass assets/scss/screen.scss:assets/css/screen.css"
end

task :sassw do |t|
  sh "sass --watch assets/scss/screen.scss:assets/css/screen.css"
end

task :default => [:deploy]
