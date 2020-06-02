yarn version --new-version $1
(cd projects/warpview-editor-ng && yarn version --new-version $1 )
yarn clean
yarn build
(cd dist/warpview-editor && yarn publish --new-version $1 )
