{
echo '{';
echo -n '"tokens":' ;
./ls-json.bash tokens ;
echo -n '"stages":' ;
./ls-json.bash stages ;
echo '}'
} > index.json
