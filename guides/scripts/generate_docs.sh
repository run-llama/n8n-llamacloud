mkdir -p guides/html/assets/
cp guides/assets/*.png guides/html/assets
for f in guides/*md
do
    sed 's/\.md/\.html/g' $f > guides/toremove.md
    filename=$(basename $f)
    name="${filename%.*}"
    output_path=guides/html/${name}.html
    markdown-to-html-cli --config="config.json" --source="guides/toremove.md" --output=${output_path}
    rm guides/toremove.md
done