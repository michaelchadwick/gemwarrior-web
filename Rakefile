task :deploy do |t|
  sh "git push origin master"
  sh "rsync -auP --no-p --exclude-from='rsync-exclude.txt' . $GWWEB_REMOTE"
end

task :default => [:deploy]
