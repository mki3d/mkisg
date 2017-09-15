# make Progressive Web App
cat \
    html/html-prefix.html \
    html/mkisg-head.html \
    html/body-html-suffix.html \
    > mkisg.html

# make Chrome App
cat \
    html/html-prefix.html \
    html/index-head.html \
    html/body-html-suffix.html \
    > index.html

