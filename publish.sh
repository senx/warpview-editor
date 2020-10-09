yarn version --new-version $1
(cd projects/warpview-editor-ng && yarn version --new-version $1 )
yarn clean
yarn build
mkdir -p dist/warpview-editor/base/browser/ui/codicons/codicon
cp node_modules/monaco-editor/dev/vs/base/browser/ui/codicons/codicon/codicon.ttf dist/warpview-editor/base/browser/ui/codicons/codicon/.
(cd dist/warpview-editor && yarn publish --new-version $1 )
