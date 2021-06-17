task :deploy

task :deploy do |t|
  sh "git push origin master"
  sh "dandelion deploy"
end

task :sass do |t|
  sh "sass --watch assets/scss/screen.scss:assets/css/screen.css"
end

task :default => [:deploy]
