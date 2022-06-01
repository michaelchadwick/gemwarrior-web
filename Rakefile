task :deploy

task :deploy do |t|
  sh "git push origin master"
  sh "rsync -aP --exclude-from='rsync-exclude.txt' . $GWWEB_REMOTE"
end

task :sass do |t|
  sh "sass assets/scss/app.scss:assets/css/app.css"
end

task :sassw do |t|
  sh "sass --watch assets/scss/app.scss:assets/css/app.css"
end

task :default => [:sass, :deploy]
