# If the directory, `dist`, doesn't exist, create `dist`
stat build || mkdir build
# Archive artifacts
# cd build
zip build/kid.zip -r build package.json config .platform .npmrc yarn.lock images node_modules package-lock.json